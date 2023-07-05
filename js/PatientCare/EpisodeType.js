var actiontype = "";
var _isInsert = true;

$(function () {
    fnGridLoadEpisodeType();
    $.contextMenu({
        selector: "#btnEpisodeType",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditEpisodeType(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditEpisodeType(event, 'view') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnGridLoadEpisodeType() {
    
    $("#jqgEpisodeType").jqGrid('GridUnload');
    $("#jqgEpisodeType").jqGrid({
        url: getBaseURL() + '/EpisodeList/GetAllEpisodeList',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.EpisodeID, localization.EpisodeDesc, localization.TokenType, localization.Sequence, localization.AllowConsultation, localization.TokenStatus, localization.DefaultEpisode, localization.ActiveStatus, localization.Actions],
        colModel: [
            { name: "EpisodeId", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "EpisodeDesc", width: 120, editable: true, align: 'left', resizable: false, hidden: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "TokenType", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Sequence", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AllowConsultation", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "TokenStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false"}, formatoptions: { disabled: true } },
            { name: "DefaultEpisode", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false"}, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", default: true }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEpisodeType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEpisodeType",
        rowNum: 100000,
        pgtext:null,
        pgbuttons: false,
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
        scrollOffset: 0, caption: localization.EpisodeType,
        loadComplete: function () {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgEpisodeType");

        },
    }).jqGrid('navGrid', '#jqpEpisodeType', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEpisodeType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEpisodeType
    }).jqGrid('navButtonAdd', '#jqpEpisodeType', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEpisodeType
    });
    fnAddGridSerialNoHeading();
}

function fnAddEpisodeType() {
    _isInsert = true;
    fnClearFields();
    $('#PopupEpisodeType').find('.modal-title').text(localization.AddEpisodeType);
    $("#PopupEpisodeType").modal('show');
    $("#btnSaveEpisodeType").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveEpisodeType").show();
    $("#btnSaveEpisodeType").attr("disabled", false);
}

function fnEditEpisodeType(e, actiontype) {
    var rowid = $("#jqgEpisodeType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEpisodeType').jqGrid('getRowData', rowid);

    fnClearFields();

    $("#txtEpisodeId").val(rowData.EpisodeId);
    $("#txtEpisodeDesc").val(rowData.EpisodeDesc);
    $("#txtSequence").val(rowData.Sequence);
    $("#txtTokenType").val(rowData.TokenType);

    if (rowData.AllowConsultation == 'true') {
        $("#chkAllowConsultation").parent().addClass("is-checked");
    }
    else {
        $("#chkAllowConsultation").parent().removeClass("is-checked");
    }
    if (rowData.TokenStatus == 'true') {
        $("#chkTokenStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkTokenStatus").parent().removeClass("is-checked");
    }
    if (rowData.DefaultEpisode == 'true') {
        $("#chkDefaultEpisode").parent().addClass("is-checked");
    }
    else {
        $("#chkDefaultEpisode").parent().removeClass("is-checked");
    }
    _isInsert = false;
    $("#btnSaveEpisodeType").attr("disabled", false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not Authorized to Edit");
            return;
        }
        $('#PopupEpisodeType').modal('show');
        $('#PopupEpisodeType').find('.modal-title').text(localization.UpdateEpisodeType);
        $("#btnSaveEpisodeType").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveEpisodeType").attr("disabled", false);
        $("#chkTokenStatus").prop('disabled', false);
        $("#chkAllowConsultation").prop('disabled', false);
        $("#chkDefaultEpisode").prop('disabled', false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupEpisodeType').modal('show');
        $('#PopupEpisodeType').find('.modal-title').text(localization.ViewEpisodeType);
        $("#btnSaveEpisodeType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveEpisodeType").hide();
        $("#chkTokenStatus").prop('disabled', true);
        $("#chkAllowConsultation").prop('disabled', true);
        $("#chkDefaultEpisode").prop('disabled', true);

        $("#PopupEpisodeType").on('hidden.bs.modal', function () {
            $("#btnSaveEpisodeType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshEpisodeType() {
    $("#jqgEpisodeType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnClearFields() {
    $("#txtEpisodeId").val('');
    $("#txtEpisodeDesc").val('');
    $("#txtSequence").val('');
    $("#txtTokenType").val('');
    $("#chkAllowConsultation").parent().removeClass("is-checked");
    $("#chkTokenStatus").parent().removeClass("is-checked");
    $("#chkDefaultEpisode").parent().removeClass("is-checked");
    $("#chkTokenStatus").prop('disabled', false);
    $("#chkAllowConsultation").prop('disabled', false);
    $("#chkDefaultEpisode").prop('disabled', false);
}

$("#btnCancelEpisodeType").click(function () {
    $("#jqgEpisodeType").jqGrid('resetSelection');
    $('#PopupEpisodeType').modal('hide');
    fnClearFields();
});

function fnSaveEpisodeType() {
    if (IsStringNullorEmpty($("#txtEpisodeDesc").val())) {
        toastr.warning("Please Enter the Episode Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtSequence").val())) {
        toastr.warning("Please Enter the Sequence");
        return;
    }
    if (IsStringNullorEmpty($("#txtTokenType").val())) {
        toastr.warning("Please Enter the Token Type");
        return;
    }
    obj_et = {
        EpisodeId: $("#txtEpisodeId").val() === '' ? 0 : $("#txtEpisodeId").val(),
        EpisodeDesc: $("#txtEpisodeDesc").val(),
        Sequence: $("#txtSequence").val(),
        AllowConsultation: $("#chkAllowConsultation").parent().hasClass("is-checked"),
        TokenType: $("#txtTokenType").val(),
        TokenStatus: $("#chkTokenStatus").parent().hasClass("is-checked"),
        DefaultEpisode: $("#chkDefaultEpisode").parent().hasClass("is-checked"),
        ActiveStatus: true,
    }
    $("#btnSaveEpisodeType").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/EpisodeList/InsertOrUpdateEpisodeList',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_et },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveEpisodeType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupEpisodeType").modal('hide');
                fnGridRefreshEpisodeType();
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveEpisodeType").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEpisodeType").attr("disabled", false);
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}