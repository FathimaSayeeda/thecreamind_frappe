# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in thecreamind_frappe/__init__.py
from thecreamind_frappe import __version__ as version

setup(
	name='thecreamind_frappe',
	version=version,
	description='Frappe app for thecreamind.com',
	author='Fahim',
	author_email='faztp12@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
