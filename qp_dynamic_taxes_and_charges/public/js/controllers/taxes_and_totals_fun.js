// Sobreescribiendo funcion de controlador
// Refactoriza taxes_and_total -> calculate_taxes
erpnext.taxes_and_totals.prototype.calculate_taxes = function() {
    var me = this;
    this.frm.doc.rounding_adjustment = 0;
    var actual_tax_dict = {};

    // maintain actual tax rate based on idx
    $.each(this.frm.doc["taxes"] || [], function(i, tax) {
        if (tax.charge_type == "Actual") {
            actual_tax_dict[tax.idx] = flt(tax.tax_amount, precision("tax_amount", tax));
        }
    });

    $.each(this.frm.doc["items"] || [], function(n, item) {
        var item_tax_map = me._load_item_tax_rate(item.item_tax_rate);
        $.each(me.frm.doc["taxes"] || [], function(i, tax) {
            console.log("taxes_and_totals tax.rate: " + tax.rate);
            if (tax.charge_type == "Actual") {
                if (tax.rate != 0 && tax.rate !== undefined){
                        console.log("Into taxes");
                        tax.base = flt((tax.tax_amount * tax.rate) / 100.0);
                } else {
                    tax.base = 0;
                }
            }

            // tax_amount represents the amount of tax for the current step
            var current_tax_amount = me.get_current_tax_amount(item, tax, item_tax_map);

        
            // Adjust divisional loss to the last item
            if (tax.charge_type == "Actual") {
                actual_tax_dict[tax.idx] -= current_tax_amount;
                if (n == me.frm.doc["items"].length - 1) {
                    current_tax_amount += actual_tax_dict[tax.idx];
                }
            }

            // accumulate tax amount into tax.tax_amount
            if (tax.charge_type != "Actual" &&
                !(me.discount_amount_applied && me.frm.doc.apply_discount_on=="Grand Total")) {
                tax.tax_amount += current_tax_amount;
            }

            // store tax_amount for current item as it will be used for
            // charge type = 'On Previous Row Amount'
            tax.tax_amount_for_current_item = current_tax_amount;

            // tax amount after discount amount
            tax.tax_amount_after_discount_amount += current_tax_amount;

            // for buying
            if(tax.category) {
                // if just for valuation, do not add the tax amount in total
                // hence, setting it as 0 for further steps
                current_tax_amount = (tax.category == "Valuation") ? 0.0 : current_tax_amount;

                current_tax_amount *= (tax.add_deduct_tax == "Deduct") ? -1.0 : 1.0;
            }

            // note: grand_total_for_current_item contains the contribution of
            // item's amount, previously applied tax and the current tax on that item
            if(i==0) {
                tax.grand_total_for_current_item = flt(item.net_amount + current_tax_amount);
            } else {
                tax.grand_total_for_current_item =
                    flt(me.frm.doc["taxes"][i-1].grand_total_for_current_item + current_tax_amount);
            }

            // set precision in the last item iteration
            if (n == me.frm.doc["items"].length - 1) {
                me.round_off_totals(tax);
                me.set_in_company_currency(tax,
                    ["tax_amount", "tax_amount_after_discount_amount"]);

                me.round_off_base_values(tax);

                // in tax.total, accumulate grand total for each item
                me.set_cumulative_total(i, tax);

                me.set_in_company_currency(tax, ["total"]);

                // adjust Discount Amount loss in last tax iteration
                if ((i == me.frm.doc["taxes"].length - 1) && me.discount_amount_applied
                    && me.frm.doc.apply_discount_on == "Grand Total" && me.frm.doc.discount_amount) {
                    me.frm.doc.rounding_adjustment = flt(me.frm.doc.grand_total -
                        flt(me.frm.doc.discount_amount) - tax.total, precision("rounding_adjustment"));
                }
            }
        });

    });
}