$(document).ready(function () {
    fnGridLoadRoomMaster();
    $.contextMenu({
        selector: "#btnRoomMaster",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditRoomMaster(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditRoomMaster(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditRoomMaster(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var actiontype = "";

function fnGridLoadRoomMaster() {


    $("#jqgRoomMaster").jqGrid('GridUnload');
    $("#jqgRoomMaster").jqGrid({
        url: getBaseURL() + '/RoomMaster/GetAllRooms',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.RoomId, localization.RoomShortDesc, localization.RoomDesc, localization.Gender, localization.Active, localization.Actions],
        colModel: [
            { name: "RoomId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "RoomShortDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "RoomDesc", width: 180, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            //{ name: "Gender", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Gender", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "M: Male;F: Female;B: Both;" } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnRoomMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpRoomMaster",
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
        scrollOffset: 0,
        caption: 'Room Master',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgRoomMaster");
        },
    }).jqGrid('navGrid', '#jqpRoomMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpRoomMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRoomMaster
        }).jqGrid('navButtonAdd', '#jqpRoomMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddRoomMaster
    });
    fnAddGridSerialNoHeading();
}

var _isInsert = true;

function fnAddRoomMaster() {
    _isInsert = true;
    fnClearFields();
    $('#PopupRoomMaster').modal('show');
    $('#PopupRoomMaster').modal({ backdrop: 'static', keyboard: false });
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $('#PopupRoomMaster').find('.modal-title').text(localization.AddRoomMaster);
    $("#btnSaveRoomMaster").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveRoomMaster").show();
    $("#btndeActiveRoomMaster").hide();
    $('#txtRoomId').val('');

}

function fnEditRoomMaster(e, actiontype) {
    var rowid = $("#jqgRoomMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgRoomMaster').jqGrid('getRowData', rowid);

    $('#PopupRoomMaster').modal('show');
    $('#txtRoomId').val(rowData.RoomId);
    $('#txtRoomShortDesc').val(rowData.RoomShortDesc);
    $('#txtRoomDescription').val(rowData.RoomDesc);
    $('#cboGender').val(rowData.Gender).selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkActiveStatus").prop('disabled', true);

    $("#btnSaveRoomMaster").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupRoomMaster').find('.modal-title').text(localization.UpdateRoomMaster);
        $("#btnSaveRoomMaster").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveRoomMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveRoomMaster").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupRoomMaster').find('.modal-title').text(localization.ViewRoomMaster);
        $("#btnSaveRoomMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomMaster").hide();
        $("#btndeActiveRoomMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupRoomMaster").on('hidden.bs.modal', function () {
            $("#btnSaveRoomMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupRoomMaster').find('.modal-title').text("Activate/De Activate Room Master");
        $("#btnSaveRoomMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomMaster").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveRoomMaster").html(localization.DActivate);
        }
        else {
            $("#btndeActiveRoomMaster").html(localization.Activate);
        }

        $("#btndeActiveRoomMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupRoomMaster").on('hidden.bs.modal', function () {
            $("#btnSaveRoomMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshRoomMaster() {
    $("#jqgRoomMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveRoomMaster() {

    if (IsStringNullorEmpty($("#txtRoomShortDesc").val())) {
        toastr.warning("Please Enter the Room Short Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtRoomDescription").val())) {
        toastr.warning("Please Enter the Room Description");
        return;
    }
    if (IsStringNullorEmpty($("#cboGender").val())) {
        toastr.warning("Please Select a Gender");
        return;
    }
    objroom = {
        RoomId: $("#txtRoomId").val() === '' ? 0 : $("#txtRoomId").val(),
        Gender: $("#cboGender").val(),
        RoomShortDesc: $("#txtRoomShortDesc").val(),
        RoomDesc: $("#txtRoomDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveRoomMaster").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/RoomMaster/InsertOrUpdateRoomMaster',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objroom },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveRoomMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomMaster").modal('hide');
                fnClearFields();
                fnGridRefreshRoomMaster();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveRoomMaster").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveRoomMaster").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#txtRoomId").val("");
    $("#txtRoomShortDesc").val("");
    $("#txtRoomDescription").val("");
    $('#cboGender').val('M').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveRoomMaster").attr('disabled', false);
    $("#btndeActiveRoomMaster").attr('disabled', false);
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteRoomMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveRoomMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/RoomMaster/ActiveOrDeActiveRoomMaster?status=' + a_status + '&roomId=' + $("#txtRoomId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveRoomMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomMaster").modal('hide');
                fnClearFields();
                fnGridRefreshRoomMaster();
                $("#btndeActiveRoomMaster").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveRoomMaster").attr("disabled", false);
                $("#btndeActiveRoomMaster").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveRoomMaster").attr("disabled", false);
            $("#btndeActiveRoomMaster").html('De Activate');
        }
    });
}

$("#btnCancelRoomMaster").click(function () {
    $("#jqgRoomMaster").jqGrid('resetSelection');
    $('#PopupRoomMaster').modal('hide');
    fnClearFields();
});