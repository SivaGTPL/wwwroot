var actiontype = "";

$(document).ready(function () {
    fnGridLoadDepartmentLocationLink();
});

function fnBusinessLocation_onChange() {

    fnGridLoadDepartmentLocationLink();
}

function fnGridLoadDepartmentLocationLink() {


    $("#jqgDepartmentLocationLink").jqGrid('GridUnload');
    $("#jqgDepartmentLocationLink").jqGrid({
        url: getBaseURL() + '/DepartmentCodes/GetDepartmentLocation?businessKey=' + $('#cboBusinessLocation').val() + '&departmentId=' + $('#cboDepartment').val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DepartmentID, localization.LocationDescription, localization.LocationShortDescription, localization.Status, localization.Actions],
        colModel: [
            { name: "DeptLocnID", width: 250, editable: true, align: 'left', hidden: true },
            { name: "LocationDescription", width: 250, editable: true, align: 'left', hidden: false },
            { name: "LocnShortDesc", width: 150, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Actions', search: false, align: 'left', width: 125, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" id="jqgEdit" title="Edit" onclick="return fnEditDepartmentLocationLink(event,\'edit\')"><i class="fas fa-pen"></i>' + localization.Edit+ '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" id="jqgView" title="View" onclick="return fnEditDepartmentLocationLink(event,\'view\')"><i class="far fa-eye"></i>' + localization.View + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditDepartmentLocationLink(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'

                }
            }
        ],
        pager: "#jqpDepartmentLocationLink",
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
        scrollOffset: 0, caption:'Department Location Link',
        loadComplete: function (data) {
            //$("#jqgDepartmentCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen("jqgDepartmentLocationLink");
            SetGridControlByAction();
        }
    }).jqGrid('navGrid', '#jqpDepartmentLocationLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDepartmentLocationLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDepartmentLocationLink
    }).jqGrid('navButtonAdd', '#jqpDepartmentLocationLink', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDepartmentLocationLink
        });
    fnAddGridSerialNoHeading();
}

function fnAddDepartmentLocationLink() {
    fnClearFields();
    if (IsStringNullorEmpty($('#cboDepartment').val())) {
        toastr.warning("Please Select Department");
        return;
    }
    $("#txtLocationId").val('');
    $('#PopupDepartmentLocationLink').modal('show');
    $('#PopupDepartmentLocationLink').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDepartmentLocationLink').find('.modal-title').text(localization.AddDepartmentLocationLink);
    $("#btnSaveDepartmentLocationLink").html(localization.Save);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDepartmentLocationLink").show();
    $("#btnDeactivateDepartmentLocationLink").hide();
}

function fnEditDepartmentLocationLink(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDepartmentLocationLink').jqGrid('getRowData', rowid);

    $('#PopupDepartmentLocationLink').modal('show');

    $("#txtLocationId").val(rowData.DeptLocnID);
    $("#txtLocationDescription").val(rowData.LocationDescription);
    $("#txtLocationShortDescription").val(rowData.LocnShortDesc);
    
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if (actiontype.trim() == "edit") {
        $('#PopupDepartmentLocationLink').find('.modal-title').text(localization.UpdateDepartmentLocationLink);
        $("#btnSaveDepartmentLocationLink").html(localization.Update);
        $("#btnSaveDepartmentLocationLink").attr('disabled', false);
        $("#btnSaveDepartmentLocationLink").show();
        $("#btnDeactivateDepartmentLocationLink").hide();
        $("#chkActiveStatus").prop('disabled', true);
    }
    if (actiontype.trim() == "view") {
        $('#PopupDepartmentLocationLink').find('.modal-title').text(localization.ViewDepartmentLocationLink);
        $("#btnSaveDepartmentLocationLink,#btnDeactivateDepartmentLocationLink").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupDepartmentLocationLink").on('hidden.bs.modal', function () {
            $("#btnSaveDepartmentLocationLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupDepartmentLocationLink').find('.modal-title').text("Active/De Active Department Location Link");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateDepartmentLocationLink").html(localization.DeActivate);
        }
        else {
            $("#btnDeactivateDepartmentLocationLink").html(localization.Activate);
        }
        $("#btnSaveDepartmentLocationLink").hide();
        $("#btnDeactivateDepartmentLocationLink").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupDepartmentLocationLink").on('hidden.bs.modal', function () {
            $("#btnSaveDepartmentLocationLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }
}

function fnSaveDepartmentLocationLink() {

 if (ValidateDepartmentLocationLink() === false) {
        return;
    }
    var obj = {
        BusinessKey: $('#cboBusinessLocation').val(),
        DepartmentId: $('#cboDepartment').val(),
        DeptLocnId: $('#txtLocationId').val(),
        LocationDescription: $('#txtLocationDescription').val(),
        LocnShortDesc: $('#txtLocationShortDescription').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    var URL = '';
    //alert($('#txtDepartmentID').val());
    if ($('#txtLocationId').val() != '')
        URL = getBaseURL() + '/DepartmentCodes/UpdateDepartmentLocationLink';
    else
        URL = getBaseURL() + '/DepartmentCodes/InsertIntoDepartmentLocationLink';
   $("#btnSaveDepartmentLocationLink").attr('disabled', true);

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
                $('#PopupDepartmentLocationLink').modal('hide');
                fnClearFields();
                //$("#jqgDepartmentCodes").jqGrid('resetSelection');
                fnGridLoadDepartmentLocationLink();
               
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDepartmentLocationLink").attr('disabled', false);
            }

            $("#btnSaveDepartmentLocationLink").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDepartmentLocationLink").attr("disabled", false);

        }
    });

}

function ValidateDepartmentLocationLink() {
if (IsStringNullorEmpty($("#txtLocationDescription").val())) {
        toastr.warning("Please Enter Location Description");
        return false;
    }
   if (IsStringNullorEmpty($("#txtLocationShortDescription").val())) {
        toastr.warning("Please Enter Location Short Description");
        return false;
    }
}

function fnGridRefreshDepartmentLocationLink() {
    $("#jqgDepartmentLocationLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnCancelDepartmentLocationLink() {
    fnClearFields();
    $("#jqgDepartmentLocationLink").jqGrid('resetSelection');
    $('#PopupDepartmentLocationLink').modal('hide');
}

function fnClearFields() {
    $("#txtLocationDescription").val("");
    $("#txtLocationShortDescription").val("");
   $("#btnSaveDepartmentLocationLink").attr('disabled', false);
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

function fnDeleteDepartmentLocationLink() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateDepartmentLocationLink").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DepartmentCodes/ActiveOrDeActiveDepartmentLocationLink?status=' + a_status + '&deptId=' + $("#cboDepartment").val() + '&deptlocId=' + $("#txtLocationId").val()
            + '&Businesskey=' + $("#cboBusinessLocation").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateDepartmentLocationLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDepartmentLocationLink').modal('hide');
                fnClearFields();
                fnGridRefreshDepartmentLocationLink();
                $("#btnDeactivateDepartmentLocationLink").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateDepartmentLocationLink").attr("disabled", false);
                $("#btnDeactivateDepartmentLocationLink").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateDepartmentLocationLink").attr("disabled", false);
            $("#btnDeactivateDepartmentLocationLink").html('De Activate');
        }
    });
}
//function SetGridControlByAction(jqg) {
//    //$('#jqgEdit').removeClass('ui-state-disabled');
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