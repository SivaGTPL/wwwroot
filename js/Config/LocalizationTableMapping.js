var _isInsert = true;
var actiontype = "";
$(document).ready(function () {
    fnLoadLocalizationTableMappingGrid();
});

function fnLoadLocalizationTableMappingGrid() {

    $("#jqgLocalizationTable").GridUnload();

    $("#jqgLocalizationTable").jqGrid({
        url: getBaseURL() + '/Localization/GetLocalizationTableMaster',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TableCode, localization.SchemaName, localization.TableDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "TableCode", width: 50, editable: true, align: 'left', hidden: false },
            { name: "SchemaName", editable: true, width:95, align: 'left', resizable: false },
            { name: "TableName", editable: true, width: 95, align: 'left', resizable: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Edit', search: false, align: 'left', width:120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditLocalizationTable(event,\'edit\')"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditLocalizationTable(event,\'view\')"><i class="far fa-eye"></i>' + localization.View + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditLocalizationTable(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                }
            }
        ],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
       caption:"Localization Table",
        pager: "#jqpLocalizationTable",
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
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgLocalizationTable");
        },
    }).jqGrid('navGrid', '#jqpLocalizationTable', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpLocalizationTable', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefresh
    }).jqGrid('navButtonAdd', '#jqpLocalizationTable', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddLocalizationTable
        });
    fnAddGridSerialNoHeading();
}

function fnAddLocalizationTable() {
    fnClearFields();

    _isInsert = true;
    $(".modal-title").text(localization.AddLocalizationTableMapping);
    $("#txtTableCode").attr('disabled', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#PopupLocalizationTable").modal('show');
    $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSave").show();
    $("#btnDeactivateLocalizationTableMapping").hide();
    var columnNames = $("#jqgLocalizationTable").jqGrid('getGridParam', 'colNames');
    var c = $("#jqgLocalizationTable").getGridParam("reccount");
    console.log("Count:"+$("#jqgLocalizationTable").getGridParam("reccount"));
    console.log(columnNames);
    var allRowsInGrid = $('#jqgLocalizationTable').jqGrid('getGridParam', 'data');
    console.log(allRowsInGrid);
    console.log($('#jqgLocalizationTable').jqGrid('getGridParam'));
    var a = [];
    var trow = '';
    var res = $('#jqgLocalizationTable').jqGrid('getGridParam');
    for (var i = 0; i < c; i++) {
        console.log(columnNames.length);
        if (columnNames[0] == "") {
           columnNames[0] = "S.no";
        }
        a.push(columnNames[i]);
       
      
    }
    for (var i = 0; i < c; i++) {
        trow += "<table class='table table-bordered'><tr>";
        for (var j = 0; j < c; j++) {
            trow += "<td>" + a[j] + "</td><td>" + JSON.stringify(allRowsInGrid[j]) + "</td ></tr> ";
        }
        trow += "</table>";
    }
    console.log(a);
    $("#mobGrid").append(trow);
}

function fnEditLocalizationTable(e,actiontype) {

    fnClearFields();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgLocalizationTable').jqGrid('getRowData', rowid);
    _isInsert = false;
   
    $("#txtTableCode").val(rowData.TableCode).attr('disabled', true);
    $("#txtSchemaName").val(rowData.SchemaName);
    $("#txtTableDesc").val(rowData.TableName);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateLocalizationTableMapping").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateLocalizationTableMapping").html(localization.Activate);
    }

    $("#PopupLocalizationTable").modal('show');
   
    if (actiontype.trim() == "edit") {
        $("#chkActiveStatus").prop('disabled', true);
        $(".modal-title").text(localization.EditLocalizationTableMapping);
        $("#btnSave").html('<i class="fa fa-sync"></i> ' +localization.Update);
        $("#btnSave").attr('disabled', false);
        $("#btnSave").show();
        $("#btnDeactivateLocalizationTableMapping").hide();
    }
    if (actiontype.trim() == "view") {
        $("#btnSave,#btnDeactivateLocalizationTableMapping").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $(".modal-title").text(localization.ViewLocalizationTableMapping);
        $("#PopupLocalizationTable").on('hidden.bs.modal', function () {
            $("#btnSave").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        })
    }

    if (actiontype.trim() == "delete") {
        $("#btnSave").hide();
        $("#btnDeactivateLocalizationTableMapping").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $(".modal-title").text("Active / De Active Localization Table Mapping");
        $("#PopupLocalizationTable").on('hidden.bs.modal', function () {
            $("#btnSave").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        })
    }
}

function fnSaveLocalizationTableMapping() {

    if (!IsValidate()) {
        return;
    }

    var obj = {
        IsInsert: _isInsert,
        TableCode: $('#txtTableCode').val(),
        SchemaName: $("#txtSchemaName").val(),
        TableName: $("#txtTableDesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSave").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/Localization/InsertOrUpdateLocalizationTableMaster',
        type: 'POST',
        datatype: 'json',
        data: obj,
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSave").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnClearFields();
                $("#jqgLocalizationTable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSave").attr('disabled', false);
                return false;
            }
        },
        error: function (request, status, error) {
            $("#btnSave").attr('disabled', false);
            toastr.error(request.responseText);
        }
    }).always(function () {
        $("#btnSave").attr('disabled', false);
    });
}

function IsValidate() {

    if (IsStringNullorEmpty($("#txtTableCode").val())) {
        toastr.warning("Please Enter Table Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtSchemaName").val())) {
        toastr.warning("Please Enter Schema Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtTableDesc").val())) {
        toastr.warning("Please Enter Table Description");
        return false;
    }
    if (isNaN($("#txtTableCode").val())) {
        toastr.warning("Table Code Should be Numbers Only");
        return false;
    }

    return true;
}

function fnClosePopUp() {
    fnClearFields();
    $("#PopupLocalizationTable").modal('hide');
}

function fnRefresh() {
    $("#jqgLocalizationTable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
  
function fnClearFields() {

    $("#txtTableCode").val('');
    $("#txtSchemaName").val('');
    $("#txtTableDesc").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSave").attr('disabled', false);
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

function fnDeleteLocalizationTableMapping() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateLocalizationTableMapping").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Localization/ActiveOrDeActiveLocalizationTableMaster?status=' + a_status + '&Tablecode=' + $("#txtTableCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateLocalizationTableMapping").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnClearFields();
                fnRefresh();
                $("#btnDeactivateLocalizationTableMapping").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateLocalizationTableMapping").attr("disabled", false);
                $("#btnDeactivateLocalizationTableMapping").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateLocalizationTableMapping").attr("disabled", false);
            $("#btnDeactivateLocalizationTableMapping").html(localization.DeActivate);
        }
    });
}
