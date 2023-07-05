
$(document).ready(function () {
    fnGridLoadDepartmentCodes();
});
var actiontype = "";
function fnGridLoadDepartmentCodes() {
    
    $("#jqgDepartmentCodes").jqGrid('GridUnload');
    $("#jqgDepartmentCodes").jqGrid({
        url: getBaseURL() + '/DepartmentCodes/GetDepartmentCodes',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DepartmentID, localization.DepartmentDescription, localization.DepartmentShortDescription, localization.Status, localization.Actions],
        colModel: [
            { name: "DepartmentID", width: 250, editable: true, align: 'left', hidden: true },
            { name: "DepartmentDesc", width: 250, editable: true, align: 'left', hidden: false },
            { name: "DeptShortDesc", width:150, editable: false, hidden: false, align: 'left', resizable: true },
            //{ name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'Actions', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDepartmentCodes(event,\'edit\')"><i class="fas fa-pen"></i>' + localization.Edit+ '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditDepartmentCodes(event,\'view\')"><i class="far fa-eye"></i>' + localization.View + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditDepartmentCodes(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                }
            }
        ],
        pager: "#jqpDepartmentCodes",
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
        scrollOffset: 0,
        caption:'Department Codes',
        loadComplete: function (data) {
            //$("#jqgDepartmentCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen("jqgDepartmentCodes");
            SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpDepartmentCodes', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDepartmentCodes', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDepartmentCodes
    }).jqGrid('navButtonAdd', '#jqpDepartmentCodes', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDepartmentCodes
        });
    fnAddGridSerialNoHeading();
}

function fnAddDepartmentCodes() {
    fnClearFields();
    $('#txtDepartmentID').val('');
    $('#PopupDepartmentCodes').modal('show');
    $('#PopupDepartmentCodes').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDepartmentCodes').find('.modal-title').text(localization.AddDepartmentCode);
    $("#btnSaveDepartmentCode").html(localization.Save);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDepartmentCode").show();
    $("#btnDeactivateDepartmentCode").hide();
}

function fnEditDepartmentCodes(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDepartmentCodes').jqGrid('getRowData', rowid);

    $('#PopupDepartmentCodes').modal('show');
    $("#txtDepartmentID").val(rowData.DepartmentID);
    $("#txtDepartmentDescription").val(rowData.DepartmentDesc);
    $("#txtDeptShortDescription").val(rowData.DeptShortDesc);
    
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    if (actiontype.trim() == "edit") {
        $('#PopupDepartmentCodes').find('.modal-title').text(localization.UpdateDepartmentCode);
        $("#btnSaveDepartmentCode").html(localization.Update);
        $("#btnSaveDepartmentCode").attr('disabled', false);
        $("#btnSaveDepartmentCode").show();
        $("#btnDeactivateDepartmentCode").hide();
        $("#chkActiveStatus").prop('disabled', true);
    }
    if (actiontype.trim() == "view") {
        $('#PopupDepartmentCodes').find('.modal-title').text(localization.ViewDepartmentCode);
        $("#btnSaveDepartmentCode,#btnDeactivateDepartmentCode").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupDepartmentCodes").on('hidden.bs.modal', function () {
            $("#btnSaveDepartmentCode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupDepartmentCodes').find('.modal-title').text("Active/De Active Department Codes");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateDepartmentCode").html(localization.DeActivate);
        }
        else {
            $("#btnDeactivateDepartmentCode").html(localization.Activate);
        }
        $("#btnSaveDepartmentCode").hide();
        $("#btnDeactivateDepartmentCode").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupDepartmentCodes").on('hidden.bs.modal', function () {
            $("#btnSaveDepartmentCode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }
}

function fnSaveDepartmentCode() {
 if (ValidateDepartmentCodes() === false) {
        return;
    }
    var obj = {
        DepartmentID: $('#txtDepartmentID').val(),
        DepartmentDesc: $('#txtDepartmentDescription').val(),
        DeptShortDesc: $('#txtDeptShortDescription').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    var URL = '';
    if ($('#txtDepartmentID').val() != '')
        URL = getBaseURL() + '/DepartmentCodes/UpdateDepartmentCodes';
    else
        URL = getBaseURL() + '/DepartmentCodes/InsertIntoDepartmentCodes';
  $("#btnSaveDepartmentCode").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        //contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveDepartmentCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDepartmentCodes').modal('hide');
                fnGridLoadDepartmentCodes();
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDepartmentCode").attr('disabled', false);
            }

            $("#btnSaveDepartmentCode").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDepartmentCode").attr("disabled", false);
            
        }
    });
}

function ValidateDepartmentCodes() {
if (IsStringNullorEmpty($("#txtDepartmentDescription").val())) {
        toastr.warning("Please Enter Department Description");
        return false;
    }
   if (IsStringNullorEmpty($("#txtDeptShortDescription").val())) {
        toastr.warning("Please Enter Department Short Description");
        return false;
    }
}

function fnGridRefreshDepartmentCodes() {
   $("#jqgDepartmentCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelDepartmentCode").click(function () {
    fnClearFields();
    $("#jqgDepartmentCodes").jqGrid('resetSelection');
    $('#PopupDepartmentCodes').modal('hide');
});

function fnClearFields() {
    $("#txtDepartmentDescription").val("");
    $("#txtDeptShortDescription").val("");
    $("#btnSaveDepartmentCode").attr('disabled', false);
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


function fnDeleteDepartmentCodes() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateDepartmentCode").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DepartmentCodes/ActiveOrDeActiveDepartmentCodes?status=' + a_status + '&deptId=' + $("#txtDepartmentID").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateDepartmentCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDepartmentCodes').modal('hide');
                fnClearFields();
                fnGridRefreshDepartmentCodes();
                $("#btnDeactivateDepartmentCode").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateDepartmentCode").attr("disabled", false);
                $("#btnDeactivateDepartmentCode").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateDepartmentCode").attr("disabled", false);
            $("#btnDeactivateDepartmentCode").html('De Activate');
        }
    });
}

//function SetGridControlByAction(jqg) {
//    //$('#jqgEdit').removeClass('ui-state-disabled');
//    //if (_userFormRole.IsEdit === false) {
//    //    $('#jqgEdit').addClass('ui-state-disabled');
//    //}
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }

//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }
//}