$(document).ready(function () {
    fnGridLoadScheduleOfchargesWardView();
});

function fnGridLoadScheduleOfchargesWardView() {


    $("#jqgScheduleOfchargesWardView").jqGrid('GridUnload');
    $("#jqgScheduleOfchargesWardView").jqGrid({
        //url: '',
        datatype: 'local',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.WardDesc, localization.RoomDesc, localization.RateType,localization.IPRate, localization.DCRate, localization.EffectiveFrom, localization.EffectiveTill, localization.Active],
        colModel: [
            { name: "WardDesc", width: 180, editable: false, align: 'left', hidden: true },
            { name: "RoomDesc", width: 180, editable: false, hidden: true, align: 'left'},
            { name: "RateType", width: 70, editable: false, align: 'left', resizable: false },
            { name: "IPRate", width: 70, editable: false, align: 'left', resizable: false },
            { name: "DCRate", width: 70, editable: false, align: 'left', resizable: false },
            { name: "EffectiveFrom", width: 70, editable: true, align: 'left', resizable: false, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat } },
            { name: "EffectiveTill", width: 70, editable: true, align: 'left', resizable: false, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

        ],
        pager: "#jqpScheduleOfchargesWardView",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        editurl: getBaseURL() + '',
        scrollOffset: 0,
        caption: 'Schedule Of charges',
        ajaxRowOptions: {
            type: "POST",
            //contentType: "application/json",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            postData.BusinessKey = $("#cboBusinessKey").val();
            //return JSON.stringify(postData);
            return (postData);
        },
        ondblClickRow: function (rowid) {
            $("#jqgBusinessStatutoryDetails_iledit").trigger('click');
        },
        beforeSubmit: function (postdata, formid) {
            return [success, message];
        },
        loadComplete: function (data) {
            // SetGridControlByAction();
            fnJqgridSmallScreen("jqgScheduleOfchargesWardView");
        },
    }).jqGrid('navGrid', '#jqpScheduleOfchargesWardView', { add: false, edit: false, search: false, del: false, refresh: false });

    $("#jqgScheduleOfchargesWardView").jqGrid('inlineNav', '#jqpScheduleOfchargesWardView',
        {
            edit: true,
            editicon: " fa fa-pen",
            edittext: "Edit",
            add: true,
            addicon: "fa fa-plus",
            addtext: "Add",
            save: true,
            savetext: "Save",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: "Cancel",
            editParams: {
                keys: false,
                oneditfunc: function (formid) {
                    $("#" + formid + "_StatutoryCode").prop('disabled', true);
                },
                url: null,
                extraparam: {
                },
                successfunc: function (result) {
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST"
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    url: null,
                    extraparam: {
                    },
                    oneditfunc: function (rowid) {
                    },
                    successfunc: function (result) {
                    },
                },
            }
        });
    fnAddGridSerialNoHeading();
}