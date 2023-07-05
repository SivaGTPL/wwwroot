$(document).ready(function () {
    fnGetCurrencybyBusinesskey();
});

function fnBusinessLocation_onChange() {

    fnGetCurrencybyBusinesskey();
}




function fnGetCurrencybyBusinesskey() {
    $.ajax({
        url: getBaseURL() + '/Currency/GetCurrencybyBusinesskey?Businesskey=' + $("#cboBusinessLocation").val(),
        type: 'post',
        datatype: 'json',
        async: false,
        success: function (response) {
            $("#txtCurrencyName").val('');
            $("#txtCurrencyCode").val('');
            $("#txtCurrencyName").val(response.CurrencyName);
            $("#txtCurrencyCode").val(response.CurrencyCode);
            fnLoadGridCurrencyRate();
        },
        error: function (error) { alert(error.status) }
    });
}

function fnLoadGridCurrencyRate() {
    $("#jqgCurrencyRate").jqGrid('GridUnload');
    $("#jqgCurrencyRate").jqGrid({
        url: getBaseURL() + '/Currency/GetCurrencyExchangeRate?Currencycode=' + $("#txtCurrencyCode").val() + '&Businesskey=' + $("#cboBusinessLocation").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.CurrencyCode, localization.CurrencyName, localization.DateOfExchangeRate, localization.StandardRate, localization.SellingRate, localization.SellingLastVoucherDate, localization.BuyingRate, localization.BuyingLastVoucherDate, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "CurrencyCode", width: 65, editable: true, align: 'left', hidden: false },
            { name: "CurrencyName", width: 70, editable: true, align: 'left', hidden: false },
            {
                name: 'DateOfExchangeRate', index: 'DateOfExchangeRate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "StandardRate", width: 65, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "SellingRate", width: 60, editable: true, align: 'left', hidden: false },
            {
                name: 'SellingLastVoucherDate', index: 'SellingLastVoucherDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "BuyingRate", width: 50, editable: true, align: 'left', hidden: false },
            {
                name: 'BuyingLastVoucherDate', index: 'BuyingLastVoucherDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 94, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditExchangeRate(event,\'edit\')"><i class="fas fa-pen"></i>'  + localization.Edit +  '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditExchangeRate(event,\'view\')"><i class="far fa-eye"></i>' + localization.View +  '</button>'

                }
            }
        ],
        pager: "#jqpCurrencyRate",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
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
        scrollOffset: 0, caption:'Currency Rate',
        loadComplete: function (data) {
            //SetGridControlByAction();
            fnJqgridSmallScreen("jqgCurrencyRate");
        },
    })
        .jqGrid('navGrid', '#jqpCurrencyRate', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCurrencyRate', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCurrencyRate
        });
    $("#btnSaveCurrencyRate").html("<i class='fa fa-save'></i> Save");
    $("#btnCancelCurrencyRate").html("<i class='fa fa-times'></i> Cancel");
    fnAddGridSerialNoHeading();
}

function fnEditExchangeRate(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCurrencyRate').jqGrid('getRowData', rowid);
    $("#divGrid").hide();
    $("#divCurrencyRateForm").show();
    $("#txtBusinesskey").val(rowData.BusinessKey);
    $("#txtCurrencyCode").val(rowData.CurrencyCode);
    $("#txtBusinesskey").val(rowData.BusinessKey);
    $("#txtDateOfExchange").val(rowData.DateOfExchangeRate);
    $("#txtStandardRate").val(rowData.StandardRate);
    $("#txtSellingRate").val(rowData.SellingRate);
    $("#txtSellingDate").val(rowData.SellingLastVoucherDate);
    $("#txtBuyingRate").val(rowData.BuyingRate);
    $("#txtBuyingDate").val(rowData.BuyingLastVoucherDate);
    $("#btnSaveCurrencyRate").html('<i class="fa fa-save"></i>'+ localization.Save);
    $("#btnCancelCurrencyRate").html('<i class="fa fa-times"></i>' + localization.Cancel);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if ($("#txtBusinesskey").val() === "0" || $("#txtBusinesskey").val() === 0) {
        $("#txtDateOfExchange").attr('disabled', false);
    }
    else
    {
        $("#txtDateOfExchange").attr('disabled', true);
    }
   
    if (actiontype.trim() == "edit") {
        $("#chkActiveStatus").prop('disabled', true);
        $("input").attr('readonly', false);
        $("#txtSellingDate").attr('disabled', false);
        $("#txtBuyingDate").attr('disabled', false);
        $("#btnSaveCurrencyRate").html(' Update');
        $("#btnSaveCurrencyRate").show();
    }
    if (actiontype.trim() == "view") {
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCurrencyRate").hide();
        $("input").attr('readonly', true);
        $("#txtDateOfExchange").attr('disabled', true);
        $("#txtSellingDate").attr('disabled', true);
        $("#txtBuyingDate").attr('disabled', true);
    }

}

function fnSaveCurrencyRate() {
    if (IsStringNullorEmpty($("#txtDateOfExchange").val())) {
        toastr.warning("Please Select Date of Exchange");
        return;
    }
    if (IsStringNullorEmpty($("#txtStandardRate").val())) {
        toastr.warning("Please Enter Standard Rate");
        return;
    }
    
    var bkey;
    if ($("#txtBusinesskey").val() === "0" || $("#txtBusinesskey").val() === 0) {
        bkey = $("#cboBusinessLocation").val();
    } else {
        bkey = $("#txtBusinesskey").val();
    }
    $("#btnSaveCurrencyRate").attr('disabled', true);
    obj = {
        BusinessKey: bkey,
        CurrencyCode: $("#txtCurrencyCode").val(),
        DateOfExchangeRate: $("#txtDateOfExchange").val(),
        StandardRate: $("#txtStandardRate").val(),
        SellingRate: $("#txtSellingRate").val(),
        SellingLastVoucherDate: $("#txtSellingDate").val(),
        BuyingRate: $("#txtBuyingRate").val(),
        BuyingLastVoucherDate: $("#txtBuyingDate").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $.ajax({
        url: getBaseURL() + "/Currency/InsertOrUpdateCurrencyExchangeRate",
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveCurrencyRate").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveCurrencyRate").attr('disabled', false);
                fnBackToGrid();
                fnGridRefreshCurrencyRate();
                
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCurrencyRate").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCurrencyRate").attr("disabled", false);
        }
    });
}

function fnGridRefreshCurrencyRate() {
    $("#jqgCurrencyRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnBackToGrid() {
    $("#txtCurrencyName").attr('readonly', true);
    $("#btnSaveCurrencyRate").attr('disabled', false);
    $("#divGrid").show();
    $("#divCurrencyRateForm").hide();
}

function SetGridControlByAction() {
    
    var eleEditEnable = document.querySelectorAll('#jqgEdit');

    for (var i = 0; i < eleEditEnable.length; i++) {
        eleEditEnable[i].disabled = false;
    }
    if (_userFormRole.IsEdit === false) {
        var eleEditDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleEditDisable.length; i++) {
            eleEditDisable[i].disabled = true;
            eleEditDisable[i].className = "ui-state-disabled";
        }
    }

    var eleViewEnable = document.querySelectorAll('#jqgView');
    for (var i = 0; i < eleViewEnable.length; i++) {
        eleViewEnable[i].disabled = false;
    }
    if (_userFormRole.IsView === false) {
        var eleViewDisable = document.querySelectorAll('#jqgView');
        for (var i = 0; i < eleViewDisable.length; i++) {
            eleViewDisable[i].disabled = true;
            eleViewDisable[i].className = "ui-state-disabled";
        }
    }
}