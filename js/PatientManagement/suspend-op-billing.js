
function fnSuspendOpBilling() {

    if (parseFloat($("#txtTotalConcessionAmount").val()) > 0) {
        if ($("#txtNarration").val().length <= 1) {
            toastr.warning("please enter the narration for discount");
            return;
        }
        if ($(':selected', $('#cboSuspendType')).data('suspendtypecode') !== "C") {
            toastr.warning("please check the selected Suspend Type");
            return;
        }
    }

    $("#btnSuspendOpBill").prop('disabled', true);

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
        SubledgerId: _patient_op_details.UHID,
        PayerPercentage: 0,
        PayableAmount: $('#txtNetBillAmount').val()
    };
    l_SubLedger.push(subledger);

    var obj_PatientBillHeader = {
        UHID: _patient_op_details.UHID,
        OPNumber: _patient_op_details.OPNumber,
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
        SuspendTypeId: $('#cboSuspendType').val(),
        SuspendTypeCode: $(':selected', $('#cboSuspendType')).data('suspendtypecode')
    };

    var URL = getBaseURL() + '/SuspendOpBill/CreateSuspendOpBill';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj_PatientBillHeader,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Bill Suspended.");
                window.location.reload();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSuspendOpBill").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSuspendOpBill").attr('disabled', false);
        }
    });

}


function fnGridLoadSuspendBillList() {
    $("#jgvSuspendBillList").jqGrid({
        url: getBaseURL() + '/SuspendOpBill/GetSuspendOpBillListForConfirmation',
        datatype: "json",
        //  data:gridData,
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        postData: {
            billFromDate: function () { return $('#dtBillFromDate').val(); },
            billTillDate: function () { return $('#dtBillTillDate').val(); }
        },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ['Select', 'Suspend Key', 'Suspend Date', 'UHID', 'Op Number', 'Visit No.', 'PatientName' ],
        colModel: [
            {
                name: 'select', search: false, align: 'center', width: 78, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" onclick="fnGridSelectionSupendBill(event)"><i class="fa fa-hand-o-right"></i></button>';
                }
            },
            { name: "BillDocumentKey", width: 70, align: 'left' },
            { name: "DocumentDate", width: 70, resizable: true, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat } },
            { name: "UHID", width: 70, align: 'left' },
            { name: "OPNumber", width: 70, align: 'left' },
            { name: "VisitNumber", hidden: true },
            { name: "PatientName", width: 160, resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } }
        ],
        pager: "#jpgSuspendBillList",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        loadComplete: function (data) {
            // SetGridControlByAction();
            fnJqgridSmallScreen("jgvSuspendBillList");

        },
    });
    fnAddGridSerialNoHeading();
    // fnkebabMenu();
}


function fnGridSelectionSupendBill(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jgvSuspendBillList').jqGrid('getRowData', rowid);
   
    //$('#dvRecallSuspendBill').downupPopup('close');

    var url = getBaseURL() + '/PatientManagement/OpBilling/EPM_12_00';
    $.post(getBaseURL() + '/OpBilling/RedirectToCreateOpBilling', {
        uhid: rowData.UHID,
        opNumber: rowData.OpNumber,
        suspendBillKey: rowData.SuspendBillKey
    }, function (data, status) {
        window.location.href = url;
    });

}

var _suspendStatus;

function get_SuspendBillDetail() {
    if ($('#hdfSuspendBillKey').val() > 0) {
        $.get(getBaseURL() + '/SuspendOpBill/GetSuspendOpBillHeader', {
            suspendBillKey: $('#hdfSuspendBillKey').val()
        }, function (data, status) {
            _suspendStatus = data.SuspendStatus;
            $('#txtTotalConcessionAmount').val(data.TotalConcessionAmount);
            $('#txtNarration').val(data.Narration);
        });
        fnProcessLoading(false);
    }
    return null;
}