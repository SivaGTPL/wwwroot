var actiontype = "";
var isUpdate = 0;
$(document).ready(function () {
    fnGridLoadTriggerEvent();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnSMSTriggerEvent",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditTriggerEvent(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditTriggerEvent(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditTriggerEvent(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadTriggerEvent() {
    $('#jqgSMSTriggerEvent').jqGrid('GridUnload');
    $("#jqgSMSTriggerEvent").jqGrid({
        url: getBaseURL() + '/SMSEngine/GetAllSMSTriggerEvents',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TriggerEventId, localization.TriggerEventDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "TEventID", width: 45, editable: true, align: 'left', editoptions: { maxlength: 8 } },
            { name: "TEventDesc", width: 108, editable: true, align: 'left', editoptions: { maxlength: 150 } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'action', search: false, align: 'left', width: 80, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditTriggerEvent(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditTriggerEvent(event,\'view\')"><i class="far fa-eye"></i> View </button>'
            //    }
            //},
            //{
            //    name: 'delete', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDelete", onclick="return fnDeleteTriggerEvent(event)"><i class="far fa-trash-alt"></i> Delete </button>'
            //    }
            //},
            {
                name: 'action', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSTriggerEvent"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSTriggerEvent",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        caption:'SMS Trigger Event',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgSMSTriggerEvent");
        },
    }).jqGrid('navGrid', '#jqpSMSTriggerEvent', {
        add: false, edit: false, search: false, del: false, refresh: false
        }).jqGrid('navButtonAdd', '#jqpSMSTriggerEvent', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTriggerEvent
        }).jqGrid('navButtonAdd', '#jqpSMSTriggerEvent', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTriggerEvent
    });
    fnAddGridSerialNoHeading();
}

//function fnDeleteTriggerEvent(e) {
//    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
//    var rowData = $('#jqgSMSTriggerEvent').jqGrid('getRowData', rowid);
//    var tId = rowData.TEventID;
   
//    bootbox.confirm({
//        title: 'SMS Trigger Event',
//        message: "Are you sure you want to delete ?",
//        buttons: {
//            confirm: {
//                label: 'Yes',
//                className: 'mdl-button  primary-button'
//            },
//            cancel: {
//                label: 'No',
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
//            }
//        },
//        callback: function (result) {
//            if (result) {
//                if ((tId == null || tId == undefined || tId == '')) {
//                    alert("Could not Delete");
//                    return false;
//                }
//                $.ajax({
//                    type: 'POST',
//                    url: getBaseURL() + '/SMSEngine/DeleteSMSTriggerEvent',
//                    data: {
//                        TeventId: tId
                        
//                    },
//                    success: function (response) {

//                        if (response.Status) {
//                            toastr.success(response.Message);
//                            fnGridRefreshTriggerEvent();
//                        }
//                        else {
//                            toastr.error(response.Message);
//                        }
//                        $("#jqgSMSTriggerEvent").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
//                    },
//                    error: function (response) {
//                        toastr.error("Couldn't Delete");
//                    }
//                });
//            }
//        }
//    });
//}

//function SetGridControlByAction() {
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }
//    var eleDeleteEnable = document.querySelectorAll('#jqgDelete');

//    for (var i = 0; i < eleDeleteEnable.length; i++) {
//        eleDeleteEnable[i].disabled = false;
//    }

//    if (_userFormRole.IsDelete === false) {
//        var eleDeleteDisable = document.querySelectorAll('#jqgDelete');
//        for (var i = 0; i < eleDeleteDisable.length; i++) {
//            eleDeleteDisable[i].disabled = true;
//            eleDeleteDisable[i].className = "ui-state-disabled";
//        }
//    }
//}

function fnGridRefreshTriggerEvent() {
    $("#jqgSMSTriggerEvent").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtTriggerEventId").val('');
    $("#txtTriggerEventdesc").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveTriggerEvent").attr('disabled', false);
}

function fnAddTriggerEvent() {
    fnClearFields();
    $("#PopupSMSTriggerEvent").modal('show');
    $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.AddTriggerEvent);
    $("#btnSaveTriggerEvent").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnCancelTriggerEvent").html('<i class="fa fa-times"></i> ' + localization.Cancel);
    $("#txtTriggerEventId").attr('readonly', false);
    isUpdate = 0;
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveTriggerEvent").show();
    $("#btnDeactivateTriggerEvent").hide();
}

function fnEditTriggerEvent(e, actiontype) {
    $("#PopupSMSTriggerEvent").modal('show');
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSMSTriggerEvent').jqGrid('getRowData', rowid);
    $('#txtTriggerEventId').val(rowData.TEventID).attr('readonly', true);
    $('#txtTriggerEventdesc').val(rowData.TEventDesc);
    if (rowData.ActiveStatus === 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateTriggerEvent").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateTriggerEvent").html(localization.Activate);
    }
    
    $("#btnSaveTriggerEvent").attr('disabled', false);
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.EditTriggerEvent);
        $("#btnSaveTriggerEvent").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnCancelTriggerEvent").html('<i class="fa fa-times"></i> ' + localization.Cancel);
        $("#btnSaveTriggerEvent").show();
        $("#btnDeactivateTriggerEvent").hide();
        $("#chkActiveStatus").attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.ViewTriggerEvent);
        $("#btnSaveTriggerEvent,#btnDeactivateTriggerEvent").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSTriggerEvent").on('hidden.bs.modal', function () {
            $("#btnSaveTriggerEvent").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupSMSTriggerEvent').find('.modal-title').text("Active / De Active Trigger Event");
        $("#btnSaveTriggerEvent").hide();
        $("#btnDeactivateTriggerEvent").show();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSTriggerEvent").on('hidden.bs.modal', function () {
            $("#btnSaveTriggerEvent").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }
}

function fnSaveTriggerEvent() {

    if (IsStringNullorEmpty($("#txtTriggerEventId").val())) {
        toastr.warning("Please Enter the Trigger Event Id");
        return false;
    }
    if (IsStringNullorEmpty($("#txtTriggerEventdesc").val())) {
        toastr.warning("Please Enter the Trigger Event description");
        return false;
    }

    var obj = {
        TEventID: $("#txtTriggerEventId").val(),
        TEventDesc: $("#txtTriggerEventdesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/SMSEngine/InsertIntoSMSTriggerEvent';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/SMSEngine/UpdateSMSTriggerEvent';
    }
    $("#btnSaveTriggerEvent").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveTriggerEvent").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshTriggerEvent();
                $("#PopupSMSTriggerEvent").modal('hide');

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveTriggerEvent").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveTriggerEvent").attr("disabled", false);
        }
    });
}

function fnAllowNumbersOnly(input) {
    let value = input.value;
    let numbers = value.replace(/[^0-9]/g, "");
    input.value = numbers;
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

function fnDeleteTriggerEvent() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTriggerEvent").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/SMSEngine/ActiveOrDeActiveSMSTriggerEvent?status=' + a_status + '&TriggerEventId=' + $("#txtTriggerEventId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateTriggerEvent").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshTriggerEvent();
                $("#PopupSMSTriggerEvent").modal('hide');
                fnClearFields();
                $("#btnDeactivateTriggerEvent").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateTriggerEvent").attr("disabled", false);
                $("#btnDeactivateTriggerEvent").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateTriggerEvent").attr("disabled", false);
            $("#btnDeactivateTriggerEvent").html(localization.DeActivate);
        }
    });
}