$(document).ready(function () {
    $('#cboCountryCode').selectpicker('refresh');
    $('#cboTaxDescription').selectpicker('refresh');
    $("#lblCategoryPerc").text(localization.SplitPercentage);
    fnLoadCboTaxCodes();
});

function fnLoadCboTaxCodes() {
    $('#cboTaxDescription').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Country/GetTaxCodeByISDCode?ISDCode=' + $('#cboCountryCode').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $('#cboTaxDescription').empty();
            $("#cboTaxDescription").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboTaxDescription").append($("<option></option>").val(result[i]["TaxCode"]).html(result[i]["TaxDescription"]));
                }
            }
            $('#cboTaxDescription').val($("#cboTaxDescription option:first").val());
            $('#cboTaxDescription').selectpicker('refresh');
            fnGridLoadTaxCodeRules();
        }
    });
}

function fnGridLoadTaxCodeRules() {
    var ISDCode = $("#cboCountryCode").val();
    var TaxCode = $("#cboTaxDescription").val();
    var URL = getBaseURL() + '/Country/GetTaxRuleByISDandTaxCode?ISDCode=' + ISDCode + "&TaxCode=" + TaxCode;
    $("#jqgTaxCodeRules").jqGrid('GridUnload');
    $("#jqgTaxCodeRules").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["ISD Code", "Tax Code", "Serial Number", "Tax Short Code", localization.TaxDescription, localization.SlaborPercentage, localization.IsSplitApplicable, localization.TaxPercentage, localization.Active, localization.Actions],
        colModel: [
            { name: "ISDCode", width: 30, editable: true, align: 'left', hidden: true },
            { name: "TaxCode", width: 30, editable: false, hidden: false, align: 'left', resizable: true, hidden: true },
            { name: "SerialNumber", width: 30, editable: true, align: 'left', hidden: true },
            { name: "TaxShortCode", width: 30, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 }, hidden: true},
            { name: "TaxDescription", editable: true, width: 125, align: 'left', resizable: false },
            { name: "SlabOrPerc", editable: true, width: 25, align: 'left', resizable: false },
            { name: "IsSplitApplicable", editable: true, width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "SplitCategoryPerc", editable: true, width: 25, align: 'left', resizable: false },
            { name: "ActiveStatus", editable: true, width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditTaxRule(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'
                        + '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id="jqgView" onclick="return fnViewTaxRule(event)"> <i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnDeletePopUpTaxRule(event)" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'

                }
            },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpTaxCodeRules",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        forceFit: true, caption:'Tax Code Rules',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgTaxCodeRules");
        },
       
    }).jqGrid('navGrid', '#jqpTaxCodeRules', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpTaxCodeRules', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTaxCodeRules
    }).jqGrid('navButtonAdd', '#jqpTaxCodeRules', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTaxCodeRules
        });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    var btn_editEnable = document.querySelectorAll('#jqgEdit');
    var btn_viewEnable = document.querySelectorAll('#jqgView');
    var btn_deleteEnable = document.querySelectorAll('#jqgDelete');
    for (var i = 0; i < btn_editEnable.length; i++) {
        btn_editEnable[i].disabled = false;
    }
    for (var j = 0; j < btn_viewEnable.length; j++) {
        btn_viewEnable[j].disabled = false;
    }
    for (var k = 0; k < btn_deleteEnable.length; k++) {
        btn_deleteEnable[k].disabled = false;
    }


    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var btn_editDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < btn_editDisable.length; i++) {
            btn_editDisable[i].disabled = true;
            btn_editDisable[i].className = "ui-state-disabled";
        }
    }
    if (_userFormRole.IsView === false) {
        var btn_viewDisable = document.querySelectorAll('#jqgView');
        for (var j = 0; j < btn_viewDisable.length; j++) {
            btn_viewDisable[j].disabled = true;
            btn_viewDisable[j].className = "ui-state-disabled";
        }
    }

    if (_userFormRole.IsDelete === false) {
        var btn_deleteDisable = document.querySelectorAll('#jqgDelete');
        for (var k = 0; k < btn_deleteDisable.length; k++) {
            btn_deleteDisable[k].disabled = true;
            btn_deleteDisable[k].className = "ui-state-disabled";
        }
    }
}

function fnAddTaxCodeRules() {
    fnClearFields();
    var id = $("#cboCountryCode").val();
    var Taxid = $("#cboTaxDescription").val();

    if (id == 0 || Taxid == 0) {
        if (id == 0) {
            toastr.warning("Please select ISD Code to add");
        }
        else
            toastr.warning("Please select Tax Code to add");
    }
    else {
        $('#PopupTaxCodeRules').modal('show');
        $('#PopupTaxCodeRules').modal({ backdrop: 'static', keyboard: false });
        $('#PopupTaxCodeRules').find('.modal-title').text(localization.AddTaxRule);
        fnClearFields();
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTaxRule").html(localization.Save);
        $("#btnSaveTaxRule").show();
        $("#btnDeactivateTaxRule").hide();
    }
}

function fnEditTaxRule(e) {
    $("#PopupTaxCodeRules").modal('show');
    $(".modal-title").text(localization.EditTaxCodeRule);

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgTaxCodeRules').jqGrid('getRowData', rowid);

    $('#PopupTaxCodeRules').modal('show');
    $('#PopupTaxCodeRules').find('.modal-title').text(localization.EditTaxRule);
    $("#btnSaveTaxRule").html(localization.Update);
    $("#btnSaveTaxRule").attr('disabled', false);
    $("#btnSaveTaxRule").show();
    $('#txtSerialNumber').val(rowData.SerialNumber);
    $("#txtTaxShortCode").val(rowData.TaxShortCode);
    $("#txtTaxDescription").val(rowData.TaxDescription);
    $("#cboSlaborPercentage").val(rowData.SlabOrPerc);
    $("#cboSlaborPercentage").selectpicker('refresh');

    if (rowData.IsSplitApplicable === "true") {
        $("#chkIsSplitApplicable").parent().addClass("is-checked");
        $("#lblCategoryPerc").text(localization.SplitCategoryPercentage);
    }
    else {
        $("#chkIsSplitApplicable").parent().removeClass("is-checked");
        $("#lblCategoryPerc").text(localization.SplitPercentage);
    }

    $("#txtCategoryPerc").val(rowData.SplitCategoryPerc);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
   
    $("#btnDeactivateTaxRule").hide();
    fnEnableControl(false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveTaxRule").attr('disabled', false);
}

function fnViewTaxRule(e) {
    $("#PopupTaxCodeRules").modal('show');
    $(".modal-title").text('View Tax Rule');

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgTaxCodeRules').jqGrid('getRowData', rowid);

    $('#PopupTaxCodeRules').modal('show');
    $('#PopupTaxCodeRules').find('.modal-title').text(localization.ViewTaxRule);
    $("#btnSaveTaxRule").html(' Update');

    $('#txtSerialNumber').val(rowData.SerialNumber);
    $("#txtTaxShortCode").val(rowData.TaxShortCode);
    $("#txtTaxDescription").val(rowData.TaxDescription);
    $("#cboSlaborPercentage").val(rowData.SlabOrPerc);
    $("#cboSlaborPercentage").selectpicker('refresh');

    if (rowData.IsSplitApplicable === "true") {
        $("#chkIsSplitApplicable").parent().addClass("is-checked");
        $("#lblCategoryPerc").text(localization.SplitCategoryPercentage);
    }
    else {
        $("#chkIsSplitApplicable").parent().removeClass("is-checked");
        $("#lblCategoryPerc").text(localization.SplitPercentage);
    }

    $("#txtCategoryPerc").val(rowData.SplitCategoryPerc);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveTaxRule").attr('disabled', false);
    $("#btnSaveTaxRule").hide();
    $("#btnDeactivateTaxRule").hide();
    fnEnableControl(true);
   
    $("#PopupTaxCodeRules").on('hidden.bs.modal', function () {
        $("#btnSaveTaxRule").show();
        fnEnableControl(false);
    })
}

function fnDeletePopUpTaxRule(e) {
    $("#PopupTaxCodeRules").modal('show');
    $(".modal-title").text('Active / De Active TaxRule');

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgTaxCodeRules').jqGrid('getRowData', rowid);

    $('#PopupTaxCodeRules').modal('show');
    $('#PopupTaxCodeRules').find('.modal-title').text("Active / De Active TaxRule");
    $("#btnSaveTaxRule").html(' Update');

    $('#txtSerialNumber').val(rowData.SerialNumber);
    $("#txtTaxShortCode").val(rowData.TaxShortCode);
    $("#txtTaxDescription").val(rowData.TaxDescription);
    $("#cboSlaborPercentage").val(rowData.SlabOrPerc);
    $("#cboSlaborPercentage").selectpicker('refresh');

    if (rowData.IsSplitApplicable === "true") {
        $("#chkIsSplitApplicable").parent().addClass("is-checked");
        $("#lblCategoryPerc").text(localization.SplitCategoryPercentage);
    }
    else {
        $("#chkIsSplitApplicable").parent().removeClass("is-checked");
        $("#lblCategoryPerc").text(localization.SplitPercentage);
    }

    $("#txtCategoryPerc").val(rowData.SplitCategoryPerc);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateTaxRule").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateTaxRule").html(localization.Activate);
    }
    
    $("#btnSaveTaxRule").attr('disabled', false);
    $("#btnSaveTaxRule").hide();
    $("#btnDeactivateTaxRule").show();
    fnEnableControl(true);

    $("#PopupTaxCodeRules").on('hidden.bs.modal', function () {
        $("#btnSaveTaxRule").show();
        fnEnableControl(false);
    })
}

function fnSliptApplicableChange(elem) {
    if (elem.checked) {
        $("#lblCategoryPerc").text(localization.SplitCategoryPercentage);
    }
    else {
        $("#lblCategoryPerc").text(localization.SplitPercentage);
    }
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("#chkIsSplitApplicable").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSaveTaxRule() {
   
    if (validateTaxRule() === false) {
        return;
    }
    tax_Rule = {
        ISDCode: $("#cboCountryCode").val(),
        TaxCode: $("#cboTaxDescription").val(),
        serialNumber: $("#txtSerialNumber").val() === '' ? 0 : $("#txtSerialNumber").val(),
        TaxShortCode: $("#txtTaxShortCode").val(),
        TaxDescription: $("#txtTaxDescription").val(),
        SlabOrPerc: $("#cboSlaborPercentage").val(),
        IsSplitApplicable: $("#chkIsSplitApplicable").parent().hasClass("is-checked"),
        SplitCategoryPerc: $("#txtCategoryPerc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    
  $("#btnSaveTaxRule").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Country/InsertIntoTaxRule',
        type: 'POST',
        datatype: 'json',
        data: { tax_Rule },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveTaxRule").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveTaxRule").attr('disabled', false);
                fnGridRefreshTaxCodeRules();
                $("#PopupTaxCodeRules").modal('hide');
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveTaxRule").attr('disabled', false);
                $("#btnSaveTaxRule").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveTaxRule").attr("disabled", false);
            $("#btnSaveTaxRule").html(localization.DeActivate);
        }
    });
}

function validateTaxRule() {
    if (IsStringNullorEmpty($("#txtTaxShortCode").val())) {
        toastr.warning("Please Enter Tax Short Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtTaxDescription").val())) {
        toastr.warning("Please Enter Tax Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCategoryPerc").val())) {
        toastr.warning("Please Enter Tax Percentage");
        return false;
    }
}

function fnGridRefreshTaxCodeRules() {
    $("#jqgTaxCodeRules").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtSerialNumber").val("");
    $("#txtTaxCode").val("");
    $("#txtTaxShortCode").val("");
    $("#txtTaxDescription").val("");
    $("#cboSlaborPercentage").val("Percentage");
    $('#cboSlaborPercentage').selectpicker('refresh');
    $("#txtCategoryPerc").val("");
    $("#chkIsSplitApplicable").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveTaxRule").attr('disabled', false);
    fnEnableControl(false);
}

function fnDeleteTaxRule() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTaxRule").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Country/ActiveOrDeActiveTaxRule?status=' + a_status + '&Isd_code=' + $("#cboCountryCode").val()
            + '&Taxcode=' + $("#cboTaxDescription").val() + '&serialNumber=' + $("#txtSerialNumber").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateTaxRule").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupTaxCodeRules').modal('hide');
                fnClearFields();
                fnGridRefreshTaxCodeRules();
                $("#btnDeactivateTaxRule").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateTaxRule").attr("disabled", false);
                $("#btnDeactivateTaxRule").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateApplicationCode").attr("disabled", false);
            $("#btnDeactivateApplicationCode").html(localization.DeActivate);
        }
    });
}
