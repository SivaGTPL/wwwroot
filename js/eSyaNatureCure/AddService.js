$(document).ready(function () {

    var todaydt = new Date();
    $("#txtServicedate").datepicker({
        autoclose: true,
        dateFormat: _cnfDateFormat,
        endDate: todaydt
        
    });
});

function fnLoadITAddOnServices() {
    $("#jqgITAddOnServices").jqGrid("GridUnload");
    $("#jqgITAddOnServices").jqGrid(
        {
            url: getBaseURL() + '/CheckInGuest/GetGuestServiceByBookingKey?bookingKey=' + $("#hdBookingKey").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {

            },
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ['Business Key', 'Booking Key', 'Serial Number', 'Service Id', 'Service Description', 'ServiceType Id', 'Service Date', 'Qty', 'Rate', 'Discount', 'Concession Amount', 'ServiceCharge Amount', 'Net Amount', 'Active'],
            colModel: [
                { name: 'BusinessKey', index: 'BusinessKey', width: '100', hidden: true },
                { name: 'BookingKey', index: 'BookingKey', width: '100', hidden: true },
                { name: 'SerialNumber', index: 'SerialNumber', width: '100', hidden: true },
                { name: 'ServiceId', index: 'ServiceId', width: '100', hidden: true },
                { name: 'ServiceName', index: 'ServiceName', width: '300' },
                { name: 'ServiceTypeId', index: 'ServiceTypeId', width: '100', hidden: true },
                {
                    name: 'ServiceDate', index: 'ServiceDate', width: 180, sortable: true, hidden: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                { name: 'Quantity', index: 'Quantity', width: '80', align: "right", editable: true, formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 0, thousandsSeparator: ',' } },
                { name: 'Rate', index: 'Rate', width: '120', align: "right", editable: false, formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 0, thousandsSeparator: ',' } },
                { name: 'DiscountAmount', index: 'DiscountAmount', width: '100', align: "right", formatter: 'integer', hidden: true, formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: 'ConcessionAmount', index: 'ConcessionAmount', width: '100', align: "right", formatter: 'integer', hidden: true, formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: 'ServiceChargeAmount', index: 'ServiceChargeAmount', width: '100', align: "right", formatter: 'integer', hidden: true, formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: 'TotalAmount', index: 'TotalAmount', width: '150', align: "right", formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: "ActiveStatus", width: 200, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } }

            ],
            rowNum: 10,
            pager: "#jqpITAddOnServices",
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
            loadBeforeSend: function () {
                $("#jqgh_jqgITAddOnServices_Rate").css('text-align', 'right');
            },
            loadComplete: function (data) {
                fnAddGridSerialNoHeading();
                fnJqgridSmallScreen("jqgITRescheduling");
            },
        }).jqGrid('navGrid', '#jqpITAddOnServices', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' })
        .jqGrid('navButtonAdd', '#jqpITAddOnServices', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAddServices
        }).jqGrid('navButtonAdd', '#jqpITAddOnServices', {
            caption: '<span class="fa fa-plus" data-toggle="modal" data-whatever="something" style="padding-right:5px;padding-top:2px;padding-right: 2px; vertical-align:text-top;margin-left:8px;"></span> Add', buttonicon: 'none', id: 'custITAdd', position: 'first', onClickButton: fnAddITService
        });
}

function fnGridRefreshAddServices() {
    $("#jqgITAddOnServices").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnAddITService() {
    
    LoadServices();
    fnClearAddService();
    $("#popUpITAddService").modal('show');
}

function fnClearAddService() {
    $('#cboServices').val('0').selectpicker('refresh');
    $("#txtaddserviceSerialNumber").val('');
    $("#txtServicedate").val('');
    $('#txtQuantity').val('');
    $('#txtaddServiceRate').val('');
    $("#btnServices").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnServices").attr('disabled', false);
}

function LoadServices()
{
    $.get(getBaseURL() + '/CheckInGuest/GetServiceList',
        function (data) {
            var s = '<option value="0">Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].ServiceId + '">' + data[i].ServiceDesc + '</option>';
            }
            $("#cboServices").html(s);
            $("#cboServices").selectpicker('refresh');
        });
}

function fnAddServicesChanged(event) {
    $("#txtaddServiceRate").val(0);
    $.get(getBaseURL() + '/CheckInGuest/GetServiceRates?serviceId=' + $("#cboServices").val(),
        function (data) {
            $("#txtaddServiceRate").val(data.ServiceRate);
        });
}

function fnSaveService() {

    if (chkGuestCheckout == "True") {
        toastr.warning("Not Allowed to Update the details of Checked out Guest");
        return;
    }
    //if (_userFormRole.IsAuthenticate == false) {
    //    toastr.warning("Not Allowed to Save Un Authenticate User");
    //    return;
    //}
    if (IsStringNullorEmpty($("#hdBookingKey").val())) {
        toastr.warning("Please Add BookingKey");
        return;
    }

    if (IsStringNullorEmpty($("#cboServices").val()) || $("#cboServices").val()==='0') {
        toastr.warning("Please Select Services");
        return;
    }
    if (IsStringNullorEmpty($("#txtServicedate").val())) {
        toastr.warning("Please Select Service date");
        return;
    }
    if (IsStringNullorEmpty($("#txtQuantity").val()) || $("#txtQuantity").val() === '0') {
        toastr.warning("Please Enter Quantity");
        return;
    }
    var tamount = $("#txtQuantity").val() * $("#txtaddServiceRate").val();
    $("#btnServices").attr('disabled', true);
    var objservice = {
        BookingKey: $("#hdBookingKey").val(),
        SerialNumber: $("#txtaddserviceSerialNumber").val() === '' ? 0 : $("#txtaddserviceSerialNumber").val(),
        ServiceDate: getDate($("#txtServicedate")),
        ServiceTypeId:0,
        ServiceId: $("#cboServices").val(),
        Quantity: $("#txtQuantity").val(),
        Rate: $("#txtaddServiceRate").val(),
        DiscountAmount: 0,
        ConcessionAmount: 0,
        ServiceChargeAmount: 0,
        TotalAmount: tamount,
        ActiveStatus: true
    };
    $.ajax({
        url: getBaseURL() + '/CheckInGuest/InsertGuestService',
        type: "POST",
        dataType: "json",
        data: { obj: objservice },
        success: function (response) {
          
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#btnServices").attr('disabled', false);
                    $("#popUpITAddService").modal('hide');
                    fnGridRefreshAddServices();
                    fnClearAddService();

                }
                else {
                    toastr.error(response.Message);
                    $("#btnServices").attr('disabled', false);
                }
           
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnServices").attr("disabled", false);
        }
    });
    //$("#btnServices").attr('disabled', false);
}