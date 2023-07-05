var AddFlag = true;
var vperc = null;
var vamount = null;
$(document).ready(function () {

});
function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '') {
        fnLoadServiceRatePlan();
    }

}
function fnLoadServiceRatePlan() {
    $("#jqgServiceRatePlan").jqGrid('GridUnload');
    $("#jqgServiceRatePlan").jqGrid({
        url: getBaseURL() + '/ServiceRates/GetServiceRatePlansByBKey?businessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.RateType, localization.BaseRateType, localization.RateVariationFormula, localization.RoundOffBy, localization.Active,""],

        colModel: [

            { name: "RateType", width: 10, editable: false, align: 'left', hidden: false },
            { name: "BaseRateType", width: 10, editable: false, align: 'left', hidden: true},
            { name: "RateVariationFormula", width: 50, editable: false, align: 'left' },
            { name: "RoundOffBy", width: 10, editable: false, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 10, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: "Button", width: 20, editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                    return "<button type='button' style='width:100px' class='btn btn-primary' onclick=fnGridEditRatePlan('" + rowObject.RateType + "')><i class='fas fa-external-link-alt c-white'></i> Edit  </button>";
                }
            }

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceRatePlan",
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
        align: "left",
        scrollOffset: 0,

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceRatePlan").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
           
        }
    }).jqGrid('navGrid', '#jqpServiceRatePlan', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpServiceRatePlan', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddRatePlan
    });   
}

function fnGridAddRatePlan() {
    fnClearFields();
    AddFlag = true;
    $('#PopupServiceRatePlan').find('.modal-title').text(localization.AddServiceRatePlan);
    $("#btnSave").html(localization.Save);
    $('#PopupServiceRatePlan').modal('show');
}
function fnGridEditRatePlan(ratetype) {
    fnClearFields();
    AddFlag = false;
    $('#PopupServiceRatePlan').find('.modal-title').text(localization.EditServiceRatePlan);
    $("#btnSave").html(localization.Update);

    $.ajax({
        url: getBaseURL() + '/ServiceRates/GetServiceRatePlanByBKeyRType',
        data: {
            businessKey: $('#cboBusinessKey').val(),
            ratetype: ratetype,
        },
        success: function (result) {
            $("#txtServiceTypeDesc").val(result.ServiceTypeDesc);
            $('#cboRatePlan').val(result.RateType);
            $('#cboRatePlan').selectpicker('refresh');
            $('#cboBaseRatePlan').val(result.BaseRateType);
            $('#cboBaseRatePlan').selectpicker('refresh');
            $('#cboVariationBy').val(result.RateVariationBy);
            $('#cboVariationBy').selectpicker('refresh');
            if (result.RateVariationPercentage == '0') {
                $('#cboAmountPerc').val('A');
                $('#cboAmountPerc').selectpicker('refresh');
                $('#txtRateVariationAmount').val(result.RateVariationAmount);
            }
            else {
                $('#cboAmountPerc').val('P');
                $('#cboAmountPerc').selectpicker('refresh');
                $('#txtRateVariationAmount').val(result.RateVariationPercentage);
            }

            
            $('#cboRoundOffBy').val(result.RoundOffBy);
            $('#cboRoundOffBy').selectpicker('refresh');
            $('#txtRateVariationFormula').val(result.RateVariationFormula);
            
            if (result.ActiveStatus == true)
                $('#chkSTActiveStatus').parent().addClass("is-checked");
            else
                $('#chkSTActiveStatus').parent().removeClass("is-checked");
        }
    });


    $('#PopupServiceRatePlan').modal('show');
}
function fnClearFields() {
    $('#cboRatePlan').val('');
    $('#cboRatePlan').selectpicker('refresh');
    $('#cboBaseRatePlan').val('');
    $('#cboBaseRatePlan').selectpicker('refresh');
    $('#cboVariationBy').val('+');
    $('#cboVariationBy').selectpicker('refresh');
    $('#cboAmountPerc').val('A');
    $('#cboAmountPerc').selectpicker('refresh');
    $('#txtRateVariationAmount').val('');
    $('#cboRoundOffBy').val('1');
    $('#cboRoundOffBy').selectpicker('refresh');
    $('#txtRateVariationFormula').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
}
function fnSaveRatePlan() {
    if (IsStringNullorEmpty($("#cboRatePlan").val())) {
        toastr.warning("Please Select a Rate Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboBaseRatePlan").val())) {
        toastr.warning("Please Select a Base Rate Type");
        return;
    }
    if (IsStringNullorEmpty($("#txtRateVariationAmount").val()) || $('#txtRateVariationAmount').val()=='0') {
        toastr.warning("Please enter the variation amount");
        return;
    }
    var vformula = '';
    if ($('#cboAmountPerc').val() === 'A') {
        if ($('#txtRateVariationAmount').val() <= 0 ) {
            toastr.warning("Please enter a valid amount");
            return;
        }
        vamount = $('#txtRateVariationAmount').val();
        vperc = null;
        vformula = $.trim($("#cboBaseRatePlan option:selected").text()) + $('#cboVariationBy').val() + vamount;
    }
    else {
        if ($('#txtRateVariationAmount').val() <= 0 || $('#txtRateVariationAmount').val() > 100)
        {
            toastr.warning("Please enter a valid percentage");
            return;
        }
        vperc = $('#txtRateVariationAmount').val();
        vamount = null;
        var acperc = vperc / 100;
        if ($('#cboVariationBy').val() == '+') {
            acperc = 1 + acperc;
            vformula =  acperc + '*' + $.trim($("#cboBaseRatePlan option:selected").text());
        }
        else if ($('#cboVariationBy').val() == '-') {
            acperc = 1 - acperc;
            vformula = acperc + '*' + $.trim($("#cboBaseRatePlan option:selected").text());
        }
    }
    $('#txtRateVariationFormula').val(vformula);

    $("#btnSave").attr("disabled", true);

    var obj = {
        BusinessKey: $('#cboBusinessKey').val(),
        RateType: $('#cboRatePlan').val(),
        BaseRateType: $('#cboBaseRatePlan').val(),
        RateVariationBy: $('#cboVariationBy').val(),
        RateVariationAmount: vamount,
        RateVariationPercentage:vperc,
        RoundOffBy: $('#cboRoundOffBy').val(),
        RateVariationFormula: vformula,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        AddFlag:AddFlag,
    }

    $.ajax({
        url: getBaseURL() + '/ServiceRates/AddOrUpdateServiceRatePlan',
        type: 'POST',
        datatype: 'json',
        data: obj,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Record Saved");
                $('#PopupServiceRatePlan').modal('hide');
                $("#jqgServiceRatePlan").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
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


