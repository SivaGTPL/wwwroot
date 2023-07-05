$(document).ready(function () {
    fnGridLoadAssetRegisterEdit();
    $("#divAssetRegister").hide();
    $("#btnNextAssetRegisterEdit").hide();
});

$("#btnNextAssetRegisterEdit").click(function () {
    //fnGridLoadAssetRegister();
    $("#PopupAssetRegister").modal('show');
})


function fnGridLoadAssetRegisterEdit() {

    $("#jqgAssetRegisterEdit").jqGrid('GridUnload');
    $("#jqgAssetRegisterEdit").jqGrid({
        url: getBaseURL() + '/AssetRegister/GetAssetRegisterHeaderList',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        async: false,
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["InternalAssetNumber", "Asset Group ID", "Asset Group", "Sub Group ID", "Asset Sub Group", "Asset Description", "Quantity","Actions"],
        colModel: [
            { name: "InternalAssetNumber", width: 40, editable: true, align: 'left', hidden: true },
            { name: "AssetGroupID", width: 40, editable: true, align: 'left', hidden: true },
            { name: "AssetGroup", width: 70, editable: true, align: 'left', hidden: false },
            { name: "AssetSubGroupID", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "AssetSubGroup", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AssetDescription", width: 170, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "Quantity", editable: true, width: 30, align: 'center', resizable: false },
            {
                name: 'Actions', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" id="jqgEdit" title="Edit" onclick="return fnEditAssetRegister(event)"><i class="fas fa-pen"></i> Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewAssetRegisterHeader(event)"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        rowNum: 5,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpAssetRegisterEdit",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'Asset Register Edit',
        loadComplete: function (data) {
            SetGridControlByAction("jqgAssetRegisterEdit"); fnJqgridSmallScreen("jqgAssetRegisterEdit");
        }
    }).jqGrid('navGrid', '#jqpAssetRegisterEdit', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAssetRegisterEdit', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAssetRegister
        });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshAssetRegister() {

}

function fnFillAssetSubGroup(assetSubGroup) {

    if ($('#cboAssetGroup').val() != '' && $('#cboAssetGroup').val() != null) {

        $.getJSON(getBaseURL() + '/AssetRegister/GetAssetSubGroup?assetGroup=' + $('#cboAssetGroup').val(), function (result) {
            var options = $("#cboAssetSubGroup");
            $("#cboAssetSubGroup").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.AssetSubGroupID).text(this.AssetSubGroup));
            });
            
            $('#cboAssetSubGroup').selectpicker('refresh');
        }).done(function () {

            if (assetSubGroup != null) {
                
                $('#cboAssetSubGroup').val(assetSubGroup.toString());
            }
            $('#cboAssetSubGroup').selectpicker('refresh');
        });
                
    }
}

function fnEditAssetRegister(e) {
    $("#btnSaveAssetRegisterEdit").show();

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetRegisterEdit').jqGrid('getRowData', rowid);
    
    if (rowData.InternalAssetNumber > 0) {
        
        $.ajax({
            url: getBaseURL() + '/AssetRegister/GetAssetRegisterHeader?internalAssetnumber=' + rowData.InternalAssetNumber,
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response != null) {
                    $("#btnNextAssetRegisterEdit").show();
                    fnFillHeaderRecords(response);
                    fnGridLoadAssetRegister();
                }
                else {
                    fnClearFields();
                }

            },
            error: function (error) {
                toastr.error(error.statusText);
                
            }
        });

    }

}

function fnViewAssetRegisterHeader(e) {

    $("#btnSaveAssetRegisterEdit").hide();

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetRegisterEdit').jqGrid('getRowData', rowid);

    if (rowData.InternalAssetNumber > 0) {

        $.ajax({
            url: getBaseURL() + '/AssetRegister/GetAssetRegisterHeader?internalAssetnumber=' + rowData.InternalAssetNumber,
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response != null) {
                    $("#btnNextAssetRegisterEdit").show();
                    
                    fnFillHeaderRecords(response);
                    fnGridLoadAssetRegister(); 
                }
                else {
                    fnClearFields();
                }

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });

    }
}

function fnFillHeaderRecords(data) {

    $('#hdvInternalAssetNumber').val(data.InternalAssetNumber);
    $('#cboAssetGroup').val(data.AssetGroupID);
    $('#cboAssetGroup').selectpicker('refresh');
    fnFillAssetSubGroup(data.AssetSubGroupID);
    //alert(JSON.stringify(rowData.AssetSubGroupID));
    $('#txtAssetDescription').val(data.AssetDescription);
    $('#cboModel').val(data.Model);
    $('#cboModel').selectpicker('refresh');
    $('#cboManufacturer').val(data.Manufacturer);
    $('#cboManufacturer').selectpicker('refresh');
    $('#cboAssetType').val(data.AssetType);
    $('#cboAssetType').selectpicker('refresh');
    $('#cboAssetClass').val(data.AssetClass);
    $('#cboAssetClass').selectpicker('refresh');
    $('#txtAssetLife').val(data.AssetLife);
    $('#txtAssetSpecification').val(data.AssetSpecification);
    $('#txtQuantity').val(data.Quantity);
    $('#txtPONumber').val(data.PONumber);
    //alert(JSON.stringify(data.PODate));
    if (data.PODate != null)
        //$('#dtPODate').datepicker("setDate", new Date(data.PODate));
        setDate($('#dtPODate'), new Date(data.PODate));
    else
        $('#dtPODate').val('');
    $('#txtGRNNumber').val(data.GRNNumber);
    if (data.GRNDate != null)
        //$('#dtGRNDate').datepicker("setDate", new Date(data.GRNDate));
        setDate($('#dtGRNDate'), new Date(data.GRNDate));
    else
        $('#dtGRNDate').val('');
    $('#txtVendorName').val(data.VendorName);
    $('#txtAcquisitionValue').val(data.AcquisitionValue);
    if (data.AcquisitionDate != null)
        //$('#dtAcquisitionDate').datepicker("setDate", new Date(data.AcquisitionDate));
        setDate($('#dtAcquisitionDate'), new Date(data.AcquisitionDate));
    else
        $('#dtAcquisitionDate').val('');
    $('#txtOriginalCost').val(data.OriginalCost);
    if (data.WarrantyPeriodFrom != null)
        //$('#dtWarrantyFromDate').datepicker("setDate", new Date(data.WarrantyPeriodFrom));
        setDate($('#dtWarrantyFromDate'), new Date(data.WarrantyPeriodFrom));
    else
        $('#dtWarrantyFromDate').val('');
    if (data.WarrantyPeriodTo != null)
        //$('#dtWarrantyToDate').datepicker("setDate", new Date(data.WarrantyPeriodTo));
        setDate($('#dtWarrantyToDate'), new Date(data.WarrantyPeriodTo));
    else
        $('#dtWarrantyToDate').val('');

    if (data.IsInsuranceApplicable == true)
        $('#chkIsInsuranceApplicable').parent().addClass("is-checked");
    else
        $('#chkIsInsuranceApplicable').parent().removeClass("is-checked");

    if (data.IsCalibrationApplicable == true)
        $('#chkIsCalibrationApplicable').parent().addClass("is-checked");
    else
        $('#chkIsCalibrationApplicable').parent().removeClass("is-checked");

    if (data.IsPrevMaintRequired == true)
        $('#chkIsPreventiveApplicable').parent().addClass("is-checked");
    else
        $('#chkIsPreventiveApplicable').parent().removeClass("is-checked");

    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");
    
}

function fnClearFields() {
    $('#hdvInternalAssetNumber').val("");
    $("#btnSaveAssetRegisterEdit").attr("disabled", false);
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
    $('#dtPODate').val("");
    $('#txtGRNNumber').val("");
    $('#dtGRNDate').val("");
    $('#txtVendorName').val("");
    $('#txtAcquisitionValue').val("");
    $('#dtAcquisitionDate').val("");
    $('#txtOriginalCost').val("");
    $('#dtWarrantyFromDate').val("");
    $('#dtWarrantyToDate').val("");

    $('#chkIsInsuranceApplicable').parent().removeClass("is-checked");
    $('#chkIsCalibrationApplicable').parent().removeClass("is-checked");
    $('#chkIsPreventiveApplicable').parent().removeClass("is-checked");
    $('#chkActiveStatus').parent().addClass("is-checked");
    //$("#btnSaveAssetRegister").attr('disabled', false);
    $("#btnNextAssetRegisterEdit").hide();
}

function fnUpdateRegisterHeader() {

    if ($('#cboAssetGroup').val() == '') {
        toastr.warning("Please select a Asset Group");
        $('select[name="cboAssetGroup"]').focus();
        return;
    }
    if ($('#cboAssetSubGroup').val() == '') {
        toastr.warning("Please select a Asset Sub Group");
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
    if ($('#txtQuantity').val() == '0') {
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
    alert($('#txtAcquisitionValue').val());
    $("#btnSaveAssetRegisterEdit").attr('disabled', true);
  
    var obj = {
        InternalAssetNumber: $('#hdvInternalAssetNumber').val(),
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
        //PODate: $('#dtPODate').datepicker("getDate"),
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
    };

    $.ajax({
        url: getBaseURL() + '/AssetRegister/UpdateAssetRegisterHeader',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                //fnGridLoadAssetRegister();
                $("#PopupAssetRegister").modal('show');
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveAssetRegisterEdit").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveAssetRegisterEdit").attr("disabled", false);
        }
    });
    $("#btnSaveAssetRegisterEdit").attr("disabled", false);
}

function fnGridLoadAssetRegister() {

    $("#jqgAssetRegister").jqGrid('GridUnload');
    $("#jqgAssetRegister").jqGrid({
        url: getBaseURL() + '/AssetRegister/GetAssetRegisterDetail?internalAssetnumber=' + $('#hdvInternalAssetNumber').val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Internal Asset Number", "Serial Number", "Asset Description", "Asset Tag Number", "Installation Date", "Unit Acquisition Value", "Unit Original Cost", "Asset Condition", "Equipment Serial No", "Asset Status", "Actions"],
        colModel: [
            { name: "InternalAssetNumber", width: 40, editable: true, align: 'left', hidden: true },
            { name: "IASerialNumber", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "AssetDescription", editable: true, width: 150, align: 'left', resizable: false },
            { name: "AssetTag", editable: true, width: 80, align: 'left', resizable: false, hidden: true },
            {
                //name: "InstallationDate", editable: true, width: 60, align: 'left', resizable: false
                name: 'InstallationDate', index: 'InstallationDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }, hidden: true
            },
            
            { name: "UnitAcquisitionValue", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "UnitOriginalCost", editable: true, width: 45, align: 'center', resizable: false },
            { name: "AssetCondition", editable: true, width: 45, align: 'left', resizable: false },
            { name: "EquipmentSerialNumber", editable: true, width: 80, align: 'left', resizable: false },
            { name: "AssetStatus", editable: true, width: 45, align: 'left', resizable: false },
            {
                name: 'Actions', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" id="jqgDetailEdit" title="Update" onclick="return fnGridUpdateAssetRegister(event)"><i class="fas fa-pen"></i> Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewAssetRegister(event)"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        rowNum: 5,
        //rowList: [10, 20, 50, 100],
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
        scrollOffset: 0,
        loadComplete: function (data) {
            SetDetailGridControlByAction("jqgAssetRegister");
        }
    }).jqGrid('navGrid', '#jqpAssetRegister', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAssetRegister', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAssetRegister
        });
    fnAddGridSerialNoHeading();
}

function fnGridUpdateAssetRegister(e) {
    $("#divAssetRegister").show();

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetRegister').jqGrid('getRowData', rowid);

    fnFillDetailData(rowData);

    fnEnableRegisterDetail(true);
}

function fnViewAssetRegister(e) {
    $("#divAssetRegister").show();

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAssetRegister').jqGrid('getRowData', rowid);

    fnFillDetailData(rowData);

    fnEnableRegisterDetail(false);
}

function fnFillDetailData(data) {

    $('#hdvIASerialNumber').val(data.IASerialNumber);
    $('#txtAssetTagNumber').val(data.AssetTag);
    setDate($('#dtInstallationDate'), new Date(data.InstallationDate));
    $('#txtEquipmentSerialNo').val(data.EquipmentSerialNumber);
    $('#chkIsCustodian').parent().removeClass("is-checked");
    $('#cboAssetCondition').val(data.AssetCondition);
    $('#cboAssetCondition').selectpicker('refresh');
    $('#cboAssetStatus').val(data.AssetStatus);
    $('#cboAssetStatus').selectpicker('refresh');
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
        toastr.warning("Please select Any Asset to update");
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
        InstallationDate: $('#dtInstallationDate').datepicker("getDate"),
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

function SetGridControlByAction(jqg) {
    
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
                
    }
}

function SetDetailGridControlByAction(jqg) {

    if (_userFormRole.IsEdit === false) {
        var eleDisableD = document.querySelectorAll('#jqgDetailEdit');
        for (var i = 0; i < eleDisableD.length; i++) {
            eleDisableD[i].disabled = true;
            eleDisableD[i].className = "ui-state-disabled";
        }
    }
}