$(document).ready(function () {
    fnGridLoadSalaryProcess();
    fnGridSalaryInfo();
    $('input[id^="chkNHIF"]').click(function () {
         if ($(this).prop('checked')) {
             $("#divNHIF").css('display', 'block')
        }
        else {
            $("#divNHIF").css('display', 'none')
        }
    });

    $('input[id^="chkNSSF"]').click(function () {
         if ($(this).prop('checked')) {
          $("#divNSSF").css('display', 'block')
        }
        else {
            $("#divNSSF").css('display', 'none')
        }
    });
});
var actiontype = "";


var actiontype = "";
function fnGridSalaryInfo() {

    $("#jqgSalaryInfo").GridUnload();
    var dataForGrid = [{ 'salary': '1000000', "CurrencyName": "INR", "Percentage": "70%" }, { 'salary': '1000000', "CurrencyName": "KES", "Percentage": "20%" }]
    $("#jqgSalaryInfo").jqGrid({
        //url: getBaseURL() + ,
        //mtype: 'POST',
        datatype: 'local',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Currency", "Exchange Rate"],
        colModel: [
            { name: "CurrencyName", width: '300', align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ExchangeRate", editable: true, width: '200', align: 'left', sortable: true, stype: 'text' },
        ],
        pager: "#jqpSalaryInfo",
        rowNum: 10000,
        pgbuttons: null,
        pgtext: null,
        loadonce: true,
        viewrecords: false,
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
            fnSetGridWidth("jqpSalaryInfo");

        },
        gridComplete: function () {
          
        },
    }).jqGrid('navGrid', '#jqpSalaryInfo', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' })
    $("#jqgSalaryInfo").jqGrid('inlineNav', '#jqpSalaryInfo', {
        edit: true,
        edittext: "Edit",
        add: true,
        addicon: 'fa fa-plus',
        addtext: 'Add',
        deltext: 'Delete',
        editicon: 'fa fa-pen',
        del: false,
        search: false,
        searchicon: 'fa fa-search',
        save: true,
        saveicon: 'fa fa-save',
        savetext: 'Save',
        cancel: true,
        canceltext: 'Cancel',
        cancelicon: 'fa fa-times'
    });
}



function fnGridLoadSalaryProcess() {
    $("#jqgSalaryProcess").jqGrid('GridUnload');
    $("#jqgSalaryProcess").jqGrid({
        //url: getBaseURL() + '' ,
        //mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Employee Name", "Current Salary Amount", "Att.Factor", "Fixed Deduction", "NHIF", "NSSF", "Incentive Amount", "Cash Payment(Minus)", "Gross Pay", "Process"],
        colModel: [
            { name: "EmployeeName", width: 150, editable: true, align: 'left', hidden: false },
            { name: "CurrentSalaryAmount", width: 70, editable: true, align: 'left', hidden: false },
            { name: "AttFactor", width: 70, editable: true, align: 'left', hidden: false },
            { name: "FixedDeduction", width: 80, editable: true, align: 'left', hidden: false },
            { name: "NHIF", width: 50, editable: true, align: 'center', hidden: false, editable: true, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "NSSF", width: 50, editable: true, align: 'center', hidden: false, editable: true, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "IncentiveAmount", width: 60, editable: true, align: 'left', hidden: false },
            { name: "Process", width: 60, editable: true, align: 'left', hidden: false },
            { name: "NetPay", width: 80, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "NetPayLocalCurrency", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
        ],
        pager: "#jqpSalaryProcess",
        rowNum: 10000,
        pgtext: null,
        pgbuttons: null,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit:true,
        scrollOffset: 0,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnSetGridWidth("jqpSalaryProcess");
        },
    }).jqGrid('navGrid', '#jqpSalaryProcess', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgSalaryProcess").jqGrid('inlineNav', '#jqpSalaryProcess',{
        edit: true,
        edittext: "Edit",
        add: true,
        addicon: 'fa fa-plus',
        addtext: 'Add',
        deltext: 'Delete',
        editicon: 'fa fa-pen',
        del: false,
        search: false,
        searchicon: 'fa fa-search',
        save: true,
        saveicon: 'fa fa-save',
        savetext: 'Save',
        cancel: true,
        canceltext: 'Cancel',
        cancelicon: 'fa fa-times'
    });
    fnAddGridSerialNoHeading();
}
function fnGridRefreshSalaryProcess() {

}
function fnAddSalaryProcess() {
    $("#PopupSalaryProcess").modal('show');
}