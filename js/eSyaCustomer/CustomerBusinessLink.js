$(document).ready(function () {
    //fnGridLoadBusinessLocation();
})

function fnGridLoadBusinessLocation() {
    $("#jqgCustomerBusinessLink").jqGrid('GridUnload');
    $("#jqgCustomerBusinessLink").jqGrid(
         {
            url: getBaseURL() + '/Customer/GetCustomerBusinessLocationByCustomerId?customerId=' + $("#txtCustomerCode").val(),
            datatype: 'json',
            mtype: 'GET',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [localization.BusinessKey, localization.SegmentDescription, localization.BusinessLocation, localization.Select],
            colModel: [
                { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'SegmentDesc', index: 'BusinessSegment', width: '270', resizable: false },
                { name: 'LocationDescription', index: 'BusinessLocation',editable: false, edittype: "text", width: '228', resizable: false },
                {
                    name: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth: 55,
            loadonce: true,
            pager: "#jqpCustomerBusinessLink",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false,
            scrollOffset: 0,
            cellEdit: true,
            cellsubmit: 'clientArray', caption:'Customer Business Link',
            onSelectRow: function (id) {
                if (id) { $('#jqpCustomerBusinessLink').jqGrid('editRow', id, true); }
            },
            rowattr: function (item) {
                if (IsStringNullorEmpty($('#txtCustomerCode').val()) || $("#txtCustomerCode").val() == 0 || isView == 1) {
                    return { "class": "ui-state-disabled ui-jqgrid-disablePointerEvents" };
                }
            },
            beforeSelectRow: function (rowid, e) { 
                if ($(e.target).closest("tr.jqgrow").hasClass("ui-state-disabled")) {
                    return false;
                }
                return true;  
            },
            loadComplete: function () {
                fnJqgridSmallScreen("jqgCustomerBusinessLink");
            },
        }).jqGrid('navGrid', '#jqpCustomerBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveCustomerBusinessLocation() {
    if (IsStringNullorEmpty($("#txtCustomerCode").val()) || $("#txtCustomerCode").val() == 0) {
        toastr.warning("Please Enter the Customer Name");
        return false;
    }
    $("#btnSaveCustomerBusinessLocation").attr("disabled", true);
    var obj = [];
    var gvT = $('#jqgCustomerBusinessLink').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['BusinessKey'])) {
            var cs_bl = {
                CustomerId: $('#txtCustomerCode').val(),
                BusinessKey: gvT[i]['BusinessKey'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(cs_bl);
        }
    }
    $.ajax({
        url: getBaseURL() + '/Customer/InsertOrUpdateCustomerBusinessLocation',
        type: 'POST',
        datatype: 'json',
        data: { cs_bl: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success(response.Message);
                fnGridRefreshCustomerBusinessLinkGrid();
                //$('#v-pills-tab a.active').removeClass('active').next().addClass('active');
                //$('.tab-pane.show.active').removeClass('show active').next().addClass('show active');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveCustomerBusinessLocation").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCustomerBusinessLocation").attr("disabled", false);
        }
    });

    $("#btnSaveCustomerBusinessLocation").attr("disabled", false);
}

function fnGridRefreshCustomerBusinessLinkGrid() {
    $("#jqgCustomerBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}