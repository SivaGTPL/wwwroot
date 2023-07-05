var l_vType = {
    'N': localization.NewConsultation,
    'S': localization.FollowUpSurgical,
    'R': localization.FollowUpNutrition
};
var l_cType = {
    'M': localization.Mohandessin,
    'T': localization.TeleHealth,
    'Z': localization.Zayed
};
var l_rChannel = {
    '0': "Clinic",
    '1': "App",
}
var l_status = {
    'AP': localization.Booked,
    'RG': localization.Registered,
    'CN': localization.Cancelled,
    'CM': localization.Completed
};

$(document).ready(function () {
    fnSetCurrentdate();
    fnLoadAppointmentDetail();
    $.get(getBaseURL() + '/PatientRegistration/GetPaymentReason',
        function (data) {
            var s = '<option value="0">select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].ApplicationCode + '" >' + data[i].CodeDesc + '</option>';
            }
            $("#cboPaymentReason").html(s);
            $("#cboPaymentReason").selectpicker('refresh');
        });
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgAppointmentDetail');
        }
    });
    $('#txtSearchBox').on('change focusout', function () {

        var searchString = $("#txtSearchBox").val();

        var f = { groupOp: "OR", rules: [] };

        f.rules.push({ field: "PatientName", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "UHID", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "PatientID", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "PatientMobileNumber", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });


        $("#jqgAppointmentDetail").trigger("reloadGrid", [{ current: true }]);
    });
});
function fnSetCurrentdate() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    document.getElementById("txtfromdate").value = today;
    document.getElementById("txttodate").value = today;
}

function fnLoadAppointmentDetail() {

    $("#jqgAppointmentDetail").jqGrid('GridUnload');
    var fromdate = $("#txtfromdate").val();
    var todate = $("#txttodate").val();
    console.log(fromdate);
    //console.log(new Date(fromdate).getDate() + 1 + '/' + new Date(fromdate.setMonth(fromdate.getMonth() + 1)) + '/' + new Date(fromdate).getFullYear());
    //$("#txttodate").attr('min', new Date(fromdate).getDate() + 1)
    if (fromdate == "" || fromdate == null) {
        fnAlert("Please select From Date", "e");
        return false;
    }
    if (todate == "" || todate == null) {
        fnAlert("Please select To Date", "e");
        return false;
    }

    $("#jqgAppointmentDetail").jqGrid(
        {
            url: getBaseURL() + '/PatientRegistration/GetAppointmentDetailByDate',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                startDate: fromdate,
                endDate: todate,
                vType: $('#cboVisitType').val(),
                status: $('#cboAPStatus').val()
            },
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
            colNames: [localization.VisitNumber, localization.MRN, localization.MRN, localization.PatientName, localization.Mobile, localization.Email, localization.Clinic, localization.VisitType, localization.RequestChannel, localization.AppointmentDate, localization.AppointmentTime, localization.PaymentReceived, localization.Status, localization.CreatedBy, /* "Reffered By", "Created By", "Create Date", "Modified By", "Modify Date",*/ localization.Actions],
            //colNames: ["Booking Number", "MRN", "Patient Name", "Mobile", "Email", "Visit Type", "Appointment Date", "Appointment Time", "Status", /* "Reffered By", "Created By", "Create Date", "Modified By", "Modify Date",*/ "Actions"],
            colModel: [
                { name: "AppointmentKey", width: 60, editable: true, align: 'left', hidden: false },
{ name: "PatientID", width: 60, editable: true, align: 'left', hidden: false },
                { name: "UHID", width: 60, editable: true, align: 'left', hidden: true },
                
                { name: "PatientName", width: 100, editable: true, align: 'left', hidden: false },
                { name: "PatientMobileNumber", width: 55, editable: true, align: 'left', hidden: false },
                { name: "PatientEmailID", width: 100, editable: true, align: 'left', hidden: true },
                {
                    name: "VisitType", width: 60, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_cType
                    },
                },
                {
                    name: "EpisodeType", width: 80, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_vType
                    },
                },
                {
                    name: "RequestChannel", width: 60, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_rChannel
                    },
                },
                { name: "AppointmentDate", width: 50, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                { name: "AppointmentFromTime", width: 50, editable: true, align: 'center', hidden: false },
                { name: "PaymentReceived", width: 75, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

                //{ name: "AppointmentStatus", width: 80, editable: true, align: 'left', hidden: false },
                {
                    name: "AppointmentStatus", width: 50, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_status
                    },
                },
                //{ name: "RefferedBy", width: 80, editable: true, align: 'left', hidden: false },
                { name: "StrCreatedBy", width: 60, editable: true, align: 'left', hidden: false },
                //{ name: "CreadtedOn", width: 110, editable: true, align: 'left', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                //{ name: "StrModifiedBy", width: 60, editable: true, align: 'left', hidden: false },
                //{ name: "ModifiedOn", width: 110, editable: true, align: 'left', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                {
                    name: "Button", width: 300, editable: false, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnEdit_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnEditApp('" + rowObject.AppointmentKey + "','" + rowObject.EpisodeType + "') > <i class='fas fa-edit c-white'></i> Change Visit Type </button >"
                            +
                            "<button id=btnPayment_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnPayment('" + rowObject.AppointmentKey + "') > <i class='fas fa-credit-card c-white'></i> Payment </button >"
                            +
                            "<button id=btnRegister_" + i + " type='button' style='margin-right: 5px;'  class='btn btn-primary' onclick=fnRegisterPatient('" + rowObject.AppointmentKey + "') > <i class='fas fa-external-link-alt c-white'></i> Register </button >"
                            +
                            "<button id=btnCancel_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnCancelApp('" + rowObject.AppointmentKey + "') > <i class='fas fa-times c-white'></i> Cancel </button >"
                            +
                            "<button id=btnBill_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnViewBill('" + rowObject.AppointmentKey + "') > <i class='fas fa-sticky-note c-white'></i> View Bill </button >"
                            +
                            "<button id=btnComplete_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnCompleteApp('" + rowObject.AppointmentKey + "') > <i class='fas fa-check-square c-white'></i> Complete </button >";

                    }
                },
            ],
            rowNum: 100000,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            scroll: false,
            loadonce: true,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: false,
            pager: "#jqpAppointmentDetail",
            onSelectRow: function (rowid) {

            },
            loadComplete: function (data) {
                fnJqgridSmallScreen('jqgAppointmentDetail');
                AutoCompleteList = [];
                var rows = jQuery("#jqgAppointmentDetail").getDataIDs();
                for (a = 0; a < rows.length; a++) {
                    row = jQuery("#jqgAppointmentDetail").getRowData(rows[a]);
                    $("#btnRegister_" + rows[a]).hide();
                    $("#btnCancel_" + rows[a]).hide();
                    $("#btnBill_" + rows[a]).hide();
                    $("#btnEdit_" + rows[a]).hide();
                    $("#btnPayment_" + rows[a]).hide();
                    $("#btnComplete_" + rows[a]).hide();
                    if (row['AppointmentStatus'].startsWith('AP')) {
                        $('#jqgAppointmentDetail').jqGrid('setRowData', rows[a], false, "bg_ap");
                        if (row['PaymentReceived'] === 'true') {
                            $("#btnRegister_" + rows[a]).show();
                        }
                        $("#btnPayment_" + rows[a]).show();
                        $("#btnCancel_" + rows[a]).show();
                        $("#btnEdit_" + rows[a]).show();
                    }
                    else if (row['AppointmentStatus'].startsWith('RG')) {
                        $('#jqgAppointmentDetail').jqGrid('setRowData', rows[a], false, "bg_rg");
                        $("#btnPayment_" + rows[a]).show();
                        $("#btnBill_" + rows[a]).show();
                        $("#btnComplete_" + rows[a]).show();
                    }
                    else if (row['AppointmentStatus'].startsWith('CM')) {
                        $('#jqgAppointmentDetail').jqGrid('setRowData', rows[a], false, "bg_cm");
                        $("#btnBill_" + rows[a]).show();
                    }
                    else if (row['AppointmentStatus'].startsWith('CN')) {
                        $('#jqgAppointmentDetail').jqGrid('setRowData', rows[a], false, "bg_cn");
                    }
                    AutoCompleteList.push({ label: row.PatientName, value: row.PatientName });
                    AutoCompleteList.push({ label: row.UHID, value: row.UHID });
                    AutoCompleteList.push({ label: row.PatientID, value: row.PatientID });
                    AutoCompleteList.push({ label: row.PatientMobileNumber, value: row.PatientMobileNumber });
                }
                $("#txtSearchBox").autocomplete({
                    source: AutoCompleteList
                });

                $("#txtSearchBox").autocomplete({
                    source: AutoCompleteList
                });
            }
        });


}


function fnRegisterPatient(appKey) {
    var obj = {
        AppointmentKey: appKey,
    };
    $.ajax({
        url: getBaseURL() + '/AppointmentSchedular/SaveRegisterPatientAppointment',
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: true,
        success: function (result) {

            if (result.Status) {
                toastr.success("Registered");
                fnLoadAppointmentDetail();
            }
            else {
                toastr.error(result.Message);
            }
            return true;
        },
        error: function (error) {
            toastr.error(error.statusText);
            return false;
        }
    });
}

function fnViewBill(appKey) {
    var URL = getReportBaseURL() + '/eSyaClinic/ReportViewer/ConsultationBill?businessKey=111&appointmentKey=' + appKey;
    window.open(URL, 'window', 'settings');
    return false;
}
function fnCancelApp(appKey) {
    bootbox.prompt({
        title: "Reason For Cancellation",
        inputType: 'textarea',
        callback: function (result) {

            if (result === null) {
                return true;
            }
            else if (result === '') {
                toastr.warning("Please enter the reason for cancellation");
                return false;
            }
            else {
                var obj = {
                    AppointmentKey: appKey,
                    ReasonforCancellation: result
                };

                $.ajax({
                    url: getBaseURL() + '/AppointmentSchedular/UpdatePatientAppointmentCancellation',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    async: true,
                    success: function (result) {
                        if (result.Status) {
                            toastr.success("Cancelled");
                            fnLoadAppointmentDetail();
                            
                            return true;
                        }
                        else {
                            toastr.error(result.Message);
                        }
                    },
                    error: function (error) {
                        toastr.error(error.statusText);
                        return false;
                    }
                });
            }
        }
    });
}
function fnEditApp(appkey, vType) {
    $('#hdAppKey').val(appkey);
    $('#cboVisitType_e').val(vType);
    $("#cboVisitType_e").selectpicker('refresh');
    $("#PopupEditApp").modal('show');
}
function fnUpdateVisitType() {
    var url = getBaseURL() + '/PatientRegistration/UpdateVisitType';
    var obj = {
        AppointmentKey: $('#hdAppKey').val(),
        EpisodeType: $('#cboVisitType_e').val()
    }
    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved");
                fnLoadAppointmentDetail();
                $("#PopupEditApp").modal('hide');
                //callback(true);
            }
            else {
                toastr.error(response.Message);
                //callback(false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
           // callback(false);
        }
    });
}
function fnPayment(appkey) {
    $('#txtRAmount').val('');
    $('#txtPAmount').val('');
    $('#txtNAmount').val('');
    $.ajax({
        url: getBaseURL() + '/PatientRegistration/GetPaymentDetail',
        data: {
            appKey: appkey
        },
        success: function (result) {
            $('#txtRAmount').val(result.CollectedAmount);
            $('#txtPAmount').val(result.RefundAmount);
            $('#txtNAmount').val(result.TotalNetAmount);
        }
    });

    $('#hdappKey').val(appkey);
    $('#txtAmount').val('');
    $('#cboPaymentType').val('R');
    $("#cboPaymentType").selectpicker('refresh');
    $('#cboPaymentReason').val('0');
    $("#cboPaymentReason").selectpicker('refresh');
    $("#PopupPayment").modal('show');
}
function fnAddPayment() {
    var pAmount = 0;
    var rAmount = 0;
    var pType = $('#cboPaymentType').val();
    if (pType === 'R') {
        rAmount = $('#txtAmount').val();
    }
    else if (pType === 'P') {
        pAmount = $('#txtAmount').val();
    }

    var url = getBaseURL() + '/PatientRegistration/InsertPatientReceipt';
    var obj = {
        BillDocumentKey: $('#hdappKey').val(),
        VoucherType: $('#cboPaymentType').val(),
        VoucherAmount: $('#txtAmount').val(),
        CollectedAmount: rAmount,
        RefundAmount: pAmount,
        Narration: $('#cboPaymentReason').val(),

    }
    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved");
                fnLoadAppointmentDetail();
                $("#PopupPayment").modal('hide'); 
            }
            else {
                toastr.error(response.Message);  
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}
function fnCompleteApp(_appointmentKey) {
    var url = getBaseURL() + '/PatientRegistration/UpdateAppointmentToCompleted';
    var obj = {
        AppointmentKey: _appointmentKey
    }
    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved");
                fnLoadAppointmentDetail();
                $("#PopupEditApp").modal('hide');
                //callback(true);
            }
            else {
                toastr.error(response.Message);
                //callback(false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            // callback(false);
        }
    });
}