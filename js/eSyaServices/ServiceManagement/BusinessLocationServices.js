$(document).ready(function () {
   
});
function fnLoadServiceBusinessLink() {
    $("#jqgServiceBusinessLink").jqGrid('GridUnload');
    $("#jqgServiceBusinessLink").jqGrid({
        url: getBaseURL() + '/ServiceManagement/GetBusinessLocationServices?businessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID", localization.ServiceClassDesc, localization.ServiceDescription, localization.InternalServiceCode, localization.ServiceCost, localization.NightLinePercentage, localization.HolidayPercentage, localization.Active],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceClassDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceDesc",  width: 100,editable: false, align: 'left' },
            { name: "InternalServiceCode", width: 100, editable: true, align: 'left', edittype: 'text'},
            { name: "ServiceCost", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "NightLinePercentage", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "HolidayPercentage", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceBusinessLink",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgServiceBusinessLink').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
        }
    }).jqGrid('navGrid', '#jqpServiceBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false });   
    $("#btnSave").show();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveServiceBusinessLink() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val())) {
        toastr.warning("Please select a Business Location");
        return;
    }
    $("#jqgServiceBusinessLink").jqGrid('editCell', 0, 0, false);
    var BL_Services = [];
    var id_list = jQuery("#jqgServiceBusinessLink").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgServiceBusinessLink').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.InternalServiceCode) || !IsStringNullorEmpty(rowData.ServiceCost)) {
            BL_Services.push({
                BusinessKey: $("#cboBusinessKey").val(),
                ServiceId: rowData.ServiceId,
                InternalServiceCode: rowData.InternalServiceCode,
                ServiceCost: rowData.ServiceCost,
                NightLinePercentage: rowData.NightLinePercentage,
                HolidayPercentage: rowData.HolidayPercentage,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ServiceManagement/AddOrUpdateBusinessLocationServices',
        type: 'POST',
        datatype: 'json',
        data: { obj: BL_Services },
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Data Saved");
                $("#jqgServiceBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}