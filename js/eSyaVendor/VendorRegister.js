﻿var businesslocation = false;
$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var alphabet = $(this).text();
        fnloadVendorGrid(alphabet);
        $(this).addClass('active');
    });
    $("#lblFormName").text("Vendor Codes");
    $("#accordion").hide();
   
    $("#jqgVendorRegister").jqGrid({

      
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.VendorName, "", localization.CreditType, localization.CreditPeriodindays, localization.VendorStatus, localization.IsBlackListed, localization.ScoreCard, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PreferredPaymentMode", width: 10, editable: true, align: 'left', hidden: true },
            { name: "CreditType", width: 50, editable: true, align: 'center' },
            { name: "CreditPeriod", width: 100, editable: true, align: 'left', resizable: true },
            { name: "ApprovalStatus", width: 70, editable: true, align: 'left' },
            { name: "IsBlackListed", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "SupplierScore", editable: true, width: 90, align: 'left', },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return "<a href='javascript:fnDelete_TaxStructure()' class='ui-icon ui-icon-closethick'></a>";
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpVendorRegister",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        
    }).jqGrid('navGrid', '#jqpVendorRegister', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpVendorRegister', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshVendorGrid
    }).jqGrid('navButtonAdd', '#jqpVendorRegister', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVendor 
        });
    fnAddGridSerialNoHeading();
});

function fnloadVendorGrid(alphabet) {

    $("#jqgVendorRegister").GridUnload();

    $("#jqgVendorRegister").jqGrid({
      
        url: getBaseURL() + '/Vendor/GetVendors?Alphabet=' + alphabet,
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.VendorName, "", localization.CreditType, localization.CreditPeriodindays, localization.VendorStatus, localization.IsBlackListed, localization.ScoreCard, localization.Active,localization.Actions],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true }, 
            { name: "VendorName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PreferredPaymentMode", width: 10, editable: true, align: 'left', hidden: true },
            { name: "CreditType", width: 40, editable: true, align: 'center' },
            { name: "CreditPeriod", width: 40, editable: true,  align: 'center', resizable: true },
            { name: "ApprovalStatus", editable: true, width: 45, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Approved;false: UnApproved" } },
            { name: "IsBlackListed", editable: true, width: 45, align: 'center', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Yes;false: NO" } },
            { name: "SupplierScore", editable: true, width: 40, align: 'left',  },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid"  title="Edit" id="jqgEdit" onclick="return fnEditVendor(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditVendor(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDelete" onclick="return fnDeActivateVendor(event)"><i class="fas fa-trash"></i>' + localization.DeActivate + '</button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpVendorRegister",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
        
    }).jqGrid('navGrid', '#jqpVendorRegister', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpVendorRegister', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshVendorGrid
    }).jqGrid('navButtonAdd', '#jqpVendorRegister', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVendor
        });
    fnAddGridSerialNoHeading();
}
$('#v-pills-tab a').on('click', function (e) {
    var activeTabName = "";
    e.preventDefault()
    $(".tab-pane").removeClass('show active');
    activeTabName = $(this).attr("href");
    $(activeTabName).addClass("show");
    //if (activeTabName == "#statutorydetails") {
    //    fnGridLoadCustomerLocation();
    //}
})

function fnAddVendor() {
    fnEnableVendorRegister(false);
    $('#txtVendorCode').val('');
    $("#vendordetails-tab").addClass("active");
    $("#vendordetails").addClass("show active");
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    $("#chkActiveStatus").parent().addClass("is-checked");
    businesslocation = false;
    $("#btnSaveVendorDetails").html(localization.Save);
}

function fnEditVendor(e,actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorRegister').jqGrid('getRowData', rowid);
    $("#txtVendorCode").val(rowData.VendorCode);
    $("#txtVendorName").val(rowData.VendorName);
    $('#cboCreditType').val(rowData.CreditType);
    $('#cboCreditType').selectpicker('refresh');
    $("#txtCreditPeriod").val(rowData.CreditPeriod);
    $('#cboPayMode').val(rowData.PreferredPaymentMode);
    $('#cboPayMode').selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    if (rowData.IsBlackListed == 'true') {
        $("#chkIsBlockList").parent().addClass("is-checked");
    }
    else {
        $("#chkIsBlockList").parent().removeClass("is-checked");
    }
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    $("#vendorDetails-tab").addClass("active");
    $("#vendorDetails").addClass("show active");
    if ($("#txtVendorCode").val() > 0) {
        $("#divForm").css("display", "block");
        $("#divGrid").hide();

        $("#vendorDetails-tab").addClass("active");
        $("#vendorDetails").addClass("show active");
    }

    eSyaParams.ClearValue();

    $.ajax({
        async: false,
        url: getBaseURL() + '/Vendor/GetVendorSuuplyGroupParameterList?vendorcode=' + $("#txtVendorCode").val() ,
        type: 'POST',
        datatype: 'json',
        success: function (result) {

            if (result != null) {
                eSyaParams.SetJSONValue(result);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });


    if (actiontype.trim() == "edit") {
        $("#btnSaveUnitofMeasure").show();
        fnEnableVendorRegister(false);
        $("#btnSaveVendorDetails").html(localization.Update);
        $("#btnSaveSMSInformation").html('Update');
        $("#btnSaveBankDetails,#btnPartNumberDisabled,#btnsavestatutory,#btnSaveBusinessLink,#btnSaveVendorDetails,#btnlocationsave").show();
        businesslocation = false;
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveUnitofMeasure").hide();
        fnEnableVendorRegister(true);
        $("#btnSaveBankDetails,#btnPartNumberDisabled,#btnsavestatutory,#btnSaveBusinessLink,#btnSaveVendorDetails,#btnlocationsave").hide();
        businesslocation = true;
    }
    $("#PopupUnitofMeasure").on('hidden.bs.modal', function () {
        $("#btnSaveUnitofMeasure").show();
        fnEnableVendorRegister(false);
    });
}

function fnSaveVendor() {
    if (IsValidVendor() == false) {
        return;
    }
    var vendor = {
        VendorCode: $("#txtVendorCode").val() === '' ? 0 : $("#txtVendorCode").val(),
        VendorName: $("#txtVendorName").val(),
        CreditType: $("#cboCreditType").val(),
        CreditPeriod: $("#txtCreditPeriod").val(),
        PreferredPaymentMode: $("#cboPayMode").val(),
        IsBlackListed: $('#chkIsBlockList').parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    var fmParams = eSyaParams.GetJSONValue();
    vendor.l_FormParameter = fmParams;
    $.ajax({

        url: getBaseURL() + '/Vendor/InsertOrUpdateVendor',
        type: 'POST',
        datatype: 'json',
        data: { vendor },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnRefreshVendorGrid();
                ReadVendorCode(response);
                return true;
            }
            else{
                toastr.error(response.Message);
                return false;
            }
           
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}

function IsValidVendor() {
    
    if (IsStringNullorEmpty($("#txtVendorName").val())) {
        toastr.warning("Please Enter the Vendor Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCreditPeriod").val())) {
        toastr.warning("Please Enter the Credit Period days");
        return false;
    }
   
    if ($("#txtCreditPeriod").val() == 0 || $("#txtCreditPeriod").val() == "0") {
        toastr.warning("Credit Period should not be Zero");
        return false;
    }
    

}

function ReadVendorCode(res) {
    $("#txtVendorCode").val('');
    $("#txtVendorCode").val(res.Vendorcode);
    if ($("#txtVendorCode").val() > 0) {
        $("#accordion").show();
    }
}

function fnRefreshVendorGrid() {
    $("#jqgVendorRegister").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#vendorDetails-tab").addClass("active");
    $("#vendorDetails").addClass("show active");
}

function fnClearVendorReg() {
    $("#txtVendorCode").val('');
    $("#txtVendorName").val('');
    $('#cboCreditType').val("P");
    $('#cboCreditType').selectpicker('refresh');
    $("#txtCreditPeriod").val('');
    $('#cboPayMode').val("C");
    $('#cboPayMode').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $('#chkIsBlockList').prop('checked', true);
    $('#chkIsBlockList').parent().removeClass('is-checked');
    $('#chkIsBlockList').prop('checked', false);
    $("#VendorLocations").removeClass('show');
    $("#txtVendorCode").val('');
    fnRefreshVendorGrid();
    $("#btnSaveBankDetails,#btnPartNumberDisabled,#btnsavestatutory,#btnSaveBusinessLink,#btnSaveVendorDetails,#btnlocationsave").show();
    //location.reload();
    businesslocation = false;
    eSyaParams.ClearValue();
}


function fnCloseVendorDetails() {
    $("#divGrid").show();
    $("#divForm").css("display", "none");
    $(".tab-pane").removeClass('show active');
    $("#v-pills-tab a").removeClass("active");
    $("#vendorDetails-tab").addClass("active");
    $("#vendorDetails").addClass("show active");
    $('#txtVendorCode').val("0");
    fnClearVendorReg();
    fnClearStatutoryDetails();
}


//function SetGridControlByAction() {
//    $('#jqgAdd').removeClass('ui-state-disabled');
//    var eleEnable = document.querySelectorAll('#jqgEdit');

//    for (var i = 0; i < eleEnable.length; i++) {
//        eleEnable[i].disabled = false;
//    }
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }
//}

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

function fnEnableVendorRegister(val) {
    $("input,textarea").attr('readonly', val);
    $("#chklocationstatus").prop('disabled', val); 
    $("input[id*='chk']").attr('disabled', val);
    $("select").next().attr('disabled', val);
    $("#chkActiveStatus").attr('disabled', true);
}

function fnDeActivateVendor(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorRegister').jqGrid('getRowData', rowid);
    var vcode = rowData.VendorCode;
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to De Activate Vendor?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want Activate Vendor?";
        lbl = localization.Activate;
    }
    bootbox.confirm({
        title: 'Vendor',
        message: msg,
        buttons: {
            confirm: {
                label: lbl,
                className: 'mdl-button  primary-button'
            },
            cancel: {
                label: 'Cancel',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result) {
                if (vcode == null || vcode == undefined || vcode == "0" || vcode == ''){
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/Vendor/ActiveOrDeActiveVendor?status=' + a_status + '&vendorcode=' + vcode,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            toastr.success(response.Message);
                            fnRefreshVendorGrid();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        $("#jqgVendorRegister").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}