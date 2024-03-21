erpnext.TransactionController = erpnext.TransactionController.extend({
    setup: function() {
		this._super();
		let me = this;
		frappe.flags.hide_serial_batch_dialog = true;
		frappe.ui.form.on(this.frm.doctype + " Item", "rate", function(frm, cdt, cdn) {
			var item = frappe.get_doc(cdt, cdn);
			var has_margin_field = frappe.meta.has_field(cdt, 'margin_type');

			frappe.model.round_floats_in(item, ["rate", "price_list_rate"]);

			if(item.price_list_rate) {
				if(item.rate > item.price_list_rate && has_margin_field) {
					// if rate is greater than price_list_rate, set margin
					// or set discount
					item.discount_percentage = 0;
					item.margin_type = 'Amount';
					item.margin_rate_or_amount = flt(item.rate - item.price_list_rate,
						precision("margin_rate_or_amount", item));
					item.rate_with_margin = item.rate;
				} else {
					item.discount_percentage = flt((1 - item.rate / item.price_list_rate) * 100.0,
						precision("discount_percentage", item));
					item.discount_amount = flt(item.price_list_rate) - flt(item.rate);
					item.margin_type = '';
					item.margin_rate_or_amount = 0;
					item.rate_with_margin = 0;
				}
			} else {
				item.discount_percentage = 0.0;
				item.margin_type = '';
				item.margin_rate_or_amount = 0;
				item.rate_with_margin = 0;
			}
			item.base_rate_with_margin = item.rate_with_margin * flt(frm.doc.conversion_rate);

			cur_frm.cscript.set_gross_profit(item);
			cur_frm.cscript.calculate_taxes_and_totals();
			cur_frm.cscript.calculate_stock_uom_rate(frm, cdt, cdn);
		});

		frappe.ui.form.on(this.frm.cscript.tax_table, "rate", function(frm, cdt, cdn) {
			cur_frm.cscript.calculate_taxes_and_totals();
		});

		frappe.ui.form.on(this.frm.cscript.tax_table, "base", function(frm, cdt, cdn) {
			// Get global array
			let item = locals[cdt][cdn];
			console.log("transaction_fun item.rate" + item.rate);
			if (item.rate != 0 && item.rate !== undefined) {
				console.log("Into");
				let calculate_tax = flt((item.base * 100.0) / item.rate);
				item.tax_amount = calculate_tax;
				refresh_field("taxes");
				cur_frm.cscript.calculate_taxes_and_totals();
			} else {
				//var msg = __("Tax rate is 0")
				item.base = 0;
				refresh_field("taxes");
				//frappe.throw(msg);
			}
		});

		frappe.ui.form.on(this.frm.cscript.tax_table, "tax_amount", function(frm, cdt, cdn) {
			cur_frm.cscript.calculate_taxes_and_totals();
		});

		frappe.ui.form.on(this.frm.cscript.tax_table, "row_id", function(frm, cdt, cdn) {
			cur_frm.cscript.calculate_taxes_and_totals();
		});

		frappe.ui.form.on(this.frm.cscript.tax_table, "included_in_print_rate", function(frm, cdt, cdn) {
			cur_frm.cscript.set_dynamic_labels();
			cur_frm.cscript.calculate_taxes_and_totals();
		});

		frappe.ui.form.on(this.frm.doctype, "apply_discount_on", function(frm) {
			if(frm.doc.additional_discount_percentage) {
				frm.trigger("additional_discount_percentage");
			} else {
				cur_frm.cscript.calculate_taxes_and_totals();
			}
		});

		frappe.ui.form.on(this.frm.doctype, "additional_discount_percentage", function(frm) {
			if(!frm.doc.apply_discount_on) {
				frappe.msgprint(__("Please set 'Apply Additional Discount On'"));
				return;
			}

			frm.via_discount_percentage = true;

			if(frm.doc.additional_discount_percentage && frm.doc.discount_amount) {
				// Reset discount amount and net / grand total
				frm.doc.discount_amount = 0;
				frm.cscript.calculate_taxes_and_totals();
			}

			var total = flt(frm.doc[frappe.model.scrub(frm.doc.apply_discount_on)]);
			var discount_amount = flt(total*flt(frm.doc.additional_discount_percentage) / 100,
				precision("discount_amount"));

			frm.set_value("discount_amount", discount_amount)
				.then(() => delete frm.via_discount_percentage);
		});

		frappe.ui.form.on(this.frm.doctype, "discount_amount", function(frm) {
			frm.cscript.set_dynamic_labels();

			if (!frm.via_discount_percentage) {
				frm.doc.additional_discount_percentage = 0;
			}

			frm.cscript.calculate_taxes_and_totals();
		});

		frappe.ui.form.on(this.frm.doctype + " Item", {
			items_add: function(frm, cdt, cdn) {
				var item = frappe.get_doc(cdt, cdn);
				if (!item.warehouse && frm.doc.set_warehouse) {
					item.warehouse = frm.doc.set_warehouse;
				}

				if (!item.target_warehouse && frm.doc.set_target_warehouse) {
					item.target_warehouse = frm.doc.set_target_warehouse;
				}

				if (!item.from_warehouse && frm.doc.set_from_warehouse) {
					item.from_warehouse = frm.doc.set_from_warehouse;
				}

				erpnext.accounts.dimensions.copy_dimension_from_first_row(frm, cdt, cdn, 'items');
			}
		});

		if(this.frm.fields_dict["items"].grid.get_field('batch_no')) {
			this.frm.set_query("batch_no", "items", function(doc, cdt, cdn) {
				return me.set_query_for_batch(doc, cdt, cdn);
			});
		}

		if(
			this.frm.docstatus < 2
			&& this.frm.fields_dict["payment_terms_template"]
			&& this.frm.fields_dict["payment_schedule"]
			&& this.frm.doc.payment_terms_template
			&& !this.frm.doc.payment_schedule.length
		){
			this.frm.trigger("payment_terms_template");
		}

		if(this.frm.fields_dict["taxes"]) {
			this["taxes_remove"] = this.calculate_taxes_and_totals;
		}

		if(this.frm.fields_dict["items"]) {
			this["items_remove"] = this.calculate_net_weight;
		}

		if(this.frm.fields_dict["recurring_print_format"]) {
			this.frm.set_query("recurring_print_format", function(doc) {
				return{
					filters: [
						['Print Format', 'doc_type', '=', cur_frm.doctype],
					]
				};
			});
		}

		if(this.frm.fields_dict["return_against"]) {
			this.frm.set_query("return_against", function(doc) {
				var filters = {
					"docstatus": 1,
					"is_return": 0,
					"company": doc.company
				};
				if (me.frm.fields_dict["customer"] && doc.customer) filters["customer"] = doc.customer;
				if (me.frm.fields_dict["supplier"] && doc.supplier) filters["supplier"] = doc.supplier;

				return {
					filters: filters
				};
			});
		}

		if (this.frm.fields_dict["items"].grid.get_field("expense_account")) {
			this.frm.set_query("expense_account", "items", function(doc) {
				return {
					filters: {
						"company": doc.company
					}
				};
			});
		}

		if(frappe.meta.get_docfield(this.frm.doc.doctype, "pricing_rules")) {
			this.frm.set_indicator_formatter('pricing_rule', function(doc) {
				return (doc.rule_applied) ? "green" : "red";
			});
		}

		let batch_no_field = this.frm.get_docfield("items", "batch_no");
		if (batch_no_field) {
			batch_no_field.get_route_options_for_new_doc = function(row) {
				return {
					"item": row.doc.item_code
				}
			};
		}

		if (this.frm.fields_dict["items"].grid.get_field('blanket_order')) {
			this.frm.set_query("blanket_order", "items", function(doc, cdt, cdn) {
				var item = locals[cdt][cdn];
				return {
					query: "erpnext.controllers.queries.get_blanket_orders",
					filters: {
						"company": doc.company,
						"blanket_order_type": doc.doctype === "Sales Order" ? "Selling" : "Purchasing",
						"item": item.item_code
					}
				}
			});
		}

		if (this.frm.fields_dict.taxes_and_charges) {
			this.frm.set_query("taxes_and_charges", function() {
				return {
					filters: [
						['company', '=', me.frm.doc.company],
						['docstatus', '!=', 2]
					]
				};
			});
		}

	}
})