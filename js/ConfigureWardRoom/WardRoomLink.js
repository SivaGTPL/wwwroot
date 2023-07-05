$(document).ready(function () {
    fnGridLoadWardRoomLink();
    $.contextMenu({
        selector: "#btnWardRoomLink",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditWardRoomLink(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditWardRoomLink(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditWardRoomLink(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnBusinessLocation_onChange() {
    fnGridLoadWardRoomLink();
}

var actiontype = "";
//var _isInsert = true;

function fnGridLoadWardRoomLink() {


    $("#jqgWardRoomLink").jqGrid('GridUnload');
    $("#jqgWardRoomLink").jqGrid({
        url: getBaseURL() + '/WardRoom/GetLoadGridWardRoomLinksbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.LocationId, localization.Location, localization.WardId, localization.Ward, localization.RoomId, localization.Room,localization.NoOfBeds, localization.OccupiedBeds, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "LocationId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "RoomLocationDesc", width: 50, editable: true, align: 'left', hidden: false },
            { name: "RoomId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "RoomDesc", width: 50, editable: true, align: 'left', hidden: false },
            { name: "WardId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "WardDescDesc", width: 50, editable: true, align: 'left', hidden: false },
            { name: "NoOfBeds", width: 50, editable: true, align: 'left', hidden: false },
            { name: "OccupiedBeds", width: 50, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnWardRoomLink"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpWardRoomLink",
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
            fnJqgridSmallScreen("jqgWardRoomLink");
        },
    }).jqGrid('navGrid', '#jqpWardRoomLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpWardRoomLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshWardRoomLink
    }).jqGrid('navButtonAdd', '#jqpWardRoomLink', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddWardRoomLink
    });
    fnAddGridSerialNoHeading();
}

function fnAddWardRoomLink() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please Select a Business key to Link Ward & Room");
        return;
    }
    else
    {
        //_isInsert = true;
        fnClearFields();
        $('#PopupWardRoomLink').modal('show');
        $('#PopupWardRoomLink').modal({ backdrop: 'static', keyboard: false });
        $('#PopupWardRoomLink').find('.modal-title').text(localization.AddWardRoomLink);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveWardRoomLink").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveWardRoomLink").show();
        $("#btndeActiveWardRoomLink").hide();

    }
    
}

function fnEditWardRoomLink(e, actiontype) {
    var rowid = $("#jqgWardRoomLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgWardRoomLink').jqGrid('getRowData', rowid);

    fnFillWardRoomParameters(rowData.BusinessKey, rowData.RoomId, rowData.WardId, rowData.LocationId);

    $('#PopupWardRoomLink').modal('show');
    $("#btnSaveWardRoomLink").attr('disabled', false);

    //_isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupWardRoomLink').find('.modal-title').text(localization.UpdateWardRoomLink);
        $("#btnSaveWardRoomLink").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#cboLocationId").next().attr('disabled', true);
        $("#cboWardId").next().attr('disabled', true);
        $("#cboRoomId").next().attr('disabled', true);
        $("#btndeActiveWardRoomLink").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveWardRoomLink").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupWardRoomLink').find('.modal-title').text(localization.ViewWardRoomLink);
        $("#btnSaveWardRoomLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveWardRoomLink").hide();
        $("#btndeActiveWardRoomLink").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupWardRoomLink").on('hidden.bs.modal', function () {
            $("#btnSaveWardRoomLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupWardRoomLink').find('.modal-title').text("Activate/De Activate Ward Room Link");
        $("#btnSaveWardRoomLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveWardRoomLink").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveWardRoomLink").html(localization.DActivate);
        }
        else {
            $("#btndeActiveWardRoomLink").html(localization.Activate);
        }

        $("#btndeActiveWardRoomLink").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupWardRoomLink").on('hidden.bs.modal', function () {
            $("#btnSaveWardRoomLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnFillWardRoomParameters(businesskey, roomId, wardId, locationId) {
    $.ajax({
        url: getBaseURL() + '/WardRoom/GetWardRoomLink?businesskey=' + businesskey + '&roomId=' + roomId + '&wardId=' + wardId + '&locationId=' + locationId,
        datatype: 'json',
        mtype: 'POST',
        success: function (result) {
            $("#cboLocationId").val(result.LocationId).selectpicker('refresh');
            $("#cboWardId").val(result.WardId).selectpicker('refresh');
            $("#cboRoomId").val(result.RoomId).selectpicker('refresh');
            $("#txtNoofBeds").val(result.NoOfBeds);
            $("#txtOccupiedBeds").val(result.OccupiedBeds);
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result.l_ClassParameter);
        }
    });

}

function fnSaveWardRoomLink() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please Select a Business key to Link Ward & Room");
        return;
    }
    if (IsStringNullorEmpty($("#cboLocationId").val()) || $("#cboLocationId").val() === '0' || $("#cboLocationId").val() === "0") {
        toastr.warning("Please Select a Location");
        return;
    }
    if (IsStringNullorEmpty($("#cboWardId").val()) || $("#cboWardId").val() === '0' || $("#cboWardId").val() === "0") {
        toastr.warning("Please Select a Ward");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomId").val()) || $("#cboRoomId").val() === '0' || $("#cboRoomId").val() === "0") {
        toastr.warning("Please Select a Room");
        return;
    }
    if (IsStringNullorEmpty($("#txtNoofBeds").val())) {
        toastr.warning("Please Enter the Number of Beds");
        return;
    }
    if (IsStringNullorEmpty($("#txtOccupiedBeds").val())) {
        toastr.warning("Please Enter the Occupied Beds");
        return;
    }
        $("#btnSCAdd").attr("disabled", true);
        var cPar = eSyaParams.GetJSONValue();
        var objlink = {
            BusinessKey: $("#cboBusinessLocation").val(),
            WardId: $("#cboWardId").val(),
            RoomId: $("#cboRoomId").val(),
            LocationId: $("#cboLocationId").val(),
            NoOfBeds: $("#txtNoofBeds").val(),
            OccupiedBeds: $("#txtOccupiedBeds").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            l_ClassParameter: cPar
        }
        $.ajax({
            url: getBaseURL() + '/WardRoom/AddOrUpdatetWardRoomLink',
            type: 'POST',
            datatype: 'json',
            data: {obj: objlink},
                success: function (response) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#btnSaveWardRoomLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                    $("#PopupWardRoomLink").modal('hide');
                    fnClearFields();
                    fnGridRefreshWardRoomLink();
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveWardRoomLink").attr("disabled", false);
                }
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSaveWardRoomLink").attr("disabled", false);
            }
        });
    
}

function fnGridRefreshWardRoomLink() {
    $("#jqgWardRoomLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#cboLocationId").val('0').selectpicker('refresh');
    $("#cboLocationId").next().attr('disabled', false);
    $("#cboWardId").val('0').selectpicker('refresh');
    $("#cboWardId").next().attr('disabled', false);
    $("#cboRoomId").val('0').selectpicker('refresh');
    $("#cboRoomId").next().attr('disabled', false);
    $("#txtNoofBeds").val('');
    $("#txtOccupiedBeds").val('');
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveWardRoomLink").attr('disabled', false);
    eSyaParams.ClearValue();
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteWardRoomLink() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    var Par = eSyaParams.GetJSONValue();
    var objlink = {
        BusinessKey: $("#cboBusinessLocation").val(),
        WardId: $("#cboWardId").val(),
        RoomId: $("#cboRoomId").val(),
        LocationId: $("#cboLocationId").val(),
        NoOfBeds: $("#txtNoofBeds").val(),
        OccupiedBeds: $("#txtOccupiedBeds").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        l_ClassParameter: Par,
        status: a_status
    }

    $("#btndeActiveWardRoomLink").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/WardRoom/ActiveOrDeActiveWardRoomLink',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: objlink
        },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveWardRoomLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupWardRoomLink").modal('hide');
                fnClearFields();
                fnGridRefreshWardRoomLink();
                $("#btndeActiveWardRoomLink").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveWardRoomLink").attr("disabled", false);
                $("#btndeActiveWardRoomLink").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveWardRoomLink").attr("disabled", false);
            $("#btndeActiveWardRoomLink").html('De Activate');
        }
    });
}