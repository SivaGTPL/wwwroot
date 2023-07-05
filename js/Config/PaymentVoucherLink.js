$(function () {
    fnGridLoadPaymentVoucherLink();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPaymentVoucherLink",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPaymentVucherLink(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPaymentVucherLink(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPaymentVucherLink(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";

function fnGridLoadPaymentVoucherLink() {

    $("#jqgPaymentVoucherLink").GridUnload();

    $("#jqgPaymentVoucherLink").jqGrid({
        url: getBaseURL() + '/Voucher/GetPaymentLinkedVouchers',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PaymentId, localization.PaymentMode, localization.VoucherId, localization.Voucher, localization.Active, localization.Actions],
        colModel: [
            { name: "PaymentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "PaymentMode", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "VoucherId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "Voucher", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPaymentVoucherLink"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpPaymentVoucherLink",
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
        forceFit: true, caption: 'Payment Voucher Link',

        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpPaymentVoucherLink");
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

    }).jqGrid('navGrid', '#jqpPaymentVoucherLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPaymentVoucherLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPaymentVoucherLink
        }).jqGrid('navButtonAdd', '#jqpPaymentVoucherLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPaymentVoucherLink
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPaymentVoucherLink"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPaymentVoucherLink() {

    _isInsert = true;
    fnClearFields();
    $('#PopupPaymentVoucherLink').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupPaymentVoucherLink').find('.modal-title').text(localization.AddPaymentVoucherLink);
    $("#btnSavePaymentVoucherLink").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePaymentVoucherLink").show();
    $("#btnDeactivatePaymentVoucherLink").hide();
    $("#cboPayment").val("0").selectpicker('refresh');
    $("#cboPayment").attr('disabled', false);
    $("#cboVoucher").val("0").selectpicker('refresh');
    $("#cboVoucher").attr('disabled', false);
    $("#btnSavePaymentVoucherLink").attr("disabled", false);

}

function fnEditPaymentVucherLink(e, actiontype) {
    var rowid = $("#jqgPaymentVoucherLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPaymentVoucherLink').jqGrid('getRowData', rowid);

    $("#cboPayment").val(rowData.PaymentId).selectpicker('refresh');
    $("#cboPayment").attr('disabled', true);
    $("#cboVoucher").val(rowData.VoucherId).selectpicker('refresh');
    $("#cboVoucher").attr('disabled', true);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePaymentVoucherLink").attr("disabled", false);
  
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not Authorized to Edit");
            return;
        }
        $('#PopupPaymentVoucherLink').modal('show');

        $('#PopupPaymentVoucherLink').find('.modal-title').text(localization.UpdatePaymentVoucherLink);
        $("#btnSavePaymentVoucherLink").html('<i class="fa fa-sync"></i> '+localization.Update);
        $("#btnSavePaymentVoucherLink").attr('disabled', false);
        $("#btnSavePaymentVoucherLink").show();
        $("#btnDeactivatePaymentVoucherLink").hide();
        $("#chkActiveStatus").prop('disabled', false);
    }


    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupPaymentVoucherLink').modal('show');

        $('#PopupPaymentVoucherLink').find('.modal-title').text(localization.ViewPaymentVoucherLink);
        $("#btnSavePaymentVoucherLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePaymentVoucherLink").hide();
        $("#btnDeactivatePaymentVoucherLink").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPaymentVoucherLink").on('hidden.bs.modal', function () {
            $("#btnSavePaymentVoucherLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupPaymentVoucherLink').modal('show');

        $('#PopupPaymentVoucherLink').find('.modal-title').text(localization.DeletePaymentVoucherLink);
        $("#btnSavePaymentVoucherLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePaymentVoucherLink").hide();
        $("#btnDeactivatePaymentVoucherLink").html('<i class="fa fa-ban"></i> '+localization.Delete);
        $("#btnDeactivatePaymentVoucherLink").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPaymentVoucherLink").on('hidden.bs.modal', function () {
            $("#btnSavePaymentVoucherLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}
function fnClearFields() {
   
    $("#cboPayment").val("0").selectpicker('refresh');
    $("#cboPayment").attr('disabled', false);
    $("#cboVoucher").val("0").selectpicker('refresh');
    $("#cboVoucher").attr('disabled', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePaymentVoucherLink").attr("disabled", false);
    $("#btnDeactivatePaymentVoucherLink").attr("disabled", false);
} 

$("#btnCancelPaymentVoucherLink").click(function () {
    $("#jqgPaymentVoucherLink").jqGrid('resetSelection');
    $('#PopupPaymentVoucherLink').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnGridRefreshPaymentVoucherLink() {
    $("#jqgPaymentVoucherLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSavePaymentVoucherLink() {
   
    if (IsStringNullorEmpty($("#cboPayment").val()) || $("#cboPayment").val() === "0") {
        toastr.warning("Please select a Payment");
        return;
    }
    if (IsStringNullorEmpty($("#cboVoucher").val()) || $("#cboVoucher").val() === "0") {
        toastr.warning("Please select a Voucher");
        return;
    }
    obj = {
        PaymentId: $("#cboPayment").val(),
        VoucherId: $("#cboVoucher").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePaymentVoucherLink").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Voucher/InsertOrUpdatePaymentVoucherLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePaymentVoucherLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPaymentVoucherLink").modal('hide');
                fnClearFields();
                fnGridRefreshPaymentVoucherLink();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePaymentVoucherLink").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePaymentVoucherLink").attr("disabled", false);
        }
    });
}

function fnDeletePaymentVoucherLink() {
   
    $("#btnDeactivatePaymentVoucherLink").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Voucher/DeletePaymentLinkedVoucher?voucherId=' + $("#cboVoucher").val() + '&paymentId=' + $("#cboPayment").val(),
        type: 'POST',

        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivatePaymentVoucherLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPaymentVoucherLink").modal('hide');
                fnClearFields();
                fnGridRefreshPaymentVoucherLink();
                $("#btnDeactivatePaymentVoucherLink").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivatePaymentVoucherLink").attr("disabled", false);
                $("#btnDeactivatePaymentVoucherLink").html(`<i class="fa fa-save"></i> Delete`);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivatePaymentVoucherLink").attr("disabled", false);
            $("#btnDeactivatePaymentVoucherLink").html(`<i class="fa fa-save"></i> Delete`);
        }
    });
}