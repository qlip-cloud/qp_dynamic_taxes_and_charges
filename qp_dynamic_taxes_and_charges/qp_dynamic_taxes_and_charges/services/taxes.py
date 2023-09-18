from operator import itemgetter
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
def check_tabletax_exist(doctype, tax_type, tax_rate, parent = None):

    exist = False
    
    tax_template_table = None

    for field in frappe.get_meta(doctype).fields:
        if field.fieldname == 'taxes':
            tax_template_table = field.options

    if parent:
        exist = frappe.db.exists(tax_template_table, {"parent": parent, "account_head":tax_type, "rate":tax_rate})
        
    item_tax_list = frappe.db.get_values(tax_template_table, {"parent": parent}, ['account_head', 'charge_type', 'row_id', 'idx'], as_dict=1)
    
    if item_tax_list:
        item_tax_list = sorted(item_tax_list, key= lambda i:i['idx'])

    return {
        "exist": True if exist else False,
        "item_tax_list": item_tax_list
    }

@frappe.whitelist()
def get_taxes_config(field):

    return frappe.db.get_single_value('Dynamic Taxes Config', field)