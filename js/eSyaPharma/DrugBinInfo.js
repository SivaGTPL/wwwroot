$(document).ready(function () {
    fnBusinessKeyChanges();
    fnFillEmptyDrugBinInfo();
});

function fnBusinessKeyChanges() {
    $("#cboStore").empty().selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/DrugInventory/GetStoreListByBusinessKey?BusinessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            //$('#cboFormulation').empty();
            $("#cboStore").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $("#cboStore").append($("<option></option>").val(result[i]["StoreCode"]).html(result[i]["StoreDesc"]));
                }
            }
            $('#cboStore').val($("#cboStore option:first").val());
            $('#cboStore').selectpicker('refresh');
        }
    });
}

function fnGridLoadDrugBinInfo() {
    $("#jqgDrugBinInfo").jqGrid('GridUnload');
    $("#jqgDrugBinInfo").jqGrid({
        url: getBaseURL() + '/DrugInventory/GetDrugBinInfo?BusinessKey=' + $("#cboBusinessKey").val() + '&StoreCode=' + $("#cboStore").val(),
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.DrugCode, localization.DrugBrand, localization.StoreCode, localization.MaximumStockLevel, localization.ReorderLevel, localization.SafetyStockLevel, localization.MinimumStockLevel, localization.BinInfo, localization.Actives],//, "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugBrand", width: 300, editable: false, align: 'left', hidden: false },
            { name: "StoreCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "MaximumStockLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "ReorderLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "SafetyStockLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "MinimumStockLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "BinInfo", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 15 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        rowNum: 50,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDrugBinInfo",
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
        cellEdit: true,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgDrugBinInfo').jqGrid('editRow', id, true); }
        },
    }).jqGrid('navGrid', '#jqgDrugBinInfo', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveDrugBinInfo() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == 0) {
        toastr.warning("Please Select Business Location");
        return false;
    }
    if (IsStringNullorEmpty($("#cboStore").val()) || $("#cboStore").val() == 0) {
        toastr.warning("Please Select Store");
        return false;
    }

    var obj = [];
    var gvT = $('#jqgDrugBinInfo').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['DrugBrand'])) {
            var dr_bi = {
                BusinessKey: $('#cboBusinessKey').val(),
                StoreCode: $('#cboStore').val(),
                DrugCode: gvT[i]['DrugCode'],
                DrugBrand: gvT[i]['DrugBrand'],
                MaximumStockLevel: gvT[i]['MaximumStockLevel'],
                ReorderLevel: gvT[i]['ReorderLevel'],
                SafetyStockLevel: gvT[i]['SafetyStockLevel'],
                MinimumStockLevel: gvT[i]['MinimumStockLevel'],
                BinInfo: gvT[i]['BinInfo'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(dr_bi);
        }
    }

    $("#btnDrugBinInfo").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.Wait);
    $("#btnDrugBinInfo").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/DrugInventory/InsertOrUpdateDrugBinInfo',
        type: 'POST',
        datatype: 'json',
        data: { dr_bi: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                fnGridRefreshDrugBinInfo();
            }
            else {
                toastr.error(response.Message);
                $("#btnDrugBinInfo").html(localization.Save);
                $("#btnDrugBinInfo").attr('disabled', false);
            }
            $("#btnDrugBinInfo").html(localization.Save);
            $("#btnDrugBinInfo").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDrugBinInfo").attr("disabled", false);
            $("#btnDrugBinInfo").html(localization.Save);
        }
    });
}

function fnFillEmptyDrugBinInfo() {
        $("#jqgDrugBinInfo").jqGrid('GridUnload');
    $("#jqgDrugBinInfo").jqGrid({
        url: '',
        //mtype: 'Post',
        //datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Drug Code", "Drug Brand", "Store Code", "Maximum Stock Level", "Reorder Level", "Safety Stock Level", "Minimum Stock Level", "Bin Info", "Active"],//, "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugBrand", width: 300, editable: false, align: 'left', hidden: false },
            { name: "StoreCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "MaximumStockLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "ReorderLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "SafetyStockLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "MinimumStockLevel", width: 50, editable: false, align: 'left', hidden: false },
            { name: "BinInfo", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 15 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        rowNum: 50,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDrugBinInfo",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        cellEdit: true,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgDrugBinInfo').jqGrid('editRow', id, true); }
        },
    }).jqGrid('navGrid', '#jqgDrugBinInfo', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnGridRefreshDrugBinInfo() {
    $("#jqgDrugBinInfo").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}