$(document).ready(function () {
    fnLoadCustomerItemLink();
})


function fnLoadCustomerItemLink() {

    $("#jqgCustomerItemLink").trigger("GridUnload");

    $("#jqgCustomerItemLink").jqGrid({
        //url:,
        //mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Item Description", "Business share (in %)", "Min. Supply Qty.", "Rate Plan", "Effective From", "Effective Till", "Active Status", ""],
        colModel: [{ name: 'CustomerCode', width: '40', resizable: false, hidden: true },
        { name: 'ItemDesc', width: '200', resizable: false, hidden: false },
        { name: 'BusinessShare', width: '170', resizable: false, align: 'right' },
        { name: 'MinimumSupplyQuantity', width: '100', resizable: false, align: 'right' },
        { name: 'RatePlan', width: '80', resizable: false },
        { name: 'EffectiveFrom', width: '100', resizable: false, align: 'right' },
        { name: 'EffectiveTill', width: '100', resizable: false, align: 'right' },
        { name: 'ActiveStatus', width: '100', resizable: false },
        {
            name: '', width: '100', resizable: false,
            formatter: function (cellValue, option, rowObject) {
                var ret = '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit"> Edit </button>'
                return ret;
            },
        }],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth: 55,
        pager: "#jqpCustomerItemLink",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll: false,
        loadonce: true,
        width: 'auto',
        height: 'auto',
        autowidth: 'auto',
        shrinkToFit: true,
        forceFit: true, caption: "Customer Item Link",
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgCustomerItemLink");
        },
    }).jqGrid('navGrid', '#jqpCustomerItemLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCustomerItemLink', {
        caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'custReload', position: 'first', onClickButton: toRefresh
    });
    fnAddGridSerialNoHeading();
}

function toRefresh() {
    $("#jqgCustomerItemLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
