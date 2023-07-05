$(document).ready(function () {
    $("#sectionBusinessAddress").hide();

});

$('input[name="number"]').keyup(function (e) {
    if (/\D/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});

function fnBusinessLocation_onChange() {

    fnClearBusinessAddressFields();
    $("#sectionBusinessAddress").show();
    fnGetISDCodesbyBusinessKey();
    fnGetBusinessAddressbyBusinessKey();
    //$("#sectionBusinessAddress").show();

    ////BindStates();

}

function fnGetISDCodesbyBusinessKey() {
    var businesskey = $('#cboBusinessLocation').val();

    if (businesskey !== '' && businesskey !== '0' && businesskey !== "0") {
        $('#cboIsdCode').prop('disabled', false);
        $('#cboIsdCode').selectpicker('refresh');
        $("#cboIsdCode").empty();
        $.ajax({
            url: getBaseURL() + '/BusinessAddress/GetISDCodesbyBusinessKey?businessKey=' + businesskey,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                toastr.error('Error: ' + xhr.statusText);
            },
            success: function (response, data) {
                //refresh each time
                $("#cboIsdCode").empty();
                for (var i = 0; i < response.length; i++) {

                    $("#cboIsdCode").append($("<option></option>").val(response[i]["IsdCode"]).html(response[i]["CountryName"]));
                }
                $('#cboIsdCode').selectpicker('refresh');
                $("#cboIsdCode option:first").attr('selected', 'selected')
                $('#cboIsdCode').prop('disabled', true);
                $('#cboIsdCode').selectpicker('refresh');
                BindStates();

            },
            async: false,
            processData: false
        });

    }
}

function fnGetBusinessAddressbyBusinessKey() {
    var businesskey = $('#cboBusinessLocation').val();
    var Isdcode = $('#cboIsdCode').val();
   
    if (!IsStringNullorEmpty(businesskey) && businesskey !== '0' && businesskey !== "0" && !IsStringNullorEmpty(Isdcode)) {

        $.ajax({
            url: getBaseURL() + '/BusinessAddress/GetBusinessAddressbyBusinessKey?businessKey=' + businesskey + '&isdCode=' + Isdcode,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                toastr.error('Error: ' + xhr.statusText);
            },
            success: function (response) {
                if (response != null) {
                   fnClearBusinessAddressFields();
                    BindStates();
                    $('#cboState').val(response.StateCode).selectpicker('refresh');
                    BindCities();
                    $('#cboCity').val(response.CityCode).selectpicker('refresh');
                    BindAreas();
                    $('#cboArea').val(response.AreaCode).selectpicker('refresh');
                    $('#txtPinCode').val(response.Pincode);
                    $('#txtAddress').val(response.Address);
                    $('#txtPhoneNumber').val(response.PhoneNumber);
                    $('#txtEmergencyNumber').val(response.EmergencyNumber);
                    $('#txtEmailId').val(response.EMailId);
                    $('#txtWebSite').val(response.WebSite);
                }
            },
            async: false,
            processData: false
        });

    }
}

function fnClearBusinessAddressFields() {
    $("#cboState").val('0').selectpicker('refresh');
    $("#cboCity").val('0').selectpicker('refresh');
    $("#cboArea").val('0').selectpicker('refresh');
    $("#txtPinCode").val('');
    $("#txtAddress").val('');
    $("#txtPhoneNumber").val('');
    $("#txtEmergencyNumber").val('');
    $("#txtEmailId").val('');
    $("#txtWebSite").val('');
    $("#btnSaveBusinessAddress").attr("disabled", false);
    $("#btbtnSaveBusinessAddress").html('Save');
}

function fncboState_change() {
    BindCities();
    BindAreas();
}

function fncboCity_change() {
    BindAreas();
}

function fncboArea_change() {
    $("#txtPinCode").val($(':selected', $('#cboArea')).data('pincode'));
}

function BindStates() {

    $("#cboState").empty();

    $.ajax({
        url: getBaseURL() + '/BusinessAddress/GetStateList?isdCode=' + $("#cboIsdCode").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboState").empty();
                $("#cboState").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboState").append($("<option></option>").val(response[i]["PlaceId"]).html(response[i]["PlaceName"]));
                }
                $('#cboState').selectpicker('refresh');
            }
            else
            {
                $("#cboState").empty();
                $("#cboState").append($("<option value='0'> Select </option>"));
                $('#cboState').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function BindCities() {

    $("#cboCity").empty();
    $.ajax({
        url: getBaseURL() + '/BusinessAddress/GetCityList?isdCode=' + $("#cboIsdCode").val() + '&stateCode=' + $("#cboState").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboCity").empty();

                $("#cboCity").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCity").append($("<option></option>").val(response[i]["PlaceId"]).html(response[i]["PlaceName"]));
                }
                $('#cboCity').selectpicker('refresh');
            }
            else {
                $("#cboCity").empty();
                $("#cboCity").append($("<option value='0'> Select </option>"));
                $('#cboCity').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function BindAreas() {

    $("#cboArea").empty();
    $.ajax({

        url: getBaseURL() + '/BusinessAddress/GetAreaList?isdCode=' + $("#cboIsdCode").val() + "&stateCode=" + $('#cboState').val()
            + "&cityCode=" + $('#cboCity').val() + "&pincode=" + $('#txtPinCode').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {
           
            if (response != null) {
                //refresh each time
                $("#cboArea").empty();
                $("#cboArea").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboArea").append($("<option data-pincode=" + response[i].Pincode + "></option>").val(response[i]["AreaCode"]).html(response[i]["AreaName"]));
                }
                $('#cboArea').selectpicker('refresh');
            } else {
                $("#cboArea").empty();
                $("#cboArea").append($("<option value='0'> Select </option>"));
                $('#cboArea').selectpicker('refresh');
            }
        },

        async: false,
        processData: false
    });
}

$('#txtPinCode').blur(function () {

    if (!IsStringNullorEmpty($("#txtPinCode").val())) {
        $.ajax({
            url: getBaseURL() + '/BusinessAddress/GetAreaDetailsbyPincode?isdCode=' + $("#cboIsdCode").val() + '&pincode=' + $("#txtPinCode").val(),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null) {
                    // BindStates();
                    $('#cboState').val(result.StateCode);
                    $('#cboState').selectpicker('refresh');
                    BindCities();
                    $('#cboCity').val(result.CityCode);
                    $('#cboCity').selectpicker('refresh');
                    BindAreas();
                    if ($('#cboArea').children('option').length > 2)
                        $('#cboArea').val("0");
                    else
                        $('#cboArea').val(result.AreaCode);
                    $('#cboArea').selectpicker('refresh');
                }

                else {
                    $('#cboState').selectpicker('refresh');
                    $('#CityCode').selectpicker('refresh');
                    $('#cboArea').selectpicker('refresh');
                }
            },
            error: function (result) {
                //Your error message
                $('#cboState').selectpicker('refresh');
                $('#CityCode').selectpicker('refresh');
                $('#cboArea').selectpicker('refresh');
            },
            async: false,
            processData: false
        });
    }
    else {
        var cityCode = $('#cboCity').val();
        BindCities();
        $('#cboCity').val(cityCode);
        $('#cboCity').selectpicker('refresh');
        BindAreas();
    }

});

function fnSaveBusinessAddress() {

    if (IsValidSaveBusinessAddress() === false) {
        return;
    }

    var obj = {
        BusinessKey: $('#cboBusinessLocation').val(),
        StateCode: $("#cboState").val(),
        CityCode: $("#cboCity").val(),
        AreaCode: $('#cboArea').val(),
        Address: $("#txtAddress").val(),
        Pincode: $("#txtPinCode").val(),
        EMailId: $("#txtEmailId").val(),
        WebSite: $("#txtWebSite").val(),
        PhoneNumber: $("#txtPhoneNumber").val(),
        EmergencyNumber: $("#txtEmergencyNumber").val()
       
    };
    $("#btnSaveBusinessAddress").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/BusinessAddress/InsertOrUpdateIntoBusinessAddress',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBusinessAddress").attr('disabled', false);
                fnClearBusinessAddressFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBusinessAddress").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBusinessAddress").attr('disabled', false);
        }
    });

}

function IsValidSaveBusinessAddress() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0" || $("#cboBusinessLocation").val() == '0') {
        toastr.warning("Please select a Business Key");
        return false;
    }
    if (IsStringNullorEmpty($("#cboIsdCode").val()) || $("#cboIsdCode").val() === "0") {
        toastr.warning("Selected Location not having segment linked to ISD Code");
        return false;
    }

    
    if (IsStringNullorEmpty($("#cboState").val()) || $("#cboState").val() == '0' || $("#cboState").val() == "0") {
        toastr.warning("Please Select a State");
        return false;
    }
    if (IsStringNullorEmpty($("#cboCity").val()) || $("#cboCity").val() == '0' || $("#cboCity").val() == "0") {
        toastr.warning("Please Select a City");
        return false;
    }
    if (IsStringNullorEmpty($("#cboArea").val()) || $("#cboArea").val() == '0' || $("#cboArea").val() == "0") {
        toastr.warning("Please Select a Area");
        return false;
    }
    if (!IsStringNullorEmpty($("#txtEmailId").val())) {

        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test($("#txtEmailId").val())) {
            toastr.warning("Please enter the valid Email Id");
            return false;
        }
    }
    if (IsStringNullorEmpty($("#txtAddress").val())) {
        toastr.warning("Please Enter the Address");
        return false;
    }
    

}

$("#btnBusinessAddressCancel").click(function () {

    fnClearBusinessAddressFields();
});