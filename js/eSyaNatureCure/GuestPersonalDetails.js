$(document).ready(function () {

    $('#txtGPincode').blur(function () {

        if (!IsStringNullorEmpty($("#txtGPincode").val())) {
            $.ajax({
                url: getBaseURL() + '/CheckInGuest/GetAreaDetailsbyPincode?isdCode=' + _cnfISDCode + '&pincode=' + $("#txtGPincode").val(),
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    if (result != null) {
                        BindStates();
                        $('#cboGState').val(result.StateCode);
                        $('#cboGState').selectpicker('refresh');
                        BindCities();
                        $('#cboGCity').val(result.CityCode);
                        $('#cboGCity').selectpicker('refresh');
                        BindAreas();
                        if ($('#cboGArea').children('option').length > 2)
                            $('#cboGArea').val("0");
                        else
                            $('#cboGArea').val(result.AreaCode);
                        $('#cboGArea').selectpicker('refresh');
                    }

                    else {
                        $('#cboGState').selectpicker('refresh');
                        $('#CityGCode').selectpicker('refresh');
                        $('#cboGArea').selectpicker('refresh');
                    }
                },
                error: function (result) {
                    //Your error message
                    $('#cboGState').selectpicker('refresh');
                    $('#CityGCode').selectpicker('refresh');
                    $('#cboGArea').selectpicker('refresh');
                },
                async: false,
                processData: false
            });
        }
        else {
            var cityCode = $('#cboGCity').val();
            BindCities();
            $('#cboGCity').val(cityCode);
            $('#cboGCity').selectpicker('refresh');
            BindAreas();
        }

    });

});

function fncboGState_change() {
    BindCities();
    BindAreas();
}

function fncboGCity_change() {
    BindAreas();
}

function BindStates() {

    $("#cboGState").empty();

    $.ajax({
        url: getBaseURL() + '/CheckInGuest/GetStateList?isdCode=' + _cnfISDCode,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboGState").empty();
            $("#cboGState").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboGState").append($("<option></option>").val(response[i]["PlaceId"]).html(response[i]["PlaceName"]));
            }
            $('#cboGState').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


}

function BindCities() {

    $("#cboGCity").empty();
    $.ajax({
        url: getBaseURL() + '/CheckInGuest/GetCityList?isdCode=' + _cnfISDCode + '&stateCode=' + $("#cboGState").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboGCity").empty();

            $("#cboGCity").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboGCity").append($("<option></option>").val(response[i]["PlaceId"]).html(response[i]["PlaceName"]));
            }
            $('#cboGCity').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


}

function BindAreas() {

    $("#cboGArea").empty();
    $.ajax({

        url: getBaseURL() + '/CheckInGuest/GetAreaList?isdCode=' + _cnfISDCode + "&stateCode=" + $('#cboGState').val()
            + "&cityCode=" + $('#cboGCity').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboGArea").empty();
            $("#cboGArea").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboGArea").append($("<option data-pincode=" + response[i].Pincode + "></option>").val(response[i]["AreaCode"]).html(response[i]["AreaName"]));
            }
            $('#cboGArea').selectpicker('refresh');
        },

        async: false,
        processData: false
    });
}

function fnEditGuestCheckin()
{
   
    var Gprowid = $("#jqgGuestDetails").jqGrid('getGridParam', 'selrow');
    var GprowData = $('#jqgGuestDetails').jqGrid('getRowData', Gprowid);

    if (chkGuestCheckout == "True" ) {
        toastr.warning("Not Allowed to Update the details of Checked out Guest");
        return;
    }
    //if (chkGuestCheckin == "True" && _userFormRole.IsAuthenticate == false)
    //{
    //    toastr.warning("Not Allowed to Update the details of Un Authenticate User");
    //    return;
    //}

    //if (GprowData.IsCheckedIn == "false" && _userFormRole.IsAuthenticate == false) {
    //    toastr.warning("Not Allowed to Update the details of Un Authenticate User");
    //    return;
    //}
    $("#hiddenBookingKey").val(GprowData.BookingKey);
    $("#hiddenGuestId").val(GprowData.GuestId);
    $("#txtGFirstName").val(GprowData.FirstName);
    $("#txtGLastName").val(GprowData.LastName);
    //if (GprowData.DateOfBirth !== null) {
    //    setDate($('#txtGDateOfBirth'), fnGetDateFormat(GprowData.DateOfBirth));
    //}
    //else {
    //    $('#txtGDateOfBirth').val('');
    //}
    $("#txtGAgeYY").val(GprowData.AgeYy);
    $("#cboGGender").val(GprowData.Gender).selectpicker('refresh');
    $("#cboMobileGNo").val(GprowData.Isdcode).selectpicker('refresh');
    $("#txtMobileGNo").val(GprowData.MobileNumber);
    $("#txtGEmailId").val(GprowData.EmailId);
    $("#txtGAddress").val(GprowData.Address);
    BindStates();
    $("#cboGState").val(GprowData.StateCode).selectpicker('refresh');
    BindCities();
    $("#cboGCity").val(GprowData.CityCode).selectpicker('refresh');
    BindAreas();
    $("#cboGArea").val(GprowData.AreaCode).selectpicker('refresh');
    $("#txtGPincode").val(GprowData.Pincode);
    $('#PopupGuestDetails').modal('show');
    $("#btnUpdateGuestDetails").attr("disabled", false);
    $("#btnUpdateGuestDetails").html('Update')
}

function fnUpdateGuestDetails() {
   
    if (IsStringNullorEmpty($("#hiddenBookingKey").val())) {
        toastr.warning("Booking Key is not Exists");
        return;
    }
    if (IsStringNullorEmpty($("#hiddenGuestId").val())) {
        toastr.warning("Guest Id is not Exists");
        return;
    }
    if (IsStringNullorEmpty($("#txtGFirstName").val())) {
        toastr.warning("Please Enter First Name");
        return;
    }
    if (IsStringNullorEmpty($("#txtGLastName").val())) {
        toastr.warning("Please Enter Last Name");
        return;
    }
    if (IsStringNullorEmpty($("#txtGAgeYY").val())) {
        toastr.warning("Please Enter Age");
        return;
    }
    if (IsStringNullorEmpty($("#cboMobileGNo").val()) || $("#cboMobileGNo").val() === "0") {
        toastr.warning("Please select ISD Code");
        return;
    }
    if (IsStringNullorEmpty($("#txtMobileGNo").val())) {
        toastr.warning("Please Enter Mobile Number");
        return;
    }
   
    objguestupdate = {
        BookingKey: $("#hiddenBookingKey").val(),
        GuestId: $("#hiddenGuestId").val(),
        FirstName: $("#txtGFirstName").val(),
        LastName: $("#txtGLastName").val(),
        Gender: $("#cboGGender").val(),
        AgeYy: $("#txtGAgeYY").val(),
        Isdcode: $("#cboMobileGNo").val(),
        MobileNumber: $("#txtMobileGNo").val(),
        EmailId: $("#txtGEmailId").val(),
        Address: $("#txtGAddress").val(),
        AreaCode: $("#cboGArea").val(),
        StateCode: $("#cboGState").val(),
        CityCode: $("#cboGCity").val(),
        Pincode: $("#txtGPincode").val()
        
    };

    $("#btnUpdateGuestDetails").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/CheckInGuest/UpdateGuestPersonalDetails',
        type: 'POST',
        datatype: 'json',
        data: {obj: objguestupdate },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnUpdateGuestDetails").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupGuestDetails").modal('hide');
                fnClearUpdateGuestDetails();
                fnGridRefreshUpdateGuestDetails();
            }
            else {
                toastr.error(response.Message);
                $("#btnUpdateGuestDetails").html('Update');
                $("#btnUpdateGuestDetails").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnUpdateGuestDetails").html('Update');
            $("#btnUpdateGuestDetails").attr("disabled", false);
        }
    });
}

function fnGridRefreshUpdateGuestDetails() {
    $("#jqgGuestDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearUpdateGuestDetails() {
    $("#hiddenBookingKey").val('');
    $("#hiddenGuestId").val('');
    $("#txtGFirstName").val('');
    $("#txtGLastName").val('');
    $("#txtGAgeYY").val('');
    $('#cboGGender').val('0').selectpicker('refresh');
    $('#cboGGender').prop('disabled', true).selectpicker('refresh');
    $('#cboMobileGNo').val('0').selectpicker('refresh');
    $("#txtMobileGNo").val('');
    $("#txtGEmailId").val('');
    $("#txtGAddress").val('');
    $("#txtGPincode").val('');
    $('#cboGState').val('0').selectpicker('refresh');
    $('#cboGCity').val('0').selectpicker('refresh');
    $('#cboGArea').val('0').selectpicker('refresh');
    $("#btnUpdateGuestDetails").attr("disabled", false);
}

$("#btnCancelUpdateGuestDetails").click(function () {
    $("#jqgGuestDetails").jqGrid('resetSelection');
    $('#PopupGuestDetails').modal('hide');
    fnClearUpdateGuestDetails();
});