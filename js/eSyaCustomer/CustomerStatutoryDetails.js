$(document).ready(function () {
    //fnGridLoadCustomerLocation();
    //fnGridLoadCustomerStatutoryDetails();
})

function fnGridLoadCustomerLocation() {
    $("#jqgLocationDetails").jqGrid('GridUnload');
    $("#jqgLocationDetails").jqGrid({
        url: getBaseURL() + '/Customer/GetCustomerContactInformationByCustomerId?customerId=' + $("#txtCustomerCode").val(),
        datatype: 'json',
        mtype: 'GET',
        //postData: {
        //    customerId: function () { return $('#txtCustomerCode').val(); }
        //},
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.CustomerAddress, localization.ContactPerson, localization.CustomerLocation, localization.LocationID, localization.ISDCode, localization.ISDCode, localization.RegisteredMobileNumber, localization.Default, localization.Active],
        colModel: [
            { name: "Address", width: 200, editable: true, align: 'left', hidden: false },
            { name: "ContactPerson", width: 100, editable: true, align: 'left', },
            { name: "CustomerLocation", width: 50, editable: true, align: 'left', hidden: false },
            { name: "CustomerLocationId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "IsdDescription", width: 70, editable: true, align: 'left', hidden: false },
            { name: "RegisteredMobileNumber", width: 50, editable: true, align: 'left', hidden: false },
            { name: "IsLocationDefault", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth: 55,
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
        scrollOffset: 0, caption:"Location Details",
        onSelectRow: function (rowid) {
            var locationId = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'CustomerLocationId');
            var lsdCode = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'Isdcode');
            var isLocationActive = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'ActiveStatus');
            fnGetStatutorydetails(locationId, lsdCode, isLocationActive);
        },
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgLocationDetails");
        },
    }).jqGrid('navGrid', '#jqpLocationDetails', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnGetStatutorydetails(locationId, lsdCode, isLocationActive) {
    fnGridLoadCustomerStatutoryDetails(locationId, lsdCode, isLocationActive);
    //$("#divstatutorydetailsform").show();
    //$("#lbllocationId").text(locId);
    $("#btnsavestatutory").html("Save");
}

function fnGridLoadCustomerStatutoryDetails(locationId, lsdCode, isLocationActive) {
    $("#jqgStatutoryDetails").jqGrid('GridUnload');
    $("#jqgStatutoryDetails").jqGrid({
        url: getBaseURL() + '/Customer/GetStatutoryInformationByCusIdLocIdIsdCode?customerId=' + $("#txtCustomerCode").val() + '&locationId=' + locationId + '&isdCode=' + lsdCode,
        datatype: 'json',
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["", "", localization.StatutoryDescription, localization.StatutoryDetail, localization.Active],
        colModel: [
            { name: "CustomerLocationId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryCode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryDescription", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "StatutoryValue", width: 100, align: 'left', editable: true, edittype: "text", editoptions: { maxlength: 25 }, },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'center', width: 50, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all" style="padding: 2px 4px; background: #0b76bc!important; color: #fff!important; margin: 3px; " title="Edit" onclick="return fnEditStatutoryDetails(event)"><i class="fa fa-edit"></i> Edit </button>';
            //    }
            //},
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
        cellEdit: true,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {if (id) {$('#jqgStatutoryDetails').jqGrid('editRow', id, true);}
        },
        beforeSelectRow: function (rowid, e) {
            if (isLocationActive === "false" || locationId == 0 || IsStringNullorEmpty($('#txtCustomerCode').val()) || isView == 1)
                return false;
            else
                return true;
        },
    }).jqGrid('navGrid', '#jqpStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
}

$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgStatutoryDetails").jqGrid('editCell', 0, 0, false);

});

function fnSaveStatutorydetails() {
    if (IsStringNullorEmpty($("#txtCustomerCode").val()) || $("#txtCustomerCode").val() == 0) {
        toastr.warning("Please Enter the Customer Name");
        return false;
    }
    $("#btnSaveStatutoryDetail").attr("disabled", true);
    var obj = [];
    var gvT = $('#jqgStatutoryDetails').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['StatutoryValue'])) {
            var cs_sd = {
                CustomerId: $('#txtCustomerCode').val(),
                CustomerLocationId: gvT[i]['CustomerLocationId'],
                StatutoryCode: gvT[i]['StatutoryCode'],
                StatutoryValue: gvT[i]['StatutoryValue'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(cs_sd);
        }
    }
    $.ajax({
        url: getBaseURL() + '/Customer/InsertOrUpdateCustomerStatutoryDetail',
        type: 'POST',
        datatype: 'json',
        data: { cs_sd: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                fnGridRefreshCustomerStatutoryDetails();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveStatutoryDetail").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveStatutoryDetail").attr("disabled", false);
        }
    });

    $("#btnSaveStatutoryDetail").attr("disabled", false);
}

function fnGridRefreshCustomerStatutoryDetails() {
    $("#jqgStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

//Below Code Not Required
function fnEditStatutoryDetails(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgStatutoryDetails').jqGrid('getRowData', rowid);
    $("#btnsavestatutory").html("Update");
}

function fnClearStatutoryDetails() {
    $("#txtstatutorycode").val('');
    $("#txtstatdetailsDesc").val("");
    $("#cboStatutorystatus").val("true");
    $('#cboStatutorystatus').selectpicker('refresh');
    $("#btnsavestatutory").html(localization.Save);
}

