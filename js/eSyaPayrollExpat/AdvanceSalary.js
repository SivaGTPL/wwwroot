$(document).ready(function () {
    fnBusinessLocation_onChange();
    $('#cboPayperiod').selectpicker('refresh');
    $('#cboEmployeenumber').selectpicker('refresh');
  //  fnGridLoadAdvanceSalary();
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
           // $("#cboPayperiod").append($("<option value='0'>Select</option>"));
            if (result !== null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboPayperiod").append($("<option></option>").val(result[i]["PayPeriod"]).html(result[i]["PayPeriod"]));
                }
            }
            $('#cboPayperiod').val($("#cboPayperiod option:first").val());
            $('#cboPayperiod').selectpicker('refresh');
            fnGridLoadAdvanceSalary();
            fnBindEmployee();
        }
    });
}



function fnBindEmployee() {
    $('#cboEmployeenumber').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/VariableEntry/GetEmployeesbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboEmployeenumber').empty();
            $("#cboEmployeenumber").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboEmployeenumber").append($("<option></option>").val(result[i]["EmployeeNumber"]).html(result[i]["EmployeeName"]));
                }
            }
            $('#cboEmployeenumber').val($("#cboEmployeenumber option:first").val());
            $('#cboEmployeenumber').selectpicker('refresh');
        }
    });
}




var _isInsert = true;
var actiontype = "";
function fnGridLoadAdvanceSalary() {
    $("#jqgAdvanceSalary").jqGrid('GridUnload');

    $("#jqgAdvanceSalary").jqGrid({
        url: getBaseURL() + '/VariableEntry/GetSalariesbyBusinessKeyAndPayPeriod?Businesskey=' + $("#cboBusinessLocation").val() + "&Payperiod=" + $("#cboPayperiod").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Employee Number", "Employee Name", "Pay Period", "Recovery Amount (local currency)", "Status", "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "EmployeeNumber", width: 50, editable: true, align: 'left', hidden: true },
            { name: "EmployeeName", width: 150, editable: true, align: 'left', hidden: false },
            { name: "PayPeriod", width: 100, editable: true, align: 'left', hidden: true },
            { name: "SalaryAdvance", width: 50, search: false, editable: false, hidden: false, align: 'right', resizable: true, formatter: "number", formatoptions: { decimalPlaces: 0 }   },
            { name: "ActiveStatus", width: 35, search: false, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditAdvanceSalary(event,\'edit\')"><i class="fas fa-pencil-alt"></i> ' + 'Edit' + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditAdvanceSalary(event,\'view\')"><i class="far fa-file-alt"></i> ' + 'View' + ' </button>'

                }
            }],
        pager: "#jqpAdvanceSalary",
        rowNum: 10000,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
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
        ignoreCase: true,
        loadComplete: function (data) {
            //SetGridControlByAction();
          // fnSetGridWidth("jqgAdvanceSalary");
        },
        footerrow: true,
        gridComplete: function () {
            var $grid = $('#jqgAdvanceSalary');
            var colSum = $grid.jqGrid('getCol', 'SalaryAdvance', false, 'sum');
            $grid.jqGrid('footerData', 'set', { 'SalaryAdvance': colSum });
        },
        ondblClickRow: function (rowid, iRow, iCol) {
            jQuery("#jqgAdvanceSalary").editCell(iRow, iCol, true);
        }
    })
        .jqGrid('navGrid', '#jqpAdvanceSalary', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAdvanceSalary', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAdvanceSalary
        })
        .jqGrid('navButtonAdd', '#jqpAdvanceSalary', {
            caption: '<span class="fa fa-plus"></span> Add', buttonicon: "none", id: "custAdd", position: "first", onClickButton: fnAddAdvanceSalary
        });

    jQuery("#jqgAdvanceSalary").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });

    fnAddGridSerialNoHeading();
}

function fnAddAdvanceSalary() {
    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select Business Key to add Advance Salary");

    }
    else {
        _isInsert = true;
        fnClearAdvanceSalaryFields();
        $('#PopupAdvanceSalary').find('.modal-title').text('Add Advance Salary');
        $('#PopupAdvanceSalary').modal('show');
        $("#btnSaveAdvanceSalary").show();
        $("#btnSaveAdvanceSalary").html('Save');
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $('#cboEmployeenumber').val('0').selectpicker('refresh');
        $('#cboEmployeenumber').prop('disabled', false).selectpicker('refresh');
    }

}

function fnEditAdvanceSalary(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAdvanceSalary').jqGrid('getRowData', rowid);

    $('#cboEmployeenumber').val(rowData.EmployeeNumber).selectpicker('refresh');
    $('#cboEmployeenumber').prop('disabled', true).selectpicker('refresh');

    $("#txtAdvancesalary").val(rowData.SalaryAdvance);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    $("#btnSaveAdvanceSalary").attr("disabled", false);
    $('#PopupAdvanceSalary').modal('show');
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        $('#PopupAdvanceSalary').find('.modal-title').text('Update Advance Salary');
        $("#btnSaveAdvanceSalary").show();
        $("#btnSaveAdvanceSalary").html('Update');
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $('#cboEmployeenumber').prop('disabled', true).selectpicker('refresh');
    }

    if (actiontype.trim() == "view") {
        $('#PopupAdvanceSalary').find('.modal-title').text('View Advance Salary');
        $("#btnSaveAdvanceSalary").attr("disabled", true);
        $("#btnSaveAdvanceSalary").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").prop('disabled', true);
        $('#cboEmployeenumber').prop('disabled', true).selectpicker('refresh');
    }
}

function fnSaveAdvanceSalary() {

    if (IsValidAdvanceSalary() === false) {
        return;
    }

    var objadsal = {
        BusinessKey: $("#cboBusinessLocation").val(),
        EmployeeNumber: $("#cboEmployeenumber").val(),
        PayPeriod: $("#cboPayperiod").val(),
        PayPeriodDate: $("#txtPayPeriod").val(),
        SalaryAdvance: $("#txtAdvancesalary").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSaveAdvanceSalary").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/VariableEntry/InsertOrUpdateAdvanceSalary',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objadsal },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupAdvanceSalary').modal('hide');
                fnGridRefreshAdvanceSalary();
                $("#btnSaveAdvanceSalary").attr('disabled', false);
                fnClearAdvanceSalaryFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveAdvanceSalary").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveAdvanceSalary").attr('disabled', false);
        }
    });

}

function IsValidAdvanceSalary() {

    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select a Business Key");
        return false;
    }
    if (($("#cboPayperiod").val() === '0' || $("#cboPayperiod").val() === "")) {
        toastr.warning("Please Select a Pay Period");
        return false;
    }
    if (($("#cboEmployeenumber").val() === '0' || $("#cboEmployeenumber").val() === "")) {
        toastr.warning("Please Select a Employee");
        return false;
    }

    if (IsStringNullorEmpty($("#txtAdvancesalary").val())) {
        toastr.warning("Please Enter the Advance Salary");
        return false;
    }
}

function fnGridRefreshAdvanceSalary() {
    $("#jqgAdvanceSalary").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearAdvanceSalaryFields() {
    $('#cboEmployeenumber').val('0').selectpicker('refresh');
    $('#cboEmployeenumber').prop('disabled', false).selectpicker('refresh');
    $("#txtAdvancesalary").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveAdvanceSalary").attr("disabled", false);
    $("#btnSaveAdvanceSalary").html('Save');
}

$("#btnCancelAdvanceSalary").click(function () {
    $("#jqgAdvanceSalary").jqGrid('resetSelection');
    $('#PopupAdvanceSalary').modal('hide');
    fnClearAdvanceSalaryFields();
});

