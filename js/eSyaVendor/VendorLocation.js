function fnloadvendorLocationGrid() {

    fnClearLocationfields();

    $("#jqgVendorLocation").GridUnload();

    $("#jqgVendorLocation").jqGrid({

        url: getBaseURL() + '/Vendor/GetVendorLocationsByVendorcode?vendorcode=' + $("#txtVendorCode").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "", "", localization.VendorLocation, localization.VendorAddress, localization.ContactPerson, localization.RegisteredMobileNumber, localization.AlternateMobileNumber, localization.EmailID, localization.DefaultLocation, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocationId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Isdcode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocation", width: 120, editable: true, align: 'left', hidden: false },
            { name: "VendorAddress", width: 150, editable: true, align: 'left', hidden: false },
            { name: "ContactPerson", width: 110, editable: true, align: 'left', },
            { name: "RegisteredMobileNumber", width: 120, editable: true, align: 'left' },
            { name: "AlternateMobileNumber", width: 120, editable: true, align: 'left', resizable: true },
            { name: "EMailId", width: 170, editable: true, align: 'left' },
            { name: "IsLocationDefault", width: 100, editable: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 60, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditLocation(event)"><i class="fas fa-pen"></i> ' +localization.Edit+' </button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpVendorLocation",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
    }).jqGrid('navGrid', '#jqpVendorLocation', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpVendorLocation', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshlocationGrid
        });
    fnAddGridSerialNoHeading();
}

function fnSaveLocation() {
   
    if (IsValidLocation() == false) {
        return;
    }
        var vendorloc = {
            VendorCode: $("#txtVendorCode").val(),
            VendorLocationId: $("#txtlocationId").val() === '' ? 0 : $("#txtlocationId").val(),
            IsLocationDefault: $("#chkDefaulultloc").parent().hasClass("is-checked"),
            VendorLocation: $("#txtvendorlocation").val(),
            VendorAddress: $("#txtaddress").val(),
            Isdcode: $("#cboVendorMobile").val(),
            ContactPerson: $("#txtcontactperson").val(),
            RegisteredMobileNumber: $("#txtVendorMobile").val(),
            AlternateMobileNumber: $("#txtalternatemobileno").val(),
            EMailId: $("#txtvendoremailid").val(),
            ActiveStatus: $("#chklocationstatus").parent().hasClass("is-checked")

        };
    $.ajax({
        url: getBaseURL() + '/Vendor/InsertOrUpdateVendorLocation',
        type: 'POST',
        datatype: 'json',
        data: { vendorloc },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnRefreshlocationGrid();
                $("#btnlocationsave").html("Save");
                fnClearLocationfields();
                return true;
            }
            else {
                toastr.error(response.Message);
                return false;
            }
            
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });

}

function fnEditLocation(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorLocation').jqGrid('getRowData', rowid);
    $("#txtlocationId").val(rowData.VendorLocationId);
    $('#cboVendorMobile').val(rowData.Isdcode);
    $('#cboVendorMobile').selectpicker('refresh');
    $("#txtcontactperson").val(rowData.ContactPerson);
    $('#txtVendorMobile').val(rowData.RegisteredMobileNumber);
    $('#txtalternatemobileno').val(rowData.AlternateMobileNumber);
    $('#txtaddress').val(rowData.VendorAddress);
    $('#txtvendorlocation').val(rowData.VendorLocation);
    $('#txtvendoremailid').val(rowData.EMailId);
    if (rowData.ActiveStatus == 'true') {
        $("#chklocationstatus").parent().addClass("is-checked");
    }
    else {
        $("#chklocationstatus").parent().removeClass("is-checked");
    }

    if (rowData.IsLocationDefault == 'true') {
        $("#chkDefaulultloc").parent().addClass("is-checked");
    }
    else {
        $("#chkDefaulultloc").parent().removeClass("is-checked");
    }

    $("#btnlocationsave").html(localization.Update);
}

function IsValidLocation() {
     if (IsStringNullorEmpty($("#txtVendorCode").val())) {
        toastr.warning("Please Create the Vendor Details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtcontactperson").val())) {
        toastr.warning("Please Enter the Contact Person");
        return false;
    }
    if ($("#cboVendorMobile").val() == 0 || $("#cboVendorMobile").val() == "0") {
        toastr.warning("Please select a ISD Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtVendorMobile").val())) {
        toastr.warning("Please Enter the Register Mobile Number");
        return false;
    }
    if (IsStringNullorEmpty($("#txtvendoremailid").val())) {
        toastr.warning("Please Enter Email Id");
        return false;
    }
    var validemail = IsValidateEmail($("#txtvendoremailid").val());
    if (validemail == false) {
        toastr.warning("Please Enter a valid Email ID");
        return false;
    } 
    if (IsStringNullorEmpty($("#txtaddress").val())) {
        toastr.warning("Please Enter the Address");
        return false;
    }
    if (IsStringNullorEmpty($("#txtvendorlocation").val())) {
        toastr.warning("Please Enter the Vendor Location");
        return false;
    }
   
}

function fnRefreshlocationGrid() {
    $("#jqgVendorLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearLocationfields () {
    $("#chkDefaulultloc").parent().removeClass("is-checked");
    $("#cboVendorMobile").val("0");
    $('#cboVendorMobile').selectpicker('refresh');
    $("#txtlocationId").val('');
    $("#txtaddress").val('');
    $("#txtvendorlocation").val('');
    $("#txtcontactperson").val(''),
    $("#txtVendorMobile").val('');
    $("#txtalternatemobileno").val('');
    $("#txtvendoremailid").val('');
    $("#chklocationstatus").parent().addClass("is-checked");
    $("#btnlocationsave").html(localization.Save);
}




