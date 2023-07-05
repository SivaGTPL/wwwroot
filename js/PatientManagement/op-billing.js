function populate_gvPatientRegisteredList() {
    $.get(getBaseURL() + '/PatientInfo/GetPatientRegisteredList', {
        visitFromDate: $('#dtVisitFromDate').val(),
        visitTillDate: $('#dtVisitTillDate').val(),
        clinicTypeId: $('#cboClinicTypeId').val(),
        patientTypeId: $('#cboPatientTypeId').val(),
        uhid: $('#txtUHID').val()
    }, function (data, status) {
        return data;
    });
    return null;
}

var _patient_op_details;
function populate_PatientRegisterDetails() {
    _patient_op_details = {};
    $.get(getBaseURL() + '/OpBilling/GetPatientOpVisitDetails', {
        uhid: $('#hdfUHID').val(),
        opNumber: $('#hdfOpNumber').val()
    }, function (data, status) {
        _patient_op_details = data;
        if (_patient_op_details !== null) {
            $('#lblUHID').text($('#hdfUHID').val());
            $('#lblPatientName').text(_patient_op_details.PatientName);
            $('#lblPatientAge').text(_patient_op_details.Age);
            $('#lblPatientGender').text(_patient_op_details.Gender);
            $('#lblOpNumber').text($('#hdfOpNumber').val());
            $('#lblVisitDate').html(new Date(_patient_op_details.VisitDate).toLocaleDateString() + '<span class="lblInfo ml-1"> (DD/MM/YYYY)</span>');
            $('#lblPatientType').text(_patient_op_details.PatientTypeDesc);
            $('#lblRatePlan').text(_patient_op_details.RatePlanDesc);
            $('#lblDoctorName').text(_patient_op_details.DoctorName);
            $('#lblSpecialtyDesc').text(_patient_op_details.SpecialtyDesc);

            fnAddDoctorPrescribedServices();
        }
    });
    fnProcessLoading(false);
    return null;
}

function populate_ServiceDropDownList() {
    $.get(getBaseURL() + '/ServiceRates/GetServiceList', {}, function (data, status) {
        var s = '<option value="-1">select</option>';
        for (var i = 0; i < data.length; i++) {
            s += '<option data-servicetypeid=' + data[i].ServiceTypeId + ' data-serviceprovidertype=' + data[i].ServiceProviderType + ' value="' + data[i].ServiceId + '" >' + data[i].ServiceDesc + '</option>';
        }
        $("#cboServiceList").html(s);
        $("#cboServiceList").selectpicker('refresh');
    });
}

function fnService_onchange() {

    $("#cboServiceProviderList").html("");
    var serviceprovidertype = $(':selected', $('#cboServiceList')).data('serviceprovidertype');
    if (serviceprovidertype === "D") {
        $("#dvServiceProvider").show();
        populate_DoctorDropDownList();
    }
    else
        $("#dvServiceProvider").hide();
}

function populate_DoctorDropDownList() {
    $.get(getBaseURL() + '/Master/GetAllDoctorList', {}, function (data, status) {
        var s = '<option value="-1">select</option>';
        for (var i = 0; i < data.length; i++) {
            s += '<option value="' + data[i].DoctorId + '" >' + data[i].DoctorName + '</option>';
        }
        $("#cboServiceProviderList").html(s);
        $("#cboServiceProviderList").selectpicker('refresh');
    });
}

function fnAddDoctorPrescribedServices() {
    $.get(getBaseURL() + '/OpBilling/GetOpDoctorPrescribedServices', {
        uhid: $('#hdfUHID').val(),
        opNumber: $('#hdfOpNumber').val(),
        rateType: _patient_op_details.RatePlan,
        currencyCode: _cnfLocalCurrency
    }).done(function (data, status) {
        var gv_data = jQuery("#jgvServiceBill").jqGrid('getDataIDs');
        for (var i = 0; i < data.length; ++i) {
            var sr = {
                ServiceTypeId: "",
                ServiceId: data[i].ServiceId,
                ServiceDesc: data[i].ServiceName,
                ServiceProviderId: "N",
                ServiceProviderName: "",
                ServiceRule: data[i].ServiceRule,
                BaseRate: parseFloat(data[i].Rate),
                Quantity: 1,
                Rate: parseFloat(data[i].Rate),
                DiscountAmount: parseFloat(data[i].DiscountAmount),
                TotalAmount: parseFloat(data[i].Rate) - parseFloat(data[i].DiscountAmount)
            };
            $("#jgvServiceBill").jqGrid("addRowData", i, sr);
        }

        Calculate_gvTotalAmount();

    }).fail(function () {
        toastr.error("error");
    });
}

function fnAddService() {

    if (IsStringNullorEmpty($("#cboServiceList").val()) || $("#cboServiceList").val() <= 0) {
        toastr.warning("please select the service");
        return;
    }

    var serviceprovidertype = $(':selected', $('#cboServiceList')).data('serviceprovidertype');
    if (serviceprovidertype === "D") {
        if (IsStringNullorEmpty($("#cboServiceProviderList").val()) || $("#cboServiceProviderList").val() <= 0) {
            toastr.warning("please select the service provider");
            return;
        }
    }

    $.get(getBaseURL() + '/ServiceRates/GetServiceRatesForOpBilling', {
        serviceId: $("#cboServiceList").val(),
        rateType: _patient_op_details.RatePlan,//620001,//
        currencyCode: _cnfLocalCurrency // "EGP"//
    }).done(function (data, status) {
        if (status === "nocontent") {
            toastr.warning("Service Rate not created.");
            return;
        }
        var sr = {
            ServiceTypeId: $(':selected', $('#cboServiceList')).data('servicetypeid'),
            ServiceId: $('#cboServiceList').val(),
            ServiceDesc: data.ServiceDesc,
            ServiceProviderId: $('#cboServiceProviderList').val(),
            ServiceProviderName: $(':selected', $('#cboServiceProviderList')).text(),
            ServiceRule: data.ServiceRule,
            BaseRate: parseFloat(data.ServiceRate),
            Quantity: 1,
            Rate: parseFloat(data.ServiceRate),
            DiscountAmount: parseFloat(data.ServiceDiscount),
            TotalAmount: parseFloat(data.ServiceRate) - parseFloat(data.ServiceDiscount)
        };

        var gv_data = jQuery("#jgvServiceBill").jqGrid('getDataIDs');
        $("#jgvServiceBill").jqGrid("addRowData", gv_data.length + 1, sr);

        Calculate_gvTotalAmount();

        $("#cboServiceList").val('-1').selectpicker('refresh');
        $("#cboServiceProviderList").html("");
        $("#dvServiceProvider").hide();

    })
        .fail(function () {
            toastr.error("error");
        });
}

function Calculate_gvTotalAmount() {
    var quantity = 0;
    var totalAmount = 0;
    var netBillAmount = 0;

    var rowIds = $("#jgvServiceBill").getDataIDs();
    for (var i = 0; i < rowIds.length; i++) {
        quantity = parseFloat($("#jgvServiceBill").jqGrid('getCell', rowIds[i], 'Quantity'));
        totalAmount += parseFloat($("#jgvServiceBill").jqGrid('getCell', rowIds[i], 'TotalAmount'));
    }

    $('#txtTotalBillAmount').val(totalAmount.toFixed(2));
    var concessionAmount = 0;
    if (!$.isEmptyObject($("#txtTotalConcessionAmount").val()) && $("#txtTotalConcessionAmount").val().length > 0) {
        concessionAmount = parseFloat($('#txtTotalConcessionAmount').val()).toFixed(2);
    }
    else {
        $('#txtTotalConcessionAmount').val(0);
    }

    if (concessionAmount > totalAmount) {
        $('#txtTotalConcessionAmount').val(0);
        concessionAmount = 0;
    }
    $('#txtTotalConcessionAmount').val(concessionAmount);
    netBillAmount = totalAmount - concessionAmount;
    $('#txtNetBillAmount').val(netBillAmount);

}

function fnConcesssionAmount_onLeave() {
    Calculate_gvTotalAmount();
}

function populate_BillSuspendTypeDropDownList() {
    $.get(getBaseURL() + '/Master/GetBillSuspendType', {}, function (data, status) {
        var s = '<option value="N">None</option>';
        for (var i = 0; i < data.length; i++) {
            s += '<option data-suspendtypecode=' + data[i].SuspendTypeCode + ' value="' + data[i].SuspendTypeID + '" >' + data[i].SuspendTypeDesc + '</option>';
        }
        $("#cboSuspendType").html(s);
        $("#cboSuspendType").selectpicker('refresh');
    });
}


function fnSubmitOpBilling() {

    if (parseFloat($("#txtTotalConcessionAmount").val()) > 0) {
        if ($("#txtNarration").val().length <= 1) {
            toastr.warning("please enter the narration for discount");
            return;
        }
    }

    $("#btnSaveOpBilling").prop('disabled', true);

    var paymentResponse = getPaymentDetails();

    if (paymentResponse.totalcollectedamount > parseFloat($("#txtNetBillAmount").val())) {
        toastr.warning("please check the collected amount.The collected amount cannot be greater than the net bill amount.");
        $("#btnSaveOpBilling").prop('disabled', false);
        return;
    }

    if (paymentResponse.totalcollectedamount < parseFloat($("#txtNetBillAmount").val())) {
        toastr.warning("please collect the full bill amount.Partial payment is not allowed.");
        $("#btnSaveOpBilling").prop('disabled', false);
        return;
    }

    if (!paymentResponse.status) {
        $("#btnSaveOpBilling").prop('disabled', false);
        return false;
    }

    var l_paymentData = paymentResponse.data;

    var l_Services = [];
    var gvServices = jQuery("#jgvServiceBill").jqGrid('getRowData');
    for (var i = 0; i < gvServices.length; ++i) {
        var serv = {};
        serv.ServiceTypeId = gvServices[i]['ServiceTypeId'];
        serv.ServiceId = gvServices[i]['ServiceId'];
        serv.ServiceProviderType = gvServices[i]['ServiceProviderType'];
        serv.ServiceProviderId = gvServices[i]['ServiceProviderId'];
        serv.ServiceRule = gvServices[i]['ServiceRule'];
        serv.BaseRate = parseFloat(gvServices[i]['BaseRate']);
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
    var subledger = {
        SubledgerType: "P",
        SubledgerId: $('#hdfUHID').val(),
        PayerPercentage: 0,
        PayableAmount: $('#txtNetBillAmount').val()
    };
    l_SubLedger.push(subledger);

    var obj_PatientBillHeader = {
        UHID: $('#hdfUHID').val(),
        OPNumber: $('#hdfOpNumber').val(),
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

    var URL = getBaseURL() + '/OpBilling/CreateOpBill';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj_PatientBillHeader,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Bill Generated.");

                var dialog = bootbox.dialog({
                    title: 'View',
                    closeButton: false,
                    message: "<p>Bill Created. Do you want to view the Bill</p>",
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
            $("#btnSaveOpBilling").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveOpBilling").attr('disabled', false);
        }
    });

    function fnPrintOpInvoiceBill(businessKey, billDocumentKey) {
        window.open(getReportBaseURL() + '/PatientManagement/ReportViewer/OpInvoiceBill?businessKey=' + businessKey + '&billDocumentKey=' + billDocumentKey, "popupWindow", "width=700,height=800,scrollbars=yes");
    }

}

