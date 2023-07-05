$(document).ready(function () {
    fnGridLoadBlockedPackages();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnBlockedPackage",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBlockedPackage(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditBlockedPackage(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditBlockedPackage(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnBusinessLocation_onChange() {

    fnGridLoadBlockedPackages();
}

var actiontype = "";
function fnGridLoadBlockedPackages() {
    
    $("#jqgBlockedPackage").GridUnload();

    $("#jqgBlockedPackage").jqGrid({
        url: getBaseURL() + '/PackageMaster/GetBlockedPackagesbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.PackageId, localization.Package, localization.BlockedDate, "Till Date","Reason", localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PackageId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PackageDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            //{ name: "BlockedPackageDate", width: 100, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            {
                name: 'BlockedPackageDate', index: 'BlockedPackageDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'TillDate', index: 'TillDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "Reason", width: 180, align: 'left', editable: true, editoptions: { maxlength: 250 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 88, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditBlockedPackage(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditBlockedPackage(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' 
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnBlockedPackage"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpBlockedPackage",
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
        forceFit: true, caption:'Blocked Package',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgBlockedPackage");
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

    }).jqGrid('navGrid', '#jqpBlockedPackage', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpBlockedPackage', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBlockedPackage
        }).jqGrid('navButtonAdd', '#jqpBlockedPackage', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBlockedPackage
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgBlockedPackage"),
            newWidth = $grid.closest(".BlockedPackagecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}
var _isInsert = true;

function fnAddBlockedPackage() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key");
        return;
    }
    else {

        fnClearFields();
        $("#txtBlockedpackagedate").prop('disabled', false);
        $("#txtTilldate").prop('disabled', false);
        $('#PopupBlockedPackage').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#PopupBlockedPackage').find('.modal-title').text(localization.AddBlockedPackage);
        $("#btnSaveBlockedpackage").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveBlockedpackage").show();
        $("#btndeActiveBlockedpackage").hide();
        _isInsert = true;
    }
}

function fnEditBlockedPackage(e, actiontype) {
    var rowid = $("#jqgBlockedPackage").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBlockedPackage').jqGrid('getRowData', rowid);
    
    $('#PopupBlockedPackage').modal('show');
    
    $("#cboPackage").val(rowData.PackageId).selectpicker('refresh');
    $('#cboPackage').prop('disabled', true).selectpicker('refresh');

    if (rowData.BlockedPackageDate !== null) {
        setDate($('#txtBlockedpackagedate'), fnGetDateFormat(rowData.BlockedPackageDate));
    }
    else {
        $('#txtBlockedpackagedate').val('');
    }

    $("#txtBlockedpackagedate").prop('disabled', true);

    if (rowData.TillDate !== null) {
        setDate($('#txtTilldate'), fnGetDateFormat(rowData.TillDate));
    }
    else {
        $('#txtTilldate').val('');
    }

    $("#txtReason").val(rowData.Reason);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBlockedpackage").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupBlockedPackage').find('.modal-title').text(localization.EditBlockedPackage);
        $("#btnSaveBlockedpackage").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveBlockedpackage").attr("disabled", false);
        $("#btnSaveBlockedpackage").show();
        $("#btndeActiveBlockedpackage").hide();
        _isInsert = false;
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $("#txtTilldate").prop('disabled', true);
        $('#PopupBlockedPackage').find('.modal-title').text(localization.ViewBlockedPackage);
        $("#btnSaveBlockedpackage").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveBlockedpackage").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeActiveBlockedpackage").hide();
        $("#PopupBlockedPackage").on('hidden.bs.modal', function () {
            $("#btnSaveBlockedpackage").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupBlockedPackage').modal('show');
        $('#PopupBlockedPackage').find('.modal-title').text("Activate/De Activate Blocked Package");
        $("#btnSaveBlockedpackage").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveBlockedpackage").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveBlockedpackage").html(localization.DActivate);
        }
        else {
            $("#btndeActiveBlockedpackage").html(localization.Activate);
        }

        $("#btndeActiveBlockedpackage").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupBlockedPackage").on('hidden.bs.modal', function () {
            $("#btnSaveBlockedpackage").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveBlockedpackage() {
   
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key");
        return;
    }
    if (IsStringNullorEmpty($("#cboPackage").val()) || $("#cboPackage").val() === "0") {
        toastr.warning("Please select a Package");
        return;
    }
    if (IsStringNullorEmpty($("#txtBlockedpackagedate").val())) {
        toastr.warning("Please select a Blocked date");
        return;
    }
    obj_block = {
        BusinessKey: $("#cboBusinessLocation").val(),
        PackageId: $("#cboPackage").val(),
        BlockedPackageDate: getDate($("#txtBlockedpackagedate")),
        TillDate: getDate($("#txtTilldate")),
        Reason: $("#txtReason").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveBlockedpackage").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PackageMaster/InsertOrUpdateBlockedPackage',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_block },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBlockedpackage").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBlockedPackage").modal('hide');
                fnClearFields();
                fnGridRefreshBlockedPackage();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBlockedpackage").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBlockedpackage").attr("disabled", false);
        }
    });
}

function fnGridRefreshBlockedPackage() {
    $("#jqgBlockedPackage").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $('#cboPackage').val('0').selectpicker('refresh');
    $('#cboPackage').prop('disabled', false).selectpicker('refresh');
    $("#txtBlockedpackagedate").val('');
    $("#txtBlockedpackagedate").prop('disabled', false);
    $("#txtTilldate").val('');
    $("#txtReason").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveBlockedpackage").attr("disabled", false);
    $("#btndeActiveBlockedpackage").attr("disabled", false);
}

$("#btnCancelActivities").click(function () {
    $("#jqgBlockedPackage").jqGrid('resetSelection');
    $('#PopupBlockedPackage').modal('hide');
    fnClearFields();
});

function fnDeleteBlockedpackage() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    objdel = {
        BusinessKey: $("#cboBusinessLocation").val(),
        PackageId: $("#cboPackage").val(),
        BlockedPackageDate: getDate($("#txtBlockedpackagedate")),
        TillDate: getDate($("#txtTilldate")),
        Reason: $("#txtReason").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        a_status: a_status
    };

    $("#btndeActiveBlockedpackage").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PackageMaster/ActiveOrDeActiveBlockedPackage',
        type: 'POST',
        datatype: 'json',
        data: { objdel },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveBlockedpackage").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBlockedPackage").modal('hide');
                fnClearFields();
                fnGridRefreshBlockedPackage();
                $("#btndeActiveBlockedpackage").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveBlockedpackage").attr("disabled", false);
                $("#btndeActiveBlockedpackage").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveBlockedpackage").attr("disabled", false);
            $("#btndeActiveBlockedpackage").html('De Activate');
        }
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}