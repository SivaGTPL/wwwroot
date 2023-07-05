
var NodeID;
var prevSelectedID;

$(document).ready(function () {
    //fnLoadCustodianTree();
    $("#pnlAddItemCustodian").hide();
   });
$("#popupAddItemCategory").on('shown.bs.modal', function () {
   // fnLoadGridItemCustodian();
   // fnLoadGridAccountingStore();
   // fnLoadGridConsumptionStore();
    console.log($('.divCustodianStore').width());
    $('#jqgCustodianStore').jqGrid('setGridWidth', $('.divCustodianStore').width());
})
function fnLoadtreebyBusinessKey() {
    if ($("#cboBusinessKey").val() === '0') {
        $("#ItemCustodianTree").jstree("destroy");
        //$("#jqgCustodianStore").hide();
        //$("#jqpCustodianStore").hide();
        //$('#pnlAddItemCategory').hide();
    }
    else {
        //$("#jqgCustodianStore").show();
        //$("#jqpCustodianStore").show();
        fnLoadCustodianTree();
    }
}
//function fnLoadGridItemCustodian() {
//    $("#jqgCustodianStore").jqGrid('GridUnload');
//    $("#jqgCustodianStore").jqGrid({
//        url: getBaseURL() + '/ItemManagement/GetCustodianStoreList',
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.StoreCode, localization.CustodianStore, localization.Active],
//        colModel: [
//            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: true },
//            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 55,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//        loadComplete: function () {
           
//        }
//    }).jqGrid('navGrid', '#jqgCustodianStore', { add: false, edit: false, search: false, del: false, refresh: false });

//}

function fnLoadCustodianTree() {

    $.ajax({
        url: getBaseURL() + '/ItemManagement/GetItemTree',
        type: 'POST',
        //datatype: 'json',
        success: function (result) {
            fnGetBusinessLocation_Success(result);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });

    //$('#ItemCustodianTree').jstree({
    //    'core': {
    //        'data': [
                
    //            {
    //                'text': 'Item',
    //                'state': {
    //                    'opened': true,
    //                    'selected': true
    //                },
    //                'children': [
    //                    { 'text': 'Item 1' },
    //                    'Item 2'
    //                ]
    //            }
    //        ]
    //    }
    //});
}

function fnGetBusinessLocation_Success(dataArray) {
    $("#ItemCustodianTree").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        //"plugins": ["checkbox"],
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    $("#ItemCustodianTree").on('loaded.jstree', function () {

        $("#ItemCustodianTree").jstree('open_all');
        $("#ItemCustodianTree").jstree()._open_to(prevSelectedID);
        $('#ItemCustodianTree').jstree().select_node(prevSelectedID);

    });

    $('#ItemCustodianTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $('#popupAddItemCategory').modal('hide');
                }
                else {
                    
                
                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $('#popupAddItemCategory').modal('hide');


                    if (data.node.id.startsWith("IT")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[3];
                       
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')


                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#popupAddItemCategory').modal('hide');
                                toastr.warning(errorMsgCS["E001"]);
                                return;
                            }
                            if ($("#cboBusinessKey").val() === 0 || $("#cboBusinessKey").val() === "0") {
                                $('#popupAddItemCategory').modal('hide');
                                toastr.warning('Please select a Location');
                                return;
                            }
                            $('#popupAddItemCategory').modal('show');
                            $('#pnlcustodianheading > h5').text(localization.ViewCustodianStore);
                            $('#btnICAdd').hide();
                            $("#txtItemcode").val(NodeID);
                            fnLoadStoreGrid("A");
                            //fnFillCustodianStore();
                            //$("input[type=checkbox]").attr('disabled', true);
                        });

                        $('#Edit').on('click', function () {
                           
                            if (_userFormRole.IsEdit === false) {
                                $('#popupAddItemCategory').modal('hide');
                                toastr.warning(errorMsgCS["E002"]);
                                return;
                            }
                            if ($("#cboBusinessKey").val() === 0 || $("#cboBusinessKey").val() === "0") {
                                $('#popupAddItemCategory').modal('hide');
                                toastr.warning('Please select any Location');
                                return;
                            }
                            $('#popupAddItemCategory').modal('show');
                            $('#pnlcustodianheading > h5').text(localization.EditCustodianStore);
                            $('#btnICAdd').show();
                            $('#btnICAdd').html('<i class="fa fa-sync"></i>' + localization.Update);
                            $("#txtItemcode").val(NodeID);
                           // fnFillCustodianStore();
                           // fnFillAccountingStore();
                           // fnFillConsumptionStore();
                            //$("input[type=checkbox]").attr('disabled', false);
                        });

                        $('#Add').on('click', function () {
                          
                            if (_userFormRole.IsInsert === false) {
                                $('#popupAddItemCategory').modal('hide');
                                toastr.warning(errorMsgCS["E003"]);
                                return;
                            }
                            if ($("#cboBusinessKey").val() === 0 || $("#cboBusinessKey").val() === "0") {
                                $('#popupAddItemCategory').modal('hide');
                                toastr.warning('Please select any Location');
                                return;
                            }

                            $('#popupAddItemCategory').modal('show');
                          
                            $("#txtItemcode").val(NodeID);
                            fnLoadAccountingStoreGrid();
                            fnLoadCustodianStoreGrid();
                            fnLoadConsumptionStoreGrid();
                            //fnLoadStoreGrid("T");
                          //  fnLoadStoreGrid("C");
                            $('#btnICAdd').show();
                            $('#pnlcustodianheading > h5').text(localization.AddCustodianStore);
                            $('#btnICAdd').html('<i class="fa fa-plus"></i>' + localization.Add);
                                                    
                            //$("input[type=checkbox]").attr('disabled', false);
                        });


                    }
                    else {
                        $('#View').remove();
                        $('#Edit').remove();
                        $('#Add').remove();
                        fnClearFields();
                        $('#popupAddItemCategory').modal('hide');
                    }
                }
            }
        }
    });

    $('#ItemCustodianTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ItemCustodianTree').jstree().deselect_node(closingNode.children);
    });

}

function fnClearFields() {
    $("#txtItemcode").val('');
}

//function fnFillCustodianStore() {
  
//    $("#jqgCustodianStore").jqGrid('GridUnload');
//    $("#jqgCustodianStore").jqGrid({
//        url: getBaseURL() + '/ItemManagement/GetCustodianStoreListbyAccountingStore?Businesskey=' + $("#cboBusinessKey").val() + '&Itemcode=' + $("#txtItemcode").val() + '&accountingcode=' + $("#cboAccountingStore").val(),
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.StoreCode, localization.CustodianStore, localization.Active],
//        colModel: [
//            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: true },
//            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 55,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//    }).jqGrid('navGrid', '#jqgCustodianStore', { add: false, edit: false, search: false, del: false, refresh: false });

//}


function fnLoadAccountingStoreGrid() {

    $("#jqgAccountingStore").GridUnload();
    $("#jqgAccountingStore").jqGrid({
        url: getBaseURL() + '/ItemManagement/GetAccountingStoreForItem',
        datatype: "json",
        mtype: 'POST',
        rownumbers: true,
        postData: {
            businesskey: function () { return $("#cboBusinessKey").val(); },
            itemcode: function () { return $("#txtItemcode").val(); },
            accountingType: function () { return "A"; }
        },
        colNames: [localization.StoreCode, "Store", localization.Active],
        colModel: [
            { name: "StoreCode", width: 170, editable: false, align: 'left', hidden: true },
            { name: "StoreDesc", width: 170, editable: false, align: 'left', hidden: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox" }
        ],
        caption: "",
        height: 'auto',
        width: '400',
        rowNum: 100,
        viewrecords: true,
        gridview: true,
        loadonce: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        onSelectRow: function (id) {
            if (id) { $("#jqgAccountingStore").jqGrid('editRow', id, true); }
        },
        loadComplete: function () {
            var ids = $('#jqgAccountingStore').jqGrid('getDataIDs');
            var i = 0;
            for (i = 0; i < ids.length; i++) {
                if (ids[i])
                    $('#jqgAccountingStore').jqGrid('editRow', ids[i]);
            }

        }
    });

}

function fnLoadCustodianStoreGrid() {
    $("#jqgCustodianStore").GridUnload();
    $("#jqgCustodianStore").jqGrid({
        url: getBaseURL() + '/ItemManagement/GetAccountingStoreForItem',
        datatype: "json",
        mtype: 'POST',
        rownumbers: true,
        postData: {
            businesskey: function () { return $("#cboBusinessKey").val(); },
            itemcode: function () { return $("#txtItemcode").val(); },
            accountingType: function () { return "T"; }
        },
        colNames: [localization.StoreCode, "Store", localization.Active],
        colModel: [
            { name: "StoreCode", width: 170, editable: true, align: 'left', hidden: true },
            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        caption: "",
        height: 'auto',
        width: '400',
        rowNum: 100,
        viewrecords: true,
        gridview: true,
        loadonce: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        onSelectRow: function (id) {
            if (id) { $("#jqgCustodianStore").jqGrid('editRow', id, true); }
        }
    });
}

function fnLoadConsumptionStoreGrid() {
    $("#jqgConsumptionStore").GridUnload();
    $("#jqgConsumptionStore").jqGrid({
        url: getBaseURL() + '/ItemManagement/GetAccountingStoreForItem',
        datatype: "json",
        mtype: 'POST',
        rownumbers: true,
        postData: {
            businesskey: function () { return $("#cboBusinessKey").val(); },
            itemcode: function () { return $("#txtItemcode").val(); },
            accountingType: function () { return "C"; }
        },
        colNames: [localization.StoreCode, "Store", localization.Active],
        colModel: [
            { name: "StoreCode", width: 170, editable: true, align: 'left', hidden: true },
            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        caption: "",
        height: 'auto',
        width: '400',
        rowNum: 100,
        viewrecords: true,
        gridview: true,
        loadonce: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        onSelectRow: function (id) {
            if (id) { $("#jqgConsumptionStore").jqGrid('editRow', id, true); }
        }
    });
}


function fnSaveItemCustodianStore() {
 
    if ($("#cboBusinessKey").val() === 0 || $("#cboBusinessKey").val() === "0") {
        toastr.warning('Please select any Location');
        return;
    }
   
    if (IsStringNullorEmpty($("#txtItemcode").val())) {
        toastr.warning("Please select a Item");
        return;
    }

    var $grid = $("#jqgAccountingStore");
    var l_storelinked = [];

    var id_A = jQuery("#jqgAccountingStore").jqGrid('getDataIDs');
    for (var a = 0; a < id_A.length; a++) {
        var rowId_a = id_A[a];
        var rowData_a = jQuery('#jqgAccountingStore').jqGrid('getRowData', rowId_a);
        if (rowData_a.ActiveStatus === "Yes") {
            l_storelinked.push({
                BusinessKey: $("#cboBusinessKey").val(),
                ItemCode: $("#txtItemcode").val(),
                AccountingType: 'A',
                StoreCode: rowData_a.StoreCode,
                ActiveStatus:true
            });
        }
    }

    var id_T = jQuery("#jqgCustodianStore").jqGrid('getDataIDs');
    for (var t = 0; t < id_T.length; t++) {
        var rowId_t = id_T[t];
        var rowData_t = jQuery('#jqgCustodianStore').jqGrid('getRowData', rowId_t);
        if (rowData_t.ActiveStatus === "Yes") {
            l_storelinked.push({
                BusinessKey: $("#cboBusinessKey").val(),
                ItemCode: $("#txtItemcode").val(),
                AccountingType: 'T',
                StoreCode: rowData_t.StoreCode,
                ActiveStatus: true
            });
        }
    }

    var id_C = jQuery("#jqgConsumptionStore").jqGrid('getDataIDs');
    for (var c = 0; c < id_C.length; c++) {
        var rowId_c = id_C[c];
        var rowData_c = jQuery('#jqgConsumptionStore').jqGrid('getRowData', rowId_c);
        if (rowData_c.ActiveStatus === "Yes") {
            l_storelinked.push({
                BusinessKey: $("#cboBusinessKey").val(),
                ItemCode: $("#txtItemcode").val(),
                AccountingType: 'C',
                StoreCode: rowData_c.StoreCode,
                ActiveStatus: true
            });
        }
    }

    $("#btnICAdd").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ItemManagement/InsertAccountingStoreForItem',
        type: 'POST',
        datatype: 'json',
        data: { obj: l_storelinked },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Saved");
                fnClearFields();
                $("#ItemCustodianTree").jstree("destroy");
               // fnLoadCustodianTree();
                $('#popupAddItemCategory').modal('hide');
            }
            else {
                toastr.error(response.Message);
                $("#btnICAdd").attr("disabled", false);
            }
            $("#btnICAdd").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnICAdd").attr("disabled", false);
        }
    });

}

//function fnLoadGridAccountingStore() {
//    $("#jqgAccountingStore").jqGrid('GridUnload');
//    $("#jqgAccountingStore").jqGrid({
//        url: getBaseURL() + '/ItemManagement/GetCustodianStoreList',
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.StoreCode, localization.CustodianStore, localization.Active],
//        colModel: [
//            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: true },
//            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 55,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//        loadComplete: function () {

//        }
//    }).jqGrid('navGrid', '#jqgAccountingStore', { add: false, edit: false, search: false, del: false, refresh: false });

//}

//function fnFillAccountingStore() {

//    $("#jqgAccountingStore").jqGrid('GridUnload');
//    $("#jqgAccountingStore").jqGrid({
//        url: getBaseURL() + '/ItemManagement/GetCustodianStoreListbyAccountingStore?Businesskey=' + $("#cboBusinessKey").val() + '&Itemcode=' + $("#txtItemcode").val() + '&accountingcode=' + $("#cboAccountingStore").val(),
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.StoreCode, localization.CustodianStore, localization.Active],
//        colModel: [
//            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: true },
//            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 55,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//    }).jqGrid('navGrid', '#jqgAccountingStore', { add: false, edit: false, search: false, del: false, refresh: false });

//}

//function fnLoadGridConsumptionStore() {
//    $("#jqgConsumptionStore").jqGrid('GridUnload');
//    $("#jqgConsumptionStore").jqGrid({
//        url: getBaseURL() + '/ItemManagement/GetCustodianStoreList',
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.StoreCode, localization.CustodianStore, localization.Active],
//        colModel: [
//            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: true },
//            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 55,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//        loadComplete: function () {

//        }
//    }).jqGrid('navGrid', '#jqgConsumptionStore', { add: false, edit: false, search: false, del: false, refresh: false });

//}
//function fnFillConsumptionStore() {
//    $("#jqgConsumptionStore").jqGrid('GridUnload');
//    $("#jqgConsumptionStore").jqGrid({
//        url: getBaseURL() + '/ItemManagement/GetCustodianStoreListbyAccountingStore?Businesskey=' + $("#cboBusinessKey").val() + '&Itemcode=' + $("#txtItemcode").val() + '&accountingcode=' + $("#cboAccountingStore").val(),
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.StoreCode, localization.CustodianStore, localization.Active],
//        colModel: [
//            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: true },
//            { name: "StoreDesc", width: 170, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 55,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//    }).jqGrid('navGrid', '#jqgConsumptionStore', { add: false, edit: false, search: false, del: false, refresh: false });

//}