$(document).ready(function () {
    fnSetCurrentdate();
    fnGridLoadPatientFeedbackHeader();
});

function fnGridLoadPatientFeedbackHeader() {
  

    $("#jqgFeedbackHeader").GridUnload();
   
    $("#jqgFeedbackHeader").jqGrid({
        url: getBaseURL() + '/PatientFeedbackTransaction/GetPatientFeedbackHeader?feedbacktype=' + $("#cboFeedbackType").val() + '&fromdate=' + $("#dtfromDate").val()
            + '&todate=' + $("#dttoDate").val(),

        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["BusinessKey", "FinancialYear", "DocumentID", "Document Number", "FBDocument Key", "UHID", "Feed Back Type", "First Name", "Middle Name", "Last Name", "Isd Code", "Mobile Number", "EmailId","Document Date", "View"],
        colModel: [
            { name: "BusinessKey", width: 10, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FinancialYear", width: 10, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "DocumentID", width: 10, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "DocumentNumber", width: 35, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "FBDocumentKey", width: 35, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "UHID", width: 25, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "FeedBackType", editable: true, align: 'left', width: 30, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "IP: IN Patient;OP: Out Patient" } },
            { name: "FirstName", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "MiddleName", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "LastName", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "IsdCode", width: 20, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "MobileNumber", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "EmailId", width: 60, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "DocumentDate", width: 30, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            {
                name: 'View', search: false, align: 'left', width: 20, sortable: false, resizable: false,
                         formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnViewPatientFeedbackDetails(event,\'view\');"><i class="far fa-eye"></i> ' + "View" + '</button>'

                }
            },
        ],
        
        pager: "#jqpFeedbackHeader",
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
        onSelectRow: function (rowid) {

        },

    });

}

function fnViewPatientFeedbackDetails(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgFeedbackHeader').jqGrid('getRowData', rowid);

    var url = getBaseURL() + '/eSyaPatientFeedback/PatientFeedbackTransaction/FeedbackDetails?businesskey=' + rowData.BusinessKey + '&fbdocumentkey=' + rowData.FBDocumentKey + '&feedbacktype=' + rowData.FeedBackType;

    window.location.href = url;
}

function fnSetCurrentdate() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    document.getElementById("dtfromDate").value = today;

    document.getElementById("dttoDate").value = today;
   
}