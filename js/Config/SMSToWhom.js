$(document).ready(function () {
    fnGridSMSToWhom();
    fneSyaParameter();
});

function fnGridSMSToWhom() {
    $("#jqgSMSToWhom").jqGrid('GridUnload');
    $("#jqgSMSToWhom").jqGrid({
        //url:,
        // mtype: 'Post',
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["SMS ID", "SMS Description", "SMS Statement", "Status", "Select"],
        colModel: [
            { name: "SMSID", width: 70, editable: true, align: 'left' },
            { name: "SMSDescription", width: 270, editable: false, align: 'left', resizable: true },
            { name: "SMSStatement", width: 105, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
             { name: "ActiveStatus", editable: true, width: 48, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            { name: "Select", width: 70, editable: true, align: 'left', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

        ],
        pager: "#jqpSMSToWhom",
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
        scrollOffset: 0,
        caption: 'SMS To Whom',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgSMSToWhom");
        },
    }).jqGrid('navGrid', '#jqpSMSToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAdd
        }); fnAddGridSerialNoHeading();
}
function fnAdd() {
    $("#PopupSMSToWhom").modal("show");
    fnGridSMSRecipient();
}
function fnGridRefresh() {

}
function fneSyaParameter() {

    $("#jqgSpecialtyParameter").jqGrid({
        //url:
        datatype: 'local',
        data: [{ ActionDesc: 'Is Inspection Reqd', ActiveStatus: true }, { ActionDesc: 'Is Saleable', ActiveStatus: true }, { ActionDesc: 'Is Rate Contract item', ActiveStatus: false }, { ActionDesc: 'Is Batch Applicable', ActiveStatus: false }],
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Action ID", "Parameter", "Status"],
        colModel: [
            { name: 'ActionID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ActionDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", formatoptions: { disabled: false } }
        ],
        caption: "Specialty Parameter",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,

    });
}

function fnGridSMSRecipient() {
    $("#jqgSMSRecipient").jqGrid('GridUnload');
    $("#jqgSMSRecipient").jqGrid({
        //url:,
        // mtype: 'Post',
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Recipient Name", "Mobile No", "Remarks", "Status"],
        colModel: [
            { name: "RecipientName", width: 70, editable: true, align: 'left' },
            { name: "MobileNo", width: 270, editable: false, align: 'left', resizable: true },
            { name: "Remarks", width: 105, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
         ],
        pager: "#jqpSMSRecipient",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0, caption:'SMS Recipient',
    }).jqGrid('navGrid', '#jqpSMSRecipient', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSRecipient', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresh
        }).jqGrid('navButtonAdd', '#jqpSMSRecipient', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAdd
    });
}