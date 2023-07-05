$(function () {
    fnGridLoadFormTaskApproval();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnFormTaskApproval",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditFormTaskApproval(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditFormTaskApproval(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditFormTaskApproval(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var _isInsert = true;

function fnBusinessLocation_onChange() {

    fnGridLoadFormTaskApproval();
}
function fnGridLoadFormTaskApproval() {

    $("#jqgFormTaskApproval").GridUnload();

    $("#jqgFormTaskApproval").jqGrid({
        url: getBaseURL() + '/Levels/GetFormTaskApprovalsbyBusinesskey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.FormId, localization.TaskId, localization.UserRole, localization.FormName, localization.TaskName, localization.UserRole, localization.ApprovalLevelStage, localization.ApproverPriority, localization.ApprovalRangeFrom, localization.ApprovalRangeTo, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FormId", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TaskId", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserRole", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FormName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "TaskName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "UserRoleName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "ApprovalLevelStage", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "ApproverPriority", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "ApprovalRangeFrom", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "ApprovalRangeTo", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditFormTaskApproval(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditFormTaskApproval(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
            //            + '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditFormTaskApproval(event,\'delete\');"><i class="fas fa-trash"></i>' + localization.Delete + '</button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnFormTaskApproval"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpFormTaskApproval",
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
        forceFit: true, caption:'Form Task Approval',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpFormTaskApproval");
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
    }).jqGrid('navGrid', '#jqpFormTaskApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpFormTaskApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshFormTaskApproval
        }).jqGrid('navButtonAdd', '#jqpFormTaskApproval', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddFormTaskApproval
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgFormTaskApproval"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddFormTaskApproval() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key to Add");
        return;
    }
    else {
        $('#PopupFormTaskApproval').modal('show');
        $('#PopupFormTaskApproval').modal({ backdrop: 'static', keyboard: false });
        $('#PopupFormTaskApproval').find('.modal-title').text(localization.AddFormTaskApproval);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveFormTaskApproval").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveFormTaskApproval").show();
        $("#btndeActiveFormTaskApproval").hide();
        _isInsert = true;

    }
}

function fnEditFormTaskApproval(e, actiontype) {

    var rowid = $("#jqgFormTaskApproval").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgFormTaskApproval').jqGrid('getRowData', rowid);
    _isInsert = false;
    $('#cboForm').val(rowData.FormId).selectpicker('refresh');
    $('#cboUserRole').val(rowData.UserRole).selectpicker('refresh');
    fnBindFormTask();
    $('#cboTask').val(rowData.TaskId).selectpicker('refresh');
    $('#txtApprovalLevelStage').val(rowData.ApprovalLevelStage);
    $('#txtApproverPriority').val(rowData.ApproverPriority);
    $('#txtApprovalRangeFrom').val(rowData.ApprovalRangeFrom);
    $('#txtApprovalRangeTo').val(rowData.ApprovalRangeTo);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveFormTaskApproval").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupFormTaskApproval').modal('show');
        $('#PopupFormTaskApproval').find('.modal-title').text(localization.EditFormTaskApproval);
        $("#btnSaveFormTaskApproval").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveFormTaskApproval").hide();
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSaveFormTaskApproval").attr("disabled", false);
        $("#cboForm").next().attr('disabled', true);
        $('#cboForm').selectpicker('refresh');
        $("#cboTask").next().attr('disabled', true);
        $('#cboTask').selectpicker('refresh');
        $("#cboUserRole").next().attr('disabled', true);
        $('#cboUserRole').selectpicker('refresh');
        $("#txtApprovalLevelStage").attr('readonly', true);
        $("#txtApproverPriority").attr('readonly', true);
        $("#chkActiveStatus").prop('disabled', true);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are no authorized to View");
            return;
        }
        $('#PopupFormTaskApproval').modal('show');
        $('#PopupFormTaskApproval').find('.modal-title').text(localization.ViewFormTaskApproval);
        $("#btnSaveFormTaskApproval").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveFormTaskApproval").hide();
        $("#btndeActiveFormTaskApproval").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupFormTaskApproval").on('hidden.bs.modal', function () {
            $("#btnSaveFormTaskApproval").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupFormTaskApproval').modal('show');
        $('#PopupFormTaskApproval').find('.modal-title').text("Activate/De Activate Form Task Approval");
        $("#btnSaveFormTaskApproval").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveFormTaskApproval").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveFormTaskApproval").html(localization.DActivate);
        }
        else {
            $("#btndeActiveFormTaskApproval").html(localization.Activate);
        }

        $("#btndeActiveFormTaskApproval").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupFormTaskApproval").on('hidden.bs.modal', function () {
            $("#btnSaveFormTaskApproval").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshFormTaskApproval() {
    $("#jqgFormTaskApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelFormTaskApproval").click(function () {
    $("#jqgFormTaskApproval").jqGrid('resetSelection');
    $('#PopupFormTaskApproval').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cboForm').val('0').selectpicker('refresh');
    $("#cboForm").next().attr('disabled', false);
    $('#cboTask').val('0').selectpicker('refresh');
    $("#cboTask").next().attr('disabled', false);
    $('#cboUserRole').val('0').selectpicker('refresh');
    $("#cboUserRole").next().attr('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#txtApprovalLevelStage").attr('readonly', false);
    $("#txtApproverPriority").attr('readonly', false);
    $("#btnSaveFormTaskApproval").attr("disabled", false);
    $('#txtApprovalLevelStage').val('');
    $('#txtApproverPriority').val('');
    $('#txtApprovalRangeFrom').val('');
    $('#txtApprovalRangeTo').val('');
}

function fnSaveFormTaskApproval() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key");
        return;
    }
    if (IsStringNullorEmpty($("#cboForm").val()) || $("#cboForm").val() === "0") {
        toastr.warning("Please select at Form");
        return;
    }
    if (IsStringNullorEmpty($("#cboTask").val()) || $("#cboTask").val() === "0") {
        toastr.warning("Please select a Task");
        return;
    }
    if (IsStringNullorEmpty($("#cboUserRole").val()) || $("#cboUserRole").val() === "0") {
        toastr.warning("Please select a User Role");
        return;
    }
    if (IsStringNullorEmpty($("#txtApprovalLevelStage").val())) {
        toastr.warning("Please Enter the Approval Level Stage");
        return;
    }
    if (IsStringNullorEmpty($("#txtApproverPriority").val())) {
        toastr.warning("Please Enter the Approver Priority");
        return;
    }
    if (IsStringNullorEmpty($("#txtApprovalRangeFrom").val())) {
        toastr.warning("Please Enter the Approval Range From");
        return;
    }
    if (IsStringNullorEmpty($("#txtApprovalRangeTo").val())) {
        toastr.warning("Please Enter the Approval Range To");
        return;
    }
    if ($("#txtApprovalRangeTo").val() <= $("#txtApprovalRangeFrom").val()) {
        toastr.warning("Approval Range To value should not less than or equal to Approval Range From value");
        return;
    }
    obj_approval = {
        BusinessKey: $("#cboBusinessLocation").val(),
        FormId: $("#cboForm").val(),
        TaskId: $("#cboTask").val(),
        ApprovalLevelStage: $("#txtApprovalLevelStage").val(),
        ApproverPriority: $("#txtApproverPriority").val(),
        UserRole: $("#cboUserRole").val(),
        ApprovalRangeFrom: $("#txtApprovalRangeFrom").val(),
        ApprovalRangeTo: $("#txtApprovalRangeTo").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveFormTaskApproval").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Levels/InsertOrUpdateFormTaskApproval',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_approval },
        success: function (response) {
            if (response.Status) {

                toastr.success(response.Message);
                $("#btnSaveFormTaskApproval").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupFormTaskApproval").modal('hide');
                fnClearFields();
                fnGridRefreshFormTaskApproval();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveFormTaskApproval").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFormTaskApproval").attr("disabled", false);
        }
    });
}

function fnDeleteFormTaskApproval() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    obj_del = {
        BusinessKey: $("#cboBusinessLocation").val(),
        FormId: $("#cboForm").val(),
        TaskId: $("#cboTask").val(),
        ApprovalLevelStage: $("#txtApprovalLevelStage").val(),
        ApproverPriority: $("#txtApproverPriority").val(),
        UserRole: $("#cboUserRole").val(),
        ApprovalRangeFrom: $("#txtApprovalRangeFrom").val(),
        ApprovalRangeTo: $("#txtApprovalRangeTo").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        status: a_status
    };
    $("#btndeActiveFormTaskApproval").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Levels/ActiveOrDeActiveFormTaskApproval',
        type: 'POST',
        datatype: 'json',
        data: { objform: obj_del },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveFormTaskApproval").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupFormTaskApproval").modal('hide');
                fnClearFields();
                fnGridRefreshFormTaskApproval();
                $("#btndeActiveFormTaskApproval").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveFormTaskApproval").attr("disabled", false);
                $("#btndeActiveFormTaskApproval").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveFormTaskApproval").attr("disabled", false);
            $("#btndeActiveFormTaskApproval").html('De Activate');
        }
    });
}

function fncboForm_change() {
    fnBindFormTask();
}

function fnBindFormTask() {

    $("#cboTask").empty();

    $.ajax({
        url: getBaseURL() + '/Levels/GetFormTaskbyFormId?formId=' + $("#cboForm").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time 
            $("#cboTask").empty();
            $("#cboTask").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboTask").append($("<option></option>").val(response[i]["TaskId"]).html(response[i]["TaskName"]));
            }
            $('#cboTask').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

