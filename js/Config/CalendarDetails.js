﻿$(document).ready(function () {
    $('#cboBusinessLocation').selectpicker('refresh');
    $('#cbofinancialyear').selectpicker('refresh');
    fnGridLoadCalendarDetails();
});
function fnBusinessLocation_onChange() {

    fnLoadCboFinancialYear();
}
function fnLoadCboFinancialYear() {
    $('#cbofinancialyear').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/DocumentControl/GetFinancialYearbyBusinessKey?Businesskey=' + $('#cboBusinessLocation').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cbofinancialyear').empty();
            $("#cbofinancialyear").append($("<option value='0'>All</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cbofinancialyear").append($("<option></option>").val(result[i]["FinancialYear"]).html(result[i]["FinancialYear"]));
                }
            }
            $('#cbofinancialyear').val($("#cbofinancialyear option:first").val());
            $('#cbofinancialyear').selectpicker('refresh');
            fnGridLoadCalendarDetails();
        }
    });
}

function fnGridLoadCalendarDetails() {
    $("#jqgCalendarDetails").jqGrid('GridUnload');
    var financialyear = $('#cbofinancialyear').val();
    var businesskey = $('#cboBusinessLocation').val();
    $("#jqgCalendarDetails").jqGrid({
        url: getBaseURL() + '/DocumentControl/GetCalendarDetailsbyBusinessKeyAndFinancialYear?Businesskey=' + businesskey + "&FinancialYear=" + financialyear,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "", "", localization.YearandMonth, localization.MonthDescription, localization.MonthFreezeHIS, localization.MonthFreezeFinance, localization.MonthFreezeHR, localization.BudgetMonth, localization.PatientIDGeneration, localization.PatientIDSerial, "", localization.Active],
        colModel: [
            { name: "FinancialYear", width: 95, editable: true, align: 'left', hidden: true },
            { name: "MonthId", width: 100, editable: true, align: 'left', hidden: true },
            { name: "BusinessKey", width: 100, editable: true, align: 'left', hidden: true },
            { name: "EditMonthId", width: 60, editable: false, align: 'left' },
            { name: "MonthDescription", width: 60, editable: false, align: 'left', },
            { name: "MonthFreezeHis", editable: true, width: 70, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "MonthFreezeFin", editable: true, width: 70, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "MonthFreezeHr", editable: true, width: 70, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: "BudgetMonth", width: 50, editable: true, editoptions: { size: "20", maxlength: "4" }, edittype: "text", editrules: {
                    custom_func: ValidateBudgetMonth,
                    custom: true,
                }
            },
            { name: "PatientIdgen", width: 50, editable: false, align: 'left' },
            {
                name: "PatientIdserial", width: 50, editable: true, editoptions: { size: "20", maxlength: "1" }, edittype: "text", editrules: {
                    custom_func: ValidatePatientIdserial,
                    custom: true,
                }
            },
            { name: "ActiveStatus", editable: true, hidden: true, width: 35, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: false, width: 35, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        loadonce: true,
        rowNum: 12,
        loadonce: true,
        pager: "#jqpCalendarDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        pgbuttons: null,
        pgtext:null,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption:'jqgCalendarDetails',
        editurl: getBaseURL() + '/DocumentControl/UpdateCalendardetails',
        ajaxRowOptions: {
            type: "POST",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            return (postData);
        },
        beforeSubmit: function (postdata, formid) {
            return [success, message];
        },
        ondblClickRow: function (rowid) {
            $("#jqgCalendarDetails").trigger('click');
        },
        loadComplete: function (data) {
            SetGridControlByAction("jqgCalendarDetails");
            fnJqgridSmallScreen("jqgCalendarDetails");
        },
    }).jqGrid('navGrid', '#jqpCalendarDetails', { add: false, edit: false, search: false, del: false, refresh: false })
    $("#jqgCalendarDetails").jqGrid('inlineNav', '#jqpCalendarDetails',
        {
            edit: true,
            editicon: " fa fa-pen",
            edittext: localization.Edit,
            add: false,
            addicon: "fa fa-plus",
            addtext: " Add",
            save: true,
            savetext: localization.Save,
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: localization.Cancel,
            editParams: {
                keys: false,
                url: null,
                successfunc: function (result) {
                    var resp = JSON.parse(result.responseText);
                    if (resp.Status) {
                        toastr.success(resp.Message);
                        RefreshCalendarDetailsGrid();
                        return true;
                    }
                    else{
                        toastr.error(resp.Message);
                        RefreshCalendarDetailsGrid();
                        return false;
                    }
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST",
            },

        });
    $("#jqgCalendarDetails").jqGrid('setLabel', 'MonthFreezeHis', '', 'text-center');
    
}

function ValidateBudgetMonth(value, BudgetMonth) {
    if (value == "" || value == null) {
        toastr.warning("Please Enter Budget Month");
        return [false, "Please Enter Budget Month"];
    }
    else {
        return [true, ""];
    }

}

function ValidatePatientIdserial(value, PatientIdserial) {
    if (value == "" || value == null) {
        toastr.warning("Please Enter Patient serial Id");
        return [false, "Please Enter Patient serial Id"];
    }
    else {
        return [true, ""];
    }

}

function RefreshCalendarDetailsGrid() {
    $("#jqgCalendarDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction(jqg) {
    $('#' + jqg + '_iledit').removeClass('ui-state-disabled');

    if (_userFormRole.IsEdit === false) {
        $('#' + jqg + '_iledit').addClass('ui-state-disabled');
    }
   
}