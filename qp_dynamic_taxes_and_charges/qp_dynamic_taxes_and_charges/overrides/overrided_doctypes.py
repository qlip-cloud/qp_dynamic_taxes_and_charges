from erpnext.accounts.doctype.sales_invoice.sales_invoice import SalesInvoice
from erpnext.selling.doctype.sales_order.sales_order import SalesOrder
from erpnext.stock.doctype.delivery_note.delivery_note import DeliveryNote
from erpnext.selling.doctype.quotation.quotation import Quotation
from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice
from erpnext.buying.doctype.purchase_order.purchase_order import PurchaseOrder
from erpnext.accounts.doctype.payment_entry.payment_entry import PaymentEntry
from erpnext.stock.doctype.purchase_receipt.purchase_receipt import PurchaseReceipt
from frappe.desk.doctype.workspace.workspace import Workspace
from frappe.model.naming import parse_naming_series
from frappe.utils import flt
import frappe 
import json

def calculate_taxes_and_totals_function(self):

	from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

	custom_calculate_taxes_and_totals(self)

	if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
		self.calculate_commission()
		self.calculate_contribution()

class CustomSalesInvoice(SalesInvoice):

	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)		
	
	def autoname(self):

		if frappe.db.get_single_value('Autoname File Config', "autoname"):
			name = self.naming_series + self.sequence
			parts = name.split('.')
			self.name = parse_naming_series(parts)

class CustomSalesOrder(SalesOrder):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)	

class CustomDeliveryNote(DeliveryNote):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)	

class CustomQuotation(Quotation):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)	

class CustomPurchaseInvoice(PurchaseInvoice):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)	

class CustomPurchaseOrder(PurchaseOrder):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)	

class CustomPaymentEntry(PaymentEntry):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)	

class CustomPurchaseReceipt(PurchaseReceipt):
	def calculate_taxes_and_totals(self):
		calculate_taxes_and_totals_function(self)

class CustomWorkspace(Workspace):

	def get_link_groups(self):
		cards = []
		current_card = {
			"label": "Link",
			"type": "Card Break",
			"icon": None,
			"hidden": False,
		}

		card_links = []

		for link in self.links:
			link = link.as_dict()
			
			if link.type == "Card Break":
				if card_links and (not current_card.only_for or current_card.only_for == frappe.get_system_settings('country')): 
					current_card['links'] = card_links
					cards.append(current_card)

				current_card = link
				card_links = []
			else:
				card_links.append(link)

		current_card['links'] = card_links
		
		if self.extends:
			if current_card['label'] == 'Link':
				current_card['label'] = self.cards_label if self.cards_label else 'Link'

		cards.append(current_card)

		return cards