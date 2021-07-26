import os
import frappe
from thecreamind_frappe.utils.images import (
    convert_to_progressive_jpg,
    is_image_file
)


def optimize_image(doc, method=None):
    frappe.enqueue(
        _optimize_image,
        enqueue_after_commit=True,
        file_doc=doc.name
    )


def _optimize_image(file_doc: str):
    doc = frappe.get_doc("File", file_doc)

    file_url = doc.file_url
    if file_url.startswith("/private"):
        file_path = frappe.get_site_path(*(file_url.lstrip("/"), ))
    elif file_url.startswith("/files"):
        file_path = frappe.get_site_path(*("public", file_url.lstrip("/")))
    else:
        # Not a file
        return

    try:
        if not is_image_file(file_path=file_path):
            return

        img = convert_to_progressive_jpg(file_path=file_path)
        rel_path = os.path.relpath(img.file_path, frappe.get_site_path())
        file_url = "/" + rel_path if doc.is_private else rel_path.lstrip("public")

        frappe.db.set_value(
            "File", doc.name, frappe._dict(
                file_name=img.file_name, file_url=file_url,
                content_hash=img.content_hash, file_size=img.file_size,
            ),
            val=None, update_modified=False
        )

    except BaseException:
        frappe.log_error(
            title="Image Optimization Failed",
            message=f"""
File Name: {doc.file_name}
IsPrivate: {doc.is_private}
FileURL: {doc.file_url}
FileSize: {doc.file_size}
Content Hash: {doc.content_hash}

Traceback:
{frappe.get_traceback()}
            """
        )
