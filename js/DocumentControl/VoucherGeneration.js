$(function () {
    fnGridLoadVoucherGeneration();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnVoucherGeneration",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditVoucherGeneration(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditVoucherGeneration(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditVoucherGeneration(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var _isInsert = true;

function fnBusinessLocation_onChange() {

    fnGridLoadVoucherGeneration();
}
function fnGridLoadVoucherGeneration() {

    $("#jqgVoucherGeneration").GridUnload();

    $("#jqgVoucherGeneration").jqGrid({
        url: getBaseURL() + '/Voucher/GetVoucherGenerationsbyBusinesskey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Businesskey, localization.finYear, localization.PaymentId, localization.Payment, localization.VoucherId, localization.Voucher, localization.VoucherType, localization.CreditDebitId, localization.StartVoucherNumber, localization.CurrenttVoucherNumber, localization.CurrentVoucherDate, localization.UsageStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FinancialYear", width: 40, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "PaymentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "PaymentMode", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "VoucherId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "Voucher", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "VoucherType", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "P: Payment Voucher;R: Receipt Voucher" } },
            { name: "CreditDebitId", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "C: Credit;D: Debit" } },
            { name: "StartVocucherNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CurrentVoucherNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },

            {
                name: 'CurrentVoucherDate', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "UsageStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnVoucherGeneration"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpVoucherGeneration",
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
        forceFit: true, caption:'Voucher Generation',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpVoucherGeneration");
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
    }).jqGrid('navGrid', '#jqpVoucherGeneration', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpVoucherGeneration', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshVoucherGeneration
        }).jqGrid('navButtonAdd', '#jqpVoucherGeneration', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVoucherGeneration
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgVoucherGeneration"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddVoucherGeneration() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select Business key to Add");
        return;
    }
    else {
        $('#PopupVoucherGeneration').modal('show');
        $('#PopupVoucherGeneration').modal({ backdrop: 'static', keyboard: false });
        $('#PopupVoucherGeneration').find('.modal-title').text(localization.AddVoucherGereration);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveVoucherGeneration").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveVoucherGeneration").show();
        $("#btndeActiveVoucherGeneration").hide();
        _isInsert = true;

    }
}


function fnEditVoucherGeneration(e, actiontype) {
  
    var rowid = $("#jqgVoucherGeneration").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgVoucherGeneration').jqGrid('getRowData', rowid);
    _isInsert = false;
    $('#cboPaymentId').val(rowData.PaymentId).selectpicker('refresh');
    $("#cboPaymentId").next().attr('disabled', true);
    $('#cboVoucherId').val(rowData.VoucherId).selectpicker('refresh');
    $("#cboVoucherId").next().attr('disabled', true);
    $('#cboVoucherType').val(rowData.VoucherType).selectpicker('refresh');
    $("#cboVoucherType").next().attr('disabled', true);
    $('#txtfinancialyear').val(rowData.FinancialYear);
    $("#txtfinancialyear").attr('readonly', true);
    $('#txtStartVoucherNumber').val(rowData.StartVocucherNumber);
    $('#txtCurrentVoucherNumber').val(rowData.CurrentVoucherNumber);
    $("#dtvoucherdate").attr('readonly', true);
   
    if (rowData.CurrentVoucherDate !== null) {
        setDate($('#dtvoucherdate'), fnGetDateFormat(rowData.CurrentVoucherDate));
    }
    else {
        $('#dtvoucherdate').val('');
    }
    $('#cboCreditDebit').val(rowData.CreditDebitId).selectpicker('refresh');
   
    if (rowData.UsageStatus == 'true') {
        $("#chkUsageStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkUsageStatus").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveVoucherGeneration").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupVoucherGeneration').modal('show');
        $('#PopupVoucherGeneration').find('.modal-title').text(localization.EditVoucherGereration);
        $("#btnSaveVoucherGeneration").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveVoucherGeneration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveVoucherGeneration").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupVoucherGeneration').modal('show');
        $('#PopupVoucherGeneration').find('.modal-title').text(localization.ViewVoucherGereration);
        $("#btnSaveVoucherGeneration").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveVoucherGeneration").hide();
        $("#btndeActiveVoucherGeneration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkUsageStatus").prop('disabled', true);
        $("#PopupVoucherGeneration").on('hidden.bs.modal', function () {
            $("#btnSaveVoucherGeneration").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupVoucherGeneration').modal('show');
        $('#PopupVoucherGeneration').find('.modal-title').text("Activate/De Activate Voucher Genaration");
        $("#btnSaveVoucherGeneration").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveVoucherGeneration").hide();
        $("#chkUsageStatus").prop('disabled', true);
        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveVoucherGeneration").html(localization.DActivate);
        }
        else {
            $("#btndeActiveVoucherGeneration").html(localization.Activate);
        }

        $("#btndeActiveVoucherGeneration").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupVoucherGeneration").on('hidden.bs.modal', function () {
            $("#btnSaveVoucherGeneration").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshVoucherGeneration() {
    $("#jqgVoucherGeneration").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelVoucherGeneration").click(function () {
    $("#jqgVoucherGeneration").jqGrid('resetSelection');
    $('#PopupVoucherGeneration').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cboPaymentId').val('0').selectpicker('refresh');
    $("#cboPaymentId").next().attr('disabled', false);
    $('#cboVoucherId').val('0').selectpicker('refresh');
    $("#cboVoucherId").next().attr('disabled', false);
    $('#cboVoucherType').val('0').selectpicker('refresh');
    $("#cboVoucherType").next().attr('disabled', false);
    $("#txtfinancialyear").val('');
    $("#txtfinancialyear").attr('readonly', false);
    $("#txtStartVoucherNumber").val('');
    $("#txtStartVoucherNumber").attr('readonly', false);
    $("#txtCurrentVoucherNumber").val('');
    $("#txtCurrentVoucherNumber").attr('readonly', false);
    $('#cboCreditDebit').val('0').selectpicker('refresh');
    $("#cboCreditDebit").next().attr('disabled', false);
    $("#dtvoucherdate").attr('readonly', true);
    $('#dtvoucherdate').val('');
    $("#chkUsageStatus").parent().removeClass("is-checked");
    $("#chkUsageStatus").prop('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveVoucherGeneration").attr("disabled", false);
    $("#btndeActiveVoucherGeneration").attr("disabled", false);
}


function fnSaveVoucherGeneration() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key");
        return;
    }
    if (IsStringNullorEmpty($("#txtfinancialyear").val())) {
        toastr.warning("Please Enter the Financial Year");
        return;
    }
    if (IsStringNullorEmpty($("#cboPaymentId").val()) || $("#cboPaymentId").val() === "0") {
        toastr.warning("Please select a Payment");
        return;
    }
    if (IsStringNullorEmpty($("#cboVoucherId").val()) || $("#cboVoucherId").val() === "0") {
        toastr.warning("Please select a Voucher");
        return;
    }
    if (IsStringNullorEmpty($("#cboVoucherType").val()) || $("#cboVoucherType").val() === "0") {
        toastr.warning("Please select a Voucher Type");
        return;
    }
   
    if (IsStringNullorEmpty($("#txtStartVoucherNumber").val())) {
        toastr.warning("Please Enter the Start Voucher Number");
        return;
    }

    if (IsStringNullorEmpty($("#cboCreditDebit").val()) || $("#cboCreditDebit").val() === "0") {
        toastr.warning("Please select a CreditDebit");
        return;
    }

    obj_voch = {
        BusinessKey: $("#cboBusinessLocation").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        PaymentId: $("#cboPaymentId").val(),
        VoucherId: $("#cboVoucherId").val(),
        VoucherType: $("#cboVoucherType").val(),
        StartVocucherNumber: $("#txtStartVoucherNumber").val(),
        CurrentVoucherNumber: $("#txtCurrentVoucherNumber").val(),
        CurrentVoucherDate: getDate($("#dtvoucherdate")),
        CreditDebitId: $("#cboCreditDebit").val(),
        UsageStatus: $("#chkUsageStatus").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveVoucherGeneration").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Voucher/InsertOrUpdateVoucherGeneration',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_voch },
        success: function (response) {
            if (response.Status) {

                toastr.success(response.Message);
                $("#btnSaveVoucherGeneration").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupVoucherGeneration").modal('hide');
                fnClearFields();
                fnGridRefreshVoucherGeneration();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveVoucherGeneration").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveVoucherGeneration").attr("disabled", false);
        }
    });
}

function fnDeleteVoucherGeneration() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    objdel = {
        BusinessKey: $("#cboBusinessLocation").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        PaymentId: $("#cboPaymentId").val(),
        VoucherId: $("#cboVoucherId").val(),
        VoucherType: $("#cboVoucherType").val(),
        StartVocucherNumber: $("#txtStartVoucherNumber").val(),
        CurrentVoucherNumber: $("#txtCurrentVoucherNumber").val(),
        CurrentVoucherDate: getDate($("#dtvoucherdate")),
        CreditDebitId: $("#cboCreditDebit").val(),
        UsageStatus: $("#chkUsageStatus").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        a_status: a_status,
    };

    $("#btndeActiveVoucherGeneration").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Voucher/ActiveOrDeActiveVoucherGeneration',
        type: 'POST',
        datatype: 'json',
        data: { objdel },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveVoucherGeneration").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupVoucherGeneration").modal('hide');
                fnClearFields();
                fnGridRefreshVoucherGeneration();
                $("#btndeActiveVoucherGeneration").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveVoucherGeneration").attr("disabled", false);
                $("#btndeActiveVoucherGeneration").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveVoucherGeneration").attr("disabled", false);
            $("#btndeActiveVoucherGeneration").html('De Activate');
        }
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
  
}

