import frappe
import ast

@frappe.whitelist()
def check_itemtax_exist(tax_list, tax_type, tax_rate):

    exist = False

    for tax_template in ast.literal_eval(tax_list):
        if(frappe.db.exists("Item Tax Template Detail", {"parent":tax_template, "tax_type":tax_type, "tax_rate":tax_rate})):
            exist = True
            break
        
    return {"exist": exist}

@frappe.whitelist()
def check_tabletax_exist(doctype, parent, tax_type, tax_rate):

    exist = False
    
    if parent:

        tax_template_table = None

        for field in frappe.get_meta(doctype).fields:
            if field.fieldname == 'taxes':
                tax_template_table = field.options

        exist = frappe.db.exists(tax_template_table, {"parent": parent, "account_head":tax_type, "rate":tax_rate})

    return {"exist": True if exist else False}