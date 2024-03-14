import json
import frappe
from frappe.utils import flt, cint
from erpnext.controllers.taxes_and_totals import calculate_taxes_and_totals

class custom_calculate_taxes_and_totals(calculate_taxes_and_totals):

    def _get_tax_rate(self, tax, item_tax_map):

        impuesto_individual = frappe.db.get_single_value('Dynamic Taxes Config', "impuesto_individual")
        all_doctypes = frappe.db.get_single_value('Dynamic Taxes Config', "todos_los_doctypes")
        
        flag = impuesto_individual and (all_doctypes or not self.__class__.__name__ in ['PurchaseOrder', 'PurchaseInvoice', 'PurchaseReceipt'])

        if tax.account_head in item_tax_map:
            if flag:
                if tax.charge_type in ['On Previous Row Amount', 'Previous Row Total'] and not item_tax_map.get(self.doc.get("taxes")[cint(tax.row_id) - 1].account_head):
                    if tax.charge_type == 'Previous Row Total':
                        self.doc.get("taxes")[cint(tax.row_id) - 1].grand_total_for_current_item = self.doc.get("taxes")[cint(tax.row_id) - 1].tax_amount
                    if tax.charge_type == 'On Previous Row Amount':
                         self.doc.get("taxes")[cint(tax.row_id) - 1].tax_amount_for_current_item = self.doc.get("taxes")[cint(tax.row_id) - 1].tax_amount

            return flt(item_tax_map.get(tax.account_head), self.doc.precision("rate", tax))
        else:
            if flag:
                if tax.charge_type in ['On Previous Row Amount', 'Previous Row Total'] and not item_tax_map.get(self.doc.get("taxes")[cint(tax.row_id) - 1].account_head):
                    if tax.charge_type == 'Previous Row Total':
                         self.doc.get("taxes")[cint(tax.row_id) - 1].grand_total_for_current_item = self.doc.get("taxes")[cint(tax.row_id) - 1].tax_amount
                    if tax.charge_type == 'On Previous Row Amount':
                         self.doc.get("taxes")[cint(tax.row_id) - 1].tax_amount_for_current_item = self.doc.get("taxes")[cint(tax.row_id) - 1].tax_amount

                return 0
            else:
                return tax.rate

    def _load_item_tax_rate(self, item_tax_rate):

        cruzar_impuestos = frappe.db.get_single_value('Dynamic Taxes Config', "cruzar_impuestos")
        all_doctypes = frappe.db.get_single_value('Dynamic Taxes Config', "todos_los_doctypes")
        
        flag = cruzar_impuestos and (all_doctypes or not self.__class__.__name__ in ['PurchaseOrder', 'PurchaseInvoice', 'PurchaseReceipt'])

        if flag:
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
        
        return return_item_tax_rate