var bKey = 0;
var _curr = "";
var l_ser = [];
var obj = "";
$(document).ready(function () {
    fnInitialServiceGrid();
});
function fnLoadGrid() {
    if ($('#cboPatientType').val() != '' && $('#cboPatientType').val() != '710001') {
        $('#dvCustomer').show();
        if ($('#cboBusinessKey').val() != '' && $('#cboPatientType').val() != '' && $('#cboCurrencyCode').val() != '' && $('#cboCustomer').val() != '') {
            fnLoadPackageMaster();
            if ($('#cboBusinessKey').val() != bKey || $('#cboCurrencyCode').val() != _curr) {
                bKey = $('#cboBusinessKey').val();
                _curr = $('#cboCurrencyCode').val();
                fnGetPackageServices();
            }

        }
    }
    else {
        $('#dvCustomer').hide();
        $('#cboCustomer').val('');
        $('#cboCustomer').selectpicker('refresh');
        if ($('#cboBusinessKey').val() != '' && $('#cboPatientType').val() != '' && $('#cboCurrencyCode').val() != '') {
            fnLoadPackageMaster();
            if ($('#cboBusinessKey').val() != bKey || $('#cboCurrencyCode').val() != _curr) {
                bKey = $('#cboBusinessKey').val();
                _curr = $('#cboCurrencyCode').val();
                fnGetPackageServices();
            }
        }
    }


}
function fnLoadPackageMaster() {
    var customerid = 0;
    if ($('#cboCustomer').val() != '') {
        customerid = $('#cboCustomer').val();
    }

    $("#jqgPackageMaster").jqGrid('GridUnload');
    $("#jqgPackageMaster").jqGrid({
        url: getBaseURL() + '/MCHPackages/GetPackageMaster',
        datatype: "json",
        contentType: "application/json; charset-utf-8",
        mtype: 'GET',
        postData: {
            businessKey: $('#cboBusinessKey').val(),
            customerId: customerid,
            currencyCode: $('#cboCurrencyCode').val()
        },
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Package ID", localization.PackageShortCode, localization.PackageDesc, localization.PackageAmount, localization.ActualCost, localization.EffectiveDate, localization.EffectiveTill, localization.Active],

        colModel: [

            { name: "PackageId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "PackageShortCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "PackageDesc", width: 100, editable: false, align: 'left' },
            { name: "PackageAmount", width: 50, editable: false, align: 'left' },
            { name: "ActualCost", width: 50, editable: false, align: 'left' },
            { name: "EffectiveDate", width: 70, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            { name: "EffectiveTill", width: 70, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpPackageMaster",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,


        loadComplete: function (data) {
            SetGridControlByAction();
            $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
        }
    }).jqGrid('navGrid', '#jqpPackageMaster', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpPackageMaster', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddPackage
        });

}
function fnGridAddPackage() {
    $("#PopupPackage").modal('show');
}
function SetGridControlByAction() {

}
function fnInitialServiceGrid() {

    $("#jqgPackageServices").jqGrid('GridUnload');
    $("#jqgPackageServices").jqGrid({
        url: '',
        datatype: "json",
        contentType: "application/json; charset-utf-8",
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service Type", "Service ID", localization.Service, localization.ActualPrice, localization.PackagePrice, localization.Quantity],

        colModel: [
            { name: "ServiceType", width: 10, editable: false, align: 'left', hidden: true },
            { name: "SeriveId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "Service", width: 250, editable: false, align: 'left' },
            { name: "ActualPrice", width: 150, editable: false, align: 'left' },
            { name: "PackagePrice", width: 150, editable: true, align: 'left', edittype: 'text' },
            { name: "Quantity", width: 150, editable: true, align: 'left', edittype: 'text' },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpPackageServices",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            fnCalcPackageCost();
        }
    });

}

function fnCalcPackageCost() {

}

function fnGetPackageServices() {
    $.get(getBaseURL() + '/MCHPackages/GetPackageServices', {
        businessKey: $('#cboBusinessKey').val(),
        currencyCode: $('#cboCurrencyCode').val()
    },
        function (data, status) {
            var s = '<option data-initial=1 >select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option data-initial=0 data-servicetype=' + data[i].ServiceType + ' data-serviceid=' + data[i].ServiceId + ' data-servicedesc=' + data[i].ServiceDesc + '  data-servicerate=' + data[i].ServiceRate + '>' +
                    data[i].ServiceDesc + '' + '</option>';
            }
            $("#cboService").html(s);

            $("#cboService").selectpicker('refresh');
        });
    return null;

}

function fnAddPackageService() {
    if ($(':selected', $('#cboService')).data('initial') === 1 || $(':selected', $('#cboService')).data('initial') === undefined) {
        toastr.warning("Please select a service");
        return;
    }
    obj = {
        ServiceType: $(':selected', $('#cboService')).data('servicetype'),
        SeriveId: $(':selected', $('#cboService')).data('serviceid'),
        Service: $(':selected', $('#cboService')).data('servicedesc'),
        ActualPrice: $(':selected', $('#cboService')).data('servicerate'),
        PackagePrice: $(':selected', $('#cboService')).data('servicerate'),
        Quantity: '1'
    }
    l_ser.push(obj);
    $("#jqgPackageServices").jqGrid('clearGridData').jqGrid('setGridParam', {
        datatype: 'local',
        data: l_ser,
        rowNum: l_ser.length
    }).trigger('reloadGrid', [{ page: 1 }]);

}







function fnSavePackageMaster() {

    var customerid = 0;
    if ($('#cboCustomer').val() != '') {
        customerid = $('#cboCustomer').val();
    }
    $("#jqgPackageServices").jqGrid('editCell', 0, 0, false);
    var _packageServices = [];
    var id_list = jQuery("#jqgPackageServices").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgPackageServices').jqGrid('getRowData', rowId);

        _packageServices.push({

            ServiceType: rowData.ServiceType,
            ServiceId: rowData.SeriveId,
            Quantity: rowData.Quantity,
            ActualPrice: rowData.ActualPrice,
            ServiceRate: rowData.PackagePrice,
            ActiveStatus: true
        });

    }
    var _packagemaster = {
        BusinessKey: $('#cboBusinessKey').val(),
        PackageId: 0,
        PackageCode: $('#cboPackage').val(),
        CustomerId: customerid,
        CurrencyCode: $('#cboCurrencyCode').val(),
        EffectiveDate: $('#txtEffectiveDate').val(),
        ActualCost: $('#txtActCost').val(),
        PackageAmount: $('#txtPackAmount').val(),
        ServiceChargePercentage: $('#txtSCPercent').val(),
        EffectiveTill: $('#txtEffectiveTill').val(),
        PatientCopy: $("#chkPatientCopy").parent().hasClass("is-checked"),
        FoodProvided: $("#chkFoodProvided").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        l_services: _packageServices
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MCHPackages/AddOrUpdatePackageMaster',
        type: 'POST',
        datatype: 'json',
        data: { obj: _packagemaster },
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Package Saved");
                $("#jqgPackageMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                $("#PopupPackage").modal('hide');
                fnClear();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}

function fnClear() {
    $('#cboPackage').val('');
    $('#cboPackage').selectpicker('refresh');
    $('#cboService').val('0');
    $('#cboService').selectpicker('refresh');
    $('#txtEffectiveDate').val('');
    $('#txtActCost').val('');
    $('#txtPackAmount').val('');
    $('#txtSCPercent').val('');
    $('#txtEffectiveTill').val('');
    $("#chkPatientCopy").parent().removeClass("is-checked");
    $("#chkFoodProvided").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().removeClass("is-checked");
    l_ser = [];
    obj = "";
    fnInitialServiceGrid();

}

