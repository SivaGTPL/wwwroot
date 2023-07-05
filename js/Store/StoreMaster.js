﻿var actiontype = "";
$(document).ready(function () {
    fnGridLoadStoreCodes();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnStoreMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditStoreCodes(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditStoreCodes(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditStoreCodes(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
function fnGridLoadStoreCodes() {
    $("#jqgStoreMaster").jqGrid({
        url: getBaseURL() + '/ManageStores/GetStoreCodes',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Store Codes", localization.StoreType, localization.StoreDescription, localization.Active, localization.Actions],

        colModel: [

            { name: "StoreCode", width: 10, editable: true, align: 'left', editoptions: { maxlength: 25 }, hidden: true },
            { name: "StoreType", editable: true, width: 60, edittype: "select", align: 'left', formatter: 'select', editoptions: { value: "M:Main Store;S:Sub Store;D:Department" } },
            {
                name: "StoreDesc", width: 150, editable: true, editoptions: { size: "40", maxlength: "25" }, edittype: "text"
            },
            { name: "ActiveStatus", editable: false, width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnStoreMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth: 55,
        emptyrecords: "No records to Veiw",
        pager: "#jqpStoreMaster",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true, caption:'Store Master',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen('jqgStoreMaster');
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

    }).jqGrid('navGrid', '#jqpStoreMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpStoreMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshStoreCodes
    }).jqGrid('navButtonAdd', '#jqpStoreMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddStoreCodes
    });
    fnAddGridSerialNoHeading();
}

function fnAddStoreCodes() {
    fnClearFields();
    $("#PopupStoreMaster").modal('show');
    $('#PopupStoreMaster').find('.modal-title').text(localization.AddStore);
    $("input[type=checkbox]").attr('disabled', false);
    $("#btnSaveStoreMaster").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveStoreMaster").show();
    $("#btnDeactivateStoreMaster").hide();
    $("#PopupStoreMaster").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}

function fnEditStoreCodes(e, actiontype) {
    var rowid = $("#jqgStoreMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgStoreMaster').jqGrid('getRowData', rowid);
    $('#txtStoreCode').val(rowData.StoreCode);
    $("#cboStoreType").val(rowData.StoreType).selectpicker('refresh');
    $("#cboStoreType").attr('disabled', true);
    $("#txtStoreDescription").val(rowData.StoreDesc);
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
    eSyaParams.ClearValue();

    $.ajax({
        async: false,
        url: getBaseURL() + "/ManageStores/GetStoreParameterList?StoreCode=" + $("#txtStoreCode").val(),
        type: 'POST',
        datatype: 'json',
        success: function (result) {
            if (result != null) {
                eSyaParams.SetJSONValue(result.l_FormParameter);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("your Not Authorized to Edit");
            return;
        }
        $('#PopupStoreMaster').modal('show');
        $("input[type=checkbox]").attr('disabled', false);
        $('#PopupStoreMaster').find('.modal-title').text(localization.EditStore);
        $("#btnSaveStoreMaster").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveStoreMaster").attr('disabled', false);
        $("#btnDeactivateStoreMaster").hide();
        $("#btnSaveStoreMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupStoreMaster").on('hidden.bs.modal', function () {
            $("input[type=checkbox]").attr('disabled', true);
        });
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("your Not Authorized to View");
            return;
        }
        $('#PopupStoreMaster').modal('show');
        $('#PopupStoreMaster').find('.modal-title').text(localization.ViewStore);
        $("#btnSaveStoreMaster,#btnDeactivateStoreMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupStoreMaster").on('hidden.bs.modal', function () {
            $("#btnSaveStoreMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("your Not Authorized to Delete");
            return;
        }
        $('#PopupStoreMaster').modal('show');
        $('#PopupStoreMaster').find('.modal-title').text("Active/De Active Store");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateStoreMaster").html(localization.DeActivate);
        }
        else {
            $("#btnDeactivateStoreMaster").html(localization.Activate);
        }
        $("#btnSaveStoreMaster").hide();
        $("#btnDeactivateStoreMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupStoreMaster").on('hidden.bs.modal', function () {
            $("#btnSaveStoreMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }
}

function fnSaveStoreCodes() {
    if (validateStoreCodes() === false) {
        return;
    }

    $("#btnSaveStoreMaster").attr('disabled', true);

    storecodes = {
        StoreType: $("#cboStoreType").val(),
        StoreCode: $("#txtStoreCode").val() === '' ? 0 : $("#txtStoreCode").val(),
        StoreDesc: $("#txtStoreDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    var fmParams = eSyaParams.GetJSONValue();
    storecodes.l_FormParameter = fmParams;

    $.ajax({
        url: getBaseURL() + '/ManageStores/InsertOrUpdateStoreCodes',
        type: 'POST',
        datatype: 'json',
        data: { storecodes },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveStoreMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveStoreMaster").attr('disabled', false);
                $("#PopupStoreMaster").modal('hide');
                fnGridRefreshStoreCodes();


            }
            else {
                toastr.error(response.Message);
                $("#btnSaveStoreMaster").attr('disabled', false);
            }
            $("#btnSaveStoreMaster").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveStoreMaster").attr("disabled", false);
        }
    });
}

function validateStoreCodes() {
    if ($("#cboStoreType").val() === "0" || $("#cboStoreType").val() === "") {
        toastr.warning("Please Select Store Type");
        return false;
    }
    if (IsStringNullorEmpty($("#txtStoreDescription").val())) {
        toastr.warning("Please Enter Store Description");
        return false;
    }

}

function fnGridRefreshStoreCodes() {
    $("#jqgStoreMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtStoreCode").val("");
    $("#cboStoreType").attr('disabled', false);
    $("#cboStoreType").val("0").selectpicker('refresh');
    $("#txtStoreDescription").val("");
    $("#chkActiveStatus").parent().addClass("is-checked");
    eSyaParams.ClearValue();
    $("#btnSaveStoreMaster").attr('disabled', false);
    //$('#cboActiveStatus').val("true").selectpicker('refresh');
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteStoreMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateStoreMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ManageStores/ActiveOrDeActiveStoreCode?status=' + a_status + '&storetype=' + $("#cboStoreType").val() + '&storecode=' + $("#txtStoreCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateStoreMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupStoreMaster").modal('hide');
                fnGridRefreshStoreCodes();
                fnClearFields();
                $("#btnDeactivateStoreMaster").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateStoreMaster").attr("disabled", false);
                $("#btnDeactivateStoreMaster").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateStoreMaster").attr("disabled", false);
            $("#btnDeactivateStoreMaster").html(localization.DeActivate);
        }
    });
}

//function fnDeleteStoreCode(e) {

//    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
//    var rowData = $('#jqgStoreMaster').jqGrid('getRowData', rowid);
//    var id = rowData.StoreCode;
//    bootbox.confirm({
//        title: 'Store Code',
//        message: "Are you sure you want to delete ?",
//        buttons: {
//            confirm: {
//                label: 'Yes',
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent primary-button'
//            },
//            cancel: {
//                label: 'No',
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
//            }
//        },
//        callback: function (result) {
//            if (result == true) {
//                if (id == null || id == undefined || id == "0" || id == '') {
//                    alert("Could not Delete");
//                    return false;
//                }
//                $.ajax({
//                    type: 'POST',
//                    url: getBaseURL() + '/Inventory/DeleteStoreCode',
//                    data: { StoreCode: id },
//                    success: function (response) {
//                        if (response.Status) {
//                            toastr.success(response.Message);
//                            fnGridRefreshStoreCodes();

//                            return true;
//                        }
//                        else {
//                            toastr.error(response.Message);
//                            return false;
//                            fnGridRefreshStoreCodes();
//                        }
//                    },
//                    error: function (response) {
//                        alert("Couldn't Delete");
//                    }
//                });

//            }
//        }
//    });
//}

