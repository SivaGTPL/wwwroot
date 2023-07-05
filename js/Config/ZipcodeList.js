$(function () {
    fnGridLoadZipcodeList();
    $.contextMenu({
        selector: "#btnZipcodeList",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditZipcodeList(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditZipcodeList(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditZipcodeList(event, 'delete') } },
        }
    });
});

function fnGridLoadZipcodeList() {
    $("#jqgZipcodeList").jqGrid('GridUnload');
    $("#jqgZipcodeList").jqGrid({
        // url:'',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.StateCode, localization.ZipcodeCode, localization.ZipcodeDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "ISDCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "StateCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ZipcodeCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ZipcodeDesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnZipcodeList"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpZipcodeList",
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumWidth: '55',
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
        scrollOffset: 0, caption: 'Zipcode List',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgZipcodeList");
        },
    }).jqGrid('navGrid', '#jqpZipcodeList', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpZipcodeList', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshZipcodeList
    }).jqGrid('navButtonAdd', '#jqpZipcodeList', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddZipcodeList
    });
    fnAddGridSerialNoHeading();
}
function fnAddZipcodeList() {
    fnClearFields();
    $('#PopupZipcodeList').modal('show');
    $('#PopupZipcodeList').modal({ backdrop: 'static', keyboard: false });
    $('#PopupZipcodeList').find('.modal-title').text(localization.AddZipcodeList);
}
function fnEditZipcodeList(e, actiontype) {
    var rowid = $("#jqgZipcodeList").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgZipcodeList').jqGrid('getRowData', rowid);

    $('#txtZipcodeShortDesc').val(rowData.ZipcodeShortDesc);
    $('#txtZipcodeDescription').val(rowData.ZipcodeDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveZipcodeList").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        $('#PopupZipcodeList').modal('show');
        $('#PopupZipcodeList').find('.modal-title').text(localization.UpdateZipcodeList);
    }
    if (actiontype.trim() == "view") {
        $('#PopupZipcodeList').modal('show');
        $('#PopupZipcodeList').find('.modal-title').text(localization.ViewZipcodeList);
    }
}
function fnGridRefreshZipcodeList() {
    $("#jqgZipcodeList").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnClearFields() {
    $("#txtZipcodeShortDesc").val("");
    $("#txtZipcodeDescription").val("");
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveZipcodeList").attr('disabled', false);
}