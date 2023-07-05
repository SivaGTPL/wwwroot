//var _isInsert = true;
var actiontype = "";
function fnGridBankDetails() {
    $("#jqgBankDetails").GridUnload();
    $("#jqgBankDetails").jqGrid({
        url: getBaseURL() + '/EmployeeExpat/GetBankDetail?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["SerialNumber", "Bank Remittance", "Bank Remittance", "Bank Currency", "Currency", "Account Holder Name", "Account No", "Bank Code", "Bank Name", "BranchCode", "Branch Name", "Bank Address", "Beneficiary Address", "IFSC Code", "SWIFT Code", "IBAN", "Corresponding Bank Name", "Corresponding Bank Address", "Corresponding Bank Account Number", "Actions"],
        colModel: [
            { name: "SerialNumber", width: 90, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "BankRemittanceCode", width: 90, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "BankRemittance", width: 140, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "BankCurrencyCode", width: 90, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BankCurrency", width: 130, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false},
            { name: "AccountHolderName", width: 210, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "AccountNumber", width: 130, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BankCode", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BankName", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "BranchCode", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BranchName", width: 145, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BankAddress", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BeneficiaryAddress", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "IFSCCode", width: 135, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false  },
            { name: "SWIFTCode", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "IBAN", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CorrespondingBankName", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CorrespondingBankAddress", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CorrespondingBankAccountNumber", width: 95, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditEmployeeBankDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + 'Edit' + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditEmployeeBankDetails(event,\'view\');"><i class="far fa-eye"></i>' +'View' + '</button>'
                }
            },
        ],
        pager: "#jqpBankDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        loadComplete: function (data) {
            //SetGridControlByAction();
           // fnSetGridwidth("jqpBankDetails");
        },
    }).jqGrid('navGrid', '#jqpBankDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpBankDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBankDetails
    }).jqGrid('navButtonAdd', '#jqpBankDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBankDetails
    });

    $(window).on("resize", function () {
     //  fnSetGridwidth("jqpBankDetails");
    });
    fnAddGridSerialNoHeading();
    
}

function fnAddBankDetails() {
    //_isInsert = true;
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearEmpBankFields();
    $('#PopupBankDetails').find('.modal-title').text("Add Bank Details");
    $('#PopupBankDetails').modal('show');
    $("#btnSaveBankDetails").show();
    $("#btnCancelBankDetails").show();
    $("#btnSaveBankDetails").html('Save');
    $("#chkBankActiveStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#txtAccountno").attr('readonly', false);
    $("#cboBankAccountType").val('0').selectpicker('refresh');

    if ($("#cboBankAccountType").val() == "0") {
        $("#divOutward").css('display', 'none');
    }
    if ($("#cboBankAccountType").val() == "L") {

        $("#divOutward").css('display', 'none');
    }
    if ($("#cboBankAccountType").val() == "O") {

        $("#divOutward").css('display', 'block');
    }
}

function fnEditEmployeeBankDetails(e, actiontype) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBankDetails').jqGrid('getRowData', rowid);
    $("#txtSerialNumber").val(rowData.SerialNumber);
    $("#cboBankAccountType").val(rowData.BankRemittanceCode);
    $("#cboBankAccountType").selectpicker('refresh');

    if ($("#cboBankAccountType").val() == "0") {
        $("#divOutward").css('display', 'none');
    }
    if ($("#cboBankAccountType").val() == "L") {

        $("#divOutward").css('display', 'none');
    }
    if ($("#cboBankAccountType").val() == "O") {

        $("#divOutward").css('display', 'block');
    }

    $("#cboBankCurrency").val(rowData.BankCurrencyCode);
    $("#cboBankCurrency").selectpicker('refresh');
    $("#txtAccountHolderName").val(rowData.AccountHolderName);
    $("#txtAccountno").val(rowData.AccountNumber);
    $("#txtBankCode").val(rowData.BankCode);
    $("#txtBankName").val(rowData.BankName);
    $("#txtBranchCode").val(rowData.BranchCode);
    $("#txtBranchName").val(rowData.BranchName);
    $("#txtBankAddress").val(rowData.BankAddress); 
    $("#txtBeneficiaryAddress").val(rowData.BeneficiaryAddress);
    $("#txtIFSCCode").val(rowData.IFSCCode);
    $("#txtSWIFTCode").val(rowData.SWIFTCode);
    $("#txtIBAN").val(rowData.IBAN);
    $("#txtBeneficiaryBankName").val(rowData.CorrespondingBankName);
    $("#txtBeneficiaryBankAddress").val(rowData.CorrespondingBankAddress);
    $("#txtBankAccountNo").val(rowData.CorrespondingBankAccountNumber);
    
    //if (rowData.AccountStatus == 'true') {
    //    $("#chkBankActiveStatus").parent().addClass("is-checked");
    //}
    //else {
    //    $("#chkBankActiveStatus").parent().removeClass("is-checked");
    //}
    $("#btnSaveBankDetails").attr("disabled", false);
    $('#PopupBankDetails').modal('show');
    //_isInsert = false;

    if (actiontype.trim() == "edit") {
        $('#PopupBankDetails').find('.modal-title').text("Update Bank Details");
        $("#btnSaveBankDetails").show();
        $("#btnCancelBankDetails").show();
        $("#btnSaveBankDetails").html('Update');
        //$("#chkBankActiveStatus").prop('disabled', false);
        //$("input,textarea").attr('readonly', false);
        //$("select").next().attr('disabled', false);
        //$("#txtAccountno").attr('readonly', true);
    }

    if (actiontype.trim() == "view") {
        $('#PopupBankDetails').find('.modal-title').text("View Bank Details");
        $("#btnSaveBankDetails").attr("disabled", true);
        $("#btnSaveBankDetails").hide();
        $("#btnCancelBankDetails").hide();
        //$("input,textarea").attr('readonly', true);
        //$("select").next().attr('disabled', true);
        //$("#chkBankActiveStatus").prop('disabled', true);
    }
}

function fnSaveBankDetails() {
    if (IsValidBankDetails() === false) {
        return;
    }

    $("#btnSaveBankDetails").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveBankDetails").attr('disabled', true);

    var objbankinfo = {
        BusinessKey: $("#cboBusinessLocation").val(),
        EmployeeNumber: $("#txtEmployeeNumber").val(),
        SerialNumber: $("#txtSerialNumber").val(),
        BankRemittance: $("#cboBankAccountType").val(),
        BankCurrency: $("#cboBankCurrency").val(),
        AccountHolderName: $("#txtAccountHolderName").val(),
        BankCode: $("#txtBankCode").val(),
        BankName: $("#txtBankName").val(),
        AccountNumber: $("#txtAccountno").val(),
        BranchCode: $("#txtBranchCode").val(),
        BranchName: $("#txtBranchName").val(),
        BankAddress: $("#txtBankAddress").val(),
        BeneficiaryAddress: $("#txtBeneficiaryAddress").val(),
        IFSCCode: $("#txtIFSCCode").val(),
        SWIFTCode: $("#txtSWIFTCode").val(),
        IBAN: $("#txtIBAN").val(),
        CorrespondingBankName: $("#txtBeneficiaryBankName").val(),
        CorrespondingBankAddress: $("#txtBeneficiaryBankAddress").val(),
        CorrespondingBankAccountNumber: $("#txtBankAccountNo").val(),
        //AccountStatus: $("#chkBankActiveStatus").parent().hasClass("is-checked")

    };
    $("#btnSaveBankDetails").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/EmployeeExpat/InsertOrUpdateBankDetail',
        type: 'POST',
        datatype: 'json',
        data: {obj: objbankinfo },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBankDetails").html('Save');
                $("#btnSaveBankDetails").attr('disabled', false);
                $('#PopupBankDetails').modal('hide');
                fnGridRefreshBankDetails();
                //$("#btnSaveBankDetails").attr('disabled', false);
                fnClearEmpBankFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBankDetails").html('Save');
                $("#btnSaveBankDetails").attr('disabled', false);
                //$("#btnSaveBankDetails").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBankDetails").html('Save');
            $("#btnSaveBankDetails").attr('disabled', false);
        }
    });

}

function IsValidBankDetails() {
    if (IsStringNullorEmpty($("#txtEmployeeNumber").val())) {
        toastr.warning("Please Create the Employee Details");
        return false;
    }
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.warning("Please Select a Business Location");
        return false;
    }
    if ($("#cboBankAccountType").val() == 0 || $("#cboBankAccountType").val() == "0") {
        toastr.warning("Please select a Bank Remittance");
        return false;
    }
    if ($("#cboBankCurrency").val() == 0 || $("#cboBankCurrency").val() == "0") {
        toastr.warning("Please select a Bank Currency");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAccountHolderName").val())) {
        toastr.warning("Please Enter the Account Holder Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankCode").val())) {
        toastr.warning("Please Enter the Bank Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankName").val())) {
        toastr.warning("Please Enter the Bank Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAccountno").val())) {
        toastr.warning("Please Enter the Account Number");
        return false;
    }
}

function fnGridRefreshBankDetails() {
    $("#jqgBankDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearEmpBankFields() {
    $("#txtSerialNumber").val('0')
    $("#cboBankAccountType").val('0');
    $("#cboBankAccountType").selectpicker('refresh');
    $("#cboBankCurrency").val('0');
    $("#cboBankCurrency").selectpicker('refresh');
    $("#txtAccountHolderName").val('');
    $("#txtBankCode").val('');
    $("#txtBankName").val('');
    $("#txtAccountno").val('');
    $("#txtBranchCode").val('');
    $("#txtBranchName").val('');
    $("#txtBankAddress").val('');
    $("#txtBeneficiaryAddress").val('');
    $("#txtIFSCCode").val('');
    $("#txtSWIFTCode").val('');
    $("#txtIBAN").val('');
    $("#txtBeneficiaryBankName").val('');
    $("#txtBeneficiaryBankAddress").val('');
    $("#txtBankAccountNo").val('');


    //$("#txtAccountno").attr('readonly',false);
    //$("#txtAccountno").val('');
    //$("#cboPaymentmode").val('0').selectpicker('refresh');
    //$("#cboBankname").val('0').selectpicker('refresh');
    //$("#txtIFSCcode").val('');
    //$("#txtBankbranch").val('');
    //$("#chkBankActiveStatus").parent().addClass("is-checked");

    $("#btnSaveBankDetails").attr("disabled", false);
    $("#btnSaveBankDetails").html("Save");
}

$("#btnCancelBankDetails").click(function () {
    $("#jqgBankDetails").jqGrid('resetSelection');
    $('#PopupBankDetails').modal('hide');
    fnClearEmpBankFields();
});
