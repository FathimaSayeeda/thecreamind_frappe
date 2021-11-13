# Copyright (c) 2021, Fahim and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RegistrationRequest(Document):

    @frappe.whitelist()
    def approve_membership(self, args):
        kid = self.as_dict()
        kid.update(dict(
            doctype="Crea Mind Kid",
            name=None, __islocal=True,
        ))
        kid = frappe.get_doc(kid)
        kid.insert(ignore_permissions=True)

        membership = frappe.get_doc(dict(
            doctype="Kid Membership",
            kid=kid.name, membership_plan=args.get("membership_plan"),
            caution_deposit_collected=args.get("caution_deposit_collected"),
            membership_amount=args.get("membership_amount"),

            start_date=args.get("start_date"), end_date=args.get("end_date"),
        )).insert(ignore_permissions=True)

        caution_deposit = frappe.get_doc(dict(
            doctype="Caution Deposit Entry",
            kid=kid.name, type="Add",
            ref_doctype="Kid Membership", ref_docname=membership.name,
            amount=args.get("caution_deposit_collected"), docstatus=1,
        )).insert(ignore_permissions=True)

        self.kid = kid.name
        self.status = "Approved"
        self.save(ignore_permissions=True)

        return dict(
            status="SUCCESS",
            kid=kid.name,
            kid_membership=membership.name,
            caution_deposit=caution_deposit.name,
        )
