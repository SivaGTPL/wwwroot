var actiontype = "";
$(document).ready(function () {
    fnGridLoadStoreCodes();
});
function fnGridLoadStoreCodes() {
    $("#jqgStoreMaster").jqGrid({
        url: getBaseURL() + '/Inventory/GetStoreCodes',
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
            //{ name: "ActiveStatus", editable: true, width: 60, edittype: "select", align: 'left', formatter: 'select', editoptions: { value: "true:Active;false:Inactive" } },

            {
                name: 'action', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditStoreCodes(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView", onclick="return fnEditStoreCodes(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        //'<button onclick=" return fnDeleteStoreCode(event)" id="jqgDelete", class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid"><i class="fa fa-trash"></i>  ' + localization.Delete + '</button>'
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditStoreCodes(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                }
            }

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth:55,
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
        loadonce: true,
        caption:'Store Master',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgStoreMaster");
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
    $("#btnSaveStoreMaster").html('<i class="fa fa-save"></i>  ' + localization.Save);
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveStoreMaster").show();
    $("#btnDeactivateStoreMaster").hide();
    $("#PopupStoreMaster").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}

function fnEditStoreCodes(e, actiontype) {
   
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
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
        url: getBaseURL() + "/Inventory/GetStoreParameterList?StoreCode=" + $("#txtStoreCode").val(),
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

    $('#PopupStoreMaster').modal('show');
    if (actiontype.trim() == "edit") {
        $("input[type=checkbox]").attr('disabled', false);
        $('#PopupStoreMaster').find('.modal-title').text(localization.EditStore);
        $("#btnSaveStoreMaster").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnSaveStoreMaster").attr('disabled', false);
        $("#btnDeactivateStoreMaster").hide();
        $("#btnSaveStoreMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupStoreMaster").on('hidden.bs.modal', function () {
            $("input[type=checkbox]").attr('disabled', true);
        });
    }

    if (actiontype.trim() == "view") {
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
    if (fnValidateStoreCodes() === false) {
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
        url: getBaseURL() + '/Inventory/InsertOrUpdateStoreCodes',
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

function fnValidateStoreCodes() {
    if ($("#cboStoreType").val() === "0" || $("#cboStoreType").val() === "") {
        toastr.warning("Please Select a Store Type");
        return false;
    }
    if (IsStringNullorEmpty($("#txtStoreDescription").val())) {
        toastr.warning("Please Enter the Store Description");
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
        url: getBaseURL() + '/Inventory/ActiveOrDeActiveStoreCode?status=' + a_status + '&storetype=' + $("#cboStoreType").val() + '&storecode=' + $("#txtStoreCode").val(),
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
//                className: 'mdl-button  primary-button'
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

