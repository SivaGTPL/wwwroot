$(document).ready(function () {

    fnLoadGridSalaryPayment()

});

function fnLoadGridSalaryPayment() {
    $("#jqgSalaryPayment").jqGrid({
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Employee Name", "Salary Amount", "Gross Pay", "KES", "INR", "USD"],
        colModel: [
            { name: "EmployeeName", width: 120, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "SalaryAmount", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "GrossPay", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "KES", width: 30, align: 'right', editable: true,editoptions: { maxlength: 20 }, resizable: false, hidden: false },
            { name: "INR", width: 30, align: 'right', editable: true,editoptions: { maxlength: 20 }, resizable: false, hidden: false },
            { name: "USD", width: 30, align: 'right', editable: true, editoptions: { maxlength: 20 }, resizable: false, hidden: false },
            
        ],
        pager: "#jqpSalaryPayment",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumwidth:'35',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,

    }).jqGrid('navGrid', '#jqpSalaryPayment', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' });
    $("#jqgSalaryPayment").jqGrid('inlineNav', '#jqpSalaryPayment',{
        edit: true,
        edittext: "Edit",
        add: true,
        addicon: 'fa fa-plus',
        addtext: 'Add',
        deltext: 'Delete',
        editicon: 'fa fa-pen',
        del: false,
        search: false,
        searchicon: 'fa fa-search',
        save: true,
        saveicon: 'fa fa-save',
        savetext: 'Save',
        cancel: true,
        canceltext: 'Cancel',
        cancelicon: 'fa fa-times'
    });


    fnAddGridSerialNoHeading();

}

function fnAddSalaryPayment() {

    $("#PopupSalaryPayment").modal('show');
}


function fnGridRefreshSalaryPayment() {
    $("#jqgSalaryPayment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}