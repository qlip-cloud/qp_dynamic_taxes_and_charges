from erpnext.accounts.doctype.sales_invoice.sales_invoice import SalesInvoice
from erpnext.selling.doctype.sales_order.sales_order import SalesOrder
from erpnext.stock.doctype.delivery_note.delivery_note import DeliveryNote
from erpnext.selling.doctype.quotation.quotation import Quotation
from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice
from erpnext.buying.doctype.purchase_order.purchase_order import PurchaseOrder
from erpnext.accounts.doctype.payment_entry.payment_entry import PaymentEntry

class CustomSalesInvoice(SalesInvoice):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()
	
class CustomSalesOrder(SalesOrder):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()

class CustomDeliveryNote(DeliveryNote):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()

class CustomQuotation(Quotation):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()

class CustomPurchaseInvoice(PurchaseInvoice):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()

class CustomPurchaseOrder(PurchaseOrder):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()

class CustomPaymentEntry(PaymentEntry):
	def calculate_taxes_and_totals(self):

		from .custom_calculate_taxes_and_totals import custom_calculate_taxes_and_totals

		custom_calculate_taxes_and_totals(self)

		if self.doctype in ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"]:
			self.calculate_commission()
			self.calculate_contribution()
