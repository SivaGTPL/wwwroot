var _isInsert = true;
var actiontype = "";
function fnGridBankDetails() {
    $("#jqgBankDetails").GridUnload();
    $("#jqgBankDetails").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeeBankInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PaymentMode, localization.BankName, localization.AccountNo, localization.IFSCCode, localization.BankBranch, localization.Status, localization.Actions],
        colModel: [
            { name: "SalaryPaymentMode", width: 90, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "BankCode", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "AccountNumber", width: 190, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Ifsccode", width: 190, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BankBranch", width: 200, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "AccountStatus", width: 125, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditEmployeeBankDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditEmployeeBankDetails(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ],
        pager: "#jqpBankDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        },
    }).jqGrid('navGrid', '#jqpBankDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpBankDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBankDetails
    }).jqGrid('navButtonAdd', '#jqpBankDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBankDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgBankDetails"),
            newWidth = $grid.closest(".BankDetailscontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
    fnGridSalaryDetails();
}

function fnAddBankDetails() {
    _isInsert = true;
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearEmpBankFields();
    $('#PopupBankDetails').find('.modal-title').text(localization.AddBankDetails);
    $('#PopupBankDetails').modal('show');
    $("#btnSaveBankDetails").show();
    $("#btnCancelBankDetails").show();
    $("#btnSaveBankDetails").html(localization.Save);
    $("#chkBankActiveStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#txtAccountno").attr('readonly', false);
}

function fnEditEmployeeBankDetails(e, actiontype) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBankDetails').jqGrid('getRowData', rowid);
    $("#txtAccountno").val(rowData.AccountNumber);
    $("#txtAccountno").attr("readonly", "readonly");
    $("#cboPaymentmode").val(rowData.SalaryPaymentMode).selectpicker('refresh');
    $("#cboBankname").val(rowData.BankCode).selectpicker('refresh');
    $("#txtIFSCcode").val(rowData.Ifsccode);
    $("#txtBankbranch").val(rowData.BankBranch);
    if (rowData.AccountStatus == 'true') {
        $("#chkBankActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkBankActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBankDetails").attr("disabled", false);
    $('#PopupBankDetails').modal('show');
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        $('#PopupBankDetails').find('.modal-title').text(localization.UpdateBankDetails);
        $("#btnSaveBankDetails").show();
        $("#btnCancelBankDetails").show();
        $("#btnSaveBankDetails").html(localization.Update);
        $("#chkBankActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtAccountno").attr('readonly', true);
    }

    if (actiontype.trim() == "view") {
        $('#PopupBankDetails').find('.modal-title').text(localization.ViewBankDetails);
        $("#btnSaveBankDetails").attr("disabled", true);
        $("#btnSaveBankDetails").hide();
        $("#btnCancelBankDetails").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#chkBankActiveStatus").prop('disabled', true);
        
    }
}

function fnSaveBankDetails() {

    if (IsValidBankDetails() === false) {
        return;
    }
    var objbankinfo = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        AccountNumber: $("#txtAccountno").val(),
        SalaryPaymentMode: $("#cboPaymentmode").val(),
        BankCode: $("#cboBankname").val(),
        Ifsccode: $("#txtIFSCcode").val(),
        BankBranch: $("#txtBankbranch").val(),
        AccountStatus: $("#chkBankActiveStatus").parent().hasClass("is-checked")

    };
    $("#btnSaveBankDetails").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeBankInfo',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj:objbankinfo },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupBankDetails').modal('hide');
                fnGridRefreshBankDetails();
                $("#btnSaveBankDetails").attr('disabled', false);
                fnClearEmpBankFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBankDetails").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBankDetails").attr('disabled', false);
        }
    });

}

function IsValidBankDetails() {
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create a Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create Employee details");
        return false;
    }
    if ($("#cboPaymentmode").val() == 0 || $("#cboPaymentmode").val() == "0") {
        toastr.warning("Please select a Payment Mode");
        return false;
    }
    if ($("#cboBankname").val() == 0 || $("#cboBankname").val() == "0") {
        toastr.warning("Please select a Bank Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAccountno").val())) {
        toastr.warning("Please Enter the Account Number");
        return false;
    }
   
    if (IsStringNullorEmpty($("#txtIFSCcode").val())) {
        toastr.warning("Please Enter the IFSC Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankbranch").val())) {
        toastr.warning("Please Enter the Bank Branch");
        return false;
    }
}

function fnGridRefreshBankDetails() {
    $("#jqgBankDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearEmpBankFields() {
    $("#txtAccountno").attr('readonly',false);
    $("#txtAccountno").val('');
    $("#cboPaymentmode").val('0').selectpicker('refresh');
    $("#cboBankname").val('0').selectpicker('refresh');
    $("#txtIFSCcode").val('');
    $("#txtBankbranch").val('');
    $("#chkBankActiveStatus").parent().addClass("is-checked");
    $("#btnSaveBankDetails").attr("disabled", false);
    $("#btnSaveBankDetails").html(localization.Save);
}

$("#btnCancelBankDetails").click(function () {
    $("#jqgBankDetails").jqGrid('resetSelection');
    $('#PopupBankDetails').modal('hide');
    fnClearEmpBankFields();
});
