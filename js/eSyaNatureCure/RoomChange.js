$(document).ready(function () {

});

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
        url: getBaseURL() + '/CheckInGuest/GetActiveRoomNumbersbyRoomType?roomtype=' + $("#cboRoomTypeId").val(),
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

        url: getBaseURL() + '/CheckInGuest/GetActiveBedNumbersbyRoomNumber?roomtype=' + $('#cboRoomTypeId').val() + "&roomnumber=" + $('#cboRoomNumber').val(),
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

function fnLoadITBedTransfer() {
    $("#jqgITBedTransfer").jqGrid("GridUnload");
    $("#jqgITBedTransfer").jqGrid(
        {
            url: getBaseURL() + '/CheckInGuest/GetGuestRoomchangeByBookingKey?bookingKey=' + $("#hdBookingKey").val() + '&guestId=' + $("#hdGuestId").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {

            },
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ['Business Key', 'Booking Key', 'GuestId', 'Serial Number', 'Document Date', 'PrevRoomTypeId', 'PrevRoomNumber', 'PrevBedNumber', 'RoomTypeId', 'Room Type','Room Number','Bed Number','Comments', 'Active'],
            colModel: [
                { name: 'BusinessKey', width: '50', hidden: true },
                { name: 'BookingKey', width: '50', hidden: true },
                { name: 'GuestId', width: '50', hidden: true },
                { name: 'SerialNumber', width: '50', hidden: true },
                {
                    name: 'DocumentDate', index: 'DocumentDate', width: 80, sortable: true, hidden: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                { name: "PrevRoomTypeId", width: 40, align: 'left', resizable: false, hidden: true },
                { name: "PrevRoomNumber", width: 40, align: 'left', resizable: false, hidden: true },
                { name: "PrevBedNumber", width: 40, align: 'left',  resizable: false, hidden: true },
                { name: "RoomTypeId", width: 40, align: 'left', editable: true, resizable: false, hidden: true },
                { name: "RoomTypeDesc", width: 200, align: 'left', editable: true, resizable: false },
                { name: "RoomNumber", width: 120, align: 'left', editable: true,  resizable: false, hidden: false },
                { name: "BedNumber", width: 120, align: 'left', editable: true, resizable: false, hidden: false },
                { name: "Comment", width: 280, align: 'left', editable: true, resizable: false, hidden: false },
                { name: "ActiveStatus", width: 200, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            ],
            rowNum: 10,
            pager: "#jqpITBedTransfer",
            rownumWidth: 55,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            loadonce: true,
            caption: 'History',
            loadComplete: function (data) {
                fnAddGridSerialNoHeading();
                fnJqgridSmallScreen("jqgITBedTransfer");
            },
        }).jqGrid('navGrid', '#jqpITBedTransfer', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpITBedTransfer', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRoomChange
        });
}

function fnGridRefreshRoomChange() {
    $("#jqgITBedTransfer").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearRoomChange() {
   
    $("#cboRoomTypeId").val('0').selectpicker('refresh');
    $("#cboRoomNumber").val('0').selectpicker('refresh');
    $("#cboBedNumber").val('0').selectpicker('refresh');
    $("#txtComments").val('');
    $('#txtRChangeserialnumber').val('');
    $("#btnSaveRoomChange").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnSaveRoomChange").attr('disabled', false);
}

function fnSaveRoomChangeChange() {

    if (chkGuestCheckout == "True") {
        toastr.warning("Not Allowed to Update the details of Checked out Guest");
        return;
    }
    if (_userFormRole.IsAuthenticate == false) {
        toastr.warning("Not Allowed to Save Un Authenticate User");
        return;
    }
    if (IsStringNullorEmpty($("#hdBookingKey").val())) {
        toastr.warning("Please add Booking Key");
        return;
    }
    if (IsStringNullorEmpty($("#hdGuestId").val())) {
        toastr.warning("Please add GuestId");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomTypeId").val()) || $("#cboRoomTypeId").val() === "0" || $("#cboRoomTypeId").val() === '0') {
        toastr.warning("Please select Room Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomNumber").val()) || $("#cboRoomNumber").val() === "0" || $("#cboRoomNumber").val() === '0') {
        toastr.warning("Please select Room Number");
        return;
    }
    if (IsStringNullorEmpty($("#cboBedNumber").val()) || $("#cboBedNumber").val() === "0" || $("#cboBedNumber").val() === '0') {
        toastr.warning("Please select Bed Number");
        return;
    }
   
    $("#btnSaveRoomChange").attr('disabled', true);
    var objroom = {
        BookingKey: $("#hdBookingKey").val(),
        GuestId: $("#hdGuestId").val(),
        SerialNumber: $("#txtRChangeserialnumber").val() === '' ? 0 : $("#txtRChangeserialnumber").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        RoomNumber: $("#cboRoomNumber").val(),
        BedNumber: $("#cboBedNumber").val(),
        Comment: $("#txtComments").val(),
        //CheckInDate: getDate($("#txtRschedulcheckindate")),
        ActiveStatus: true
    };
    $.ajax({
        url: getBaseURL() + '/CheckInGuest/InsertGuestRoomchange',
        type: "POST",
        dataType: "json",
        data: { obj: objroom },
        success: function (response) {
           
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#btnSaveRoomChange").attr('disabled', false);
                    fnGridRefreshRoomChange();
                    fnClearRoomChange();

                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveRoomChange").attr('disabled', false);
                }
          
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveRoomChange").attr("disabled", false);
        }
    });
    //$("#btnSaveRoomChange").attr('disabled', false);
}