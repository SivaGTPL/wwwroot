
$(document).ready(function () {
    fnGridPackageMaster();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPackageMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPackageMaster(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPackageMaster(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPackageMaster(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridPackageMaster() {

    $("#jqgPackageMaster").GridUnload();

    $("#jqgPackageMaster").jqGrid({
        url: getBaseURL() + '/PackageMaster/GetAllPackageMasters',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PackageId, localization.Description, localization.ServiceDescription, localization.BookingRule, localization.BookingWindow, localization.NoOfNights, localization.CheckInWeekDays, localization.CheckInFromTime, localization.CheckInToTime, localization.CheckOutFromTime, localization.CheckOutToTime, localization.BookingApplicableFor,localization.Active, localization.Actions],
        colModel: [
            { name: "PackageId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PackageDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ServiceDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "BookingRule", width: 60, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "BookingWindow", width: 60, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "NoOfNights", width: 60, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "CheckInWeekDays", width: 85, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: 'CheckInFromTime', index: 'Tid', width: 70, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'CheckInToTime', index: 'Tid', width: 70, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'CheckOutFromTime', index: 'Tid', width:70, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'CheckOutToTime', index: 'Tid', width: 70, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: "BookingApplicableFor", editable: false, width: 100, edittype: "select", align: 'left', formatter: 'select', editoptions: { value: "P:Portal;U:User;B:Both" } },
            { name: "ActiveStatus", width: 60, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPackageMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpPackageMaster",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption:"Package Master",
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgPackageMaster");
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

    }).jqGrid('navGrid', '#jqpPackageMaster', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPackageMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPackageMaster
        }).jqGrid('navButtonAdd', '#jqpPackageMaster', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPackageMaster
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPackageMaster"),
            newWidth = $grid.closest(".PackageMastercontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPackageMaster() {
    _isInsert = true;
    fnClearFields();
    fnLoadCheckInWeekdaysGrid();
    $('#PopupPackageMaster').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupPackageMaster').find('.modal-title').text(localization.AddPackage);
    $("#btnSavePackageMaster").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePackageMaster").show();
    $("#btndeActivePackageMaster").hide();
    $('#txtPackageId').val('');
}

function fnEditPackageMaster(e, actiontype) {

    var rowid = $("#jqgPackageMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPackageMaster').jqGrid('getRowData', rowid);
    
    $('#txtPackageId').val(rowData.PackageId);
    $('#txtPackagedesc').val(rowData.PackageDesc);
    $('#txtServicedesc').val(rowData.ServiceDesc);
    $('#txtBookingRule').val(rowData.BookingRule);
    $('#txtBookingWindow').val(rowData.BookingWindow);
    $('#txtNoofNights').val(rowData.NoOfNights);
    //$('#txtCheckInWeekdays').val(rowData.CheckInWeekDays);
    $('#txtCheckInFromTime').val(rowData.CheckInFromTime);
    $('#txtCheckInToTime').val(rowData.CheckInToTime);
    $('#txtCheckOutFromTime').val(rowData.CheckOutFromTime);
    $('#txtCheckOutToTime').val(rowData.CheckOutToTime);
    $('#cboBookingApplicableFor').val(rowData.BookingApplicableFor).selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePackageMaster").attr("disabled", false);

    _isInsert = false;

    fnLoadCheckInWeekdaysGrid();
    $('#PopupPackageMaster').modal('show');

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupPackageMaster').find('.modal-title').text(localization.UpdatePackage);
        $("#btnSavePackageMaster").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActivePackageMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePackageMaster").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupPackageMaster').find('.modal-title').text(localization.ViewPackage);
        $("#btnSavePackageMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackageMaster").hide();
        $("#btndeActivePackageMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPackageMaster").on('hidden.bs.modal', function () {
            $("#btnSavePackageMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#PopupPackageMaster').find('.modal-title').text("Activate/De Activate Package");
        $("#btnSavePackageMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackageMaster").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActivePackageMaster").html(localization.DActivate);
        }
        else {
            $("#btndeActivePackageMaster").html(localization.Activate);
        }

        $("#btndeActivePackageMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPackageMaster").on('hidden.bs.modal', function () {
            $("#btnSavePackageMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSavePackageMaster() {
   
    if (IsStringNullorEmpty($("#txtPackagedesc").val())) {
        toastr.warning("Please Enter the Package Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtServicedesc").val())) {
        toastr.warning("Please Enter the Service Description");
        return;
    }
    if (IsStringNullorEmpty($("#txtBookingRule").val()) || $("#txtBookingRule").val() == "0") {
        toastr.warning("Please Enter the Booking Rule");
        return;
    }
    if (IsStringNullorEmpty($("#txtBookingWindow").val()) || $("#txtBookingWindow").val() == "0") {
        toastr.warning("Please Enter the Booking Window");
        return;
    }
    if (IsStringNullorEmpty($("#txtNoofNights").val()) || $("#txtNoofNights").val()=="0") {
        toastr.warning("Please Enter the Number of Nights");
        return;
    }
    //if (IsStringNullorEmpty($("#txtCheckInWeekdays").val())) {
    //    toastr.warning("Please Enter Check In Week days");
    //    return;
    //}
    if (IsStringNullorEmpty($("#txtCheckInFromTime").val())) {
        toastr.warning("Please Enter the Check In From Time");
        return;
    }
    if (IsStringNullorEmpty($("#txtCheckInToTime").val())) {
        toastr.warning("Please Enter the Check In To Time");
        return;
    }

    //if ($('#txtCheckInFromTime').val() >= $('#txtCheckInToTime').val()) {
    //    toastr.warning("Check In From Time can't be more than or equal to Check In To Time.");
    //    $('#txtCheckInToTime').focus();
    //    return;
    //}

    var CheckInFromstartTime = $('#txtCheckInFromTime').val();
    var CheckInToendTime = $('#txtCheckInToTime').val();

    var startDate = new Date("1/1/1900 " + CheckInFromstartTime);
    var endDate = new Date("1/1/1900 " + CheckInToendTime);

    if (startDate >= endDate) {
        toastr.warning("Check In From Time can't be more than or equal to Check In To Time.");
        $('#txtCheckInToTime').focus();
        return;
    }

    if (IsStringNullorEmpty($("#txtCheckOutFromTime").val())) {
        toastr.warning("Please Enter the Check Out From Time");
        return;
    }
    if (IsStringNullorEmpty($("#txtCheckOutToTime").val())) {
        toastr.warning("Please Enter the Check Out To Time");
        return;
    }

    var CheckOutFromstartTime = $('#txtCheckOutFromTime').val();
    var CheckOutToendTime = $('#txtCheckOutToTime').val();

    var CheckOutstartDate = new Date("1/1/1900 " + CheckOutFromstartTime);
    var CheckOutendDate = new Date("1/1/1900 " + CheckOutToendTime);

    if (CheckOutstartDate >= CheckOutendDate) {
        toastr.warning("Check Out From Time can't be more than or equal to Check Out To Time.");
        $('#txtCheckOutToTime').focus();
        return;
    }
    //if ($('#txtCheckOutFromTime').val() >= $('#txtCheckOutToTime').val()) {
    //    toastr.warning("Check Out From Time can't be more than or equal to Check Out To Time.");
    //    $('#txtCheckOutToTime').focus();
    //    return;
    //}
    if (IsStringNullorEmpty($("#cboBookingApplicableFor").val()) || $("#cboBookingApplicableFor").val() == "0") {
        toastr.warning("Please select Booking Applicable for");
        return;
    }
    var val = [];
    var numberOfRecords = $("#jqgCheckInWeekDays").getGridParam("records");
    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgCheckInWeekDays').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            val.push({
                PackageId: $("#txtPackageId").val() === '' ? 0 : $("#txtPackageId").val(),
                CheckInWeekdays: rowData.CheckInWeekdays,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }

    packg = {
        PackageId: $("#txtPackageId").val() === '' ? 0 : $("#txtPackageId").val(),
        PackageDesc: $("#txtPackagedesc").val(),
        ServiceDesc: $("#txtServicedesc").val(),
        BookingRule: $("#txtBookingRule").val(),
        BookingWindow: $("#txtBookingWindow").val(),
        NoOfNights: $("#txtNoofNights").val(),
        //CheckInWeekDays: $("#txtCheckInWeekdays").val(),
        CheckInWeekDays: "0",
        CheckInFromTime: $("#txtCheckInFromTime").val(),
        CheckInToTime: $("#txtCheckInToTime").val(),
        CheckOutFromTime: $("#txtCheckOutFromTime").val(),
        CheckOutToTime: $("#txtCheckOutToTime").val(),
        BookingApplicableFor: $("#cboBookingApplicableFor").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        _lstweekdays: val
    };

    $("#btnSavePackageMaster").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PackageMaster/InsertOrUpdatePackageMaster',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: packg },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePackageMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackageMaster").modal('hide');
                fnClearFields();
                fnGridRefreshPackageMaster();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePackageMaster").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePackageMaster").attr("disabled", false);
        }
    });
}

function fnGridRefreshPackageMaster() {
    $("#jqgPackageMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtPackageId").val('');
    $("#txtPackagedesc").val('');
    $("#txtServicedesc").val('');
    $("#txtBookingRule").val('');
    $("#txtBookingWindow").val('');
    $("#txtNoofNights").val('');
    //$("#txtCheckInWeekdays").val('');
    $('#cboBookingApplicableFor').val("0").selectpicker('refresh');
    $("#txtCheckInFromTime").val('');
    $('#txtCheckInToTime').val('');
    $("#txtCheckOutFromTime").val('');
    $("#txtCheckOutToTime").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSavePackageMaster").attr("disabled", false);
    $("#btndeActivePackageMaster").attr("disabled", false);
}

$("#btnCancelPackageMaster").click(function () {
    $("#jqgPackageMaster").jqGrid('resetSelection');
    $('#PopupPackageMaster').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnDeletePackageMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActivePackageMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PackageMaster/ActiveOrDeActivePackageMaster?status=' + a_status + '&packageId=' + $("#txtPackageId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActivePackageMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackageMaster").modal('hide');
                fnClearFields();
                fnGridRefreshPackageMaster();
                $("#btndeActivePackageMaster").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActivePackageMaster").attr("disabled", false);
                $("#btndeActivePackageMaster").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActivePackageMaster").attr("disabled", false);
            $("#btndeActivePackageMaster").html('De Activate');
        }
    });
}


function fnLoadCheckInWeekdaysGrid() {
    $("#jqgCheckInWeekDays").GridUnload();
    var packageId= $("#txtPackageId").val() === '' ? 0 : $("#txtPackageId").val();

    $("#jqgCheckInWeekDays").jqGrid(

        {
            url: getBaseURL() + '/PackageMaster/GetCheckInWeekDaysByPackageId?packageId=' + packageId,
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: ["PackageId","Check In Days","Select"],
            colModel: [
                { name: "PackageId", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'CheckInWeekdays', index: 'CheckInWeekdays', width: '270', resizable: false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth: 55,
            loadonce: true,
            pager: "#jqpCheckInWeekDays",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false, scrollOffset: 0,
            onSelectRow: function (rowid) {
                CheckInWeekdays = $("#jqgCheckInWeekDays").jqGrid('getCell', rowid, 'CheckInWeekdays');

            },
            loadComplete: function (data) {
                fnDisableActivecheckboxs();
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            },
        })

        .jqGrid('navGrid', '#jqpCheckInWeekDays', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpCheckInWeekDays', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshCheckInWeekdayskGrid
        });
    fnAddGridSerialNoHeading();
}

function fnDisableActivecheckboxs() {
    //if (businesslocation === true) {
    //    $("input[type=checkbox]").attr('disabled', true);
    //}
    //if (businesslocation === false) {
    //    $("input[type=checkbox]").attr('disabled', false);
    //}
}

function fnRefreshCheckInWeekdayskGrid() {
    $("#jqgCheckInWeekDays").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}