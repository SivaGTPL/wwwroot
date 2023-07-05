var actiontype = "";
var isUpdate = 0;
$(document).ready(function () {
    fnGridLoadSMSVariable();
});

function fnGridLoadSMSVariable() {
    $('#jqgSMSVariable').jqGrid('GridUnload');
    $("#jqgSMSVariable").jqGrid({
        url: getBaseURL() + '/SMSEngine/GetSMSVariableInformation',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSVariable, localization.SMSComponent, localization.Status, localization.Actions],
        colModel: [
            { name: "Smsvariable", width: 45, editable: true, align: 'left', editoptions: { maxlength: 4 }},
            { name: "Smscomponent", width: 108, editable: true, align: 'left', editoptions: { maxlength: 4 }},
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'action', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditSMSVariable(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditSMSVariable(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditSMSVariable(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                }
            },
        ],
        pager: "#jqpSMSVariable",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption:'SMS Variable',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgSMSVariable");
        },
    }).jqGrid('navGrid', '#jqpSMSVariable', {
        add: false, edit: false, search: false, del: false, refresh: false
    }).jqGrid('navButtonAdd', '#jqpSMSVariable', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSMSVariable
    }).jqGrid('navButtonAdd', '#jqpSMSVariable', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSVariable
        });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshSMSVariable() {
    $("#jqgSMSVariable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtSMSVariable").val('');
    $("#txtSMSComponent").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveSMSVariable").attr('disabled', false);
}

function fnAddSMSVariable() {
    fnClearFields();
    $("#PopupSMSVariable").modal('show');
    $('#PopupSMSVariable').find('.modal-title').text(localization.AddSMSVariable);
    $("#btnCancelSMSVariable").html('<i class="fa fa-times"></i> ' + localization.Cancel);
    $("#txtSMSVariable").attr('readonly', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveSMSVariable").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveSMSVariable").show();
    $("#btnDeactivateSMSVariable").hide();
    isUpdate = 0;
}

function fnEditSMSVariable(e, actiontype) {
    $("#PopupSMSVariable").modal('show');
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSMSVariable').jqGrid('getRowData', rowid);
    $('#txtSMSVariable').val(rowData.Smsvariable).attr('readonly', true);
    $('#txtSMSComponent').val(rowData.Smscomponent);
    if (rowData.ActiveStatus === 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateSMSVariable").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateSMSVariable").html(localization.Activate);
    }
    $("#btnSaveSMSVariable").attr('disabled', false);
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        $('#PopupSMSVariable').find('.modal-title').text(localization.EditSMSVariable);
        $("#btnCancelSMSVariable").html('<i class="fa fa-times"></i> ' + localization.Cancel);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSMSVariable").html('<i class="fa fa-sync"></i> '+localization.Update);
        $("#btnSaveSMSVariable").attr("disabled", false);
        $("#btnSaveSMSVariable").show();
        $("#btnDeactivateSMSVariable").hide();
    }
    if (actiontype.trim() == "view") {
        $('#PopupSMSVariable').find('.modal-title').text(localization.ViewSMSVariable);
        $("#btnSaveSMSVariable,#btnDeactivateSMSVariable").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSVariable").on('hidden.bs.modal', function () {
            $("#btnSaveSMSVariable").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        $('#PopupSMSVariable').find('.modal-title').text("Active / De Active SMS Variable");
        $("#btnSaveSMSVariable").hide();
        $("#btnDeactivateSMSVariable").show();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSVariable").on('hidden.bs.modal', function () {
            $("#btnSaveSMSVariable").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }
}

function fnSaveSMSVariable() {

    if (IsStringNullorEmpty($("#txtSMSVariable").val())) {
        toastr.warning("Please Enter the SMS Variable");
        return false;
    }
    if (IsStringNullorEmpty($("#txtSMSComponent").val())) {
        toastr.warning("Please Enter the SMS Component");
        return false;
    }

    var sm_sv = {
        Smsvariable: $("#txtSMSVariable").val(),
        Smscomponent: $("#txtSMSComponent").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/SMSEngine/InsertIntoSMSVariable';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/SMSEngine/UpdateSMSVariable';
    }
    $("#btnSaveSMSVariable").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { sm_sv },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveSMSVariable").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshSMSVariable();
                $("#PopupSMSVariable").modal('hide');

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveSMSVariable").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveSMSVariable").attr("disabled", false);
        }
    });
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

function fnDeleteSMSVariable() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateSMSVariable").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/SMSEngine/ActiveOrDeActiveSMSVariable?status=' + a_status + '&smsvariable=' + $("#txtSMSVariable").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateSMSVariable").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupSMSVariable').modal('hide');
                fnGridRefreshSMSVariable();
                fnClearFields();
                $("#btnDeactivateSMSVariable").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateSMSVariable").attr("disabled", false);
                $("#btnDeactivateSMSVariable").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateSMSVariable").attr("disabled", false);
            $("#btnDeactivateSMSVariable").html(localization.DeActivate);
        }
    });
}