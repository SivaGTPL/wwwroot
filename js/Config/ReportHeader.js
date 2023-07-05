
$(document).ready(function () {
    fnLoadReportHeaderGrid();
});
function fnBusinessLocation_onChange() {

    fnLoadReportHeaderGrid();
}

var actiontype = "";
function fnLoadReportHeaderGrid() {
    var Bskey = $('#cboBusinessLocation').val();
    $("#jqgGeneralReport").GridUnload();

    $("#jqgGeneralReport").jqGrid({
        url: getBaseURL() + '/ReportHeader/GetReportHeaderList?Businesskey=' + Bskey,
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "", "", "", "", localization.ReportHeader, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ReportHeader", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ReportHeaderTemplate", width: 70, editable: true, align: 'left', hidden: true },
            { name: "HeaderHeight", width: 70, editable: true, align: 'left', hidden: true },
            { name: "IsHeaderInvisible", editable: true, width: 50, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, hidden: true },
            
            { name: "ReportHeaderDesc", width: 100, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditGeneralReport(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditGeneralReport(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditGeneralReport(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'

                }
            },
        ],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpGeneralReport",
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
        caption:'General Report',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgGeneralReport");
        },
    }).jqGrid('navGrid', '#jqpGeneralReport', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpGeneralReport', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefresh
    }).jqGrid('navButtonAdd', '#jqpGeneralReport', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddGeneralReport
        });
    fnAddGridSerialNoHeading();
}

function fnAddGeneralReport() {
    fnUserFormAction(false);
    tinymce.activeEditor.setMode('design'); 
    openFullscreen();
    if ($("#cboBusinessLocation").val() == "0" || $("#cboBusinessLocation").val() === "") {

        toastr.warning("Please Select Business Key");
    }
    else
    {
        fnClearFields();
        $("#PopupGeneralReport").modal('show');
        $(".modal-title").text(localization.AddGeneralReportHeader);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveGeneralReport").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveGeneralReport").show();
        $("#btnDeactivateGeneralReport").hide();
    }
}

function fnEditGeneralReport(e,actiontype) {
    fnClearFields();
    openFullscreen();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgGeneralReport').jqGrid('getRowData', rowid);
    $("#txtReportHeaderId").val(rowData.ReportHeader);
    $("#txtBusinessKey").val(rowData.BusinessKey);
    tinyMCE.activeEditor.setContent('');
    tinyMCE.activeEditor.setContent(rowData.ReportHeaderTemplate);
    $("#txtReportHeaderDesc").val(rowData.ReportHeaderDesc);
    $("#txtHeaderHeight").val(rowData.HeaderHeight);
    if (rowData.IsHeaderInvisible == "true")
        $("#chkIsHeaderInvisible").parent().addClass('is-checked'); 
    else
        $("#chkIsHeaderInvisible").parent().removeClass('is-checked');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateGeneralReport").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateGeneralReport").html(localization.Activate);
    }

    $("#PopupGeneralReport").modal('show');
   
    if (actiontype.trim() == "edit") {
        $(".modal-title").text(localization.EditGeneralReportHeader);
        tinymce.activeEditor.setMode('design');
        fnUserFormAction(false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveGeneralReport").text(localization.Update).show();
        $("#btnSaveGeneralReport").attr('disabled', false);
        $("#btnSaveGeneralReport").show();
        $("#btnDeactivateGeneralReport").hide();
    }
    if (actiontype.trim() == "view") {
        $("#chkActiveStatus").prop('disabled', true);
        fnUserFormAction(true);
        $("#btnSaveGeneralReport,#btnDeactivateGeneralReport").hide();
        tinymce.activeEditor.setMode('readonly');
        $(".modal-title").text(localization.ViewGeneralReportHeader);
         
    }
    if (actiontype.trim() == "delete") {
        $("#chkActiveStatus").prop('disabled', true);
        fnUserFormAction(true);
        $("#btnSaveGeneralReport").hide();
        tinymce.activeEditor.setMode('readonly');
        $(".modal-title").text("Active / De Active General Report Header");
        $("#btnDeactivateGeneralReport").show();
    }
}

function fnUserFormAction(status) {
    $("input,textarea").attr('readonly', status);
    $("#chkIsHeaderInvisible").prop("disabled", status);
}

function fnSaveGeneralReport() {

    if (validationGeneralReport() === false) {
        return;
    }
    var rpHeader = {
        ReportHeader: $("#txtReportHeaderId").val() === '' ? 0 : $("#txtReportHeaderId").val(),
        BusinessKey: $("#cboBusinessLocation").val(),
        ReportHeaderDesc: $("#txtReportHeaderDesc").val(),
        ReportHeaderTemplate: tinyMCE.get('txtReportHeaderTemplate').getContent(),
        HeaderHeight: $("#txtHeaderHeight").val(),
        IsHeaderInvisible: $('#chkIsHeaderInvisible').parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSaveGeneralReport").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/ReportHeader/InsertOrUpdateReportHeader',
        type: 'POST',
        datatype: 'json',
        data: { rpHeader },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveGeneralReport").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnClearFields();
                $("#jqgGeneralReport").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                return true;
            }
            else{
                toastr.error(response.Message);
                $("#btnSaveGeneralReport").attr('disabled', false);
                return false;
            }
            $("#btnSaveGeneralReport").attr('disabled', false);
        }
         
    });
}

function validationGeneralReport() {
    var reportheaderTemplate = tinyMCE.get('txtReportHeaderTemplate').getContent();
    if (IsStringNullorEmpty($("#txtReportHeaderDesc").val())) {
        toastr.warning("Please Enter Report Header Description");
        return false;
    }
    if (IsStringNullorEmpty(reportheaderTemplate)) {
        toastr.warning("Please Enter Report Header Template");
        return false;
    }
    if (IsStringNullorEmpty($("#txtHeaderHeight").val())) {
        toastr.warning("Please Enter Header Height ");
        return false;
    }
    if (isNaN($("#txtHeaderHeight").val())) {
        toastr.warning("Header Height Should be Numbers Only");
        return false;
    }

}

function fnRefresh() {
   
    $("#jqgGeneralReport").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
 
function fnClosePopUp() {
    fnClearFields();
    closeFullscreen();
    $("#PopupGeneralReport").modal('hide');
}

function fnClearFields() {
    $("#txtReportHeaderId").val('');
    $("#txtBusinessKey").val('');
    $("#txtReportHeaderDesc").val('');
    $("#txtReportHeaderTemplate").val('');
    tinyMCE.activeEditor.setContent('');
    $("#txtHeaderHeight").val('');
    $("#chkIsHeaderInvisible").parent().removeClass('is-checked');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveGeneralReport").show();
    $("#btnSaveGeneralReport").attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    var btn_editEnable = document.querySelectorAll('#jqgEdit');
    var btn_viewEnable = document.querySelectorAll('#jqgView');
    var btn_deleteEnable = document.querySelectorAll('#jqgDelete');
    for (var i = 0; i < btn_editEnable.length; i++) {
        btn_editEnable[i].disabled = false;
    }
    for (var j = 0; j < btn_viewEnable.length; j++) {
        btn_viewEnable[j].disabled = false;
    }
    for (var k = 0; k < btn_deleteEnable.length; k++) {
        btn_deleteEnable[k].disabled = false;
    }


    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var btn_editDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < btn_editDisable.length; i++) {
            btn_editDisable[i].disabled = true;
            btn_editDisable[i].className = "ui-state-disabled";
        }
    }
    if (_userFormRole.IsView === false) {
        var btn_viewDisable = document.querySelectorAll('#jqgView');
        for (var j = 0; j < btn_viewDisable.length; j++) {
            btn_viewDisable[j].disabled = true;
            btn_viewDisable[j].className = "ui-state-disabled";
        }
    }

    if (_userFormRole.IsDelete === false) {
        var btn_deleteDisable = document.querySelectorAll('#jqgDelete');
        for (var k = 0; k < btn_deleteDisable.length; k++) {
            btn_deleteDisable[k].disabled = true;
            btn_deleteDisable[k].className = "ui-state-disabled";
        }
    }
}

function fnDeleteGeneralReport() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateGeneralReport").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ReportHeader/ActiveOrDeActiveGeneralReport?status=' + a_status + '&Businesskey=' + $("#cboBusinessLocation").val() + '&ReportHeaderId=' + $("#txtReportHeaderId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateGeneralReport").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnRefresh();
                fnClearFields();
                $("#btnDeactivateGeneralReport").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateGeneralReport").attr("disabled", false);
                $("#btnDeactivateGeneralReport").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateGeneralReport").attr("disabled", false);
            $("#btnDeactivateGeneralReport").html(localization.DeActivate);
        }
    });
}