erpnext.taxes_and_totals.prototype.add_taxes_from_item_tax_template = function(item_tax_map)  {
    
    let me = this;
    
    frappe.call({
        method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.get_taxes_config",
        args: {
            "field":"cruzar_impuestos"
        },
        async: false,
        callback: function(r) {

            let item_tax_list = []
            let is_check_merge = r.message
            let master_doctype = frappe.meta.get_docfield(me.frm.doc.doctype, "taxes_and_charges", me.frm.doc.name).options
            let master_name = me.frm.doc.taxes_and_charges
            
            if (item_tax_map && cint(frappe.defaults.get_default("add_taxes_from_item_tax_template"))) {
    
                if (typeof (item_tax_map) == "string") {
                    item_tax_map = JSON.parse(item_tax_map);
                }

                $.each(item_tax_map, function(tax, rate) {

                    let found = (me.frm.doc.taxes || []).find(d => {
    
                        if(is_check_merge){
                            if(d.account_head === tax && d.rate === rate)
                                return d
                        }else{
                            if(d.account_head === tax)
                                return d
                        }
                        
                    });
        
                    if(is_check_merge){
                        frappe.call({
                            method: "qp_dynamic_taxes_and_charges.qp_dynamic_taxes_and_charges.services.taxes.check_tabletax_exist",
                            args: {
                                "doctype":master_doctype,
                                "parent": master_name, 
                                "tax_type":tax,
                                "tax_rate":rate
                            },
                            async: false,
                            callback: function(r) {

                                item_tax_list = r.message["item_tax_list"]

                                if(!r.message["exist"] && !found)
                                    found = true
                            }
                        });
                    }
                    
        
                    if (!found) {
                        
                        let flag_add = true;

                        if (['On Previous Row Amount', 'Previous Row Total'].includes(item_tax_list.find(x => x.account_head == tax).charge_type) && is_check_merge){
                            
                            let prev_account_head = item_tax_list.find(x => x.idx == item_tax_list.find(x => x.account_head == tax).row_id).account_head
                            let ex = false;

                            $.each(item_tax_map, function(tax, rate) {
                                if(prev_account_head == tax) ex = true;
                            });

                            if(!ex){
                                if(!cur_frm.doc.taxes.some(t => t.account_head == prev_account_head))
                                    flag_add = false;
                            } 

                        }

                        if(flag_add){
                            let child = frappe.model.add_child(me.frm.doc, "taxes");
                            child.charge_type =  is_check_merge ? item_tax_list.find(x => x.account_head == tax).charge_type : "On Net Total";
                            child.account_head = tax;
                            child.rate = is_check_merge ? rate : 0;

                            if (['On Previous Row Amount', 'Previous Row Total'].includes(child.charge_type) && is_check_merge){
                                is_check_merge ? child.row_id = me.frm.doc.taxes.slice(-1).idx : child.row_id = item_tax_list.find(x => x.account_head == tax).row_id;
                            }

                        }
                    }
                });
        
                
            }
        }
    });
    
}