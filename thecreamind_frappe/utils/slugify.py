from slugify import UniqueSlugify
import frappe

from frappe.model.document import Document


def slugify_text(doctype: str, slug_docfield: str, docfield: str, txt: str,
                 doc: Document = None) -> str:
    """
    Pass the doctype and docfield to check so we can make sure unique slug
    is generated..
    """
    filters = [[doctype, docfield, '=', txt]]
    uuids = [uuid.get(slug_docfield) for uuid in
             frappe.get_all(doctype, slug_docfield,
                            filters)]
    if doc and isinstance(doc, Document):
        if not doc.is_new() and doc.get(slug_docfield):
            uuids = list(
                filter(lambda uuid: uuid != doc.get(slug_docfield), uuids))
    custom_slugify = UniqueSlugify(uids=uuids, to_lower=True)
    return custom_slugify(txt)
