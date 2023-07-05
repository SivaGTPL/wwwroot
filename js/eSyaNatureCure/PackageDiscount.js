$(document).ready(function () {
    
    fnGridLoadPackageDiscount();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPackageDiscount",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPackageDiscount(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPackageDiscount(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPackageDiscount(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadPackageDiscount() {

    var packageId = $("#cboPackageId").val();
    var _roomtypeId = $("#cbofilterRoomType").val();
    var _occupancytype = $("#cbofilterOccupancyType").val();

    $("#jqgPackageDiscount").GridUnload();

    $("#jqgPackageDiscount").jqGrid({
        url: getBaseURL() + '/PackageDiscount/GetAllPackageDiscountbyPackageId?packageId=' + packageId + '&roomtypeId=' + _roomtypeId + '&occupancyType=' + _occupancytype,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PackageId, localization.PackageDescription, localization.RoomTypeId, localization.RoomTypeDescription, localization.OccupancyType, localization.DiscountAmount, localization.EffectiveDate, localization.TillDate, localization.Active, localization.Actions],
        colModel: [
            { name: "PackageId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PackageDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RoomTypeId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "OccupancyType", editable: true, align: 'left', width: 80, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "T: Sharing;C: Clubbed;S: Single" } },
            { name: "DiscountAmount", width: 80, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
           // { name: "EffectiveDate", width: 80, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
          //  { name: "TillDate", width: 80, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            {
                name: 'EffectiveDate', index: 'BlockedPackageDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'TillDate', index: 'BlockedPackageDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditPackageDiscount(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditPackageDiscount(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditPackageDiscount(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPackageDiscount"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],

        pager: "#jqpPackageDiscount",
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
        caption: 'Package Price',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgPackageDiscount");
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

    }).jqGrid('navGrid', '#jqpPackageDiscount', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPackageDiscount', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPackageDiscount
        }).jqGrid('navButtonAdd', '#jqpPackageDiscount', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPackageDiscount
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPackageDiscount"),
            newWidth = $grid.closest(".PackagePricecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPackageDiscount() {

    fnClearFields();
    $('#cboRoomTypeId').val('0');
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#cboRoomTypeId').next().attr('disabled', false);
    $('#cboOccupancyType').val('0');
    $('#cboOccupancyType').selectpicker('refresh');
    $('#cboOccupancyType').next().attr('disabled', false);
    document.getElementById("txtEffectiveDate").disabled = false;
    var id = $("#cboPackageId").val();
    if (id === 0 || id === "0") {
        toastr.warning("Please select any Package");
        return;
    }
    else {
        _isInsert = true;
        fnClearFields();
        $('#PopupPackageDiscount').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#PopupPackageDiscount').find('.modal-title').text(localization.AddPackageDiscount);
        $("#btnSavePackageDiscount").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePackageDiscount").show();
        $("#btndeActivePackageDiscount").hide();

    }

}

function fnEditPackageDiscount(e, actiontype) {
    var rowid = $("#jqgPackageDiscount").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPackageDiscount').jqGrid('getRowData', rowid);
   
    $('#cboPackageId').val(rowData.PackageId);
    $('#cboPackageId').selectpicker('refresh');
    $('#PopupPackageDiscount').modal('show');

    $('#cboRoomTypeId').val(rowData.RoomTypeId);
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#cboRoomTypeId').next().attr('disabled', true);

    $('#cboOccupancyType').val(rowData.OccupancyType);
    $('#cboOccupancyType').selectpicker('refresh');
    $('#cboOccupancyType').next().attr('disabled', true);

    $('#txtDiscountAmount').val(rowData.DiscountAmount);

    
    if (rowData.EffectiveDate !== null) {
        setDate($('#txtEffectiveDate'), fnGetDateFormat(rowData.EffectiveDate));
    }
    else {
        $('#txtEffectiveDate').val('');
    }
    document.getElementById("txtEffectiveDate").disabled = true;

    if (rowData.TillDate !== null) {
        setDate($('#txtTillDate'), fnGetDateFormat(rowData.TillDate));
    }
    else {
        $('#txtTillDate').val('');
    }

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePackageDiscount").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        document.getElementById("txtTillDate").disabled = false;
        $('#PopupPackageDiscount').find('.modal-title').text(localization.UpdatePackageDiscount);
        $("#btnSavePackageDiscount").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActivePackageDiscount").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePackageDiscount").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        document.getElementById("txtTillDate").disabled = true;
        $('#PopupPackageDiscount').find('.modal-title').text(localization.ViewPackageDiscount);
        $("#btnSavePackageDiscount").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackageDiscount").hide();
        $("#btndeActivePackageDiscount").hide();
        $("#chkActiveStatus").prop('disabled', true);


        $("#PopupPackageDiscount").on('hidden.bs.modal', function () {
            $("#btnSavePackageDiscount").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }

        document.getElementById("txtTillDate").disabled = true;
        $('#PopupPackageDiscount').find('.modal-title').text("Activate/De Activate Package Discount");
        $("#btnSavePackageDiscount").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackageDiscount").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActivePackageDiscount").html(localization.DActivate);
        }
        else {
            $("#btndeActivePackageDiscount").html(localization.Activate);
        }

        $("#btndeActivePackageDiscount").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPackageDiscount").on('hidden.bs.modal', function () {
            $("#btnSavePackageDiscount").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSavePackageDiscount() {

    if ($("#cboPackageId").val() === 0 || $("#cboPackageId").val() === "0") {
        toastr.warning("Please select a Package");
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
        toastr.warning("Please select a Occupancy Type");
        return;
    }

    if (IsStringNullorEmpty($("#txtDiscountAmount").val())) {
        toastr.warning("Please Enter the Discount Amount");
        return;
    }

    if (IsStringNullorEmpty($("#txtEffectiveDate").val())) {
        toastr.warning("Please select a Effective Date");
        return;
    }
    if (IsStringNullorEmpty($("#txtTillDate").val())) {
        toastr.warning("Please select a Till Date");
        return;
    }

    obj_pkgdis = {
        PackageId: $("#cboPackageId").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        OccupancyType: $("#cboOccupancyType").val(),
        DiscountAmount: $("#txtDiscountAmount").val(),
        EffectiveDate: getDate($("#txtEffectiveDate")),
        TillDate: getDate($("#txtTillDate")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePackageDiscount").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PackageDiscount/InsertOrUpdatePackageDiscount',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_pkgdis },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePackageDiscount").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackageDiscount").modal('hide');
                fnClearFields();
                fnGridRefreshPackageDiscount();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePackageDiscount").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePackageDiscount").attr("disabled", false);
        }
    });
}

function fnGridRefreshPackageDiscount() {
    $("#jqgPackageDiscount").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {

    $("#txtDiscountAmount").val('');
    $("#txtDiscountAmount").attr('readonly', false);
    $("#txtEffectiveDate").val('');
    $("#txtEffectiveDate").attr('readonly', false);
    document.getElementById("txtEffectiveDate").disabled = false;
    $("#txtTillDate").val('');
    $("#txtTillDate").attr('readonly', false);
    document.getElementById("txtTillDate").disabled = false;
    $('#cboRoomTypeId').val('0').selectpicker('refresh');;
    $('#cboRoomTypeId').attr('readonly', false);
    $('#cboOccupancyType').val('0').selectpicker('refresh');;
    $('#cboOccupancyType').attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePackageDiscount").attr("disabled", false);
    $("#btndeActivePackageDiscount").attr("disabled", false);
}

$("#btnCancelPackageDiscount").click(function () {
    $("#jqgPackageDiscount").jqGrid('resetSelection');
    $('#PopupPackageDiscount').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnDeletePackageDiscount() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    _dis = {
        PackageId: $("#cboPackageId").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        OccupancyType: $("#cboOccupancyType").val(),
        DiscountAmount: $("#txtDiscountAmount").val(),
        EffectiveDate: getDate($("#txtEffectiveDate")),
        TillDate: getDate($("#txtTillDate")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Status: a_status
    };

    $("#btndeActivePackageDiscount").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PackageDiscount/ActiveOrDeActivePackageDiscount',
        type: 'POST',
        datatype: 'json',
        data: { objdel: _dis },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActivePackageDiscount").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackageDiscount").modal('hide');
                fnClearFields();
                fnGridRefreshPackageDiscount();
                $("#btndeActivePackageDiscount").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActivePackageDiscount").attr("disabled", false);
                $("#btndeActivePackageDiscount").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActivePackageDiscount").attr("disabled", false);
            $("#btndeActivePackageDiscount").html('De Activate');
        }
    });
}