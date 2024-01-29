erpnext.taxes_and_totals.prototype._load_item_tax_rate = function(item_tax_rate) {

    let return_item_tax_rate;
    let me = this;

    frappe.call({
        method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.get_taxes_config",
        args: {
            "fields":["cruzar_impuestos", "todos_los_doctypes"]
        },
        async: false,
        callback: function(r) {
            let is_check_merge = r.message["cruzar_impuestos"]
            let all_doctypes = r.message["todos_los_doctypes"]

            let flag = is_check_merge && (all_doctypes || !['Purchase Order', 'Purchase Invoice', 'Purchase Receipt'].includes(me.frm.doc.doctype)) ? true : false

            if(flag){
                if(item_tax_rate){
                    return_item_tax_rate = JSON.parse(item_tax_rate);
                    $.each(return_item_tax_rate, function(tax, rate) {
                        if(!me.frm.doc.taxes.some(t => (t.account_head === tax && t.rate === rate))){
                            delete return_item_tax_rate[tax];
                        }                
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