erpnext.TransactionController.prototype.taxes_and_charges = function(){
    
    var me = this;
    
    frappe.call({
        method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.get_taxes_config",
        args: {
            "field":"cruzar_impuestos"
        },
        async: false,
        callback: function(r) {
            

            if(me.frm.doc.taxes_and_charges) {

                let is_check_merge = r.message
                let master_doctype = frappe.meta.get_docfield(me.frm.doc.doctype, "taxes_and_charges", me.frm.doc.name).options
                let master_name = me.frm.doc.taxes_and_charges
            
                return frappe.call({
                    method: "erpnext.controllers.accounts_controller.get_taxes_and_charges",
                    args: {
                        "master_doctype": master_doctype,
                        "master_name": master_name
                    },
                    callback: function(r) {
                        if(!r.exc) {
    
                            if(me.frm.doc.shipping_rule && me.frm.doc.taxes) {
                                    
                                    let tax_list = me.frm.doc.items.filter(i => i.item_tax_template).map(i => i.item_tax_template)
    
                                    for (let tax of r.message) {
                                        if(is_check_merge){
                                            if(tax_list.length > 0){
                                                if(tax_exists(master_name, tax.account_head, tax.rate)){
                                                    
                                                    let add_tax = true;

                                                    if(['On Previous Row Amount', 'Previous Row Total'].includes(tax.charge_type)){
                                                        
                                                        let prev_account_head = r.message[tax.row_id -1].account_head
                                                        let prev_rate = r.message[tax.row_id -1].rate

                                                        if(!tax_exists(tax_list, prev_account_head, prev_rate)){
                                                            add_tax = false;
                                                        }                   
                                                    }

                                                    if(add_tax){
                                                        me.frm.add_child("taxes", tax);
                                                    }
                                                }
                                            }
                                            
                                        }else{
                                            me.frm.add_child("taxes", tax);
                                        }
                                    }
                                            
                                refresh_field("taxes");
                            } else {
                                if(is_check_merge){
                                    
                                        let tax_list = me.frm.doc.items.filter(i => i.item_tax_template).map(i => i.item_tax_template)
    
                                        if(tax_list.length > 0){
                                            me.frm.set_value("taxes", []);
    
                                            for (let tax of r.message) {
                                                if(tax_exists(tax_list, tax.account_head, tax.rate)){

                                                    let add_tax = true;

                                                    if(['On Previous Row Amount', 'Previous Row Total'].includes(tax.charge_type)){
                                                        
                                                        let prev_account_head = r.message[tax.row_id -1].account_head
                                                        let prev_rate = r.message[tax.row_id -1].rate

                                                        if(!tax_exists(tax_list, prev_account_head, prev_rate)){
                                                            add_tax = false;
                                                        }                   
                                                    }

                                                    if(add_tax){
                                                        me.frm.add_child("taxes", tax);
                                                    }
                                                    
                                                }
                                            }
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
        }
    });

}

function tax_exists(tax_list, account_head, rate){

    let exist = false;

    frappe.call({
            method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.check_itemtax_exist",
            args: {
                "tax_list": tax_list,
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