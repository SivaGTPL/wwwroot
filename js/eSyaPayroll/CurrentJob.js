
var actiontype = "";
function fnGridCurrentJob() {

    $("#jqgCurrentJobs").GridUnload();

    $("#jqgCurrentJobs").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeeCurrentJobInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.FromDate, localization.TillDate, localization.Department, localization.Designation, localization.FunctionalReportingTo, localization.AdministrativeReportingTo, localization.Actions],
        colModel: [
            //{ name: "FromDate", editable: true, width: 140, align: 'left', formatter: 'date'},
            //{ name: "TillDate", editable: true, width: 140, align: 'left', formatter: 'date' },
            {
                name: 'FromDate', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'TillDate', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "Department", width: 190, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "Designation", width: 225, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "FunctionalReportingTo", width: 225, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: true },
            { name: "AdministrativeReportingTo", width: 225, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: true },
            {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditCurrentJobs(event,\'edit\');"><i class="fa fa-edit"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditCurrentJobs(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ], 
        pager: "#jqpCurrentJobs",
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
    }).jqGrid('navGrid', '#jqpCurrentJobs', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCurrentJobs', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCurrentJobDetails
        }).jqGrid('navButtonAdd', '#jqpCurrentJobs', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmpCurrentJob
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgCurrentJobs"),
            newWidth = $grid.closest(".PreviousJobcontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddEmpCurrentJob() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnCurrentJobClearFields();
    $('#PopupCurrentJobs').find('.modal-title').text(localization.AddCurrentJobDetails);
    $('#PopupCurrentJobs').modal('show');
    $("#btnSaveCurrentjob").attr("disabled", false);
    $("#btnSaveCurrentjob").html(localization.Save);
    $("#btnSaveCurrentjob").show();
    $("#btnCancelCurrentjob").show();
    $("#txtcurrentjobFromdate").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnEditCurrentJobs(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCurrentJobs').jqGrid('getRowData', rowid);
    $("#cboCurrentjobdepartment").val(rowData.Department).selectpicker('refresh');
    $("#cboCurrentjobdesignation").val(rowData.Designation).selectpicker('refresh');
    $("#txtFunctionalreporting").val(rowData.FunctionalReportingTo);
    $("#txtAdministrativereporting").val(rowData.AdministrativeReportingTo);
    $("#txtcurrentjobFromdate").prop('disabled', true);
    if (rowData.FromDate !== null) {
        //setDate($('#txtcurrentjobFromdate'), rowData.FromDate);
        setDate($('#txtcurrentjobFromdate').val(rowData.FromDate));
    }
    else {
        $('#txtcurrentjobFromdate').val('');
    }
    if (rowData.TillDate !== null) {
        //setDate($('#txtcurrentjobTilldate'), rowData.TillDate);
        setDate($('#txtcurrentjobTilldate').val(rowData.TillDate));
    }
    else {
        $('#txtcurrentjobTilldate').val('');
    }

    $("#btnSaveCurrentjob").attr("disabled", false);

    $('#PopupCurrentJobs').modal('show');


    if (actiontype.trim() == "edit") {
        $('#PopupCurrentJobs').find('.modal-title').text(localization.UpdateCurrentJobDetails);
        $("#btnSaveCurrentjob").show();
        $("#btnSaveCurrentjob").html(localization.Update);
        $("#btnCancelCurrentjob").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $('#txtcurrentjobTilldate').prop('disabled', false);

    }

    if (actiontype.trim() == "view") {
        $('#PopupCurrentJobs').find('.modal-title').text(localization.ViewCurrentJobDetails);
        $("#btnSaveCurrentjob").attr("disabled", true);
        $("#btnSaveCurrentjob").hide();
        $("#btnCancelCurrentjob").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $('#txtcurrentjobTilldate').prop('disabled', true);
    }


}

function fnSaveCurrentJobDetails() {
    if (IsValidCurrentJobDetails() === false) {
        return;
    }
    var objCurrentjob = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        FromDate: $("#txtcurrentjobFromdate").val(),
        TillDate: $("#txtcurrentjobTilldate").val(),
        Department: $("#cboCurrentjobdepartment").val(),
        Designation: $("#cboCurrentjobdesignation").val(),
        FunctionalReportingTo: $("#txtFunctionalreporting").val(),
        AdministrativeReportingTo: $("#txtAdministrativereporting").val()

    };
    $("#btnSaveCurrentjob").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeCurrentJobInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objCurrentjob },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupCurrentJobs').modal('hide');
                fnGridRefreshCurrentJobDetails();
                $("#btnSaveCurrentjob").attr('disabled', false);
                fnCurrentJobClearFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCurrentjob").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCurrentjob").attr('disabled', false);
        }
    });

}

function IsValidCurrentJobDetails() {
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtcurrentjobFromdate").val())) {
        toastr.warning("Please Select a Effective From Date");
        return false;
    }
    if ($("#cboCurrentjobdepartment").val() == 0 || $("#cboCurrentjobdepartment").val() == "0") {
        toastr.warning("Please select a Department");
        return false;
    }

    if ($("#cboCurrentjobdesignation").val() == 0 || $("#cboCurrentjobdesignation").val() == "0") {
        toastr.warning("Please select a Designation");
        return false;
    }
}

function fnGridRefreshCurrentJobDetails() {
    $("#jqgCurrentJobs").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnCurrentJobClearFields() {
    $("#cboCurrentjobdepartment").val('0').selectpicker('refresh');
    $("#cboCurrentjobdesignation").val('0').selectpicker('refresh');
    $("#txtFunctionalreporting").val('');
    $("#txtAdministrativereporting").val('');
    $("#txtcurrentjobFromdate").val('');
    $("#txtcurrentjobFromdate").prop('disabled', false);
    $("#txtcurrentjobTilldate").val('');
    $('#txtcurrentjobTilldate').prop('disabled', false);
    $("#btnSaveCurrentjob").attr("disabled", false);
    $("#btnSaveCurrentjob").html(localization.Save);
}

$("#btnCancelCurrentjob").click(function () {
    $("#jqgCurrentJobs").jqGrid('resetSelection');
    $('#PopupCurrentJobs').modal('hide');
    fnCurrentJobClearFields();
});
