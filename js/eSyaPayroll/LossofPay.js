$(document).ready(function () {
    
    fnGridLoadLossofPay();
});

var selICol, selIRow;
function fnGridLoadLossofPay() {
    $("#jqgLossofPay").GridUnload();
    $("#jqgLossofPay").jqGrid({
        url: getBaseURL() + '/AttendanceProcess/GetLossofPaybyBusinessKeyAndPayperiod?Payperiod=' + $("#cboPayperiod").val(),
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'POST',
        colNames: [localization.BusinessKey, localization.PayPeriod, localization.EmployeeName, localization.EmployeeNumber, localization.Workingdays, localization.Holidays, localization.WeeklyOffs, localization.AttendedDays, localization.AbsentDays, localization.LateComingDays, localization.ArrearDays, localization.PayableDays, localization.Status],
        colModel: [
            {
                name: "BusinessKey", width: 70, search: false, align: 'left', editable: true,
                editoptions: { maxlength: 6 }, resizable: false, hidden: true
            },
            {
                name: "PayPeriod", width: 70, search: false,
                editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text', hidden: true
            },
            {
                name: "EmployeeName", width: 80, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "EmployeeNumber", width: 70, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text', hidden: true
            },
            {
                name: "WorkingDays", width: 35, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "Holidays", width: 35, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "WeeklyOffs", width: 35, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "AttendedDays", width: 35, search: false, editable: false, hidden: true,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "AbsentDays", editable: true, search: false, width: 30, align: 'left', resizeable: false,
                editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }
            },
            {
                name: "LateComingDays", editable: true, search: false, width: 30, align: 'left', resizeable: false,
                editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }
            },
            {
                name: "ArrearDays", width: 35, search: false, editable: false, hidden: true,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "PayableDays", width: 35, search: false, editable: false, hidden: true,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "ActiveStatus", width: 30, search: false, editable: false, align: 'center',
                edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }
            }
        ],
        rowNum: 10000, 
        pager: "#jqpLossofPay",
        pgtext: null,
        pgbuttons: null,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        shrinkToFit: true,
        autowidth: true,
        loadonce: true,
        scroll: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        ignoreCase: true,
       
        ondblClickRow: function (id) {

            //fnCalculateFactorGrid(id);
        },
        afterSaveCell: function (rowid, cellname, value, iRow, iCol) {
        },
        loadComplete: function (data) {
           
        }
    }).jqGrid('navGrid', '#jqpLossofPay', { add: false, edit: false, search: false, del: false, refresh: false });

    jQuery("#jqgLossofPay").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
    $(window).on("resize", function () {
        var $grid = $("#jqgLossofPay"),
            newWidth = $grid.closest(".c_jqgLossofPay").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });

    jQuery("#jqgLossofPay").trigger('reloadGrid');
}

function fnEnter() {
    return editopt = {
        dataInit: function (elem) { $(elem).focus(function () { this.select(); }); },
        dataEvents: [
            {
                type: 'keydown',
                fn: function (e) {
                    var key = e.charCode || e.keyCode;
                    if (key === 13)//enter
                    {
                        setTimeout("jQuery('#jqgLossofPay').editCell(" + selIRow + " + 1, " + selICol + ", true);", 100);
                    }
                }
            }
        ]
    };
}

function OnlyNumeric(e) {

    if ((e.which < 48 || e.which > 57)) {
        if (e.which === 8 || e.which === 46 || e.which === 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

function fnSaveLossofPay() {
    
    if (($("#cboPayperiod").val() === '0' || $("#cboPayperiod").val() === "")) {
        toastr.warning("Please Select Pay Period to add Loss of Pay");
        return;
    }
    var $grid = $("#jqgLossofPay");
    var l_pay = [];
    var ids = jQuery("#jqgLossofPay").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLossofPay').jqGrid('getRowData', rowId);
        
        if (!IsStringNullorEmpty(rowData.AbsentDays && rowData.LateComingDays)) {
            l_pay.push({
                BusinessKey:0,
                PayPeriod: rowData.PayPeriod,
                EmployeeNumber: rowData.EmployeeNumber,
                WorkingDays: rowData.WorkingDays,
                Holidays: rowData.Holidays,
                WeeklyOffs: rowData.WeeklyOffs,
                AttendedDays: rowData.AttendedDays,
                AbsentDays: rowData.AbsentDays,
                LateComingDays: rowData.LateComingDays,
                ArrearDays: rowData.ArrearDays,
                PayableDays: rowData.PayableDays,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }
    if (l_pay.length > 0) {
        $("#btnSave").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/AttendanceProcess/UpdateLossofPAY',
            type: 'POST',
            datatype: 'json',
            data: { obj: l_pay },
            async: false,
            success: function (response) {
                if (response.Status === true) {
                    toastr.success("saved");
                    fnGridLoadLossofPay();
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSave").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSave").attr("disabled", false);
            }
        });

    }
}

$(document).on('focusout', '[role="gridcell"] *', function () {
    var $input = $("#jqgLossofPay").find(".edit-cell input");
    if ($input.length === 1) {
        var e = $.Event("keydown");
        //e.which = 13;
        e.keyCode = 13;
        $input.trigger(e);
    }
});