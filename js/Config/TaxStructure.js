
var isSave = false;
$(document).ready(function () {

    fnGridLoadTaxStructure();
    $(".taxCodeRulesContainer").hide();
});

var actiontype = "";
function fnGridLoadTaxStructure() {

    MethodCboFillTaxCodes();

    var ISDCode = $("#cboCountryCode").val();
    var URL = getBaseURL() + '/Country/GetTaxStructureByISDCode?ISDCode=' + ISDCode;

    $("#jqgTaxStructure").jqGrid('GridUnload');
    $("#jqgTaxStructure").jqGrid({
        url: URL,
        mtype: 'Post',  
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["ISD Code", "Tax Code", localization.TaxShortCode, localization.TaxDescription, localization.SlaborPercentage, localization.IsSplitApplicable, localization.Active, localization.Actions],
        colModel: [
            { name: "ISDCode", width: 70, editable: false, align: 'left', hidden: true },
            { name: "TaxCode", width: 30, editable: false, align: 'left', resizable: true, hidden: true },
            { name: "TaxShortCode", width: 30, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "TaxDescription", editable: true, width: 120, align: 'left', resizable: false },
            { name: "SlabOrPerc", editable: true, width: 45, align: 'left', resizable: false },
            { name: "IsSplitApplicable", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
             {
                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                 formatter: function (cellValue, options, rowdata, action) {
                     return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditTaxStructure(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'
                         + '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id="jqgView" onclick="return fnEditTaxStructure(event,\'view\')"> <i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                         '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditTaxStructure(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'

                }
            },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpTaxStructure",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        forceFit: true,
        caption:'Tax Structure',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgTaxStructure");
        },

    }).jqGrid('navGrid', '#jqpTaxStructure', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpTaxStructure', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTaxStructure
    }).jqGrid('navButtonAdd', '#jqpTaxStructure', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTaxStructure
        });
    fnAddGridSerialNoHeading();
}

function MethodCboFillTaxCodes() {
    $('#cboTaxCodes').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Country/GetTaxCodesListByISDCode?ISDCode=' + $('#cboCountryCode').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $('#cboTaxCodes').empty();
            $("#cboTaxCodes").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboTaxCodes").append($("<option></option>").val(result[i]["TaxCode"]).html(result[i]["TaxDescription"]));
                }
            }
            //$('#cboTaxCodes').val($("#cboTaxDescription option:first").val());
            $('#cboTaxCodes').selectpicker('refresh');
        }
    });
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

function fnAddTaxStructure() {
    fnClearFields();
    var id = $("#cboCountryCode").val();
    if (id == 0) {
        toastr.warning("Please select ISD Code to add");
    }
    else {
        $('#PopupTaxStructure').modal('show');
        $('#PopupTaxStructure').modal({ backdrop: 'static', keyboard: false });
        $('#PopupTaxStructure').find('.modal-title').text(localization.AddTaxCode);
        fnClearFields();
        isSave = true;
        $("#btnSaveTaxStructure").html(localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTaxStructure").show();
        $("#btnDeactivateTaxStructure").hide();
    }
}

function fnEditTaxStructure(e,actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgTaxStructure').jqGrid('getRowData', rowid);
    
    $('#PopupTaxStructure').modal('show');

    isSave = false;
    $("#cboTaxCodes").val(rowData.TaxCode);
    $("#cboTaxCodes").selectpicker('refresh');

    //$('#txtTaxCode').val(rowData.TaxCode);
    $("#txtTaxShortCode").val(rowData.TaxShortCode);
    //$("#txtTaxDescription").val(rowData.TaxDescription);
    $("#cboSlaborPercentage").val(rowData.SlabOrPerc.substring(0, 1));
    $("#cboSlaborPercentage").selectpicker('refresh');
    if (rowData.IsSplitApplicable === "true") {
        $("#chkIsSplitApplicable").parent().addClass("is-checked");
    }
    else { $("#chkIsSplitApplicable").parent().removeClass("is-checked"); }
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveTaxStructure").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        $('#PopupTaxStructure').find('.modal-title').text(localization.EditTaxCode);
        $("#btnSaveTaxStructure").html(localization.Update);
        $("#btnSaveTaxStructure").show();
        $("#btnDeactivateTaxStructure").hide();
        fnEnableControl(false);
        $("#chkActiveStatus").prop('disabled', true);
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveTaxStructure").hide();
        $("#btnDeactivateTaxStructure").hide();
        fnEnableControl(true);
    }

    if (actiontype.trim() == "delete") {
        $("#btnSaveTaxStructure").hide();
        $("#btnDeactivateTaxStructure").show();
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateTaxStructure").html(localization.DeActivate);
        }
        else {
            $("#btnDeactivateTaxStructure").html(localization.Activate);
        }

        fnEnableControl(true);
    }

    $("#PopupTaxStructure").on('hidden.bs.modal', function () {
        $("#btnSaveTaxStructure").show();
        fnEnableControl(false);
    })
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("#chkIsSplitApplicable").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSaveTaxStructure() {
    //debugger;
    if (validateTaxStructure() === false) {
        return;
    }

    $("#btnSaveTaxStructure").attr('disabled', true);

    var tax_Struc = {
        ISDCode: $("#cboCountryCode").val(),
        //TaxCode: $("#txtTaxCode").val() === '' ? 0 : $("#txtTaxCode").val(),
        TaxCode: $("#cboTaxCodes").val(),
        TaxShortCode: $("#txtTaxShortCode").val(),
        //TaxDescription: $("#txtTaxDescription").val(),
        TaxDescription: $("#cboTaxCodes :selected").text(),
        SlabOrPerc: $("#cboSlaborPercentage").val(),
        IsSplitApplicable: $("#chkIsSplitApplicable").parent().hasClass("is-checked"),
        SaveStatus: isSave,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
    
    $.ajax({
        url: getBaseURL() + '/Country/InsertOrUpdateTaxStructure',
        type: 'POST',
        datatype: 'json',
        data: { tax_Struc },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveTaxStructure").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshTaxStructure();
                $("#PopupTaxStructure").modal('hide');
               
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveTaxStructure").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveTaxStructure").attr("disabled", false);
        }
    });
}

function validateTaxStructure() {

    if (IsStringNullorEmpty($("#txtTaxShortCode").val())) {
        toastr.warning("Please Enter Tax Short Code");
        return false;
    }
    if ($("#cboTaxCodes").val() === "0" || $("#cboTaxCodes").val() === "") {
        toastr.warning("Please Select Tax Description");
        return false;
    }
    
}

function fnGridRefreshTaxStructure() {
    $("#jqgTaxStructure").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    //$("#txtTaxCode").val("");
    $("#txtTaxShortCode").val("");
    //$("#txtTaxDescription").val("");
    $("#cboTaxCodes").val("0").selectpicker('refresh');
    $("#cboSlaborPercentage").val("P").selectpicker('refresh');
    $("#chkIsSplitApplicable").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveTaxStructure").attr('disabled', false);
    isSave = false;
    fnEnableControl(false);
}

function fnDeleteTaxStructure() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTaxStructure").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Country/ActiveOrDeActiveTaxStructure?status=' + a_status + '&Isd_code=' + $("#cboCountryCode").val() + '&Taxcode=' + $("#cboTaxCodes").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateTaxStructure").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupTaxStructure').modal('hide');
                fnClearFields();
                fnGridRefreshTaxStructure();
                $("#btnDeactivateTaxStructure").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateTaxStructure").attr("disabled", false);
                $("#btnDeactivateTaxStructure").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateTaxStructure").attr("disabled", false);
            $("#btnDeactivateTaxStructure").html(localization.DeActivate);
        }
    });
}







 