var actiontype = "";

$(document).ready(function () {
    fnLoadGridERRates();
});

function fnLoadGridERRates() {

    $("#jqgERRates").jqGrid('GridUnload');

    $("#jqgERRates").jqGrid({
        url: getBaseURL() + '/ERCodes/GetERRatesbyERCode?ERCode=' + $("#cboCodes").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ERCode, localization.ERDescription, localization.EffectiveFrom, localization.EffectiveTill, localization.RangeFrom, localization.RangeTill, localization.AmountToDeduct, localization.Status, localization.Actions,],
        colModel: [
            { name: "Ercode", width: 50, editable: true, align: 'left', hidden: false },
            { name: "Erdesc", width: 70, editable: true, align: 'left', hidden: false },
            //{ name: "EffectiveFrom", editable: true, width: 70, align: 'left', formatter: 'date' },
            //{ name: "EffectiveTill", editable: true, width: 70, align: 'left', formatter: 'date' },
            {
                name: 'EffectiveFrom', width: 70, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'EffectiveTill', width: 70, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "RangeFrom", width: 50, editable: true, align: 'left', hidden: false },
            { name: "RangeTill", width: 50, editable: true, align: 'left', hidden: false },
            { name: "AmountToDeduct", width: 60, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditERRates(event,\'edit\')"><i class="fas fa-pencil-alt"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditERRates(event,\'view\')"><i class="far fa-file-alt"></i>' + localization.View + '</button>'

                }
            }
        ], 
        pager: "#jqpERRates",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        .jqGrid('navGrid', '#jqpERRates', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpERRates', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshERRates
        })
        .jqGrid('navButtonAdd', '#jqpERRates', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddERRates
        });

    fnAddGridSerialNoHeading();
}

function fnGridRefreshERRates() {
    $("#jqgERRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddERRates() {
    fnClearERRatesFields();
    $('#PopupERRates').find('.modal-title').text(localization.AddERRates);
    $('#PopupERRates').modal('show');
    $("#btnSaveERates").attr("disabled", false);
    $("#btnSaveERates").html(localization.Save);
    $("#btnSaveERates").show();
    $("#chkActiveStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnSaveERRates() {
    if (IsValidERRates() === false) {
        return;
    }
    var obj = {
        Ercode: $("#cboERcodes").val(),
        EffectiveFrom: $("#dtEffectivefrom").val(),
        EffectiveTill: $("#dtEffectivetill").val(),
        RangeFrom: $("#txtRangefrom").val(),
        RangeTill: $("#txtRangetill").val(),
        AmountToDeduct: $("#txtAmounttoDeduct").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")

    };
    $("#btnSaveERates").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/ERCodes/InsertOrUpdateERRates',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupERRates').modal('hide');
                fnGridRefreshERRates();
                $("#btnSaveERates").attr('disabled', false);
                fnClearERRatesFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveERates").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveERates").attr('disabled', false);
        }
    });

}

function IsValidERRates() {

    if ($("#cboERcodes").val() == 0 || $("#cboErcode").val() == "0") {
        toastr.warning("Please select a ER Code");
        return false;
    }
    if (IsStringNullorEmpty($("#dtEffectivefrom").val())) {
        toastr.warning("Please Select a Effective From Date");
        return false;
    }
    if (IsStringNullorEmpty($("#txtRangefrom").val())) {
        toastr.warning("Please Enter the Range From");
        return false;
    }
    if (IsStringNullorEmpty($("#txtRangetill").val())) {
        toastr.warning("Please Enter the Range Till");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAmounttoDeduct").val())) {
        toastr.warning("Please Enter the Amount to Deduct");
        return false;
    }
}

function fnEditERRates(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgERRates').jqGrid('getRowData', rowid);

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

    $("#txtRangefrom").val(rowData.RangeFrom);

    $("#txtRangetill").val(rowData.RangeTill);

    $("#txtAmounttoDeduct").val(rowData.AmountToDeduct);
  
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveERates").attr("disabled", false);
    $('#PopupERRates').modal('show');

    if (actiontype.trim() == "edit") {
        $('#PopupERRates').find('.modal-title').text(localization.UpdateERRates);
        $("#btnSaveERates").show();
        $("#dtEffectivetill").prop('disabled', false);
        $("#btnSaveERates").html(localization.Update);
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);

    }

    if (actiontype.trim() == "view") {
        $('#PopupERRates').find('.modal-title').text(localization.ViewERRates);
        $("#btnSaveERates").hide();
        $("#dtEffectivetill").prop('disabled', true);
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("#cboERcodes").prop('disabled', true).selectpicker('refresh');
    }

}

function fnClearERRatesFields() {
    $('#cboERcodes').val('0').selectpicker('refresh');
    $('#cboERcodes').prop('disabled', false).selectpicker('refresh');
    $("#dtEffectivefrom").val('');
    $("#dtEffectivefrom").prop('disabled', false);
    $("#dtEffectivetill").prop('disabled', false);
    $("#dtEffectivetill").val('');
    $("#txtRangefrom").val('');
    $("#txtRangetill").val('');
    $("#txtAmounttoDeduct").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveERates").attr("disabled", false);
    $("#btnSaveERates").html('Save');
}

$("#btnCancelERRates").click(function () {
    $("#PopupERRates").jqGrid('resetSelection');
    $('#PopupERRates').modal('hide');
    fnClearERRatesFields();
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