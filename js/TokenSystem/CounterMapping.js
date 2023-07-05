﻿$(function () {
    fnGridLoadCounterMapping();
});
$(document).ready(function () {

    $.contextMenu({
        // define which elements trigger this menu
        selector: ".btn-actions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCounterMapping(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCounterMapping(event, 'view') } },
            delete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCounterMapping(event, 'delete') } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + "</span>");


});
var _isInsert = true;

function fnBusinessLocation_onChange() {

    fnGridLoadCounterMapping();
}
function fnGridLoadCounterMapping() {

    $("#jqgCounterMapping").GridUnload();

    $("#jqgCounterMapping").jqGrid({
        url: getBaseURL() + '/CounterMapping/GetCounterMappingbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.TokenType, localization.FloorId, localization.Floor, localization.CounterNumber, localization.TokenType, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TokenType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FloorId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FloorName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CounterNumber", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },           
            { name: "TokenDesc", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 70, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditCounterMapping(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditCounterMapping(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
            //            + '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditCounterMapping(event,\'delete\');"><i class="fas fa-trash"></i>' + localization.Delete + '</button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 70, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnTokenActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCounterMapping",
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
        forceFit: true, caption:'Counter Mapping',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpCounterMapping");
        },
    }).jqGrid('navGrid', '#jqpCounterMapping', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCounterMapping', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCounterMapping
        }).jqGrid('navButtonAdd', '#jqpCounterMapping', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCounterMapping
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgCounterMapping"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddCounterMapping() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key to Add");
        return;
    }
    else {
        $('#PopupCounterMapping').modal('show');
        $('#PopupCounterMapping').modal({ backdrop: 'static', keyboard: false });
        $('#PopupCounterMapping').find('.modal-title').text(localization.AddTokenCounter);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCounterMapping").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveCounterMapping").show();
        $("#btndeActiveCounterMapping").hide();
        _isInsert = true;

    }
}


function fnEditCounterMapping(e, actiontype) {

    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowid = $("#jqgCounterMapping").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCounterMapping').jqGrid('getRowData', rowid);

    _isInsert = false;

    $('#PopupCounterMapping').modal('show');
    $('#cboTokenType').val(rowData.TokenType).selectpicker('refresh');
    $('#cboTokenType').selectpicker({ mobile: true });
    $('#cboFloor').val(rowData.FloorId).selectpicker('refresh');
    fnBindCounterNumber();
    $('#cboCounterNumber').val(rowData.CounterNumber).selectpicker('refresh');
   
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveCounterMapping").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        $('#PopupCounterMapping').find('.modal-title').text(localization.EditTokenCounter);
        $("#btnSaveCounterMapping").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveCounterMapping").hide();
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSaveCounterMapping").attr("disabled", false);
        $("#cboTokenType").next().attr('disabled', true);
        $('#cboTokenType').selectpicker('refresh');
        $('#cboTokenType').selectpicker('mobile');
        $("#cboFloor").next().attr('disabled', true);
        $('#cboFloor').selectpicker('refresh');
        $("#cboCounterNumber").next().attr('disabled', true);
        $('#cboCounterNumber').selectpicker('refresh');
    }

    if (actiontype.trim() == "view") {
        $('#PopupCounterMapping').find('.modal-title').text(localization.ViewTokenCounter);
        $("#btnSaveCounterMapping").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCounterMapping").hide();
        $("#btndeActiveCounterMapping").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCounterMapping").on('hidden.bs.modal', function () {
            $("#btnSaveCounterMapping").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupCounterMapping').find('.modal-title').text("Activate/De Activate Token Counter");
        $("#btnSaveCounterMapping").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCounterMapping").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveCounterMapping").html(localization.DActivate);
        }
        else {
            $("#btndeActiveCounterMapping").html(localization.Activate);
        }

        $("#btndeActiveCounterMapping").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCounterMapping").on('hidden.bs.modal', function () {
            $("#btnSaveCounterMapping").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshCounterMapping() {
    $("#jqgCounterMapping").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelCounterMapping").click(function () {
    $("#jqgCounterMapping").jqGrid('resetSelection');
    $('#PopupCounterMapping').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cboTokenType').val('0').selectpicker('refresh');
    $("#cboTokenType").next().attr('disabled', false);
    $('#cboFloor').val('0').selectpicker('refresh');
    $("#cboFloor").next().attr('disabled', false);
    $('#cboCounterNumber').val('0').selectpicker('refresh');
    $("#cboCounterNumber").next().attr('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCounterMapping").attr("disabled", false);
}


function fnSaveCounterMapping() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key");
        return;
    }
    if (IsStringNullorEmpty($("#cboTokenType").val()) || $("#cboTokenType").val() === "0") {
        toastr.warning("Please select a Token Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboCounterNumber").val()) || $("#cboCounterNumber").val() === "0") {
        toastr.warning("Please select a Counter Number");
        return;
    }

    obj_mapping = {
        BusinessKey: $("#cboBusinessLocation").val(),
        TokenType: $("#cboTokenType").val(),
        CounterNumber: $("#cboCounterNumber").val(),
        FloorId:0,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveCounterMapping").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/CounterMapping/InsertOrUpdateCounterMapping',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_mapping },
        success: function (response) {
            if (response.Status) {

                toastr.success(response.Message);
                $("#btnSaveCounterMapping").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCounterMapping").modal('hide');
                fnClearFields();
                fnGridRefreshCounterMapping();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCounterMapping").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCounterMapping").attr("disabled", false);
        }
    });
}

function fnDeleteCounterMapping() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    $("#btndeActiveCounterMapping").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/CounterMapping/ActiveOrDeActiveCounterMapping?status=' + a_status + '&businesskey=' + $("#cboBusinessLocation").val() + '&tokentype=' + $("#cboTokenType").val() + '&counternumber=' + $("#cboCounterNumber").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveCounterMapping").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCounterMapping").modal('hide');
                fnClearFields();
                fnGridRefreshCounterMapping();
                $("#btndeActiveCounterMapping").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveCounterMapping").attr("disabled", false);
                $("#btndeActiveCounterMapping").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveCounterMapping").attr("disabled", false);
            $("#btndeActiveCounterMapping").html('De Activate');
        }
    });
}
function fncboFloor_change() {
    fnBindCounterNumber();
}
function fnBindCounterNumber() {

    $("#cboCounterNumber").empty();

    $.ajax({
        url: getBaseURL() + '/CounterMapping/GetCounterNumbersbyFloorId?floorId=' + $("#cboFloor").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time 
            $("#cboCounterNumber").empty();
            $("#cboCounterNumber").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboCounterNumber").append($("<option></option>").val(response[i]["CounterNumber"]).html(response[i]["CounterNumber"]));
            }
            $('#cboCounterNumber').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


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

