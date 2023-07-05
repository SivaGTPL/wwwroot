﻿function fnloadvendorLocationDetailsGrid() {
    fnClearStatutoryDetails();
    $("#jqgLocationDetails").GridUnload();

    $("#jqgLocationDetails").jqGrid({

        url: getBaseURL() + '/Vendor/GetVendorLocationsByVendorcode?vendorcode=' + $("#txtVendorCode").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["", localization.VendorLocation, localization.VendorAddress, localization.ContactPerson, localization.LocationID, localization.IsDefaultLocation,localization.Active],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocation", width: 150, editable: true, align: 'left', hidden: false },
            { name: "VendorAddress", width: 150, editable: true, align: 'left', hidden: false },
            { name: "ContactPerson", width: 150, editable: true, align: 'left', },
            { name: "VendorLocationId", width: 100, editable: true, align: 'left', hidden: false },
            { name: "IsLocationDefault", editable: true, width: 105, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 60, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

        ],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpLocationDetails",
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
        onSelectRow: function (rowid) {
          
           var locId = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'VendorLocationId');
           var vcode = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'VendorCode');
            fnGetStatutorydetails(vcode,locId);
           
        },

    }).jqGrid('navGrid', '#jqpLocationDetails', { add: false, edit: false, search: false, del: false, refresh: false }); fnAddGridSerialNoHeading();
}

function fnGetStatutorydetails(vcode,locId) {
    $("#txtstatutorylocationId").val(locId);
    $("#txtstatutoryvendorcode").val(vcode);
    $("#txtstatdetailsDesc").val('');
    $("#chkstatutorystatus").parent().removeClass("is-checked");
    fnloadVendorStatutorydetails();
    $("#chkstatutorystatus").parent().addClass("is-checked");
    $("#divstatutorydetailsform").show();
    $("#lbllocationId").text(locId);
    $("#btnsavestatutory").html("Save");
}

function fnloadVendorStatutorydetails() {
    
    $("#jqgStatutoryDetails").GridUnload();
    var locationId = $("#txtstatutorylocationId").val();
    var vndcode = $("#txtstatutoryvendorcode").val();
    $("#jqgStatutoryDetails").jqGrid({

      
        url: getBaseURL() + '/Vendor/GetStatutorydetailsbyVendorcodeAndLocationId?vendorcode=' + vndcode + '&locationId=' + locationId,
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["", "", "", localization.StatutoryDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocationId", width: 150, editable: true, align: 'left', hidden: true },
            { name: "StatutoryCode", width: 40, editable: true, align: 'left', hidden: true},
            { name: "StatutoryDescription", width: 120, editable: true, align: 'left' },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'center', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs btn-jqgrid" title="Edit" onclick="return fnEditStatutoryDetails(event)"><i class="fas fa-pen"></i>' + localization.Edit+' </button>';
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpStatutoryDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
       
        }).jqGrid('navGrid', '#jqpStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}

function fnSaveStatutorydetails() {
    if (IsStringNullorEmpty($("#txtVendorCode").val())) {
        toastr.warning("Please Create the Vendor Details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtstatutorylocationId").val())) {
        toastr.warning("Please Create the Vendor Location");
        return false;
    }
    if (IsStringNullorEmpty($("#txtstatdetailsDesc").val())) {
        toastr.warning("Please Enter the Statutory Description");
        return;
    }

      var statutorydetails = {
            VendorCode: $("#txtstatutoryvendorcode").val(),
            VendorLocationId: $("#txtstatutorylocationId").val(),
            StatutoryCode: $("#txtstatutorycode").val() === '' ? 0 : $("#txtstatutorycode").val(),
            StatutoryDescription: $("#txtstatdetailsDesc").val(),
            ActiveStatus: $("#chkstatutorystatus").parent().hasClass("is-checked")
        };
   
    $.ajax({
        url: getBaseURL() + '/Vendor/InsertOrUpdateStatutorydetails',
        type: 'POST',
        datatype: 'json',
        data: { statutorydetails },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearStatutoryDetails();
                $("#jqgStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

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

function fnEditStatutoryDetails(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgStatutoryDetails').jqGrid('getRowData', rowid);

    $("#txtstatutoryvendorcode").val(rowData.VendorCode);
    $("#txtstatutorylocationId").val(rowData.VendorLocationId);
    $("#txtstatutorycode").val(rowData.StatutoryCode);
    $("#txtstatdetailsDesc").val(rowData.StatutoryDescription);
    if (rowData.ActiveStatus == 'true') {
        $("#chkstatutorystatus").parent().addClass("is-checked");
    }
    else {
        $("#chkstatutorystatus").parent().removeClass("is-checked");
    }
    $("#btnsavestatutory").html(localization.Update);
}

function fnClearStatutoryDetails() {
    $("#txtstatutorycode").val('');
    $("#txtstatdetailsDesc").val('');
    $("#btnsavestatutory").html(localization.Save);
}