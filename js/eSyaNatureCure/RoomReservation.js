$(document).ready(function () {

    fnGridLoadRoomReservation();


    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnRoomReservation",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditRoomReservation(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditRoomReservation(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditRoomReservation(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnBusinessLocation_onChange() {
    fnGridLoadRoomReservation();
}

var actiontype = "";
function fnGridLoadRoomReservation() {

    var businesskey = $("#cboBusinessLocation").val();
    var _roomtypeId = $("#cbofilterRoomType").val();
    var _roomNumber = $("#cbofilterRoomNumber").val();
    $("#jqgRoomReservation").GridUnload();

    $("#jqgRoomReservation").jqGrid({
        url: getBaseURL() + '/RoomReservation/GetRoomReservationsbyBusinesskey?businesskey=' + businesskey + '&roomtypeId=' + _roomtypeId + '&roomNumber=' + _roomNumber ,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.RoomTypeId, localization.RoomTypeDescription, localization.RoomNumber, localization.BedNumber, localization.ReasonType, localization.ReasonTypeDesc, localization.EffectiveDate, localization.TillDate, localization.Comments, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "RoomTypeDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RoomNumber", width: 40, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BedNumber", width: 60, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ReasonType", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ReasonTypeDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            {
                name: 'EffectiveDate', index: 'BlockedPackageDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'TillDate', index: 'BlockedPackageDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "Comments", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 190, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditRoomReservation(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditRoomReservation(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditRoomReservation(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnRoomReservation"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpRoomReservation",
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
            SetGridControlByAction(); fnJqgridSmallScreen("jqgRoomReservation");
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

    }).jqGrid('navGrid', '#jqpRoomReservation', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpRoomReservation', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRoomReservation
    }).jqGrid('navButtonAdd', '#jqpRoomReservation', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddRoomReservation
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgRoomReservation"),
            newWidth = $grid.closest(".PackagePricecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddRoomReservation() {

    fnClearFields();
    $('#cboRoomTypeId').val('0');
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#cboRoomTypeId').next().attr('disabled', false);
    $('#cboRoomNumber').val('0');
    $('#cboRoomNumber').selectpicker('refresh');
    $('#cboRoomNumber').next().attr('disabled', false);
    $('#cboBedNumber').val('0');
    $('#cboBedNumber').selectpicker('refresh');
    $('#cboBedNumber').next().attr('disabled', false)
    $('#cboReasonType').val('0');
    $('#cboReasonType').selectpicker('refresh');
    $('#cboReasonType').next().attr('disabled', false)
    document.getElementById("txtTillDate").disabled = false;
    document.getElementById("txtEffectiveDate").disabled = false;
    var id = $("#cboBusinessLocation").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty(id)) {
        toastr.warning("Please select any Business Key to add");
        return;
    }
    else {
        _isInsert = true;
        fnClearFields();
        $('#PopupRoomreservation').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#PopupRoomreservation').find('.modal-title').text(localization.AddRoomReservation);
        $("#btnSaveRoomReservation").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveRoomReservation").show();
        $("#btndeActiveRoomReservation").hide();

    }

}

function fnEditRoomReservation(e, actiontype) {
    var rowid = $("#jqgRoomReservation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgRoomReservation').jqGrid('getRowData', rowid);
    $('#cboBusinessLocation').val(rowData.BusinessKey);
    $('#cboBusinessLocation').selectpicker('refresh');
    $('#PopupRoomreservation').modal('show');

    $('#cboRoomTypeId').val(rowData.RoomTypeId);
    $('#cboRoomTypeId').selectpicker('refresh');
    $('#cboRoomTypeId').next().attr('disabled', true);
    fnBindRoomNumbers();
    $('#cboRoomNumber').val(rowData.RoomNumber);
    $('#cboRoomNumber').selectpicker('refresh');
    $('#cboRoomNumber').next().attr('disabled', true);
    fnBindBedNumbers();
    $('#cboBedNumber').val(rowData.BedNumber);
    $('#cboBedNumber').selectpicker('refresh');
    $('#cboBedNumber').next().attr('disabled', true);

    $('#cboReasonType').val(rowData.ReasonType);
    $('#cboReasonType').selectpicker('refresh');

    $('#txtComments').val(rowData.Comments);

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
    $("#btnSaveRoomReservation").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        document.getElementById("txtTillDate").disabled = false;
        $('#PopupRoomreservation').find('.modal-title').text(localization.UpdateRoomReservation);
        $("#btnSaveRoomReservation").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveRoomReservation").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveRoomReservation").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        document.getElementById("txtTillDate").disabled = true;
        $('#PopupRoomreservation').find('.modal-title').text(localization.ViewRoomReservation);
        $("#btnSaveRoomReservation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomReservation").hide();
        $("#btndeActiveRoomReservation").hide();
        $("#chkActiveStatus").prop('disabled', true);


        $("#PopupRoomreservation").on('hidden.bs.modal', function () {
            $("#btnSaveRoomReservation").show();
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
        $('#PopupRoomreservation').find('.modal-title').text("Activate/De Activate Room Reservation");
        $("#btnSaveRoomReservation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveRoomReservation").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveRoomReservation").html(localization.DActivate);
        }
        else {
            $("#btndeActiveRoomReservation").html(localization.Activate);
        }

        $("#btndeActiveRoomReservation").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupRoomreservation").on('hidden.bs.modal', function () {
            $("#btnSaveRoomReservation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveRoomReservation() {

    if ($("#cboBusinessLocation").val() === 0 || $("#cboBusinessLocation").val() === "0" || IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.warning("Please select a Business Key");
        return;
    }

    if ($("#cboRoomTypeId").val() === 0 || $("#cboRoomTypeId").val() === "0" || IsStringNullorEmpty($("#cboRoomTypeId").val())) {
        toastr.warning("Please select a Room Type");
        return;
    }

    if ($("#cboRoomNumber").val() === 0 || $("#cboRoomNumber").val() === "0" || IsStringNullorEmpty($("#cboRoomNumber").val())) {
        toastr.warning("Please select a Room Number");
        return;
    }
    if ($("#cboBedNumber").val() === 0 || $("#cboBedNumber").val() === "0" || IsStringNullorEmpty($("#cboBedNumber").val())) {
        toastr.warning("Please select a Bed Number");
        return;
    }
    if ($("#cboReasonType").val() === 0 || $("#cboReasonType").val() === "0" || IsStringNullorEmpty($("#cboReasonType").val())) {
        toastr.warning("Please select a Reason Type");
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
    if (IsStringNullorEmpty($("#txtComments").val())) {
        toastr.warning("Please Enter the Comments");
        return;
    }

    _room = {
        BusinessKey: $("#cboBusinessLocation").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        RoomNumber: $("#cboRoomNumber").val(),
        BedNumber: $("#cboBedNumber").val(),
        ReasonType: $("#cboReasonType").val(),
        EffectiveDate: getDate($("#txtEffectiveDate")),
        TillDate: getDate($("#txtTillDate")),
        Comments: $("#txtComments").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveRoomReservation").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/RoomReservation/InsertOrUpdateRoomReservation',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: _room },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveRoomReservation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomreservation").modal('hide');
                fnClearFields();
                fnGridRefreshRoomReservation();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveRoomReservation").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveRoomReservation").attr("disabled", false);
        }
    });
}

function fnGridRefreshRoomReservation() {
    $("#jqgRoomReservation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtComments").val('');
    $("#txtComments").attr('readonly', false);
    $("#txtEffectiveDate").val('');
    $("#txtEffectiveDate").attr('readonly', false);
    $("#txtTillDate").val('');
    $("#txtTillDate").attr('readonly', false);
    $('#cboRoomTypeId').val('0').selectpicker('refresh');;
    $('#cboRoomTypeId').attr('readonly', false);
    $('#cboRoomNumber').val('0').selectpicker('refresh');;
    $('#cboRoomNumber').attr('readonly', false);
    $('#cboBedNumber').val('0').selectpicker('refresh');;
    $('#cboBedNumber').attr('readonly', false);
    $('#cboReasonType').val('0').selectpicker('refresh');;
    $('#cboReasonType').attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveRoomReservation").attr("disabled", false);
    $("#btndeActiveRoomReservation").attr("disabled", false);
}

$("#btnCancelRoomReservation").click(function () {
    $("#jqgRoomReservation").jqGrid('resetSelection');
    $('#PopupRoomreservation').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnDeleteRoomReservation() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    _objdel = {
        BusinessKey: $("#cboBusinessLocation").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        RoomNumber: $("#cboRoomNumber").val(),
        BedNumber: $("#cboBedNumber").val(),
        ReasonType: $("#cboReasonType").val(),
        EffectiveDate: getDate($("#txtEffectiveDate")),
        TillDate: getDate($("#txtTillDate")),
        Comments: $("#txtComments").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Status: a_status
    };
    $("#btndeActiveRoomReservation").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/RoomReservation/ActiveOrDeActiveRoomReservation',
        type: 'POST',
        datatype: 'json',
        data: { robj: _objdel },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveRoomReservation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupRoomreservation").modal('hide');
                fnClearFields();
                fnGridRefreshRoomReservation();
                $("#btndeActiveRoomReservation").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveRoomReservation").attr("disabled", false);
                $("#btndeActiveRoomReservation").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveRoomReservation").attr("disabled", false);
            $("#btndeActiveRoomReservation").html('De Activate');
        }
    });
}

function fncboRoomType_change() {
    fnBindRoomNumbers();
    fnBindBedNumbers();
}

function fncboRoomNumber_change() {
    fnBindBedNumbers();
}

function fnBindRoomNumbers() {

    $("#cboRoomNumber").empty();
    $.ajax({
        url: getBaseURL() + '/RoomReservation/GetActiveRoomNumbersbyRoomType?roomtype=' + $("#cboRoomTypeId").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboRoomNumber").empty();

            $("#cboRoomNumber").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboRoomNumber").append($("<option></option>").val(response[i]["RoomNumber"]).html(response[i]["RoomNumber"]));
            }
            $('#cboRoomNumber').selectpicker('refresh');

        },
        async: false,
        processData: false
    });
}

function fnBindBedNumbers() {

    $("#cboBedNumber").empty();
    $.ajax({

        url: getBaseURL() + '/RoomReservation/GetActiveBedNumbersbyRoomNumber?roomtype=' + $('#cboRoomTypeId').val() + "&roomnumber=" + $('#cboRoomNumber').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboBedNumber").empty();
            $("#cboBedNumber").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboBedNumber").append($("<option></option>").val(response[i]["BedNumber"]).html(response[i]["BedNumber"]));
            }
            $('#cboBedNumber').selectpicker('refresh');
        },

        async: false,
        processData: false
    });
}