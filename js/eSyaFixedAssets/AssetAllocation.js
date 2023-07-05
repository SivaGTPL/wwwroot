
$(document).ready(function () {
    fnGridLoadAssetAllocation();
});
var actiontype = "";
function fnGridLoadAssetAllocation() {

    var codeType = $("#cboCodeType").val();
    $("#jqgAssetAllocation").jqGrid('GridUnload');
    $("#jqgAssetAllocation").jqGrid({
        url: getBaseURL() + '/AssetAllocate/GetAssetRegisterToAllocate',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Asset Description", "Asset No", "Asset SL No", "Active", "Actions"],
        colModel: [
            { name: "AssetDescription", width: 70, editable: true, align: 'left'},
            { name: "InternalAssetNumber", width: 70, editable: false, align: 'left', resizable: true },
            { name: "IASerialNumber", width: 170, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", editable: true, width: 28, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true: false" } },
            {
                name: 'Actions', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnAssetAllocation(event)"><i class="fas fa-wrench"></i> Allocate </button>'
                }
            }
        ],
        pager: "#jqpAssetAllocation",
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
        scrollOffset: 0, caption: 'Asset Allocation',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgAssetAllocation");
        },
    }).jqGrid('navGrid', '#jqpAssetAllocation', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAssetAllocation', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAssetAllocation
    });
    fnAddGridSerialNoHeading();
}
 
function fnAssetAllocation(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetAllocation').jqGrid('getRowData', rowid);
    fnClearAllocationFields();
    $('#txtInternalAssetNumber').val(rowData.InternalAssetNumber);
    $('#txtIASerialNumber').val(rowData.IASerialNumber);
    $('#PopupAssetAllocation').modal('show');

    //$('#dtAllocationDate').val(Date.now);
    setDate($('#dtAllocationDate'), new Date());
    setDate($('#dtInstallationDate'), new Date());
}
 
function fnGridRefreshAssetAllocation() {
    $("#jqgAssetAllocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnFillDepartmentLocation() {

    if ($('#cboDepartment').val() != '' && $('#cboDepartment').val() != null) {

        $.getJSON(getBaseURL() + '/AssetAllocate/GetLocationList?departmentId=' + $('#cboDepartment').val(), function (result) {
            var options = $("#cboDepartmentLocation");
            $("#cboDepartmentLocation").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.DeptLocnID).text(this.LocationDescription));
            });
            $('#cboDepartmentLocation').selectpicker('refresh');
        });

    }
}

$("#btnCancelApplicationCode").click(function () {
    fnClearFields();
    $("#jqgAssetAllocation").jqGrid('resetSelection');
    $('#PopupAssetAllocation').modal('hide');
});

function fnClearFields() {
    
}

function fnClearAllocationFields() {

    $('#txtInternalAssetNumber').val('');
    $('#txtIASerialNumber').val('');
    $('#dtAllocationDate').val('');
    $('#dtInstallationDate').val('');
    $('#txtAssetTagNumber').val('');
    $('#cboDepartment').val('');
    $('#cboDepartment').selectpicker('refresh');
    $('#cboDepartmentLocation').val('');
    $('#cboDepartmentLocation').selectpicker('refresh');
    $('#cboCustodianType').val('');
    $('#cboCustodianType').selectpicker('refresh');
    $('#txtEmployeeName').val('');
    
}
