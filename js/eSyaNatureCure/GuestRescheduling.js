var _isInsert = true;
var actiontype = "";
var nodays = 0;
$(document).ready(function () {
    
    //var todaydt = new Date();
    //$("#txtRschedulcheckindate").datepicker({
    //    autoclose: true,
    //    dateFormat: _cnfDateFormat,
        //endDate: todaydt,
        //     onSelect: function (date) {
        //    //Get selected date
        //         var date2 = $('#txtRschedulcheckindate').datepicker('getDate');
        //    //sets minDate to txtTillDate
        //         $('#txtRschedulcheckoutdate').datepicker('option', 'minDate', date2);
        //}
    //});
        
    //$('#txtRschedulcheckoutdate').datepicker({
    //    dateFormat: _cnfDateFormat,
    //});
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

function fnLoadITRescheduling()
{
    
    fnLoadGridReScheduling();

    var cindate =new Date($('#txtCheckin').html());
    var coutdate = new Date($('#txtCheckout').html());
    if (cindate !== null) {
        var chkIdate = cindate.toLocaleDateString("es-US");
        setDate($('#txtRschedulcheckindate'), fnGetDateFormat(chkIdate));
    }
    else {
        $('#txtRschedulcheckindate').val('');
    }

    if (coutdate !== null) {
        var chkodate = coutdate.toLocaleDateString("es-US");
        setDate($('#txtRschedulcheckoutdate'), fnGetDateFormat(chkodate));
        $("#txtRschedulcheckoutdate").prop('disabled', true);
    }
    else {
        $('#txtRschedulcheckoutdate').val('');
    }


    if (!IsStringNullorEmpty($("#txtRschedulcheckindate").val()) && !IsStringNullorEmpty($("#txtRschedulcheckoutdate").val())) {
        nodays = CountNumberofDays($("#txtRschedulcheckindate").val(), $("#txtRschedulcheckoutdate").val());
    }
}
function CountNumberofDays(prechkIndate, prechkOutdate) {
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

    nodays = Math.round(Math.abs(days));
    return nodays;
}
function fnLoadGridReScheduling()
{

    $("#jqgITRescheduling").jqGrid("GridUnload");
    $("#jqgITRescheduling").jqGrid(
        {
            url: getBaseURL() + '/CheckInGuest/GetGuestReschedulingByBookingKey?bookingKey=' + $("#hdBookingKey").val(),
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
    $("#btnSaveRSchedul").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnSaveRSchedul").attr('disabled', false);
}

function fnSaveGuestReScheduling() {

    if (chkGuestCheckout == "True") {
        toastr.warning("Not Allowed to Update the details of Checked out Guest");
        return;
    }

    if (_userFormRole.IsAuthenticate == false) {
        toastr.warning("Not Allowed to Save Un Authenticate User");
        return;
    }

    if (IsStringNullorEmpty($("#hdBookingKey").val())) {
        toastr.warning("Please Add BookingKey");
        return;
    }

    if (IsStringNullorEmpty($("#txtRschedulcheckindate").val())) {
        toastr.warning("Please select check In date");
        return;
    }
    if (IsStringNullorEmpty($("#txtRschedulcheckoutdate").val())) {
        toastr.warning("Please Select select check Out date");
        return;
    }
    $("#btnSaveRSchedul").attr('disabled', true);
    var objreschedule = {
        BookingKey: $("#hdBookingKey").val(),
        SerialNumber: $("#txtRSchedulserialnumber").val() === '' ? 0 : $("#txtRSchedulserialnumber").val(),
        CheckInDate: getDate($("#txtRschedulcheckindate")),
        CheckOutDate: getDate($("#txtRschedulcheckoutdate")),
        ActiveStatus: true
        };
    $.ajax({
        url: getBaseURL() + '/CheckInGuest/InsertGuestRescheduling',
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

