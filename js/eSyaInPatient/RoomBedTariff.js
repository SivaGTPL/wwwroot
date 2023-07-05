$(document).ready(function () {
    $('#chkIsEffectiveRate').parent().addClass("is-checked");
    fnOnRateTypeChange();
});

function fnOnRateTypeChange() {
    var isEffective = $("#chkIsEffectiveRate").parent().hasClass("is-checked");
    fnGridLoadRoomBedTariff(isEffective);
}

function fnOnIsEffectiveChange(isEffective) {
    if (isEffective.checked)
        $("#btnSaveWardRateLink").attr("disabled", false);
    else
        $("#btnSaveWardRateLink").attr("disabled", true);

    fnGridLoadRoomBedTariff(isEffective.checked);
}

function fnGridLoadRoomBedTariff(isEffective) {
    //if (IsStringNullorEmpty($('#cboBusinessLocation').val()))
    //    return;
    //if (IsStringNullorEmpty($('#cboRateType').val()))
    //    return;
    
    var URL = getBaseURL() + '/WardServices/GetWardEffectiveRateByBkRateType?businessKey=' + $("#cboBusinessLocation").val() + "&rateType=" + $("#cboRateType").val();
    if (!isEffective)
        URL = getBaseURL() + '/WardServices/GetWardPreviousRateByBkRateType?businessKey=' + $("#cboBusinessLocation").val() + "&rateType=" + $("#cboRateType").val();

    $('#jqgRoomBedTariff').jqGrid('GridUnload');
    $("#jqgRoomBedTariff").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.WardDescription, "Ward ID", localization.RoomDescription, "RoomID", localization.EffectiveFrom, localization.Tariff, localization.DaycareTariff, localization.ServiceChargePercentage, localization.Status],
        colModel: [
            { name: "WardDesc", width: 120, editable: false, align: 'left', hidden: false },
            { name: "WardId", width: 30, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "RoomDesc", width: 120, editable: false, align: 'left', resizable: false, hidden: false },
            { name: "RoomId", width: 30, editable: false, align: 'left', hidden: true, resizable: false},
            {
                name: "FromDate", index: 'FromDate', width: 50, editable: true, sorttype: "date", resizable: false, formatter: 'date', formatoptions:
                  { newformat: _cnfjqgDateFormat },
                editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            { name: "Tariff", width: 30, editable: true, align: 'right', resizable: false, editoption: { 'text-align': 'right', maxlength: 18 }, sorttype: "float", formatter: "number" },
            { name: "DayCareTariff", width: 30, editable: true, align: 'right', resizable: false, editoption: { 'text-align': 'right', maxlength: 18 }, sorttype: "float", formatter: "number" },
            { name: "ServiceChargePerc", width: 40, editable: true, align: 'right', resizable: false, editoption: { 'text-align': 'right', maxlength: 5 }, sorttype: "float", formatter: "number" },
            { name: "ActiveStatus", editable: true, width: 40, edittype: "checkbox", align: 'center', formatter: 'checkbox', editoptions: { value: "true:false" } }
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        emptyrecords: "No records to Veiw",
        pager: "#jqpRoomBedTariff",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: isEffective ? true : false,
        cellsubmit: 'clientArray',
        ajaxRowOptions: {
            type: "POST",
            contentType: "application/json",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            return JSON.stringify(postData);
        },
        extraparam: {

        },
        ondblClickRow: function (rowid) {
            $("#jqgRoomBedTariff").trigger('click');
        }
    }).jqGrid('navGrid', '#jqpRoomBedTariff', { add: false, edit: false, search: false, del: false, refresh: false });
}

//$(document).on('focusout', '[role="gridcell"] *', function () {
//    $("#jqgRoomBedTariff").jqGrid('editCell', 0, 0, false);
//});

function fnSaveWardRateLink() {

    $("#jqgRoomBedTariff").jqGrid('editCell', 0, 0, false);
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === 0) {
        toastr.warning("Please Select a Business Location");
        return false;
    }
    if (IsStringNullorEmpty($("#cboRateType").val()) || $("#cboRateType").val() === 0) {
        toastr.warning("Please Select a Rate Type");
        return false;
    }

    $("#btnSaveWardRateLink").attr("disabled", true);
    var obj = [];
    var gvT = $('#jqgRoomBedTariff').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['WardId']) && !IsStringNullorEmpty(gvT[i]['RoomId']) && !IsStringNullorEmpty(gvT[i]['FromDate'])) {
            var wr_rl = {
                BusinessKey: $('#cboBusinessLocation').val(),
                WardId: gvT[i]['WardId'],
                RoomId: gvT[i]['RoomId'],
                RateType: $('#cboRateType').val(),
                EffectiveFrom: fnGetDateFormat(gvT[i]['FromDate']).toDateString(),
                Tariff: gvT[i]['Tariff'],
                DayCareTariff: gvT[i]['DayCareTariff'],
                ServiceChargePerc: gvT[i]['ServiceChargePerc'],
                ActiveStatus: gvT[i]['ActiveStatus']
            };
            obj.push(wr_rl);
        }
    }
    $.ajax({
        url: getBaseURL() + '/WardServices/InsertOrUpdateWardRateLink',
        type: 'POST',
        datatype: 'json',
        data: { wr_rl: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                fnGridRefreshWardRateLink();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveWardRateLink").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveWardRateLink").attr("disabled", false);
        }
    });

    $("#btnSaveWardRateLink").attr("disabled", false);
}

function fnGridRefreshWardRateLink() {
    $("#jqgRoomBedTariff").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}