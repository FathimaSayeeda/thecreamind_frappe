# -*- coding: utf-8 -*-
# Copyright (c) 2021, Fahim and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
# import frappe
from frappe.model.document import Document
from frappe.utils import cint


class Book(Document):
    def validate(self):
        self.validate_media()

    def validate_media(self):
        if not len(self.get("media") or []):
            return

        if any(cint(x.get("default")) for x in self.get("media")):
            return

        sorted_media = sorted(
            [x for x in self.get("media") if not cint(x.get("disabled"))],
            key=lambda a: 0 if a.get('type') == "Image" else 1)

        if len(sorted_media):
            sorted_media[0].default = 1
