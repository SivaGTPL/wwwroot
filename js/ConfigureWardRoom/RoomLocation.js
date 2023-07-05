$(document).ready(function () {
    fnGridLoadRoomLocation();
    $.contextMenu({
        selector: "#btnRoomLocation",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditRoomLocation(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditRoomLocation(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditRoomLocation(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnBusinessLocation_onChange() {
    fnGridLoadRoomLocation();
}

var actiontype = "";
var _isInsert = true;
function fnGridLoadRoomLocation() {


    $("#jqgRoomLocation").jqGrid('GridUnload');
    $("#jqgRoomLocation").jqGrid({
        url: getBaseURL() + '/RoomLocation/GetRoomLocationbyBusinessKey?businessKey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.LocationId, localization.LocationDesc, localization.MobileNumber, localization.StoreCode, localization.StoreDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "LocationId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "LocationDesc", width: 150, editable: true, align: 'left', hidden: false },
            { name: "MobileNumber", width: 50, editable: true, align: 'left', hidden: false },
            { name: "StoreCode", width: 70, editable: false, align: 'left', hidden: true, },
            { name: "StoreDesc", width: 100, editable: false, align: 'left', hidden: false, },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnRoomLocation"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpRoomLocation",
        rowNum: 10000,
        rownumWidth: '55',
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
        forceFit: true,
        scrollOffset: 0, caption: 'Room Location',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgRoomLocation");
        },
    }).jqGrid('navGrid', '#jqpRoomLocation', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpRoomLocation', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRoomLocation
    }).jqGrid('navButtonAdd', '#jqpRoomLocation', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddRoomLocation
    });
    fnAddGridSerialNoHeading();
}

function fnAddRoomLocation() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please Select Business key to Create Location");
        return;
    }
    else
    {
        _isInsert = true;
        fnClearFields();
        $('#PopupRoomLocation').modal('show');
        $('#PopupRoomLocation').modal({ backdrop: 'static', keyboard: false });
        $('#PopupRoomLocation').find('.modal-title').text(localization.AddRoomLocation);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveRoomLocation").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveRoomLocation").show();
        $("#btndeActiveRoomLocation").hide();
        $('#txtLocationId').val('');
    }
   
}

function fnClearFields() {
    $("#txtLocationId").val("");
    $("#txtLocationDescription").val("");
    $("#txtLocationMobileNo").val("");
    $('#cboLocationMobileNo').val(_cnfISDCode).selectpicker('refresh');
    $('#cboStoreCodes').val('0').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveRoomLocation").attr('disabled', false);
    $("#btndeActiveRoomLocation").attr('disabled', false);
}

function fnEditRoomLocation(e, actiontype) {
    var rowid = $("#jqgRoomLocation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgRoomLocation').jqGrid('getRowData', rowid);

    $('#PopupRoomLocation').modal('show');
    $('#txtLocationId').val(rowData.LocationId);
    $('#txtLocationDescription').val(rowData.LocationDesc);
    $('#txtLocationMobileNo').val(rowData.MobileNumber);
    $('#cboLocationMobileNo').val(_cnfISDCode).selectpicker('refresh');
    $('#cboStoreCodes').val(rowData.StoreCode).selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkActiveStatus").prop('disabled', true);

    $("#btnSaveRoomLocation").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupRoomLocation').find('.modal-title').text(localization.UpdateRoomLocation);
        $("#btnSaveRoomLocation").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveRoomLocation").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveRoomLocation").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupRoomLocation').find('.modal-title').text(localization.ViewRoomLocation);
        $("#btnSaveRoomLocation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomLocation").hide();
        $("#btndeActiveRoomLocation").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupRoomLocation").on('hidden.bs.modal', function () {
            $("#btnSaveRoomLocation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupRoomLocation').find('.modal-title').text("Activate/De Activate Room Location");
        $("#btnSaveRoomLocation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomLocation").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveRoomLocation").html(localization.DActivate);
        }
        else {
            $("#btndeActiveRoomLocation").html(localization.Activate);
        }

        $("#btndeActiveRoomLocation").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupRoomLocation").on('hidden.bs.modal', function () {
            $("#btnSaveRoomLocation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshRoomLocation() {
    $("#jqgRoomLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

$("#btnCancelRoomLocation").click(function () {
    $("#jqgRoomLocation").jqGrid('resetSelection');
    $('#PopupRoomLocation').modal('hide');
    fnClearFields();
});

function fnSaveRoomLocation() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please Select a Business Key");
        return;
    }
    if (IsStringNullorEmpty($("#txtLocationDescription").val())) {
        toastr.warning("Please Enter the Location Description");
        return;
    }
    if (IsStringNullorEmpty($("#cboLocationMobileNo").val()) || $("#cboLocationMobileNo").val() <= 0 || $("#cboLocationMobileNo").val() === '0' || $("#cboLocationMobileNo").val() === "0") {
        toastr.warning("Please Select a ISD Code");
        return;
    }
    if ($("#txtLocationMobileNo").inputmask("isComplete") === false) {
        toastr.warning("Please Enter the Mobile Number.");
        return;
    }
    if (IsStringNullorEmpty($("#cboStoreCodes").val()) || $("#cboStoreCodes").val() === '0' || $("#cboStoreCodes").val()==="0") {
        toastr.warning("Please Select a Store Code");
        return;
    }
    objloc = {
        BusinessKey: $("#cboBusinessLocation").val(),
        LocationId: $("#txtLocationId").val() === '' ? 0 : $("#txtLocationId").val(),
        LocationDesc: $("#txtLocationDescription").val(),
        MobileNumber: $("#txtLocationMobileNo").val(),
        StoreCode: $("#cboStoreCodes").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveRoomLocation").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/RoomLocation/InsertOrUpdateRoomLocation',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objloc },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveRoomLocation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomLocation").modal('hide');
                fnClearFields();
                fnGridRefreshRoomLocation();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveRoomLocation").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveRoomLocation").attr("disabled", false);
        }
    });
}

function fnDeleteRoomLocation() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveRoomLocation").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/RoomLocation/ActiveOrDeActiveRoomLocation?status=' + a_status + '&businessKey=' + $("#cboBusinessLocation").val() + '&locationId=' + $("#txtLocationId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveRoomLocation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomLocation").modal('hide');
                fnClearFields();
                fnGridRefreshRoomLocation();
                $("#btndeActiveRoomLocation").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveRoomLocation").attr("disabled", false);
                $("#btndeActiveRoomLocation").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveRoomLocation").attr("disabled", false);
            $("#btndeActiveRoomLocation").html('De Activate');
        }
    });
}