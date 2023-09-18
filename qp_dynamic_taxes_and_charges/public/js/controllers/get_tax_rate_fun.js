erpnext.taxes_and_totals.prototype._get_tax_rate = function(tax, item_tax_map) {

    let tax_rate;

    frappe.call({
        method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.get_taxes_config",
        args: {
            "field":"impuesto_individual"
        },
        async: false,
        callback: function(r) {
            let impuesto_individual = r.message

            if(impuesto_individual){
                tax_rate =  (Object.keys(item_tax_map).indexOf(tax.account_head) != -1) ? flt(item_tax_map[tax.account_head], precision("rate", tax)) : 0;

                if(['On Previous Row Amount', 'Previous Row Total'].includes(tax.charge_type) && Object.keys(item_tax_map).indexOf(cur_frm.doc.taxes[cint(tax.row_id)-1].account_head) == -1 ){
                    cur_frm.doc.taxes[cint(tax.row_id)-1].tax_amount_for_current_item = cur_frm.doc.taxes[cint(tax.row_id)-1].tax_amount
                }

            }else{
                tax_rate =  (Object.keys(item_tax_map).indexOf(tax.account_head) != -1) ? flt(item_tax_map[tax.account_head], precision("rate", tax)) : tax.rate;
            }
        }
    });

    return tax_rate
}