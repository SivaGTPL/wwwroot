$(document).ready(function () {
    fnGridLoadReferralDoctor();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnReferralDoctor",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditReferralDoctor(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditReferralDoctor(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditReferralDoctor(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
function fnGridLoadReferralDoctor() {
    $("#jqgReferralDoctor").jqGrid({
        //url:'',
        //mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DoctorShortName, localization.DoctorName, localization.Qualification, localization.Gender, localization.Active, localization.Actions],
        colModel: [
            { name: "DoctorShortName", width: 50, editable: true, align: 'left', hidden: false },
            { name: "DoctorName", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Qualification", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "Gender", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 15 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnReferralDoctor"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpReferralDoctor",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
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
        scrollOffset: 0, caption: 'Referral Doctor',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgReferralDoctor");
        },
    }).jqGrid('navGrid', '#jqpReferralDoctor', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpReferralDoctor', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshReferralDoctor
    }).jqGrid('navButtonAdd', '#jqpReferralDoctor', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddReferralDoctor
    });

}
function fnAddReferralDoctor() {
    $("#PopupReferralDoctor").modal('show');
}
function fnGridRefreshReferralDoctor() {

}
function fnEditReferralDoctor() {

    $("#PopupReferralDoctor").modal('show');
}