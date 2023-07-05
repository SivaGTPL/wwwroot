
 $(document).ready(function () {
   
     $('#btnSaveArreardetails').show();
     fnGridLoadPayTo();
});

function fnGridLoadPayTo() {
    $("#jqgPaid").GridUnload();
    $("#divpaid").hide();
    $('#btnSaveArreardetails').show();
    $("#divpayto").show();

    $("#jqgToPay").GridUnload();
    $("#jqgToPay").jqGrid({
        url: getBaseURL() + '/AttendanceProcess/GetPaidToEmployeesdetails?Payperiod=' + $("#cboPayperiod").val() +'&employeeNumber=' + $("#cboEmployeenumber").val(),
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'POST',
        colNames: ["", "", localization.YearMonth, localization.LOP, localization.PaidPeriod, localization.NoofdaysToPay],
        colModel: [
            { name: "BusinessKey", width: 20, editable: false, hidden: true, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "EmployeeNumber", width: 20, editable: false, hidden: true, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "PayPeriod", width: 20, editable: false, hidden: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "Lopdays", width: 60, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            {
                name: "PaidPeriod", width: 100, editable: true, hidden: false, editoptions: { disabled: false }, align: 'left', edittype: "text",
                editoptions: {
                    maxlengh: 5,
                    dataInit: function (element) {
                        $(element).keypress(function (e) {
                            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                return false;
                            }

                        }).focusout(function (e) {

                            if (this.value === "") {
                                $(element).val(0);
                            }
                        });
                    }
                }
            },

            { name: "ArrearDays", width: 100, editable: false, hidden: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },

            //{
            //    name: "ArrearDays", width: 100, editable: true, hidden: false, editoptions: { disabled: false }, align: 'left', edittype: "text",
            //    editoptions: {
            //        maxlengh: 5,
            //        dataInit: function (element) {
            //            $(element).keypress(function (e) {
            //                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //                    return false;
            //                }

            //            }).focusout(function (e) {
            //                if (this.value === "") {
            //                    $(element).val(0);
            //                }
            //            });
            //        }
            //    }
            //},

        ],
        rowNum: 10000,
        rownumWidth: 55,
        pager: "#jqpToPay",
        pgtext: null,
        pgbuttons: null,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        beforeSaveCell: function (rowid, celname, value, iRow, iCol) {

            var _lopdays = parseInt($("#jqgToPay").jqGrid('getCell', rowid, 'Lopdays'));
            var _paidperiod = parseInt(value);
            var arrerdays = parseInt(_lopdays - _paidperiod);
            if (_paidperiod > _lopdays) {
                toastr.warning("Paid period should not greater than LOP days");
                $('#jqgToPay').jqGrid('editRow', id, true);
            } else {

                $("#jqgToPay").jqGrid('setCell', rowid, 'ArrearDays', arrerdays);

            }
        },
        editurl: 'url',
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgToPay').jqGrid('editRow', id, true); }

        },
        ondblClickRow: function (rowid) {

        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgToPay").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

            fnAddGridSerialNoHeading();
        }
    }).jqGrid('navGrid', '#jqpToPay', { add: false, edit: false, search: false, del: false, refresh: false });

}

function fnGridLoadArrearDetails() {
    $("#jqgToPay").GridUnload();
    $("#divpayto").hide();
    $('#btnSaveArreardetails').hide();
    $("#divpaid").show();

    $("#jqgPaid").GridUnload();
    $("#jqgPaid").jqGrid({
        url: getBaseURL() + '/AttendanceProcess/GetArreardetails?Payperiod=' + $("#cboPayperiod").val() +'&employeeNumber=' + $("#cboEmployeenumber").val(),
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'POST',
        colNames: ["", "", localization.YearMonth, localization.LOP,/*"Paid Period",*/ localization.ArrearPaiddays],
        colModel: [
            { name: "BusinessKey", width: 20, editable: false, hidden: true, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "EmployeeNumber", width: 20, editable: false, hidden: true, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "PayPeriod", width: 20, editable: false, hidden: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "Lopdays", width: 60, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            //{name: "PaidPeriod", width: 60, editable: false, editoptions: {disabled: true }, align: 'left', edittype: 'text' },
            { name: "ArrearDays", width: 100, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
        ],
        rowNum: 10000,
        rownumWidth: 55,
        pager: "#jqpPaid",
        pgtext: null,
        pgbuttons: null,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgPaid').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgPaid").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

            fnAddGridSerialNoHeading();
        }
    }).jqGrid('navGrid', '#jqpPaid', { add: false, edit: false, search: false, del: false, refresh: false });

}


function fnSaveArreardetails() {

    var $grid = $("#jqgToPay");
    var arr_days = [];
    var ids = jQuery("#jqgToPay").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgToPay').jqGrid('getRowData', rowId);
        arr_days.push({
            BusinessKey: rowData.BusinessKey,
            EmployeeNumber: rowData.EmployeeNumber,
            PayPeriod: rowData.PayPeriod,
            PaidPeriod: rowData.PaidPeriod,
            Lopdays: rowData.Lopdays,
            ArrearDays: rowData.ArrearDays
        });

    }

    $("#btnSaveArreardetails").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/AttendanceProcess/InsertUpdateArreardays',
        type: 'POST',
        datatype: 'json',
        data: { obj: arr_days },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("saved");
                $("#jqgToPay").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                $("#btnSaveArreardetails").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveArreardetails").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveArreardetails").attr("disabled", false);
        }
    });

}  

   


 




    
