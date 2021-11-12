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

		frappe.db.get_doc("Crea Mind Settings").then(r => {
			thecreamind.settings = r;
		})
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

	show_plan_confirmation_dialog(frm, args) {
		const plan = thecreamind.selected_plan;
		console.log("ARGSS", thecreamind.selected_plan)
		const endDate = frappe.datetime.add_days(plan.start_date, plan.plan_duration);
		const d = new frappe.ui.Dialog({
			title: 'Approve Registration Request',
			fields: [
				// Summary
				{ fieldname: "membership_plan", label: "Membership Plan", fieldtype: "Link", options: "Membership Plan", read_only: 1, default: plan.name },
				{ fieldname: "start_date", label: "Start Date", fieldtype: "Date", read_only: 1, default: plan.start_date },
				{ fieldname: "plan_duration", label: "Plan Duration", fieldtype: "Data", read_only: 1, default: plan.plan_duration + " Days"},

				{ fieldname: "cb_1", label: "", fieldtype: "Column Break" },
				{ fieldname: "has_library_access", label: "Has Library Access", fieldtype: "Check", read_only: 1, default: plan.has_library_access },
				{ fieldname: "has_activity_access", label: "Has Activity Access", fieldtype: "Check", read_only: 1, default: plan.has_activity_access },
				{ fieldname: "plan_amount", label: "Plan Amount", fieldtype: "Currency", read_only: 1, default: plan.amount },
				
				// To Fill
				{ fieldname: "sb_1", label: "Please fill the following", fieldtype: "Section Break" },
				{ fieldname: "end_date", label: "End Date", fieldtype: "Date", reqd: 1, default: endDate },
				{ fieldname: "caution_deposit", label: "Caution Deposit", fieldtype: "Currency", reqd: 1 },
				{ fieldname: "membership_fee", label: "Membership Fee", fieldtype: "Currency", reqd: 1, fetch_from: "membership_plan.amount", default: plan.amount },
			]
		});
		d.show();
	}
});
