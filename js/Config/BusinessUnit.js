
$(document).ready(function () {
    fnGridLoadBusinessUnit();
    $('#cboSubUnit').selectpicker('refresh');
});

var actiontype = "";

function fnGridLoadBusinessUnit() {

    $("#jqgBusinessUnit").jqGrid('GridUnload');
    $("#jqgBusinessUnit").jqGrid({
        url: getBaseURL() + '/BusinessStructure/GetBusinessUnitsbyBusinessId?BusinessId=' + $("#cboBusinessId").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "", "", localization.UnitDescription, localization.BusinessName, localization.ISDCode, localization.City, localization.Country,
            localization.Location, localization.CurrencyCode, localization.CurrencyName, localization.SubUnit,
            localization.BoacostCentre, localization.TaxIdentification, localization.TaxIdentificationDesc,
            localization.IsBookOfAccounts, localization.TolocalCurrency, localization.TocurrConversion, localization.TorealCurrency, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "BusinessUnitId", width: 70, editable: false, hidden: true, align: 'left' },
            { name: "BusinessKey", width: 70, editable: false, hidden: true, align: 'left'},
            { name: "UnitDesc", width: 120, editable: true, align: 'left', resizable: false, hidden: true, editoption: { 'text-align': 'left', maxlength: 100 } },
            { name: "BusinessName", width: 250, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 100 } },
            { name: "Isdcode", width: 70, editable: false, hidden: true, align: 'left',hidden: true },
            { name: "City", width: 70, editable: false, hidden: true, align: 'left', hidden: true },
            { name: "CountryName", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 20 }, hidden: true },
            { name: "Location", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 100 }, hidden: true},
            { name: "CurrencyCode", width: 70, editable: false, hidden: true, align: 'left', hidden: true },
            { name: "CurrencyName", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 20 }, hidden: true },
            { name: "BusinessSubUnitId", width: 70, editable: false, hidden: true, align: 'left' }, 
            { name: "BoacostCentre", width: 70, editable: false, hidden: true, align: 'left' }, 
            { name: "TaxIdentification", width: 70, editable: false, hidden: true, align: 'left' },
            { name: "TaxIdentificationDesc", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 20 }, hidden: true },
            { name: "IsBookOfAccounts", width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }},
            { name: "TolocalCurrency", width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }, hidden: true },
            { name: "TocurrConversion", width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }, hidden: true },
            { name: "TorealCurrency", width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }, hidden: true},
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditBusinessUnit(event,\'edit\')"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditBusinessUnit(event,\'view\')"><i class="far fa-eye"></i>' + localization.View + '</button>'  +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditBusinessUnit(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button>' 

                }
            }
        ], 
        pager: "#jpgBusinessUnit",
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
        caption:'Business Unit',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgBusinessUnit');
        },
    }).jqGrid('navGrid', '#jpgBusinessUnit', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jpgBusinessUnit', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBusinessUnit
        }).jqGrid('navButtonAdd', '#jpgBusinessUnit', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBusinessUnit
    });
    fnAddGridSerialNoHeading();
}

function fnAddBusinessUnit() {
    fnClearFields();
    $("#chkIsBookofAccounts").parent().addClass("is-checked");
    $('#BSSubUnitContainer').hide();
    $('#BoaCostCenterContainer').hide();
    var id = $("#cboBusinessId").val();
    if (id === 0 || id === "0" ||id=="") {
        toastr.warning("Please select any Business Entity to add");
    }
    else {
        $('#PopupBusinessUnit').modal('show');
        $('#PopupBusinessUnit').modal({ backdrop: 'static', keyboard: false });
        $('#PopupBusinessUnit').find('.modal-title').text(localization.AddBusinessUnit);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveBusinessUnit").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveBusinessUnit").show();
        $("#btnDeactivateBusinessUnit").hide();
    }
}

function fnEditBusinessUnit(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBusinessUnit').jqGrid('getRowData', rowid);
    $('#PopupBusinessUnit').modal('show');

    $("#txtBusinessUnitId").val(rowData.BusinessUnitId);
    $("#txtBusinessKey").val(rowData.BusinessKey);
    $("#txtUnitDescription").val(rowData.UnitDesc);
    $("#txtBusinessName").val(rowData.BusinessName);
    $("#cboISDCode").val(rowData.Isdcode).selectpicker('refresh');
    $("#cboCity").val(rowData.City).selectpicker('refresh');
    $("#txtLocation").val(rowData.Location);
    $("#cboCurrencyCode").val(rowData.CurrencyCode).selectpicker('refresh');
    
    if (rowData.IsBookOfAccounts === "true") {
        $("#chkIsBookofAccounts").parent().addClass("is-checked");
        //dynamic binding
        $('#BSSubUnitContainer').hide();
        $('#BoaCostCenterContainer').hide();
        $('#cboSubUnit').selectpicker('refresh');
        $('#cboSubUnit').empty();
        $("#cboSubUnit").append($("<option value='0'>Select</option>"));
        $('#cboSubUnit').val($("#cboSubUnit option:first").val());
        $('#cboSubUnit').selectpicker('refresh');

     
    }
    else {
        $("#chkIsBookofAccounts").parent().removeClass("is-checked");
        //dynamic binding 
        fnloadBusinessSubUnits();
        $('#BSSubUnitContainer').show();
        $('#BoaCostCenterContainer').show();
        $("#cboSubUnit").val(rowData.BusinessSubUnitId).selectpicker('refresh');
    }

    //$("#cboSubUnit").val(rowData.BusinessSubUnitId).selectpicker('refresh');

    $("#cboBoaCostCenter").val(rowData.BoacostCentre).selectpicker('refresh');

    $("#cboTaxIdentification").val(rowData.TaxIdentification).selectpicker('refresh');
    if (rowData.TolocalCurrency === "true") {
        $("#chkToLocalCurrency").parent().addClass("is-checked");

    }
    else {
        $("#chkToLocalCurrency").parent().removeClass("is-checked");
    }

    if (rowData.TocurrConversion === "true") {
        $("#chkToCurrCurrency").parent().addClass("is-checked");

    }
    else {
        $("#chkToCurrCurrency").parent().removeClass("is-checked");
    }
    if (rowData.TorealCurrency === "true") {
        $("#chkToRealCurrency").parent().addClass("is-checked");

    }
    else {
        $("#chkToRealCurrency").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");

    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBusinessUnit").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        $('#PopupBusinessUnit').find('.modal-title').text(localization.UpdateBusinessUnit);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkIsBookofAccounts").prop('disabled', false);
        $("#chkToLocalCurrency").prop('disabled', false);
        $("#chkToCurrCurrency").prop('disabled', false);
        $("#chkToRealCurrency").prop('disabled', false);

        $("#btnSaveApplicationCode").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnDeactivateBusinessUnit").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveBusinessUnit").show();
    }
    if (actiontype.trim() == "view") {
        $('#PopupBusinessUnit').find('.modal-title').text(localization.ViewBusinessUnit);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkIsBookofAccounts").prop('disabled', true);
        $("#chkToLocalCurrency").prop('disabled', true);
        $("#chkToCurrCurrency").prop('disabled', true);
        $("#chkToRealCurrency").prop('disabled', true);
        $("#btnSaveBusinessUnit,#btnDeactivateBusinessUnit").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
    if (actiontype.trim() == "delete") {
        $('#PopupBusinessUnit').find('.modal-title').text("Active/De Active Business Unit");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateBusinessUnit").html(localization.DActivate);
        }
        else {
            $("#btnDeactivateBusinessUnit").html('Activate');
            $("#btnDeactivateBusinessUnit").html(localization.Activate);
        }
        $("#btnSaveBusinessUnit").hide();
        $("#btnDeactivateBusinessUnit").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkIsBookofAccounts").prop('disabled', true);
        $("#chkToLocalCurrency").prop('disabled', true);
        $("#chkToCurrCurrency").prop('disabled', true);
        $("#chkToRealCurrency").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

}

function fnSaveBusinessUnit() {
  
    if (validateBusinessUnit() === false) {
        return;
    }
    var bookofac = $('#chkIsBookofAccounts').parent().hasClass("is-checked");
    if (bookofac == false || bookofac == "false") {

        if ($("#cboSubUnit").val() === "0" || $("#cboSubUnit").val() === null) {
            toastr.warning("Please Select Sub Unit");
            return;
        }
    }
    
    $("#btnSaveBusinessUnit").attr('disabled', true);
    obj = {
        BusinessUnitId: $("#txtBusinessUnitId").val() === '' ? 0 : $("#txtBusinessUnitId").val(),
        BusinessId: $("#cboBusinessId").val(),
        BusinessKey: $("#txtBusinessKey").val(),
        UnitDesc: $("#txtUnitDescription").val(),
        BusinessName: $("#txtBusinessName").val(),
        Isdcode: $("#cboISDCode").val(),
        City: $("#cboCity").val(),
        Location: $("#txtLocation").val(),
        CurrencyCode: $("#cboCurrencyCode").val(),
        BusinessSubUnitId: $("#cboSubUnit").val(),
        BoacostCentre: $("#cboBoaCostCenter").val(),
        TaxIdentification: $("#cboTaxIdentification").val(),
        IsBookOfAccounts: $('#chkIsBookofAccounts').parent().hasClass("is-checked"),
        TolocalCurrency: $('#chkToLocalCurrency').parent().hasClass("is-checked"),
        TocurrConversion: $('#chkToCurrCurrency').parent().hasClass("is-checked"),
        TorealCurrency: $('#chkToRealCurrency').parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
 
    $.ajax({
        url: getBaseURL() + '/BusinessStructure/InsertOrUpdateBusinessUnit',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBusinessUnit").attr('disabled', false);
                fnGridRefreshBusinessUnit();
                $('#PopupBusinessUnit').modal('hide');
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBusinessUnit").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBusinessUnit").attr("disabled", false);
        }
    });
}

function validateBusinessUnit() {

    if (IsStringNullorEmpty($("#cboBusinessId").val())) {
        toastr.warning("Please Select Business Entity");
        return false;
    }
    if (IsStringNullorEmpty($("#txtUnitDescription").val())) {
        toastr.warning("Please Enter Unit Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinessName").val())) {
        toastr.warning("Please Enter Business Name");
        return false;
    }

    if (IsStringNullorEmpty($("#txtLocation").val())) {
        toastr.warning("Please Enter Location");
        return false;
    }

    if ($("#cboCurrencyCode").val() === "0" || $("#cboCurrencyCode").val() === null) {
        toastr.warning("Please Select Currency Code");
        return false;
    }
   
    if ($("#cboTaxIdentification").val() === "0" || $("#cboTaxIdentification").val() === '0') {
        toastr.warning("Please Select Tax Identification");
        return false;
    }

}

function fnGridRefreshBusinessUnit() {
    $("#jqgBusinessUnit").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelBusinessUnit").click(function () {
    fnClearFields();
    $("#jqgBusinessUnit").jqGrid('resetSelection');
    $('#PopupBusinessUnit').modal('hide');
});

function fnClearFields() {
    $("#txtBusinessUnitId").val("");
    $("#txtBusinessKey").val("");
    $("#txtUnitDescription").val("");
    $("#txtBusinessName").val("");
    $("#cboISDCode").val("0").selectpicker('refresh');
    $("#cboCity").val("0").selectpicker('refresh');
    $("#txtLocation").val("");
    $("#cboCurrencyCode").val("0").selectpicker('refresh');
    $("#cboTaxIdentification").val("0").selectpicker('refresh');
    $("#cboBoaCostCenter").val("0").selectpicker('refresh');
    $("#chkIsBookofAccounts").parent().removeClass("is-checked");
    $("#cboSubUnit").val("0").selectpicker('refresh');
    $("#chkToLocalCurrency").parent().removeClass("is-checked");
    $("#chkToCurrCurrency").parent().removeClass("is-checked");
    $("#chkToRealCurrency").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().removeClass("is-checked");
    $("#btnSaveBusinessUnit").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
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

function fnDeleteBusinessUnit() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateBusinessUnit").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/BusinessStructure/ActiveOrDeActiveBusinessUnit?status=' + a_status + '&BusinessId=' + $("#cboBusinessId").val() + '&BusinessUnitId=' + $("#txtBusinessUnitId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupBusinessUnit').modal('hide');
                fnClearFields();
                fnGridRefreshBusinessUnit();
                $("#btnDeactivateBusinessUnit").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateBusinessUnit").attr("disabled", false);
                $("#btnDeactivateBusinessUnit").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateBusinessUnit").attr("disabled", false);
            $("#btnDeactivateBusinessUnit").html('De Activate');
        }
    });
}

function fnGetBusinessSubUnits(elem) {
    if (elem.checked) {

        $("#chkIsBookofAccounts").parent().addClass("is-checked");
        $('#BSSubUnitContainer').hide();
        $('#BoaCostCenterContainer').hide();
        $('#cboSubUnit').selectpicker('refresh');
        $('#cboSubUnit').empty();
        $("#cboSubUnit").append($("<option value='0'>Select</option>"));
        $('#cboSubUnit').val($("#cboSubUnit option:first").val());
        $('#cboSubUnit').selectpicker('refresh');

    }
    else {
       
        fnloadBusinessSubUnits();
        $('#BSSubUnitContainer').show();
        $('#BoaCostCenterContainer').show();
    }
}

function fnloadBusinessSubUnits() {
    $('#cboSubUnit').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/BusinessStructure/GetBusinessSubUnits?BusinessId=' + $('#cboBusinessId').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboSubUnit').empty();
            $("#cboSubUnit").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboSubUnit").append($("<option></option>").val(result[i]["BusinessKey"]).html(result[i]["BusinessName"]));
                }
            }
            $('#cboSubUnit').val($("#cboSubUnit option:first").val());
            $('#cboSubUnit').selectpicker('refresh');
        }
    });
}