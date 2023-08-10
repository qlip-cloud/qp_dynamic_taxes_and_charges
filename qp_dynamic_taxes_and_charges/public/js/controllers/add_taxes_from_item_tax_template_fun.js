erpnext.taxes_and_totals.prototype.add_taxes_from_item_tax_template = function(item_tax_map)  {
    
    let me = this;
    
    
    frappe.db.get_single_value('Dynamic Taxes Config', 'cruzar_impuestos').then((value) => {
        
        let is_check_merge = value;
        let master_doctype = frappe.meta.get_docfield(this.frm.doc.doctype, "taxes_and_charges", this.frm.doc.name).options
        let master_name = this.frm.doc.taxes_and_charges
        
        if (item_tax_map && cint(frappe.defaults.get_default("add_taxes_from_item_tax_template"))) {

            if (typeof (item_tax_map) == "string") {
                item_tax_map = JSON.parse(item_tax_map);
            }
    
            $.each(item_tax_map, function(tax, rate) {
                
                let found = (me.frm.doc.taxes || []).find(d => {

                    if(is_check_merge){
                        return (d.account_head === tax && d.rate === rate) ? true : false
                    }else{
                        if(d.account_head === tax)
                            return d.account_head === tax ? true : false
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
                            if(!r.message["exist"] && !found)
                                found = true
                        }
                    });
                }
                
    
                if (!found) {
                    let child = frappe.model.add_child(me.frm.doc, "taxes");
                    child.charge_type = "On Net Total";
                    child.account_head = tax;
                    child.rate = 0;
                }
            });
    
            
        }

    });
}