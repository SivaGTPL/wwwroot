
$(document).ready(function () {
    //fnGridLoadAssetRegister();
    $("#divAssetRegister").hide();
    $('#chkActiveStatus').parent().addClass("is-checked");
});

function fnFillAssetSubGroup() {
    
    if ($('#cboAssetGroup').val() != '' && $('#cboAssetGroup').val() != null) {
        
        $.getJSON(getBaseURL() + '/AssetRegister/GetAssetSubGroup?assetGroup=' + $('#cboAssetGroup').val(), function (result) {
            var options = $("#cboAssetSubGroup");
            $("#cboAssetSubGroup").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.AssetSubGroupID).text(this.AssetSubGroup));
            });
            $('#cboAssetSubGroup').selectpicker('refresh');
        });

    }
}

function fnGridLoadAssetRegister() {
     
    $("#jqgAssetRegister").jqGrid('GridUnload');
    $("#jqgAssetRegister").jqGrid({
        url: getBaseURL() + '/AssetRegister/GetAssetRegisterDetail?internalAssetnumber=' + $('#hdvInternalAssetNumber').val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Internal Asset Number", "Serial Number", "Asset Description", "Asset Tag Number", "Installation Date", "Unit Acquisition Value", "Unit Original Cost", "Asset Condition", "Equipment Serial No", "Asset Status", "Actions"],
        colModel: [
            { name: "InternalAssetNumber", width: 40, editable: true, align: 'left', hidden: true },
            { name: "IASerialNumber", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "AssetDescription", editable: true, width: 150, align: 'left', resizable: false },
            { name: "AssetTag", editable: true, width: 80, align: 'left', resizable: false, hidden: true },
            { name: "InstallationDate", editable: true, width: 60, align: 'left', resizable: false, hidden: true },
            
            { name: "UnitAcquisitionValue", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "UnitOriginalCost", editable: true, width: 45, align: 'center', resizable: false },
            { name: "AssetCondition", editable: true, width: 45, align: 'left', resizable: false },
            { name: "EquipmentSerialNumber", editable: true, width: 80, align: 'left', resizable: false },
            { name: "AssetStatus", editable: true, width: 45, align: 'left', resizable: false },
            {
                name: 'Actions', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Update" onclick="return fnGridUpdateAssetRegister(event)"><i class="fa fa-plus"></i> Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewAssetRegister(event)"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        rowNum: 5,
        //rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpAssetRegister",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: 'Asset Register',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgAssetRegister");
        },
    }).jqGrid('navGrid', '#jqpAssetRegister', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAssetRegister', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAssetRegister
        }); 
    fnAddGridSerialNoHeading();
}



function fnClearFields() {
    $('#cboAssetGroup').val("");
    $('#cboAssetGroup').selectpicker('refresh');
    $('#cboAssetSubGroup').val("");
    $('#cboAssetSubGroup').selectpicker('refresh');
    $("#txtAssetDescription").val("");
    $('#cboModel').val("0");
    $('#cboModel').selectpicker('refresh');
    $('#cboManufacturer').val("0");
    $('#cboManufacturer').selectpicker('refresh');
    $('#txtAssetLife').val("");
    $('#txtAssetSpecification').val("");
    $('#txtQuantity').val("");
    $('#txtPONumber').val("");
    $('#txtGRNNumber').val("");
    $('#txtVendorName').val("");
    $('#txtAcquisitionValue').val("");
    $('#txtOriginalCost').val("");

    $('#chkIsInsuranceApplicable').parent().removeClass("is-checked");
    $('#chkIsCalibrationApplicable').parent().removeClass("is-checked");
    $('#chkIsPreventiveApplicable').parent().removeClass("is-checked");
    $('#chkActiveStatus').parent().addClass("is-checked");
    
    //$("#btnSaveAssetRegister").attr('disabled', false);
}



function fnSaveAssetRegister() {

//    $("#PopupAssetRegister").modal('show');
//    $("#divAssetRegister").show();
//return;
    if ($('#txtAssetSpecification').val() == '')
        $('#txtAssetSpecification').val($('#txtAssetDescription').val());

    if ($('#cboAssetGroup').val() == '') {
        toastr.warning("Please select a asset Group");
        $('select[name="cboAssetGroup"]').focus();
        return;
    }
    if ($('#cboAssetSubGroup').val() == '') {
        toastr.warning("Please select a asset Sub Group");
        $('#cboAssetSubGroup').focus();
        return;
    }
    if ($('#txtAssetDescription').val() == '') {
        toastr.warning("Please Enter the Asset Description");
        $('#txtAssetDescription').focus();
        return;
    }
    if ($('#cboAssetType').val() == '') {
        toastr.warning("Please Select a Asset Type");
        return;
    }
    if ($('#cboAssetClass').val() == '') {
        toastr.warning("Please Select a Asset Class");
        return;
    }
    if ($('#txtAssetLife').val() == '') {
        toastr.warning("Please Enter the Asset Life");
        $('#txtAssetLife').focus();
        return;
    }
    if ($('#txtQuantity').val() == '') {
        toastr.warning("Please Enter the Quantity");
        $('#txtQuantity').focus();
        return;
    }
    if ($('#txtQuantity').val() == '0')
    {
        toastr.warning("Quantity should be more than 0");
        $('#txtQuantity').focus();
        return;
    }
    if ($('#txtAcquisitionValue').val() == '') {
        toastr.warning("Please Enter the Acquisition Value");
        $('#txtAcquisitionValue').focus();
        return;
    }
    if ($('#txtOriginalCost').val() == '') {
        toastr.warning("Please Enter the Original Value");
        $('#txtOriginalCost').focus();
        return;
    }

    $("#btnSaveAssetRegister").attr('disabled', true);
    var obj = {
        AssetGroupID: $('#cboAssetGroup').val(),
        AssetSubGroupID: $('#cboAssetSubGroup').val(),
        AssetDescription: $('#txtAssetDescription').val(),
        Model: $('#cboModel').val(),
        Manufacturer: $('#cboManufacturer').val(),
        AssetType: $('#cboAssetType').val(),
        AssetClass: $('#cboAssetClass').val(),
        AssetLife: $('#txtAssetLife').val(),
        AssetSpecification: $('#txtAssetSpecification').val(),
        Quantity: $('#txtQuantity').val(),
        PONumber: $('#txtPONumber').val(),
        PODate: getDate($('#dtPODate')),
        GRNNumber: $('#txtGRNNumber').val(),
        GRNDate: getDate($('#dtGRNDate')),
        VendorName: $('#txtVendorName').val(),
        VendorID: 0,
        AcquisitionDate: getDate($('#dtAcquisitionDate')),
        AcquisitionValue: $('#txtAcquisitionValue').val(),
        OriginalCost: $('#txtOriginalCost').val(),
        WarrantyPeriodFrom: getDate($('#dtWarrantyFromDate')),
        WarrantyPeriodTo: getDate($('#dtWarrantyToDate')),
        IsInsuranceApplicable: $('#chkIsInsuranceApplicable').parent().hasClass("is-checked"),
        IsCalibrationApplicable: $('#chkIsCalibrationApplicable').parent().hasClass("is-checked"),
        IsPrevMaintRequired: $('#chkIsPreventiveApplicable').parent().hasClass("is-checked"),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    }

    $.ajax({
        url: getBaseURL() + '/AssetRegister/InsertAssetRegisterHeader',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearFields();
                $('#hdvInternalAssetNumber').val(response.ID);
                fnGridLoadAssetRegister();
                $("#PopupAssetRegister").modal('show');
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveAssetRegister").attr('disabled', false);
            }

            //function fnClosePopUp() {
            //    setTimeout(function () {
            //        $("#PopupApplicationCodes").modal('hide');
            //    }, 2000);
            //}
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveAssetRegister").attr("disabled", false);
        }
    });
    $("#btnSaveAssetRegister").attr("disabled", false);
       
}

function fnGridRefreshAssetRegister() {
    $("#jqgAssetRegister").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridUpdateAssetRegister(e) {
    $("#divAssetRegister").show();

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetRegister').jqGrid('getRowData', rowid);

    $('#hdvIASerialNumber').val(rowData.IASerialNumber);
    $('#txtAssetTagNumber').val(rowData.AssetTag);
    $('#dtInstallationDate').val(rowData.InstallationDate);
    $('#txtEquipmentSerialNo').val(rowData.EquipmentSerialNumber);
    $('#chkIsCustodian').parent().removeClass("is-checked");
    $('#cboAssetCondition').val("N");
    $('#cboAssetCondition').selectpicker('refresh');
    $('#cboAssetStatus').val("P");
    $('#cboAssetStatus').selectpicker('refresh');

    fnEnableRegisterDetail(true);
}

function fnViewAssetRegister(e) {
    $("#divAssetRegister").show();

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetRegister').jqGrid('getRowData', rowid);
    //alert(JSON.stringify(rowData.InstallationDate));
    $('#hdvIASerialNumber').val(rowData.IASerialNumber);
    $('#txtAssetTagNumber').val(rowData.AssetTag);
    $('#dtInstallationDate').val(rowData.InstallationDate);
    $('#txtEquipmentSerialNo').val(rowData.EquipmentSerialNumber);
    $('#chkIsCustodian').parent().removeClass("is-checked");
    $('#cboAssetCondition').val(rowData.AssetCondition);
    $('#cboAssetCondition').selectpicker('refresh');
    $('#cboAssetStatus').val(rowData.AssetStatus);
    $('#cboAssetStatus').selectpicker('refresh');

    fnEnableRegisterDetail(false);
}

function fnEnableRegisterDetail(val) {
    $("#txtAssetTagNumber").attr('readonly', !val);
    $("#dtInstallationDate").attr('readonly', !val);
    $("#txtEquipmentSerialNo").attr('readonly', !val);
    $("#chkIsCustodian").attr('readonly', !val);
    $("#cboAssetCondition").attr('disabled', !val);
    $("#cboAssetStatus").attr('disabled', !val);
    $("#chkActiveStatusDetail").attr('disabled', !val);
    $("#btnSaveAssetDetail").attr('disabled', !val);
}

function fnAssetRegisterDetailHide() {
    $("#divAssetRegister").hide();

    fnEnableRegisterDetail(true);
}

function fnSaveAssetRegisterDetail() {

    if ($('#hdvIASerialNumber').val() == '') {
        toastr.warning("Please select any Asset to update");
        return;
    }
    if ($('#txtAssetTagNumber').val() == '') {
        toastr.warning("Please Enter the Asset Tag Number");
        $('#txtAssetTagNumber').focus();
        return;
    }
    if ($('#dtInstallationDate').val() == '') {
        toastr.warning("Please Enter the Installation Date");
        $('#dtInstallationDate').focus();
        return;
    }
    if ($('#cboAssetCondition').val() == '') {
        toastr.warning("Please Select a Asset Condition");
        return;
    }
    if ($('#cboAssetStatus').val() == '') {
        toastr.warning("Please Select a Asset Status");
        return;
    }

    $("#btnSaveAssetDetail").attr('disabled', true);
    var obj = {
        InternalAssetNumber: $('#hdvInternalAssetNumber').val(),
        IASerialNumber: $('#hdvIASerialNumber').val(),
        AssetTag: $('#txtAssetTagNumber').val(),
        InstallationDate: $('#dtInstallationDate').val(),
        EquipmentSerialNumber: $('#txtEquipmentSerialNo').val(),
        IsCustodian: $('#chkIsCustodian').parent().hasClass("is-checked"),
        AssetCondition: $('#cboAssetCondition').val(),
        AssetStatus: $('#cboAssetStatus').val(),
        ActiveStatus: $('#chkActiveStatusDetail').parent().hasClass("is-checked")
    }

    $.ajax({
        url: getBaseURL() + '/AssetRegister/InsertUpdateAssetRegisterDetail',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#hdvIASerialNumber').val("");
                fnGridLoadAssetRegister();
                fnAssetRegisterDetailHide();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveAssetDetail").attr('disabled', false);
            }

            //function fnClosePopUp() {
            //    setTimeout(function () {
            //        $("#PopupApplicationCodes").modal('hide');
            //    }, 2000);
            //}
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveAssetDetail").attr("disabled", false);
        }
    });
    $("#btnSaveAssetDetail").attr("disabled", false);

}