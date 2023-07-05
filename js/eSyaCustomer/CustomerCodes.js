var customerNamePrefix = "";
var isUpdate = 0;
var isView = 0;

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        customerNamePrefix = $(this).text();
        fnGridLoadCustomerCodes(customerNamePrefix);
        $(this).addClass('active');
    });
    fnGridLoadCustomerCodes(customerNamePrefix);
    //fnGridLoadCustomerContactDetail();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnCustomerCodes",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCustomerCodes(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCustomerCodes(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateCustomerCodes(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadCustomerCodes(customerNamePrefix) {
    $("#jqgCustomerCodes").jqGrid('GridUnload');
    $("#jqgCustomerCodes").jqGrid({
        url: getBaseURL() + '/Customer/GetCustomerCodeInformationByNamePrefix?customerNamePrefix=' + customerNamePrefix,
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CustomerName, localization.CustomerID, localization.CreditPeriodInDays, localization.CreditLimit, localization.ValidateLimit, localization.OnHold, localization.Active, localization.Actions],
        colModel: [
            { name: "CustomerName", width: 150, editable: true, align: 'left', hidden: false },
            { name: "CustomerId", width: 30, editable: true, align: 'left', hidden: false },
            { name: "CreditPeriod", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "CreditLimit", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ValidateLimit", width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "CustomerOnHold", width: 35, editable: true, align: 'left', hidden: false, edittype: "select", formatter: 'select', editoptions: { value: "A: All;I: IP;N: Not Applicable;O: OP" }},
            { name: "ActiveStatus", width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 85, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditCustomerCodes(event,\'edit\')"><i class="fas fa-pen"></i>' + localization.Edit +'</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditCustomerCodes(event,\'view\')"><i class="far fa-eye"></i>' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDelete", onclick="return fnDeActivateCustomerCodes(event)"><i class="fas fa-trash"></i>' + localization.DeActivate + '</button>'

            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCustomerCodes"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCustomerCodes",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption:'Customer Codes',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgCustomerCodes");
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
    }).jqGrid('navGrid', '#jqpCustomerCodes', { add: false, edit: false, search: true, del: false, refresh: false }, {}, {}, {}, { multipleSearch: true }).jqGrid('navButtonAdd', '#jqpCustomerCodes', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCustomerCodes
    }).jqGrid('navButtonAdd', '#jqpCustomerCodes', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddCustomerCodes
        });
    fnAddGridSerialNoHeading();
}

//function SetGridControlByAction() {
//    //$('#jqgAdd').removeClass('ui-state-disabled');
//    //var eleEnable = document.querySelectorAll('#jqgEdit');

//    //for (var i = 0; i < eleEnable.length; i++) {
//    //    eleEnable[i].disabled = false;
//    //}
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
//    if (_userFormRole.IsView === false) {
//        var eleVDisable = document.querySelectorAll('#jqgView');
//        for (var i = 0; i < eleVDisable.length; i++) {
//            eleVDisable[i].disabled = true;
//            eleVDisable[i].className = "ui-state-disabled";
//        }
//    }
//}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
$('#v-pills-tab a').on('click', function (e) {
    var activeTabName = "";
    e.preventDefault();
     $(".tab-pane").removeClass('show active');
    activeTabName = $(this).attr("href");
    $(activeTabName).addClass("show");
    //if (activeTabName == "#statutorydetails") {
    //    fnGridLoadCustomerLocation();
    //}
})

function fnGridAddCustomerCodes() {
    $("#PopupCustomerCodes").modal('show');
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    $(".customerName").hide();
    $('#chkActiveStatus').parent().addClass("is-checked");
    $('#chkCDActiveStatus').parent().addClass("is-checked");
    fnGridLoadCustomerLocation();
    fnGridLoadBusinessLocation();
    fnGridLoadCustomerContactDetail();
    fnGridLoadCustomerStatutoryDetails(0, 0);
    fnSetCustomerCodesControlbyAction(false);
    fnSetCustomerContactControlbyAction(false);
    fnSetCustomerBusinessLinkControlbyAction(false);
    fnSetCustomerStatutoryControlbyAction(false);
    isUpdate = 0;
    isView = 0;
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveCustomerDetails").html(localization.Save);
    $("#btnSaveCustomerContact").html(localization.Save);
    
}

function fnGridLoadCustomerContactDetail() {
    $("#jqgCustomerContactDetails").jqGrid('GridUnload');
    $("#jqgCustomerContactDetails").jqGrid({
        url: getBaseURL() + '/Customer/GetCustomerContactInformationByCustomerId?customerId=' + $("#txtCustomerCode").val(),
        datatype: 'json',
        mtype: 'GET',
        //postData: {
        //    customerId: function () { return $('#txtCustomerCode').val(); }
        //},
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Address, localization.ContactPerson, localization.LocationID, localization.CustomerLocation, localization.ISDCode, localization.ISDDescription, localization.RegisteredMobileNumber, localization.IsLocationDefault,localization.Active],
        colModel: [
            { name: "Address", width: 200, editable: true, align: 'left', hidden: false },
            { name: "ContactPerson", width: 150, editable: true, align: 'left', hidden: false },
            { name: "CustomerLocationId", width: 35, editable: true, align: 'left', hidden: true },
            { name: "CustomerLocation", width: 100, editable: true, align: 'left', hidden: false },
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "IsdDescription", width: 120, editable: true, align: 'left', hidden: false },
            { name: "RegisteredMobileNumber", width: 150, editable: true, align: 'left', hidden: false },
            { name: "IsLocationDefault", editable: true, width: 120, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: true, width: 65, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rownumWidth: 55,
        rowList: [10, 20, 40],
        loadonce: true,
        pager: "#jqpCustomerContactDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        //align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0, caption:'Customer Contact Details',
        onSelectRow: function (rowid) {
            var locationId = $("#jqgCustomerContactDetails").jqGrid('getCell', rowid, 'CustomerLocationId');
            fnFillCustomerContactDetails(locationId); fnJqgridSmallScreen("jqgCustomerContactDetails");
        },

    }).jqGrid('navGrid', '#jqpCustomerContactDetails', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}

function fnFillCustomerContactDetails(locationId) {
    if (!IsStringNullorEmpty($("#txtCustomerCode").val())
        && !IsStringNullorEmpty(locationId)) {
        $.ajax({
            url: getBaseURL() + '/Customer/GetCustomerContactInformationByCustomerIdLocId?customerId=' + $("#txtCustomerCode").val() + "&locationId=" + locationId,
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response != null) {
                    var a = response.CustomerLocation;
                    $('#txtCustomerLocation').val(response.CustomerLocationId);
                    $('#txtCustomerLocationDescription').val(response.CustomerLocation);
                    if (response.IsLocationDefault) {
                        $("#chkIsLocationDefault").parent().addClass("is-checked");
                    }
                    else { $("#chkIsLocationDefault").parent().removeClass("is-checked"); }
                    $('#cboCustomerMobile').val(response.Isdcode);
                    $('#cboCustomerMobile').selectpicker('refresh');
                    $('#txtContactPerson').val(response.ContactPerson);
                    $('#txtAddress').val(response.Address);
                    $('#txtCustomerMobile').val(response.RegisteredMobileNumber);
                    $('#txtEmailId').val(response.EMailId);
                    $("#btnSaveCustomerContact").html(localization.Update);
                    if (response.ActiveStatus) {
                        $("#chkCDActiveStatus").parent().addClass("is-checked");
                    }
                    else { $("#chkCDActiveStatus").parent().removeClass("is-checked"); }
                }
                else {
                    fnClearCustomerContactFields();
                }
            },
            error: function (error) {
                toastr.error(error.statusText);
            }
        });
    }
}

function fnSaveCustomerDetails() {
    if (IsStringNullorEmpty($("#txtCustomerName").val().trim())) {
        toastr.warning("Please Enter the Customer Name");
        return false;
    }
    if ($("#chkValidateLimit").parent().hasClass("is-checked")) {
        if (IsStringNullorEmpty($("#txtCreditLimit").val())) {
            toastr.warning("Please Enter the Credit Limit");
            $('#txtCreditLimit').focus();
            return false;
        }
        if (parseFloat($('#txtCreditLimit').val()) <=0) {
            toastr.warning("Credit Limit should be more than 0");
            $('#txtCreditLimit').focus();
            return;
        }
    }
    //$("#btnSaveCustomerDetails").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveCustomerDetails").attr('disabled', true);
    var cs_cc = {
        CustomerId: isUpdate ==0 ? 0 : $("#txtCustomerCode").val(),
        CustomerName: $("#txtCustomerName").val(),
        CreditPeriod: IsStringNullorEmpty($("#txtCreditPeriod").val()) ? 0 : $("#txtCreditPeriod").val(),
        CreditLimit: IsStringNullorEmpty($("#txtCreditLimit").val()) ? 0 : $("#txtCreditLimit").val(),
        ValidateLimit: $("#chkValidateLimit").parent().hasClass("is-checked"),
        CustomerOnHold: "N",
        IsLimitBreakupReqd:0,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Customer/InsertIntoCustomerCode';
    if (isUpdate == 1)
        URL = getBaseURL() + '/Customer/UpdateCustomerCode';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { cs_cc },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                if (isUpdate == 0) {
                    //document.getElementById("hdCustomerName").innerHTML = $("#txtCustomerName").val();
                    $("#hdCustomerName").text($("#txtCustomerName").val());
                    $('#txtCustomerCode').val(response.Key);
                    $(".customerName").show();
                    fnGridLoadCustomerLocation();
                    fnGridLoadBusinessLocation();
                    fnGridLoadCustomerContactDetail();
                }
                $("#btnSaveCustomerDetails").html(localization.Save);
                $("#btnSaveCustomerDetails").attr('disabled', false);
                //$('#v-pills-tab a.active').removeClass('active').next().addClass('active');
                //$('.tab-pane.show.active').removeClass('show active').next().addClass('show active');

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCustomerDetails").html(localization.Save);
                $("#btnSaveCustomerDetails").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCustomerDetails").html(localization.Save);
            $("#btnSaveCustomerDetails").attr("disabled", false);
        }
    });
}

function fnEditCustomerCodes(e, actiontype) {
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgCustomerCodes').jqGrid('getRowData', rowid);
    var rowid = $("#jqgCustomerCodes").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCustomerCodes').jqGrid('getRowData', rowid);
    
    isUpdate = 1;
    if (rowData.CustomerId > 0) {
        //document.getElementById("hdCustomerName").innerHTML = rowData.CustomerName;
        $("#hdCustomerName").text(rowData.CustomerName);
        $('#txtCustomerCode').val(rowData.CustomerId);
        $('#txtCustomerName').val(rowData.CustomerName);
        $('#txtCreditPeriod').val(rowData.CreditPeriod);
        $('#txtCreditLimit').val(rowData.CreditLimit);
        if (rowData.ValidateLimit === "true") {
            $("#chkValidateLimit").parent().addClass("is-checked");
        }
        else { $("#chkValidateLimit").parent().removeClass("is-checked"); }
        if (rowData.ActiveStatus === "true") {
            $("#chkActiveStatus").parent().addClass("is-checked");
        }
        else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

        $("#btnSaveCustomerDetails").attr('disabled', false);
        $("#btnSaveCustomerContact").attr('disabled', false);
        fnGridLoadCustomerLocation();
        fnGridLoadBusinessLocation();
        fnGridLoadCustomerContactDetail();
        fnGridLoadCustomerStatutoryDetails(0, 0);
        if (actiontype.trim() === "edit") {
            if (_userFormRole.IsEdit === false) {
                toastr.warning("You are not authorized to Edit");
                return;
            }
            $("#divForm").css("display", "block");
            $("#divGrid").hide();
            $(".customerName").show();
            isView = 0;
            fnSetCustomerCodesControlbyAction(false);
            fnSetCustomerContactControlbyAction(false);
            fnSetCustomerBusinessLinkControlbyAction(false);
            fnSetCustomerStatutoryControlbyAction(false);
            $("#chkActiveStatus").attr('disabled', true);
            $("#btnSaveCustomerDetails").html(localization.Update);
            $("#btnSaveCustomerContact").html(localization.Save);
        }
        if (actiontype.trim() === "view") {
            if (_userFormRole.isView === false) {
                toastr.warning("You are not authorized to View");
                return;
            }
            $("#divForm").css("display", "block");
            $("#divGrid").hide();
            $(".customerName").show();
            isView = 1;
            fnSetCustomerCodesControlbyAction(true);
            fnSetCustomerContactControlbyAction(true);
            fnSetCustomerBusinessLinkControlbyAction(true);
            fnSetCustomerStatutoryControlbyAction(true);
            //$("#divCustomerBusinessLink :input").prop('disabled', true);
           // $("#divCustomerBusinessLink").children().prop('disabled', true);
            //$("#divCustomerBusinessLink").addClass("disabled");
        }
    }
}

function fnGridRefreshCustomerCodes() {
    $("#jqgCustomerCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearCustomerCodesFields() {
    $("#txtCustomerName").val("");
    $("#txtCreditPeriod").val("");
    $("#txtCreditLimit").val("");
    $('#chkValidateLimit').parent().removeClass('is-checked');
    $('#chkActiveStatus').parent().addClass("is-checked");
}

function fnSaveCustomerContact() {
    if (IsStringNullorEmpty($("#txtCustomerName").val())) {
        toastr.warning("Please Enter the Customer Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCustomerCode").val()) || $("#txtCustomerCode").val() == 0) {
        toastr.warning("Please Enter the Customer Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCustomerLocationDescription").val())) {
        toastr.warning("Please Enter the Customer Location");
        return false;
    }
    if ($("#cboCustomerMobile").val() === '0') {
        toastr.warning("Please Select a ISD Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtContactPerson").val().trim())) {
        toastr.warning("Please Enter the Contact Person");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAddress").val().trim())) {
        toastr.warning("Please Enter the Address");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCustomerMobile").val())) {
        toastr.warning("Please Enter the Registered Mobile Number");
        return false;
    }
    if (IsStringNullorEmpty($("#txtEmailId").val())) {
        toastr.warning("Please Enter the Email Id");
        return false;
    }
    if (!IsValidateEmail($("#txtEmailId").val())) {
        toastr.warning("Please Enter the Valid Email Id");
        return false;
    }

    if ($("#chkIsLocationDefault").parent().hasClass("is-checked") && !$("#chkCDActiveStatus").parent().hasClass("is-checked")) {
        toastr.warning("Default Location cannot be made Inactive");
        return false;
    }

    //$("#btnSaveCustomerContact").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveCustomerContact").attr('disabled', true);
    var cs_cc = {
        CustomerId: $("#txtCustomerCode").val(),
        CustomerLocationId: $("#txtCustomerLocation").val(),
        CustomerLocation: $("#txtCustomerLocationDescription").val(),
        IsLocationDefault: $("#chkIsLocationDefault").parent().hasClass("is-checked"),
        Isdcode: $("#cboCustomerMobile").val(),
        ContactPerson: $("#txtContactPerson").val(),
        Address: $("#txtAddress").val(),
        RegisteredMobileNumber: $("#txtCustomerMobile").val(),
        EMailId: $("#txtEmailId").val(),
        ActiveStatus: $("#chkCDActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Customer/InsertIntoCustomerContact';
    if (!IsStringNullorEmpty($("#txtCustomerLocation").val()))
        URL = getBaseURL() + '/Customer/UpdateCustomerContact';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { cs_cc },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearCustomerContactFields();
                fnGridRefreshCustomerContact();
                fnGridLoadCustomerLocation();
                $("#btnSaveCustomerContact").html(localization.Save);
                
                $("#btnSaveCustomerContact").attr('disabled', false);
                //$('#v-pills-tab a.active').removeClass('active').next().addClass('active');
                //$('.tab-pane.show.active').removeClass('show active').next().addClass('show active');

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCustomerContact").html(localization.Save);
                $("#btnSaveCustomerContact").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCustomerContact").html(localization.Save);
            $("#btnSaveCustomerContact").attr("disabled", false);
        }
    });
}

function fnClearCustomerContactFields() {
   
    $("#txtCustomerLocation").val("");
    $("#txtCustomerLocationDescription").val("");
    $('#chkIsLocationDefault').parent().removeClass('is-checked');
    $('#cboCustomerMobile').val("0");
    $('#cboCustomerMobile').selectpicker('refresh');
    $("#txtContactPerson").val("");
    $("#txtAddress").val("");
    $("#txtCustomerMobile").val("");
    $("#txtEmailId").val("");
    $('#chkCDActiveStatus').parent().addClass("is-checked");
    $("#btnSaveCustomerContact").html(localization.Save);
}

function fnCloseCustomerDetails() {
    $("#divGrid").show();
    $("#divForm").css("display", "none");
    $(".tab-pane").removeClass('show active');
    $("#v-pills-tab a").removeClass("active");
    $("#customerdetails-tab").addClass("active");
    $("#customerdetails").addClass("show active");
    document.getElementById("hdCustomerName").innerHTML = "New Customer";
    $('#txtCustomerCode').val("0");
    fnClearCustomerCodesFields();
    fnClearCustomerContactFields();
    fnGridRefreshCustomerCodes();
}

function fnGridRefreshCustomerContact() {
    $("#jqgCustomerContactDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnSetCustomerCodesControlbyAction(val) {
    $("#txtCustomerName").attr('readonly', val);
    $("#txtCreditPeriod").attr('readonly', val);
    $("#txtCreditLimit").attr('readonly', val);
    $("#chkValidateLimit").attr('disabled', val);
    $("#chkActiveStatus").attr('disabled', val);
    if (val)
        $("#btnSaveCustomerDetails").hide();
    else
        $("#btnSaveCustomerDetails").show();
}

function fnSetCustomerContactControlbyAction(val) {
    $("#txtCustomerLocationDescription").attr('readonly', val);
    $("#chkIsLocationDefault").attr('disabled', val);
    $("#txtContactPerson").attr('readonly', val);
    $("#txtAddress").attr('readonly', val);
    $("#cboCustomerMobile").attr('disabled', val);
    $("#txtCustomerMobile").attr('readonly', val);
    $("#txtEmailId").attr('readonly', val);
    $("#chkCDActiveStatus").attr('disabled', val);
    if (val)
        $("#btnSaveCustomerContact").hide();
    else
        $("#btnSaveCustomerContact").show();
}

function fnSetCustomerBusinessLinkControlbyAction(val) {
    if (val) {
        $("#btnSaveCustomerBusinessLocation").hide();
    }
    else
        $("#btnSaveCustomerBusinessLocation").show();
}

function fnSetCustomerStatutoryControlbyAction(val) {
    if (val)
        $("#btnSaveStatutoryDetail").hide();
    else
        $("#btnSaveStatutoryDetail").show();
}


function fnDeActivateCustomerCodes(e) {
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgCustomerCodes').jqGrid('getRowData', rowid);
    var rowid = $("#jqgCustomerCodes").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCustomerCodes').jqGrid('getRowData', rowid);
    
    if (_userFormRole.IsDelete === false) {
        toastr.warning("You are not authorized to Delete");
        return;
    }
    var custId = rowData.CustomerId;
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to De Activate Customer?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want Activate Customer?";
        lbl = localization.Activate;
    }
    bootbox.confirm({
        title: 'Customer',
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
                if (custId == null || custId == undefined || custId == "0" || custId == '') {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/Customer/ActiveOrDeActiveCustomer?status=' + a_status + '&customerId=' + custId,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            toastr.success(response.Message);
                            fnGridRefreshCustomerCodes();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        $("#jqgCustomerCodes").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}