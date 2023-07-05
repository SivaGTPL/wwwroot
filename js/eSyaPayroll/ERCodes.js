
$(document).ready(function () {
    fnGridLoadERCodes();
});
var actiontype = "";
function fnGridLoadERCodes() {

    $("#jqgERCode").GridUnload();

    $("#jqgERCode").jqGrid({
        url: getBaseURL() + '/ERCodes/GetAllERCodes',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ERCode, localization.Description, localization.Active, localization.Actions],
        colModel: [
            { name: "Ercode", width: 40, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "Erdesc", width: 280, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 88, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditERCode(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditERCode(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ],
        
        pager: "#jqpERCode",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        loadComplete: function (data) {
            //SetGridControlByAction();
        },

    }).jqGrid('navGrid', '#jqpERCode', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpERCode', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshERCode
        }).jqGrid('navButtonAdd', '#jqpERCode', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddERCode
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgERCode"),
            newWidth = $grid.closest(".codetypecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddERCode() {
    _isInsert = true;
    fnClearERCodeFields(); 
    $('#PopupERCodes').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupERCodes').find('.modal-title').text(localization.AddERCode);
    $("#btnSaveERCode").html(localization.Save);
    $("#btnSaveERCode").attr("disabled", false);
}

function fnEditERCode(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgERCode').jqGrid('getRowData', rowid);
    $('#txtERCode').val(rowData.Ercode);
    $("#txtErCodeDescription").val(rowData.Erdesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    fnFillERCodes();
    $("#btnSaveERCode").attr("disabled", false);

    $("#txtERCode").attr("readonly", "readonly");
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        $('#PopupERCodes').modal('show');
        $('#PopupERCodes').find('.modal-title').text(localization.EditERCode);
        $("#btnSaveERCode").html(localization.Update);
        $("#chkActiveStatus").prop('disabled', false);
    }

    if (actiontype.trim() == "view") {
        $('#PopupERCodes').modal('show');
        $('#PopupERCodes').find('.modal-title').text(localization.ViewERCode);
        $("#btnSaveERCode").html(' Update');
        $("#btnSaveERCode").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveERCode").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupERCodes").on('hidden.bs.modal', function () {
            $("#btnSaveERCode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}


function fnFillERCodes() {
    $.ajax({
        url: getBaseURL() + '/ERCodes/GetERCodebyERCode',
        type: 'POST',
        data: {
            ERcode: $("#txtERCode").val()
        },
        success: function (result) {

            if (result != null) {
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result.l_ERCodeParameter);
            }
        }
    });
}

function fnSaveERCode() {
    if (IsStringNullorEmpty($("#txtERCode").val())) {
        toastr.warning("Please Enter the ER Code");
        return;
    }
    if (IsStringNullorEmpty($("#txtErCodeDescription").val())) {
        toastr.warning("Please Enter the ER Code Description");
        return;
    }
    var Params = eSyaParams.GetJSONValue();
    Er_code = {
        Ercode: $("#txtERCode").val() === '' ? 0 : $("#txtERCode").val(),
        Erdesc: $("#txtErCodeDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        l_ERCodeParameter: Params
    };

    $("#btnSaveERCode").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/ERCodes/InsertOrUpdateERCodes',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: Er_code },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveERCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupERCodes").modal('hide');
                fnClearERCodeFields();
                fnGridRefreshERCode();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveERCode").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveERCode").attr("disabled", false);
        }
    });
}

function fnGridRefreshERCode() {
    $("#jqgERCode").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearERCodeFields() {
    eSyaParams.ClearValue();
    $("#txtERCode").removeAttr("readonly");
    $("#txtERCode").val('');
    $("#txtErCodeDescription").val('');
    $("#chkActiveStatus").prop('disabled', false);
   
    
}

$("#btnCancelERCode").click(function () {
    $("#jqgERCode").jqGrid('resetSelection');
    $('#PopupERCodes').modal('hide');
    fnClearERCodeFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    var eleEnable = document.querySelectorAll('#jqgEdit');

    for (var i = 0; i < eleEnable.length; i++) {
        eleEnable[i].disabled = false;
    }
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}