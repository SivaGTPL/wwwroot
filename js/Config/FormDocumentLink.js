$(function () {
    fnGridLoadFormDocumentLink();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnFormDocumentLink",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditFormDocumentLink(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditFormDocumentLink(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";

function fnGridLoadFormDocumentLink() {

    $("#jqgFormDocumentLink").GridUnload();

    $("#jqgFormDocumentLink").jqGrid({
        url: getBaseURL() + '/Control/GetFormLinkedDocuments',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.FormID, localization.FormName, localization.DocID, localization.DocName, localization.Active, localization.Actions],
        colModel: [
            { name: "FormId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "FormName", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "DocumentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "DocumentName", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 88, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditFormDocumentLink(event,\'view\');"><i class="far fa-eye"></i></button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditFormDocumentLink(event,\'delete\');"><i class="fas fa-trash"></i></button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnFormDocumentLink"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpFormDocumentLink",
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
        forceFit: true, caption:'Form Document Link',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpFormDocumentLink");
        },

        SelectRow: function (rowid, status, e) {
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

    }).jqGrid('navGrid', '#jqpFormDocumentLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpFormDocumentLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshFormDocumentLink
        }).jqGrid('navButtonAdd', '#jqpFormDocumentLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddFormDocumentLink
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgFormDocumentLink"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddFormDocumentLink() {
    
    _isInsert = true;
    fnClearFields();
    $('#PopupFormDocumentLink').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupFormDocumentLink').find('.modal-title').text(localization.AddFormDocumentLink);
    $("#btnSaveFormDocumentLink").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveFormDocumentLink").show();
    $("#btndeActiveFormDocumentLink").hide();
    $("#cboFormId").val("0").selectpicker('refresh');
    $("#cboFormId").attr('disabled', false);
    $("#cbodocumentId").val("0").selectpicker('refresh');
    $("#cbodocumentId").attr('disabled', false);
}

function fnEditFormDocumentLink(e, actiontype) {
    
    var rowid = $("#jqgFormDocumentLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgFormDocumentLink').jqGrid('getRowData', rowid);
   
    $("#cboFormId").val(rowData.FormId).selectpicker('refresh');
    $("#cboFormId").attr('disabled', true);
    $("#cbodocumentId").val(rowData.DocumentId).selectpicker('refresh');
    $("#cbodocumentId").attr('disabled', true);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveFormDocumentLink").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupFormDocumentLink').modal('show');
        $('#PopupFormDocumentLink').find('.modal-title').text(localization.ViewFormDocumentLink);
        $("#btnSaveFormDocumentLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveFormDocumentLink").hide();
        $("#btndeActiveFormDocumentLink").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupFormDocumentLink").on('hidden.bs.modal', function () {
            $("#btnSaveFormDocumentLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupFormDocumentLink').modal('show');
        $('#PopupFormDocumentLink').find('.modal-title').text(localization.Delete);
        $("#btnSaveFormDocumentLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveFormDocumentLink").hide();
        $("#btndeActiveFormDocumentLink").html(localization.Delete);
        $("#btndeActiveFormDocumentLink").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupFormDocumentLink").on('hidden.bs.modal', function () {
            $("#btnSaveFormDocumentLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}
function fnClearFields() {
    $("#cboFormId").val("0").selectpicker('refresh');
    $("#cboFormId").attr('disabled', false);
    $("#cbodocumentId").val("0").selectpicker('refresh');
    $("#cbodocumentId").attr('disabled', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveFormDocumentLink").attr("disabled", false);
    $("#btndeActiveFormDocumentLink").attr("disabled", false);
}

$("#btnCancelFormDocumentLink").click(function () {
    $("#jqgFormDocumentLink").jqGrid('resetSelection');
    $('#jqgFormDocumentLink').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnGridRefreshFormDocumentLink() {
    $("#jqgFormDocumentLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveFormDocumentLink() {

    if (IsStringNullorEmpty($("#cboFormId").val()) || $("#cboFormId").val()==="0") {
        toastr.warning("Please select a Form");
        return;
    }
    if (IsStringNullorEmpty($("#cbodocumentId").val()) || $("#cbodocumentId").val() === "0") {
        toastr.warning("Please select a Document");
        return;
    }
    obj_flink = {
        FormId: $("#cboFormId").val(),
        DocumentId: $("#cbodocumentId").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveFormDocumentLink").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Control/InsertIntoFormDocumentLink',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_flink },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveFormDocumentLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupFormDocumentLink").modal('hide');
                fnClearFields();
                fnGridRefreshFormDocumentLink();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveFormDocumentLink").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFormDocumentLink").attr("disabled", false);
        }
    });
}

function fnDeleteFormDocumentLink() {

    $("#btndeActiveFormDocumentLink").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Control/DeleteFormLinkedDocument?formId=' + $("#cboFormId").val() + '&documentId=' + $("#cbodocumentId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveFormDocumentLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupFormDocumentLink").modal('hide');
                fnClearFields();
                fnGridRefreshFormDocumentLink();
                $("#btndeActiveFormDocumentLink").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveFormDocumentLink").attr("disabled", false);
                $("#btndeActiveFormDocumentLink").html('Delete');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveFormDocumentLink").attr("disabled", false);
            $("#btndeActiveFormDocumentLink").html('Delete');
        }
    });
}