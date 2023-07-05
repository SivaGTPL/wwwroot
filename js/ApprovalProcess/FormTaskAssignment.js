$(function () {
    fnGridLoadFormTaskAssignment();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnFormTaskAssignment",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditFormTaskAssignment(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditFormTaskAssignment(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditFormTaskAssignment(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var _isInsert = true;

function fnGridLoadFormTaskAssignment() {

    $("#jqgFormTaskAssignment").GridUnload();

    $("#jqgFormTaskAssignment").jqGrid({
        url: getBaseURL() + '/Levels/GetFormTaskAssignments',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.FormId, localization.TaskId, localization.FormName, localization.TaskName, localization.AutoReassignTimeline, localization.Active, localization.Actions],
        colModel: [
            { name: "FormId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TaskId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FormName", width: 100, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "TaskName", width: 100, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "AutoReassignTimeline", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnFormTaskAssignment"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpFormTaskAssignment",
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
        forceFit: true, caption: 'Form Task Assignment',

        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgFormTaskAssignment");
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

    }).jqGrid('navGrid', '#jqpFormTaskAssignment', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpFormTaskAssignment', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshFormTaskAssignment
    }).jqGrid('navButtonAdd', '#jqpFormTaskAssignment', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddFormTaskAssignment
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgFormTaskAssignment"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddFormTaskAssignment() {

    $('#PopupFormTaskAssignment').modal('show');
    $('#PopupFormTaskAssignment').modal({ backdrop: 'static', keyboard: false });
    $('#PopupFormTaskAssignment').find('.modal-title').text(localization.AddFormTaskAssignment);
    $("#chkActiveStatus").parent().addClass("is-checked");
    fnClearFields();
    $("#chkActiveStatus").prop('disabled', true);
    $("#chkAutoReassignTimeline").parent().removeClass("is-checked");
    $("#chkAutoReassignTimeline").prop('disabled', false);
    $("#btnSaveFormTaskAssignment").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveFormTaskAssignment").show();
    $("#btndeActiveFormTaskAssignment").hide();
    _isInsert = true;

}


function fnEditFormTaskAssignment(e, actiontype) {
    var rowid = $("#jqgFormTaskAssignment").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgFormTaskAssignment').jqGrid('getRowData', rowid);
    _isInsert = false;
    $('#cboForm').val(rowData.FormId).selectpicker('refresh');
    $('#cboTask').val(rowData.TaskId).selectpicker('refresh');

    if (rowData.AutoReassignTimeline == 'true') {
        $("#chkAutoReassignTimeline").parent().addClass("is-checked");
    }
    else {
        $("#chkAutoReassignTimeline").parent().removeClass("is-checked");
    }

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveFormTaskAssignment").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupFormTaskAssignment').modal('show');
        $('#PopupFormTaskAssignment').find('.modal-title').text(localization.EditFormTaskAssignment);
        $("#btnSaveFormTaskAssignment").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveFormTaskAssignment").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkAutoReassignTimeline").prop('disabled', false);
        $("#btnSaveFormTaskAssignment").attr("disabled", false);
        $("#cboForm").next().attr('disabled', true);
        $('#cboForm').selectpicker('refresh');
        $("#cboTask").next().attr('disabled', true);
        $('#cboTask').selectpicker('refresh');

    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupFormTaskAssignment').modal('show');
        $('#PopupFormTaskAssignment').find('.modal-title').text(localization.ViewFormTaskAssignment);
        $("#btnSaveFormTaskAssignment").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveFormTaskAssignment").hide();
        $("#btndeActiveFormTaskAssignment").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkAutoReassignTimeline").prop('disabled', true);
        $("#PopupFormTaskAssignment").on('hidden.bs.modal', function () {
            $("#btnSaveFormTaskAssignment").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not  authorized to Delete");
            return;
        }
        $('#PopupFormTaskAssignment').modal('show');
        $('#PopupFormTaskAssignment').find('.modal-title').text("Activate/De Activate Form Task Assignment");
        $("#btnSaveFormTaskAssignment").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveFormTaskAssignment").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveFormTaskAssignment").html(localization.DActivate);
        }
        else {
            $("#btndeActiveFormTaskAssignment").html(localization.Activate);
        }

        $("#btndeActiveFormTaskAssignment").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupFormTaskAssignment").on('hidden.bs.modal', function () {
            $("#btnSaveFormTaskAssignment").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshFormTaskAssignment() {
    $("#jqgFormTaskAssignment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelFormTaskAssignment").click(function () {
    $("#jqgFormTaskAssignment").jqGrid('resetSelection');
    $('#PopupFormTaskAssignment').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cboForm').val('0').selectpicker('refresh');
    $("#cboForm").next().attr('disabled', false);
    $('#cboTask').val('0').selectpicker('refresh');
    $("#cboTask").next().attr('disabled', false);
    $("#chkAutoReassignTimeline").prop('disabled', false);
    $("#btnSaveFormTaskAssignment").attr("disabled", false);
}


function fnSaveFormTaskAssignment() {

    if (IsStringNullorEmpty($("#cboForm").val()) || $("#cboForm").val() === "0") {
        toastr.warning("Please select a Form");
        return;
    }
    if (IsStringNullorEmpty($("#cboTask").val()) || $("#cboTask").val() === "0") {
        toastr.warning("Please select a Task");
        return;
    }

    obj_task = {
        FormId: $("#cboForm").val(),
        TaskId: $("#cboTask").val(),
        AutoReassignTimeline: $("#chkAutoReassignTimeline").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveFormTaskAssignment").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Levels/InsertOrUpdateFormTaskAssignment',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_task },
        success: function (response) {
            if (response.Status) {

                toastr.success(response.Message);
                $("#btnSaveFormTaskAssignment").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupFormTaskAssignment").modal('hide');
                fnClearFields();
                fnGridRefreshFormTaskAssignment();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveFormTaskAssignment").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFormTaskAssignment").attr("disabled", false);
        }
    });
}

function fnDeleteFormTaskAssignment() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    $("#btndeActiveFormTaskAssignment").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Levels/ActiveOrDeActiveFormTaskAssignment?status=' + a_status + '&formId=' + $("#cboForm").val() + '&taskId=' + $("#cboTask").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveFormTaskAssignment").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupFormTaskAssignment").modal('hide');
                fnClearFields();
                fnGridRefreshFormTaskAssignment();
                $("#btndeActiveFormTaskAssignment").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveFormTaskAssignment").attr("disabled", false);
                $("#btndeActiveFormTaskAssignment").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveFormTaskAssignment").attr("disabled", false);
            $("#btndeActiveFormTaskAssignment").html('De Activate');
        }
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
  
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

