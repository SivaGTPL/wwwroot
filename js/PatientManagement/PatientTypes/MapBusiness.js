$(function () {
    fnLoadMapBusiness();
})
function fnLoadMapBusiness() {
    $("#jqgMapBusiness").jqGrid('GridUnload');
    $("#jqgMapBusiness").jqGrid({
        url: getBaseURL() + '' ,
        datatype: 'local',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.PatientType, localization.PatientCategory, localization.Select],

        colModel: [

            { name: "PatientType", width: 150, editable: false, align: 'left', hidden: false },
            { name: "PatientCategory", width: 150, editable: false, align: 'left' },
            {
                name: "Select", width: 50, editable: false, align: 'center', hidden: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }
            },
            
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpMapBusiness",
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

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgMapBusiness").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpMapBusiness', { add: false, edit: false, search: false, del: false, refresh: false });


    $("#jqgMapBusiness").jqGrid('inlineNav', '#jqpMapBusiness',
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