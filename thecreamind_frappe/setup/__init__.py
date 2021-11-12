import frappe
from frappe.utils import update_progress_bar


def after_migrate():
    creamind_workspace = "TheCreaMind"
    to_delete = frappe.get_all("Workspace", {"name": ["!=", creamind_workspace]})
    for i, w in enumerate(to_delete):
        frappe.delete_doc("Workspace", w.name)
        update_progress_bar("Deleting Unused Workspaces", i, len(to_delete))
