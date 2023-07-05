$(document).ready(function () {
    //fnSetCurrentdate();
    fnGridLoadGuestBookingDetails();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnGuestBooking",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: 'Booking Voucher', icon: "edit", callback: function (key, opt) { fnDownloadVoucher(event) } },
            jqgView: { name: 'Print Invoice', icon: "view", callback: function (key, opt) { fnPrintGuestInvoiceBill(event) } },
           
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-book'></i>View Voucher</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-file-invoice'></i>Print Invoice </span>");
   
});

function fnGridLoadGuestBookingDetails(type) {

    var url = getBaseURL() + '/GuestBooking/GetGuestBookingBySearchCreteria';
    if (type === "P")
        url = getBaseURL() + '/GuestBooking/GetGuestBookingPaymentFailedDetails';

    url += '?roomTypeId = ' + $("#cboRoomTypeId").val() + ' & roomNumber=' + $("#cboRoomNumber").val()
        + '&bedNumber=' + $("#cboBedNumber").val() + '&occupancyType=' + $("#cboOccupancyType").val() + '&gender=' + $("#cboGender").val() + '&bookingFrom=' + $("#txtBookedfromdate").val()
        + '&bookingTo=' + $("#txtBookedtodate").val() + '&checkInDate=' + $("#txtCheckIndate").val() + '&checkOutDate=' + $("#txtCheckOutdate").val()
        + '&isOnCheckInOutDate=' + $('input[type="checkbox"]').prop("checked");

    $("#jqgGuestBookingDetail").GridUnload();

    $("#jqgGuestBookingDetail").jqGrid({
        //url: getBaseURL() + '/GuestBooking/GetGuestBookingBySearchCreteria?roomTypeId=' + $("#cboRoomTypeId").val() + '&roomNumber=' + $("#cboRoomNumber").val()
        //    + '&bedNumber=' + $("#cboBedNumber").val() + '&occupancyType=' + $("#cboOccupancyType").val() + '&gender=' + $("#cboGender").val() + '&bookingFrom=' + $("#txtBookedfromdate").val()
        //    + '&bookingTo=' + $("#txtBookedtodate").val() + '&checkInDate=' + $("#txtCheckIndate").val() + '&checkOutDate=' + $("#txtCheckOutdate").val() + '&isOnCheckInOutDate=' + $('input[type="checkbox"]').prop("checked"),
        url: url,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Booking Date", "Booking Key", "GuestId", "Guest Name", "Age", "Gender", "MobileNo", "Place","Check In", "Check Out", "Payment Method", "Net Package Amount", "Paid", "RoomTypeId", "Room Type", "Room No.", "Bed No.", "PackagePrice", "Occupancy Type", "Status", "View"],
        colModel: [
            { name: "BookingDate", width: 80, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            { name: "BookingKey", width: 80, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "GuestId", width: 80, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "GuestName", width: 120, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "Age", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "Gender", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "M: Male;F: Female;B: Both;" } },
            { name: "MobileNo", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "Place", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "CheckInDate", width: 80, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            { name: "CheckOutDate", width: 80, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            { name: "PaymentMethod", editable: true, align: 'left', width: 40, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "C: Pay At Receiption;N: Pay Online;" }, hidden: true },
            { name: "NetPackageAmount", width: 90, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "PaymentReceived", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "RoomTypeId", width: 30, align: 'left', resizable: false, hidden: true },
            { name: "RoomTypeName", width: 100, align: 'left', resizable: false },
            { name: "RoomTypeNumber", width: 60, align: 'left', resizable: false, hidden: false },
            { name: "BedNumber", width: 60, align: 'left', resizable: false, hidden: false },
            { name: "PackagePrice", width: 70, align: 'left', resizable: false },
            { name: "OccupancyType", editable: true, align: 'left', width: 70, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "T: Sharing;C: Clubbed;S: Single;" } },
            { name: "BookingStatus", editable: true, align: 'center', width: 60, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "BK: Booked;CI: CheckIn;CO: CheckOut;PY: Payment Failed;" } },
            {
                name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {

                    if (type === "P")
                        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnFetchPaymentOrder(event);"><i class="far fa-credit-card"></i> ' + "Fetch" + '</button>';
                    else
                        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnViewGuestBooking(event,\'view\');"><i class="far fa-eye"></i> ' + "View" + '</button>'+
                                '<button class="mr-1 btn btn-outline" id="btnGuestBooking"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
             
        ],
        rowNum: 100000,
        rownumWidth: '55',
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll: true,
        loadonce: true,
        width: 'auto',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: 'Guest Booking Detail',
        pager: "#jqpGuestBookingDetail",
        onSelectRow: function (rowid) {

        },
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgGuestBookingDetail");
        },
        gridComplete: function () {
            var rows = $("#jqgGuestBookingDetail").getDataIDs();
            for (var i = 0; i < rows.length; i++) {
                var status = $("#jqgGuestBookingDetail").getCell(rows[i], "BookingStatus");
                if (status === "BK") {
                    $("#jqgGuestBookingDetail").jqGrid('setRowData', rows[i], false, { background: '#fff4b3' });
                }
                if (status === "CI") {
                    $("#jqgGuestBookingDetail").jqGrid('setRowData', rows[i], false, { background: '#b3ffb3' });
                }
                if (status === "CO") {
                    $("#jqgGuestBookingDetail").jqGrid('setRowData', rows[i], false, { background: '#ffb3b3' });
                }
            }
        }
    });

}

function rowColorFormatter(cellValue, options, rowObject) {
    if (cellValue == "True")
        rowsToColor[rowsToColor.length] = options.rowId;
    return cellValue;
}

function fnSetCurrentdate() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    document.getElementById("txtBookedfromdate").value = today;
    document.getElementById("txtBookedtodate").value = today;
    document.getElementById("txtCheckIndate").value = today;
    document.getElementById("txtCheckOutdate").value = today;
}

function fnClearFields() {
    //fnSetCurrentdate();
    $('#cboRoomTypeId').val('0').selectpicker('refresh');
    $('#cboRoomNumber').val('0').selectpicker('refresh');
    $('#cboBedNumber').val('0').selectpicker('refresh');
    $('#cboOccupancyType').val('0').selectpicker('refresh');
    $('#cboGender').val('0').selectpicker('refresh');
    $('#txtBookedfromdate').val('');
    $('#txtBookedtodate').val('');
    $('#txtCheckIndate').val('');
    $('#txtCheckOutdate').val('');
}


function fnViewGuestBooking(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgGuestBookingDetail').jqGrid('getRowData', rowid);

    var url = getBaseURL() + '/eSyaNatureCure/CheckInGuest/V_ENC_04_00?bookingKey=' + rowData.BookingKey + '&guestId=' + rowData.GuestId;

    //window.location.href = url;
    window.open(url, '_blank');
}


function fnFetchPaymentOrder(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgGuestBookingDetail').jqGrid('getRowData', rowid);

    $.ajax({
        url: getBaseURL() + '/CheckInGuest/FetchPaymentOrder?bookingKey=' + rowData.BookingKey,
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {

            if (result.status === "E") {
                fnProcessPaymentOrder(result);
            }
            else {
                alert(JSON.stringify(result));
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}

function fnProcessPaymentOrder(obj) {

    $.ajax({
        url: getBaseURL() + '/CheckInGuest/CheckOnlinePaymentAndMakePaymentReceipt',
        type: 'POST',
        datatype: 'json',
        data: obj,
        async: false,
        success: function (result) {
            if (result.status === true) {
                toastr.success("Paid Completed");
                fnGridLoadGuestBookingDetails("P");
            }
            else {
                alert(JSON.stringify(result));
            }
         
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}

function fnDownloadVoucher(e) {

    var rowid = $("#jqgGuestBookingDetail").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgGuestBookingDetail').jqGrid('getRowData', rowid);

    window.open(getReportBaseURL() + '/eSyaNatureCure/ReportViewer/BookingVoucher?businessKey=' + $('#hdBusinessKey').val() + '&bookingKey=' + rowData.BookingKey, "popupWindow", "width=700,height=800,scrollbars=yes");
}

function fnPrintGuestInvoiceBill(e) {

    var rowid = $("#jqgGuestBookingDetail").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgGuestBookingDetail').jqGrid('getRowData', rowid);

    $.get(getBaseURL() + '/CheckInGuest/GetGuestCheckOutStatus?bookingKey=' + rowData.BookingKey + '&guestId=' + rowData.GuestId,
        function (data) {
            if (data.Status)
                window.open(getReportBaseURL() + '/eSyaNatureCure/ReportViewer/GuestInvoiceBill?businessKey=' + $('#hdBusinessKey').val()  + '&bookingKey=' + rowData.BookingKey, "popupWindow", "width=700,height=800,scrollbars=yes");
            else {
                toastr.warning("Bill Print will be enable after checkout process is completed.");
            }
        });


}