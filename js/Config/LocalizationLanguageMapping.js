﻿
$(document).ready(function () {
    fnLoadLocalizationTableMappingGrid();
});

function fnLoadLocalizationTableMappingGrid() {

    var languageCode = $("#cboLanguage").val();
    var tableCode = $("#cboTable").val(); 

    $("#jqgTableFieldLanguageMapping").GridUnload();

    if (!IsStringNullorEmpty(languageCode) && !IsStringNullorEmpty(tableCode)) {

        $("#jqgTableFieldLanguageMapping").jqGrid({
            url: getBaseURL() + '/Localization/GetLocalizationLanguageMapping?languageCode=' + languageCode + '&tableCode=' + tableCode,
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            colNames: [localization.ID, localization.Description, localization.LanguageDescription],
            colModel: [
                { name: "TablePrimaryKeyId", width: 90, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "FieldDescription", width: 160, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "FieldDescLanguage", width: 250, editable: true, align: 'left', edittype: 'text', editoptions: { maxlength: 50 }}
            ],
            rowNum: 10000,
            rownumWidth:55,
            pager: "#jqpTableFieldLanguageMapping",
            pgtext: null,
            pgbuttons: null,
            viewrecords: false,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            loadonce: true,
             cellEdit: true,
            editurl: 'url',
            cellsubmit: 'clientArray',
            caption:'Table Field Language Mapping',
            onSelectRow: function (id) {
                if (id) { $('#jqgTableFieldLanguageMapping').jqGrid('editRow', id, true); }
            },
            ondblClickRow: function (rowid) {
            },
            loadComplete: function (data) {
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
                $("#jqgTableFieldLanguageMapping").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                SetGridControlByAction();
                fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgTableFieldLanguageMapping");
            }
        }).jqGrid('navGrid', '#jqpTableFieldLanguageMapping', { add: false, edit: false, search: false, del: false, refresh: false });
    }
}

function fnSave() {

    if (IsStringNullorEmpty($("#cboLanguage").val())) {
        toastr.warning("please select the language");
        return false;
    }
    if (IsStringNullorEmpty($("#cboTable").val())) {
        toastr.warning("please select the table");
        return false;
    }

    var $grid = $("#jqgTableFieldLanguageMapping");
    var l_language = [];
    var ids = jQuery("#jqgTableFieldLanguageMapping").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgTableFieldLanguageMapping').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.FieldDescLanguage)) {
            l_language.push({
                LanguageCode: $("#cboLanguage").val(),
                TableCode: $("#cboTable").val(),
                TablePrimaryKeyId: rowData.TablePrimaryKeyId,
                FieldDescLanguage: rowData.FieldDescLanguage
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Localization/InsertOrUpdateLocalizationLanguageMapping',
        type: 'POST',
        datatype: 'json',
        data: { l_obj: l_language },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("saved");
                $("#jqgTableFieldLanguageMapping").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                toastr.error(response.Message);
                $("#btnSave").attr("disabled", false);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}


$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgTableFieldLanguageMapping").jqGrid('editCell', 0, 0, false);
});

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    if (_userFormRole.IsEdit === false) {
        $("#btnSave").attr("disabled",true);
    }
}