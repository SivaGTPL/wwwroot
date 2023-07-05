$(document).ready(function () {

    fnLoadGridReleaseSalary()

});

function fnLoadGridReleaseSalary() {
    $("#jqgReleaseSalary").jqGrid({
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Employee Name", "Currency", "Account Holder name ", "Bank Name", "Account No", "IFSC Code", "Branch Name", "Gross Amount", "Bank Charges", "Net Pay"],
        colModel: [
            { name: "EmployeeName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "Currency", width: 45, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "AccountHolderName", width: 110, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "BankName", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "AccountNo", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "IFSCCode", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BranchName", width:120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Gross", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BankCharges", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "NetPay", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false }

        ],
        pager: "#jqpReleaseSalary",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
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

    }).jqGrid('navGrid', '#jqpReleaseSalary', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' })
    $("#jqgReleaseSalary").jqGrid('inlineNav', '#jqpReleaseSalary',{
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

function fnAddReleaseSalary() {

    $("#PopupReleaseSalary").modal('show');
}


function fnGridRefreshReleaseSalary() {
    $("#jqgReleaseSalary").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}