
$(document).ready(function ()
{
    fnLoadPaymentDetails();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnAppoval",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Appoval, icon: "Appoval", callback: function (key, opt) { fnOpenRefoundApproval(event, 'Appoval') } }
          
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Appoval + " </span>");
});


function fnLoadPaymentDetails() {

//$("#btnAdvancePayment").attr('disabled', true);

    //fnSetBillSummaryAmount();

    $("#jqgPaymentDetails").GridUnload();

   $("#jqgPaymentDetails").jqGrid({
        url: getBaseURL() + '/RefundRequestApproval/GetRefundRequestApprovals',
    datatype: "json",
    contenttype: "application/json; charset-utf-8",
    mtype: 'GET',
            //postData: {
            //    bookingKey: function () {
            //        return parseInt($('#hdBookingKey').val())
            //    },
            // },
            jsonReader: {repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ["Voucher Type", "Voucher Type Desc", "Payment Mode", "Voucher Key", "Voucher Date","Refund Reason","Voucher Amount","","","","","","","","","","Action"],
            colModel: [
                {name: "VoucherType", width: 40, editable: false, editoptions: {disabled: true }, align: 'left', edittype: 'text', hidden: true },
                {name: "VoucherTypeDesc", width: 150, editable: true, align: 'left', edittype: 'text', hidden: false },
                {name: "PaymentModeDesc", width: 150, editable: true, align: 'left', edittype: 'text', hidden: false },

                {name: "VoucherKey", width: 100, editable: true, align: 'left', edittype: 'text', editoptions: {maxlength: 50 }, hidden: false },
                {
                  name: 'VoucherDate', index: 'VoucherDate', width: 120, sortable: true, formatter: "date", formatoptions:{newformat: _cnfjqgDateFormat }, width: '100'
                },
                { name: "RefundReason", width: 200, editable: true, align: 'left', edittype: 'text', hidden: false },

                { name: 'VoucherAmount', index: 'VoucherAmount', width: '80', align: "right", formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: "UHID", width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                { name: "FirstName",  width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                { name: "LastName", width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                { name: "PackageDesc", width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                { name: "RoomTypeName", width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                { name: "RoomNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                { name: "BedNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 100 }, resizable: false, hidden: true },
                {
                    name: 'CheckedInDate', index: 'CheckedInDate', width: 120, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }, width: '100', hidden: true
                },
                {
                    name: 'CheckedOutDate', index: 'CheckedOutDate', width: 120, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }, width: '100', hidden: true
                },
        {
            name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
            formatter: function (cellValue, options, rowdata, action) {
                return '<button class="mr-1 btn btn-outline" id="btnAppoval"><i class="fa fa-ellipsis-v"></i></button>'
            }
        }
       ],
rowNum: 10,
pager: "#jqpPaymentDetails",
rownumWidth: 55,
viewrecords: true,
gridview: true,
rownumbers: true,
height: 'auto',
width: 'auto',
autowidth: true,
shrinkToFit: true,
forceFit: true,
loadonce: true,
loadComplete: function (data)
       {

           var totalCollectionAmount = 0;
           var rowIds = $("#jqgPaymentDetails").getDataIDs();
                for (var i = 0; i < rowIds.length; i++) {
                if ($("#jqgPaymentDetails").jqGrid('getCell', rowIds[i], 'VoucherType') == "R")
                totalCollectionAmount = totalCollectionAmount + Math.round(parseFloat($("#jqgPaymentDetails").jqGrid('getCell', rowIds[i], 'VoucherAmount')));
                else if ($("#jqgPaymentDetails").jqGrid('getCell', rowIds[i], 'VoucherType') == "P")
                totalCollectionAmount = totalCollectionAmount - Math.round(parseFloat($("#jqgPaymentDetails").jqGrid('getCell', rowIds[i], 'VoucherAmount')));
        }
//CalculateTotalAmount();
var netBillAmount = parseFloat($('#txtNetPackageAmount').val());
                //if (netBillAmount <= 0) {
                //    netBillAmount = parseFloat($('#txtPackageAmount').val());
                //}
                //$('#txtNetPackageAmount').val(netBillAmount.toFixed(2));
                var balanceAmount = netBillAmount - totalCollectionAmount;
    $('#txtCollectedAmount').val(totalCollectionAmount.toFixed(2));
    $('#txtTotalCollectedAmount').val(totalCollectionAmount.toFixed(2));
    $('#txtBalanceAmount').val(balanceAmount.toFixed(2));

    fnAddGridSerialNoHeading();

    if (balanceAmount > 0)
        $("#btnAdvancePayment").attr('disabled', false);
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
}).jqGrid('navGrid', '#jqpPaymentDetails', {add: false, edit: false, search: false, del: false, refresh: false });

}

function fnOpenRefoundApproval() {
    
    $("#btnApprovedPaymentRefund").html('Approved');
    $("#btnApprovedPaymentRefund").attr("disabled", false);
    var rowid = $("#jqgPaymentDetails").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPaymentDetails').jqGrid('getRowData', rowid);
    $('#spnUhid').html(rowData.UHID);
    $('#spnGuestname').html(rowData.FirstName + " " + rowData.LastName);
    $('#txtPayMentMode').val(rowData.PaymentModeDesc);
    $('#spnPackage').html(rowData.PackageDesc);
    $('#spnRoomType').html(rowData.RoomTypeName);
    $('#spnRoomNumber').html(rowData.RoomNumber);
    $('#spnBedNumber').html(rowData.BedNumber);
    $('#spnCheckIndate').html(rowData.CheckedInDate);
    $('#spnCheckOutdate').html(rowData.CheckedOutDate);
    $('#txtPDAmountToCollect').val(rowData.VoucherAmount);
    $('#txtReason').val(rowData.RefundReason); 
    $('#txtVoucherKey').val(rowData.VoucherKey);
    $("#popupRefundRequestApproval").modal('show');
}

function fnApprovedPaymentRefund() {

   
    objrefound = {
        VoucherKey: $("#txtVoucherKey").val(),
        VoucherAmount: $("#txtPDAmountToCollect").val(),
        RefundReason:$('#txtReason').val()
    };

    $("#btnApprovedPaymentRefund").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/RefundRequestApproval/UpdateRefundRequestApproval',
        type: 'POST',
        datatype: 'json',
        data: { obj: objrefound },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnApprovedPaymentRefund").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#popupRefundRequestApproval").modal('hide');
                fnClearFields();
                fnGridRefreshRefoundApproval();
            }
            else {
                toastr.error(response.Message);
                $("#btnApprovedPaymentRefund").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnApprovedPaymentRefund").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#spnUhid").html('');
    $("#spnGuestname").html('');
    $('#spnPackage').html('');
    $('#spnRoomType').html('');
    $('#spnRoomNumber').html('');
    $('#spnBedNumber').html('');
    $('#spnCheckIndate').html('');
    $('#spnCheckOutdate').html('');
    $('#txtPayMentMode').val('');
    $('#txtPDAmountToCollect').val('');
    $('#txtReason').val('');
    $('#txtVoucherKey').val('');
    $("#btnApprovedPaymentRefund").attr("disabled", false);
    $("#btnApprovedPaymentRefund").html('Approved');
}

function fnGridRefreshRefoundApproval() {
    $("#jqgPaymentDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}