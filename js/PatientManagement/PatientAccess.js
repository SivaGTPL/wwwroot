var actiontype = "";
var _isInsert = true;

$(function () {
    fnGridLoadPatientAccess();
    $.contextMenu({
        selector: "#btnPatientAccess",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPatientAccess(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPatientAccess(event, 'view') } },

       }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");

});

function fnGridLoadPatientAccess() {

    $("#jqgPatientAccess").jqGrid('GridUnload');

    $("#jqgPatientAccess").jqGrid({

        url: getBaseURL() + '/PatientAccess/GetPatientAccessbyISDCode?isdCode=' + $("#cboISDCode").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.AccessID, localization.AccessDesc, localization.AccessIDPattern, localization.DefaultAccess, localization.Status, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "AccessId", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "AccessDesc", width: 120, editable: true, align: 'left', resizable: false, hidden: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "AccessIdpattern", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DefaultAccess", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", default: true }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false",default:true }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPatientAccess"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpPatientAccess",
        rowNum: 100000,
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
        scrollOffset: 0, caption: 'Patient Access',
        loadComplete: function () {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgPatientAccess");

        },
    }).jqGrid('navGrid', '#jqpPatientAccess', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpPatientAccess', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientAccess
        }).jqGrid('navButtonAdd', '#jqpPatientAccess', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPatientAccess
    });
    fnAddGridSerialNoHeading();
}

function fnISDCountryCode_onChange() {

    fnGridLoadPatientAccess();
}

function fnAddPatientAccess() {
   
    var Isdcode = $("#cboISDCode").val();
    if (Isdcode == "" || Isdcode == null || Isdcode == 0 || Isdcode=='0') {
        toastr.warning("Please Select ISD Code to Add");
        return;
    }
    else
    {
        _isInsert = true;
        fnClearFields();
        $("#PopupPatientAccess").modal('show');
        $('#PopupCareCardRates').modal({ backdrop: 'static', keyboard: false });
        $('#PopupCareCardRates').find('.modal-title').text(localization.AddPatientAccess);
        $("#chkDefaultAccess").parent().removeClass("is-checked");
        $("#chkDefaultAccess").prop('disabled', false);
        $("#btnSavePatientAccess").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSavePatientAccess").show();

    }
   
}

function fnSavePatientAccess() {

    if ($("#cboISDCode").val() === 0 || $("#cboISDCode").val() === "0" || IsStringNullorEmpty($("#cboISDCode").val())) {
        toastr.warning("Please Select ISD Code");
        return;
    }
    if (IsStringNullorEmpty($("#txtAccessDesc").val())) {
        toastr.warning("Please Enter Access Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtAccessPattern").val())) {
        toastr.warning("Please Enter Access Pattern");
        return;
    }
    obj_pa = {
        Isdcode: $("#cboISDCode").val(),
        AccessId: $("#txtAccessID").val() === '' ? 0 : $("#txtAccessID").val(),
        AccessDesc: $("#txtAccessDesc").val(),
        AccessIdpattern: $("#txtAccessPattern").val(),
        DefaultAccess: $("#chkDefaultAccess").parent().hasClass("is-checked"),
        ActiveStatus: true
    };

    $("#btnSavePatientAccess").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PatientAccess/InsertOrUpdatePatientAccess',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_pa },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePatientAccess").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPatientAccess").modal('hide');
                fnGridRefreshPatientAccess();
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePatientAccess").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePatientAccess").attr("disabled", false);
        }
    });
}

function fnGridRefreshPatientAccess() {

    $("#jqgPatientAccess").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditPatientAccess(e, actiontype) {
    var rowid = $("#jqgPatientAccess").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPatientAccess').jqGrid('getRowData', rowid);

    $('#txtAccessID').val(rowData.AccessId);
    $('#txtAccessDesc').val(rowData.AccessDesc);
    $('#txtAccessPattern').val(rowData.AccessIdpattern);
    if (rowData.DefaultAccess == 'true') {
        $("#chkDefaultAccess").parent().addClass("is-checked");
    }
    else {
        $("#chkDefaultAccess").parent().removeClass("is-checked");
    }
    $("#btnSavePatientAccess").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not Authorized to Edit");
            return;
        }
        $('#PopupPatientAccess').modal('show');
        $('#PopupPatientAccess').find('.modal-title').text(localization.UpdatePatientAccess);
        $("#btnSavePatientAccess").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#chkDefaultAccess").prop('disabled', false);
        $("#btnSavePatientAccess").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupPatientAccess').modal('show');
        $('#PopupPatientAccess').find('.modal-title').text(localization.ViewPatientAccess);
        $("#btnSavePatientAccess").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePatientAccess").hide();
        $("#chkDefaultAccess").prop('disabled', true);
        $("#PopupPatientAccess").on('hidden.bs.modal', function () {
            $("#btnSavePatientAccess").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnClearFields() {
    $("#txtAccessID").val('');
    $("#txtAccessDesc").val('');
    $('#txtAccessPattern').val('');
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePatientAccess").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#chkDefaultAccess").parent().removeClass("is-checked");
    $("#chkDefaultAccess").prop('disabled', false);
}

$("#btnCancelPatientAccess").click(function () {
    $("#jqgPatientAccess").jqGrid('resetSelection');
    $('#PopupPatientAccess').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

