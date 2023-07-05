var actiontype = "";

$(document).ready(function () {
    fnLoadGridERRules();
});

function fnLoadGridERRules() {

    $("#jqgERRules").jqGrid('GridUnload');

    $("#jqgERRules").jqGrid({
        url: getBaseURL() + '/ERCodes/GetERRulesbyERCode?ERCode=' + $("#cboCodes").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ERCode, localization.ERDescription, localization.EffectiveFrom, localization.EffectiveTill, localization.PayRule, localization.PayRuleDescription, localization.IsRuleBased, localization.Status, localization.Actions],
        colModel: [
            { name: "Ercode", width: 50, editable: true, align: 'left', hidden: false },
            { name: "Erdesc", width: 70, editable: true, align: 'left', hidden: false },
            //{ name: "EffectiveFrom", editable: true, width: 90, align: 'left', formatter: 'date' },
            //{ name: "EffectiveTill", editable: true, width: 90, align: 'left', formatter: 'date' },
            {
                name: 'EffectiveFrom', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'EffectiveTill', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "PayRule", width: 70, editable: true, align: 'left', hidden: true },
            { name: "PayRuleDesc", width: 70, editable: true, align: 'left', hidden: true },
            { name: "IsRuleBased", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
           
            {
                name: 'edit', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditERRules(event,\'edit\')"><i class="fas fa-pencil-alt"></i>' +localization.Edit+ '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditERRules(event,\'view\')"><i class="far fa-file-alt"></i>' + localization.View + ' </button>'

                }
            }
        ],
        pager: "#jqpERRules",
        rowNum: 10,
        rownumWidth: 55,
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
        forceFit: true,
        scrollOffset: 0,
        loadComplete: function (data) {
            //SetGridControlByAction();
        },
    })
        .jqGrid('navGrid', '#jqpERRules', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpERRules', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshERRules
        })
        .jqGrid('navButtonAdd', '#jqpERRules', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddERRules
        });

    fnAddGridSerialNoHeading();
}

function fnGridRefreshERRules() {
    $("#jqgERRules").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddERRules() {
    fnClearERRulesFields();
    $('#PopupERRules').find('.modal-title').text(localization.AddERRules);
    $('#PopupERRules').modal('show');
    $("#btnSaveERrule").attr("disabled", false);
    $("#btnSaveERrule").html(localization.Save);
    $("#btnSaveERrule").show();
    $("#chkIsRulebased").prop('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnSaveERRules() {
    if (IsValidERRules() === false) {
        return;
    }
    var obj = {
        Ercode: $("#cboERcodes").val(),
        EffectiveFrom: $("#dtEffectivefrom").val(),
        EffectiveTill: $("#dtEffectivetill").val(),
        PayRule: $("#txtPayrule").val(),
        PayRuleDesc: $("#txtPayruledescription").val(),
        IsRuleBased: $("#chkIsRulebased").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")

    };
    $("#btnSaveERrule").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/ERCodes/InsertOrUpdateERRules',
        type: 'POST',
        datatype: 'json',
        data: { obj},
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupERRules').modal('hide');
                fnGridRefreshERRules();
                $("#btnSaveERrule").attr('disabled', false);
                fnClearERRulesFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveERrule").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveERrule").attr('disabled', false);
        }
    });

}

function IsValidERRules() {

    if ($("#cboERcodes").val() == 0 || $("#cboErcode").val() == "0") {
        toastr.warning("Please select a ER Code");
        return false;
    }
    if (IsStringNullorEmpty($("#dtEffectivefrom").val())) {
        toastr.warning("Please Select a Effective From Date");
        return false;
    }
}

function fnEditERRules(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgERRules').jqGrid('getRowData', rowid);

    $("#cboERcodes").val(rowData.Ercode).selectpicker('refresh');
    $('#cboERcodes').prop('disabled', true).selectpicker('refresh');
    
    if (rowData.EffectiveFrom !== null) {
        //setDate($('#dtEffectivefrom'), rowData.EffectiveFrom);
        setDate($('#dtEffectivefrom').val(rowData.EffectiveFrom));
    }
    else {
        $('#dtEffectivefrom').val('');
    }

    $("#dtEffectivefrom").prop('disabled', true);

    if (rowData.EffectiveTill !== null) {
        //setDate($('#dtEffectivetill'), rowData.EffectiveTill);
        setDate($('#dtEffectivetill').val(rowData.EffectiveTill));
    }
    else {
        $('#dtEffectivetill').val('');
    }

    $("#txtPayrule").val(rowData.PayRule);

    $("#txtPayruledescription").val(rowData.PayRuleDesc);

    if (rowData.IsRuleBased == 'true') {
        $("#chkIsRulebased").parent().addClass("is-checked");
    }
    else {
        $("#chkIsRulebased").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveERrule").attr("disabled", false);
    $('#PopupERRules').modal('show');

    if (actiontype.trim() == "edit") {
        $('#PopupERRules').find('.modal-title').text(localization.UpdateERRules);
        $("#btnSaveERrule").show();
        $("#dtEffectivetill").prop('disabled', false);
        $("#btnSaveERrule").html(localization.Update);
        $("#chkIsRulebased").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);

    }

    if (actiontype.trim() == "view") {
        $('#PopupERRules').find('.modal-title').text(localization.ViewERRules);
        $("#btnSaveERrule").hide();
        $("#dtEffectivetill").prop('disabled', true);
        $("#chkIsRulebased").prop('disabled', true);
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("#cboERcodes").prop('disabled', true).selectpicker('refresh');
    }

}

function fnClearERRulesFields() {
    $('#cboERcodes').val('0').selectpicker('refresh');
    $('#cboERcodes').prop('disabled', false).selectpicker('refresh');
    $("#dtEffectivefrom").val('');
    $("#dtEffectivefrom").prop('disabled', false);
    $("#dtEffectivetill").prop('disabled', false);
    $("#dtEffectivetill").val('');
    $("#txtPayrule").val('');
    $("#txtPayruledescription").val('');
    $("#chkIsRulebased").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveERrule").attr("disabled", false);
    $("#btnSaveERrule").html('Save');
}

$("#btnCancelERRule").click(function () {
    $("#PopupERRules").jqGrid('resetSelection');
    $('#PopupERRules').modal('hide');
    fnClearERRulesFields();
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

$("#txtPayrule").on("dblclick", function () {
    $('#PopupERCodes').find('.modal-title').text('Formula Description');
    $("#PopupERCodes").modal('show');
});

function fnAddERCodeToPayRuleFormula() {
    var formula = $('#txtPayrule').val();
    if ($("#cboPopupERCode").val() !== "0") {
        $('#txtPayrule').val(formula +' '+ $('#cboPopupERCode').val());
        $('#txtPayruledescription').val(formula +' '+ $('#cboPopupERCode option:selected').text());
        $('#PopupERCodes').modal('hide');
    } else {
        toastr.warning("Please select ER Code");
    }      
}