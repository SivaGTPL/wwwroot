var Isadd = 0;
$(document).ready(function () {
    fnGridLoadInventoryRules();
});

function fnGridLoadInventoryRules() {
   
    $("#jqgInventoryRules").jqGrid('GridUnload');
    $("#jqgInventoryRules").jqGrid({
        url: getBaseURL() + '/Inventory/GetInventoryRules',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.InventoryRuleID, localization.RuleDescription, localization.RuleinDays, localization.ApplyToSRN, localization.Active, localization.Actions],
        colModel: [
            { name: "InventoryRuleId", width: 70, editable: true, align: 'left', hidden: false },
            { name: "InventoryRuleDesc", width: 170, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "InventoryRule", width: 45, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ApplyToSrn", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditInventoryRules(event,\'edit\')"><i class="fas fa-pen"></i>' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView", onclick="return fnEditInventoryRules(event,\'view\')"><i class="far fa-eye"></i>' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditInventoryRules(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'

                }
            },
        ],
        rowNum: 10,
        rownumWidth:55,
        loadonce: false,
        pager: "#jqpInventoryRules",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'Inventory Rules',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgInventoryRules");
        },
    }).jqGrid('navGrid', '#jqpInventoryRules', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqgInventoryRules', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshInventoryRules
    }).jqGrid('navButtonAdd', '#jqpInventoryRules', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddInventoryRules
        }); fnAddGridSerialNoHeading();
}

function fnAddInventoryRules() {
   fnClearFields();
   Isadd = 1;
   $('#PopupInventoryRules').modal('show');
    $('#PopupInventoryRules').modal({ backdrop: 'static', keyboard: false });
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $('#PopupInventoryRules').find('.modal-title').text(localization.AddInventoryRules);
    $("#btnSaveInventoryRules").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveInventoryRules").show();
    $("#btnDeactivateInventoryRules").hide();
}

function fnEditInventoryRules(e,actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgInventoryRules').jqGrid('getRowData', rowid);
    $('#cboInventoryRule').val(rowData.InventoryRuleId);
    $('#cboInventoryRule').selectpicker('refresh');
    $("#cboInventoryRule").prop('disabled', true);
    $('#cboInventoryRule').selectpicker('refresh');
    $('#txtRuleDescription').val(rowData.InventoryRuleDesc);
    $('#txtRuleInDays').val(rowData.InventoryRule);
    if (rowData.ApplyToSrn == 'true') {
        $("#chkApplyToSRN").parent().addClass("is-checked");
    }
    else {
        $("#chkApplyToSRN").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateInventoryRules").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateInventoryRules").html(localization.Activate);
    }
    $("#chkActiveStatus").prop('disabled', true);
    Isadd = 0;
    $('#PopupInventoryRules').modal('show');
    $('#PopupInventoryRules').find('.modal-title').text(localization.UpdateInventoryRules);
    $("#btnSaveInventoryRules").html('<i class="fa fa-sync"></i>' + localization.Update);

    if (actiontype.trim() == "edit") {
        $("#btnSaveInventoryRules").show();
        fnEnableInventoryRules(false);
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveInventoryRules").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveInventoryRules").attr("disabled", false);
        $("#btnSaveInventoryRules").show();
        $("#btnDeactivateInventoryRules").hide();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveInventoryRules,#btnDeactivateInventoryRules").hide();
        fnEnableInventoryRules(true);
        $(".modal-title").text(localization.ViewInventoryRules);
         
    }
    if (actiontype.trim() == "delete") {
        $(".modal-title").text("Active / De Active Inventory Rules");
        fnEnableInventoryRules(true);
        $("#btnSaveInventoryRules").hide();
        $("#btnDeactivateInventoryRules").show();

    }
    $("#PopupInventoryRules").on('hidden.bs.modal', function () {
        $("#btnSaveInventoryRules").show();
        fnEnableInventoryRules(false);
        
    });
}

function fnSaveInventoryRules() {

    if (validateInventoryRules() === false) {
        return;
    }
    if (Isadd === 1) {
        rule = {
            InventoryRuleId: $('#cboInventoryRule').val(),
            InventoryRuleDesc: $("#txtRuleDescription").val(),
            InventoryRule: $("#txtRuleInDays").val(),
            ApplyToSrn: $("#chkApplyToSRN").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            Isadd: 1
        };

    }

    if (Isadd === 0) {
        var rule = {
            InventoryRuleId: $('#cboInventoryRule').val(),
            InventoryRuleDesc: $("#txtRuleDescription").val(),
            InventoryRule: $("#txtRuleInDays").val(),
            ApplyToSrn: $("#chkApplyToSRN").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            Isadd: 0
        };
    }
    $("#btnSaveInventoryRules").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Inventory/InsertOrUpdateInventoryRules',
        type: 'POST',
        datatype: 'json',
        data: { rule },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveInventoryRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupInventoryRules').modal('hide');
                fnClearFields();
                fnGridLoadInventoryRules();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveInventoryRules").attr("disabled", false);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveInventoryRules").attr("disabled", false);
        }
    });
}

function validateInventoryRules() {

    if ($("#cboInventoryRule").val() === "0" || $("#cboInventoryRule").val() === '0') {
        toastr.warning("Please Select a Inventory Rule");
        return false;
    }
    if (IsStringNullorEmpty($("#txtRuleDescription").val())) {
        toastr.warning("Please Enter the Rule Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtRuleInDays").val())) {
        toastr.warning("Please Enter the Rule in days");
        return false;
    }
}

function fnGridRefreshInventoryRules() {
    $("#jqgInventoryRules").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtRuleDescription").val("");
    $("#txtRuleInDays").val("");
    $("#chkApplyToSRN").parent().removeClass("is-checked");
    $("#cboInventoryRule").prop('disabled', false);
    $('#cboInventoryRule').val("0");
    $('#cboInventoryRule').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveInventoryRules").attr("disabled", false);
}

function fnEnableInventoryRules(val){
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("input[id*='chk']").attr('disabled', val);
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

function fnDeleteInventoryRules() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateInventoryRules").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Inventory/ActiveOrDeActiveInventoryRules?status=' + a_status + '&InventoryId=' + $("#cboInventoryRule").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateInventoryRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupInventoryRules").modal('hide');
                fnGridRefreshInventoryRules();
                fnClearFields();
                $("#btnDeactivateInventoryRules").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateInventoryRules").attr("disabled", false);
                $("#btnDeactivateInventoryRules").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateInventoryRules").attr("disabled", false);
            $("#btnDeactivateInventoryRules").html(localization.DeActivate);
        }
    });
}


