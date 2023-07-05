
var actiontype = "";

//function fnGridSalaryInfo() {
//    fnClearSalaryInfoFields();

//    fnFillSalaryInfo();

//    $("#jqgSalaryInfo").GridUnload();
//    $("#jqgSalaryInfo").jqGrid({
//        url: getBaseURL() + '/EmployeeExpat/GetSalaryBreakup?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
//        datatype: 'json',
//        mtype: 'POST',
//        contentType: 'application/json; charset=utf-8',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        colNames: ["Currency", "CurrencyDescription", "Amount", "TransferTo", "TransferToDescription", "Actions"],
//        colModel: [
//            { name: "PaymentByCurrency", width: 90, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
//            { name: "CurrencyDescription", width: 100, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
//            { name: "PaymentAmountBySalaryCurrency", width: 95, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
//            { name: "TransferTo", width: 55, align: 'left', editable: false, hidden: true, editoptions: { maxlength: 50 }, resizable: false },
//            { name: "TransferToDescription", width: 100, align: 'left', editable: false, hidden: false, editoptions: { maxlength: 50 }, resizable: false },
//            {
//                name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
//                formatter: function (cellValue, options, rowdata, action) {
//                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSalaryInfo(event);"><i class="fa fa-edit"></i>' + 'Edit' + '</button>' +
//                        //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSalaryInfo(event,\'view\');"><i class="far fa-eye"></i>' + 'View' + '</button>'
//                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" onclick="return fnDeleteSalaryInfo(event);"><i class="far fa-delete"></i>' + 'Delete' + '</button>'
//                }
//            },
//        ],
//        pager: "#jqpSalaryInfo",
//        rowNum: 10,
//        rowList: [10, 20, 50, 100],
//        loadonce: true,
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        scroll: false,
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//        loadComplete: function (data) {
//            //SetGridControlByAction();
//        },
//    }).jqGrid('navGrid', '#jqpSalaryInfo', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSalaryInfo', {
//        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSalaryInfo
//        }).jqGrid('navButtonAdd', '#jqpSalaryInfo', {
//            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmpSalaryInfo
//    });

//        $(window).on("resize", function () {
//        var $grid = $("#jqgSalaryInfo"),
//            newWidth = $grid.closest(".SalaryInfocontainer").parent().width();
//        $grid.jqGrid("setGridWidth", newWidth, true);
//    });
//    fnAddGridSerialNoHeading();
//}

//function fnFillSalaryInfo() {
//    if ($("#txtEmployeeNumber").val() !== '' && $("#txtEmployeeNumber").val() !== undefined) {
//        $.ajax({
//            async: false,
//            url: getBaseURL() + '/EmployeeExpat/GetSalaryInfo?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
//            type: 'post',
//            datatype: 'json',
//            contentType: 'application/json; charset=utf-8',
//            success: function (result) {
//                $("#txtsalary").val(result.SalaryAmount);
//                $("#cboSalaryCurrency").val(result.SalaryCurrency);
//                $("#cboSalaryCurrency").selectpicker('refresh');
//                if (result.IsIncentiveApplicable === true) {
//                    $("#chkIncentiveApplicable").parent().addClass("is-checked");
//                }
//                else {
//                    $("#chkIncentiveApplicable").parent().removeClass("is-checked");
//                }
//                if (result.IsNHIFApplicable === true) {
//                    $("#chkNHIF").parent().addClass("is-checked");
//                    $("#divNHIF").css('display', 'block')
//                }
//                else {
//                    $("#chkNHIF").parent().removeClass("is-checked");
//                    $("#divNHIF").css('display', 'none')
//                }
//                $("#txtNHIFPercentage").val(result.NHIFAmount);

//                if (result.IsNSSFApplicable === true) {
//                    $("#chkNSSF").parent().addClass("is-checked");
//                    $("#divNSSF").css('display', 'block')
//                }
//                else {
//                    $("#chkNSSF").parent().removeClass("is-checked");
//                    $("#divNSSF").css('display', 'none')
//                }
//                $("#txtNSSFPercentage").val(result.NSSFAmount);
//            }
//        });
//    }
//}

function fnAddEmpSalaryInfo() {
    debugger;
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearSalaryInfoFields();
    $('#PopupSalaryInfo').find('.modal-title').text("Add Currency To Pay ");
    $('#PopupSalaryInfo').modal('show');
    $("#btnSaveSalaryInfo").attr("disabled", false);
    $("#btnSaveSalaryInfo").html('ADD');
    $("#btnSaveSalaryInfo").show();
    $("#btnCancelSalaryInfo").show();
    $("#chkAccountStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);

    $("#btnSaveSalaryInfo").off("click");
    $("#btnSaveSalaryInfo").on("click", function () { fnAddUpdateSalaryInfo(-1); });

}


function fnEditSalaryInfo(e) {

    fnClearSalaryInfoFields();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSalaryInfo').jqGrid('getRowData', rowid);
    EmployeeNo = rowData.EmployeeNumber;
    $("#cboCurrency").val(rowData.PaymentByCurrency);
    $("#cboCurrency").selectpicker('refresh');
    $("#txtAmount").val(rowData.PaymentAmountBySalaryCurrency);
    $("#cboTransferTo").val(rowData.TransferTo);
    $("#cboTransferTo").selectpicker('refresh');

    $("#divForm").css("display", "block");
    $("#divGrid").hide();

    $('#PopupSalaryInfo').find('.modal-title').text("Edit Currency To Pay");
    $('#PopupSalaryInfo').modal('show');
    $("#btnSaveSalaryInfo").attr("disabled", false);
    $("#btnSaveSalaryInfo").html('Update');
    $("#btnSaveSalaryInfo").show();
    $("#btnCancelSalaryInfo").show();
    $("#chkAccountStatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);

    var rowid = $(e.target).parents("tr.jqgrow").attr('id')
    var $Grid = $('#jqgSalaryInfo');

    $("#btnSaveSalaryInfo").off("click");

    $('#btnSaveSalaryInfo').html("Update");
    $("#btnSaveSalaryInfo").on("click", function () { fnAddUpdateSalaryInfo(rowid); });
    //$Grid.jqGrid('delRowData', rowid);
}


function fnAddUpdateSalaryInfo(rowid) {
    if (rowid === -1) {
        fnAddToGrid();
    }
    else{
        fnUpdateToGrid(rowid);
    }
}

var lastRowID = 0;

function fnAddToGrid() {
    if ($("#cboCurrency").val() === "0" || $("#cboCurrency").val() === "") {
        toastr.warning("Please Select a Currency");
        $('#cboCurrency').focus();
        return;
    }
    if ($("#txtAmount").val().trim().length <= 0) {
        toastr.warning("Please Enter the Amount");
        $('#txtAmount').focus();
        return;
    }
    if ($("#cboTransferTo").val() === "0" || $("#cboTransferTo").val() === "") {
        toastr.warning("Please Select a Trasnfer To");
        $('#cboTransferTo').focus();
        return;
    }

    var salaryInfo = {
        PaymentByCurrency: $('#cboCurrency').val(),
        CurrencyDescription: $('#cboCurrency option:selected').text(),
        PaymentAmountBySalaryCurrency: $('#txtAmount').val(),
        TransferTo: $('#cboTransferTo').val(),
        TransferToDescription: $('#cboTransferTo option:selected').text(),
    };

    lastRowID = lastRowID + 1;
    jQuery("#jqgSalaryInfo").jqGrid('addRowData', lastRowID, salaryInfo, 'last');

    $("#PopupSalaryInfo").modal('hide');
}

function fnUpdateToGrid(EditId) {
    if ($("#cboCurrency").val() === "0" || $("#cboCurrency").val() === "") {
        toastr.warning("Please Select a Currency");
        $('#cboCurrency').focus();
        return;
    }
    if ($("#txtAmount").val().trim().length <= 0) {
        toastr.warning("Please Enter the Amount");
        $('#txtAmount').focus();
        return;
    }
    if ($("#cboTransferTo").val() === "0" || $("#cboTransferTo").val() === "") {
        toastr.warning("Please Select a Trasnfer To");
        $('#cboTransferTo').focus();
        return;
    }

    var salinfo = {
        PaymentByCurrency: $('#cboCurrency').val(),
        CurrencyDescription: $('#cboCurrency option:selected').text(),
        PaymentAmountBySalaryCurrency: $('#txtAmount').val(),
        TransferTo: $('#cboTransferTo').val(),
        TransferToDescription: $('#cboTransferTo option:selected').text(),
    };

    jQuery("#jqgSalaryInfo").jqGrid('setRowData', EditId, salinfo);
    
    $("#PopupSalaryInfo").modal('hide');
}

function fnDeleteSalaryInfo(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id')
    var $Grid = $('#jqgSalaryInfo');
    $Grid.jqGrid('delRowData', rowid);
}

function fnSaveSalaryInfo() {
    if (validateSalaryInfo() == false) {
        return;
    }

    $("#btnSaveEmployeeDetails").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveEmployeeDetails").attr('disabled', true);

    var salaryHeader = {
        BusinessKey: $("#cboBusinessLocation").val(),
        EmployeeNumber: $("#txtEmployeeNumber").val(),
        SalaryAmount: $('#txtsalary').val(),
        SalaryCurrency: $('#cboSalaryCurrency').val(),
        IsBankChargeApplicable: $("#chkBankChargeApplicable").parent().hasClass("is-checked"),
        IsIncentiveApplicable: $("#chkIncentiveApplicable").parent().hasClass("is-checked"),
        IsNHIFApplicable: $("#chkNHIF").parent().hasClass("is-checked"),
        IsNSSFApplicable: $("#chkNSSF").parent().hasClass("is-checked"),
        NHIFAmount: $('#txtNHIFPercentage').val(),
        NSSFAmount: $('#txtNSSFPercentage').val(),
    }
    
    var SrNo = 0;
    var salaryDetail = [];
    var gvSalaryInfo = jQuery("#jqgSalaryInfo").jqGrid('getRowData');
    for (var i = 0; i < gvSalaryInfo.length; ++i) {
        if (parseFloat(gvSalaryInfo[i]["PaymentAmountBySalaryCurrency"]) > 0 || parseFloat(gvSalaryInfo[i]["PaymentAmountBySalaryCurrency"]) > 0) {
            SrNo = SrNo + 1;

            if ($.isEmptyObject(gvSalaryInfo[i]["PaymentByCurrency"]) || gvSalaryInfo[i]["PaymentByCurrency"].length <= 0) {
                alert("Select the Currency");
                return;
            }
            
            if ($.isEmptyObject(gvSalaryInfo[i]["TransferTo"]) || parseFloat(gvSalaryInfo[i]["TransferTo"]) <= 0) {
                alert("enter the Transfer To");
                return;
            }

            salaryDetail.push({
                SerialNumber: SrNo,
                PaymentByCurrency: gvSalaryInfo[i]["PaymentByCurrency"],
                PaymentAmountBySalaryCurrency: gvSalaryInfo[i]["PaymentAmountBySalaryCurrency"],
                TransferTo: gvSalaryInfo[i]["TransferTo"],
            });
        }
    }

    salaryHeader.L_SalaryBreakup = salaryDetail;
    
    $.ajax({
        async: false,
        url: getBaseURL() + '/EmployeeExpat/InsertIntoSalaryInfo',
        type: 'POST',
        data: {
            obj: salaryHeader
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveEmployeeDetails").html('Save');
            $("#btnSaveEmployeeDetails").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEmployeeDetails").attr("disabled", false);
            $("#btnSaveEmployeeDetails").html('Save');
        }
    });
}

function validateSalaryInfo() {
    if ($("#cboSalaryCurrency").val() === "0" || $("#cboSalaryCurrency").val() === "") {
        toastr.warning("Please Select a Currency");
        $('#cboSalaryCurrency').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtsalary").val()) || $("#txtsalary").val() == "0") {
        toastr.warning("Please Enter the salary");
        $('#txtsalary').focus();
        return false;
    }
    if ($("#chkNHIF").parent().hasClass("is-checked") && (IsStringNullorEmpty($("#txtNHIFPercentage").val()) || $("#txtNHIFPercentage").val() == "0")) {
        toastr.warning("Please Enter the Incentive Percentage");
        return false;
    }
    if ($("#chkNSSF").parent().hasClass("is-checked") && (IsStringNullorEmpty($("#txtNSSFPercentage").val()) || $("#txtNSSFPercentage").val() == "0")) {
        toastr.warning("Please Enter the Incentive Percentage");
        return false;
    }

    var headerAmount = $("#txtsalary").val();
    var totalAmount = 0;
    var gvSalaryInfo = jQuery("#jqgSalaryInfo").jqGrid('getRowData');
    for (var i = 0; i < gvSalaryInfo.length; ++i) {
        totalAmount += parseFloat(gvSalaryInfo[i]["PaymentAmountBySalaryCurrency"]);
    }

    if (headerAmount != totalAmount) {
        toastr.warning("Salary Amount Should be equal to total Grid Value");
        return false;
    }
}

function fnCloseEmployeeDetails() {
    $("#divGrid").show();
    $("#divForm").css("display", "none");
}

//function fnGridSalaryInfo() {

//    $("#jqgSalaryInfo").GridUnload();
//    var dataForGrid = [{
//        'salary': '1000000', "CurrencyName": "INR", "Percentage": "70%","BreakUpAmount": "70000"
//    }, { 'salary': '1000000', "CurrencyName": "KES", "Percentage": "30%","BreakUpAmount": "30000"  }]
//    $("#jqgSalaryInfo").jqGrid({
//        //url: getBaseURL() + '/Employee/GetEmployeeSalaryInfobyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
//        //mtype: 'POST',
//        datatype: 'local',
//        contentType: 'application/json; charset=utf-8',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        colNames: ["Currency", "Currency Amount","Transfer to"],
//        colModel: [
//            { name: "Currency", width:'150', align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
//            { name: "CurrencyAmount", editable: true, width: '120', align: 'left', sortable: true, stype: 'text' },
//            { name: "TransferTo", editable: true, width: '120', align: 'left', sortable: true, formatter: 'select', edittype: 'select', editoptions: { value: "bank:Bank;cash:Cash" } },
//          ],
//        pager: "#jqpSalaryInfo",
//        rowNum: 10000,
//        pgbuttons: null,
//        pgtext:null,
//        loadonce: true,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        scroll: false,
//        width: 'auto',
//        autowidth: true,
//        data: dataForGrid,
//        shrinkToFit: true,
//        forceFit: true,
//        loadComplete: function (data) {
//            //SetGridControlByAction();
//        },
//    }).jqGrid('navGrid', '#jqpSalaryInfo', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' })
//    $("#jqgSalaryInfo").jqGrid('inlineNav', '#jqpSalaryInfo', {
//        edit: true,
//        edittext:"Edit",
//        add: true,
//        addicon:'fa fa-plus',
//        addtext: 'Add',
//        deltext: 'Delete',
//        editicon:'fa fa-pen',
//        del: false,
//        search: false,
//        searchicon:'fa fa-search',
//        save: true,
//        saveicon:'fa fa-save',
//        savetext: 'Save',
//        cancel: true,
//        canceltext: 'Cancel',
//        cancelicon:'fa fa-times'
//    });


//    $(window).on("resize", function () {
//        var $grid = $("#jqgSalaryInfo"),
//            newWidth = $grid.closest(".SalaryInfocontainer").parent().width();
//        $grid.jqGrid("setGridWidth", newWidth, true);
//    });
//    fnAddGridSerialNoHeading();
//}

//function fnAddSalaryInfo() {
//    $("#divForm").css("display", "block");
//    $("#divGrid").hide();
//    fnClearSalaryInfoFields();
//    $('#PopupSalaryInfo').find('.modal-title').text("Add Salary Details");
//    $('#PopupSalaryInfo').modal('show');
//    $("#btnSaveSalaryInfo").attr("disabled", false);
//    $("#btnSaveSalaryInfo").html('Save');
//    $("#btnSaveSalaryInfo").show();
//    $("#btnCancelSalaryInfo").show();
//    $("#chkAccountStatus").prop('disabled', false);
//    $("input,textarea").attr('readonly', false);
//    $("select").next().attr('disabled', false);
    
//}

//function fnEditSalaryInfo(e, actiontype) {
//    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
//    var rowData = $('#jqgSalaryInfo').jqGrid('getRowData', rowid);

//    $("#cboErcode").val(rowData.Ercode).selectpicker('refresh');
//    $('#cboErcode').prop('disabled', true).selectpicker('refresh');
//    $("#txtAmount").val(rowData.Amount);

//    if (rowData.EffectiveFrom !== null) {
//        setDate($('#txtEffectivefrom'), rowData.EffectiveFrom);
//    }
//    else {
//        $('#txtEffectivefrom').val('');
//    }
//    $("#txtEffectivefrom").prop('disabled', true);
//    if (rowData.EffectiveTill !== null) {
//        setDate($('#txtEffectivetill'), rowData.EffectiveTill);
//    }
//    else {
//        $('#txtEffectivetill').val('');
//    }
//    if (rowData.ActiveStatus == 'true') {
//        $("#chkAccountStatus").parent().addClass("is-checked");
//    }
//    else {
//        $("#chkAccountStatus").parent().removeClass("is-checked");
//    }
//    $("#btnSaveSalaryInfo").attr("disabled", false);
//    $('#PopupSalaryInfo').modal('show');
   

//    if (actiontype.trim() == "edit") {
//        $('#PopupSalaryInfo').find('.modal-title').text("Update Salary Details");
//        $("#btnSaveSalaryInfo").show();
//        $("#btnCancelSalaryInfo").show();
//        $("#btnSaveSalaryInfo").html('Update');
//        $("#chkAccountStatus").prop('disabled', false);
//        $("input,textarea").attr('readonly', false);
//        $("select").next().attr('disabled', false);
        
//    }

//    if (actiontype.trim() == "view") {
//        $('#PopupSalaryInfo').find('.modal-title').text("View Salary Details");
//        $("#btnSaveSalaryInfo").attr("disabled", true);
//        $("#btnSaveSalaryInfo").hide();
//        $("#btnCancelSalaryInfo").hide();
//        $("input,textarea").attr('readonly', true);
//        $("select").next().attr('disabled', true);
//        $("#chkAccountStatus").prop('disabled', true);

//    }

//}

//function fnSaveEmpSalaryInfo() {
//    debugger;
//    if (IsValidSalaryInfo() === false) {
//        return;
//    }
//    var objsalinfo = {
//        BusinessKey: $("#txtBusinesskey").val(),
//        EmployeeNumber: $("#txtEmployeenumber").val(),
//        Ercode: $("#cboErcode").val(),
//        EffectiveFrom: $("#txtEffectivefrom").val(),
//        Amount: $("#txtAmount").val(),
//        EffectiveTill: $("#txtEffectivetill").val(),
//        ActiveStatus: $("#chkAccountStatus").parent().hasClass("is-checked")

//    };
//    $("#btnSaveSalaryInfo").attr('disabled', true);
//    $.ajax({
//        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeSalaryInfo',
//        type: 'POST',
//        datatype: 'json',
//        data: {obj: objsalinfo },
//        success: function (response) {
//            if (response.Status) {
//                toastr.success(response.Message);
//                $('#PopupSalaryInfo').modal('hide');
//                fnGridRefreshSalaryInfo();
//                $("#btnSaveSalaryInfo").attr('disabled', false);
//                fnClearSalaryInfoFields();
//                return true;
//            }
//            else {
//                toastr.error(response.Message);
//                $("#btnSaveSalaryInfo").attr('disabled', false);
//                return false;
//            }

//        },
//        error: function (error) {
//            toastr.error(error.statusText);
//            $("#btnSaveSalaryInfo").attr('disabled', false);
//        }
//    });

//}

//function IsValidSalaryInfo() {
//    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
//        toastr.warning("Please Create Employee details Details");
//        return false;
//    }
//    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
//        toastr.warning("Please Create Employee details Details");
//        return false;
//    }
//    if ($("#cboErcode").val() == 0 || $("#cboErcode").val() == "0") {
//        toastr.warning("Please select ER Code");
//        return false;
//    }
    
//    if (IsStringNullorEmpty($("#txtAmount").val())) {
//        toastr.warning("Please Enter Amount");
//        return false;
//    }

//    if (IsStringNullorEmpty($("#txtEffectivefrom").val())) {
//        toastr.warning("Please Select Effective From Date");
//        return false;
//    }
    
//}

function fnGridRefreshSalaryInfo() {
    $("#jqgSalaryInfo").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearSalaryInfoFields() {
    $("#cboCurrency").val('0');
    $("#cboCurrency").selectpicker('refresh');
    $("#txtAmount").val('');
    $("#cboTrasnferTo").val('0');
    $("#cboTrasnferTo").selectpicker('refresh');

    //$("#txtsalary").val('');
    //$("#cboSalaryCurrency").val('0');
    //$("#cboSalaryCurrency").selectpicker('refresh');
    //$("#chkIncentiveApplicable").parent().removeClass("is-checked");
    //$("#chkNHIF").parent().removeClass("is-checked");
    //$("#chkNSSF").parent().removeClass("is-checked");
    //$("#txtNHIFPercentage").val('');
    //$("#txtNSSFPercentage").val('');

    $("#btnSaveSalaryInfo").attr("disabled", false);
    $("#btnSaveSalaryInfo").html("Save");
}

$("#btnCancelSalaryInfo").click(function () {
    $("#jqgSalaryInfo").jqGrid('resetSelection');
    $('#PopupSalaryInfo').modal('hide');
    fnClearSalaryInfoFields();
});
 