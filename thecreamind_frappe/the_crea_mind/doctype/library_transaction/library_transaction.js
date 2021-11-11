// Copyright (c) 2021, Fahim and contributors
// For license information, please see license.txt

frappe.ui.form.on('Library Transaction', {
	refresh: function (frm) {
		frm.set_value('date_time', frappe.datetime.now_datetime());
	}
});
