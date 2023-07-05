$(document).ready(function () {
    
    fnLoadDrugListByVendor();
});

function fnLoadDrugListByVendor() {
    $("#jqgVendorDrugLink").jqGrid('GridUnload');
    $("#jqgVendorDrugLink").jqGrid({
        url: getBaseURL() + '/DrugInventory/GetDrugVendorLink?VendorCode=' + $("#cboVendor").val(),
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DrugCode, localization.DrugBrand, localization.BusinessShare, localization.MinimumSupplyQuantity, localization.RateTypeCode, localization.RateType, localization.Rate, localization.Active, localization.Actions],
        colModel: [
            { name: "DrugCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DrugBrand", width: 200, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BusinessShare", width: 85, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MinimumSupplyQty", width: 100, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left'} },
            { name: "RateType", width: 60, editable: true, align: 'left', hidden: true, resizable: false, editoption: { 'text-align': 'left'} },
            { name: "RateTypeDesc", width: 60, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
            { name: "Rate", width: 60, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
            { name: "ActiveStatus", editable: true, width: 40, align: 'center', hidden: true, resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width: 75, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditVendorDrugLink(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditVendorDrugLink(event,\'view\')"><i class="far fa-eye"></i> View </button>'

                }
            }
        ],
        pager: "#jqpVendorDrugLink",
        rowNum: 10000,
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
            SetGridControlByAction();
        },

    }).
        jqGrid('navGrid', '#jqpVendorDrugLink', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpVendorDrugLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVendorDrugLink
        }).
        jqGrid('navButtonAdd', '#jqpVendorDrugLink', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshVendorDrugLink
        });
    //}).jqGrid('navGrid', '#jqpVendorDrugLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpVendorDrugLink', {
    //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshVendorDrugLink
    //}).jqGrid('navButtonAdd', '#jqpVendorDrugLink', {
    //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVendorDrugLink
    //});
    //fnAddGridSerialNoHeading();
}


function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnAddVendorDrugLink() {
    $("#divVendorDrugLinkGrid").css('display', 'none');
    $("#divVendorDrugLinkForm").css('display', 'block');
    fnEnableControl(false);
    fnClearControl();
    fnSetRateType();
}

function fnEditVendorDrugLink(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorDrugLink').jqGrid('getRowData', rowid);
    fnClearControl();

    $("#divVendorDrugLinkGrid").css('display', 'none');
    $("#divVendorDrugLinkForm").css('display', 'block');

    $('#txtBusinessShare').val(rowData.BusinessShare);
    $("#txtMinimumSupplyQty").val(rowData.MinimumSupplyQty);
    $("#txtRate").val(rowData.Rate);
    $("#cboDrugBrand").val(rowData.DrugCode);
    $("#cboDrugBrand").selectpicker('refresh');

    $("#cboRateType").val(rowData.RateType);
    $("#cboRateType").selectpicker('refresh');

    $("#btnSaveDrugManufacturer").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        $("#divVendorDrugLinkGrid").hide();
        $("#divVendorDrugLinkForm").css('display', 'block');
        $("#cboRateType").attr('disabled', false);
        $("#cboDrugBrand").attr('disabled', true);
        $("#btnSaveVendorDrugLink").html("<i class='fa fa-sync'></i> "+ localization.update);
    }
    if (actiontype.trim() == "view") {
        $("#divVendorDrugLinkGrid").hide();
        $("#divVendorDrugLinkForm").css('display', 'block');
        fnEnableControl(true);
        $("#btnSaveVendorDrugLink").hide();    
    }
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("select").next().attr('disabled', val);
}

function fnSetRateType() {
    if ($("#cboRateType").val() == 'PO') {
        $("#txtRate").attr('disabled', false);
        $('#txtRate').val('');
    }
    else {
        $("#txtRate").attr('disabled', true);
        $('#txtRate').val('');
    }
}

function fnSaveVendorDrugLink() {
    if (validateDrugFormulation() === false) {
        return;
    }
   
    var obj = {
        VendorCode: $("#cboVendor").val(),
        DrugCode: $("#cboDrugBrand").val(),
        BusinessShare: $("#txtBusinessShare").val(),
        MinimumSupplyQty: $("#txtMinimumSupplyQty").val(),
        RateType: $("#cboRateType").val(),
        Rate: $("#txtRate").val(),
    };

    $("#btnSaveVendorDrugLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveVendorDrugLink").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/DrugInventory/InsertOrUpdateVendorDrugLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshVendorDrugLink();
                fnCloseVendorDrugLink();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveVendorDrugLink").html(localization.Save);
            $("#btnSaveVendorDrugLink").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveVendorDrugLink").attr("disabled", false);
            $("#btnSaveVendorDrugLink").html(localization.Save);
        }
    });
}

function validateDrugFormulation() {
    if ($("#cboVendor").val() === "0" || $("#cboVendor").val() === "") {
        toastr.warning("Please Select Vendor");
        $('#cboDrugCategory').focus();
        return false;
    }
    if ($("#cboDrugBrand").val() === "0" || $("#cboDrugBrand").val() === "") {
        toastr.warning("Please Select Drug");
        $('#cboDrugCategory').focus();
        return false;
    }
    if ($("#txtBusinessShare").val() === "0" || IsStringNullorEmpty($("#txtBusinessShare").val())) {
        toastr.warning("Please Business Share");
        return false;
    }
    if ($("#txtMinimumSupplyQty").val() === "0" || IsStringNullorEmpty($("#txtMinimumSupplyQty").val())) {
        toastr.warning("Please Minimum Supply Quantity");
        return false;
    }
    if ($("#cboRateType").val() === "0" || $("#cboRateType").val() === "") {
        toastr.warning("Please Select Rate Type");
        $('#cboDosage').focus();
        return false;
    }
    if ($("#cboRateType").val() == "PO" && IsStringNullorEmpty($("#txtRate").val())) {
        toastr.warning("Please Enter Rate");
        return false;
    }
}

function fnClearControl() {
    $('#cboDrugBrand').val("0");
    $('#cboDrugBrand').selectpicker('refresh');
    $('#txtBusinessShare').val('');
    $('#txtMinimumSupplyQty').val('');
    $('#txtRate').val('');
    $('#cboRateType').val("0");
    $('#cboRateType').selectpicker('refresh');
    $("#btnSaveVendorDrugLink").html(localization.Save);
    $("#btnSaveVendorDrugLink").show();
}

function fnCloseVendorDrugLink() {
    $("#cboDrugBrand").attr('disabled', false);
    $("#cboRateType").attr('disabled', false);
    $("#divVendorDrugLinkGrid").css('display', 'block');
    $("#divVendorDrugLinkForm").css('display', 'none');
}

function fnGridRefreshVendorDrugLink() {
    $("#jqgVendorDrugLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}