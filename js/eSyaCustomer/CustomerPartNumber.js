var Isadd = 0;
var Selected = 0;
$(document).ready(function () {
    fnLoadPartNumber();
})
function fnLoadPartNumber() {

    $("#jqgCustomerPartNumber").jqGrid('GridUnload');

    $("#jqgCustomerPartNumber").jqGrid({
        //url:,
        //mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Item Description", "Part Number", "Part Description", "Active Status", "", ""],
        colModel: [
            { name: 'CustomerCode', width: '40', resizable: false, hidden: true },
            { name: 'ItemCode', width: '200', resizable: false, hidden: false },
            { name: 'PartNumber', width: '170', resizable: false, align: 'left' },
            { name: 'PartDesc', width: '100', resizable: false, align: 'left' },
            {
                name: "ActiveStatus", editable: true, width: 85, align: "left", edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "true: Active;false: Inactive" }
            },
            {
                name: '', width: 40, resizable: false,
                formatter: function (cellValue, option, rowObject) {
                    return '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit" onclick="return _fnEditPartNumber(event)"> Edit </button>'

                },
            },
            {
                name: '', width: 40, resizable: false,
                formatter: function (cellValue, option, rowObject) {
                    return '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit" onclick="return _fnDeletePartNumber(event)"> Delete </button>'

                },
            }

        ],
        rowNum: 5,
        rowList: [5, 10, 20],
        rownumWidth: 55,
        pager: "#jqpCustomerPartNumber",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll: false,
        loadonce: true,
        width: 'auto',
        height: 'auto',
        autowidth: 'auto',
        shrinkToFit: true,
        forceFit: true, caption:"Customer Part Number",
        onSelectRow: function (rowid) {
           
        },
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgCustomerPartNumber");
        },
    }).jqGrid('navGrid', '#jqpCustomerPartNumber', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCustomerPartNumber', {
        caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'custReload', position: 'first', onClickButton: toRefresh
    });
    fnAddGridSerialNoHeading();
}

function toRefresh() {
    $("#jqgCustomerPartNumber").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


function fnPartNumberSavebtn() {
   

}


function _fnEditPartNumber(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCustomerPartNumber').jqGrid('getRowData', rowid);
    Isadd = 1;

    $("#btnPartNumberDisabled").html("Update");
}

function _fnDeletePartNumber(e) {
   
}

function _fnvalidationpartNumber() {
    var ItemDescription = $("#txtItemDescriptionforPartNumber").val();
    var PartNumber = $("#txtPartNumber").val();
    var PartDescription = $("#txtPartDescription").val();

    if (ItemDescription == null || ItemDescription == "") {
        fnAlert("Please Enter Item Description", "e");
        return false;
    }

    if (PartNumber == null || PartNumber == "") {
        fnAlert("Please Enter  Part Number", "e");
        return false;
    }

    if (PartDescription == null || PartDescription == "") {
        fnAlert("Please Enter Part Description", "e");
        return false;
    }
}


function _fnClearPartNumber() {
    $("#txtItemDescriptionforPartNumber").attr('disabled', false);
    $("#txtItemDescriptionforPartNumber").val('');
    $("#txtPartNumber").attr('disabled', false);
    $("#txtPartNumber").val('');
    $("#txtPartDescription").val('');
    $("#cbostatusforPartNumber").val("true"),
        $('#cbostatusforPartNumber').selectpicker('refresh');
    Isadd = 0;
}

