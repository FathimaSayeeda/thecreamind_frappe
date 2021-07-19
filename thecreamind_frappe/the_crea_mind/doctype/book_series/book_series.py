# -*- coding: utf-8 -*-
# Copyright (c) 2021, Fahim and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
# import frappe
from frappe.model.document import Document
from thecreamind_frappe.utils import slugify_text


class BookSeries(Document):
    def validate(self):
        self.validate_slug()

    def validate_slug(self):
        self.set('slug', slugify_text(self.doctype, 'slug', 'title',
                                      self.title, self))
