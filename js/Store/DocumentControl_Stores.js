$(function () {
    fnGridLoadDocumentGeneration();
    //$("#labtransmode").hide();
    //$("#txtTransMode").hide();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDocumentGeneration",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDocumentGeneration(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDocumentGeneration(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDocumentGeneration(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var _isInsert = true;

function fnDocumentBasedOn() {

    fnGridLoadDocumentGeneration();

    //var docBased = $("#cboDocBased").val();

    //if (docBased == "GN") {

    //    $("#divStoreCode").hide();
    //    $("#labtransmode").hide();
    //    $("#txtTransMode").hide();
    //    $("#jqgDocumentGeneration").hideCol("TransactionMode");
    //    $("#jqgDocumentGeneration").hideCol("StoreName");

    //}
    //if (docBased == "TR") {

    //    $("#divStoreCode").hide();
    //    $("#labtransmode").show();
    //    $("#txtTransMode").show();
    //    $("#jqgDocumentGeneration").hideCol("StoreName");
    //    $("#jqgDocumentGeneration").showCol("TransactionMode");
    //}

    //if (docBased == "ST") {
    //    $("#divStoreCode").show();
    //    $("#labtransmode").show();
    //    $("#txtTransMode").show();
    //    $("#jqgDocumentGeneration").showCol("TransactionMode");
    //    $("#jqgDocumentGeneration").showCol("StoreName");
    //}
    //else {
    //    $("#divStoreCode").hide();
    //}
}

function fnBusinessLocation_onChange() {

    fnGridLoadDocumentGeneration();
}
function fnGridLoadDocumentGeneration() {

    $("#jqgDocumentGeneration").GridUnload();

    $("#jqgDocumentGeneration").jqGrid({
        url: getBaseURL() + '/Stores/DocumentControl/GetDocumentGenerationsbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val() + '&Transactionmode=' + $("#cboDocBased").val(),
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
            { name: "TransactionMode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "StoreCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "StoreName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "DocumentName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "StartDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CurrentDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },

            {
                name: 'CurrentDocDate', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDocumentGeneration"><i class="fa fa-ellipsis-v"></i></button>'
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
        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

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
        toastr.warning("Please select a Business key to Add");
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
    var rowid = $("#jqgDocumentGeneration").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDocumentGeneration').jqGrid('getRowData', rowid);
    _isInsert = false;

    $('#cbodocumentId').val(rowData.DocumentId).selectpicker('refresh');
    $("#cbodocumentId").next().attr('disabled', true);
    $('#txtfinancialyear').val(rowData.FinancialYear);
    $("#txtfinancialyear").attr('readonly', true);
    $('#txtStartdocNumber').val(rowData.StartDocNumber);
    $('#txtcurrentdocNumber').val(rowData.CurrentDocNumber);
    $("#dtdocdate").attr('readonly', true);
   
    if (rowData.CurrentDocDate !== null) {
        setDate($('#dtdocdate'), fnGetDateFormat(rowData.CurrentDocDate));
    }
    else {
        $('#dtdocdate').val('');
    }

    if (!IsStringNullorEmpty(rowData.TransactionMode)) {
        $('#txtTransMode').val(rowData.TransactionMode);
        $('#labtransmode').show();
        $('#txtTransMode').show();
    }
    else {
        $('#txtTransMode').val('');
        $('#labtransmode').hide();
        $('#txtTransMode').hide();
    }

    if (!IsStringNullorEmpty(rowData.StoreCode) && rowData.StoreCode !== "0") {
        $('#cboStoreCode').val(rowData.StoreCode).selectpicker('refresh');
        $("#divStoreCode").show();
    }
    else {
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
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupDocumentGeneration').modal('show');
        $('#PopupDocumentGeneration').find('.modal-title').text(localization.EditDocumentGereration);
        $("#btnSaveDocumentGeneration").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveDocumentGeneration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentGeneration").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupDocumentGeneration').modal('show');
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
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupDocumentGeneration').modal('show');
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
        toastr.warning("Please select a Business key");
        return;
    }
    if (IsStringNullorEmpty($("#cbodocumentId").val()) || $("#cbodocumentId").val() === "0") {
        toastr.warning("Please select a Document");
        return;
    }
    if (IsStringNullorEmpty($("#txtfinancialyear").val())) {
        toastr.warning("Please Enter the Financial Year");
        return;
    }
    if (IsStringNullorEmpty($("#txtStartdocNumber").val())) {
        toastr.warning("Please Enter the Start Document");
        return;
    }

    if ($("#cboDocBased").val() == "TR" && IsStringNullorEmpty($("#txtTransMode").val())) {
        toastr.warning("Please Enter the Transaction Mode");
        return;
    }
    if ($("#cboDocBased").val() == "ST") {
        if (IsStringNullorEmpty($("#txtTransMode").val())) {
            toastr.warning("Please Enter the Transaction Mode");
            return;
        }
        if (IsStringNullorEmpty($("#cboStoreCode").val()) || $("#cboStoreCode").val() === "0") {
            toastr.warning("Please select a Store Code");
            return;
        }
    }


    objdocgenration = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DocumentId: $("#cbodocumentId").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        StartDocNumber: $("#txtStartdocNumber").val(),
        CurrentDocDate: getDate($("#dtdocdate")),
        TransactionMode: $("#txtTransMode").val(),
        StoreCode: $("#cboStoreCode").val(),
        ddlTransmode: $("#cboDocBased").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDocumentGeneration").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Stores/DocumentControl/InsertOrUpdateDocumentGeneration',
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
        CurrentDocDate: getDate($("#dtdocdate")),
        TransactionMode: $("#txtTransMode").val(),
        StoreCode: $("#cboStoreCode").val(),
        ddlTransmode: $("#cboDocBased").val(),
        a_status: a_status,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btndeActiveDocumentGeneration").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Stores/DocumentControl/ActiveOrDeActiveDocumentGeneration',
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
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

