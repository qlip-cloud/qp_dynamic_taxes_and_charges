erpnext.taxes_and_totals.prototype._load_item_tax_rate = function(item_tax_rate) {

    let return_item_tax_rate;
    let me = this;

    frappe.call({
        method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.get_taxes_config",
        args: {
            "field":"cruzar_impuestos"
        },
        async: false,
        callback: function(r) {
            let cruzar_impuestos = r.message

            if(cruzar_impuestos){
                if(item_tax_rate){
                    return_item_tax_rate = JSON.parse(item_tax_rate);
                    $.each(return_item_tax_rate, function(tax, rate) {
                        me.frm.doc.taxes.some(t => {
                            if(t.account_head === tax)
                                delete return_item_tax_rate[tax];
                        });
                            
                    });   
                }else{
                    return_item_tax_rate = {}
                }
            }else{
                return_item_tax_rate = item_tax_rate ? JSON.parse(item_tax_rate) : {};
            }
        }
    });

    return return_item_tax_rate
}