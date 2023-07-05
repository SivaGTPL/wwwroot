
$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var alphabet = $(this).text();
        fnGridLoadItemMaster(alphabet);
        $(this).addClass('active');
    });
    fneSyaParameter();
});

function fnGridLoadItemMaster() {
    $("#jqgItemMaster").jqGrid('GridUnload');
    $("#jqgItemMaster").jqGrid({
        //url: URL,
        //mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Item Description", "Pack Unit", "Pack Size", "Inventory class", "Item Class", "Item Source","Item Criticality","Is Inspector Required","Is Rate Contract Item","Is Quotation Required","Is Batch applicable","Accounting Store","Custodian Store","Active Status","Action"],
        colModel: [
            { name: "ItemDescription", width: 70, editable: true, align: 'left', hidden: false },
            { name: "PackUnit", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
            { name: "InventoryClass", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemClass", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ItemSource", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemCriticality", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "IsInspectorRequired", width: 70, editable: true, align: 'left', hidden: true },
            { name: "IsRateContractorItem", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "IsQuotationRequired", width: 70, editable: true, align: 'left', hidden: true },
            { name: "IsBatchApplicable", width: 70, editable: true, align: 'left', hidden: true },
            { name: "AccountingStore", width: 70, editable: true, align: 'left', hidden: true },
            { name: "CustodianStore", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 28, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            {
                name: 'Action', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditItemMaster(event)"><i class="fa fa-edit"></i> Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewItemMaster(event)"><i class="fa fa-file"></i> View </button>'

                }
            },
        ],
        pager: "#jqpItemMaster",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: false,
        shrinkToFit: false,
        scrollOffset: 0
    }).jqGrid('navGrid', '#jqpItemMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemMaster', {
        caption: '<span class="fa fa-sync" style="padding-right:5px;padding-top:2px;padding-right: 2px; vertical-align:text-top;margin-left:8px;"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemMaster
    }).jqGrid('navButtonAdd', '#jqpItemMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal" data-whatever="something" style="padding-right:5px;padding-top:2px;padding-right: 2px; vertical-align:text-top;margin-left:8px;"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnGridAddItemMaster
    });
}

function fnGridAddItemMaster() {
    fnClearFields();
    $("#btnSaveItemMaster").html(' Save');
    $('#PopupItemMaster').modal('show');
    $('#PopupItemMaster').find('.modal-title').text("Add Item");
}

function fnClearFields() {
   
}

function fnGridRefreshItemMaster() {
    $("#jqgItemMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditItemMaster(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);
    $('#PopupItemMaster').find('.modal-title').text("Edit Item");
    $('#PopupItemMaster').modal('show');
   
}
function fnViewItemMaster(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);

    $('#PopupItemMaster').modal('show');
    $('#PopupItemMaster').find('.modal-title').text("View Item");
   
    $("#btnSaveItemMaster").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[type=checkbox]").attr('disabled', true);
    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("#btnSaveItemMaster").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("input[type=checkbox]").attr('disabled', false);
    })
}

function fnSaveApplicationCode() {

   
}

function fneSyaParameter() {

    $("#jqgSpecialtyParameter").jqGrid({
        //url:
        datatype: 'local',
        data: [{ ActionDesc: 'Is Inspection Reqd', ActiveStatus: true }, { ActionDesc: 'Is Saleable', ActiveStatus: true }, { ActionDesc: 'Is Rate Contract item', ActiveStatus: false }, { ActionDesc: 'Is Batch Applicable', ActiveStatus: false }],
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Action ID", "Parameter", "Status"],
        colModel: [
            { name: 'ActionID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ActionDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", formatoptions: { disabled: false } }
        ],
        caption: "",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: false,
        shrinkToFit: false,
        forceFit: false,
        cellEdit: true,

    });
}
 