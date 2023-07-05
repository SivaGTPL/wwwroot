$(document).ready(function () {
    fnGridLoadIncentiveAmount();
});


function fnGridLoadIncentiveAmount() {

    $("#jqgIncentiveAmount").jqGrid('GridUnload');

    $("#jqgIncentiveAmount").jqGrid({
        url: getBaseURL() + '/VariableEntry/GetIncentiesbyBusinessKeyPayPeriodAndErCode?Payperiod=' + $("#cboPayperiod").val() + "&Ercode=" + $("#cboErcode").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Employee Number", "Employee Name", "Pay Period","Ercode", "Incentive Amount (local currency)", "Status"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "EmployeeNumber", width: 50, editable: true, align: 'left', hidden: true },
            { name: "EmployeeName", width: 150, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "PayPeriod", width: 150, editable: true, align: 'left', edittype: 'text', hidden: true, editoptions: { maxlength: 15 } },
            { name: "Ercode", width: 150, editable: true, align: 'left', edittype: 'text', hidden: true, editoptions: { maxlength: 15 } },
            {
                name: "Amount", width: 150, editable: true, align: 'right', edittype: 'text', formatter: "number", formatoptions: { decimalPlaces: 0 }, editoptions: {
                    maxlength: 18,
                    dataInit: function (element) {
                        $(element).keypress(function (evt) {

                            var charCode = (evt.which) ? evt.which : event.keyCode;
                            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57))
                                return false;

                            return true;
                        });
                    }
                }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        rowNum: 10000,
        pager: "#jqpIncentiveAmount",
        pgtext: null,
        pgbuttons: null,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: false,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        footerrow: true,
        gridComplete: function () {
            var $grid = $('#jqgIncentiveAmount');
            var colSum = $grid.jqGrid('getCol', 'Amount', false, 'sum');
            $grid.jqGrid('footerData', 'set', { 'Amount': colSum });
        },
        onSelectRow: function (id) {
            if (id) { $('#jqgIncentiveAmount').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgIncentiveAmount").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

        }
    }).
        jqGrid('navGrid', '#jqpIncentiveAmount', { add: false, edit: false, search: false, del: false, refresh: false }).
        jqGrid('navButtonAdd', '#jqpIncentiveAmount', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshLoadIncentiveAmount
        });
}

function fnGridRefreshLoadIncentiveAmount() {
    $("#jqgIncentiveAmount").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveIncentiveAmount() {
    debugger;
    if (IsStringNullorEmpty($("#cboPayperiod").val())) {
        toastr.warning("Please select a Pay Period");
        return false;
    }
    if (IsStringNullorEmpty($("#cboErcode").val())) {
        toastr.warning("Please select a ER Code");
        return false;
    }
    var v_incentives = [];
    var ids = jQuery("#jqgIncentiveAmount").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgIncentiveAmount').jqGrid('getRowData', rowId);
        if (!IsStringNullorEmpty(rowData.Amount) && rowData.Amount != "0") {
            v_incentives.push({
                BusinessKey: 0,
                PayPeriod: $("#cboPayperiod").val(),
                Ercode: $("#cboErcode").val(),
                EmployeeNumber: rowData.EmployeeNumber,
                Amount: rowData.Amount,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/VariableEntry/InsertOrUpdateVariableIncentiveEntry',
        type: 'POST',
        datatype: 'json',
        data: { obj: v_incentives },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("saved");
                fnGridRefreshLoadIncentiveAmount();
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


$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgIncentiveAmount").jqGrid('editCell', 0, 0, false);
    var $input = $("#jqgIncentiveAmount").find(".edit-cell input");
    if ($input.length === 1) {
        var e = $.Event("keydown");
        e.which = 13;
        e.keyCode = 13;
        $input.trigger(e);
    }
});

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    if (_userFormRole.IsEdit === false) {
        $("#btnSave").attr("disabled", true);
    }
}