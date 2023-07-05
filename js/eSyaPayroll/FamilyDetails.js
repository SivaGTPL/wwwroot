
var actiontype = "";
function fnGridFamilyDetails() {

    $("#jqgFamily").GridUnload();

    $("#jqgFamily").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeeFamilyInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.MaritalStatus, localization.SpouseName, localization.NoOfChildren, localization.FatherName, localization.MotherName, localization.Actions],
        colModel: [
            { name: "MaritalStatus", editable: true, width: 60, edittype: "select", align: 'left', formatter: 'select', hidden: true , editoptions: { value: "S:Single;M:Married;O:Others" } },
            //{ name: "MaritalStatus", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "SpouseName", width: 225, align: 'left', editable: true, editoptions: { maxlength: 75 }, resizable: false },
            { name: "NoOfChildren", width: 155, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false },
            { name: "FatherName", width: 225, align: 'left', editable: true, editoptions: { maxlength: 75 }, resizable: false },
            { name: "MotherName", width: 225, align: 'left', editable: true, editoptions: { maxlength: 75 }, resizable: false },
            //{ name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width:188, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditFamilyDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditFamilyDetails(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
                }
            },
        ], 
        pager: "#jqpFamily",
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
    }).jqGrid('navGrid', '#jqpFamily', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpFamily', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshFamilyDetails
        }).jqGrid('navButtonAdd', '#jqpFamily', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddFamilyDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgFamily"),
            newWidth = $grid.closest(".SalaryDetailscontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddFamilyDetails() {
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearFamilyDetailsFields();
    $('#PopupFamily').find('.modal-title').text(localization.AddFamilyDetails);
    $('#PopupFamily').modal('show');
    $("#btnSaveFamilyDetails").attr("disabled", false);
    $("#btnSaveFamilyDetails").html(localization.Save);
    $("#btnSaveFamilyDetails").show();
    $("#btnCancelFamilyDetails").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    
}

function fnEditFamilyDetails(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgFamily').jqGrid('getRowData', rowid);

    //$("#cboMatiralstatus").val(rowData.MaritalStatus).selectpicker('refresh');
    
    $("#txtSpousename").val(rowData.SpouseName);
    $("#txtNoofchildern").val(rowData.NoOfChildren);
    $("#txtFathername").val(rowData.FatherName);
    $("#txtMothername").val(rowData.MotherName);
    $("#btnSaveFamilyDetails").attr("disabled", false);
    $('#PopupFamily').modal('show');


    if (actiontype.trim() == "edit") {
        $('#PopupFamily').find('.modal-title').text(localization.UpdateFamilyDetails);
        $("#btnSaveFamilyDetails").show();
        $("#btnCancelFamilyDetails").show();
        $("#btnSaveFamilyDetails").html(localization.Update);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);

    }

    if (actiontype.trim() == "view") {
        $('#PopupFamily').find('.modal-title').text(localization.ViewFamilyDetails);
        $("#btnSaveFamilyDetails").attr("disabled", true);
        $("#btnSaveFamilyDetails").hide();
        $("#btnCancelFamilyDetails").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);

    }

}

function fnSaveEmpFamilyDetails() {
    if (IsValidFamilyDetails() === false) {
        return;
    }
    var objfamilyinfo = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        //MaritalStatus: $("#cboMatiralstatus").val(),
        SpouseName: $("#txtSpousename").val(),
        NoOfChildren: $("#txtNoofchildern").val(),
        FatherName: $("#txtFathername").val(),
        MotherName: $("#txtMothername").val(),

    };
    $("#btnSaveFamilyDetails").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeFamilyInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objfamilyinfo },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupFamily').modal('hide');
                fnGridRefreshFamilyDetails();
                $("#btnSaveFamilyDetails").attr('disabled', false);
                fnClearFamilyDetailsFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveFamilyDetails").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFamilyDetails").attr('disabled', false);
        }
    });

}

function IsValidFamilyDetails() {
    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create the Employee details");
        return false;
    }
    //if ($("#cboMatiralstatus").val() == 0 || $("#cboMatiralstatus").val() == "0") {
    //    toastr.warning("Please select Matiral Status");
    //    return false;
    //}

    if (IsStringNullorEmpty($("#txtFathername").val())) {
        toastr.warning("Please Enter the Father Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtNoofchildern").val())) {
        toastr.warning("Please Enter the No of Childern");
        return false;
    }
   
    if (IsStringNullorEmpty($("#txtMothername").val())) {
        toastr.warning("Please Enter the Mother Name");
        return false;
    }
}

function fnGridRefreshFamilyDetails() {
    $("#jqgFamily").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFamilyDetailsFields() {
    $("#cboMatiralstatus").val('0').selectpicker('refresh');
    $("#txtSpousename").val('');
    $("#txtNoofchildern").val('');
    $("#txtFathername").val('');
    $("#txtMothername").val('');
    $("#btnSaveFamilyDetails").attr("disabled", false);
    $("#btnSaveFamilyDetails").html(localization.Save);
}

$("#btnCancelFamilyDetails").click(function () {
    $("#jqgFamily").jqGrid('resetSelection');
    $('#PopupFamily').modal('hide');
    fnClearFamilyDetailsFields();
});
