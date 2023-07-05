var previous = false;
var actiontype = "";
var _isInsert = true;
var Currencylist = [];

$(function () {

    Currencylist.push(0 + ': Select');
    $.each(Currencies, function (i, data) { Currencylist.push(data.CurrencyCode + ':' + data.CurrencyName); })
    Currencylist = Currencylist.join(';')
    $("#chkShowPreviousRate").parent().removeClass("is-checked");
    fnBindPatientTypebyBusinessKey();
    fnLoadCareCardRates();

    $.contextMenu({
        selector: "#btnCareCardRates",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCareCardRates(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCareCardRates(event, 'view') } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCareCardRates(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    //$(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})

$("#chkShowPreviousRate").change(function () {
    if (this.checked) {
        previous = true;
        fnLoadCareCardRates();
    } else {
        previous = false;
        fnLoadCareCardRates();
    }
});

function fnBusinessLocation_onChange() {
    if ($("#chkShowPreviousRate").parent().hasClass("is-checked")) {
        previous = true;
    } else {
        previous = false;
    }

    fnBindPatientTypebyBusinessKey();
    fnBindPatientCategorybyPatientType();
    fnLoadCareCardRates();
}

function fnLoadCareCardRates() {

    //if ($("#chkShowPreviousRate").parent().hasClass("is-checked")) {
    //    previous = true;
    //} else {
    //    previous = false;
    //}
    //debugger;
    $("#jqgCareCardRates").jqGrid('GridUnload');
    $("#jqgCareCardRates").jqGrid({
        url: getBaseURL() + '/CareCardRates/GetCareCardRates?businesskey=' + $("#cboBusinessLocation").val() + '&PatientTypeId=' + $("#cboPatientType").val() + '&PatientCategoryId=' + $("#cboPatientCategory").val() + '&previous=' + previous,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientType, localization.PatientCategory, "", localization.Currency, localization.Rate, localization.ValidForNoOfDays, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            //{ name: "CurrencyCode", editable: true, width: 150, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: Currencylist } },
            { name: "CurrencyCode", width: 50, editable: true, align: 'left',hidden:true, resizable: false, editoption: { 'text-align': 'left', maxlength: 15 } },
            { name: "CurrencyName", width: 200, editable: true, align: 'left', editoptions: { maxlength: 25 } },

            {
                name: 'Rate', index: 'Rate', editable: true, edittype: "text", width: 150
            },
            {
                name: 'ValidforNoOfDays', index: 'ValidforNoOfDays', editable: true, edittype: "text", width: 150,
                editoptions: { maxlength: 7, onkeypress: 'return CheckDigits(event)' }
            },
            {
                name: 'EffectiveFrom', index: 'EffectiveFrom', width: 150, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            {
                name: 'EffectiveTill', index: 'EffectiveTill', width: 150, sorttype: "date", formatter: "date", hidden: false, formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            {
                name: "ActiveStatus", width: 200, editable: true, align: 'center', hidden: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }
            },
            {
                name: 'edit', search: false, align: 'center', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCareCardRates"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpCareCardRates",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: false,
        //editurl: 'url',
        //cellsubmit: 'clientArray',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgCareCardRates");
        }
    }).jqGrid('navGrid', '#jqpCareCardRates', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCareCardRates', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCareCardRates
        }).jqGrid('navButtonAdd', '#jqpCareCardRates', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCareCardRates
    });
    
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnAddCareCardRates() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        toastr.warning("Please Select a Business Location to add");
        return;
    }
    if (IsStringNullorEmpty($("#cboPatientType").val()) || $('#cboPatientType').val() == '' || $('#cboPatientType').val() == '0') {
        toastr.warning("Please Select a Patient Type to add");
        return;
    }
    if (IsStringNullorEmpty($("#cboPatientCategory").val()) || $('#cboPatientCategory').val() == '' || $('#cboPatientCategory').val() == '0') {
        toastr.warning("Please Select a Patient Category to add");
        return;
    }
        _isInsert = true;
        fnClearFields();
    $('#PopupCareCardRates').modal('show');
    $('#PopupCareCardRates').modal({ backdrop: 'static', keyboard: false });
    $('#PopupCareCardRates').find('.modal-title').text(localization.AddCareCardRates);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveCareCards").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveCareCards").show();
    $("#txtEffectiveFrom").prop('disabled', false);
    $("#txtEffectiveTill").prop('disabled', false);
    $('#cboCurrencyCode').prop('disabled', false);
    $('#cboCurrencyCode').selectpicker('refresh');

    
}

function fnClearFields() {
    $('#cboCurrencyCode').val('0').selectpicker('refresh');
    $("#txtRate").val('');
    $("#txtValidForNoOfDays").val('');
    $('#txtEffectiveFrom').val('');
    $('#txtEffectiveTill').val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCareCards").attr('disabled', false);
}

function fnEditCareCardRates(e, actiontype) {
    debugger;
    var rowid = $("#jqgCareCardRates").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCareCardRates').jqGrid('getRowData', rowid);

    $('#PopupCareCardRates').modal('show');
    $('#txtRate').val(rowData.Rate);
    $('#txtValidForNoOfDays').val(rowData.ValidforNoOfDays);
    $('#cboCurrencyCode').val(rowData.CurrencyCode).selectpicker('refresh');
    $('#txtEffectiveFrom').val('');
    if (rowData.EffectiveFrom !== null || !IsStringNullorEmpty(rowData.EffectiveFrom)) {
        setDate($('#txtEffectiveFrom'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtEffectiveFrom').val('');
    }

    $('#txtEffectiveTill').val('');

    if (rowData.EffectiveTill !== null) {
        setDate($('#txtEffectiveTill'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#txtEffectiveTill').val('');
    }

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkActiveStatus").prop('disabled', true);

    $("#btnSaveRoomLocation").attr("disabled", false);

    _isInsert = false;
    $("#txtEffectiveFrom").prop('disabled', true);
    $('#cboCurrencyCode').prop('disabled', true);
    $('#cboCurrencyCode').selectpicker('refresh');

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupCareCardRates').find('.modal-title').text(localization.UpdateCareCardRates);
        $("#btnSaveCareCards").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSaveCareCards").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupCareCardRates').find('.modal-title').text(localization.ViewCareCardRates);
        $("#btnSaveCareCards").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCareCards").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCareCardRates").on('hidden.bs.modal', function () {
            $("#btnSaveCareCards").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveSaveCareCards() {

    if (IsStringNullorEmpty($("#cboCurrencyCode").val()) || $("#cboCurrencyCode").val() === '0' || $("#cboCurrencyCode").val() === "0") {
        toastr.warning("Please Select a Currrency Code");
        return;
    }
    if (IsStringNullorEmpty($("#txtRate").val())) {
        toastr.warning("Please Enter the Rate");
        return;
    }
    if (IsStringNullorEmpty($("#txtValidForNoOfDays").val())) {
        toastr.warning("Please Enter the Valid For Number of Days");
        return;
    }
    if (IsStringNullorEmpty($("#txtEffectiveFrom").val())) {
        toastr.warning("Please Select a Effective From ");
        return;
    }
    
    objrate = {
        BusinessKey: $("#cboBusinessLocation").val(),
        PatientTypeId: $("#cboPatientType").val(),
        PatientCategoryId: $("#cboPatientCategory").val(),
        CurrencyCode: $("#cboCurrencyCode").val(),
        EffectiveFrom: getDate($('#txtEffectiveFrom')),
        EffectiveTill: getDate($('#txtEffectiveTill')),
        Rate: $('#txtRate').val(),
        ValidforNoOfDays: $('#txtValidForNoOfDays').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveCareCards").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/CareCardRates/InsertOrUpdateCareCardRates',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objrate },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveCareCards").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupCareCardRates').modal('hide');
                fnClearFields();
                fnGridRefreshCareCardRates();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCareCards").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCareCards").attr("disabled", false);
        }
    });
}

function fnGridRefreshCareCardRates() {
    $("#jqgCareCardRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnBindPatientTypebyBusinessKey() {

    $("#cboPatientType").empty();

    $.ajax({
        url: getBaseURL() + '/CareCardRates/GetPatientTypebyBusinesskey?businesskey=' + $("#cboBusinessLocation").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {
           
            if (response != null) {
                //refresh each time
                $("#cboPatientType").empty();
                $("#cboPatientType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPatientType").append($("<option></option>").val(response[i]["PatientTypeId"]).html(response[i]["PatientTypeDesc"]));
                }
                $('#cboPatientType').selectpicker('refresh');
            }
            else {
                $("#cboPatientType").empty();
                $("#cboPatientType").append($("<option value='0'> Select </option>"));
                $('#cboPatientType').selectpicker('refresh');
            }
            
        },
        async: false,
        processData: false
    });

    if ($("#chkShowPreviousRate").parent().hasClass("is-checked")) {
        previous = true;
    } else {
        previous = false;
    }
}

function fnBindPatientCategorybyPatientType() {

    $("#cboPatientCategory").empty();

    $.ajax({
        url: getBaseURL() + '/CareCardRates/GetPatientCategoriesbyBusinesskeyAndPatientType?businesskey=' + $("#cboBusinessLocation").val()
            + '&PatientTypeId=' + $("#cboPatientType").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboPatientCategory").empty();
                $("#cboPatientCategory").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPatientCategory").append($("<option></option>").val(response[i]["PatientCategoryId"]).html(response[i]["PatientCategoryDesc"]));
                }
                $('#cboPatientCategory').selectpicker('refresh');
            }
            else {
                $("#cboPatientCategory").empty();
                $("#cboPatientCategory").append($("<option value='0'> Select </option>"));
                $('#cboPatientCategory').selectpicker('refresh');
            }
            fnLoadCareCardRates();
        },
        async: false,
        processData: false
    });

    if ($("#chkShowPreviousRate").parent().hasClass("is-checked")) {
        previous = true;
    } else {
        previous = false;
    }
}