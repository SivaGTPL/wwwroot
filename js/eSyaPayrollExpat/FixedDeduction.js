
var actiontype = "";
function fnGridFixedDeduction() {
    $("#jqgFixedDeduction").GridUnload();

    $("#jqgFixedDeduction").jqGrid({
        url: getBaseURL() + '/EmployeeExpat/GetFixedDeductionInfo?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["FixedDeduction Id", "FixedDeduction Type","Deduction Description", "Amount", "No of Installments", "Paid Amount", "Reference Detail","Status","Skip Payroll","Actions"],
        colModel: [
            { name: "FixedDeductionId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FixedDeductionType", editable: true, width: 150, edittype: "select", align: 'left', formatter: 'select', hidden: false, editoptions: { value: "A:Advance;L:Loan" } },
            { name: "DeductionDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "Amount", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "NoOfinstallment", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "PaidAmount", width: 120, align: 'right', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ReferenceDetail", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Status", editable: true, width: 60, edittype: "select", align: 'left', formatter: 'select', hidden: true, editoptions: { value: "A:Active;C:Closed" } },
            { name: "SkipinPayroll", width: 115, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
           {
                name: 'edit', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditFixedDeductions(event,\'edit\');"><i class="fas fa-pen"></i>' +'Edit' + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditFixedDeductions(event,\'view\');"><i class="far fa-eye"></i>' + 'View' + '</button>'
                }
            },
        ],
        pager: "#jqpFixedDeduction",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: true,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        rownumWidth: '55',
        loadComplete: function (data) {
            fnSetGridwidth("jqpFixedDeduction");
        },
    }).jqGrid('navGrid', '#jqpFixedDeduction', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpFixedDeduction', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshFixedDeduction
    }).jqGrid('navButtonAdd', '#jqpFixedDeduction', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddFixedDeduction
    });

    $(window).on("resize", function () {
        fnSetGridwidth("jqpFixedDeduction");
    });
    fnAddGridSerialNoHeading();
}

function fnAddFixedDeduction() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearFixedDeductionFields();
    $('#PopupFixedDeduction').find('.modal-title').text("Add Fixed Deduction Details");
    $('#PopupFixedDeduction').modal('show');
    $("#btnSaveFixedDeduction").attr("disabled", false);
    $("#btnSaveFixedDeduction").html('Save');
    $("#btnSaveFixedDeduction").show();
    $("#btnCancelFixedDeduction").show();
    $("#chkSkipPayroll").prop('disabled', false);
    $("#chkSkipPayroll").parent().addClass("is-checked");
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#txtFixeddeductionPaidamount").attr('readonly', true);
}

function fnEditFixedDeductions(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgFixedDeduction').jqGrid('getRowData', rowid);
    $("#txtFixeddeductionId").val(''); 
    $("#txtFixeddeductionId").val(rowData.FixedDeductionId); 

    $("#cboFixeddeductionType").val(rowData.FixedDeductionType).selectpicker('refresh');
    $("#txtDeductionDesc").val(rowData.DeductionDesc);
    $("#txtFixeddeductionamount").val(rowData.Amount);
    $("#txtNoofInstallments").val(rowData.NoOfinstallment);
    $("#txtFixeddeductionPaidamount").val(rowData.PaidAmount);
    $("#txtFixeddeductionPaidamount").attr('readonly', true);
    $("#txtReferencedetail").val(rowData.ReferenceDetail);
    if (rowData.SkipinPayroll == 'true') {
        $("#chkSkipPayroll").parent().addClass("is-checked");
    }
    else {
        $("#chkSkipPayroll").parent().removeClass("is-checked");
    }

    $("#cboFixeddeductionStatus").val(rowData.Status).selectpicker('refresh');

    $('#PopupFixedDeduction').modal('show')

    if (actiontype.trim() == "edit") {
        $('#PopupFixedDeduction').find('.modal-title').text("Update Fixed Deduction Details");
        $("#btnSaveFixedDeduction").attr("disabled", false);
        $("#btnSaveFixedDeduction").show();
        $("#btnCancelFixedDeduction").show();
        $("#btnSaveFixedDeduction").html('Update');
        $("#chkSkipPayroll").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtFixeddeductionPaidamount").attr('readonly', true);
    }

    if (actiontype.trim() == "view") {
        $('#PopupFixedDeduction').find('.modal-title').text("View Fixed Deduction Details");
        $("#btnSaveFixedDeduction").attr("disabled", true);
        $("#btnSaveFixedDeduction").hide();
        $("#btnCancelFixedDeduction").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#chkSkipPayroll").prop('disabled', true);

    }
}

function fnSaveFixedDeduction() {

    if (IsValidFixedDeduction() === false) {
        return;
    }

    var obj_fixed = {
        BusinessKey: $("#cboBusinessLocation").val(),
        EmployeeNumber: $("#txtEmployeeNumber").val(),
        FixedDeductionId: $("#txtFixeddeductionId").val() === '' ? 0 : $("#txtFixeddeductionId").val(),
        FixedDeductionType: $("#cboFixeddeductionType").val(),
        DeductionDesc: $("#txtDeductionDesc").val(),
        Amount: $("#txtFixeddeductionamount").val(),
        NoOfinstallment: $("#txtNoofInstallments").val(),
        PaidAmount: $("#txtFixeddeductionPaidamount").val(),
        ReferenceDetail: $("#txtReferencedetail").val(),
        Status: $("#cboFixeddeductionStatus").val(),
        SkipinPayroll: $("#chkSkipPayroll").parent().hasClass("is-checked"),
    };
    $("#btnSaveFixedDeduction").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/EmployeeExpat/InsertOrUpdateFixedDeductionInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj_fixed },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupFixedDeduction').modal('hide');
                fnGridRefreshFixedDeduction();
                $("#btnSaveFixedDeduction").attr('disabled', false);
                fnClearFixedDeductionFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveFixedDeduction").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFixedDeduction").attr('disabled', false);
        }
    });

}

function IsValidFixedDeduction() {

    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select a Business Key");
        return false;
    }
   
    if (IsStringNullorEmpty($("#txtEmployeeNumber").val())) {
        toastr.warning("Please create the Employee Details");
        return false;
    }
    if (($("#cboFixeddeductionType").val() === '0' || $("#cboFixeddeductionType").val() === "")) {
        toastr.warning("Please Select a Deduction Type");
        return false;
    }

    if (IsStringNullorEmpty($("#txtDeductionDesc").val())) {
        toastr.warning("Please Enter the Deduction Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtFixeddeductionamount").val())) {
        toastr.warning("Please Enter the Amount");
        return false;
    }
    if (IsStringNullorEmpty($("#txtNoofInstallments").val())) {
        toastr.warning("Please Enter the Number of Installments");
        return false;
    }
    //if (IsStringNullorEmpty($("#txtFixeddeductionPaidamount").val())) {
    //    toastr.warning("Please Enter Paid Amount");
    //    return false;
    //}
    if (($("#cboFixeddeductionStatus").val() === '0' || $("#cboFixeddeductionStatus").val() === "")) {
        toastr.warning("Please Select a Status");
        return false;
    }
}

function fnGridRefreshFixedDeduction() {
    $("#jqgFixedDeduction").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFixedDeductionFields() {
    $("#txtFixeddeductionId").val('');
    $("#cboFixeddeductionType").val('0').selectpicker('refresh');
    $('#cboFixeddeductionType').prop('disabled', false).selectpicker('refresh');
    //$("#cboFixeddeductionStatus").val('0').selectpicker('refresh');
    $('#cboFixeddeductionStatus').prop('disabled', false).selectpicker('refresh');
    $("#txtDeductionDesc").val('');
    $("#txtFixeddeductionamount").val('');
    $("#txtNoofInstallments").val('');
    $("#txtFixeddeductionPaidamount").val('0');
    $("#txtReferencedetail").val('');
    $("#chkSkipPayroll").parent().addClass("is-checked");
    $("#btnSaveFixedDeduction").attr("disabled", false);
    $("#btnSaveFixedDeduction").html("Save");
}

$("#btnCancelFixedDeduction").click(function () {
    $("#jqgFixedDeduction").jqGrid('resetSelection');
    $('#PopupFixedDeduction').modal('hide');
    fnClearFixedDeductionFields();
});