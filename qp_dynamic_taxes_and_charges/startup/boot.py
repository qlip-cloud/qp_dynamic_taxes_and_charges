import frappe
from frappe.utils import cint

def qp_boot_session(bootinfo):
    """Get Settings"""
    print("------------qp_boot_session------------------")

    if frappe.session['user']!='Guest':

        bootinfo.cruzar_impuestos = cint(frappe.db.get_single_value('Dynamic Taxes Config',
            'cruzar_impuestos'))
        bootinfo.impuesto_individual = cint(frappe.db.get_single_value('Dynamic Taxes Config',
            'impuesto_individual'))
        
        bootinfo.cruce_de_impuestos_en_compras = cint(frappe.db.get_single_value('Dynamic Taxes Config',
            'cruce_de_impuestos_en_compras'))
