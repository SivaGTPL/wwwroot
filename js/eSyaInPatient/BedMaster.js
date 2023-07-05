var actiontype = "";
var isUpdate = 0;

$(document).ready(function () {
    fnFillWardDescription();
    fnGridLoadBedMaster();
});

function fnFillWardDescription() {

    if (!IsStringNullorEmpty($('#cboBusinessLocation').val())) {
        $.getJSON(getBaseURL() + '/WardServices/GetWardListByBusinessId?businessKey=' + $('#cboBusinessLocation').val(), function (result) {
            var options = $("#cboWards");
            $("#cboWards").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.WardId).text(this.WardDesc));
            });
            $('#cboWards').selectpicker('refresh');
        });
    }
    fnFillStoreList();
}

function fnFillRoomDescription() {

    if (!IsStringNullorEmpty($('#cboBusinessLocation').val()) && !IsStringNullorEmpty($('#cboWards').val())) {
        $.getJSON(getBaseURL() + '/WardServices/GetRoomListByBkWardId?businessKey=' + $('#cboBusinessLocation').val() + '&wardId=' + $('#cboWards').val(), function (result) {
            var options = $("#cboRooms");
            $("#cboRooms").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.RoomId).text(this.RoomDesc));
            });
            $('#cboRooms').selectpicker('refresh');
        });
    }
}

function fnFillStoreList() {

    if (!IsStringNullorEmpty($('#cboBusinessLocation').val())) {
        $.getJSON(getBaseURL() + '/WardServices/GetStoreList?businessKey=' + $('#cboBusinessLocation').val(), function (result) {
            var options = $("#cboStore");
            $("#cboStore").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.StoreCode).text(this.StoreDesc));
            });
            $('#cboStore').selectpicker('refresh');
        });
    }
}

function fnGridLoadBedMaster() {
    $("#jqgBedMaster").jqGrid('GridUnload');
    $("#jqgBedMaster").jqGrid({
        url: getBaseURL() + '/WardServices/GetBedMasterByBkRmId?businessKey=' + $('#cboBusinessLocation').val() + '&roomId=' + $('#cboRooms').val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.RoomNumber, localization.BedNumber, "Store Code", localization.Store, "Location ID", localization.Location, localization.Gender, localization.HospitalNumber, localization.BedStatus, "Remark", localization.Actions],
        colModel: [
            { name: "RoomNumber", index: "RoomNumber", width: 30, editable: true, align: 'left', search: false, resizable: false, editoption: { 'text-align': 'left', maxlength: 50 }, searchoptions: { sopt: ["eq"] } },
            {
                name: "BedNumber", width: 30, editable: true, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 50 }, search: false
            },
            { name: "StoreCode", index: "StoreCode", width: 30, editable: true, align: 'left', hidden: true, editoption: { 'text-align': 'left', maxlength: 50 }, search: false },
            {
                name: "StoreDesc", index: "StoreDesc", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 },
                search: true, sorttype: 'string', searchoptions: { searchOperators: true, sopt: ['eq', 'in'] }
            },
            { name: "LocationId", index: "LocationId", width: 30, editable: true, align: 'left', hidden: true, editoption: { 'text-align': 'left', maxlength: 50 }, search: false },
            { name: "LocationDesc", index: "LocationDesc", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 }, search: false },
            {
                name: "Gender", index: "Gender", width: 30, editable: true, align: 'left', hidden: false, edittype: "select", formatter: 'select',
                editoptions: { value: "A: All;M: Male;F: Female;T: Transgender" }, search: false
            },
            { name: "HospitalNumber", index: "HospitalNumber", width: 40, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 }, search: false },
            {
                name: "BedStatus", index: "BedStatus", width: 40, editable: true, align: 'left', hidden: false, edittype: "select", formatter: 'select',
                editoptions: { value: "V: Vacant;A: Admit;L: Locked;R: Reserved;U: Under Repair" }, search: false
            },
            { name: "Remarks", index: "Remarks", width: 170, editable: true, align: 'left', hidden: true, resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            {
                name: 'edit', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditBedMaster(event,\'edit\')"><i class="fas fa-pencil-alt"></i> Edit </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditBedMaster(event,\'view\')"><i class="far fa-file-alt"></i> View </button>';
                }
            }
        ],
        pager: "#jqpBedMaster",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
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
        scrollOffset: 0,
        sortorder: "desc",
        loadComplete: function (data) {
            SetGridControlByAction();
        }
    }).jqGrid('navGrid', '#jqpBedMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpBedMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBedMaster
    }).jqGrid('navButtonAdd', '#jqpBedMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBedMaster
    });
    $('#jqgBedMaster').jqGrid('filterToolbar', {
        searchOperators: true,
        stringResult: true,
        searchOnEnter: false,
        defaultSearch: "eq"
    });
    fnAddGridSerialNoHeading();
    // fixSearchOperators();
}

function fixSearchOperators() {
    var $grid = $("#jqgBedMaster"),
        columns = $grid.jqGrid('getGridParam', 'colModel'),
        filterToolbar = $($grid[0].grid.hDiv).find("tr.ui-search-toolbar");

    filterToolbar.find("th").each(function (index) {
        var $searchOper = $(this).find(".ui-search-oper");
        if (!(columns[index].searchoptions && columns[index].searchoptions.searchOperators)) {
            $searchOper.hide();
        }
    });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnGridRefreshBedMaster() {
    $("#jqgBedMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddBedMaster() {
    $("#PopupBedMaster").modal('show');
    $(".modal-title").text(localization.AddBedDetails);
    $("#btnSaveBedMaster").html("<i class='fa fa-save'></i> " + localization.Save);
    isUpdate = 0;
    fnSetBedMasterControlbyAction(false);
    fnClearBedMasterFields();
    $('#txtBedStatus').val("Vacant");
}

function fnEditBedMaster(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBedMaster').jqGrid('getRowData', rowid);
    //fnFillStoreList();
    $('#txtRoomNumber').val(rowData.RoomNumber);
    $('#txtBedNumber').val(rowData.BedNumber);
    $('#cboStore').val(rowData.StoreCode);
    $('#cboStore').selectpicker('refresh');
    $('#cboLocation').val(rowData.LocationId);
    $('#cboLocation').selectpicker('refresh');
    $('#cboGender').val(rowData.Gender);
    $('#cboGender').selectpicker('refresh');
    $('#txtBedStatus').val(rowData.BedStatus);
    $('#txtRemarks').val(rowData.Remarks);
    isUpdate = 1;
    $("#PopupBedMaster").modal('show');
    if (actiontype.trim() === "edit") {
        $('#PopupBedMaster').find('.modal-title').text(localization.UpdateBedDetails);
        $("#btnSaveBedMaster").html(localization.Update);
        $("#btnSaveBedMaster").show();
        fnSetBedMasterControlbyAction(false);
    }
    if (actiontype.trim() === "view") {
        $('#PopupBedMasters').find('.modal-title').text(localization.ViewBedDetails);
        $("#btnSaveBedMaster").hide();
        fnSetBedMasterControlbyAction(true);
    }
}

function fnSetBedMasterControlbyAction(val) {
    $("#txtRoomNumber").attr('readonly', val);
    if (isUpdate === 0)
        $("#txtBedNumber").attr('readonly', false);
    else
        $("#txtBedNumber").attr('readonly', true);
    $("#cboStore").attr('disabled', val);
    $("#cboLocation").attr('disabled', val);
    $("#cboGender").attr('disabled', val);
    $("#txtRemarks").attr('readonly', val);
    //$("#chkCDActiveStatus").attr('disabled', val);
}

function fnSaveBedMaster() {

    if (IsStringNullorEmpty($("#txtRoomNumber").val())) {
        toastr.warning("Please Enter the Room Number.");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBedNumber").val())) {
        toastr.warning("Please Enter the Bed Number.");
        return false;
    }
    if ($("#cboStore").val() === '0') {
        toastr.warning("Please Select a Store.");
        return false;
    }
    if ($("#cboLocation").val() === '0') {
        toastr.warning("Please Select a Location.");
        return false;
    }
    if ($("#cboGender").val() === '0') {
        toastr.warning("Please Select a Gender.");
        return false;
    }

    $("#btnSaveBedMaster").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
    $("#btnSaveBedMaster").attr('disabled', true);
    var wr_bm = {
        BusinessKey: $("#cboBusinessLocation").val(),
        RoomId: $("#cboRooms").val(),
        BedNumber: $("#txtBedNumber").val(),
        RoomNumber: $("#txtRoomNumber").val(),
        StoreCode: $("#cboStore").val(),
        LocationId: $("#cboLocation").val(),
        HospitalNumber: 0,
        Gender: $("#cboGender").val(),
        BedStatus: $("#txtBedStatus").val().substring(0, 1),
        Remarks: $("#txtRemarks").val(),
        ActiveStatus: true
    };

    var URL = getBaseURL() + '/WardServices/InsertIntoBedMaster';
    if (isUpdate === 1)
        URL = getBaseURL() + '/WardServices/UpdateBedMaster';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { wr_bm },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearBedMasterFields();
                fnGridRefreshBedMaster();
                $("#PopupBedMaster").modal('hide');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveBedMaster").attr('disabled', false);
            $("#btnSaveBedMaster").html(localization.Save);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBedMaster").html(localization.Save);
            $("#btnSaveBedMaster").attr('disabled', false);
        }
    });
}

function fnClearBedMasterFields() {
    $("#txtRoomNumber").val('');
    $("#txtBedNumber").val('');
    $("#cboStore").val('');
    $('#cboStore').selectpicker('refresh');
    $("#cboLocation").val('');
    $('#cboLocation').selectpicker('refresh');
    $("#cboGender").val('');
    $('#cboGender').selectpicker('refresh');
    $("#txtBedStatus").val('');
    $("#txtRemarks").val('');
    //$('#chkActiveStatus').parent().addClass("is-checked");
}