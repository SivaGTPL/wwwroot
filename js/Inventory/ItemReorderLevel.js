$(document).ready(function () {
    fnBusinessKeyChanges();
    fnGridLoadItemReorderLevel();
})

function fnBusinessKeyChanges() {
    $("#cboStore").empty().selectpicker('refresh');
   
    $.ajax({
        url: getBaseURL() + '/ItemManagement/GetStoreListByBusinessKey?BusinessKey=' + $('#cboBusinessKey').val(),
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

function fnGridLoadItemReorderLevel() {
    $("#jqgItemReorderLevel").jqGrid('GridUnload');
    $("#jqgItemReorderLevel").jqGrid({
        url: getBaseURL() + '/ItemManagement/GetItemReorderLevel?BusinessKey=' + $("#cboBusinessKey").val() + '&StoreCode=' + $("#cboStore").val(),
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Item Code", "Item Name", "Store Code", "Maximum Stock Level", "Reorder Level", "Safety Stock Level", "Minimum Stock Level", "Active"],//, "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: false, align: 'left', hidden: true },
            { name: "ItemCode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "ItemDescription", width: 300, editable: false, align: 'left', hidden: false },
            { name: "StoreCode", width: 50, editable: false, align: 'left', hidden: true },
            //{ name: "MaximumStockLevel", width: 50, editable: true, align: 'right', sorttype: 'float', formatter: 'number', hidden: false },
            //{ name: "ReorderLevel", width: 50, editable: true, align: 'right', sorttype: 'float', formatter: 'number',hidden: false },
            //{ name: "SafetyStockLevel", width: 50, editable: true, align: 'right', sorttype: 'float', formatter: 'number',hidden: false },
            //{ name: "MinimumStockLevel", width: 50, editable: true, align: 'right', sorttype: 'float', formatter: 'number', hidden: false},
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
            //{
            //    name: 'edit', search: false, align: 'left', width: 74, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditItemReorderLevel(event,\'edit\')"><i class="fas fa-pencil-alt"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditItemReorderLevel(event,\'view\')"><i class="far fa-file-alt"></i> ' + localization.View + ' </button>'

            //    }
            //}
        ],
        rowNum: 50,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpItemReorderLevel",
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
            if (id) { $('#jqgItemReorderLevel').jqGrid('editRow', id, true); }
        },
        //beforeSelectRow: function (rowid, e) {
        //    if (isLocationActive === "false" || locationId == 0 || IsStringNullorEmpty($('#txtCustomerCode').val()) || isView == 1)
        //        return false;
        //    else
        //        return true;
        //},
    }).jqGrid('navGrid', '#jqgItemReorderLevel', { add: false, edit: false, search: false, del: false, refresh: false });



    //    pager: "#jqpItemReorderLevel",
    //    rowNum: 50,
    //    rowList: [10, 20, 50, 100],
    //    loadonce: true,
    //    viewrecords: true,
    //    gridview: true,
    //    rownumbers: true,
    //    height: 'auto',
    //    align: "left",
    //    width: 'auto',
    //    autowidth: true,
    //    shrinkToFit: true,
    //    scrollOffset: 0,
    //    //loadComplete: function (data) {
    //    //    SetGridControlByAction();
    //    //},
    //    ondblClickRow: function (rowid) {
    //        $("#jqgItemReorderLevel").trigger('click');
    //    },
    //}).jqGrid('navGrid', '#jqpItemReorderLevel', { add: false, edit: false, search: false, del: false, refresh: false });
    //$("#jqgItemReorderLevel").jqGrid('inlineNav', '#jqpItemReorderLevel',
    //    {
    //        edit: false,
    //        editicon: " fa fa-pen",
    //        edittext: "Edit",
    //        add: false,
    //        addicon: "fa fa-plus",
    //        addtext: "Add",
    //        save: false,
    //        savetext: "Save",
    //        saveicon: "fa fa-save",
    //        cancelicon: "fa fa-ban",
    //        canceltext: "Cancel",
    //        editParams: {
    //            keys: false,
    //        }
    //    });
    fnAddGridSerialNoHeading();
}

//function SetGridControlByAction() {
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }
//}


function fnSaveItemReorderLevel() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == 0) {
        toastr.warning("Please Select Business Location");
        return false;
    }
    if (IsStringNullorEmpty($("#cboStore").val()) || $("#cboStore").val() == 0) {
        toastr.warning("Please Select Store");
        return false;
    }
    var obj = [];
    var gvT = $('#jqgItemReorderLevel').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['ItemDescription'])) {
            var bu_bd = {
                BusinessKey: $('#cboBusinessKey').val(),
                StoreCode: $('#cboStore').val(),
                ItemCode: gvT[i]['ItemCode'],
                ItemDescription: gvT[i]['ItemDescription'],
                MaximumStockLevel: gvT[i]['MaximumStockLevel'],
                ReorderLevel: gvT[i]['ReorderLevel'],
                SafetyStockLevel: gvT[i]['SafetyStockLevel'],
                MinimumStockLevel: gvT[i]['MinimumStockLevel'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(bu_bd);
        }
    }

    $("#btnItemReorderLevel").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnItemReorderLevel").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/ItemManagement/InsertOrUpdateItemReorderLevel',
        type: 'POST',
        datatype: 'json',
        data: { bu_bd: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                fnGridRefreshItemReorderLevel();
            }
            else {
                toastr.error(response.Message);
                $("#btnItemReorderLevel").html('Save');
                $("#btnItemReorderLevel").attr('disabled', false);
            }
            $("#btnItemReorderLevel").html('Save');
            $("#btnItemReorderLevel").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnItemReorderLevel").attr("disabled", false);
            $("#btnItemReorderLevel").html('Save');
        }
    });
}


function fnEditItemReorderLevel(e,actiontype) {

}

function fnGridRefreshItemReorderLevel() {
    $("#jqgItemReorderLevel").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}