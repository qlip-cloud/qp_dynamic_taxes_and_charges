import frappe

@frappe.whitelist()
def check_itemtax_exist(parent, tax_type, tax_rate):

    exist = frappe.db.exists("Item Tax Template Detail", {"parent": parent, "tax_type":tax_type, "tax_rate":tax_rate})
        
    return {"exist": True if exist else False}

@frappe.whitelist()
def check_tabletax_exist(doctype, parent, tax_type, tax_rate):

    tax_template_table = None

    for field in frappe.get_meta(doctype).fields:
        if field.fieldname == 'taxes':
            tax_template_table = field.options

    if parent:
        exist = frappe.db.exists(tax_template_table, {"parent": parent, "account_head":tax_type, "rate":tax_rate})
    else:
        exist = frappe.db.exists(tax_template_table, {"account_head":tax_type, "rate":tax_rate})

    return {"exist": True if exist else False}