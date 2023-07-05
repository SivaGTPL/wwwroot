$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var alphabet = $(this).text();
        fnGridLoadItemReorderLevel(alphabet);
        $(this).addClass('active');
    });
    fneSyaParameter();
});
function fnGridLoadItemReorderLevel() {
    $("#jqgItemReorderLevel").jqGrid('GridUnload');
    $("#jqgItemReorderLevel").jqGrid({
        //url: URL,
        //mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Item Description", "Pack Unit", "Pack Size", "Inventory class", "Item Class", "Item Source", "Item Criticality", "Is Inspector Required", "Is Rate Contract Item", "Is Quotation Required", "Is Batch applicable", "Accounting Store", "Custodian Store", "Active Status", "Action"],
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
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditItemReorderLevel(event)"><i class="fas fa-pen"></i> Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewItemReorderLevel(event)"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        pager: "#jqpItemReorderLevel",
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
        scrollOffset: 0, caption: 'Item Reorder Level',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgItemReorderLevel");
        },
    }).jqGrid('navGrid', '#jqpItemReorderLevel', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemReorderLevel', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemReorderLevel
    }).jqGrid('navButtonAdd', '#jqpItemReorderLevel', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnGridAddItemReorderLevel
        });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshItemReorderLevel() {

}

function fnGridAddItemReorderLevel() {
    $("#PopupItemReorderLevel").modal('show');
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
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,

    });
}