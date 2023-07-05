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
        url: getBaseURL() + '/Engine/GetAllSMSTriggerEvents',
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
            //{
            //    name: 'action', search: false, align: 'left', width: 120, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditTriggerEvent(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditTriggerEvent(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditTriggerEvent(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
            //    }
            //},

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
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
        scrollOffset: 0, caption:'SMS Trigger Event',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgSMSTriggerEvent");
        },

        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

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
//                    url: getBaseURL() + '/Engine/DeleteSMSTriggerEvent',
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
    $("#btnSaveTriggerEvent").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnCancelTriggerEvent").html('<i class="fa fa-times"></i>' + localization.Cancel);
    $("#txtTriggerEventId").attr('readonly', false);
    isUpdate = 0;
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveTriggerEvent").show();
    $("#btnDeactivateTriggerEvent").hide();
}

function fnEditTriggerEvent(e, actiontype) {
    
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgSMSTriggerEvent').jqGrid('getRowData', rowid);
    var rowid = $("#jqgSMSTriggerEvent").jqGrid('getGridParam', 'selrow');
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
        if (_userFormRole.IsEdit === false) {
            toastr.warning("your Not Authorized to Edit");
            return;
        }
        $("#PopupSMSTriggerEvent").modal('show');
        $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.EditTriggerEvent);
        $("#btnSaveTriggerEvent").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnCancelTriggerEvent").html('<i class="fa fa-times"></i>' + localization.Cancel);
        $("#btnSaveTriggerEvent").show();
        $("#btnDeactivateTriggerEvent").hide();
        $("#chkActiveStatus").attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("your Not Authorized to View");
            return;
        }
        $("#PopupSMSTriggerEvent").modal('show');
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
        if (_userFormRole.IsDelete === false) {
            toastr.warning("your Not Authorized to Delete");
            return;
        }
        $("#PopupSMSTriggerEvent").modal('show');
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
        toastr.warning("Please Enter Trigger Event Id");
        return false;
    }
    if (IsStringNullorEmpty($("#txtTriggerEventdesc").val())) {
        toastr.warning("Please Enter Trigger Event description");
        return false;
    }

    var obj = {
        TEventID: $("#txtTriggerEventId").val(),
        TEventDesc: $("#txtTriggerEventdesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Engine/InsertIntoSMSTriggerEvent';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/Engine/UpdateSMSTriggerEvent';
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
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
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
        url: getBaseURL() + '/Engine/ActiveOrDeActiveSMSTriggerEvent?status=' + a_status + '&TriggerEventId=' + $("#txtTriggerEventId").val(),
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