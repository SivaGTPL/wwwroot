﻿function fnLoadBusinessLinkGrid() {
    $("#jqgBusinessLink").GridUnload();

    $("#jqgBusinessLink").jqGrid(

        {
            url: getBaseURL() + '/Vendor/GetBusinessKeysByVendorcode?vendorcode=' + $("#txtVendorCode").val(),
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

            serializeGridData: function (postdata) {
                postdata.Vendorcode = $("#txtVendorCode").val();
                return JSON.stringify(postdata.Vendorcode);
            },
            colNames: ['', localization.SegmentDescription, localization.BusinessLocation, localization.Select],
            colModel: [
                { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'BusinessSegment', index: 'BusinessSegment', width: '270', resizable: false },
                { name: 'BusinessLocation', index: 'BusinessLocation', width: '228', resizable: false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth:55,
            loadonce: true,
            pager: "#jqpBusinessLink",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false, scrollOffset: 0,
            onSelectRow: function (rowid) {
                BusinessKey = $("#jqgBusinessLink").jqGrid('getCell', rowid, 'BusinessKey');

            },
            loadComplete: function (data) {
                fnDisableActivecheckboxs();
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            },
        })

        .jqGrid('navGrid', '#jqpBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpBusinessLink', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshBusinessLinkGrid
        });  
    fnAddGridSerialNoHeading();
}

function fnSaveBusinessLinks() {
    if (IsValidBusinessLinks() == false) {
        return;
    }
    var val = [];
    var numberOfRecords = $("#jqgBusinessLink").getGridParam("records");
    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgBusinessLink').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            val.push(rowData.BusinessKey);

        }
    }

    var bkeys = {
        VendorCode: $("#txtVendorCode").val(),
        Businesslink: val
    };

    $.ajax({
        url: getBaseURL() + "/Vendor/InsertBusinesskeyforVendor",
        type: 'POST',
        datatype: 'json',
        data: { bkeys },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnRefreshBusinessLinkGrid();
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
function IsValidBusinessLinks() {
    if (IsStringNullorEmpty($("#txtVendorCode").val())) {
        toastr.warning("Please Create the Vendor Details");
        return false;
    }
}
function fnRefreshBusinessLinkGrid() {
    $("#jqgBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnDisableActivecheckboxs() {
    if (businesslocation === true) {
        $("input[type=checkbox]").attr('disabled', true);
    }
    if (businesslocation === false) {
        $("input[type=checkbox]").attr('disabled', false);
    }
}