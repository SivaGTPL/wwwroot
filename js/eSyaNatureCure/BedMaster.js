
$(document).ready(function () {
    fnGridLoadBedMaster();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnBedMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBedMaster(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditBedMaster(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditBedMaster(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
function fnGridLoadBedMaster() {
    
    var roomtype = $("#cboRoomTypeId").val();
    $("#jqgBedMaster").GridUnload();

    $("#jqgBedMaster").jqGrid({
        url: getBaseURL() + '/BedMaster/GetAllBedMastersbyRoomType?roomtype=' + roomtype,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.RoomTypeId, localization.RoomTypeDesc, localization.RoomNumber, localization.BedNumber, localization.Gender, localization.ReservedStatus, localization.CheckedIn, localization.CheckedOut, localization.ReadyForOccupancy, localization.Active, localization.Actions],
        colModel: [
            { name: "RoomTypeId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "RoomNumber", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "BedNumber", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "Gender", editable: true, align: 'left', width: 40, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "M: Male;F: Female;B: Both" } },
            { name: "ReservedStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "CheckedIn", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "CheckedOut", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ReadyForOccupancy", width: 50, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditBedMaster(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditBedMaster(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditBedMaster(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnBedMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpBedMaster",
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
        forceFit: true, caption:'Bed Master',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgBedMaster");
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

    }).jqGrid('navGrid', '#jqpBedMaster', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpBedMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBedMaster
        }).jqGrid('navButtonAdd', '#jqpBedMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBedMaster
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgBedMaster"),
            newWidth = $grid.closest(".BedMastercontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddBedMaster() {

    fnClearFields();
    var id = $("#cboRoomTypeId").val();
    if (id === 0 || id === "0") {
        toastr.warning("Please select any Room Type to add");
        return;
    }
    else {
        _isInsert = true;
        fnClearFields();
        $('#PopupBedMaster').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkReservedStatus").parent().removeClass("is-checked");
        $("#chkCheckedIn").parent().removeClass("is-checked");
        $("#chkCheckedOut").parent().removeClass("is-checked");
        $("#chkReadyForOccupancy").parent().removeClass("is-checked");
        $('#PopupBedMaster').find('.modal-title').text(localization.AddBedMaster);
        $("#btnSaveBedMaster").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveBedMaster").show();
        $("#btndeActiveBedMaster").hide();
        //$('#txtRoomTypeId').val('');
    }
    
}

function fnEditBedMaster(e, actiontype) {
    var rowid = $("#jqgBedMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBedMaster').jqGrid('getRowData', rowid);

    $('#cboRoomTypeId').val(rowData.RoomTypeId);
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#PopupBedMaster').modal('show');
    $('#txtRoomNumber').val(rowData.RoomNumber);
    $('#txtRoomNumber').attr('readonly', true);
    $('#txtBedNumber').val(rowData.BedNumber);
    $('#txtBedNumber').attr('readonly', true);
    $('#cboGender').val(rowData.Gender);
    $('#cboGender').selectpicker('refresh');

    if (rowData.ReservedStatus == 'true') {
        $("#chkReservedStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkReservedStatus").parent().removeClass("is-checked");
    }
    if (rowData.CheckedIn == 'true') {
        $("#chkCheckedIn").parent().addClass("is-checked");
    }
    else {
        $("#chkCheckedIn").parent().removeClass("is-checked");
    }
    if (rowData.CheckedOut == 'true') {
        $("#chkCheckedOut").parent().addClass("is-checked");
    }
    else {
        $("#chkCheckedOut").parent().removeClass("is-checked");
    }
    if (rowData.ReadyForOccupancy == 'true') {
        $("#chkReadyForOccupancy").parent().addClass("is-checked");
    }
    else {
        $("#chkReadyForOccupancy").parent().removeClass("is-checked");
    }

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBedMaster").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupBedMaster').find('.modal-title').text(localization.UpdateBedMaster);
        $("#btnSaveBedMaster").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveBedMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkReservedStatus").prop('disabled', false);
        $("#chkCheckedIn").prop('disabled', false);
        $("#chkCheckedOut").prop('disabled', false);
        $("#chkReadyForOccupancy").prop('disabled', false);
        $("#btnSaveBedMaster").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupBedMaster').find('.modal-title').text(localization.ViewBedMaster);
        $("#btnSaveBedMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveBedMaster").hide();
        $("#btndeActiveBedMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkReservedStatus").prop('disabled', true);
        $("#chkCheckedIn").prop('disabled', true);
        $("#chkCheckedOut").prop('disabled', true);
        $("#chkReadyForOccupancy").prop('disabled', true);

        $("#PopupBedMaster").on('hidden.bs.modal', function () {
            $("#btnSaveBedMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupBedMaster').find('.modal-title').text("Activate/De Activate Bed Master");
        $("#btnSaveBedMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveBedMaster").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveBedMaster").html(localization.DActivate);
        }
        else {
            $("#btndeActiveBedMaster").html(localization.Activate);
        }

        $("#btndeActiveBedMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkReservedStatus").prop('disabled', true);
        $("#chkCheckedIn").prop('disabled', true);
        $("#chkCheckedOut").prop('disabled', true);
        $("#chkReadyForOccupancy").prop('disabled', true);
        $("#PopupBedMaster").on('hidden.bs.modal', function () {
            $("#btnSaveBedMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveBedMaster() {

    if (IsStringNullorEmpty($("#txtRoomNumber").val())) {
        toastr.warning("Please Enter the Room Number");
        return;
    }
    if (IsStringNullorEmpty($("#txtBedNumber").val())) {
        toastr.warning("Please Enter the Bed Number");
        return;
    }
    bed_master = {
        RoomTypeId: $("#cboRoomTypeId").val(),
        RoomNumber: $("#txtRoomNumber").val(),
        BedNumber: $("#txtBedNumber").val(),
        Gender: $("#cboGender").val(),
        ReservedStatus: $("#chkReservedStatus").parent().hasClass("is-checked"),
        CheckedIn: $("#chkCheckedIn").parent().hasClass("is-checked"),
        CheckedOut: $("#chkCheckedOut").parent().hasClass("is-checked"),
        ReadyForOccupancy: $("#chkReadyForOccupancy").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveBedMaster").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/BedMaster/InsertOrUpdateBedMaster',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: bed_master },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBedMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBedMaster").modal('hide');
                fnClearFields();
                fnGridRefreshBedMaster();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBedMaster").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBedMaster").attr("disabled", false);
        }
    });
}

function fnGridRefreshBedMaster() {
    $("#jqgBedMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
   
    $("#txtRoomNumber").val('');
    $("#txtRoomNumber").attr('readonly', false);
    $('#txtBedNumber').val('');
    $('#txtBedNumber').attr('readonly', false);
    $('#cboGender').val('M').selectpicker('refresh');
    $('#chkReservedStatus').prop('disabled', false);
    $("#chkReservedStatus").parent().removeClass("is-checked");
    $('#chkCheckedIn').prop('disabled', false);
    $("#chkCheckedIn").parent().removeClass("is-checked");
    $('#chkCheckedOut').prop('disabled', false);
    $("#chkCheckedOut").parent().removeClass("is-checked");
    $('#chkReadyForOccupancy').prop('disabled', false);
    $("#chkReadyForOccupancy").parent().removeClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveBedMaster").attr("disabled", false);
    $("#btndeActiveBedMaster").attr("disabled", false);
}

$("#btnCancelBedMaster").click(function () {
    $("#jqgBedMaster").jqGrid('resetSelection');
    $('#PopupBedMaster').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
  
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteBedMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    bedmaster = {
        RoomTypeId: $("#cboRoomTypeId").val(),
        RoomNumber: $("#txtRoomNumber").val(),
        BedNumber: $("#txtBedNumber").val(),
        Gender: $("#cboGender").val(),
        ReservedStatus: $("#chkReservedStatus").parent().hasClass("is-checked"),
        CheckedIn: $("#chkCheckedIn").parent().hasClass("is-checked"),
        CheckedOut: $("#chkCheckedOut").parent().hasClass("is-checked"),
        ReadyForOccupancy: $("#chkReadyForOccupancy").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Status:a_status
    };

    $("#btndeActiveBedMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/BedMaster/ActiveOrDeActiveBedMaster',
        type: 'POST',
        datatype: 'json',
        data: { objmaster: bedmaster },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveBedMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBedMaster").modal('hide');
                fnClearFields();
                fnGridRefreshBedMaster();
                $("#btndeActiveBedMaster").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveBedMaster").attr("disabled", false);
                $("#btndeActiveBedMaster").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveBedMaster").attr("disabled", false);
            $("#btndeActiveBedMaster").html('De Activate');
        }
    });
}