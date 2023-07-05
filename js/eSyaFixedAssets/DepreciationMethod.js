
$(document).ready(function () {
    fnGridLoadAssetGroup();
    //fnGridDepreciationMethod();
});

function fnGridLoadAssetGroup() {
     $("#jqgAssetGroup").jqGrid('GridUnload');
    $("#jqgAssetGroup").jqGrid({
        url: getBaseURL() + '/FixedAssets/GetAssetGroupAndSubGroup',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Asset Group ID", "Asset Group", "Sub Group ID", "Sub Group", "Active", "Action"],
        colModel: [
            { name: "AssetGroupID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "AssetGroup", width: 170, editable: true, align: 'left', hidden: false },
            { name: "AssetSubGroupID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "AssetSubGroup", width: 140, editable: false, hidden: false, align: 'left', resizable: true },
            //{ name: "ActiveStatus", editable: true, width: 28, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            { name: "ActiveStatus", editable: true, width: 28, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width:64, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" id="jqgEdit" title="Edit" onclick="return fnGridAddAssetGroup(event)"><i class="fas fa-pen"></i> Add/ Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewDepreciationMethod(event)"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpAssetGroup",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'Asset Group',
        loadComplete: function (data) {
            SetGridControlByAction("jqgAssetGroup"); fnJqgridSmallScreen("jqgAssetGroup");
        }
    }).jqGrid('navGrid', '#jqpAssetGroup', { add: false, edit: false, search: false, del: false, refresh: false });
        /*.jqGrid('navButtonAdd', '#jqpAssetGroup', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first",
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnGridAddAssetGroup
    });*/
}

function fnGridAddAssetGroup(e) {
    
    $('#PopupDepreciationMethod').modal('show');
    //$('#PopupDepreciationMethod').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDepreciationMethod').find('.modal-title').text("Add Depreciation Method");

    $('#btnDepreciationMethodSave').show();
    $("#btnDepreciationMethodSave").html(' Save');
    $("#btnDepreciationMethodCancel").html(' Cancel');

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetGroup').jqGrid('getRowData', rowid);

    //alert(JSON.stringify(rowid));
    //alert(JSON.stringify(rowData));
    $('#lblAssetGroup').html(rowData.AssetGroup);
    $('#lblSubGroup').html(rowData.AssetSubGroup);
    $('#hdvAssetGroupId').val(rowData.AssetGroupID);
    $('#hdvAssetSubGroupId').val(rowData.AssetSubGroupID);
    fnGridDepreciationMethod(rowData.AssetGroupID, rowData.AssetSubGroupID, true);
}

function fnViewDepreciationMethod(e) {

    $('#PopupDepreciationMethod').modal('show');
    $('#PopupDepreciationMethod').find('.modal-title').text("Add Depreciation Method");
    $('#btnDepreciationMethodSave').hide();
    $("#btnDepreciationMethodCancel").html(' Close');

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetGroup').jqGrid('getRowData', rowid);

    $('#lblAssetGroup').html(rowData.AssetGroup);
    $('#lblSubGroup').html(rowData.AssetSubGroup);
    fnGridDepreciationMethod(rowData.AssetGroupID, rowData.AssetSubGroupID, false);
}


function fnGridDepreciationMethod(assetGroup, assetSubGroup, cellEditable) {

    //alert(JSON.stringify(assetGroup));
    //alert(JSON.stringify(assetSubGroup));
    $('#jqgDepreciationMethod').jqGrid('GridUnload');
    $("#jqgDepreciationMethod").jqGrid({
        url: getBaseURL() + '/FixedAssets/GetDepreciationMethods?assetGroup=' + assetGroup + '&assetSubGroup=' + assetSubGroup,
        mtype: 'Post',
        //data: [{ assetGroup: assetGroup, assetSubGroup: assetSubGroup}],
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Asset Group ID", "Asset Sub Group ID", "Depreciation Method ID", "Depreciation Method", "Depreciation Percentage ", "Effective From", "Effective Till", "Active"],
        colModel: [
            { name: "AssetGroupID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "AssetSubGroupID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "DepreciationMethod", width: 70, editable: true, align: 'left', hidden: true },
            { name: "DepreciationMethodDesc", width: 150, editable: false , align: 'left', editoptions: { maxlength: 4 }, hidden: false },
            { name: "DepreciationPercentage", width: 160, editable: true, align: 'left', editoptions: { maxlength: 5, onkeypress: 'return fnOnlyDigits(event)' } },
            {
                name: "EffectiveFrom", width: 200, editable: true, align: 'left', resizable: false, formatter: 'date', //formatoptions: { newformat: 'd-M-Y' },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).datepicker({ minDate: 0 });
                    }
                } },
            {
                name: "EffectiveTill", editable: true, width: 150, align: 'left', resizable: false, hidden:true, formatter: 'date',
                editoptions: {
                    size: 10, maxlength: 10,
                    
                }
            },
            { name: "ActiveStatus", editable: true, width: 120, edittype: "checkbox", align: 'center', formatter: 'checkbox', editoptions: { value: "true:false" } },
             
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        emptyrecords: "No records to Veiw",
        pager: "#jqpDepreciationMethod",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: cellEditable,
        cellsubmit: 'clientArray',
        //restoreAfterSelect: false,
        //saveAfterSelect: true,
        //editurl: getBaseURL() + '/CurrencyMaster/InsertUpdateCurrencyDenominationInformation?CCode=' + currencyCode,
        ajaxRowOptions: {
            type: "POST",
            contentType: "application/json",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            return JSON.stringify(postData);
        },
        extraparam: {
           
        },
        ondblClickRow: function (rowid) {
            $("#jqgDepreciationMethod").trigger('click');
        },
    }).jqGrid('navGrid', '#jqpDepreciationMethod', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgDepreciationMethod").jqGrid('inlineNav', '#jqpDepreciationMethod',
        {
            edit: false,
            editicon: " fa fa-pen",
            edittext: " Edit",
            add: false,
            addicon: "fa fa-plus",
            addtext: " Add",
            save: false,
            savetext: " Save",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: " Cancel",
            editParams: {
                keys: false,
                oneditfunc: function (formid) {

                  

                },
                url: null,
                successfunc: function (result) {


                    var res = JSON.stringify(result);
                    var response = JSON.parse(res);
                    var r = response.responseText;
                    var p = JSON.parse(r)
                    if (p.Status) {
                        toastr.success(p.Message);
                    }
                    else {
                        toastr.error(p.Message);
                    }
                    $("#jqgDepreciationMethod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST",
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    oneditfunc: null,
                    successfunc: function (result) {


                        var res = JSON.stringify(result);
                        var response = JSON.parse(res);
                        var r = response.responseText;
                        var p = JSON.parse(r)
                        if (p.Status) {
                            toastr.success(p.Message);
                        }
                        else {
                            toastr.error(p.Message);
                        }
                        $("#jqgDepreciationMethod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                    },
                }
            },
        });
}

function fnOnlyDigits(e) {
    //alert(JSON.stringify(e.which))
    if ((e.which < 48 || e.which > 57)) {
        if (e.which == 8 || e.which == 0 || e.which == 46) {
            return true;
        }
        else {
            return false;
        }
    }
}

function fnSaveAssetDepreciationMethod() {

    $("#btnDepreciationMethodSave").attr("disabled", true);
    var obj = [];
    var gvT = $('#jqgDepreciationMethod').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
                
        var dm = {
            AssetGroupID: $('#hdvAssetGroupId').val(),
            AssetSubGroupID: $('#hdvAssetSubGroupId').val(),
            DepreciationMethod: gvT[i]['DepreciationMethod'],
            EffectiveFrom: gvT[i]['EffectiveFrom'],
            DepreciationPercentage: gvT[i]['DepreciationPercentage'] = '' ? 0 : gvT[i]['DepreciationPercentage'],
            ActiveStatus: gvT[i]['ActiveStatus']
        }
        obj.push(dm);
    }
    $.ajax({
        url: getBaseURL() + '/FixedAssets/InsertDepreciationMethod',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        //async: false,
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                $('#PopupDepreciationMethod').modal('hide');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnDepreciationMethodSave").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDepreciationMethodSave").attr("disabled", false);
        }
    });

    $("#btnDepreciationMethodSave").attr("disabled", false);
}

$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgDepreciationMethod").jqGrid('editCell', 0, 0, false);

});

function SetGridControlByAction(jqg) {
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}