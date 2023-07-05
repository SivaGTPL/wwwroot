//As per New Requirement
$(document).ready(function () {

    fnBusinessLocation_onChange();
    // $('#cboPayperiod').selectpicker('refresh');
    // fnGridLoadIncentiveAmount();
});

function fnBusinessLocation_onChange() {

    fnBindPayPeriod();
}

function fnBindPayPeriod() {
    $('#cboPayperiod').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/VariableEntry/GetPayPeriodbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboPayperiod').empty();
            if (result !== null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboPayperiod").append($("<option></option>").val(result[i]["PayPeriod"]).html(result[i]["PayPeriod"]));
                }
            }
            $('#cboPayperiod').val($("#cboPayperiod option:first").val());
            $('#cboPayperiod').selectpicker('refresh');
            fnGridLoadIncentiveAmount();
        }
    });
}

function fnGridLoadIncentiveAmount() {

    $("#jqgIncentiveAmount").jqGrid('GridUnload');

    $("#jqgIncentiveAmount").jqGrid({
        url: getBaseURL() + '/VariableEntry/GetIncentiesbyBusinessKeyAndPayPeriod?Businesskey=' + $("#cboBusinessLocation").val() + "&Payperiod=" + $("#cboPayperiod").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Employee Number", "Employee Name", "Pay Period", "Incentive Amount (local currency)", "Status"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "EmployeeNumber", width: 50, editable: true, align: 'left', hidden: true },
            { name: "EmployeeName", width: 150, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "PayPeriod", width: 150, editable: true, align: 'left', edittype: 'text', hidden: true, editoptions: { maxlength: 15 } },
            {
                name: "VariableIncentiveAmount", width: 150, editable: true, align: 'right', edittype: 'text', formatter: "number", formatoptions: { decimalPlaces: 0 }, editoptions: {
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
            var colSum = $grid.jqGrid('getCol', 'VariableIncentiveAmount', false, 'sum');
            $grid.jqGrid('footerData', 'set', { 'VariableIncentiveAmount': colSum });
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

    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.warning("Please select a Business Key");
        return false;
    }
    if (IsStringNullorEmpty($("#cboPayperiod").val())) {
        toastr.warning("Please select a Pay Period");
        return false;
    }
    var v_incentives = [];
    var ids = jQuery("#jqgIncentiveAmount").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgIncentiveAmount').jqGrid('getRowData', rowId);
        if (!IsStringNullorEmpty(rowData.VariableIncentiveAmount) && rowData.VariableIncentiveAmount != "0") {
            v_incentives.push({
                BusinessKey: $("#cboBusinessLocation").val(),
                PayPeriod: $("#cboPayperiod").val(),
                EmployeeNumber: rowData.EmployeeNumber,
                VariableIncentiveAmount: rowData.VariableIncentiveAmount,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/VariableEntry/InsertOrUpdateVariableIncentive',
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



//As per Old Requirement

//$(document).ready(function () {
//    fnBusinessLocation_onChange();
//    $('#cboPayperiod').selectpicker('refresh');
//    $('#cboEmployeenumber').selectpicker('refresh');
//   // fnGridLoadIncentiveAmount();
//});

//function fnBusinessLocation_onChange() {

//    fnBindPayPeriod();
//}


//function fnBindPayPeriod() {
//    $('#cboPayperiod').selectpicker('refresh');
//    $.ajax({
//        url: getBaseURL() + '/VariableEntry/GetPayPeriodbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
//        datatype: 'json',
//        type: 'POST',
//        async: false,
//        contentType: 'application/json; charset=utf-8',
//        success: function (result) {
//            $('#cboPayperiod').empty();
//            //$("#cboPayperiod").append($("<option value='0'>Select</option>"));
//            if (result !== null) {
//                for (var i = 0; i < result.length; i++) {

//                    $("#cboPayperiod").append($("<option></option>").val(result[i]["PayPeriod"]).html(result[i]["PayPeriod"]));
//                }
//            }
//            $('#cboPayperiod').val($("#cboPayperiod option:first").val());
//            $('#cboPayperiod').selectpicker('refresh');
//            fnGridLoadIncentiveAmount();
//            fnBindEmployee();
//        }
//    });
//}



//function fnBindEmployee() {
//    $('#cboEmployeenumber').selectpicker('refresh');
//    $.ajax({
//        url: getBaseURL() + '/VariableEntry/GetEmployeesbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
//        datatype: 'json',
//        type: 'POST',
//        async: false,
//        contentType: 'application/json; charset=utf-8',
//        success: function (result) {
//            $('#cboEmployeenumber').empty();
//            $("#cboEmployeenumber").append($("<option value='0'>Select</option>"));
//            if (result != null) {
//                for (var i = 0; i < result.length; i++) {

//                    $("#cboEmployeenumber").append($("<option></option>").val(result[i]["EmployeeNumber"]).html(result[i]["EmployeeName"]));
//                }
//            }
//            $('#cboEmployeenumber').val($("#cboEmployeenumber option:first").val());
//            $('#cboEmployeenumber').selectpicker('refresh');
//        }
//    });
//}

//var _isInsert = true;
//var actiontype = "";
//function fnGridLoadIncentiveAmount() {
//    $("#jqgIncentiveAmount").jqGrid('GridUnload');

//    $("#jqgIncentiveAmount").jqGrid({
//        url: getBaseURL() + '/VariableEntry/GetIncentiesbyBusinessKeyAndPayPeriod?Businesskey=' + $("#cboBusinessLocation").val() + "&Payperiod=" + $("#cboPayperiod").val(),
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: ["Business Key", "Employee Number", "Employee Name", "Pay Period", "Incentive Amount (local currency)", "Status", "Actions"],
//        colModel: [
//            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
//            { name: "EmployeeNumber", width: 50, editable: true, align: 'left', hidden: true },
//            { name: "EmployeeName", width: 150, editable: true, align: 'left', hidden: false },
//            { name: "PayPeriod", width: 100, editable: true, align: 'left', hidden: true },
//            { name: "VariableIncentiveAmount", width: 70, align: 'right', editable: false, hidden: false, resizable: true },
//            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
//            {
//                name: 'edit', search: false, align: 'left', width: 54, sortable: false, resizable: false,
//                formatter: function (cellValue, options, rowdata, action) {
//                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditIncentiveAmount(event,\'edit\')"><i class="fas fa-pencil-alt"></i> ' + 'Edit' + ' </button>' +
//                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditIncentiveAmount(event,\'view\')"><i class="far fa-file-alt"></i> ' + 'View' + ' </button>'

//                }
//            }],
//        pager: "#jqpIncentiveAmount",
//        rowNum: 10,
//        rowList: [10, 20, 50, 100],
//        loadonce: true,
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        scroll: false,
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//         footerrow: true,
//        loadComplete: function (data) {
//            //SetGridControlByAction();
//        },
//        gridComplete: function () {
//            var $grid = $('#jqgIncentiveAmount');
//            var colSum = $grid.jqGrid('getCol', 'VariableIncentiveAmount', false, 'sum');
//            $grid.jqGrid('footerData', 'set', { 'VariableIncentiveAmount': colSum });
//        },
//        ondblClickRow: function (rowid, iRow, iCol) {
//            jQuery("#jqgIncentiveAmount").editCell(iRow, iCol, true);
//        }
//    })
//        .jqGrid('navGrid', '#jqpIncentiveAmount', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpIncentiveAmount', {
//            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshIncentiveAmount
//        })
//        .jqGrid('navButtonAdd', '#jqpIncentiveAmount', {
//            caption: '<span class="fa fa-plus"></span> Add', buttonicon: "none", id: "custAdd", position: "first", onClickButton: fnAddIncentiveAmount
//        });

//    fnAddGridSerialNoHeading();
//}

//function fnAddIncentiveAmount() {
//    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
//        toastr.warning("Please Select Business Key to add Incentive");

//    }
//    else {
//        _isInsert = true;
//        fnClearIncentiveAmountFields();
//        $('#PopupIncentiveAmount').find('.modal-title').text('Add Incentive Amount');
//        $('#PopupIncentiveAmount').modal('show');
//        $("#btnSaveIncentiveAmount").show();
//        $("#btnSaveIncentiveAmount").html('Save');
//        $("#chkActiveStatus").prop('disabled', false);
//        $("input,textarea").attr('readonly', false);
//        $("select").next().attr('disabled', false);
//        $('#cboEmployeenumber').val('0').selectpicker('refresh');
//        $('#cboEmployeenumber').prop('disabled', false).selectpicker('refresh');
//    }

//}

//function fnEditIncentiveAmount(e, actiontype) {
//    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
//    var rowData = $('#jqgIncentiveAmount').jqGrid('getRowData', rowid);

//    $('#cboEmployeenumber').val(rowData.EmployeeNumber).selectpicker('refresh');
//    $('#cboEmployeenumber').prop('disabled', true).selectpicker('refresh');

//    $("#txtIncentiveAmount").val(rowData.VariableIncentiveAmount);
//    if (rowData.ActiveStatus == 'true') {
//        $("#chkActiveStatus").parent().addClass("is-checked");
//    }
//    else {
//        $("#chkActiveStatus").parent().removeClass("is-checked");
//    }

//    $("#btnSaveIncentiveAmount").attr("disabled", false);
//    $('#PopupIncentiveAmount').modal('show');
//    _isInsert = false;

//    if (actiontype.trim() == "edit") {
//        $('#PopupIncentiveAmount').find('.modal-title').text('Update Incentive Amount');
//        $("#btnSaveIncentiveAmount").show();
//        $("#btnSaveIncentiveAmount").html('Update');
//        $("#chkActiveStatus").prop('disabled', false);
//        $("input,textarea").attr('readonly', false);
//        $('#cboEmployeenumber').prop('disabled', true).selectpicker('refresh');
//    }

//    if (actiontype.trim() == "view") {
//        $('#PopupIncentiveAmount').find('.modal-title').text('View Incentive Amount');
//        $("#btnSaveIncentiveAmount").attr("disabled", true);
//        $("#btnSaveIncentiveAmount").hide();
//        $("input,textarea").attr('readonly', true);
//        $("#chkActiveStatus").prop('disabled', true);
//        $('#cboEmployeenumber').prop('disabled', true).selectpicker('refresh');
//    }
//}

//function fnSaveIncentiveAmount() {

//    if (IsValidIncentiveAmount() === false) {
//        return;
//    }

//    var objadsal = {
//        BusinessKey: $("#cboBusinessLocation").val(),
//        EmployeeNumber: $("#cboEmployeenumber").val(),
//        PayPeriod: $("#cboPayperiod").val(),
//        PayPeriodDate: $("#txtPayPeriod").val(),
//        VariableIncentiveAmount: $("#txtIncentiveAmount").val(),
//        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
//    };
//    $("#btnSaveIncentiveAmount").attr('disabled', true);
//    $.ajax({
//        url: getBaseURL() + '/VariableEntry/InsertOrUpdateVariableIncentive',
//        type: 'POST',
//        datatype: 'json',
//        data: { isInsert: _isInsert, obj: objadsal },
//        success: function (response) {
//            if (response.Status) {
//                toastr.success(response.Message);
//                $('#PopupIncentiveAmount').modal('hide');
//                fnGridRefreshIncentiveAmount();
//                $("#btnSaveIncentiveAmount").attr('disabled', false);
//                fnClearIncentiveAmountFields();
//                return true;
//            }
//            else {
//                toastr.error(response.Message);
//                $("#btnSaveIncentiveAmount").attr('disabled', false);
//                return false;
//            }

//        },
//        error: function (error) {
//            toastr.error(error.statusText);
//            $("#btnSaveIncentiveAmount").attr('disabled', false);
//        }
//    });

//}

//function IsValidIncentiveAmount() {

//    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
//        toastr.warning("Please Select Business Key");
//        return false;
//    }
//    if (($("#cboPayperiod").val() === '0' || $("#cboPayperiod").val() === "")) {
//        toastr.warning("Please Select Pay Period");
//        return false;
//    }
//    if (($("#cboEmployeenumber").val() === '0' || $("#cboEmployeenumber").val() === "")) {
//        toastr.warning("Please Select Employee");
//        return false;
//    }

//    if (IsStringNullorEmpty($("#txtIncentiveAmount").val())) {
//        toastr.warning("Please Enter Incentive Amount");
//        return false;
//    }
//}

//function fnGridRefreshIncentiveAmount() {
//    $("#jqgIncentiveAmount").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
//}

//function fnClearIncentiveAmountFields() {
//    $('#cboEmployeenumber').val('0').selectpicker('refresh');
//    $('#cboEmployeenumber').prop('disabled', false).selectpicker('refresh');
//    $("#txtIncentiveAmount").val('');
//    $("#chkActiveStatus").parent().addClass("is-checked");
//    $("#btnSaveIncentiveAmount").attr("disabled", false);
//    $("#btnSaveIncentiveAmount").html('Save');
//}

//$("#btnCancelIncentiveAmount").click(function () {
//    $("#jqgIncentiveAmount").jqGrid('resetSelection');
//    $('#PopupIncentiveAmount').modal('hide');
//    fnClearIncentiveAmountFields();
//});

