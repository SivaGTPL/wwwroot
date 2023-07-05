$(function () {
    fnGridLoadDocumentControlTransactionMode();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDocumentControlTransactionMode",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDocumentControlTransactionMode(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDocumentControlTransactionMode(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDocumentControlTransactionMode(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var _isInsert = true;

function fnBusinessLocation_onChange() {

    fnGridLoadDocumentControlTransactionMode();
}
function fnGridLoadDocumentControlTransactionMode() {

    $("#jqgDocumentControlTransactionMode").GridUnload();

    $("#jqgDocumentControlTransactionMode").jqGrid({
        url: getBaseURL() + '/Transaction/GetDocumentControlTransactionModebyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Businesskey, localization.DocumentId, localization.finYear, localization.TransactionMode,localization.DocumentName, localization.StartDocNumber, localization.CurrentDocNumber, localization.CurrentDocDate, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "DocumentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FinancialYear", width: 40, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            //{ name: "TransactionMode", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "GN: General;TR: Transaction Mode,ST: Store" } },
            { name: "TransactionMode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "DocumentName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "StartDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CurrentDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            
            {
                name: 'CurrentDocDate', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDocumentControlTransactionMode"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDocumentControlTransactionMode",
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
        caption:'Document Control Transaction Mode',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpDocumentControlTransactionMode");
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
    }).jqGrid('navGrid', '#jqpDocumentControlTransactionMode', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDocumentControlTransactionMode', {
         caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDocumentControlTransactionMode
        }).jqGrid('navButtonAdd', '#jqpDocumentControlTransactionMode', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDocumentControlTransactionMode
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgDocumentControlTransactionMode"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddDocumentControlTransactionMode() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select Business key to Add");
        return;
    }
    else {
        $('#PopupDocumentControlTransactionMode').modal('show');
        $('#PopupDocumentControlTransactionMode').modal({ backdrop: 'static', keyboard: false });
        $('#PopupDocumentControlTransactionMode').find('.modal-title').text(localization.AddDocumentControlTransactionMode);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentControlTransactionMode").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveDocumentControlTransactionMode").show();
        $("#btndeActiveDocumentControlTransactionMode").hide();
         _isInsert = true;

    }
}


function fnEditDocumentControlTransactionMode(e, actiontype) {
    var rowid = $("#jqgDocumentControlTransactionMode").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDocumentControlTransactionMode').jqGrid('getRowData', rowid);
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
    $('#txtTransMode').val(rowData.TransactionMode);
       
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);

    $("#txtTransMode").attr('readonly', true);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupDocumentControlTransactionMode').modal('show');
        $('#PopupDocumentControlTransactionMode').find('.modal-title').text(localization.EditDocumentControlTransactionMode);
        $("#btnSaveDocumentControlTransactionMode").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveDocumentControlTransactionMode").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupDocumentControlTransactionMode').modal('show');
        $('#PopupDocumentControlTransactionMode').find('.modal-title').text(localization.ViewDocumentControlTransactionMode);
        $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDocumentControlTransactionMode").hide();
        $("#btndeActiveDocumentControlTransactionMode").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDocumentControlTransactionMode").on('hidden.bs.modal', function () {
            $("#btnSaveDocumentControlTransactionMode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupDocumentControlTransactionMode').modal('show');
        $('#PopupDocumentControlTransactionMode').find('.modal-title').text("Activate/De Activate Transaction Mode");
        $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDocumentControlTransactionMode").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDocumentControlTransactionMode").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDocumentControlTransactionMode").html(localization.Activate);
        }

        $("#btndeActiveDocumentControlTransactionMode").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDocumentControlTransactionMode").on('hidden.bs.modal', function () {
            $("#btnSaveDocumentControlTransactionMode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshDocumentControlTransactionMode() {
    $("#jqgDocumentControlTransactionMode").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelDocumentControlTransactionMode").click(function () {
    $("#jqgDocumentControlTransactionMode").jqGrid('resetSelection');
    $('#PopupDocumentControlTransactionMode').modal('hide');
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
    $("#txtStartdocNumber").attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', false);
    $('#dtdocdate').val('');
    $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);
    $("#btndeActiveDocumentControlTransactionMode").attr("disabled", false);
}


function fnSaveDocumentControlTransactionMode() {
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
    if (IsStringNullorEmpty($("#txtTransMode").val())) {
        toastr.warning("Please Enter the Transaction Mode");
        return;
    }
    objtrans = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DocumentId: $("#cbodocumentId").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        StartDocNumber: $("#txtStartdocNumber").val(),
        CurrentDocDate: getDate($("#dtdocdate")),
        TransactionMode: $("#txtTransMode").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDocumentControlTransactionMode").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Transaction/InsertOrUpdateDocumentControlTransactionMode',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objtrans },
        success: function (response) {
            if (response.Status) {
               
                toastr.success(response.Message);
                $("#btnSaveDocumentControlTransactionMode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDocumentControlTransactionMode").modal('hide');
                fnClearFields();
                fnGridRefreshDocumentControlTransactionMode();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDocumentControlTransactionMode").attr("disabled", false);
        }
    });
}

function fnDeleteDocumentControlTransactionMode() {

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
        a_status: a_status,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btndeActiveDocumentControlTransactionMode").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Transaction/ActiveOrDeActiveDocumentControlTransactionMode',
        type: 'POST',
        datatype: 'json',
        data: { objgen },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDocumentControlTransactionMode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDocumentControlTransactionMode").modal('hide');
                fnClearFields();
                fnGridRefreshDocumentControlTransactionMode();
                $("#btndeActiveDocumentControlTransactionMode").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDocumentControlTransactionMode").attr("disabled", false);
                $("#btndeActiveDocumentControlTransactionMode").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDocumentControlTransactionMode").attr("disabled", false);
            $("#btndeActiveDocumentControlTransactionMode").html('De Activate');
        }
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

