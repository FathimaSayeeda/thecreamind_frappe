import os
import hashlib
from PIL import Image

import frappe


def convert_to_progressive_jpg(file_path):
    img = Image.open(file_path)

    MAX_HEIGHT = 1000
    if img.height > MAX_HEIGHT:
        # Let's resize to MAX_HEIGHT
        h_percent = MAX_HEIGHT / float(img.height)
        new_width = int(h_percent * img.width)
        img = img.resize((new_width, MAX_HEIGHT), Image.LANCZOS)

    # Lets save as jpg
    # Override the existing format
    file_name = os.path.basename(file_path)
    directory = os.path.dirname(file_path)

    i = 0
    # Let's find a non-conflicting file name for our new jpg
    while True:
        new_file_name = file_name.rsplit(".")[0]
        if i > 0:
            new_file_name += f"-{i}"

        new_file_name += ".jpg"
        new_file_path = os.path.join(directory, new_file_name)
        if not os.path.exists(new_file_path) or os.path.samefile(new_file_path, file_path):
            break
        i += 1

    img.save(new_file_path, "JPEG", quality=90, optimize=True, progressive=True)
    content_hash = hashlib.md5(img.tobytes()).hexdigest()

    if not os.path.samefile(new_file_path, file_path):
        # Delete old file
        os.remove(file_path)

    return frappe._dict(
        file_name=new_file_name,
        file_path=new_file_path,
        content_hash=content_hash,
        file_size=os.stat(new_file_path).st_size
    )


def is_image_file(file_path):
    try:
        im = Image.open(file_path)
        im.verify()
        im.close()
        return True
        # do stuff
    except BaseException:
        return False
