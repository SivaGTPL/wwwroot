﻿$(document).ready(function () {
    fnLoadLanguageCultureGrid();

    $("#txtSearchBox").on('change keyup paste', function () {
        //  Fetch the text from our <input> control
        var searchString = $("#txtSearchBox").val();

        //  Prepare to pass a new search filter to our jqGrid
        var f = { groupOp: "AND", rules: [] };
        
        f.rules.push({ field: "Key", op: "cn", data: searchString });
        $("#jqgLanguageCulture")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgLanguageCulture")[0].p.postData, { filters: JSON.stringify(f) });
        $("#jqgLanguageCulture").trigger("reloadGrid", [{ page: 1 }]);
    });

});

function fnLoadLanguageCultureGrid() {

    $("#jqgLanguageCulture").GridUnload();
        $("#jqgLanguageCulture").jqGrid({
            url: getBaseURL() + '/Localization/GetLanguageCulture?Culture=' + $("#cboCulture").val() + '&Resource=' + $("#cboResouce").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'POST',
            colNames: [localization.ID, localization.ResourceName, localization.Key, localization.Value, "", localization.CultureValue],
            colModel: [
                { name: "ResourceId", width: 20, editable: false, hidden: true,editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "ResourceName", width: 50, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "Key", width: 60, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "Value", width: 80, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "Culture", width: 20, editable: false, hidden: true, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "CultureValue", width: 50, editable: true, align: 'left', edittype: 'text' }
            ], 
            rowNum: 10000,
            rownumWidth:55,
            pager: "#jqpLanguageCulture",
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
            caption:'Language Culture',
            onSelectRow: function (id) {
                if (id) { $('#jqgLanguageCulture').jqGrid('editRow', id, true); }
            },
            ondblClickRow: function (rowid) {
            },
            loadComplete: function (data) {
           
                //$("#jqgLanguageCulture").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                SetGridControlByAction();
                fnAddGridSerialNoHeading();
                fnJqgridSmallScreen("jqgLanguageCulture");
            }
        }).jqGrid('navGrid', '#jqpLanguageCulture', { add: false, edit: false, search: false, del: false, refresh: false });
    
}

function fnSaveLanguageCulture() {
   
    var $grid = $("#jqgLanguageCulture");
    var r_culture = [];
    var ids = jQuery("#jqgLanguageCulture").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLanguageCulture').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.CultureValue)) {
            r_culture.push({
                ResourceId: rowData.ResourceId,
                ResourceName: rowData.ResourceName,
                Key: rowData.Key,
                Value: rowData.Value,
                Culture: $("#cboCulture").val(),
                CultureValue: rowData.CultureValue,
                
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Localization/InsertOrUpdateLanguageCulture',
        type: 'POST',
        datatype: 'json',
        data: { obj: r_culture },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("saved");
                $("#jqgLanguageCulture").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                $("#btnSave").attr("disabled", false);
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
    $("#jqgLanguageCulture").jqGrid('editCell', 0, 0, false);
});

function fnShowSideBar() {
    $('#cboResoureckey').val('0');
    $('#cboResoureckey').selectpicker('refresh');
    $("#txtValue").val('');
    $("#txtCultureValue").val('');
    var keys = [];
    var ids = jQuery("#jqgLanguageCulture").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLanguageCulture').jqGrid('getRowData', rowId);
        keys.push({
                RId: rowData.ResourceId,
                RKey: rowData.Key,
            });
    }
    const r_keys = [];
    const map = new Map();
    for (const item of keys) {
        if (!map.has(item.RKey)) {
            map.set(item.RKey, true);   
            r_keys.push({
                ResId: item.RId,
                ResKey: item.RKey
            });
        }
    }

    $('#cboResoureckey').empty();
    $("#cboResoureckey").append($("<option value='0'>Choose Resource Key</option>"));
    if (r_keys != null) {
        for (var i = 0; i < r_keys.length; i++) {

            $("#cboResoureckey").append($("<option></option>").val(r_keys[i]["ResKey"]).html(r_keys[i]["ResKey"]));
        }
    }
    $('#cboResoureckey').val($("#cboResoureckey option:first").val());
    $('#cboResoureckey').selectpicker('refresh');

    $("#divSideBar").toggleClass("activeSideBar");
    $(".itemblur").toggleClass('on');

}

function fnGetvaluebyKey() {
    var res = fnGetValue($("#cboResoureckey").val());
    if (res !== 'undefined' || res !== "") {
        $("#txtValue").val(res);
    } else {
        $("#txtValue").val('');
    }
}

function fnGetValue(val) {
    var keyvalues = [];
    var ids = jQuery("#jqgLanguageCulture").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLanguageCulture').jqGrid('getRowData', rowId);
        keyvalues.push({
            rkey: rowData.Key,
            rval: rowData.Value,
        });
    }
    for (var i = 0; i < keyvalues.length; i++) {
        if (keyvalues[i].rkey === val) {
            return keyvalues[i].rval;
        }
    }
}

function fnSaveResourceCulture() {
 
    var r_culture = [];
    var ids = jQuery("#jqgLanguageCulture").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLanguageCulture').jqGrid('getRowData', rowId);
            r_culture.push({
                ResourceId: rowData.ResourceId,
                Key: rowData.Key,
                ResourceName: rowData.ResourceName,
                Culture: $("#cboCulture").val()
            });
    }

    var resourcekey = $("#cboResoureckey").val();
    if (resourcekey === '0') {
        toastr.warning("Please Select Resource Key");
        return;
    }
    if (IsStringNullorEmpty($("#txtValue").val())) {
        toastr.warning("Please Enter Value");
        return;
    }
    if (IsStringNullorEmpty($("#txtCultureValue").val())) {
        toastr.warning("Please Enter Culture Value");
        return;
    }
    
        var culture = [];
        for (var i = 0; i < r_culture.length; i++) {
            if (r_culture[i].Key === resourcekey) {
                culture.push({
                    ResourceId: r_culture[i].ResourceId,
                    ResourceName: r_culture[i].ResourceName,
                    Culture: r_culture[i].Culture,
                    Key: resourcekey,
                    Value: $("#txtValue").val(),
                    CultureValue: $("#txtCultureValue").val()
                });
            }
        }
    

    $("#btnsaveResourceCulture").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Localization/InsertOrUpdateLanguageCulture',
        type: 'POST',
        datatype: 'json',
        data: { obj: culture },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success("saved");
                $("#jqgLanguageCulture").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                fnCloseSidebar();
                $("#btnsaveResourceCulture").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnsaveResourceCulture").attr("disabled", false);
            }
            $("#btnsaveResourceCulture").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnsaveResourceCulture").attr("disabled", false);
        }
    });

}

function fnCloseSidebar() {
    $("#divSideBar").removeClass('activeSideBar');
    $(".itemblur").toggleClass('on');
}

function SetGridControlByAction() {
    $("#btnsaveResourceCulture").attr("disabled", false);
    $("#btnSave").attr("disabled", false); 
    if (_userFormRole.IsEdit === false) {
        $("#btnsaveResourceCulture").attr("disabled", true);
        $("#btnSave").attr("disabled", true);
    }
}