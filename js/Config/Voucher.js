$(function () {
    fnGridLoadVouchers();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnVoucher",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditVoucher(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditVoucher(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditVoucher(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";

function fnGridLoadVouchers() {

    $("#jqgVoucher").GridUnload();

    $("#jqgVoucher").jqGrid({
        url: getBaseURL() + '/Voucher/GetPaymentVouchers',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.VoucherId, localization.TransactionType, localization.VoucherDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "VoucherId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TransactionType", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "VoucherDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnVoucher"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
            
        ],

        pager: "#jqpVoucher",
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
        caption:'Voucher',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpVoucher");
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

    }).jqGrid('navGrid', '#jqpVoucher', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpVoucher', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshVoucher
        }).jqGrid('navButtonAdd', '#jqpVoucher', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVoucher
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgVoucher"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddVoucher() {

    _isInsert = true;
    fnClearFields();
    $('#PopupVoucher').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupVoucher').find('.modal-title').text(localization.AddVoucher);
    $("#btnSaveVoucher").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveVoucher").show();
    $("#btnDeactivateVoucher").hide();
    $("#txtTransactionType").val('');
    $("#txtTransactionType").attr('disabled', false);
    $("#txtVoucherDes").val('');
    $("#txtVoucherDes").attr('disabled', false);
    $("#txtVoucherId").val('');
    $("#txtVoucherId").attr('disabled', false);
    $("#btnSaveVoucher").attr("disabled", false);

}

function fnEditVoucher(e, actiontype) {
    var rowid = $("#jqgVoucher").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgVoucher').jqGrid('getRowData', rowid);

    $("#txtVoucherId").val(rowData.VoucherId);
    $("#txtVoucherId").attr('disabled', true);
    $("#txtTransactionType").val(rowData.TransactionType);
    $("#txtVoucherDes").val(rowData.VoucherDesc);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveVoucher").attr("disabled", false);
   
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupVoucher').modal('show');

        $('#PopupVoucher').find('.modal-title').text(localization.UpdateVoucher);
        $("#btnSaveVoucher").html('<i class="fa fa-sync"></i> '+localization.Update);
        $("#btnSaveVoucher").attr('disabled', false);
        $("#btnSaveVoucher").show();
        $("#btnDeactivateVoucher").hide();
        $("#chkActiveStatus").prop('disabled', true);
    }


    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupVoucher').modal('show');

        $('#PopupVoucher').find('.modal-title').text(localization.ViewVoucher);
        $("#btnSaveVoucher").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveVoucher").hide();
        $("#btnDeactivateVoucher").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupVoucher").on('hidden.bs.modal', function () {
            $("#btnSaveVoucher").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupVoucher').modal('show');

        $('#PopupVoucher').find('.modal-title').text(localization.DeleteVoucher);
        $("#btnSaveVoucher").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveVoucher").hide();
        $("#btnDeactivateVoucher").html('<i class="fa fa-ban"></i> '+localization.Delete);
        $("#btnDeactivateVoucher").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupVoucher").on('hidden.bs.modal', function () {
            $("#btnSaveVoucher").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}
function fnClearFields() {
    $("#txtVoucherId").val('');
    $("#txtTransactionType").val('');
    $("#txtVoucherDes").val('');
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveVoucher").attr("disabled", false);
    $("#btnDeactivateVoucher").attr("disabled", false);
}

$("#btnCancelVoucher").click(function () {
    $("#jqgVoucher").jqGrid('resetSelection');
    $('#PopupVoucher').modal('hide');
    fnClearFields();
});

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

function fnGridRefreshVoucher() {
    $("#jqgVoucher").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveVoucher() {
    if (IsStringNullorEmpty($("#txtVoucherId").val())) {
        toastr.warning("Please Enter a Voucher Id");
        return;
    }
    if (IsStringNullorEmpty($("#txtTransactionType").val())) {
        toastr.warning("Please Enter the Transaction Type");
        return;
    }
    if (IsStringNullorEmpty($("#txtVoucherDes").val())) {
        toastr.warning("Please Enter the Voucher Description");
        return;
    }
    obj_voucher = {
        VoucherId: $("#txtVoucherId").val(),
        TransactionType: $("#txtTransactionType").val(),
        VoucherDesc: $("#txtVoucherDes").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveVoucher").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Voucher/InsertOrUpdatePaymentVoucher',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_voucher},
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveVoucher").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupVoucher").modal('hide');
                fnClearFields();
                fnGridRefreshVoucher();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveVoucher").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveVoucher").attr("disabled", false);
        }
    });
}

function fnDeleteVoucher() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    objdel = {
        PaymentId: $("#txtPaymentId").val(),
        PaymentModeId: $("#cboPaymentModeId").val(),
        PaymentModeCategoryId: $("#cboPaymentModecategoryId").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        a_status: a_status,
    };
    $("#btnDeactivateVoucher").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Voucher/ActiveOrDeActivePaymentVoucher?status=' + a_status + '&voucherId=' + $("#txtVoucherId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateVoucher").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupVoucher").modal('hide');
                fnClearFields();
                fnGridRefreshVoucher();
                $("#btnDeactivateVoucher").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateVoucher").attr("disabled", false);
                $("#btnDeactivateVoucher").html('Delete');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateVoucher").attr("disabled", false);
            $("#btnDeactivateVoucher").html('Delete');
        }
    });
}