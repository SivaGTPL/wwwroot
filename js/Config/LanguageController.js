$(document).ready(function () {
    fnGridLoadLanguageController();
});
function fnGridLoadLanguageController() {
    $('#jqgLanguageController').jqGrid('GridUnload');

    $("#jqgLanguageController").jqGrid({
       url: getBaseURL() + '/Localization/GetLanguageControllersbyResource?Resource=' + $('#cboResource').val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.ResourceName, localization.Key, localization.Value, localization.Active,localization.Actions],

        colModel: [

            { name: "ResourceId", width: 100, editable: true, align: 'left', hidden: true },
            { name: "ResourceName", width: 80, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
            { name: "Key", width: 80, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
            { name: "Value", width: 80, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
           
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'action', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditLanguageController(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditLanguageController(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditLanguageController(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
        loadonce: true,
        pager: "#jqpLanguageController",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'Language Controller',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgLanguageController");
        },
    }).jqGrid('navGrid', '#jqpLanguageController', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpLanguageController', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshLanguageControllerGrid
        }).jqGrid('navButtonAdd', '#jqpLanguageController', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddLanguageController
        });
    fnAddGridSerialNoHeading();
  
}

function fnAddLanguageController() {
    fnClearFields();
    if ($("#cboResource").val() === "" || $("#cboResource").val() === "All")
    {
        $('#cboPopupResource').val("0").selectpicker('refresh');
        $("#PopupLanguageController").modal('show');
        $('#PopupLanguageController').find('.modal-title').text(localization.AddLanguageController);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveLanguageController").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveLanguageController").show();
        $("#btnDeactivateLanguageController").hide();
    }
    else {

       $('#cboPopupResource').val($("#cboResource").val()).selectpicker('refresh');
       $("#PopupLanguageController").modal('show');
        $('#PopupLanguageController').find('.modal-title').text(localization.AddLanguageController);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveLanguageController").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveLanguageController").show();
        $("#btnDeactivateLanguageController").hide();
    }
}

function fnEditLanguageController(e, actiontype) {
    fnClearFields();
     $("#PopupLanguageController").modal('show');
     var rowid = $(e.target).parents("tr.jqgrow").attr('id');
     var rowData = $('#jqgLanguageController').jqGrid('getRowData', rowid);
     $('#txtResourceId').val(rowData.ResourceId);
     $('#cboPopupResource').val(rowData.ResourceName).selectpicker('refresh');
     $('#txtKey').val(rowData.Key);
     $('#txtValue').val(rowData.Value);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateLanguageController").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateLanguageController").html(localization.Activate);
    }

    if (actiontype.trim() == "edit") {
        $("#chkActiveStatus").prop('disabled', true);
        $('#PopupLanguageController').find('.modal-title').text(localization.UpdateLanguageController);
        $("#btnSaveLanguageController").html('<i class="fa fa-sync"></i> '+localization.Update);
        $("#btnSaveLanguageController").attr("disabled", false);
        $("#btnSaveLanguageController").show();
        $("#btnDeactivateLanguageController").hide();
        }
    if (actiontype.trim() == "view") {
        $('#PopupLanguageController').find('.modal-title').text(localization.ViewLanguageController);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveLanguageController,#btnDeactivateLanguageController").hide();
            $("input,textarea").attr('readonly', true);
            $("select").next().attr('disabled', true);
            $("input[id*=chk]").attr('disabled', true);
            $("#PopupLanguageController").on('hidden.bs.modal', function () {
                $("#btnSaveLanguageController").show();
                $("input,textarea").attr('readonly', false);
                $("select").next().attr('disabled', false);
                $("input[id*=chk]").attr('disabled', false);
            });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupLanguageController').find('.modal-title').text("Active / De Active Language Controller");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveLanguageController").hide();
        $("#btnDeactivateLanguageController").show();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $("#PopupLanguageController").on('hidden.bs.modal', function () {
            $("#btnSaveLanguageController").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        });
    }
}

function fnSaveLanguageController() {

    if (validateLanguageController() === false) {
        return;
    }
  
    lobj = {
        ResourceId: $("#txtResourceId").val() === '' ? 0 : $("#txtResourceId").val(),
        ResourceName: $("#cboPopupResource").val(),
        Key: $("#txtKey").val().replace(/ /g,''),
        Value: $("#txtValue").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveLanguageController").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Localization/InsertOrUpdateLanguageController',
        type: 'POST',
        datatype: 'json',
        data: { lobj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveLanguageController").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupLanguageController').modal('hide');
                fnRefreshLanguageControllerGrid();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveLanguageController").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveLanguageController").attr("disabled", false);
        }
    });
}

function validateLanguageController() {

    if ($("#cboPopupResource").val() === "0" || $("#cboformId").val() === '0') {
        toastr.warning("Please Select Resource");
        return false;
    }
    if (IsStringNullorEmpty($("#txtKey").val())) {
        toastr.warning("Please Enter Key");
        return false;
    }
    if (IsStringNullorEmpty($("#txtValue").val())) {
        toastr.warning("Please Enter Value");
        return false;
    }
}

function fnRefreshLanguageControllerGrid() {
    $("#jqgLanguageController").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function AvoidSpace(event) {
    var k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}

function fnClearFields() {
    $('#txtResourceId').val('');
    $("#cboPopupResource").val("0").selectpicker('refresh');
    $("#txtKey").val('');
    $("#txtValue").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveLanguageController").attr("disabled", false);
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

function fnDeleteLanguageController() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateLanguageController").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Localization/ActiveOrDeActiveLanguageController?status=' + a_status + '&ResourceId=' + $("#txtResourceId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateLanguageController").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupLanguageController').modal('hide');
                fnRefreshLanguageControllerGrid();
                fnClearFields();
                $("#btnDeactivateLanguageController").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateLanguageController").attr("disabled", false);
                $("#btnDeactivateLanguageController").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateLanguageController").attr("disabled", false);
            $("#btnDeactivateLanguageController").html(localization.DeActivate);
        }
    });
}