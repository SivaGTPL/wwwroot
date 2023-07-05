function CheckDigits(e) {

    if (e.which == 46) {
        if ($(this).val().indexOf('.') != -1) {
            return false;
        }
    }

    if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
        return false;
    }

}

function fnAddServiceRateTypeTab() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        toastr.warning("Please Select a Business Location to add");
        return;
    }

    else {

        var rowid = $("#jqgPatientCategoryAttribute").jqGrid('getGridParam', 'selrow');

        if (rowid == null) {
            toastr.warning("Please select any row on the grid");
            return;
        }

        $("#sectionGrid").css('display', 'none');
        $('#sectionTabs').css('display', 'block');
        var rowData = $('#jqgPatientCategoryAttribute').jqGrid('getRowData', rowid);
        $("#RateTypesPatientType").empty();
        $("#RateTypesPatientType").append(rowData.PatientTypeDesc);
        $("#RateTypesPatientCategory").empty();
        $("#RateTypesPatientCategory").append(rowData.PatientCategoryDesc);
        $("#hdPatientTypeId").val(rowData.PatientTypeId);
        $("#hdPatientCategoryId").val(rowData.PatientCategoryId);
        fnLoadServiceRateTypeGrid(rowData);
        $("input,textarea").attr('readonly', false);
        $("#btnSaveServiceType").show();
        $("#btnSaveServiceType").attr('disabled', false);
        $("#btnSaveServiceType").html('<i class="fa fa-save"></i>  ' + localization.Save);
    }
}

function fnLoadServiceRateTypeGrid(rowData)
{
    $("#jqgRateTypes").jqGrid('GridUnload');
    $("#jqgRateTypes").jqGrid({
        url: getBaseURL() + '/PatientTypes/GetPatientTypeCategoryServiceTypeLink?businesskey=' + rowData.BusinessKey + '&PatientTypeId=' + rowData.PatientTypeId + '&PatientCategoryId=' + rowData.PatientCategoryId,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Business Key", "PatientType Id", "PatientCategory Id", "Service Type", localization.ServiceType, localization.RateType, localization.Select],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "ServiceType", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "ServiceTypeDesc", width: 350, editable: false, editoptions: { disabled: true }, align: 'left' },
            {
                name: 'RateType', index: 'RateType', editable: true, edittype: "text", width: 150,
                editoptions: { maxlength: 7, onkeypress: 'return CheckDigits(event)' }
            },

            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpRateTypes",
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
            if (id) { $('#jqgRateTypes').jqGrid('editRow', id, true); }
        },
        caption: 'Service Rate Types',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgRateTypes");
        },
    }).jqGrid('navGrid', '#jqpRateTypes', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveServiceType() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        toastr.warning("Please Select a Business Location");
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientTypeId').val())) {
        toastr.warning("Please select a row to select Patient Type");
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientCategoryId').val())) {
        toastr.warning("Please select row to select Patient Category");
        return;
    }
    $("#jqgRateTypes").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var gvT = $('#jqgRateTypes').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['RateType']) && (gvT[i]['RateType']!=='0')) {
            var bu_bd = {
                BusinessKey: $('#cboBusinessLocation').val(),
                PatientTypeId: $('#hdPatientTypeId').val(),
                PatientCategoryId: $('#hdPatientCategoryId').val(),
                ServiceType: gvT[i]['ServiceType'],
                RateType: gvT[i]['RateType'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(bu_bd);
        }
    }

    $("#btnSaveServiceType").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/PatientTypes/InsertOrUpdatePatientTypeCategoryServiceType',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                toastr.success(response.Message);
                fnGridRefresh();
            }
            else {
                toastr.error(response.Message);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveServiceType").attr("disabled", false);
        }
    });

    $("#btnSaveServiceType").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgRateTypes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearServiceType() {

    fnGridRefresh();
}

