// Copyright (c) 2021, Fahim and contributors
// For license information, please see license.txt

frappe.provide("thecreamind")

frappe.ui.form.on('Registration Request', {
	refresh(frm) {
		frm.disable_save();
		if (frm.doc.status !== "Pending") {
			return;
		}

		// Approve Button
		frm.add_custom_button('Approve', () => {
			frm.trigger("show_plan_selection_dialog")
		}, 'Update');

		// Decline Button
		frm.add_custom_button('Decline', () => {
			frappe.confirm("Are you sure you want to Decline ?", () => {
				frm.set_value('status', 'Declined');
				frm.save();
			})
		}, 'Update');


	},

	show_plan_selection_dialog(frm) {
		const d = new frappe.ui.Dialog({
			title: "Please select Membership Plan",
			fields: [
				{ fieldname: "start_date", label: "Start Date", fieldtype: "Date", reqd: 1, default: frappe.datetime.get_today() },
				{ fieldname: "membership_plan", label: "Membership Plan", fieldtype: "Link", options: "Membership Plan", reqd: 1 },
			],
			primary_action_label: "Next",
			primary_action(values) {
				if (!values.membership_plan) {
					return;
				}
				frappe.dom.freeze()
				frappe.db.get_value(
					"Membership Plan",
					values.membership_plan,
					["*"],
					(r) => {
						frappe.dom.unfreeze();
						thecreamind.selected_plan = {
							...r,
							name: values.membership_plan,
							start_date: values.start_date,
						};
						frm.trigger("show_plan_confirmation_dialog")
						d.hide();
					})
			}
		})
		d.show();
	},

	async show_plan_confirmation_dialog(frm, args) {
		const plan = thecreamind.selected_plan;

		const caution_deposit = await thecreamind.calculate_caution_deposit(plan.has_activity_access, plan.has_library_access);
		const endDate = frappe.datetime.add_days(plan.start_date, plan.plan_duration);
		const d = new frappe.ui.Dialog({
			title: 'Approve Registration Request',
			fields: [
				// Summary
				{ fieldname: "membership_plan", label: "Membership Plan", fieldtype: "Link", options: "Membership Plan", read_only: 1, default: plan.name },
				{ fieldname: "start_date", label: "Start Date", fieldtype: "Date", read_only: 1, default: plan.start_date },
				{ fieldname: "plan_duration", label: "Plan Duration", fieldtype: "Data", read_only: 1, default: plan.plan_duration + " Days" },

				{ fieldname: "cb_1", label: "", fieldtype: "Column Break" },
				{ fieldname: "has_library_access", label: "Has Library Access", fieldtype: "Check", read_only: 1, default: plan.has_library_access },
				{ fieldname: "has_activity_access", label: "Has Activity Access", fieldtype: "Check", read_only: 1, default: plan.has_activity_access },
				{ fieldname: "plan_amount", label: "Plan Amount", fieldtype: "Currency", read_only: 1, default: plan.amount },

				// To Fill
				{ fieldname: "sb_1", label: "Please fill the following", fieldtype: "Section Break" },
				{ fieldname: "end_date", label: "End Date", fieldtype: "Date", reqd: 1, default: endDate },
				{ fieldname: "caution_deposit_collected", label: "Caution Deposit Collected", fieldtype: "Currency", reqd: 1, default: caution_deposit },
				{ fieldname: "membership_amount", label: "Membership Amt Collected", fieldtype: "Currency", reqd: 1, fetch_from: "membership_plan.amount", default: plan.amount },
			],
			primary_action_label: "Approve",
			primary_action(values) {
				frm.call("approve_membership", {
					...values
				}).then((r) => {
					if (r.exc) {
						frappe.msgprint("Something went wrong");
						console.error(r);
					} else if (r.message.status === "SUCCESS") {
						const { status, kid, kid_membership } = r.message;
						frappe.msgprint(`
						Registration Successful!
						<hr/>
						Crea Mind Kid: <a href="/app/crea-mind-kid/${kid}">${kid}</a><br/>
						Kid Membership: <a href="/app/kid-membership/${kid_membership}">${kid_membership}</a>
						`);

						d.hide();
						frm.reload_doc();
						console.log(r.message);
					}
				})
			}
		});
		d.show();
	}
});


// TODO: Move to general file
thecreamind.calculate_caution_deposit = async (has_activity_access, has_library_access) => {
	await thecreamind.load_settings();
	if (has_library_access) {
		return thecreamind.settings.library_caution_deposit;
	}
	if (has_activity_access) {
		return thecreamind.settings.activity_caution_deposit;
	}
}

thecreamind.load_settings = () => new Promise(res => {
	if (thecreamind.settings) {
		res(thecreamind.settings);
	} else {
		frappe.db.get_doc("Crea Mind Settings").then(r => {
			thecreamind.settings = r;
			res(r);
		})
	}
})