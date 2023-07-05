$(function () {
    fnGridLoadDocumentGeneration();
    $("#labtransmode").hide();
    $("#txtTransMode").hide();

    
});

var _isInsert = true;

function fnDocumentBasedOn() {

    fnGridLoadDocumentGeneration();

    var docBased = $("#cboDocBased").val();

    if (docBased == "GN") {
        
        $("#divStoreCode").hide();
        $("#labtransmode").hide();
        $("#txtTransMode").hide();
        $("#jqgDocumentGeneration").hideCol("TransactionMode");
        $("#jqgDocumentGeneration").hideCol("StoreName");
      
    }
    if (docBased == "TR") {
        
        $("#divStoreCode").hide();
        $("#labtransmode").show();
        $("#txtTransMode").show();
        $("#jqgDocumentGeneration").hideCol("StoreName");
        $("#jqgDocumentGeneration").showCol("TransactionMode");
    }

    if (docBased == "ST") {
        $("#divStoreCode").show();
        $("#labtransmode").show();
        $("#txtTransMode").show();
        $("#jqgDocumentGeneration").showCol("TransactionMode");
        $("#jqgDocumentGeneration").showCol("StoreName");
    }
    else {
        $("#divStoreCode").hide();
    }
}

function fnBusinessLocation_onChange() {

    fnGridLoadDocumentGeneration();
}
function fnGridLoadDocumentGeneration() {

    $("#jqgDocumentGeneration").GridUnload();

    $("#jqgDocumentGeneration").jqGrid({
        url: getBaseURL() + '/Control/GetDocumentGenerationsbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val() + '&Transactionmode=' + $("#cboDocBased").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Businesskey, localization.DocumentId, localization.finYear, localization.TransactionMode, localization.StoreCode, localization.StoreName, localization.DocumentName, localization.StartDocNumber, localization.CurrentDocNumber, localization.CurrentDocDate, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "DocumentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FinancialYear", width: 40, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            //{ name: "TransactionMode", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "GN: General;TR: Transaction Mode,ST: Store" } },
            { name: "TransactionMode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "StoreCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "StoreName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "DocumentName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "StartDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CurrentDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            
            {
                name: 'CurrentDocDate', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 70, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDocumentGeneration(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditDocumentGeneration(event,\'view\');"><i class="far fa-eye"></i>' + localization.View +'</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditDocumentGeneration(event,\'delete\');"><i class="fas fa-trash"></i>' + localization.Delete +'</button>'
                }
            },
        ],
        pager: "#jqpDocumentGeneration",
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
        forceFit: true, caption:'Document Generation',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpDocumentGeneration");
        },
     }).jqGrid('navGrid', '#jqpDocumentGeneration', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDocumentGeneration', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDocumentGeneration
    }).jqGrid('navButtonAdd', '#jqpDocumentGeneration', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDocumentGeneration
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgDocumentGeneration"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddDocumentGeneration() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select Business key to Add");
        return;
    }
    else {
        $('#PopupDocumentGeneration').modal('show');
        $('#PopupDocumentGeneration').modal({ backdrop: 'static', keyboard: false });
        $('#PopupDocumentGeneration').find('.modal-title').text(localization.AddDocumentGereration);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentGeneration").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveDocumentGeneration").show();
        $("#btndeActiveDocumentGeneration").hide();
         _isInsert = true;

    }
}


function fnEditDocumentGeneration(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDocumentGeneration').jqGrid('getRowData', rowid);

    _isInsert = false;

    $('#PopupDocumentGeneration').modal('show');
    $('#cbodocumentId').val(rowData.DocumentId).selectpicker('refresh');
    $("#cbodocumentId").next().attr('disabled', true);
    $('#txtfinancialyear').val(rowData.FinancialYear);
    $("#txtfinancialyear").attr('readonly', true);
    $('#txtStartdocNumber').val(rowData.StartDocNumber);
    $('#txtcurrentdocNumber').val(rowData.CurrentDocNumber);
    $("#dtdocdate").attr('readonly', true);
    if (rowData.CurrentDocDate !== null) {
        setDate($('#dtdocdate').val(rowData.CurrentDocDate));
    }
    else {
        $('#dtdocdate').val('');
    }

    if (!IsStringNullorEmpty(rowData.TransactionMode)) {
        $('#txtTransMode').val(rowData.TransactionMode);
        $('#labtransmode').show();
        $('#txtTransMode').show();
    }
    else
    {
        $('#txtTransMode').val('');
        $('#labtransmode').hide();
        $('#txtTransMode').hide();
    }
 
    if (!IsStringNullorEmpty(rowData.StoreCode) && rowData.StoreCode !== "0") {
        $('#cboStoreCode').val(rowData.StoreCode).selectpicker('refresh');
        $("#divStoreCode").show();
    }
    else
    {
        $('#cboStoreCode').val('0').selectpicker('refresh');
        $("#divStoreCode").hide();
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDocumentGeneration").attr("disabled", false);

    

    $("#txtTransMode").attr('readonly', true);
    $("#cboStoreCode").next().attr('disabled', true);

    if (actiontype.trim() == "edit") {
        $('#PopupDocumentGeneration').find('.modal-title').text(localization.EditDocumentGereration);
        $("#btnSaveDocumentGeneration").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveDocumentGeneration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentGeneration").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        $('#PopupDocumentGeneration').find('.modal-title').text(localization.ViewDocumentGereration);
        $("#btnSaveDocumentGeneration").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDocumentGeneration").hide();
        $("#btndeActiveDocumentGeneration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDocumentGeneration").on('hidden.bs.modal', function () {
            $("#btnSaveDocumentGeneration").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupDocumentGeneration').find('.modal-title').text("Activate/De Activate Activities");
        $("#btnSaveDocumentGeneration").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDocumentGeneration").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDocumentGeneration").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDocumentGeneration").html(localization.Activate);
        }

        $("#btndeActiveDocumentGeneration").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDocumentGeneration").on('hidden.bs.modal', function () {
            $("#btnSaveDocumentGeneration").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshDocumentGeneration() {
    $("#jqgDocumentGeneration").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelDocumentGeneration").click(function () {
    $("#jqgDocumentGeneration").jqGrid('resetSelection');
    $('#PopupDocumentGeneration').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cbodocumentId').val('0').selectpicker('refresh');
    $("#cbodocumentId").next().attr('disabled', false);
    $("#txtfinancialyear").val('');
    $("#txtfinancialyear").attr('readonly', false);
    $("#dtdocdate").attr('readonly', true);
    $("#txtTransMode").val('');
    $("#txtTransMode").attr('readonly', false);
    $('#txtStartdocNumber').val('');
    $('#cboStoreCode').val('0').selectpicker('refresh');
    $("#cboStoreCode").next().attr('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
    $('#dtdocdate').val('');
    $("#btnSaveDocumentGeneration").attr("disabled", false);
    $("#btndeActiveDocumentGeneration").attr("disabled", false);
}


function fnSaveDocumentGeneration() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select Business key");
        return;
    }
    if (IsStringNullorEmpty($("#cbodocumentId").val()) || $("#cbodocumentId").val() === "0") {
        toastr.warning("Please select Document");
        return;
    }
    if (IsStringNullorEmpty($("#txtfinancialyear").val())) {
        toastr.warning("Please Enter Financial Year");
        return;
    }
    if (IsStringNullorEmpty($("#txtStartdocNumber").val())) {
        toastr.warning("Please Enter Start Document");
        return;
    }
    
    if ($("#cboDocBased").val() == "TR" && IsStringNullorEmpty($("#txtTransMode").val()))
    {
        toastr.warning("Please Enter Transaction Mode");
        return;
    }
    if ($("#cboDocBased").val() == "ST") {
        if (IsStringNullorEmpty($("#txtTransMode").val())) {
            toastr.warning("Please Enter Transaction Mode");
            return;
        }
        if (IsStringNullorEmpty($("#cboStoreCode").val()) || $("#cboStoreCode").val() === "0") {
            toastr.warning("Please select Store Code");
            return;
        }
    }

    
    objdocgenration = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DocumentId: $("#cbodocumentId").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        StartDocNumber: $("#txtStartdocNumber").val(),
        CurrentDocDate: $("#dtdocdate").val(),
        TransactionMode: $("#txtTransMode").val(),
        StoreCode: $("#cboStoreCode").val(),
        ddlTransmode: $("#cboDocBased").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDocumentGeneration").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Control/InsertOrUpdateDocumentGeneration',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objdocgenration },
        success: function (response) {
            if (response.Status) {
               
                toastr.success(response.Message);
                $("#btnSaveDocumentGeneration").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDocumentGeneration").modal('hide');
                fnClearFields();
                fnGridRefreshDocumentGeneration();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDocumentGeneration").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDocumentGeneration").attr("disabled", false);
        }
    });
}

function fnDeleteDocumentGeneration() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    objgen = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DocumentId: $("#cbodocumentId").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        StartDocNumber: $("#txtStartdocNumber").val(),
        CurrentDocDate: $("#dtdocdate").val(),
        TransactionMode: $("#txtTransMode").val(),
        StoreCode: $("#cboStoreCode").val(),
        ddlTransmode: $("#cboDocBased").val(),
        a_status: a_status,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btndeActiveDocumentGeneration").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Control/ActiveOrDeActiveDocumentGeneration',
        type: 'POST',
        datatype: 'json',
        data: { objgen },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDocumentGeneration").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDocumentGeneration").modal('hide');
                fnClearFields();
                fnGridRefreshDocumentGeneration();
                $("#btndeActiveDocumentGeneration").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDocumentGeneration").attr("disabled", false);
                $("#btndeActiveDocumentGeneration").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDocumentGeneration").attr("disabled", false);
            $("#btndeActiveDocumentGeneration").html('De Activate');
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

