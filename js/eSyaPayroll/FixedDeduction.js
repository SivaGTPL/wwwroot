
var actiontype = "";
function fnGridFixedDeduction() {
    $("#jqgFixedDeduction").GridUnload();

    $("#jqgFixedDeduction").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeeFixedDeductionInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ERCode, localization.Amount, localization.NoofInstallments, localization.PaidAmount, localization.ReferenceDetail, localization.Status, localization.SkipPayroll, localization.Actions],
        colModel: [
            { name: "Ercode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "Amount", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "NoOfinstallment", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "PaidAmount", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ReferenceDetail", width: 205, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Status", editable: true, width: 90, edittype: "select", align: 'left', formatter: 'select', hidden: true, editoptions: { value: "A:Active;C:Closed" } },
            { name: "SkipinPayroll", width: 155, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
           {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditFixedDeductions(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditFixedDeductions(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ],
        pager: "#jqpFixedDeduction",
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
    }).jqGrid('navGrid', '#jqpFixedDeduction', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpFixedDeduction', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshFixedDeduction
    }).jqGrid('navButtonAdd', '#jqpFixedDeduction', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddFixedDeduction
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgFixedDeduction"),
            newWidth = $grid.closest(".FixedDeductioncontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddFixedDeduction() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearFixedDeductionFields();
    $('#PopupFixedDeduction').find('.modal-title').text(localization.AddFixedDeductionDetails);
    $('#PopupFixedDeduction').modal('show');
    $("#btnSaveFixedDeduction").attr("disabled", false);
    $("#btnSaveFixedDeduction").html(localization.Save);
    $("#btnSaveFixedDeduction").show();
    $("#btnCancelFixedDeduction").show();
    $("#chkSkipPayroll").prop('disabled', false);
    $("#chkSkipPayroll").parent().addClass("is-checked");
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnEditFixedDeductions(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgFixedDeduction').jqGrid('getRowData', rowid);

    $("#cboFixeddeductionErcode").val(rowData.Ercode).selectpicker('refresh');
    $('#cboFixeddeductionErcode').prop('disabled', true).selectpicker('refresh');
    $("#txtFixeddeductionamount").val(rowData.Amount);
    $("#txtNoofInstallments").val(rowData.NoOfinstallment);
    $("#txtFixeddeductionPaidamount").val(rowData.PaidAmount);
    $("#txtReferencedetail").val(rowData.ReferenceDetail);
    $("#cboFixeddeductionStatus").val(rowData.Status).selectpicker('refresh');
    if (rowData.SkipinPayroll == 'true') {
        $("#chkSkipPayroll").parent().addClass("is-checked");
    }
    else {
        $("#chkSkipPayroll").parent().removeClass("is-checked");
    }
    $("#btnSaveFixedDeduction").attr("disabled", false);
    $('#PopupFixedDeduction').modal('show');


    if (actiontype.trim() == "edit") {
        $('#PopupFixedDeduction').find('.modal-title').text(localization.UpdateFixedDeductionDetails);
        $("#btnSaveFixedDeduction").show();
        $("#btnCancelFixedDeduction").show();
        $("#btnSaveFixedDeduction").html(localization.Update);
        $("#chkSkipPayroll").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);

    }

    if (actiontype.trim() == "view") {
        $('#PopupFixedDeduction').find('.modal-title').text(localization.ViewFixedDeductionDetails);
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
    var objFixed = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        Ercode: $("#cboFixeddeductionErcode").val(),
        Amount: $("#txtFixeddeductionamount").val(),
        NoOfinstallment: $("#txtNoofInstallments").val(),
        PaidAmount: $("#txtFixeddeductionPaidamount").val(),
        ReferenceDetail: $("#txtReferencedetail").val(),
        Status: $("#cboFixeddeductionStatus").val(),
        SkipinPayroll: $("#chkSkipPayroll").parent().hasClass("is-checked")

    };
    $("#btnSaveFixedDeduction").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeFixedDeductionInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objFixed },
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
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if ($("#cboFixeddeductionErcode").val() == 0 || $("#cboFixeddeductionErcode").val() == "0") {
        toastr.warning("Please select a ER Code");
        return false;
    }

    if (IsStringNullorEmpty($("#txtFixeddeductionamount").val())) {
        toastr.warning("Please Enter the Amount");
        return false;
    }

    if (IsStringNullorEmpty($("#txtNoofInstallments").val())) {
        toastr.warning("Please Enter the No of Installments");
        return false;
    }
    if (IsStringNullorEmpty($("#txtFixeddeductionPaidamount").val())) {
        toastr.warning("Please Enter the Paid Amount");
        return false;
    }
    if ($("#cboFixeddeductionStatus").val() == 0 || $("#cboFixeddeductionStatus").val() == "0") {
        toastr.warning("Please select a Status");
        return false;
    }
}


function fnGridRefreshFixedDeduction() {
    $("#jqgFixedDeduction").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFixedDeductionFields() {
    $("#cboFixeddeductionErcode").val('0').selectpicker('refresh');
    $('#cboFixeddeductionErcode').prop('disabled', false).selectpicker('refresh');
    $("#cboFixeddeductionStatus").val('0').selectpicker('refresh');
    $("#txtFixeddeductionamount").val('');
    $("#txtNoofInstallments").val('');
    $("#txtFixeddeductionPaidamount").val('');
    $("#txtReferencedetail").val('');
    $("#chkSkipPayroll").parent().addClass("is-checked");
    $("#btnSaveFixedDeduction").attr("disabled", false);
    $("#btnSaveFixedDeduction").html(localization.Save);
}


$("#btnCancelFixedDeduction").click(function () {
    $("#jqgFixedDeduction").jqGrid('resetSelection');
    $('#PopupFixedDeduction').modal('hide');
    fnClearFixedDeductionFields();
});