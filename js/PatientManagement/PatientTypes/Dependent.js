﻿
function fnAddDependentTab() {

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
        $("#DependentPatientType").empty();
        $("#DependentPatientType").append(rowData.PatientTypeDesc);
        $("#DependentPatientCategory").empty();
        $("#DependentPatientCategory").append(rowData.PatientCategoryDesc);
        $("#hdPatientTypeId").val(rowData.PatientTypeId);
        $("#hdPatientCategoryId").val(rowData.PatientCategoryId);
        fnLoadPTDependentGrid(rowData);
        $("input,textarea").attr('readonly', false);
        $("#btnSavePTDependent").show();
        $("#btnSavePTDependent").attr('disabled', false);
        $("#btnSavePTDependent").html('<i class="fa fa-save"></i>  ' + localization.Save);
    }
}

function fnLoadPTDependentGrid(rowData) {
    $("#jqgDependent").jqGrid('GridUnload');
    $("#jqgDependent").jqGrid({
        url: getBaseURL() + '/PatientTypes/GetPatientTypeCategoryDependent?businesskey=' + rowData.BusinessKey + '&PatientTypeId=' + rowData.PatientTypeId + '&PatientCategoryId=' + rowData.PatientCategoryId,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Business Key", "PatientType Id", "PatientCategory Id", "Relationship", localization.Relationship, localization.Select],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "Relationship", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "RelationShipDesc", width: 350, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDependent",
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
            if (id) { $('#jqgDependent').jqGrid('editRow', id, true); }
        },
        caption: 'Relation SHip Link',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgDependent");
        },
    }).jqGrid('navGrid', '#jqpDependent', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSavePTDependent() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        toastr.warning("Please Select a Business Location");
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientTypeId').val())) {
        toastr.warning("Please select a row to select Patient Type");
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientCategoryId').val())) {
        toastr.warning("Please select a row to select Patient Category");
        return;
    }
    $("#jqgDependent").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var rvT = $('#jqgDependent').jqGrid('getRowData');
    for (var i = 0; i < rvT.length; ++i) {

        var rp = {
            BusinessKey: $('#cboBusinessLocation').val(),
            PatientTypeId: $('#hdPatientTypeId').val(),
            PatientCategoryId: $('#hdPatientCategoryId').val(),
            Relationship: rvT[i]['Relationship'],
            ActiveStatus: rvT[i]['ActiveStatus']
        }
        obj.push(rp);
    }

    $("#btnSavePTDependent").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/PatientTypes/InsertOrUpdatePatientTypeCategoryDependent',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                toastr.success(response.Message);
                fnPTDependentGridRefresh();
            }
            else {
                toastr.error(response.Message);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePTDependent").attr("disabled", false);
        }
    });

    $("#btnSavePTDependent").attr("disabled", false);
}

function fnPTDependentGridRefresh() {
    $("#jqgDependent").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearPTDependent() {

    fnPTDependentGridRefresh();
}
