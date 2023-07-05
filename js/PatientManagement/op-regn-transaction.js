function fnSubmitOPRegistration() {

    if (parseFloat($("#txtTotalConcessionAmount").val()) > 0) {
        if ($("#txtNarration").val().length <= 1) {
            toastr.warning("please enter the narration for discount");
            return;
        }
    }

    $("#btnSaveOpReg").prop('disabled', true);

    var l_paymentData = null;
    var paymentResponse = getPaymentDetails();
    if (paymentResponse !== null) {
        if (paymentResponse.totalcollectedamount > parseFloat($("#txtNetBillAmount").val())) {
            toastr.warning("please check the collected amount.The collected amount cannot be greater than the net bill amount.");
            $("#btnSaveOpReg").prop('disabled', false);
            return;
        }

        if (paymentResponse.totalcollectedamount < parseFloat($("#txtNetBillAmount").val())) {
            toastr.warning("please collect the full bill amount.Partial payment is not allowed.");
            $("#btnSaveOpReg").prop('disabled', false);
            return;
        }

        if (!paymentResponse.status) {
            $("#btnSaveOpReg").prop('disabled', false);
            return false;
        }
        l_paymentData = paymentResponse.data;
    }


    //var uhid = $("input[name='chkRegisteredPatient']:checked").val();

    var address = [{
        AddressId: "1",
        AddressType: "P",
        Address: $("#txtAddress").val(),
        StateCode: $("#cboState").val(),
        Pincode: $("#txtPincode").val(),
        AreaCode: $("#cboArea").val(),
        CityCode: $("#cboCity").val(),
    }];

    var patientprofile = {
        UHID: _uhid,
        Nationality: $("#cboNationality").val(),
        NationalID: $("#txtNationalityID").val(),
        Title: "",
        FirstName: $("#txtFirstName").val(),
        MiddleName: $("#txtMiddleName").val(),
        LastName: $("#txtLastName").val(),
        Gender: $("#cboGender").val(),
        IsDOBApplicable: true,
        DateOfBirth: $("#txtDateOfBirth").val(),
        AgeYY: $("#txtDateOfBirthYY").val(),
        AgeMM: $("#txtDateOfBirthMM").val(),
        AgeDD: $("#txtDateOfBirthDD").val(),
        Isdcode: _cnfISDCode,
        MobileNumber: $('#txtPatientMobileNumber').val(),
        EMailId: $("#txtEmail").val(),
        PatientStatus: "Y",
        L_PatientAddress: address
    };

    var consultationinfo;
    if (_isConsultantRequired) {
        consultationinfo = {
            ClinicID: $(':selected', $('#cboClinicType')).data('clinictype'),
            ConsultationID: $(':selected', $('#cboClinicType')).data('consultationtype'),
            SpecialtyID: $("#cboSpecialty").val(),
            DoctorID: $("#cboDoctors").val(),
            Episode: "N"
        };
    }

    var l_Services = [];
    var gvServices = jQuery("#jgvServiceBill").jqGrid('getRowData');
    if (_isConsultantRequired && gvServices.length === 0) {
        toastr.warning("please check the consultation service rate.");
        $("#btnSaveOpReg").prop('disabled', false);
        return;
    }

    for (var i = 0; i < gvServices.length; ++i) {
        var serv = {};
        //serv.ServiceTypeId = gvServices[i]['ServiceTypeId'];
        serv.ServiceId = gvServices[i]['ServiceId'];
        serv.ServiceProviderId = $("#cboDoctors").val();
        serv.ServiceProviderType = "D";
        serv.ServiceRule = gvServices[i]['ServiceRule'];
        serv.BaseRate = parseFloat(gvServices[i]['Rate']);
        serv.Quantity = parseFloat(gvServices[i]['Quantity']);
        serv.Rate = parseFloat(gvServices[i]['Rate']);
        serv.DiscountAmount = parseFloat(gvServices[i]['DiscountAmount']);
        serv.ConcessionAmount = 0;
        serv.TotalAmount = parseFloat(gvServices[i]['TotalAmount']);
        serv.PayableByPatient = parseFloat(gvServices[i]['TotalAmount']);
        serv.PayableByInsurance = 0;
        serv.ChargableToPatient = true;
        l_Services.push(serv);
    }

    var l_SubLedger = [];
    var subledger = null;
    var billDetail = null;
    if (l_Services.length > 0) {
        subledger = {
            SubledgerType: "P",
            SubledgerId: _uhid,
            PayerPercentage: 0,
            PayableAmount: $('#txtNetBillAmount').val()
        };
        l_SubLedger.push(subledger);

        billDetail = {
            UHID: _uhid,
            OPNumber: "0",
            TransCurrencyCode: _cnfLocalCurrency,
            LocalCurrencyCode: _cnfLocalCurrency,
            ExchangeRate: 1,
            ConcessionOn: "N",
            TotalBillAmount: $('#txtTotalBillAmount').val(),
            TotalDiscountAmount: 0,
            TotalConcessionAmount: $('#txtTotalConcessionAmount').val(),
            RoundOff: 0,
            NetBillAmount: $('#txtNetBillAmount').val(),
            Narration: $('#txtNarration').val(),
            l_PatientBillDetails: l_Services,
            l_SubLedgerDetails: l_SubLedger,
            l_PaymentReceipt: l_paymentData
        };
    }

    var op_reg = {
        UHID: _uhid,
        TokenKey: $("#hdfTokenKey").val(),
        Prkey: _PRKey,
        RegistrationType: $("#cboEpisodeType").val(),
        VisitType: "C",
        ClinicId: $(':selected', $('#cboClinicType')).data('clinictype'),
        ConsultationId: $(':selected', $('#cboClinicType')).data('consultationtype'),
        PatientType: $('#cboPatientType').val(),
        PatientCategory: $(':selected', $('#cboPatientCategory')).data('categoryid'),
        RatePlan: $(':selected', $('#cboPatientCategory')).data('ratetype'),
        IsVIP: $("#chkIsVIP").parent().hasClass("is-checked"),
        PatientProfile: patientprofile,
        ConsultationInfo: consultationinfo,
        O_PatientBill: billDetail
    };
    var URL = getBaseURL() + '/Registration/InsertOPRegistrationVisit';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: op_reg,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Registered & Bill Generated.");

                var dialog = bootbox.dialog({
                    title: 'View',
                    closeButton: false,
                    message: "<p>Registered & Bill Generated.</p>",
                    buttons: {
                        Print: {
                            label: "Print ",
                            className: 'btn-warning',
                            callback: function () {
                                fnPrintOpInvoiceBill($('#hdfBusinessKey').val(), response.Key);
                                return false;
                            }
                        },
                        ok: {
                            label: "ok !",
                            className: 'btn-info',
                            callback: function () {
                                window.location.reload();
                            }
                        }
                    }
                });

            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveOpReg").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveOpReg").attr('disabled', false);
        }
    });

    function fnPrintOpInvoiceBill(businessKey, billDocumentKey) {
        window.open(getReportBaseURL() + '/PatientManagement/ReportViewer/OpInvoiceBill?businessKey=' + businessKey + '&billDocumentKey=' + billDocumentKey, "popupWindow", "width=700,height=800,scrollbars=yes");
    }

    function IsValid() {

        if (IsStringNullorEmpty($("#cboVisitType").val())) {
            toastr.warning("Please select the Visit Type");
            return false;
        }
    }

}
