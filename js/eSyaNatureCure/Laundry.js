$(document).ready(function () {

    fnLoadCheckInGuestGrid();

    var todaydt = new Date();
    $("#txtServicedate").datepicker({
        autoclose: true,
        dateFormat: _cnfDateFormat,
        endDate: todaydt

    });

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnLaundryCheckInGuest",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: "Add/Edit-Services", icon: "edit", callback: function (key, opt) { fnAddEditLaundryServiceToCheckInGuest(event, 'edit') } },

        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + "Add/Edit Services" + " </span>");

  
});
var actiontype = "";
var _isInsert = true;
function fnLoadCheckInGuestGrid() {

    $("#jqgLaundryCheckInGuest").GridUnload();

    $("#jqgLaundryCheckInGuest").jqGrid(
        {
            url: getBaseURL() + '/Laundry/GetCheckInGuestDetailsByBookingKey',
                    datatype: 'json',
                    mtype: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: ["Guest Id", "First Name", "Last Name", "Gender", "Age YY", "Mobile Number", "Room Type", "Room No", "Bed No", "Price","","","", "", "", "", "", "", "", "", "", "", "", "", "", "Action"],
            colModel: [
                { name: "GuestId", width: 40, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text', hidden: true },
                { name: "FirstName", width: 150, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "LastName", width: 150, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "Gender", width: 70, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "AgeYy", width: 70, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "MobileNumber", width: 160, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "RoomTypeName", width: 120, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "RoomNumber", width: 80, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "BedNumber", width: 80, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: 'PackagePrice', index: 'PackagePrice', width: '120', align: "right", formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: "PackageDesc", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                {
                    name: 'CheckedInDate', index: 'CheckedInDate', width: 120, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }, width: '100', hidden: true
                },
                {
                    name: 'CheckedOutDate', index: 'CheckedOutDate', width: 120, sortable: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }, width: '100', hidden: true
                },
                { name: "BookingKey", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "Isdcode", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "EmailId", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "Place", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "UHID", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "Address", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "AreaCode", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "CityCode", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "StateCode", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "Pincode", width: 160, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "IsCheckedIn", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }, hidden: true },
                { name: "IsCheckedOut", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }, hidden: true },

                {
                    name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="mr-1 btn btn-outline" id="btnLaundryCheckInGuest"><i class="fa fa-ellipsis-v"></i></button>'
                    }
                },
            ],

            pager: "#jqpLaundryCheckInGuest",
                    rowNum: 10,
                    rowList: [10, 20, 50, 100],
                    rownumWidth: '55',
                    loadonce: true,
                    viewrecords: true,
                    gridview: true,
                    rownumbers: true,
                    height: 'auto',
                    scroll: false,
                    width: 'auto',
                    autowidth: true,
                    shrinkToFit: true,
                    forceFit: true, caption: 'CheckIn Guest',
                    loadComplete: function (data) {
                        //SetGridControlByAction();
                        fnJqgridSmallScreen("jqgLaundryCheckInGuest");
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
        }).
        jqGrid('navGrid', '#jqpLaundryCheckInGuest', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpLaundryCheckInGuest', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCheckInGuestGrid
                });

                $(window).on("resize", function () {
                    var $grid = $("#jqgLaundryCheckInGuest"),
                        newWidth = $grid.closest(".LaundryCheckInGuestcontainer").parent().width();
                    $grid.jqGrid("setGridWidth", newWidth, true);
                });
                fnAddGridSerialNoHeading();    
}

function fnAddEditLaundryServiceToCheckInGuest(e, actiontype) {


    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnLaundryService",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditLaundryServiceToCheckInGuest(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditLaundryServiceToCheckInGuest(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditLaundryServiceToCheckInGuest(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");


    fnClearLaundryServiceToCheckInGuest();
    var rowid = $("#jqgLaundryCheckInGuest").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgLaundryCheckInGuest').jqGrid('getRowData', rowid);
    $('#spnUhid').html(rowData.UHID);
    $('#spnGuestname').html(rowData.FirstName + " " + rowData.LastName);
    $('#txtPayMentMode').val(rowData.PaymentModeDesc);
    $('#spnPackage').html(rowData.PackageDesc);
    $('#spnRoomType').html(rowData.RoomTypeName);
    $('#spnRoomNumber').html(rowData.RoomNumber);
    $('#spnBedNumber').html(rowData.BedNumber);
    $('#txtBookingKey').val(rowData.BookingKey);
    $('#txtgender').val(rowData.Gender);
    //$('#spnCheckIndate').html(rowData.CheckedInDate);
    //$('#spnCheckOutdate').html(rowData.CheckedOutDate);
    $('#PopupLaundryService').modal('show');
    $("#btndeActiveLaundry").hide();
    LoadServices();
    fnLoadLaundryCheckInGuest();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveLaundry").show();
    $("#btnSaveLaundry").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnSaveLaundry").attr('disabled', false);
    $('#cboServices').next().attr('disabled', false);
    $('#txtServicedate').prop('disabled', false);
    $('#txtQuantity').attr('readonly', false);
    $("#txtaddserviceSerialNumber").val('');
    $("#txtServicedate").val('');
    $('#txtQuantity').val('');
    $('#txtaddServiceRate').val('');
}

function fnGridRefreshCheckInGuestGrid() {
    $("#jqgLaundryCheckInGuest").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearLaundryServiceToCheckInGuest() {
    $("#spnUhid").html('');
    $("#spnGuestname").html('');
    $('#spnPackage').html('');
    $('#spnRoomType').html('');
    $('#spnRoomNumber').html('');
    $('#spnBedNumber').html('');
    $('#spnCheckIndate').html('');
    $('#spnCheckOutdate').html('');
    $('#txtPayMentMode').val('');
    $('#txtBookingKey').val('');
    $('#txtgender').val('');
}

//Add Landury Service functionality start

function fnLoadLaundryCheckInGuest() {

    $("#jqgAddLaundryServices").jqGrid("GridUnload");

    $("#jqgAddLaundryServices").jqGrid(
        {
            url: getBaseURL() + '/Laundry/GetGuestLaundryServiceByBookingKey?bookingKey=' + $("#txtBookingKey").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {

            },
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ['Business Key', 'Booking Key', 'Serial Number', 'Service Id', 'Service Description', 'ServiceType Id', 'Service Date', 'Qty', 'Rate', 'Discount', 'Concession Amount', 'ServiceCharge Amount', 'Net Amount', 'Active', "Actions"],
            colModel: [
                { name: 'BusinessKey', index: 'BusinessKey', width: 100, hidden: true },
                { name: 'BookingKey', index: 'BookingKey', width: 100, hidden: true },
                { name: 'SerialNumber', index: 'SerialNumber', width: 100, hidden: true },
                { name: 'ServiceId', index: 'ServiceId', width: 100, hidden: true },
                { name: 'ServiceName', index: 'ServiceName', width: 300 },
                { name: 'ServiceTypeId', index: 'ServiceTypeId', width: '100', hidden: true },
                {
                    name: 'ServiceDate', index: 'ServiceDate', width: 180, sortable: true, hidden: true, formatter: "date", formatoptions: { newformat: _cnfjqgDateFormat }
                },
                { name: 'Quantity', index: 'Quantity', width: 80, align: "right", editable: true, formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 0, thousandsSeparator: ',' } },
                { name: 'Rate', index: 'Rate', width: 80, align: "right", editable: false, formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 0, thousandsSeparator: ',' } },
                { name: 'DiscountAmount', index: 'DiscountAmount', width: 100, align: "right", formatter: 'integer', hidden: true, formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: 'ConcessionAmount', index: 'ConcessionAmount', width: 100, align: "right", formatter: 'integer', hidden: true, formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: 'ServiceChargeAmount', index: 'ServiceChargeAmount', width: 100, align: "right", formatter: 'integer', hidden: true, formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: 'TotalAmount', index: 'TotalAmount', width: 120, align: "right", formatter: 'integer', formatoptions: { decimalSeparator: ".", decimalPlaces: 2, thousandsSeparator: ',' } },
                { name: "ActiveStatus", width: 60, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
                {
                    name: 'edit', search: false, align: 'left', width: 60, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="mr-1 btn btn-outline" id="btnLaundryService"><i class="fa fa-ellipsis-v"></i></button>'
                    }
                },
            ],
            rowNum: 10,
            pager: "#jqpAddLaundryServices",
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
            caption: 'History',
            loadComplete: function (data) {
                fnAddGridSerialNoHeading();
                fnJqgridSmallScreen("jqgAddLaundryServices");
            },
        }).jqGrid('navGrid', '#jqpAddLaundryServices', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' })
        .jqGrid('navButtonAdd', '#jqpAddLaundryServices', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAddServices
        }).jqGrid('navButtonAdd', '#jqpAddLaundryServices', {
            caption: '<span class="fa fa-plus" data-toggle="modal" data-whatever="something" style="padding-right:5px;padding-top:2px;padding-right: 2px; vertical-align:text-top;margin-left:8px;"></span> Add', buttonicon: 'none', id: 'custITAdd', position: 'first', onClickButton: fnAddLaundryService
        });
}

function fnGridRefreshAddServices()
{
    $("#jqgAddLaundryServices").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnAddLaundryService() {
    fnClearAddService();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#btnSaveLaundry").show();
    $("#btnSaveLaundry").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnSaveLaundry").attr('disabled', false);
    $("#btndeActiveLaundry").hide(); 
    _isInsert = true;
    $('#cboServices').next().attr('disabled', false);
    $('#txtServicedate').prop('disabled', false);
    $('#txtQuantity').attr('readonly', false);
}



function fnClearAddService() {
    LoadServices();
    $('#cboServices').val('0').selectpicker('refresh');
    $("#txtaddserviceSerialNumber").val('');
    $("#txtServicedate").val('');
    $('#txtQuantity').val('');
    $('#txtaddServiceRate').val('');
    $("#btnSaveLaundry").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnSaveLaundry").attr('disabled', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btndeActiveLaundry").attr("disabled", false);
    
}

function LoadServices() {
    $.get(getBaseURL() + '/Laundry/GetLaundryServiceList?gender=' + $("#txtgender").val(),
        function (data) {
            var s = '<option value="0">Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].ServiceId + '">' + data[i].ServiceDesc + '</option>';
            }
            $("#cboServices").html(s);
            $("#cboServices").selectpicker('refresh');
        });
}

function fnAddServicesChanged(event) {
    $("#txtaddServiceRate").val(0);
    $.get(getBaseURL() + '/Laundry/GetLaundryServiceRates?serviceId=' + $("#cboServices").val(),
        function (data) {
            $("#txtaddServiceRate").val(data.ServiceRate);
        });
}


function fnEditLaundryServiceToCheckInGuest(e, actiontype) {
    var rid = $("#jqgAddLaundryServices").jqGrid('getGridParam', 'selrow');
    var rData = $('#jqgAddLaundryServices').jqGrid('getRowData', rid);

    $('#txtaddserviceSerialNumber').val(rData.SerialNumber);
    //LoadServices();
    //fnAddServicesChanged();
    $('#cboServices').val(rData.ServiceId).selectpicker('refresh');
    if (rData.ServiceDate !== null) {
        setDate($('#txtServicedate'), fnGetDateFormat(rData.ServiceDate));
    }
    else {
        $('#txtServicedate').val('');
    }

    $('#txtQuantity').val(rData.Quantity);
    $('#txtaddServiceRate').val(rData.Rate);
    if (rData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveLaundry").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        $('#PopupLaundryService').find('.modal-title').text("Update Laundry Service");
        $("#btnSaveLaundry").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveLaundry").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveLaundry").attr("disabled", false);
        $("#btnSaveLaundry").show();
        $("#btndeActiveLaundry").hide();
        $('#cboServices').next().attr('disabled', true);
        $('#txtServicedate').prop('disabled', true);
        $('#txtQuantity').attr('readonly', false);
    }

    if (actiontype.trim() == "view") {
        
        $('#PopupLaundryService').find('.modal-title').text("View Laundry Service");
        $("#btnSaveLaundry").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveLaundry").hide();
        $("#btndeActiveLaundry").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $('#cboServices').next().attr('disabled', true);
        $('#txtServicedate').prop('disabled', true);
        $('#txtQuantity').attr('readonly', true);
        $("#PopupLaundryService").on('hidden.bs.modal', function () {
            $("#btnSaveLaundry").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        
        $('#PopupLaundryService').find('.modal-title').text("Activate/De Activate Laundry Service");
        $("#btnSaveLaundry").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveLaundry").hide();
        
        if (rData.ActiveStatus == 'true') {
            $("#btndeActiveLaundry").html(localization.DActivate);
        }
        else {
            $("#btndeActiveLaundry").html(localization.Activate);
        }

        $("#btndeActiveLaundry").show();
        $("#chkActiveStatus").prop('disabled', true);
        $('#cboServices').next().attr('disabled', true);
        $('#txtServicedate').prop('disabled', true);
        $('#txtQuantity').attr('readonly', true);
        $("#PopupLaundryService").on('hidden.bs.modal', function () {
            $("#btnSaveLaundry").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}



function fnSaveCheckInGuestLaundry() {

    if (IsStringNullorEmpty($("#txtBookingKey").val())) {
        toastr.warning("Please Add the Booking Key");
        return;
    }

    if (IsStringNullorEmpty($("#cboServices").val()) || $("#cboServices").val() === '0') {
        toastr.warning("Please Select a Services");
        return;
    }
    if (IsStringNullorEmpty($("#txtServicedate").val())) {
        toastr.warning("Please Select a Service date");
        return;
    }
    if (IsStringNullorEmpty($("#txtQuantity").val()) || $("#txtQuantity").val() === '0') {
        toastr.warning("Please Enter the Quantity");
        return;
    }
    var tamount = $("#txtQuantity").val() * $("#txtaddServiceRate").val();
    $("#btnSaveLaundry").attr('disabled', true);
    var objservice = {
        BookingKey: $("#txtBookingKey").val(),
        SerialNumber: $("#txtaddserviceSerialNumber").val() === '' ? 0 : $("#txtaddserviceSerialNumber").val(),
        ServiceDate: getDate($("#txtServicedate")),
        ServiceTypeId: 0,
        ServiceId: $("#cboServices").val(),
        Quantity: $("#txtQuantity").val(),
        Rate: $("#txtaddServiceRate").val(),
        DiscountAmount: 0,
        ConcessionAmount: 0,
        ServiceChargeAmount: 0,
        TotalAmount: tamount,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $.ajax({
        url: getBaseURL() + '/Laundry/InsertOrUpdateGuestLaundryService',
        type: "POST",
        dataType: "json",
        data: { isInsert: _isInsert, obj: objservice },
        success: function (response) {

            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveLaundry").attr('disabled', false);
                fnGridRefreshAddServices();
                fnClearAddService();

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveLaundry").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveLaundry").attr("disabled", false);
        }
    });
    //$("#btnServices").attr('disabled', false);
}



$("#btnCancelLaundry").click(function () {
    fnClearAddService();
});

function fnDeleteCheckInGuestLaundry() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveLaundry").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Laundry/ActiveOrDeActiveGuestLaundryService?status=' + a_status + '&bookingKey=' + $("#txtBookingKey").val() + '&SerialNumber=' + $("#txtaddserviceSerialNumber").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);               
                fnGridRefreshAddServices();
                fnClearAddService();
                $("#btndeActiveLaundry").attr("disabled", false);
                $("#btndeActiveLaundry").html('Activate');
                $("input,textarea").attr('readonly', false);
                $("select").next().attr('disabled', false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveLaundry").attr("disabled", false);
                $("#btndeActiveLaundry").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveLaundry").attr("disabled", false);
            $("#btndeActiveLaundry").html('De Activate');
        }
    });
}
//Add Landury Service functionality End