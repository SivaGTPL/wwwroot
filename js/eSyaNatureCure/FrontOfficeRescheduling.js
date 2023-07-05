var _isInsert = true;
var actiontype = "";
var nodays = 0;

$(document).ready(function () {
    var todaydt = new Date();
    var predate = $("#txtRschedulcheckindate").val();
    $("#txtRschedulcheckindate").datepicker({
        autoclose: true,
        dateFormat: _cnfDateFormat,
        //endDate: todaydt,
        endDate: predate,
        onSelect: function (date) {
            //Get selected date
            var sdate = $('#txtRschedulcheckindate').datepicker('getDate');
            sdate.setDate(sdate.getDate() + nodays);
            $("#txtRschedulcheckoutdate").datepicker("setDate", sdate);
           
        }
    });

    $('#txtRschedulcheckoutdate').datepicker({
        dateFormat: _cnfDateFormat,
    });
});
//Guest Rescheduling Start
function fnOpenReschedulePopUp() {
    fnLoadITRescheduling();
    $("#PopupRescheduling").modal('show');
    fnClearReScheduling();
    var cindate = $('#txtCheckin').html();
    var coutdate = $('#txtCheckout').text();
    if (cindate !== null) {
      var chkIdate = cindate.split('-').join('/');
        $('#txtRschedulcheckindate').val(chkIdate);
    }
    else {
        $('#txtRschedulcheckindate').val('');
    }

    if (coutdate !== null) {
        var chkodate = coutdate.split('-').join('/');
        $('#txtRschedulcheckoutdate').val(chkodate);
        $("#txtRschedulcheckoutdate").prop('disabled', true);
    }
    else {
        $('#txtRschedulcheckoutdate').val('');
    }

   
    if (!IsStringNullorEmpty($("#txtRschedulcheckindate").val()) && !IsStringNullorEmpty($("#txtRschedulcheckoutdate").val())) {
        nodays = CountNumberofDays($("#txtRschedulcheckindate").val(), $("#txtRschedulcheckoutdate").val());
    }
}
function CountNumberofDays(prechkIndate, prechkOutdate)
{
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d1 = prechkIndate.split("/");
    let dat1 = new Date(d1[2] + '/' + d1[1] + '/' + d1[0]);

    var date1 = new Date(dat1);

    let d2 = prechkOutdate.split("/");
    let dat2 = new Date(d2[2] + '/' + d2[1] + '/' + d2[0]);

    var date2 = new Date(dat2);

    var milli_secs = date2.getTime() - date1.getTime();

    // Convert the milli seconds to Days 
    var days = milli_secs / (1000 * 3600 * 24);
    
    nodays=  Math.round(Math.abs(days));
    return nodays;
}


function fnLoadITRescheduling() {
    $("#jqgITRescheduling").jqGrid("GridUnload");
    $("#jqgITRescheduling").jqGrid(
        {
            url: getBaseURL() + '/FrontOffice/GetGuestReschedulingByBookingKey?bookingKey=' + $("#hfdBookingKey").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {

            },
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ['Business Key', 'Booking Key', 'Serial Number', 'Prev Check In Date', 'Prev Check Out Date', 'Check-In date', 'Check-Out date', 'Active'],
            colModel: [
                { name: 'BusinessKey', width: '50', hidden: true },
                { name: 'BookingKey', width: '50', hidden: true },
                { name: 'SerialNumber', width: '50', hidden: true },
                {
                    name: 'PrevCheckInDate', index: 'PrevCheckInDate', width: 180, sortable: true, hidden: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                {
                    name: 'PrevCheckOutDate', index: 'PrevCheckOutDate', width: 180, sortable: true, hidden: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                {
                    name: 'CheckInDate', index: 'CheckInDate', width: 380, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                {
                    name: 'CheckOutDate', index: 'CheckOutDate', width: 380, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                { name: "ActiveStatus", width: 200, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            ],
            rowNum: 10,
            pager: "#jqpITRescheduling",
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
                fnJqgridSmallScreen("jqgITRescheduling");
            },
        }).jqGrid('navGrid', '#jqpITRescheduling', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpITRescheduling', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRescheduling
        });
}

function fnGridRefreshRescheduling() {
    $("#jqgITRescheduling").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearReScheduling() {

    $("#txtRschedulcheckindate").val('');
    $("#txtRschedulcheckoutdate").val('');
    $('#txtRSchedulserialnumber').val('');
    $("#btnSaveRSchedul").html('<i class="far fa-save"></i> ' + 'Save');
    $("#btnSaveRSchedul").attr('disabled', false);
}

function fnSaveGuestReScheduling() {

    if (IsStringNullorEmpty($("#hfdBookingKey").val())) {
        toastr.warning("Please Add the Booking Key");
        return;
    }

    if (IsStringNullorEmpty($("#txtRschedulcheckindate").val())) {
        toastr.warning("Please select a check In date");
        return;
    }
    if (IsStringNullorEmpty($("#txtRschedulcheckoutdate").val())) {
        toastr.warning("Please Select a check Out date");
        return;
    }
    $("#btnSaveRSchedul").attr('disabled', true);
    var objreschedule = {
        BookingKey: $("#hfdBookingKey").val(),
        SerialNumber: $("#txtRSchedulserialnumber").val() === '' ? 0 : $("#txtRSchedulserialnumber").val(),
        CheckInDate: getDate($("#txtRschedulcheckindate")),
        CheckOutDate: getDate($("#txtRschedulcheckoutdate")),
        ActiveStatus: true
    };
    $.ajax({
        url: getBaseURL() + '/FrontOffice/InsertGuestRescheduling',
        type: "POST",
        dataType: "json",
        data: { obj: objreschedule },

        success: function (response) {

            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveRSchedul").attr('disabled', false);
                fnGridRefreshRescheduling();
                fnClearReScheduling();

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveRSchedul").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveRSchedul").attr("disabled", false);
        }
    });
    //$("#btnSaveRSchedul").attr('disabled', false);
}
//Guest Rescheduling End

//Guest Room Change Start
function fnOpenBedTransferPopUp() {
    fnLoadITBedTransfer();
    $("#PopupBedChange").modal('show');
    fnClearRoomChange();
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
        url: getBaseURL() + '/FrontOffice/GetActiveRoomNumbersbyRoomType?roomtype=' + $("#cboRoomTypeId").val(),
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

        url: getBaseURL() + '/FrontOffice/GetActiveBedNumbersbyRoomNumber?roomtype=' + $('#cboRoomTypeId').val() + "&roomnumber=" + $('#cboRoomNumber').val(),
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
            url: getBaseURL() + '/FrontOffice/GetGuestRoomchangeByBookingKey?bookingKey=' + $("#hfdBookingKey").val() + '&guestId=' + $("#hfdGuestId").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {

            },
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ['Business Key', 'Booking Key', 'GuestId', 'Serial Number', 'Document Date', 'PrevRoomTypeId', 'PrevRoomNumber', 'PrevBedNumber', 'RoomTypeId', 'Room Type', 'Room Number', 'Bed Number', 'Comments', 'Active'],
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
                { name: "PrevBedNumber", width: 40, align: 'left', resizable: false, hidden: true },
                { name: "RoomTypeId", width: 40, align: 'left', editable: true, resizable: false, hidden: true },
                { name: "RoomTypeDesc", width: 200, align: 'left', editable: true, resizable: false },
                { name: "RoomNumber", width: 120, align: 'left', editable: true, resizable: false, hidden: false },
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
    $("#btnSaveRoomChange").html('<i class="far fa-save"></i> ' + 'Save');
    $("#btnSaveRoomChange").attr('disabled', false);
}

function fnSaveRoomChangeChange() {
    if (IsStringNullorEmpty($("#hfdBookingKey").val())) {
        toastr.warning("Please add the Booking Key");
        return;
    }
    if (IsStringNullorEmpty($("#hfdGuestId").val())) {
        toastr.warning("Please add the GuestId");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomTypeId").val()) || $("#cboRoomTypeId").val() === "0" || $("#cboRoomTypeId").val() === '0') {
        toastr.warning("Please select a Room Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomNumber").val()) || $("#cboRoomNumber").val() === "0" || $("#cboRoomNumber").val() === '0') {
        toastr.warning("Please select a Room Number");
        return;
    }
    if (IsStringNullorEmpty($("#cboBedNumber").val()) || $("#cboBedNumber").val() === "0" || $("#cboBedNumber").val() === '0') {
        toastr.warning("Please select a Bed Number");
        return;
    }

    $("#btnSaveRoomChange").attr('disabled', true);
    var objroom = {
        BookingKey: $("#hfdBookingKey").val(),
        GuestId: $("#hfdGuestId").val(),
        SerialNumber: $("#txtRChangeserialnumber").val() === '' ? 0 : $("#txtRChangeserialnumber").val(),
        RoomTypeId: $("#cboRoomTypeId").val(),
        RoomNumber: $("#cboRoomNumber").val(),
        BedNumber: $("#cboBedNumber").val(),
        Comment: $("#txtComments").val(),
        //CheckInDate: getDate($("#txtRschedulcheckindate")),
        ActiveStatus: true
    };
    $.ajax({
        url: getBaseURL() + '/FrontOffice/InsertGuestRoomchange',
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
//Guest Room Change End


//CancelReservation Start
function fnOpenCancelReservation() {
    $("#PopupReasonforCancellationAlert").modal('show');
    fnCancelGuestCancellationProcess();
}

function fnGuestCancellationProcess() {
    $("#PopupReasonforCancellationAlert").modal('show');
    $("#btCancelGuestBooking").attr('disabled', false);
    $("#btnConfirmGuestCancellationProcess").attr('disabled', false);
    $('#txtReasonforCancellation').val('');

}
function fnCancelGuestCancellationProcess() {
    $("#PopupReasonforCancellationAlert").modal('hide');
    $("#btCancelGuestBooking").attr('disabled', false);
    $("#btnConfirmGuestCancellationProcess").attr('disabled', false);
    $("#txtReasonforCancellation").val('');

}
function fnConfirmGuestCancellationProcess() {
    if (IsStringNullorEmpty($("#txtReasonforCancellation").val())) {
        toastr.warning("Please Enter Reason for Cancellation the Booking");
        return;
    }

    //$("#btCancelGuestBooking").prop('disabled', true);
    $("#btnConfirmGuestCancellationProcess").attr('disabled', true);
    var obj = {
        BookingKey: $('#hfdBookingKey').val(),
        ReasonforCancellation: $('#txtReasonforCancellation').val(),
    }

    var URL = getBaseURL() + '/FrontOffice/GuestBookingCancellationProcess';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Guest Booking has been cancelled Successfully.");
                $("#PopupReasonforCancellationAlert").modal('hide');
                fnCancelGuestCancellationProcess();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnConfirmGuestCancellationProcess").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnConfirmGuestCancellationProcess").attr('disabled', false);
        }
    });
}
//CancelReservation End