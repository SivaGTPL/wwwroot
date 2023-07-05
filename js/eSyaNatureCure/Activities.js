
$(document).ready(function () {
    fnGridLoadRoomType();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnActivities",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditActivities(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditActivities(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditActivities(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadRoomType() {

    $("#jqgActivities").GridUnload();

    $("#jqgActivities").jqGrid({
        url: getBaseURL() + '/Activities/GetAllActivities',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ActivityId, localization.ActivityDescription, localization.ScheduleType, "DepartmentId","Department",localization.Active, localization.Actions],
        colModel: [
            { name: "ActivityId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ActivityDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ScheduleType", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "F: Fixed;C: Change" } },
            { name: "DepartmentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "DepartmentName", editable: true, align: 'left', width: 80, edittype: "select", resizable: false},
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 88, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditActivities(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditActivities(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditActivities(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnActivities"> <i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpActivities",
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
        forceFit: true, caption:'Activities',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgActivities");
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
    }).jqGrid('navGrid', '#jqpActivities', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpActivities', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshActivities
        }).jqGrid('navButtonAdd', '#jqpActivities', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddACtivities
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgActivities"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddACtivities() {
    _isInsert = true;
    fnClearFields();
    $('#PopupActivities').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupActivities').find('.modal-title').text(localization.AddActivities);
    $("#btnSaveACtivities").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveACtivities").show();
    $("#btndeActiveActivities").hide();
    $('#txtActivityId').val('');
}

function fnEditActivities(e, actiontype) {
    var rowid = $("#jqgActivities").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgActivities').jqGrid('getRowData', rowid);

    $('#PopupActivities').modal('show');
    $('#txtActivityId').val(rowData.ActivityId);
    $('#txtActivitydesc').val(rowData.ActivityDesc);
    $('#cboScheduleType').val(rowData.ScheduleType);
    $('#cboScheduleType').selectpicker('refresh');
    $('#cboDepartment').val(rowData.DepartmentId);
    $('#cboDepartment').selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveACtivities").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupActivities').find('.modal-title').text(localization.UpdateActivities);
        $("#btnSaveACtivities").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveActivities").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveACtivities").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupActivities').find('.modal-title').text(localization.ViewActivities);
        $("#btnSaveACtivities").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveACtivities").hide();
        $("#btndeActiveActivities").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupActivities").on('hidden.bs.modal', function () {
            $("#btnSaveACtivities").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupActivities').find('.modal-title').text("Activate/De Activate Activities");
        $("#btnSaveACtivities").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveACtivities").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveActivities").html(localization.DActivate);
        }
        else {
            $("#btndeActiveActivities").html(localization.Activate);
        }

        $("#btndeActiveActivities").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupActivities").on('hidden.bs.modal', function () {
            $("#btnSaveACtivities").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveActivities() {

    if (IsStringNullorEmpty($("#txtActivitydesc").val())) {
        toastr.warning("Please Enter the Activity Description");
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleType").val())) {
        toastr.warning("Please Select a ScheduleType");
        return;
    }
    objactivity = {
        ActivityId: $("#txtActivityId").val() === '' ? 0 : $("#txtActivityId").val(),
        ActivityDesc: $("#txtActivitydesc").val(),
        ScheduleType: $("#cboScheduleType").val(),
        DepartmentId: $('#cboDepartment').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveACtivities").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Activities/InsertOrUpdateActivities',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objactivity },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveACtivities").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupActivities").modal('hide');
                fnClearFields();
                fnGridRefreshActivities();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveACtivities").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveACtivities").attr("disabled", false);
        }
    });
}

function fnGridRefreshActivities() {
    $("#jqgActivities").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtActivityId").val('');
    $("#txtActivitydesc").val('');
    $('#cboScheduleType').val("F");
    $('#cboDepartment').val("null");
    $('#cboScheduleType').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveACtivities").attr("disabled", false);
    $("#btndeActiveActivities").attr("disabled", false);
}

$("#btnCancelActivities").click(function () {
    $("#jqgActivities").jqGrid('resetSelection');
    $('#PopupActivities').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnDeleteActivities() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveActivities").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Activities/ActiveOrDeActiveActivities?status=' + a_status + '&activityId=' + $("#txtActivityId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveActivities").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupActivities").modal('hide');
                fnClearFields();
                fnGridRefreshActivities();
                $("#btndeActiveActivities").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveActivities").attr("disabled", false);
                $("#btndeActiveActivities").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveActivities").attr("disabled", false);
            $("#btndeActiveActivities").html('De Activate');
        }
    });
}