
$(document).ready(function () {
    fnGridLoadPackagePrice();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPackagePrice",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPackagePrice(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPackagePrice(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPackagePrice(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadPackagePrice() {

    var packageId = $("#cboPackageId").val();
    $("#jqgPackagePrice").GridUnload();

    $("#jqgPackagePrice").jqGrid({
        url: getBaseURL() + '/PackagePrice/GetAllPackagePricesbyPackageId?packageId=' + packageId,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PackageId, localization.PackageDescription, localization.RoomTypeId, localization.RoomTypeDescription, localization.OccupancyType, localization.Price, localization.NoOfWeeks, localization.Active, localization.Actions],
        colModel: [
            { name: "PackageId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PackageDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RoomTypeId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "OccupancyType", editable: true, align: 'left', width: 40, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "T: Sharing;C: Clubbed;S: Single" } },
            { name: "Price", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "NoOfWeeks", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditPackagePrice(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditPackagePrice(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditPackagePrice(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPackagePrice"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],

        pager: "#jqpPackagePrice",
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
        caption:'Package Price',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgPackagePrice");
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

    }).jqGrid('navGrid', '#jqpPackagePrice', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPackagePrice', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPackagePrice
        }).jqGrid('navButtonAdd', '#jqpPackagePrice', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPackagePrice
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPackagePrice"),
            newWidth = $grid.closest(".PackagePricecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPackagePrice() {

    fnClearFields();
    $('#cboRoomTypeId').val('0');
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#cboRoomTypeId').next().attr('disabled', false);
    $('#cboOccupancyType').val('0');
    $('#cboOccupancyType').selectpicker('refresh');
    $('#cboOccupancyType').next().attr('disabled', false);
    
    var id = $("#cboPackageId").val();
    if (id === 0 || id === "0") {
        toastr.warning("Please select any Package to add");
        return;
    }
    else {
        _isInsert = true;
        fnClearFields();
        $('#PopupPackagePrice').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#PopupPackagePrice').find('.modal-title').text(localization.AddPackageprice);
        $("#btnSavePackagePrice").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePackagePrice").show();
        $("#btndeActivePackagePrice").hide();

    }

}

function fnEditPackagePrice(e, actiontype) {
    var rowid = $("#jqgPackagePrice").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPackagePrice').jqGrid('getRowData', rowid);

    $('#cboPackageId').val(rowData.PackageId);
    $('#cboPackageId').selectpicker('refresh');
    $('#PopupPackagePrice').modal('show');

    $('#cboRoomTypeId').val(rowData.RoomTypeId);
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#cboRoomTypeId').next().attr('disabled', true);

    $('#cboOccupancyType').val(rowData.OccupancyType);
    $('#cboOccupancyType').selectpicker('refresh');
    $('#cboOccupancyType').next().attr('disabled', true);

    $('#txtPrice').val(rowData.Price);
    $('#txtNoofWeeks').val(rowData.NoOfWeeks);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePackagePrice").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupPackagePrice').find('.modal-title').text(localization.UpdatePackagePrice);
        $("#btnSavePackagePrice").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActivePackagePrice").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePackagePrice").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupPackagePrice').find('.modal-title').text(localization.ViewPackagePrice);
        $("#btnSavePackagePrice").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackagePrice").hide();
        $("#btndeActivePackagePrice").hide();
        $("#chkActiveStatus").prop('disabled', true);
       

        $("#PopupPackagePrice").on('hidden.bs.modal', function () {
            $("#btnSavePackagePrice").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
        if (actiontype.trim() == "delete") {
            if (_userFormRole.IsDelete === false) {
                toastr.warning("You are not authorized to Delete");
                return;
            }
        $('#PopupPackagePrice').find('.modal-title').text("Activate/De Activate Package Price");
        $("#btnSavePackagePrice").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackagePrice").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActivePackagePrice").html(localization.DActivate);
        }
        else {
            $("#btndeActivePackagePrice").html(localization.Activate);
        }

        $("#btndeActivePackagePrice").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPackagePrice").on('hidden.bs.modal', function () {
            $("#btnSavePackagePrice").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSavePackagePrice() {

    if ($("#cboPackageId").val() === 0 || $("#cboPackageId").val() === "0") {
        toastr.warning("Please select any Package");
        return;
    }

    if (IsStringNullorEmpty($("#cboRoomTypeId").val())) {
        toastr.warning("Please select a Room Type");
        return;
    }
    if ($("#cboRoomTypeId").val() === 0 || $("#cboRoomTypeId").val() === "0") {
        toastr.warning("Please select a Room Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboOccupancyType").val())) {
        toastr.warning("Please select a Occupancy Type");
        return;
    }
    if ($("#cboOccupancyType").val() === 0 || $("#cboOccupancyType").val() === "0") {
        toastr.warning("Please select  a Occupancy Type");
        return;
    }

    if (IsStringNullorEmpty($("#txtPrice").val())) {
        toastr.warning("Please Enter the Price");
        return;
    }

    if (IsStringNullorEmpty($("#txtNoofWeeks").val())) {
        toastr.warning("Please Enter the Number of Weeks");
        return;
    }


    obj_pkgprice = {
        PackageId: $("#cboPackageId").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        OccupancyType: $("#cboOccupancyType").val(),
        Price: $("#txtPrice").val(),
        NoOfWeeks: $("#txtNoofWeeks").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePackagePrice").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PackagePrice/InsertOrUpdatePackagePrice',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_pkgprice },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePackagePrice").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackagePrice").modal('hide');
                fnClearFields();
                fnGridRefreshPackagePrice();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePackagePrice").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePackagePrice").attr("disabled", false);
        }
    });
}

function fnGridRefreshPackagePrice() {
    $("#jqgPackagePrice").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {

    $("#txtPrice").val('');
    $("#txtPrice").attr('readonly', false);
    $("#txtNoofWeeks").val('');
    $("#txtNoofWeeks").attr('readonly', false);
    $('#cboRoomTypeId').val('0').selectpicker('refresh');;
    $('#cboRoomTypeId').attr('readonly', false);
    $('#cboOccupancyType').val('0').selectpicker('refresh');;
    $('#cboOccupancyType').attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePackagePrice").attr("disabled", false);
    $("#btndeActivePackagePrice").attr("disabled", false);
}

$("#btnCancelPackagePrice").click(function () {
    $("#jqgPackagePrice").jqGrid('resetSelection');
    $('#PopupPackagePrice').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnDeletePackagePrice() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    obj_price = {
        PackageId: $("#cboPackageId").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        OccupancyType: $("#cboOccupancyType").val(),
        Price: $("#txtPrice").val(),
        NoOfWeeks: $("#txtNoofWeeks").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Status: a_status
    };

    $("#btndeActivePackagePrice").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PackagePrice/ActiveOrDeActivePackagePrice',
        type: 'POST',
        datatype: 'json',
        data: { objprice: obj_price },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActivePackagePrice").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackagePrice").modal('hide');
                fnClearFields();
                fnGridRefreshPackagePrice();
                $("#btndeActivePackagePrice").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActivePackagePrice").attr("disabled", false);
                $("#btndeActivePackagePrice").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActivePackagePrice").attr("disabled", false);
            $("#btndeActivePackagePrice").html('De Activate');
        }
    });
}