
$(document).ready(function () {
    fnGridLoadPolicyTypes();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPolicyType",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPolicyType(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPolicyType(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPolicyType(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
function fnGridLoadPolicyTypes() {

    var policytypeId = $("#cboPolicyType").val();
    $("#jqgPolicyType").GridUnload();

    $("#jqgPolicyType").jqGrid({
        url: getBaseURL() + '/PolicyType/GetAllPolicyTypebyId?policytypeId=' + policytypeId,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PolicyType, localization.SerialNumber, localization.PolicyType, localization.PolicyStatement,localization.Active, localization.Actions],
        colModel: [
            { name: "PolicyType", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "SerialNumber", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PolicyTypeDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: true },
            { name: "PolicyStatement", width: 200, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditPolicyType(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditPolicyType(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditPolicyType(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPolicyType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        
        pager: "#jqpPolicyType",
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
        forceFit: true,
        caption:'Policy Type',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgPolicyType");
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
    }).jqGrid('navGrid', '#jqpPolicyType', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPolicyType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPolicyType
        }).jqGrid('navButtonAdd', '#jqpPolicyType', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPolicyType
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPolicyType"),
            newWidth = $grid.closest(".PlicyTypecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

var _isInsert = true;

function fnAddPolicyType() {

    fnClearFields();
    var id = $("#cboPolicyType").val();
    if (id === 0 || id === "0") {
        toastr.warning("Please select any Policy Type to add");
        return;
    }
    else {
        _isInsert = true;
        fnClearFields();
        $('#PopupPolicyType').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#PopupPolicyType').find('.modal-title').text(localization.AddPolicyType);
        $("#btnSavePolicyType").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePolicyType").show();
        $("#btndeActivePolicyType").hide();
    }

}

function fnEditPolicyType(e, actiontype) {
    var rowid = $("#jqgPolicyType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPolicyType').jqGrid('getRowData', rowid);

    $('#cboPolicyType').val(rowData.PolicyType);
    $('#cboPolicyType').selectpicker('refresh');
    $('#PopupPolicyType').modal('show');
    $('#txtPolicyStatement').val(rowData.PolicyStatement);
    $('#txtSerialNumber').val(rowData.SerialNumber);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePolicyType").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupPolicyType').find('.modal-title').text(localization.UpdatePolicyType);
        $("#btnSavePolicyType").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActivePolicyType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePolicyType").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupPolicyType').find('.modal-title').text(localization.ViewPolicyType);
        $("#btnSavePolicyType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePolicyType").hide();
        $("#btndeActivePolicyType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPolicyType").on('hidden.bs.modal', function () {
            $("#btnSavePolicyType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupPolicyType').find('.modal-title').text("Activate/De Activate Policy Type");
        $("#btnSavePolicyType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePolicyType").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActivePolicyType").html(localization.DActivate);
        }
        else {
            $("#btndeActivePolicyType").html(localization.Activate);
        }

        $("#btndeActivePolicyType").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPolicyType").on('hidden.bs.modal', function () {
            $("#btnSavePolicyType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}


function fnSavePolicyType() {

    if (IsStringNullorEmpty($("#txtPolicyStatement").val())) {
        toastr.warning("Please Enter the Policy Statement");
        return;
    }
   
    _objpolicy = {
        PolicyType: $("#cboPolicyType").val(),
        SerialNumber: $("#txtSerialNumber").val() === '' ? 0 : $("#txtSerialNumber").val(),
        PolicyStatement: $("#txtPolicyStatement").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePolicyType").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PolicyType/InsertOrUpdatePolicyType',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: _objpolicy },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePolicyType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPolicyType").modal('hide');
                fnClearFields();
                fnGridRefreshPolicyType();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePolicyType").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePolicyType").attr("disabled", false);
        }
    });
}

function fnGridRefreshPolicyType() {
    $("#jqgPolicyType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {

    $("#txtSerialNumber").val('');
    $('#txtPolicyStatement').val('');
    $('#txtPolicyStatement').attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePolicyType").attr("disabled", false);
    $("#btndeActivePolicyType").attr("disabled", false);
}

$("#btnCancelPolicyType").click(function () {
    $("#jqgPolicyType").jqGrid('resetSelection');
    $('#PopupPolicyType').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnDeletePolicyType() {
   
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    $("#btndeActivePolicyType").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PolicyType/ActiveOrDeActivePolicyType?status=' + a_status + '&policytypeId=' + $("#cboPolicyType").val() + '&serialNo=' + $("#txtSerialNumber").val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActivePolicyType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPolicyType").modal('hide');
                fnClearFields();
                fnGridRefreshPolicyType();
                $("#btndeActivePolicyType").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActivePolicyType").attr("disabled", false);
                $("#btndeActivePolicyType").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActivePolicyType").attr("disabled", false);
            $("#btndeActivePolicyType").html('De Activate');
        }
    });
}