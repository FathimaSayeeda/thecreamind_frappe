# Copyright (c) 2021, Fahim and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import flt
from frappe.model.document import Document


class CautionDepositEntry(Document):
    def validate(self):
        amount = flt(self.amount)
        if self.type == "Add":
            amount = abs(amount)
        elif self.type in ("Deduct", "Refund"):
            amount = -abs(amount)

        self.amount = amount

    def on_submit(self):
        self.update_caution_deposit_entry()

    def on_cancel(self):
        self.update_caution_deposit_entry()

    def update_caution_deposit_entry(self):
        balance = frappe.db.sql("""
        SELECT
            SUM(amount)
        FROM
            `tabCaution Deposit Entry`
        WHERE
            kid = %(kid)s
            AND docstatus = 1
        """, {"kid": self.kid})[0][0]

        frappe.db.set_value(
            "Crea Mind Kid",
            self.kid,
            "caution_deposit_balance",
            flt(balance, 2),
        )
