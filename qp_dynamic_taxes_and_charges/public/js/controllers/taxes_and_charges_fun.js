erpnext.TransactionController.prototype.taxes_and_charges = function(){
    
    var me = this;
        
    frappe.db.get_single_value('Dynamic Taxes Config', 'cruzar_impuestos').then((merge) => {

        if(this.frm.doc.taxes_and_charges) {

            let is_check_merge = merge;
            let master_doctype = frappe.meta.get_docfield(this.frm.doc.doctype, "taxes_and_charges", this.frm.doc.name).options
            let master_name = this.frm.doc.taxes_and_charges
        
            return this.frm.call({
                method: "erpnext.controllers.accounts_controller.get_taxes_and_charges",
                args: {
                    "master_doctype": master_doctype,
                    "master_name": master_name
                },
                callback: function(r) {
                    if(!r.exc) {

                        if(me.frm.doc.shipping_rule && me.frm.doc.taxes) {
    
                                for (let tax of r.message) {
                                    if(is_check_merge){
                                        if(tax_exists(master_name, tax.account_head, tax.rate))
                                            me.frm.add_child("taxes", tax);
                                    }else{
                                        me.frm.add_child("taxes", tax);
                                    }
                                }
                                        
                            refresh_field("taxes");
                        } else {
                            if(is_check_merge){

                                me.frm.set_value("taxes", []);

                                for (let tax of r.message) {
                                    if(tax_exists(master_name, tax.account_head, tax.rate))
                                        me.frm.add_child("taxes", tax);
                                }
                            }else{
                                me.frm.set_value("taxes", r.message);
                            }
    
                            me.calculate_taxes_and_totals();
                        }
                    }
                }
            });
        }

    });
}

function tax_exists(master_name, account_head, rate){

    let exist = false;

    frappe.call({
            method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.check_itemtax_exist",
            args: {
                "parent": master_name, 
                "tax_type":account_head, 
                "tax_rate":rate
            },
            async: false,
            callback: function(r) {
                exist = r.message["exist"]
            }
    });

    return exist;
}