function getPatientInfo(uhid) {
    $.get(getBaseURL() + '/PatientInfo/GetPatientProfileByUHID', {
        uhid: uhid
    }, function (data, status) {
        $("#txtFirstName").val(data.FirstName);
        $("#txtMiddleName").val(data.MiddleName);
        $("#txtLastName").val(data.LastName);
        $("#cboGender").val(data.Gender);
        $("#cboGender").selectpicker("refresh");
        $("#txtDateOfBirth").val(fnFormatDateJsonToInput(data.DateOfBirth));
        $("#txtDateOfBirthYY").val(data.AgeYY);
        $("#txtDateOfBirthMM").val(data.AgeMM);
        $("#txtDateOfBirthDD").val(data.AgeDD);
        $("#txtEmail").val(data.eMailID);
        $("#cboNationality").val(data.Nationality);
        $("#cboNationality").selectpicker("refresh");
        if (data.CurrentPatientAddress !== null) {
            $("#txtAddress").val(data.CurrentPatientAddress.Address);

            _clinicType = 0;
            _sp = 0;
            _doc = 0;
            _stateCode = data.CurrentPatientAddress.StateCode;
            _cityCode = data.CurrentPatientAddress.CityCode;
            _areaCode = data.CurrentPatientAddress.AreaCode;
            $("#txtPincode").val(data.CurrentPatientAddress.Pincode);
            populateState();
        }
    });
    return null;
}

function getPatientbookingInfo(_appkey) {
    var appK = _appkey;
    $.get(getBaseURL() + '/PatientInfo/getPatientbookingInfo', {
        appKey: appK
    }, function (data, status) {

        $("#txtFirstName").val(data.FirstName);
        $("#txtMiddleName").val(data.MiddleName);
        $("#txtLastName").val(data.LastName);
        $("#cboGender").val(data.Gender);
        $("#cboGender").selectpicker("refresh");
        $("#txtDateOfBirth").val(fnFormatDateJsonToInput(data.DateOfBirth));
        $("#txtEmail").val(data.eMailID);
        $("#txtDateOfBirthYY").val(data.AgeYY);
        $("#txtDateOfBirthMM").val(data.AgeMM);
        $("#txtDateOfBirthDD").val(data.AgeDD);

        _clinicType = data.ClinicId + '-' + data.ConsultationId;
        $("#cboClinicType").val(_clinicType);
        $("#cboClinicType").selectpicker('refresh');
        _sp = data.SpecialtyId;
        $("#cboSpecialty").val(_sp);
        $("#cboSpecialty").selectpicker('refresh');
        _doc = data.DoctorId;
        populateDoctors();
        if (data.CurrentPatientAddress != null) {
            $("#txtAddress").val(data.CurrentPatientAddress.Address);
            _state = data.CurrentPatientAddress.StateCode;
            _city = data.CurrentPatientAddress.CityCode;
            _area = data.CurrentPatientAddress.AreaCode;

            populateState();
        }
    });
    return null;
}