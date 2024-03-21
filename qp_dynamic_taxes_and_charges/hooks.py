from . import __version__ as app_version

app_name = "qp_dynamic_taxes_and_charges"
app_title = "Qp Dynamic Taxes And Charges"
app_publisher = "Henderson Villegas"
app_description = "Dynamic Taxes and Charges"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "henderson037@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/qp_dynamic_taxes_and_charges/css/qp_dynamic_taxes_and_charges.css"
app_include_js = ["/assets/qp_dynamic_taxes_and_charges/js/controllers/add_taxes_from_item_tax_template_fun.js",
"/assets/qp_dynamic_taxes_and_charges/js/controllers/taxes_and_charges_fun.js",
"/assets/qp_dynamic_taxes_and_charges/js/controllers/get_tax_rate_fun.js",
"/assets/qp_dynamic_taxes_and_charges/js/controllers/load_item_tax_rate_fun.js",
"/assets/qp_dynamic_taxes_and_charges/js/controllers/taxes_and_totals_fun.js",
"/assets/qp_dynamic_taxes_and_charges/js/controllers/transaction_fun.js"]

# include js, css files in header of web template
# web_include_css = "/assets/qp_dynamic_taxes_and_charges/css/qp_dynamic_taxes_and_charges.css"
# web_include_js = "/assets/qp_dynamic_taxes_and_charges/js/qp_dynamic_taxes_and_charges.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "qp_dynamic_taxes_and_charges/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "qp_dynamic_taxes_and_charges.install.before_install"
# after_install = "qp_dynamic_taxes_and_charges.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "qp_dynamic_taxes_and_charges.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"Sales Invoice": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomSalesInvoice",
	"Sales Order": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomSalesOrder",
	#"Purchase Order": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomPurchaseOrder",
	#"Purchase Invoice": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomPurchaseInvoice",
	"Delivery Note": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomDeliveryNote",
	"Quotation": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomQuotation",
	"Payment Entry": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomPaymentEntry",
	#"Purchase Receipt": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomPurchaseReceipt",
    "Workspace": "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.overrides.overrided_doctypes.CustomWorkspace",
}

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"qp_dynamic_taxes_and_charges.tasks.all"
# 	],
# 	"daily": [
# 		"qp_dynamic_taxes_and_charges.tasks.daily"
# 	],
# 	"hourly": [
# 		"qp_dynamic_taxes_and_charges.tasks.hourly"
# 	],
# 	"weekly": [
# 		"qp_dynamic_taxes_and_charges.tasks.weekly"
# 	]
# 	"monthly": [
# 		"qp_dynamic_taxes_and_charges.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "qp_dynamic_taxes_and_charges.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "qp_dynamic_taxes_and_charges.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "qp_dynamic_taxes_and_charges.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"qp_dynamic_taxes_and_charges.auth.validate"
# ]

