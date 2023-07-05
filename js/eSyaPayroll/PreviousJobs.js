
var actiontype = "";
function fnGridPreviousJob() {

    $("#jqgPreviousJobs").GridUnload();

    $("#jqgPreviousJobs").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeePreviousJobInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Organization, localization.ServicePeriodFrom, localization.ServicePeriodTill, localization.Designation, localization.ReasonforLeaving, localization.Actions],
        colModel: [
            { name: "Organization", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            //{ name: "ServicePeriodFrom", editable: true, width: 175, align: 'left', formatter: 'date'},
            //{ name: "ServicePeriodTill", editable: true, width: 175, align: 'left', formatter: 'date' },
            {
                name: 'ServicePeriodFrom', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'ServicePeriodTill', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "Designation", width: 305, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ReasonforLeaving", width: 185, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditPreviousJobs(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditPreviousJobs(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ],
        pager: "#jqpPreviousJobs",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
            //SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpPreviousJobs', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPreviousJobs', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmpPreviousJob
        }).jqGrid('navButtonAdd', '#jqpPreviousJobs', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPreviousEmpJob
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPreviousJobs"),
            newWidth = $grid.closest(".PreviousJobcontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPreviousEmpJob() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearPreviousJobFields();
    $('#PopupPreviousJobs').find('.modal-title').text(localization.AddPreviousJobDetails);
    $('#PopupPreviousJobs').modal('show');
    $("#btnSavePreviousjob").attr("disabled", false);
    $("#btnSavePreviousjob").html(localization.Save);
    $("#btnSavePreviousjob").show();
    $("#btnCancelPreviousjob").show();
    $("#txtOrganization").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);

} 

function fnEditPreviousJobs(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgPreviousJobs').jqGrid('getRowData', rowid);
    $('#PopupPreviousJobs').modal('show');
    $("#txtOrganization").val(rowData.Organization);
    $("#txtOrganization").prop('disabled', true);
    $("#txtDesignation").val(rowData.Designation);
    $("#txtReasonforleaving").val(rowData.ReasonforLeaving);
    if (rowData.ServicePeriodFrom !== null) {
        //setDate($('#txtServiceperiodfrom'), rowData.ServicePeriodFrom);
        setDate($('#txtServiceperiodfrom').val(rowData.ServicePeriodFrom));
    }
    else {
        $('#txtServiceperiodfrom').val('');
    }
    if (rowData.ServicePeriodTill !== null) {
        //setDate($('#txtServiceperiodtill'), rowData.ServicePeriodTill);
        setDate($('#txtServiceperiodtill').val(rowData.ServicePeriodTill));
    }
    else {
        $('#txtServiceperiodtill').val('');
    }
    
    $("#btnSavePreviousjob").attr("disabled", false);

    $('#PopupPreviousJobs').modal('show');


    if (actiontype.trim() == "edit") {
        $('#PopupPreviousJobs').find('.modal-title').text(localization.UpdatePreviousJobDetails);
        $("#btnSavePreviousjob").show();
        $("#btnSavePreviousjob").html(localization.Update);
        $("#btnCancelPreviousjob").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);

    }

    if (actiontype.trim() == "view") {
        $('#PopupPreviousJobs').find('.modal-title').text(localization.ViewPreviousJobDetails);
        $("#btnSavePreviousjob").attr("disabled", true);
        $("#btnSavePreviousjob").hide();
        $("#btnCancelPreviousjob").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}

function fnSavePreviousJobDetails() {
    if (IsValidPreviousJobDetails() === false) {
        return;
    }
    var objprejobinfo = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        Organization: $("#txtOrganization").val(),
        ServicePeriodFrom: $("#txtServiceperiodfrom").val(),
        ServicePeriodTill: $("#txtServiceperiodtill").val(),
        Designation: $("#txtDesignation").val(),
        ReasonforLeaving: $("#txtReasonforleaving").val(),

    };
    $("#btnSavePreviousjob").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeePreviousJobInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objprejobinfo },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupPreviousJobs').modal('hide');
                fnGridRefreshEmpPreviousJob();
                $("#btnSavePreviousjob").attr('disabled', false);
                fnClearPreviousJobFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePreviousjob").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePreviousjob").attr('disabled', false);
        }
    });

}

function IsValidPreviousJobDetails() {
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create Employee details Details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create Employee details Details");
        return false;
    }
   
    if (IsStringNullorEmpty($("#txtOrganization").val())) {
        toastr.warning("Please Enter Organization");
        return false;
    }
    if (IsStringNullorEmpty($("#txtServiceperiodfrom").val())) {
        toastr.warning("Please Select Service Period From");
        return false;
    }
    if (IsStringNullorEmpty($("#txtServiceperiodtill").val())) {
        toastr.warning("Please Select Service Period Till");
        return false;
    }
    if (IsStringNullorEmpty($("#txtDesignation").val())) {
        toastr.warning("Please Enter Designation");
        return false;
    }
    if (IsStringNullorEmpty($("#txtReasonforleaving").val())) {
        toastr.warning("Please Enter Reason for Leaving");
        return false;
    }
}

function fnGridRefreshEmpPreviousJob() {
    $("#jqgPreviousJobs").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearPreviousJobFields() {
    $("#txtOrganization").val('');
    $("#txtOrganization").prop('disabled', false);
    $("#txtDesignation").val('');
    $("#txtReasonforleaving").val('');
    $("#txtServiceperiodfrom").val('');
    $("#txtServiceperiodtill").val('');
    $("#btnSavePreviousjob").attr("disabled", false);
    $("#btnSavePreviousjob").html(localization.Save);
}

$("#btnCancelPreviousjob").click(function () {
    $("#jqgPreviousJobs").jqGrid('resetSelection');
    $('#PopupPreviousJobs').modal('hide');
    fnClearPreviousJobFields();
});
 