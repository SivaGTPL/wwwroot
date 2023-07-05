﻿
$(document).ready(function () {
    fnGridLoadCodeTypes();
    $.contextMenu({
       selector: "#btnCodeType",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCodeTypes(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCodeTypes(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCodeTypes(event, 'delete') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
   
});
var actiontype = "";
function fnGridLoadCodeTypes() {

    $("#jqgCodeType").GridUnload();

    $("#jqgCodeType").jqGrid({
        url: getBaseURL() + '/ApplicationCodes/GetCodeTypes',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.CodeType, localization.Description, localization.Control, localization.Active, localization.Actions],
        colModel: [
            { name: "CodeType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CodeTypeDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "CodeTypeControl", editable: true, align: 'left', width: 120, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "S: System Defined;U: User Defined" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width:88 , sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditCodeTypes(event,\'edit\');"><i class="fas fa-pen"></i></button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditCodeTypes(event,\'view\');"><i class="far fa-eye"></i></button>'+
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditCodeTypes(event,\'delete\');"><i class="fas fa-trash"></i></button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'center', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCodeType"><i class="fa fa-ellipsis-v"></i></button>'
                   // return `<button class="mr-1 btn btn-outline" id="btnCodeType"><span class="material-symbols-outlined">more_vert</span ></button>`
                }
            },
        ],

        pager: "#jqpCodeType",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
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
        caption:'Code Type',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgCodeType");
        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
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
    }).jqGrid('navGrid', '#jqpCodeType', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCodeType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCodeTypes
    }).jqGrid('navButtonAdd', '#jqpCodeType', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCodeTypes
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgCodeType"),
            newWidth = $grid.closest(".codetypecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddCodeTypes() {
    _isInsert = true;
    fnClearFields();
    $('#PopupCodeTypes').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupCodeTypes').find('.modal-title').text(localization.AddCodeType);
    $("#btnSaveCodeType").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveCodeType").show();
    $("#btndeActiveCodeType").hide();
}

function fnEditCodeTypes(e, actiontype) {
    var rowid = $("#jqgCodeType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCodeType').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
    $('#txtCodeType').val(rowData.CodeType);
    $('#txtCodeDescription').val(rowData.CodeTypeDesc);
    $('#cboCodeTypeControl').val(rowData.CodeTypeControl);
    $('#cboCodeTypeControl').selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveCodeType").attr("disabled", false);
    $("#txtCodeType").attr("readonly", "readonly");
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are Not Authorized to Edit");
            return;
        }
        $('#PopupCodeTypes').modal('show');
        $('#PopupCodeTypes').find('.modal-title').text(localization.UpdateCodeType);
        $("#btnSaveCodeType").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#btndeActiveCodeType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCodeType").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupCodeTypes').modal('show');
        $('#PopupCodeTypes').find('.modal-title').text(localization.ViewCodeType);
        $("#btnSaveCodeType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCodeType").hide();
        $("#btndeActiveCodeType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCodeTypes").on('hidden.bs.modal', function () {
            $("#btnSaveCodeType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not Authorized to Delete");
            return;
        }
        $('#PopupCodeTypes').modal('show');
        $('#PopupCodeTypes').find('.modal-title').text("Activate/De Activate Code Type");
        $("#btnSaveCodeType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCodeType").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveCodeType").html(localization.DActivate);
        }
        else {
            $("#btndeActiveCodeType").html(localization.Activate);
        }

        $("#btndeActiveCodeType").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCodeTypes").on('hidden.bs.modal', function () {
            $("#btnSaveCodeType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveCodeType() {
    if (IsStringNullorEmpty($("#txtCodeType").val())) {
        toastr.warning("Please Enter CodeType");
        return;
    }
    if (IsStringNullorEmpty($("#txtCodeDescription").val())) {
        toastr.warning("Please Enter CodeType Description");
        return;
    }
    ct_type = {
        CodeType: $("#txtCodeType").val() === '' ? 0 : $("#txtCodeType").val(),
        CodeTypeDesc: $("#txtCodeDescription").val(),
        CodeTypeControl: $("#cboCodeTypeControl").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    
    $("#btnSaveCodeType").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/ApplicationCodes/InsertOrUpdateCodeTypes',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, ct_type: ct_type },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveCodeType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCodeTypes").modal('hide');
                fnClearFields();
                fnGridRefreshCodeTypes();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCodeType").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCodeType").attr("disabled", false);
        }
    });
}

function fnGridRefreshCodeTypes() {
    $("#jqgCodeType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
  
function fnClearFields() {
    $("#txtCodeType").removeAttr("readonly");
    $("#txtCodeType").val('');
    $("#txtCodeDescription").val('');
    $('#cboCodeTypeControl').val("S");
    $('#cboCodeTypeControl').selectpicker('refresh');
    $('#chkDefaultStatus').prop('checked', true);
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCodeType").attr("disabled", false);
    $("#btndeActiveCodeType").attr("disabled", false);
}

$("#btnCancelCodeType").click(function () {
    $("#jqgCodeType").jqGrid('resetSelection');
    $('#PopupCodeTypes').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnDeleteCodeType() {
   
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else{
        a_status = true;
    }
    $("#btndeActiveCodeType").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ApplicationCodes/ActiveOrDeActiveCodeTypes?status=' + a_status + '&code_type=' + $("#txtCodeType").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveCodeType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCodeTypes").modal('hide');
                fnClearFields();
                fnGridRefreshCodeTypes();
                $("#btndeActiveCodeType").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveCodeType").attr("disabled", false);
                $("#btndeActiveCodeType").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveCodeType").attr("disabled", false);
            $("#btndeActiveCodeType").html('De Activate');
        }
    });
}