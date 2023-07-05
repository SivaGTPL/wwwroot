
$(document).ready(function () {
    fnGridLoadMemberShipCard();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnMembershipCard",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditMemberShipCard(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditMemberShipCard(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditMemberShipCard(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadMemberShipCard() {

    //var packageId = $("#cboPackageId").val();
    $("#jqgMemberShipCard").GridUnload();

    $("#jqgMemberShipCard").jqGrid({
        url: getBaseURL() + '/MemberShipCard/GetMembershipCard',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PackageId, localization.DonorType, localization.RoomType, localization.RoomType,localization.DonationRangeFrom, localization.DonationRangeTo, localization.BookingDiscountPercentage, localization.NoOfPersons, localization.Active, localization.Actions],
        colModel: [
            { name: "MembershipType", width: 40, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "MembershipTypeDesc", width: 90, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RoomType", width: 40, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 90, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "DonationRangeFrom", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "DonationRangeTo", width: 80, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "BookingDiscountPercentage", width: 120, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "NoOfPersons", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnMembershipCard"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],

        pager: "#jqpMemberShipCard",
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
            SetGridControlByAction(); fnJqgridSmallScreen("jqgMemberShipCard");
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

    }).jqGrid('navGrid', '#jqpMemberShipCard', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpMemberShipCard', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshMemberShipCard
        }).jqGrid('navButtonAdd', '#jqpMemberShipCard', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddMemberShipCard
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgMemberShipCard"),
            newWidth = $grid.closest(".PackageMemberShipCard").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddMemberShipCard() {

    fnClearFields();
    $('#cboMemberShipType').val('0');
    $('#cboMemberShipType').selectpicker('refresh');
    $('#cboMemberShipType').next().attr('disabled', false);
    $('#cboRoomType').val('0');
    $('#cboRoomType').selectpicker('refresh');
    $('#cboRoomType').next().attr('disabled', false);
    $('#PopupMemberShipCard').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupMemberShipCard').find('.modal-title').text(localization.AddMemberShipCard);
    $("#btnSaveMemberShipCard").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveMemberShipCard").show();
    $("#btndeActiveMemberShipCard").hide();
}

function fnEditMemberShipCard(e, actiontype) {
    var rowid = $("#jqgMemberShipCard").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMemberShipCard').jqGrid('getRowData', rowid);

    $('#PopupMemberShipCard').modal('show');
    $('#cboMemberShipType').val(rowData.MembershipType);
    $('#cboMemberShipType').selectpicker('refresh');
    $('#cboMemberShipType').next().attr('disabled', true);

    $('#cboRoomType').val(rowData.RoomType);
    $('#cboRoomType').selectpicker('refresh');
    $('#cboRoomType').next().attr('disabled', false);
    $('#txtDonationRangeFrom').val(rowData.DonationRangeFrom);
    $('#txtDonationRangeTo').val(rowData.DonationRangeTo);
    $('#txtBookingDiscountPercentage').val(rowData.BookingDiscountPercentage);
    $('#txtNumberofPersons').val(rowData.NoOfPersons);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveMemberShipCard").attr("disabled", false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupMemberShipCard').find('.modal-title').text(localization.UpdateMemberShipCard);
        $("#btnSaveMemberShipCard").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveMemberShipCard").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveMemberShipCard").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupMemberShipCard').find('.modal-title').text(localization.ViewMemberShipCard);
        $("#btnSaveMemberShipCard").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveMemberShipCard").hide();
        $("#btndeActiveMemberShipCard").hide();
        $("#chkActiveStatus").prop('disabled', true);


        $("#PopupMemberShipCard").on('hidden.bs.modal', function () {
            $("#btnSaveMemberShipCard").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("Your are not authorized to Delete");
            return;
        }
        $('#PopupMemberShipCard').find('.modal-title').text("Activate/De Activate MemberShip Card");
        $("#btnSaveMemberShipCard").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveMemberShipCard").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveMemberShipCard").html(localization.DActivate);
        }
        else {
            $("#btndeActiveMemberShipCard").html(localization.Activate);
        }

        $("#btndeActiveMemberShipCard").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupMemberShipCard").on('hidden.bs.modal', function () {
            $("#btnSaveMemberShipCard").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveMemberShipCard() {

    if (IsStringNullorEmpty($("#cboMemberShipType").val()) || $("#cboMemberShipType").val() === '0' || $("#cboMemberShipType").val() === "0") {
        toastr.warning("Please select a MemberShip Type");
        return;
    }

    if (IsStringNullorEmpty($("#cboRoomType").val()) || $("#cboRoomType").val() === '0' || $("#cboRoomType").val() === "0") {
        toastr.warning("Please select a Room Type");
        return;
    }
    

    if (IsStringNullorEmpty($("#txtDonationRangeFrom").val()) || $("#txtDonationRangeFrom").val() === '0' || $("#txtDonationRangeFrom").val() === "0") {
        toastr.warning("Please Enter the Donation Range From");
        return;
    }

    if (IsStringNullorEmpty($("#txtDonationRangeTo").val()) || $("#txtDonationRangeTo").val() === '0' || $("#txtDonationRangeTo").val() === "0") {
        toastr.warning("Please Enter the Donation Range To");
        return;
    }
    if (IsStringNullorEmpty($("#txtNumberofPersons").val()) || $("#txtNumberofPersons").val() === '0' || $("#txtNumberofPersons").val() === "0") {
        toastr.warning("Please Enter the Number of Persons");
        return;
    }

    obj = {
        MembershipType: $("#cboMemberShipType").val(),
        DonationRangeFrom: $("#txtDonationRangeFrom").val(),
        DonationRangeTo: $("#txtDonationRangeTo").val(),
        BookingDiscountPercentage: $("#txtBookingDiscountPercentage").val(),
        RoomType: $("#cboRoomType").val(),
        NoOfPersons: $("#txtNumberofPersons").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveMemberShipCard").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/MemberShipCard/InsertOrUpdateMembershipCard',
        type: 'POST',
        datatype: 'json',
        data: {obj},
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveMemberShipCard").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupMemberShipCard").modal('hide');
                fnClearFields();
                fnGridRefreshMemberShipCard();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveMemberShipCard").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveMemberShipCard").attr("disabled", false);
        }
    });
}

function fnGridRefreshMemberShipCard() {
    $("#jqgMemberShipCard").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $('#cboMemberShipType').val('0').selectpicker('refresh');;
    $('#cboMemberShipType').attr('readonly', false);
    $('#cboRoomType').val('0').selectpicker('refresh');;
    $('#cboRoomType').attr('readonly', false);
    $("#txtDonationRangeFrom").val('');
    $("#txtDonationRangeFrom").attr('readonly', false);
    $("#txtDonationRangeTo").val('');
    $("#txtDonationRangeTo").attr('readonly', false);
    $("#txtBookingDiscountPercentage").val('');
    $("#txtBookingDiscountPercentage").attr('readonly', false);
    $("#txtNumberofPersons").val('');
    $("#txtNumberofPersons").attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveMemberShipCard").attr("disabled", false);
    $("#btndeActiveMemberShipCard").attr("disabled", false);
}

$("#btnCancelMemberShipCard").click(function () {
    $("#jqgMemberShipCard").jqGrid('resetSelection');
    $('#PopupMemberShipCard').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteMemberShipCard() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    $("#btndeActiveMemberShipCard").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MemberShipCard/ActiveOrDeActiveMembershipCard?status=' + a_status + '&membershiptype=' + $('#cboMemberShipType').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveMemberShipCard").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupMemberShipCard").modal('hide');
                fnGridRefreshMemberShipCard();
                $("#btndeActiveMemberShipCard").attr("disabled", false);
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveMemberShipCard").attr("disabled", false);
                $("#btndeActiveMemberShipCard").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveMemberShipCard").attr("disabled", false);
            $("#btndeActiveMemberShipCard").html('De Activate');
        }
    });
}