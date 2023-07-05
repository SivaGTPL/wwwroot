var actiontype = "";
var isUpdate = 0;
$(document).ready(function () {
    fnGridLoadSMSVariable();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnSMSVariable",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditSMSVariable(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditSMSVariable(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditSMSVariable(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadSMSVariable() {
    $('#jqgSMSVariable').jqGrid('GridUnload');
    $("#jqgSMSVariable").jqGrid({
        url: getBaseURL() + '/Engine/GetSMSVariableInformation',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSVariable, localization.SMSComponent, localization.Active, localization.Actions],
        colModel: [
            { name: "Smsvariable", width: 45, editable: true, align: 'left', editoptions: { maxlength: 4 }},
            { name: "Smscomponent", width: 108, editable: true, align: 'left', editoptions: { maxlength: 4 }},
            { name: "ActiveStatus", editable: true, width: 35, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'action', search: false, align: 'left', width: 80, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditSMSVariable(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditSMSVariable(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditSMSVariable(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSVariable"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSVariable",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'SMS Variable',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgSMSVariable");
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

    }).jqGrid('navGrid', '#jqpSMSVariable', {
        add: false, edit: false, search: false, del: false, refresh: false
    }).jqGrid('navButtonAdd', '#jqpSMSVariable', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSMSVariable
    }).jqGrid('navButtonAdd', '#jqpSMSVariable', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSVariable
        });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshSMSVariable() {
    $("#jqgSMSVariable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtSMSVariable").val('');
    $("#txtSMSComponent").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveSMSVariable").attr('disabled', false);
}

function fnAddSMSVariable() {
    fnClearFields();
    $("#PopupSMSVariable").modal('show');
    $('#PopupSMSVariable').find('.modal-title').text(localization.AddSMSVariable);
    $("#btnCancelSMSVariable").html('<i class="fa fa-times"></i>' + localization.Cancel);
    $("#txtSMSVariable").attr('readonly', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveSMSVariable").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveSMSVariable").show();
    $("#btnDeactivateSMSVariable").hide();
    isUpdate = 0;
}

function fnEditSMSVariable(e, actiontype) {
  
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgSMSVariable').jqGrid('getRowData', rowid);
    var rowid = $("#jqgSMSVariable").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSMSVariable').jqGrid('getRowData', rowid);
    $('#txtSMSVariable').val(rowData.Smsvariable).attr('readonly', true);
    $('#txtSMSComponent').val(rowData.Smscomponent);
    if (rowData.ActiveStatus === 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateSMSVariable").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateSMSVariable").html(localization.Activate);
    }
    $("#btnSaveSMSVariable").attr('disabled', false);
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("your Not Authorized to Edit");
            return;
        }
        $("#PopupSMSVariable").modal('show');
        $('#PopupSMSVariable').find('.modal-title').text(localization.EditSMSVariable);
        $("#btnCancelSMSVariable").html('<i class="fa fa-times"></i>' + localization.Cancel);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSMSVariable").html(localization.Update);
        $("#btnSaveSMSVariable").attr("disabled", false);
        $("#btnSaveSMSVariable").show();
        $("#btnDeactivateSMSVariable").hide();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("your Not Authorized to View");
            return;
        }
        $("#PopupSMSVariable").modal('show');
        $('#PopupSMSVariable').find('.modal-title').text(localization.ViewSMSVariable);
        $("#btnSaveSMSVariable,#btnDeactivateSMSVariable").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSVariable").on('hidden.bs.modal', function () {
            $("#btnSaveSMSVariable").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("your Not Authorized to Delete");
            return;
        }
        $("#PopupSMSVariable").modal('show');
        $('#PopupSMSVariable').find('.modal-title').text("Active / De Active SMS Variable");
        $("#btnSaveSMSVariable").hide();
        $("#btnDeactivateSMSVariable").show();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSVariable").on('hidden.bs.modal', function () {
            $("#btnSaveSMSVariable").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }
}

function fnSaveSMSVariable() {

    if (IsStringNullorEmpty($("#txtSMSVariable").val())) {
        toastr.warning("Please Enter SMS Variable");
        return false;
    }
    if (IsStringNullorEmpty($("#txtSMSComponent").val())) {
        toastr.warning("Please Enter SMS Component");
        return false;
    }

    var sm_sv = {
        Smsvariable: $("#txtSMSVariable").val(),
        Smscomponent: $("#txtSMSComponent").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Engine/InsertIntoSMSVariable';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/Engine/UpdateSMSVariable';
    }
    $("#btnSaveSMSVariable").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { sm_sv },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveSMSVariable").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshSMSVariable();
                $("#PopupSMSVariable").modal('hide');

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveSMSVariable").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveSMSVariable").attr("disabled", false);
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnDeleteSMSVariable() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateSMSVariable").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Engine/ActiveOrDeActiveSMSVariable?status=' + a_status + '&smsvariable=' + $("#txtSMSVariable").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateSMSVariable").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupSMSVariable').modal('hide');
                fnGridRefreshSMSVariable();
                fnClearFields();
                $("#btnDeactivateSMSVariable").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateSMSVariable").attr("disabled", false);
                $("#btnDeactivateSMSVariable").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateSMSVariable").attr("disabled", false);
            $("#btnDeactivateSMSVariable").html(localization.DeActivate);
        }
    });
}