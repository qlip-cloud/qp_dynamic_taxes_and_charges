import json
import frappe
from frappe.utils import flt
from erpnext.controllers.taxes_and_totals import calculate_taxes_and_totals

class custom_calculate_taxes_and_totals(calculate_taxes_and_totals):

    def _get_tax_rate(self, tax, item_tax_map):

        impuesto_individual = frappe.db.get_single_value('Dynamic Taxes Config', "impuesto_individual")

        if tax.account_head in item_tax_map:
            return flt(item_tax_map.get(tax.account_head), self.doc.precision("rate", tax))
        else:
            if impuesto_individual:
                return 0
            else:
                return tax.rate

    def _load_item_tax_rate(self, item_tax_rate):

        cruzar_impuestos = frappe.db.get_single_value('Dynamic Taxes Config', "cruzar_impuestos")

        if cruzar_impuestos:
            if item_tax_rate:
                return_item_tax_rate = json.loads(item_tax_rate)
                return_item_tax_rate_copy = return_item_tax_rate.copy()

                for tax, rate in return_item_tax_rate_copy.items():
                    if not any((t.account_head == tax and t.rate == rate) for t in self.doc.get("taxes")):
                        del return_item_tax_rate[tax]

            else:
                return_item_tax_rate = {}
            
        else:
            return_item_tax_rate = json.loads(item_tax_rate) if item_tax_rate else {}
        
        print(return_item_tax_rate)
        return return_item_tax_rate