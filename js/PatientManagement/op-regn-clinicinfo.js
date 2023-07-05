var _state = 0;
var _city = 0;
var _area = 0;
var _clinicType = 0;
var _sp = 0;
var _doc = 0;

function populateEpisodeType() {

    fnShowLoadingDropdown($("#cboEpisodeType"));

    $.get(getBaseURL() + '/Registration/GetEpisodeType',
        function (data) {
            var s = '<option value="" disabled>select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].EpisodeId + '" >' + data[i].EpisodeDesc + '</option>';
            }
            $("#cboEpisodeType").html(s);
            $("#cboEpisodeType").val("C");
            $("#cboEpisodeType").selectpicker('refresh');
        });
}

var _isConsultantRequired = true;
function fnEpisodeType_onChange() {

    $('#dvAppointmentBooking').show();
    $('#dvClinicDoctorInfo').show();
    _isConsultantRequired = true;
    if ($('#cboEpisodeType').val() === "P" || $('#cboEpisodeType').val() === "O") {
        _isConsultantRequired = false;
        $('#dvAppointmentBooking').hide();
        $('#dvClinicDoctorInfo').hide();
    }
}

function populateClinicType() {
    
    $.get(getBaseURL() + '/Registration/GetClinictype', {},
        function (data, status) {
            var s = '<option value="">select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value=' + data[i].ClinicType + '-' + data[i].ConsultationType + ' data-clinictype=' + data[i].ClinicType + ' data-clinictypecode=' + data[i].ClinicTypeCode + ' data-consultationtype=' + data[i].ConsultationType + '  data-consultationtypecode=' + data[i].ConsultationTypeCode + '>' +
                    data[i].ClinicTypeDesc + ' - ' + data[i].ConsultationTypeDesc + '' + '</option>';
            }
            $("#cboClinicType").html(s);
            if (data.length === 1) {
                if (_clinicType !== 0) {
                    $("#cboClinicType").val(_clinicType);
                }
                else {
                    var sVal = $('#cboClinicType').find("option:first").val();
                    $("#cboClinicType").val(sVal);
                }
                
            }
            $("#cboClinicType").selectpicker('refresh');
    });
    return null;
}

function populateSpecialty() {
    $.get(getBaseURL() + '/Registration/GetSpecialty', {},
        function (data, status) {
            var s = '<option value="" disabled>select</option>';
            for (var i = 0; i < data.length; i++) {
                if (data.length === 1)
                    s += '<option value="' + data[i].SpecialtyId + '" selected>' + data[i].SpecialtyDesc + '</option>';
                else
                    s += '<option value="' + data[i].SpecialtyId + '" >' + data[i].SpecialtyDesc + '</option>';
            }
            $("#cboSpecialty").html(s);
            if (_sp !== 0) {
                $("#cboSpecialty").val(_sp);
            }
            $("#cboSpecialty").selectpicker('refresh');
        });
    return null;
}

function populateDoctors() {
    $.get(getBaseURL() + '/Registration/GetDoctorScheduleListByClinicTypeSpecialtyDate',
        {
            clinicTypeId: $(':selected', $('#cboClinicType')).data('clinictype'),
            consultationTypeId: $(':selected', $('#cboClinicType')).data('consultationtype'),
            specialtyId: $("#cboSpecialty").val()
        },
        function (data, status) {
            var s = '<option value="">select</option>';
            for (var i = 0; i < data.length; i++) {
                if (data.length === 1)
                    s += '<option value="' + data[i].DoctorId + '" selected>' + data[i].DoctorName + '</option>';
                else
                    s += '<option value="' + data[i].DoctorId + '" >' + data[i].DoctorName + '</option>';
            }
            $("#cboDoctors").html(s);
            if (_doc !== 0) {
                $("#cboDoctors").val(_doc);
            }
            $("#cboDoctors").selectpicker('refresh');
        });
    return null;
}

function populateNationality() {
    $.get(getBaseURL() + '/Master/GetISDCodes', {},
        function (data, status) {
            var s = '<option value="" disabled>select</option>';
            for (var i = 0; i < data.length; i++) {
                if (data.length === 1)
                    s += '<option value="' + data[i].IsdCode + '" selected>' + data[i].Nationality + '</option>';
                else
                    s += '<option value="' + data[i].IsdCode + '" >' + data[i].Nationality + '</option>';
            }
            $("#cboNationality").html(s);
            $("#cboNationality").val(_cnfISDCode);
            $("#cboNationality").selectpicker('refresh');
        });
    return null;
}

function populatePatientType() {
    $.get(getBaseURL() + '/Master/GetPatientType', {},
        function (data, status) {
            var s = '<option value="">select</option>';
            for (var i = 0; i < data.length; i++) {
                if (data.length === 1)
                    s += '<option value="' + data[i].PatientTypeID + '" selected>' + data[i].PatientTypeDesc + '</option>';
                else
                    s += '<option value="' + data[i].PatientTypeID + '" >' + data[i].PatientTypeDesc + '</option>';
            }
            $("#cboPatientType").html(s);
            $("#cboPatientType").selectpicker('refresh');
        });
    return null;
}

function populatePatientCategory() {
    $('#cboPatientCategory').html('');
    if ($('#cboPatientType').val() === -1) {
        return;
    }
    $.get(getBaseURL() + '/Master/GetPatientCategory', {
        patientTypeId: $('#cboPatientType').val()
    },
        function (data, status) {
            var s = '';
            if (data.length > 1) {
                s = '<option value="">select</option>';
            }
            for (var i = 0; i < data.length; i++) {
                s += '<option data-categoryid=' + data[i].PatientCategoryID + ' data-categorydesc=' + data[i].PatientCategoryDesc + ' data-ratetype=' + data[i].RateType + '  data-ratetypedesc=' + data[i].RateTypeDesc + '>' +
                     data[i].PatientCategoryDesc +  '</option>';
            }
            $("#cboPatientCategory").html(s);
            if (data.length === 1) {
                var sVal = $('#cboPatientCategory').find("option:first").val();
                $("#cboPatientCategory").val(sVal);
            }
            $("#cboPatientCategory").selectpicker('refresh');
            if (data.length === 1) {
                fnPatientCategoryChange();
            }
        });
    return null;
}

function fnPatientCategoryChange() {
    $('#txtRatePlan').val($(':selected', $('#cboPatientCategory')).data('ratetypedesc'));
    fnGetConsultationServiceRate();
}

function fnGetConsultationServiceRate() {
    $.get(getBaseURL() + '/ServiceRates/GetOpConsultationServiceRate', {
        episodeId: $('#cboEpisodeType').val(),
        clinicId: $(':selected', $('#cboClinicType')).data('clinictype'),
        consultationId: $(':selected', $('#cboClinicType')).data('consultationtype'),
        specialtyId: $("#cboSpecialty").val(),
        doctorId: $("#cboDoctors").val(),
        rateType: $(':selected', $('#cboPatientCategory')).data('ratetype'),
        currencyCode: _cnfLocalCurrency
    },
        function (data, status) {
            console.log($(':selected', $('#cboClinicType')).data('clinictype') + ":" + $(':selected', $('#cboClinicType')).data('consultationtype') + ":" + $("#cboSpecialty").val() + ":" + $("#cboDoctors").val() + ":" + $(':selected', $('#cboPatientCategory')).data('ratetype') + ":" + _cnfLocalCurrency);
            var sr_rate = [];
            var obj = "";
            for (var i = 0; i < data.length; i++) {
                obj = {
                    ServiceTypeId: data[i].ServiceTypeId,
                    ServiceId: data[i].ServiceId,
                    ServiceName: data[i].ServiceDesc,
                    ServiceRule: data[i].ServiceRule,
                    ServiceProviderType: "D",
                    ServiceProviderId: $("#cboDoctors").val(),
                    DoctorName: $("#cboDoctors option:selected").text(),
                    Specialty: $("#cboSpecialty option:selected").text(),
                    Quantity: '1',
                    Rate: data[i].ServiceRate,
                    DiscountAmount: data[i].ServiceDiscount,
                    TotalAmount: data[i].ServiceRate - data[i].ServiceDiscount

                };
                sr_rate.push(obj);
            }

            $("#jgvServiceBill").jqGrid('clearGridData').jqGrid('setGridParam', {
                datatype: 'local',
                data: sr_rate,
                rowNum: sr_rate.length
            }).trigger('reloadGrid', [{ page: 1 }]);

        });
    return null;
}