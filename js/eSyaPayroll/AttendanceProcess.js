$(document).ready(function () {
    fnGridLoadAttendanceProcess();
});

var selICol, selIRow;
function fnGridLoadAttendanceProcess() {
    $("#jqgAttandanceProcess").GridUnload();
    $("#jqgAttandanceProcess").jqGrid({
        url: getBaseURL() + '/AttendanceProcess/GetEmployeesbyBusinessKeyAndPayperiod?Payperiod=' + $("#cboPayperiod").val(),
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'POST',
        colNames: [localization.BusinessKey, localization.PayPeriod, localization.EmployeeName, localization.EmployeeNumber, localization.Workingdays, localization.Holidays, localization.WeeklyOffs, localization.Status],
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
                name: "WorkingDays", width: 35, search: false, editable: false, hidden: true,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },

            {
                name: "Holidays", width: 35, search: false, editable: false, hidden: true,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "WeeklyOffs", width: 35, search: false, editable: false, hidden: true,
                editoptions: { disabled: true }, align: 'left', edittype: 'text'
            },
            {
                name: "ActiveStatus", width: 30, search: false, editable: true, align: 'center', formatoptions: { disabled: false },
                edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }
            },
             

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
        scroll: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        ignoreCase: true,
        
        ondblClickRow: function (id) {
        },
        afterSaveCell: function (rowid, cellname, value, iRow, iCol) {
        },
        loadComplete: function (data) {
            
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

function fnSaveAttandanceProcess() {
    
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

        if (rowData.ActiveStatus === "true") {
            att_process.push({
                BusinessKey: 0,
                PayPeriod: $("#cboPayperiod").val(),
                EmployeeNumber: rowData.EmployeeNumber,
                WorkingDays: rowData.WorkingDays,
                Holidays: rowData.Holidays,
                WeeklyOffs: rowData.WeeklyOffs,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }
    if (att_process.length > 0) {
        $("#btnSave").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/AttendanceProcess/InsertorUpdateAttendanceProcess',
            type: 'POST',
            datatype: 'json',
            data: { obj: att_process },
            async: false,
            success: function (response) {
                if (response.Status === true) {
                    toastr.success("saved");
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
    var $input = $("#jqgAttandanceProcess").find(".edit-cell input");
    if ($input.length === 1) {
        var e = $.Event("keydown");
        e.keyCode = 13;
        $input.trigger(e);
    }
});