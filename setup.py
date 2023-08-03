from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in qp_dynamic_taxes_and_charges/__init__.py
from qp_dynamic_taxes_and_charges import __version__ as version

setup(
	name='qp_dynamic_taxes_and_charges',
	version=version,
	description='Dynamic Taxes and Charges',
	author='Henderson Villegas',
	author_email='henderson037@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
