
var actiontype = "";
function fnGridSalaryDetails() {

    $("#jqgSalaryDetails").GridUnload();

    $("#jqgSalaryDetails").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeeSalaryInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ERCode, localization.Amount, localization.EffectiveFrom, localization.EffectiveTill, localization.Status, localization.Actions],
        colModel: [
            { name: "Ercode", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "Amount", width: 155, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            //{ name: "EffectiveFrom", editable: true, width:140, align: 'left', formatter: 'date' },
            //{ name: "EffectiveTill", editable: true, width: 140, align: 'left', formatter: 'date'},
            {
                name: 'EffectiveFrom', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'EffectiveTill', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 125, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSalaryDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSalaryDetails(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ],
        pager: "#jqpSalaryDetails",
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
    }).jqGrid('navGrid', '#jqpSalaryDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSalaryDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSalaryDetails
    }).jqGrid('navButtonAdd', '#jqpSalaryDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSalaryDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgSalaryDetails"),
            newWidth = $grid.closest(".SalaryDetailscontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddSalaryDetails() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearSalaryDetailsFields();
    $('#PopupSalaryDetails').find('.modal-title').text(localization.AddSalaryDetails);
    $('#PopupSalaryDetails').modal('show');
    $("#btnSaveSalaryDetails").attr("disabled", false);
    $("#btnSaveSalaryDetails").html(localization.Save);
    $("#btnSaveSalaryDetails").show();
    $("#btnCancelSalaryDetails").show();
    $("#chkAccountStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    
}

function fnEditSalaryDetails(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSalaryDetails').jqGrid('getRowData', rowid);

    $("#cboErcode").val(rowData.Ercode).selectpicker('refresh');
    $('#cboErcode').prop('disabled', true).selectpicker('refresh');
    $("#txtAmount").val(rowData.Amount);

    if (rowData.EffectiveFrom !== null) {
        //setDate($('#txtEffectivefrom'), rowData.EffectiveFrom);
        setDate($('#txtEffectivefrom').val (rowData.EffectiveFrom));
    }
    else {
        $('#txtEffectivefrom').val('');
    }
    $("#txtEffectivefrom").prop('disabled', true);
    if (rowData.EffectiveTill !== null) {
        //setDate($('#txtEffectivetill'), rowData.EffectiveTill);
        setDate($('#txtEffectivetill').val(rowData.EffectiveTill));
    }
    else {
        $('#txtEffectivetill').val('');
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkAccountStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkAccountStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveSalaryDetails").attr("disabled", false);
    $('#PopupSalaryDetails').modal('show');
   

    if (actiontype.trim() == "edit") {
        $('#PopupSalaryDetails').find('.modal-title').text(localization.UpdateSalaryDetails);
        $("#btnSaveSalaryDetails").show();
        $("#btnCancelSalaryDetails").show();
        $("#btnSaveSalaryDetails").html(localization.Update);
        $("#chkAccountStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        
    }

    if (actiontype.trim() == "view") {
        $('#PopupSalaryDetails').find('.modal-title').text(localization.ViewSalaryDetails);
        $("#btnSaveSalaryDetails").attr("disabled", true);
        $("#btnSaveSalaryDetails").hide();
        $("#btnCancelSalaryDetails").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#chkAccountStatus").prop('disabled', true);

    }

}

function fnSaveEmpSalaryDetails() {
    if (IsValidSalaryDetails() === false) {
        return;
    }
    var objsalinfo = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        Ercode: $("#cboErcode").val(),
        EffectiveFrom: $("#txtEffectivefrom").val(),
        Amount: $("#txtAmount").val(),
        EffectiveTill: $("#txtEffectivetill").val(),
        ActiveStatus: $("#chkAccountStatus").parent().hasClass("is-checked")

    };
    $("#btnSaveSalaryDetails").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeSalaryInfo',
        type: 'POST',
        datatype: 'json',
        data: {obj: objsalinfo },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupSalaryDetails').modal('hide');
                fnGridRefreshSalaryDetails();
                $("#btnSaveSalaryDetails").attr('disabled', false);
                fnClearSalaryDetailsFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveSalaryDetails").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveSalaryDetails").attr('disabled', false);
        }
    });

}

function IsValidSalaryDetails() {
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create he Employee details");
        return false;
    }
    if ($("#cboErcode").val() == 0 || $("#cboErcode").val() == "0") {
        toastr.warning("Please select a ER Code");
        return false;
    }
    
    if (IsStringNullorEmpty($("#txtAmount").val())) {
        toastr.warning("Please Enter the Amount");
        return false;
    }

    if (IsStringNullorEmpty($("#txtEffectivefrom").val())) {
        toastr.warning("Please Select a Effective From Date");
        return false;
    }
    
}

function fnGridRefreshSalaryDetails() {
    $("#jqgSalaryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearSalaryDetailsFields() {
    $("#cboErcode").val('0').selectpicker('refresh');
    $('#cboErcode').prop('disabled', false).selectpicker('refresh');
    $("#txtAmount").val('');
    $("#txtEffectivefrom").val('');
    $("#txtEffectivefrom").prop('disabled', false);
    $("#txtEffectivetill").val('');
    $("#chkAccountStatus").parent().addClass("is-checked");
    $("#btnSaveSalaryDetails").attr("disabled", false);
    $("#btnSaveSalaryDetails").html(localization.Save);
}

$("#btnCancelSalaryDetails").click(function () {
    $("#jqgSalaryDetails").jqGrid('resetSelection');
    $('#PopupSalaryDetails').modal('hide');
    fnClearSalaryDetailsFields();
});
