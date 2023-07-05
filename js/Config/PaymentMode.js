$(function () {
    fnGridLoadPaymentMode();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnVoucherPaymentMode",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPaymentMode(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPaymentMode(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPaymentMode(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";

function fnGridLoadPaymentMode() {

    $("#jqgPaymentMode").GridUnload();

    $("#jqgPaymentMode").jqGrid({
        url: getBaseURL() + '/Voucher/GetPaymentModes',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PaymentId, "", localization.PaymentMode, "", localization.PaymentModecategory,localization.Active, localization.Actions],
        colModel: [
            { name: "PaymentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "PaymentModeId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "PaymentMode", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "PaymentModeCategoryId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "PaymentCategory", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            //{
            //    name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {

            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditPaymentMode(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditPaymentMode(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditPaymentMode(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnVoucherPaymentMode"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpPaymentMode",
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
        forceFit: true, caption:'Payment Mode',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpPaymentMode");
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

    }).jqGrid('navGrid', '#jqpPaymentMode', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPaymentMode', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPaymentMode
        }).jqGrid('navButtonAdd', '#jqpPaymentMode', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPaymentMode
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPaymentMode"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPaymentMode() {

    _isInsert = true;
    fnClearFields();
    $('#PopupPaymentMode').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupPaymentMode').find('.modal-title').text(localization.AddPaymentMode);
    $("#btnSavePaymentMode").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePaymentMode").show();
    $("#btnDeactivatePaymentMode").hide();
    $("#cboPaymentModeId").val("0").selectpicker('refresh');
    $("#cboPaymentModeId").attr('disabled', false);
    $("#cboPaymentModecategoryId").val("0").selectpicker('refresh');
    $("#cboPaymentModecategoryId").attr('disabled', false);
    $("#txtPaymentId").val('');
    $("#txtPaymentId").attr('disabled', false);
    $("#btnSavePaymentMode").attr("disabled", false);

}

function fnEditPaymentMode(e, actiontype) {
   
    var rowid = $("#jqgPaymentMode").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPaymentMode').jqGrid('getRowData', rowid);
    $("#txtPaymentId").val(rowData.PaymentId);
    $("#txtPaymentId").attr('disabled', true);
    $("#cboPaymentModeId").val(rowData.PaymentModeId).selectpicker('refresh');
    $("#cboPaymentModeId").attr('disabled', true);
    $("#cboPaymentModecategoryId").val(rowData.PaymentModeCategoryId).selectpicker('refresh');
    $("#cboPaymentModecategoryId").attr('disabled', true);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePaymentMode").attr("disabled", false);
   
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupPaymentMode').modal('show');

        $('#PopupPaymentMode').find('.modal-title').text(localization.UpdatePaymentMode);
        $("#btnSavePaymentMode").html('<i class="fa fa-sync"></i> '+localization.Update);
        $("#btnSavePaymentMode").attr('disabled', false);
        $("#btnSavePaymentMode").show();
        $("#btnDeactivatePaymentMode").hide();
        $("#chkActiveStatus").prop('disabled', false);
    }
   

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupPaymentMode').modal('show');
        $('#PopupPaymentMode').find('.modal-title').text(localization.ViewPaymentMode);
        $("#btnSavePaymentMode").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePaymentMode").hide();
        $("#btnDeactivatePaymentMode").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPaymentMode").on('hidden.bs.modal', function () {
            $("#btnSavePaymentMode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupPaymentMode').modal('show');
        $('#PopupPaymentMode').find('.modal-title').text(localization.DeletePaymentMode);
        $("#btnSavePaymentMode").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePaymentMode").hide();
        $("#btnDeactivatePaymentMode").html('<i class="fa fa-ban"></i> '+localization.Delete);
        $("#btnDeactivatePaymentMode").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPaymentMode").on('hidden.bs.modal', function () {
            $("#btnSavePaymentMode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}
function fnClearFields() {
    $("#txtPaymentId").val('');
    $("#cboPaymentModeId").val("0").selectpicker('refresh');
    $("#cboPaymentModeId").attr('disabled', false);
    $("#cboPaymentModecategoryId").val("0").selectpicker('refresh');
    $("#cboPaymentModecategoryId").attr('disabled', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePaymentMode").attr("disabled", false);
    $("#btnDeactivatePaymentMode").attr("disabled", false);
}

$("#btnCancelPaymentMode").click(function () {
    $("#jqgPaymentMode").jqGrid('resetSelection');
    $('#PopupPaymentMode').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnGridRefreshPaymentMode() {
    $("#jqgPaymentMode").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSavePaymentMode() {
    if (IsStringNullorEmpty($("#txtPaymentId").val())) {
        toastr.warning("Please Enter a Payment Id");
        return;
    }
    if (IsStringNullorEmpty($("#cboPaymentModeId").val()) || $("#cboPaymentModeId").val() === "0") {
        toastr.warning("Please select the Payment Mode");
        return;
    }
    if (IsStringNullorEmpty($("#cboPaymentModecategoryId").val()) || $("#cboPaymentModecategoryId").val() === "0") {
        toastr.warning("Please select the Payment Mode category");
        return;
    }
    obj = {
        PaymentId: $("#txtPaymentId").val(),
        PaymentModeId: $("#cboPaymentModeId").val(),
        PaymentModeCategoryId: $("#cboPaymentModecategoryId").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePaymentMode").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Voucher/InsertOrUpdatePaymentMode',
        type: 'POST',
        datatype: 'json',
        data: {obj},
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePaymentMode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPaymentMode").modal('hide');
                fnClearFields();
                fnGridRefreshPaymentMode();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePaymentMode").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePaymentMode").attr("disabled", false);
        }
    });
}

function fnDeletePaymentMode() {
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
    $("#btnDeactivatePaymentMode").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Voucher/ActiveOrDeActivePaymentMode',
        type: 'POST',
        datatype: 'json',
        data: { obj: objdel},
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivatePaymentMode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPaymentMode").modal('hide');
                fnClearFields();
                fnGridRefreshPaymentMode();
                $("#btnDeactivatePaymentMode").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivatePaymentMode").attr("disabled", false);
                $("#btnDeactivatePaymentMode").html('Delete');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivatePaymentMode").attr("disabled", false);
            $("#btnDeactivatePaymentMode").html('Delete');
        }
    });
}