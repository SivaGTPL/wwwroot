$(document).ready(function () {
    fnGridLoadPayPeriod();
    $('#txtPayPeriod').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});

//function fnBusinessLocation_onChange() {

//    fnGridLoadPayPeriod();
//}


var _isInsert = true;
var actiontype = "";
function fnGridLoadPayPeriod() {

    $("#jqgPayPeriod").jqGrid('GridUnload');
    $("#jqgPayPeriod").jqGrid({
        url: getBaseURL() + '/PayPeriod/GetPayPeriods',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Pay Period Date", "Pay Period", "Working Days", "Holidays","Weekly Offs", "Freeze Payroll", "Post to Finance", "Status", "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "PayPeriodDate", editable: true, width: 90, align: 'left', formatter: 'date', hidden: true },
            { name: "PayPeriod", width: 100, editable: true, align: 'left', hidden: false },
            { name: "WorkingDays", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Holidays", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "WeeklyOffs", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "IsPayrollFreezed", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "IsFinancePosted", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditPayPeriod(event,\'edit\')"><i class="fas fa-pencil-alt"></i> ' + 'Edit' + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditPayPeriod(event,\'view\')"><i class="far fa-file-alt"></i> ' + 'View' + ' </button>'

                }
            }],
        pager: "#jqpPayPeriod",
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
        },
        ondblClickRow: function (rowid, iRow, iCol) {
            jQuery("#jqgPayPeriod").editCell(iRow, iCol, true);
        },
    })
        .jqGrid('navGrid', '#jqpPayPeriod', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpPayPeriod', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPayPeriod
        })
        .jqGrid('navButtonAdd', '#jqpPayPeriod', {
            caption: '<span class="fa fa-plus"></span> Add', buttonicon: "none", id: "custAdd", position: "first", onClickButton: fnAddPayPeriod
        });

    fnAddGridSerialNoHeading();
}

function fnAddPayPeriod() {
        _isInsert = true;
        fnClearPayPeriodFields();
        $('#PopupPayPeriod').find('.modal-title').text('Add Pay Period');
        $('#PopupPayPeriod').modal('show');
        $("#btnSavePayPeriod").show();
        $("#btnSavePayPeriod").html('Save');
        $("#chkIsPayRollFreezed").prop('disabled', false);
        $("#chkIsFinancePosted").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtPayPeriod").prop('disabled', false);
}

function fnEditPayPeriod(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgPayPeriod').jqGrid('getRowData', rowid);

    if (rowData.PayPeriodDate !== null) {
        //setDate($('#txtPayPeriod'), rowData.PayPeriod);
        setDate($('#txtPayPeriod'), rowData.PayPeriodDate);
    }
    else {
        $('#txtPayPeriod').val('');
    }
    $("#txtPayPeriod").prop('disabled', true);
    $("#txtWorkingdays").val(rowData.WorkingDays);
    $("#txtHolidays").val(rowData.Holidays);
    $("#txtWeeklyoffs").val(rowData.WeeklyOffs);
    if (rowData.IsPayrollFreezed == 'true') {
        $("#chkIsPayRollFreezed").parent().addClass("is-checked");
    }
    else {
        $("#chkIsPayRollFreezed").parent().removeClass("is-checked");
    }
    if (rowData.IsFinancePosted == 'true') {
        $("#chkIsFinancePosted").parent().addClass("is-checked");
    }
    else {
        $("#chkIsFinancePosted").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    $("#btnSavePayPeriod").attr("disabled", false);
    $('#PopupPayPeriod').modal('show');
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        $('#PopupPayPeriod').find('.modal-title').text('Update Pay Period');
        $("#btnSavePayPeriod").show();
        $("#btnSavePayPeriod").html('Update');
        $("#chkIsPayRollFreezed").prop('disabled', false);
        $("#chkIsFinancePosted").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtPayPeriod").prop('disabled', true);
    }

    if (actiontype.trim() == "view") {
        $('#PopupPayPeriod').find('.modal-title').text('View Pay Period');
        $("#btnSavePayPeriod").attr("disabled", true);
        $("#btnSavePayPeriod").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#chkIsPayRollFreezed").prop('disabled', true);
        $("#chkIsFinancePosted").prop('disabled', true);
        $("#chkActiveStatus").prop('disabled', true);
        $("#txtPayPeriod").prop('disabled', true);
    }
}

function fnSavePayPeriod() {
    debugger;
    if (IsValidPayPeriod() === false) {
        return;
    }

    var objpayperiod = {
        BusinessKey: "0",
        PayPeriod: $("#txtPayPeriod").val(),
        PayPeriodDate: $("#txtPayPeriod").val(),
        WorkingDays: $("#txtWorkingdays").val(),
        Holidays: $("#txtHolidays").val(),
        WeeklyOffs: $("#txtWeeklyoffs").val(),
        IsPayrollFreezed: $("#chkIsPayRollFreezed").parent().hasClass("is-checked"),
        IsFinancePosted: $("#chkIsFinancePosted").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSavePayPeriod").attr('disabled', true);
    $.ajax({
        
        url: getBaseURL() + '/PayPeriod/InsertOrUpdateIntoPayPeriod',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objpayperiod },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupPayPeriod').modal('hide');
                fnGridRefreshPayPeriod();
                $("#btnSavePayPeriod").attr('disabled', false);
                fnClearPayPeriodFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePayPeriod").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePayPeriod").attr('disabled', false);
        }
    });

}

function IsValidPayPeriod() {

    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select a  Business Key");
        return false;
    }
    if (IsStringNullorEmpty($("#txtPayPeriod").val())) {
        toastr.warning("Please Select a Pay Period");
        return false;
    }
    if (IsStringNullorEmpty($("#txtWorkingdays").val())) {
        toastr.warning("Please Enter the Working days");
        return false;
    }
    if (IsStringNullorEmpty($("#txtHolidays").val())) {
        toastr.warning("Please Enter the Holidays");
        return false;
    }
    if (IsStringNullorEmpty($("#txtWeeklyoffs").val())) {
        toastr.warning("Please Enter the Weekly Offs");
        return false;
    }
}

function fnGridRefreshPayPeriod() {
    $("#jqgPayPeriod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearPayPeriodFields() {
    $("#txtPayPeriod").val('');
    $("#txtPayPeriod").prop('disabled', false);
    $("#txtWorkingdays").val('');
    $("#txtHolidays").val('');
    $("#txtWeeklyoffs").val('');
    $("#chkIsPayRollFreezed").parent().removeClass("is-checked");
    $("#chkIsFinancePosted").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSavePayPeriod").attr("disabled", false);
    $("#btnSavePayPeriod").html('Save');
}

$("#btnCancelPayPeriod").click(function () {
    $("#jqgPayPeriod").jqGrid('resetSelection');
    $('#PopupPayPeriod').modal('hide');
    fnClearPayPeriodFields();
});

