
$(document).ready(function () {
    fnGridLoadDonorRules();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDonorRule",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDonorRule(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDonorRule(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDonorRule(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadDonorRules() {
    
    $("#jqgDonorRule").GridUnload();

    $("#jqgDonorRule").jqGrid({
        url: getBaseURL() + '/Donor/GetAllDonorRules',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.DonorType, localization.DonorTypeDesc, localization.DonationRangeFrom, localization.DonationRangeTo, localization.DiscountPercentage, localization.RoomType, localization.RoomTypeDesc, localization.NoOfPersons, localization.DonorValidityInYears, localization.Active, localization.Actions],
        colModel: [
            { name: "DonorType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "DonorTypeDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "DonationRangeFrom", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "DonationRangeTo", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false, hidden: false },
            { name: "DiscountPercentage", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "RoomType", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "NoOfPersons", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "DonorValidityInYears", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDonorRule"> <i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        
        pager: "#jqpDonorRule",
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
        caption: 'Donor Rules',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgDonorRule");
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
    }).jqGrid('navGrid', '#jqpDonorRule', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDonorRule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDonorRules
        }).jqGrid('navButtonAdd', '#jqpDonorRule', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDonorRules
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgDonorRule"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddDonorRules() {
    _isInsert = true;
    fnClearFields();
    $('#PopupDonorRule').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupDonorRule').find('.modal-title').text(localization.AddDonorRule);
    $("#btnSaveDonorRules").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDonorRules").show();
    $("#btndeActiveDonorRule").hide();
    $('#txtDonorType').val('');
}

function fnEditDonorRule(e, actiontype) {
    var rowid = $("#jqgDonorRule").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDonorRule').jqGrid('getRowData', rowid);

    $('#PopupDonorRule').modal('show');
    $('#txtDonorType').val(rowData.DonorType);
    $('#txtDonorTypeDesc').val(rowData.DonorTypeDesc);
    $('#txtDonationRangeFrom').val(rowData.DonationRangeFrom);
    $('#txtDonationRangeTo').val(rowData.DonationRangeTo);
    $('#txtDiscountPercentage').val(rowData.DiscountPercentage);
    $('#cboRoomType').val(rowData.RoomType);
    $('#cboRoomType').selectpicker('refresh');
    $('#txtNoOfPersons').val(rowData.NoOfPersons);
    $('#txtDonorValidityInYears').val(rowData.DonorValidityInYears);
    
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDonorRules").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupDonorRule').find('.modal-title').text(localization.UpdateDonorRule);
        $("#btnSaveDonorRules").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveDonorRule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDonorRules").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupDonorRule').find('.modal-title').text(localization.ViewDonorRule);
        $("#btnSaveDonorRules").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDonorRules").hide();
        $("#btndeActiveDonorRule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDonorRule").on('hidden.bs.modal', function () {
            $("#btnSaveDonorRules").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupDonorRule').find('.modal-title').text("Activate/De Activate Donor Rule");
        $("#btnSaveDonorRules").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDonorRules").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDonorRule").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDonorRule").html(localization.Activate);
        }

        $("#btndeActiveDonorRule").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDonorRule").on('hidden.bs.modal', function () {
            $("#btnSaveDonorRules").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveDonorRules() {

    if (IsStringNullorEmpty($("#txtDonorTypeDesc").val())) {
        toastr.warning("Please Enter the Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtDonationRangeFrom").val())) {
        toastr.warning("Please Enter the Donation Range From");
        return;
    }
    if (IsStringNullorEmpty($("#txtDonationRangeTo").val())) {
        toastr.warning("Please Enter the Donation Range To");
        return;
    }
    if (IsStringNullorEmpty($("#txtDiscountPercentage").val())) {
        toastr.warning("Please Enter the Discount Percentage");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomType").val()) || $("#cboRoomType").val() === '0' || $("#cboRoomType").val()==="0") {
        toastr.warning("Please Select a Room Type");
        return;
    }
    if (IsStringNullorEmpty($("#txtNoOfPersons").val())) {
        toastr.warning("Please Enter the Number of Persons");
        return;
    }
    if (IsStringNullorEmpty($("#txtDonorValidityInYears").val())) {
        toastr.warning("Please Enter the Donor Validity In Years");
        return;
    }
    objdonor = {
        DonorType: $("#txtDonorType").val() === '' ? 0 : $("#txtDonorType").val(),
        DonorTypeDesc: $("#txtDonorTypeDesc").val(),
        DonationRangeFrom: $("#txtDonationRangeFrom").val(),
        DonationRangeTo: $('#txtDonationRangeTo').val(),
        DiscountPercentage: $("#txtDiscountPercentage").val(),
        RoomType: $("#cboRoomType").val(),
        NoOfPersons: $("#txtNoOfPersons").val(),
        DonorValidityInYears: $('#txtDonorValidityInYears').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDonorRules").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Donor/InsertOrUpdateDonorRule',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objdonor },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveDonorRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDonorRule").modal('hide');
                fnClearFields();
                fnGridRefreshDonorRules();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDonorRules").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDonorRules").attr("disabled", false);
        }
    });
}

function fnGridRefreshDonorRules() {
    $("#jqgDonorRule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtDonorType").val('');
    $("#txtDonorTypeDesc").val('');
    $('#txtDonationRangeFrom').val('');
    $("#txtDonationRangeTo").val('');
    $("#txtDiscountPercentage").val('');
    $('#cboRoomType').val("0");
    $('#cboRoomType').selectpicker('refresh');
    $('#txtNoOfPersons').val('');
    $('#txtDonorValidityInYears').val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveDonorRules").attr("disabled", false);
    $("#btndeActiveDonorRule").attr("disabled", false);
}

$("#btnCancelDonorRules").click(function () {
    $("#jqgDonorRule").jqGrid('resetSelection');
    $('#PopupDonorRule').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteDonorRules() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveDonorRule").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Donor/ActiveOrDeActiveDonorRule?status=' + a_status + '&donortype=' + $("#txtDonorType").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDonorRule").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDonorRule").modal('hide');
                fnClearFields();
                fnGridRefreshDonorRules();
                $("#btndeActiveDonorRule").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDonorRule").attr("disabled", false);
                $("#btndeActiveDonorRule").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDonorRule").attr("disabled", false);
            $("#btndeActiveDonorRule").html('De Activate');
        }
    });
}
