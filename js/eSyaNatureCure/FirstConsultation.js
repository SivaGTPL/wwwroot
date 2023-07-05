$(document).ready(function () {
   
    $.contextMenu({
        // define which elements trigger this menu
        selector: ".btn-actions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            confirm: { name: localization.Confirm, icon: "edit", callback: function (key, opt) { fnConfirmConsultation(event) } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Confirm + "</span>");
    fnGridLoad();

});

function fnGridLoad() {
    $("#jqgFirstConsultation").jqGrid('GridUnload');
    $("#jqgFirstConsultation").jqGrid({
        url: getBaseURL() + '/FirstConsultation/GetConsultaionList',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BookingKey, localization.GuestId, localization.PackageId, localization.uhid, localization.FirstName, localization.LastName, localization.Gender, localization.MobileNumber, localization.EmailId, localization.AgeYy, localization.Actions],
        colModel: [
            { name: "BookingKey", width: 10, editable: true, align: 'left', hidden: false },
            { name: "GuestId", width: 10, editable: true, align: 'left', hidden: false },
            { name: "PackageId", width: 10, editable: true, align: 'left', hidden: true },
            { name: "Uhid", width: 10, editable: true, align: 'left', hidden: true },
            { name: "FirstName", width: 15, editable: true, align: 'left', hidden: false },
            { name: "LastName", width: 15, editable: true, align: 'left', hidden: false },
            { name: "Gender", width: 10, editable: true, align: 'left', hidden: false },
            { name: "MobileNumber", width: 20, editable: true, align: 'left', hidden: false },
            { name: "EmailId", width: 30, editable: true, align: 'left', hidden: false },
            { name: "AgeYy", width: 10, editable: true, align: 'left', hidden: false },
            {
                name: 'Action', search: false, align: 'left', width: 20, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpFirstConsultation",
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
        
    });

    $("#jqgFirstConsultation").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" })
}

function fnConfirmConsultation(e) {
    
    var rowid = $("#jqgFirstConsultation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgFirstConsultation').jqGrid('getRowData', rowid);

    var obj = {
        BookingKey: rowData.BookingKey,
        GuestId: rowData.GuestId,
        PackageId: rowData.PackageId
    };

    $.ajax({
        url: getBaseURL() + '/FirstConsultation/ConsultaionConfirmation',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefresh();

                //localStorage.setItem("BookingKey", rowData.BookingKey);
                //localStorage.setItem("GuestId", rowData.GuestId);
                //localStorage.setItem("Uhid", rowData.Uhid);
                var url = getBaseURL() + '/esyaNatureCure/FirstConsultation/V_ENC_08_00?bookingKey=' + rowData.BookingKey + '&guestId=' + rowData.GuestId + '&uhid=' + rowData.Uhid;
                window.open(
                    url,
                    '_blank'
                    // <- This is what makes it open in a new window.
                    , ''
                );
            }
            else {
                toastr.error(response.Message);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
    
}
function fnGridRefresh() {
    $("#jqgFirstConsultation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

  