
$(document).ready(function () {
    fnGridLoadRoomType();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnRoomType",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditRoomType(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditRoomType(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditRoomType(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
function fnGridLoadRoomType() {

    $("#jqgRoomType").GridUnload();

    $("#jqgRoomType").jqGrid({
        url: getBaseURL() + '/RoomType/GetAllRoomTypes',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.RoomTypeId, localization.Description, localization.BedType, localization.SqFeet,  localization.MaxOccupancy, localization.SharingStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "RoomTypeId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "BedType", editable: true, align: 'left', width: 30, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "T: Twin Bed;S: Single Bed" } },
            { name: "SqFeet", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "MaxOccupancy", width: 30, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "SharingStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 88, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditRoomType(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditRoomType(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>'  +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditRoomType(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete +'</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnRoomType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],

        pager: "#jqpRoomType",
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
        caption:"Room Type",
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgRoomType"); $(window).resize(function () { fnJqgridSmallScreen("jqgRoomType")});
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
    }).jqGrid('navGrid', '#jqpRoomType', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpRoomType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRoomType
        }).jqGrid('navButtonAdd', '#jqpRoomType', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddRoomType
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgRoomType"),
            newWidth = $grid.closest(".RoomTypecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddRoomType() {
    _isInsert = true;
    fnClearFields(); 
    $('#PopupRoomType').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkSharingStatus").parent().removeClass("is-checked");
    $('#PopupRoomType').find('.modal-title').text(localization.AddRoomType);
    $("#btnSaveRoomType").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveRoomType").show();
    $("#btndeActiveRoomType").hide();
    $('#txtRoomTypeId').val('');
}

function fnEditRoomType(e, actiontype) {
    var rowid = $("#jqgRoomType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgRoomType').jqGrid('getRowData', rowid);

    $('#PopupRoomType').modal('show');
    $('#txtRoomTypeId').val(rowData.RoomTypeId);
    $('#txtRoomTypedesc').val(rowData.RoomTypeDesc);
    $('#cboBedType').val(rowData.BedType);
    $('#cboBedType').selectpicker('refresh');
    $('#txtSqFeet').val(rowData.SqFeet);
    $('#txtMaxOccupancy').val(rowData.MaxOccupancy);
    if (rowData.SharingStatus == 'true') {
        $("#chkSharingStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkSharingStatus").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveRoomType").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupRoomType').find('.modal-title').text(localization.UpdateRoomType);
        $("#btnSaveRoomType").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveRoomType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkSharingStatus").prop('disabled', false);
        $("#btnSaveRoomType").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupRoomType').find('.modal-title').text(localization.ViewRoomType);
        $("#btnSaveRoomType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomType").hide();
        $("#btndeActiveRoomType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkSharingStatus").prop('disabled', true);
        $("#PopupRoomType").on('hidden.bs.modal', function () {
            $("#btnSaveRoomType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupRoomType').find('.modal-title').text("Activate/De Activate Room Type");
        $("#btnSaveRoomType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomType").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveRoomType").html(localization.DActivate);
        }
        else {
            $("#btndeActiveRoomType").html(localization.Activate);
        }

        $("#btndeActiveRoomType").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkSharingStatus").prop('disabled', true);
        $("#PopupRoomType").on('hidden.bs.modal', function () {
            $("#btnSaveRoomType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveRoomType() {
   
    if (IsStringNullorEmpty($("#txtRoomTypedesc").val())) {
        toastr.warning("Please Enter the Room Type Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtMaxOccupancy").val())) {
        toastr.warning("Please Enter the Max Occupancy");
        return;
    }
    rm_type = {
        RoomTypeId: $("#txtRoomTypeId").val() === '' ? 0 : $("#txtRoomTypeId").val(),
        RoomTypeDesc: $("#txtRoomTypedesc").val(),
        BedType: $("#cboBedType").val(),
        SqFeet: $("#txtSqFeet").val(),
        MaxOccupancy: $("#txtMaxOccupancy").val(),
        SharingStatus: $("#chkSharingStatus").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveRoomType").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/RoomType/InsertOrUpdateRoomType',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: rm_type },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveRoomType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomType").modal('hide');
                fnClearFields();
                fnGridRefreshRoomType();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveRoomType").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveRoomType").attr("disabled", false);
        }
    });
}

function fnGridRefreshRoomType() {
    $("#jqgRoomType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtRoomTypeId").val('');
    $("#txtRoomTypedesc").val('');
    $('#cboBedType').val("T");
    $('#cboBedType').selectpicker('refresh');
    $("#txtSqFeet").val('');
    $("#txtMaxOccupancy").val('');
    $('#chkSharingStatus').prop('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveRoomType").attr("disabled", false);
    $("#btndeActiveRoomType").attr("disabled", false);
}

$("#btnCancelRoomType").click(function () {
    $("#jqgRoomType").jqGrid('resetSelection');
    $('#PopupRoomType').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnDeleteRoomType() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveRoomType").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/RoomType/ActiveOrDeActiveRoomType?status=' + a_status + '&roomTypeId=' + $("#txtRoomTypeId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveRoomType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomType").modal('hide');
                fnClearFields();
                fnGridRefreshRoomType();
                $("#btndeActiveRoomType").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveRoomType").attr("disabled", false);
                $("#btndeActiveRoomType").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveRoomType").attr("disabled", false);
            $("#btndeActiveRoomType").html('De Activate');
        }
    });
}