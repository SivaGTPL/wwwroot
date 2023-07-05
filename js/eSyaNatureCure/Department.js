//Department Start
$(document).ready(function () {
    fnGridLoadDepartments();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDepartment",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDepartment(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDepartment(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDepartment(event, 'delete') } },
            jqgUserLink: { name: localization.UserLink, icon: "UserLink", callback: function (key, opt) { fnAddUserDepartmentLink(event) } },

        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
    $(".context-menu-icon-UserLink").html("<span class='icon-contextMenu'><i class='fa fa-bars'></i>" + localization.UserLink + " </span>");


});
var actiontype = "";
function fnGridLoadDepartments() {

    $("#jqgDepartment").GridUnload();

    $("#jqgDepartment").jqGrid({
        url: getBaseURL() + '/Department/GetAllDepartments',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.DepartmentId, localization.DepartmentDesc, localization.ShortCode, localization.SequenceNumber, localization.Active, localization.Actions],
        colModel: [
            { name: "DepartmentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "DepartmentDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ShortCode", width: 75, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "SequenceNumber", width: 75, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
  
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDepartment"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpDepartment",
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
        forceFit: true, caption: 'Departments',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgDepartment");
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
    }).jqGrid('navGrid', '#jqpDepartment', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDepartment', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDepartments
        }).jqGrid('navButtonAdd', '#jqpDepartment', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDepartment
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgDepartment"),
            newWidth = $grid.closest(".Departmentcontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddDepartment() {
    _isInsert = true;
    fnClearFields();
    $('#PopupDepartment').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupDepartment').find('.modal-title').text(localization.AddDepartment);
    $("#btnSaveDepartment").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDepartment").show();
    $("#btndeActiveDepartment").hide(); 
    $('#txtDepartmentId').val('');
}

function fnEditDepartment(e, actiontype) {
    var rowid = $("#jqgDepartment").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDepartment').jqGrid('getRowData', rowid);

    $('#PopupDepartment').modal('show');
    $('#txtDepartmentId').val(rowData.DepartmentId);
    $('#txtDeptdesc').val(rowData.DepartmentDesc);
    $('#txtShortCode').val(rowData.ShortCode);
    $('#txtSequenceNumber').val(rowData.SequenceNumber);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDepartment").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupDepartment').find('.modal-title').text(localization.UpdateDepartment);
        $("#btnSaveDepartment").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveDepartment").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDepartment").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupDepartment').find('.modal-title').text(localization.ViewDepartment);
        $("#btnSaveDepartment").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDepartment").hide();
        $("#btndeActiveDepartment").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDepartment").on('hidden.bs.modal', function () {
            $("#btnSaveDepartment").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not Authorized to Delete");
            return;
        }
        $('#PopupDepartment').find('.modal-title').text("Activate/De Activate Department");
        $("#btnSaveDepartment").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDepartment").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDepartment").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDepartment").html(localization.Activate);
        }

        $("#btndeActiveDepartment").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDepartment").on('hidden.bs.modal', function () {
            $("#btnSaveDepartment").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveDepartment() {

    if (IsStringNullorEmpty($("#txtDeptdesc").val())) {
        toastr.warning("Please Enter the Department Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtShortCode").val())) {
        toastr.warning("Please Enter the Short Code");
        return;
    }
    if (IsStringNullorEmpty($("#txtSequenceNumber").val())) {
        toastr.warning("Please Enter the Sequence Number");
        return;
    }
    objdept = {
        DepartmentId: $("#txtDepartmentId").val() === '' ? 0 : $("#txtDepartmentId").val(),
        DepartmentDesc: $("#txtDeptdesc").val(),
        ShortCode: $("#txtShortCode").val(),
        SequenceNumber: $("#txtSequenceNumber").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDepartment").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Department/InsertOrUpdateDepartment',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objdept },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveDepartment").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDepartment").modal('hide');
                fnClearFields();
                fnGridRefreshDepartments();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDepartment").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDepartment").attr("disabled", false);
        }
    });
}

function fnGridRefreshDepartments() {
    $("#jqgDepartment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtDepartmentId").val('');
    $("#txtDeptdesc").val('');
    $('#txtShortCode').val('');
    $('#txtSequenceNumber').val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveDepartment").attr("disabled", false);
    $("#btndeActiveDepartment").attr("disabled", false);
}

$("#btnCancelDepartment").click(function () {
    $("#jqgDepartment").jqGrid('resetSelection');
    $('#PopupDepartment').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteDepartment() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveDepartment").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Department/ActiveOrDeActiveDepartment?status=' + a_status + '&deptId=' + $("#txtDepartmentId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDepartment").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDepartment").modal('hide');
                fnClearFields();
                fnGridRefreshDepartments();
                $("#btndeActiveDepartment").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDepartment").attr("disabled", false);
                $("#btndeActiveDepartment").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDepartment").attr("disabled", false);
            $("#btndeActiveDepartment").html('De Activate');
        }
    });
}

//End

//User Department Link Start

function fnAddUserDepartmentLink(e) {
   
    var rowid = $("#jqgDepartment").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDepartment').jqGrid('getRowData', rowid);

    var deptId = rowData.DepartmentId;
    var username = rowData.DepartmentDesc;
   
    $("#PopupUserDepartmentLink").modal('show');
    fnGridLoadUserDepartmentLink(deptId, username);
    $("#chkUserDeptActiveStatus").parent().addClass("is-checked");
    $("#chkUserDeptActiveStatus").prop('disabled', true);

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUserDept",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUserDepartmentLink(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditUserDepartmentLink(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
}


function fnGridLoadUserDepartmentLink(deptId, username) {
    $("#lbldisplaydept").text('');
    $("#lbldisplaydept").text(username);
    $('#txtdeptno').val('');
    $('#txtdeptno').val(deptId); 
    $('#cboUser').val('0').selectpicker('refresh');
    $("#cboUser").next().attr('disabled', false);
    $("#chkUserDeptActiveStatus").parent().addClass("is-checked");
    $("#chkUserDeptActiveStatus").prop('disabled', true);

    $("#jqgUserDepartmentLink").GridUnload();

    $("#jqgUserDepartmentLink").jqGrid({
        url: getBaseURL() + '/Department/GetAllUsersbyDepartmentLink?deptId=' + deptId ,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.DepartmentId, localization.UserId, localization.UserName, localization.DepartmentName,localization.Active, localization.Actions],
        colModel: [
            { name: "DepartmentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserName", width: 300, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "DepartmentName", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            
            { name: "ActiveStatus", width: 75, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUserDept"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpUserDepartmentLink",
        rowNum: 5,
        rowList: [5, 10, 15, 20],
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
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgUserDepartmentLink");
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

    }).jqGrid('navGrid', '#jqpUserDepartmentLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUserDepartmentLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserDepartmentLink
        }).jqGrid('navButtonAdd', '#jqpUserDepartmentLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddUserDeptLink
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgUserDepartmentLink"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshUserDepartmentLink() {
    $("#jqgUserDepartmentLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearUserDepartmentLinkFields() {

    $('#cboUser').val('0').selectpicker('refresh');
    $("#cboUser").next().attr('disabled', false);
    $('#txtdeptno').val('');
    $('#lbldisplaydept').text('');
    $("#btnCancelUserDeptLink").next().attr('disabled', false);
    $("#chkUserDeptActiveStatus").prop('disabled', false);
    $("#btnSaveUserDeptLink").attr("disabled", false);
}

$("#btnCancelUserDeptLink").click(function () {
    $("#jqgUserDepartmentLink").jqGrid('resetSelection');
    $('#PopupUserDepartmentLink').modal('hide');
    fnClearUserDepartmentLinkFields();
});

function fnAddUserDeptLink() {
    $('#cboUser').val('0').selectpicker('refresh');
    $("#cboUser").next().attr('disabled', false);
    $("#chkUserDeptActiveStatus").parent().addClass("is-checked");
    $("#chkUserDeptActiveStatus").prop('disabled', true);
    $("#btnSaveUserDeptLink").html('<i class="fa fa-save"></i>' + localization.Save);
}

function fnEditUserDepartmentLink(e, actiontype) {

    var rowid = $("#jqgUserDepartmentLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserDepartmentLink').jqGrid('getRowData', rowid);
    $('#cboUser').val(rowData.UserId).selectpicker('refresh');
    $("#cboUser").next().attr('disabled', true);
    $('#txtdeptno').val('');
    $('#txtdeptno').val(rowData.DepartmentId);
   
    if (rowData.ActiveStatus == 'true') {
        $("#chkUserDeptActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkUserDeptActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveUserDeptLink").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        $("#chkUserDeptActiveStatus").prop('disabled', false);
        $("#btnSaveUserDeptLink").html('Update').show();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveUserDeptLink").hide();
        $("#chkUserDeptActiveStatus").prop('disabled', true);
    }

}

function fnSaveUserDepartmentLink() {
    if (IsStringNullorEmpty($("#cboUser").val()) || $("#cboUser").val() == '0') {
        toastr.warning("Please Select a User");
        return;
    }
    if (IsStringNullorEmpty($("#txtdeptno").val())) {
        toastr.warning("Please Select a Department");
        return;
    }
   
    var objdeptlink = {
        UserId: $("#cboUser").val(),
        DepartmentId: $("#txtdeptno").val(),
        ActiveStatus: $("#chkUserDeptActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveUserDeptLink").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Department/InsertOrUpdateUserDepartmentLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: objdeptlink },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveUserDeptLink").attr('disabled', false);
                //fnClearUserDepartmentLinkFields()
                $('#cboUser').val('0').selectpicker('refresh');
                $("#cboUser").next().attr('disabled', false);
                $("#chkUserDeptActiveStatus").parent().addClass("is-checked");
                $("#chkUserDeptActiveStatus").prop('disabled', true);
                fnGridRefreshUserDepartmentLink();

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveUserDeptLink").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveUserDeptLink").attr("disabled", false);
        }
    });
}  
//End