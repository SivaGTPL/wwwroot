$(document).ready(function () {
    //fnBusinessKeyChanges();
    fnFillEmptyDrugReorderLevel();
});

function fnFillEmptyDrugReorderLevel() {
    $("#jqgDrugReorderLevel").jqGrid('GridUnload');
    $("#jqgDrugReorderLevel").jqGrid({
        url: '',
        //datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessSegment, localization.DrugCode, localization.DrugBrand, localization.StoreCode, localization.MaximumStockLevel, localization.ReorderLevel, localization.SafetyStockLevel, localization.MinimumStockLevel, localization.Active],//, "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugBrand", width: 300, editable: false, align: 'left', hidden: false },
            { name: "StoreCode", width: 50, editable: false, align: 'left', hidden: true },
            {
                name: "MaximumStockLevel", width: 85, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            {
                name: "ReorderLevel", width: 85, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            {
                name: "SafetyStockLevel", width: 85, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            {
                name: "MinimumStockLevel", width: 85, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            { name: "ActiveStatus", width: 55, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        rowNum: 50,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDrugReorderLevel",
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
            if (id) { $('#jqgDrugReorderLevel').jqGrid('editRow', id, true); }
        },
    }).jqGrid('navGrid', '#jqgDrugReorderLevel', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnBusinessKeyChanges() {
    $("#cboStore").empty().selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/DrugAttributes/GetStoreListByBusinessKey?BusinessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            //$('#cboFormulation').empty();
            $("#cboStore").append($("<option value='0'>Select</option>"));
            $('#cboStore').selectpicker('refresh');
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

function fnGridLoadDrugReorderLevel() {
    $("#jqgDrugReorderLevel").jqGrid('GridUnload');
    $("#jqgDrugReorderLevel").jqGrid({
        url: getBaseURL() + '/DrugAttributes/GetDrugReorderLevel?BusinessKey=' + $("#cboBusinessKey").val() + '&StoreCode=' + $("#cboStore").val(),
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Drug Code", "Drug Brand", "Store Code", "Maximum Stock Level", "Reorder Level", "Safety Stock Level", "Minimum Stock Level", "Active"],// "Actions"],

        colModel: [
            { name: "BusinessKey", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "DrugBrand", width: 300, editable: false, align: 'left', hidden: false },
            { name: "StoreCode", width: 50, editable: false, align: 'left', hidden: true },
            {
                name: "MaximumStockLevel", width: 50, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            {
                name: "ReorderLevel", width: 50, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            {
                name: "SafetyStockLevel", width: 50, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            {
                name: "MinimumStockLevel", width: 50, editable: true, editoptions: {
                    onkeypress: 'return OnlyDigits(event)',
                    dataInit: function (elem) { $(elem).focus(function () { this.select(); }); }
                }, formatter: 'number', align: 'right'
            },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        rowNum: 50,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDrugReorderLevel",
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
            if (id) { $('#jqgDrugReorderLevel').jqGrid('editRow', id, true); }
        },
    }).jqGrid('navGrid', '#jqgDrugReorderLevel', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveDrugReorderLevel() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == 0) {
        toastr.warning("Please Select a Business Location");
        return false;
    }
    if (IsStringNullorEmpty($("#cboStore").val()) || $("#cboStore").val() == 0) {
        toastr.warning("Please Select a Store");
        return false;
    }

    var obj = [];
    var gvT = $('#jqgDrugReorderLevel').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['DrugBrand'])) {
            var bu_bd = {
                BusinessKey: $('#cboBusinessKey').val(),
                StoreCode: $('#cboStore').val(),
                DrugCode: gvT[i]['DrugCode'],
                DrugBrand: gvT[i]['DrugBrand'],
                MaximumStockLevel: gvT[i]['MaximumStockLevel'],
                ReorderLevel: gvT[i]['ReorderLevel'],
                SafetyStockLevel: gvT[i]['SafetyStockLevel'],
                MinimumStockLevel: gvT[i]['MinimumStockLevel'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(bu_bd);
        }
    }

    $("#btnDrugReorderLevel").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.Wait);
    $("#btnDrugReorderLevel").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/DrugAttributes/InsertOrUpdateDrugReorderLevel',
        type: 'POST',
        datatype: 'json',
        data: { bu_bd: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                fnGridRefreshDrugReorderLevel();
            }
            else {
                toastr.error(response.Message);
                $("#btnDrugReorderLevel").html(localization.Save);
                $("#btnDrugReorderLevel").attr('disabled', false);
            }
            $("#btnDrugReorderLevel").html(localization.Save);
            $("#btnDrugReorderLevel").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDrugReorderLevel").attr("disabled", false);
            $("#btnDrugReorderLevel").html(localization.Save);
        }
    });

    
}

function fnGridRefreshDrugReorderLevel() {
    $("#jqgDrugReorderLevel").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}