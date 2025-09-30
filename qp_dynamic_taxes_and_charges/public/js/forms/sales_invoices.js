frappe.ui.form.on("Sales Invoice", {
    cost_center:function(frm){
        if(frm.doc.cost_center != null){
            $.each(frm.doc.items, function(i, item){
                item.cost_center = frm.doc.cost_center;
            });

            $.each(frm.doc.taxes, function(i, tax){
                tax.cost_center = frm.doc.cost_center;
            });

            frm.refresh_field("items");
            frm.refresh_field("taxes");
        }
    }
});

frappe.ui.form.on("Sales Invoice Item", {
    item_code:function(frm, cdt, cdn){
        var child = locals[cdt][cdn];

        if(frm.doc.cost_center != null){
            child.cost_center = frm.doc.cost_center;
        }

        frm.refresh_field("items");
    }
});