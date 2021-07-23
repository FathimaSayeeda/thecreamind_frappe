import frappe
from graphql import GraphQLResolveInfo


def get_doc_by_slug_resolver(obj, info: GraphQLResolveInfo, **kwargs):
    doctype = kwargs.get("doctype")
    slug = kwargs.get("slug")

    if not frappe.has_permission(doctype):
        raise frappe.PermissionError()

    docname = frappe.db.get_value(doctype, {"slug": slug})
    if docname:
        return frappe._dict(
            doctype=doctype,
            name=docname
        )

    return None
