$(document).ready(function () {
    fnLoadBankDetails();
})

var isEdit = 0;
function fnLoadBankDetails() {
    $("#jqgCustomerBankDetails").GridUnload();

    $("#jqgCustomerBankDetails").jqGrid({
        //url:,
       // mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        serializeGridData: function (postdata) {
            postdata.Customercode = $("#txtCustomerCode").val();
            return JSON.stringify(postdata.Customercode);
        },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Beneficiary Name", "Bank Name", "Bank A/c No", "Swift Code", "IFSC Code", "Active Status", ""],
        colModel: [
            { name: 'CustomerCode', width: '40', resizable: false, hidden: true },
            { name: 'BenificiaryName', width: '170', resizable: false },
            { name: 'BenificiaryBankName', width: '100', resizable: false },
            { name: 'BenificiaryBankAccountNo', width: '50', resizable: false },
            { name: 'BankSwiftcode', width: '40', resizable: false },
            { name: 'BankIfsccode', width: '40', resizable: false },
            { name: "ActiveStatus", editable: true, width: 30, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: InActive" } },
            {
                name: '', width: '28', resizable: false,
                formatter: function (cellValue, options, rowObject) {
                    var ret = '<button class="btn-xs ui-button ui- widget ui-corner-all btn-jqgrid" title="Edit" onclick="fnEditBankDetails(event)\"><i class="fas fa-pen"></i> Edit </button>'
                    return ret;
                },
            }
        ],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpCustomerBankDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll: false,
        loadonce: true,
        width: 'auto',
        height: 'auto',
        autowidth: 'auto',
        shrinkToFit: true,
        forceFit: true, caption:'Customer Bank Details',
    }).jqGrid('navGrid', '#jqpCustomerBankDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCustomerBankDetails', {
        caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'custReload', position: 'first', onClickButton: fnRefreshBankGrid
    });
    fnAddGridSerialNoHeading();
}

function fnEditBankDetails(e) {
    isEdit = 1;
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCustomerBankDetails').jqGrid('getRowData', rowid);

    $("#txtbeneficiaryname").val(rowData.BenificiaryName);
    $("#txtbankname").val(rowData.BenificiaryBankName);
    $("#txtbankacno").val(rowData.BenificiaryBankAccountNo);
    $("#txtbankacno").attr('readonly', true);
    $("#txtswiftcode").val(rowData.BankSwiftcode);
    $("#txtifsccode").val(rowData.BankIfsccode);
    $("#cbobankstatus").val(rowData.ActiveStatus).selectpicker('refresh');
    $("#btnBankDetailsdisabled").html("Update");
}

function fnSaveBankDetails() {
    
}
function IsValidBankDetails() {

    if (IsStringNullorEmpty($("#txtbeneficiaryname").val())) {
        toastr.warning("Please Enter the Beneficiary Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtbankname").val())) {
        toastr.warning("Please Enter the Bank Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtbankacno").val())) {
        toastr.warning("Please Enter the Account Number");
        return false;
    }
    if (IsStringNullorEmpty($("#txtswiftcode").val())) {
        toastr.warning("Please Enter the Swift Code");
        return false;
    }

    if (IsStringNullorEmpty($("#txtifsccode").val())) {
        toastr.warning("Please Enter the IFSC Code");
        return false;
    }
}

function fnRefreshBankGrid() {
    $("#jqgCustomerBankDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearBankDetails() {
    isEdit = 0;
    $("#txtbeneficiaryname").val('');
    $("#txtbankname").val('');
    $("#txtbankacno").val('');
    $("#txtbankacno").attr('readonly', false);
    $("#txtswiftcode").val('');
    $("#txtifsccode").val('');
    $("#cbobankstatus").val('true').selectpicker('refresh');
    $("#btnBankDetailsdisabled").html("Save");

}
