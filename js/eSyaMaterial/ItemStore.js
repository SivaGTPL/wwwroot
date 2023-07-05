 
var actiontype = "";
$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var alphabet = $(this).text();
         $(this).addClass('active');
    });
    fnGridLoadItemStoreMaster();
    fnLoadGridStoreLink();
});

function fnGridLoadItemStoreMaster() {
    
      $("#jqgItemStoreMaster").jqGrid('GridUnload');
    $("#jqgItemStoreMaster").jqGrid({
       // url: URL,
       // mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Item Code", "Item Description", "Unit Of Measure", "Pack Unit", "Pack Size", "Inventory class", "Item Class", "Item Source", "Item Criticality", "Barcode ID", "Active", "Action"],
        colModel: [
            { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ItemDescription", width: 70, editable: true, align: 'left', hidden: false },
            { name: "UnitOfMeasure", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PackUnit", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
            { name: "InventoryClass", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemClass", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ItemSource", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemCriticality", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BarCodeID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: true, width: 28, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            {
                name: 'Action', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Store Link" onclick="return fnShowItemLink()"><i class="far fa-eye"></i> Store Link </button>'

                }
            },
        ],
        pager: "#jqpItemStoreMaster",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        multiselect:true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0
    }).jqGrid('navGrid', '#jqpItemStoreMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemStoreMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemStoreMaster
    })
}
function fnGridRefreshItemStoreMaster() {

}
function fnGridAddItemStoreMaster() {

}
function fnEditItemStoreMaster(e,actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgItemStoreMaster').jqGrid('getRowData', rowid);
}
function fnShowItemLink() {
    $("#PopupStoreLink").modal('show');
}
function fnLoadGridStoreLink() {
    $("#jqgStoreLink").jqGrid({
        data: [{ SupplyGroup: 'Pharmacy', ActiveStatus: true }, { SupplyGroup: 'Laboratory', ActiveStatus: false }],
        datatype: 'local',
        colNames: ["Custodian Store", "Is Active"],
        colModel: [
            { name: "CustodianStore", width: 170, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        rowNum: 100000,
        pgtext: null,
        pgbuttons: false,
        loadonce: true,
        rownumWidth: 55,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,

    }).jqGrid('navGrid', '#jqpStoreLink', { add: false, edit: false, search: false, del: false, refresh: false });
}