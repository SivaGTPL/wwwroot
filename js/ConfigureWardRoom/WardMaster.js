$(document).ready(function () {
    fnGridLoadWardMaster();
    $.contextMenu({
        selector: "#btnWardMaster",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditWardMaster(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditWardMaster(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditWardMaster(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var actiontype = "";

function fnGridLoadWardMaster() {

    
    $("#jqgWardMaster").jqGrid('GridUnload');
    $("#jqgWardMaster").jqGrid({
        url: getBaseURL() + '/WardMaster/GetAllWards',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.WardId, localization.WardShortDesc, localization.WardDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "WardId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "WardShortDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "WardDesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnWardMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpWardMaster",
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
        scrollOffset: 0,
        caption: 'Ward Master',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgWardMaster");
        },
    }).jqGrid('navGrid', '#jqpWardMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpWardMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshWardMaster
        }).jqGrid('navButtonAdd', '#jqpWardMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddWardMaster
    });
    fnAddGridSerialNoHeading();
}

var _isInsert = true;

function fnAddWardMaster() {
    _isInsert = true;
    fnClearFields();
    $('#PopupWardMaster').modal('show');
    $('#PopupWardMaster').modal({ backdrop: 'static', keyboard: false });
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $('#PopupWardMaster').find('.modal-title').text(localization.AddWardMaster);
    $("#btnSaveWardMaster").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveWardMaster").show();
    $("#btndeActiveWardMaster").hide();
    $('#txtWardId').val('');
}

function fnEditWardMaster(e, actiontype) {
    var rowid = $("#jqgWardMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgWardMaster').jqGrid('getRowData', rowid);

    $('#PopupWardMaster').modal('show');
    $('#txtWardId').val(rowData.WardId);
    $('#txtWardShortDesc').val(rowData.WardShortDesc);
    $('#txtWardDescription').val(rowData.WardDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkActiveStatus").prop('disabled', true);

    $("#btnSaveWardMaster").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupWardMaster').find('.modal-title').text(localization.UpdateWardMaster);
        $("#btnSaveWardMaster").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveWardMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveWardMaster").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#btnSaveWardMaster').find('.modal-title').text(localization.ViewWardMaster);
        $("#btnSaveWardMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveWardMaster").hide();
        $("#btndeActiveWardMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupWardMaster").on('hidden.bs.modal', function () {
            $("#btnSaveWardMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupWardMaster').find('.modal-title').text("Activate/De Activate Ward Master");
        $("#btnSaveWardMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveWardMaster").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveWardMaster").html(localization.DActivate);
        }
        else {
            $("#btndeActiveWardMaster").html(localization.Activate);
        }

        $("#btndeActiveWardMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupWardMaster").on('hidden.bs.modal', function () {
            $("#btnSaveWardMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshWardMaster() {
    $("#jqgWardMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveWardMaster() {

    if (IsStringNullorEmpty($("#txtWardShortDesc").val())) {
        toastr.warning("Please Enter the Ward Short Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtWardDescription").val())) {
        toastr.warning("Please Enter the Ward Description");
        return;
    }
    objward = {
        WardId: $("#txtWardId").val() === '' ? 0 : $("#txtWardId").val(),
        WardShortDesc: $("#txtWardShortDesc").val(),
        WardDesc: $("#txtWardDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveWardMaster").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/WardMaster/InsertOrUpdateWardMaster',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objward },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveWardMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupWardMaster").modal('hide');
                fnClearFields();
                fnGridRefreshWardMaster();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveWardMaster").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveWardMaster").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#txtWardId").val("");
    $("#txtWardShortDesc").val("");
    $("#txtWardDescription").val("");
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveWardMaster").attr('disabled', false);
    $("#btndeActiveWardMaster").attr('disabled', false);
}

$("#btnCancelWardMaster").click(function () {
    $("#jqgWardMaster").jqGrid('resetSelection');
    $('#PopupWardMaster').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteWardMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveWardMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/WardMaster/ActiveOrDeActiveWardMaster?status=' + a_status + '&wardId=' + $("#txtWardId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveWardMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupWardMaster").modal('hide');
                fnClearFields();
                fnGridRefreshWardMaster();
                $("#btndeActiveWardMaster").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveWardMaster").attr("disabled", false);
                $("#btndeActiveWardMaster").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveWardMaster").attr("disabled", false);
            $("#btndeActiveWardMaster").html('De Activate');
        }
    });
}