
$(document).ready(function () {
    $('#cboPayperiod').selectpicker('refresh');
    fnBusinessLocation_onChange();
  //  fnGridLoadAttendanceProcess();
});

function fnBusinessLocation_onChange() {
 fnBindPayPeriod();
}

function fnBindPayPeriod() {
    $('#cboPayperiod').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/AttendanceProcess/GetPayPeriodbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboPayperiod').empty();
            // $("#cboPayperiod").append($("<option value='0'>Select</option>"));
            if (result !== null) {
                for (var i = 0; i < result.length; i++) {
                    $("#cboPayperiod").append($("<option></option>").val(result[i]["PayPeriod"]).html(result[i]["PayPeriod"]));
                }
            }
            $('#cboPayperiod').val($("#cboPayperiod option:first").val());
            $('#cboPayperiod').selectpicker('refresh');
            fnGridLoadAttendanceProcess();
        }
    });
}

var selICol, selIRow;
function fnGridLoadAttendanceProcess() {
    $("#jqgAttandanceProcess").GridUnload();
    $("#jqgAttandanceProcess").jqGrid({
        url: getBaseURL() + '/AttendanceProcess/GetAttendanceProcessbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val() + "&Payperiod=" + $("#cboPayperiod").val(),
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'POST',
        colNames: ["Business Key", "Pay Period", "Employee Name", "Employee Number", "Total Days", "Working days", "Is Vacation Pay", "Lop days", "Vacation Days", "Vacation payable %", "Vacation Payable days", "Payable days", "Attendance Factor", "Status"],
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
                name: "TotalDays", width: 35, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "Workingdays", width:35, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "IsVacationPay", width: 80, search: false, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox',
                editoptions: { value: "true:false" }, hidden: true
            },
            {
                name: "Lopdays", editable: true, search: false, width: 30, align: 'left', resizeable: false,
                editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }
            },
            {
                name: "VacationDays", editable: true, search: false, width: 30, align: 'left', resizeable: false,
                editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }
            },
            {
                name: "VacationPayPercentage", editable: true, search: false, width:30, align: 'left', resizeable: false,
                editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }
            },
            {
                name: "VaccationPayDays", editable: false, search: false, width: 30, align: 'left', resizeable: false,
                editoptions: { onkeypress: 'return OnlyNumeric(event)' }
            },
            {
                name: "AttendedDays", width: 40, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "AttendanceFactor", width: 35, search: false, editable: false,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "ActiveStatus", width: 30, search: false, editable: false, align: 'center',
                edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }
            }
        ],
        rowNum: 10000,
        pager: "#jqpAttandanceProcess",
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
        scroll:true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        ignoreCase: true,
        //beforeEditCell: function (rowid, cellname, value, iRow, iCol) {
        //    selICol = iCol;
        //    selIRow = iRow;
        //},
        //onSelectRow: function (id) {
        //    if (id) { $('#jqgAttandanceProcess').jqGrid('editRow', id, true); }

        //},
        ondblClickRow: function (id) {

            //fnCalculateFactorGrid(id);
        },
        afterSaveCell: function (rowid, cellname, value, iRow, iCol) {

            var rowData = $('#jqgAttandanceProcess').jqGrid('getRowData', rowid);
            var TotalDays = parseFloat(rowData["TotalDays"]);
            var Workingdays = parseFloat(rowData["Workingdays"]);
            var Lopdays = parseFloat(rowData["Lopdays"]);
            var VacationDays = parseFloat(rowData["VacationDays"]);
            var VacationPercentage = parseFloat(50);
            var VacationPayPercentage = parseFloat(rowData["VacationPayPercentage"]);
            var VaccationPayDays = parseFloat(rowData["VaccationPayDays"]);

            if (Lopdays > Workingdays)
                Lopdays = Workingdays;

            if (VacationDays > Workingdays - Lopdays)
                VacationDays = Workingdays - Lopdays;

            if (VacationDays > 0) {
                if (VacationPayPercentage <= 0)
                    VacationPayPercentage = VacationPercentage;
            }

            if (VacationPayPercentage > 100)
                VacationPayPercentage = 100;

            VaccationPayDays = VacationDays * VacationPayPercentage / 100;

            var AttendedDays = Workingdays - Lopdays - VaccationPayDays;
            var AttendanceFactor = (AttendedDays / TotalDays).toFixed(6);
            //rowData["AttendedDays"] = AttendedDays;

            $("#jqgAttandanceProcess").jqGrid('setCell', rowid, "Lopdays", Lopdays);
            $("#jqgAttandanceProcess").jqGrid('setCell', rowid, "VacationDays", VacationDays);
            $("#jqgAttandanceProcess").jqGrid('setCell', rowid, "VacationPayPercentage", VacationPayPercentage);
            $("#jqgAttandanceProcess").jqGrid('setCell', rowid, "VaccationPayDays", VaccationPayDays);
            $("#jqgAttandanceProcess").jqGrid('setCell', rowid, "AttendedDays", AttendedDays);
            $("#jqgAttandanceProcess").jqGrid('setCell', rowid, "AttendanceFactor", AttendanceFactor);
        },
        loadComplete: function (data) {
            //var $grid = $("#jqgAttandanceProcess"),
            //    newWidth = $grid.closest(".c_jqgAttandanceProcess").parent().width();
            //$grid.jqGrid("setGridWidth", newWidth, true);
        }
    }).jqGrid('navGrid', '#jqpAttandanceProcess', { add: false, edit: false, search: false, del: false, refresh: false });

    jQuery("#jqgAttandanceProcess").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
    $(window).on("resize", function () {
        var $grid = $("#jqgAttandanceProcess"),
            newWidth = $grid.closest(".c_jqgAttandanceProcess").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });

    jQuery("#jqgAttandanceProcess").trigger('reloadGrid');
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
                        setTimeout("jQuery('#jqgAttandanceProcess').editCell(" + selIRow + " + 1, " + selICol + ", true);", 100);
                    }
                }
            }
        ]
    };
}


//function fnCalculateFactorGrid(rowId) {

//    var working_days = parseFloat($('#jqgAttandanceProcess').jqGrid('getCell', rowId, 'Workingdays'));
//    var lop_days = parseFloat($('#jqgAttandanceProcess').jqGrid('getCell', rowId, 'Lopdays'));

//   if (isNaN(lop_days)) {
//        return;
//    }

//    if (lop_days >= working_days) {
//        $("#jqgAttandanceProcess").jqGrid("setCell", rowId, "AttendedDays", 0);
//        $("#jqgAttandanceProcess").jqGrid("setCell", rowId, "AttendanceFactor", 0);
//        $("#jqgAttandanceProcess").jqGrid("setCell", rowId, "Lopdays", 0);
//        return;
//    }
//    else {
//        var attend_days = (working_days - lop_days).toFixed(1);

//        var attandance_factor = (working_days / attend_days).toFixed(1);

//        //var attandance_factor = (attend_days / working_days).toFixed(1);
//        $("#jqgAttandanceProcess").jqGrid("setCell", rowId, "AttendedDays", attend_days);
//        $("#jqgAttandanceProcess").jqGrid("setCell", rowId, "AttendanceFactor", attandance_factor);
//    }
//}

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

function fnSaveAttandanceProcess() {
    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select a Business Key to add Attendance Process");
        return;
    }
    if (($("#cboPayperiod").val() === '0' || $("#cboPayperiod").val() === "")) {
        toastr.warning("Please Select a Pay Period to add Attendance Process");
        return;
    }
    var $grid = $("#jqgAttandanceProcess");
    var att_process = [];
    var ids = jQuery("#jqgAttandanceProcess").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgAttandanceProcess').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.Lopdays)) {
            att_process.push({
                BusinessKey: $("#cboBusinessLocation").val(),
                PayPeriod: $("#cboPayperiod").val(),
                EmployeeNumber: rowData.EmployeeNumber,
                Lopdays: rowData.Lopdays,
                IsVacationPay: rowData.IsVacationPay,
                VacationDays: rowData.VacationDays,
                VacationPayPercentage: rowData.VacationPayPercentage,
                VaccationPayDays: rowData.VaccationPayDays,
                AttendedDays: rowData.AttendedDays,
                AttendanceFactor: rowData.AttendanceFactor,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }
    if (att_process.length > 0) {
        $("#btnSave").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/AttendanceProcess/InsertOrUpdateAttandanceProcess',
            type: 'POST',
            datatype: 'json',
            data: { obj: att_process },
            async: false,
            success: function (response) {
                if (response.Status === true) {
                    toastr.success("saved");
                   // $("#jqgAttandanceProcess").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                    fnGridLoadAttendanceProcess();
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
    //$("#jqgAttandanceProcess").jqGrid('editCell', 0, 0, false);
    var $input = $("#jqgAttandanceProcess").find(".edit-cell input");
    if ($input.length === 1) {
        var e = $.Event("keydown");
        //e.which = 13;
        e.keyCode = 13;
        $input.trigger(e);
    }
});

//function SetGridControlByAction() {
//    $("#btnSave").attr("disabled", false);
//    if (_userFormRole.IsEdit === false) {
//        $("#btnSave").attr("disabled", true);
//    }
//    if (_userFormRole.IsInsert === false) {
//        $("#btnSave").attr("disabled", true);
//    }
//}