var actiontype = "";
function fnGridEducation() {

    $("#jqgEducation").GridUnload();

    $("#jqgEducation").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeeEducationInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.EducationLevel, localization.Institution, localization.University, localization.YearofPassing, localization.PercentageofMarks, localization.Actions],
        colModel: [
            { name: "EducationLevel", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "Institution", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "University", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "YearofPassing", width: 185, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "PercentageofMarks", width: 155, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            {
                name: 'edit', search: false, align: 'left', width: 188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditEmpEducationDetails(event,\'edit\');"><i class="fa fa-edit"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditEmpEducationDetails(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ],
        pager: "#jqpEducation",
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
    }).jqGrid('navGrid', '#jqpEducation', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpEducation', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEducation
        }).jqGrid('navButtonAdd', '#jqpEducation', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEducation
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgEducation"),
            newWidth = $grid.closest(".Educationcontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddEducation() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearEducationFields();
    $('#PopupEducation').find('.modal-title').text(localization.AddEducationDetails);
    $('#PopupEducation').modal('show');
    $("#btnSaveEducation").attr("disabled", false);
    $("#btnSaveEducation").html(localization.Save);
    $("#btnSaveEducation").show();
    $("#btnCancelEducationDetails").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#txtEducationlevel").attr('readonly', false);
}

function fnEditEmpEducationDetails(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgEducation').jqGrid('getRowData', rowid);

    $("#txtEducationlevel").val(rowData.EducationLevel);
    $("#txtEducationlevel").attr("readonly", "readonly");
    $("#txtInstitution").val(rowData.Institution);
    $("#txtUniversity").val(rowData.University);
    $("#txtYearofpassing").val(rowData.YearofPassing);
    $("#txtPercentageofmarks").val(rowData.PercentageofMarks);
    $('#PopupEducation').modal('show');
    $("#btnSaveEducation").attr("disabled", false);
    
    if (actiontype.trim() == "edit") {
        $('#PopupEducation').find('.modal-title').text(localization.UpdateEducationDetails);
        $("#btnSaveEducation").html(localization.Update);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtEducationlevel").attr('readonly', true);
        $("#btnCancelEducationDetails").show();
        $("#btnSaveEducation").show();
    }

    if (actiontype.trim() == "view") {
        $('#PopupEducations').find('.modal-title').text(localization.ViewEducationDetails);
        $("#btnSaveEducation").html(localization.Update);
        $("#btnSaveEducation").attr("disabled", true);
        $("#btnSaveEducation").hide();
        $("#btnCancelEducationDetails").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}

function fnSaveEducationDetails() {
    if (IsValidEducationDetails() === false) {
        return;
    }
    var objeducationinfo = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        EducationLevel: $("#txtEducationlevel").val(),
        Institution: $("#txtInstitution").val(),
        University: $("#txtUniversity").val(),
        YearofPassing: $("#txtYearofpassing").val(),
        PercentageofMarks: $("#txtPercentageofmarks").val(),
    };
    $("#btnSaveEducation").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeEducationInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objeducationinfo },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupEducation').modal('hide');
                fnGridRefreshEducation();
                $("#btnSaveEducation").attr('disabled', false);
                fnClearEducationFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveEducation").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEducation").attr('disabled', false);
        }
    });

}

function IsValidEducationDetails() {
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    
    if (IsStringNullorEmpty($("#txtEducationlevel").val())) {
        toastr.warning("Please Enter the Education Level");
        return false;
    }

    if (IsStringNullorEmpty($("#txtInstitution").val())) {
        toastr.warning("Please Enter the Institution");
        return false;
    }
    if (IsStringNullorEmpty($("#txtUniversity").val())) {
        toastr.warning("Please Enter the University");
        return false;
    }
    if (IsStringNullorEmpty($("#txtYearofpassing").val())) {
        toastr.warning("Please Enter the Year of Passing");
        return false;
    }
    if (IsStringNullorEmpty($("#txtPercentageofmarks").val())) {
        toastr.warning("Please Enter the Percentage of Marks");
        return false;
    }
}

function fnGridRefreshEducation() {
    $("#jqgEducation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearEducationFields() {
    $("#txtEducationlevel").attr('readonly', false);
    $("#txtEducationlevel").val('');
    $("#txtInstitution").val('');
    $("#txtUniversity").val('');
    $("#txtYearofpassing").val('');
    $("#txtPercentageofmarks").val('');   
    $("#btnSaveEducation").attr("disabled", false);
    $("#btnSaveEducation").html(localization.Save);

}

$("#btnCancelEducationDetails").click(function () {
    $("#PopupEducations").jqGrid('resetSelection');
    $('#PopupEducations').modal('hide');
    fnClearEducationFields();

});
 
