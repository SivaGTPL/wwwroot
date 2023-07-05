var _formEdit = true;
var _formDelete = true;

// Memeber Ship Header Start
$(document).ready(function () {

    fnGridLoadMemberShip("0");

    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var memberNamePrefix = $(this).text();
        if (memberNamePrefix === "All")
            memberNamePrefix = "All";
        fnGridLoadMemberShip(memberNamePrefix);
        $(this).addClass('active');
    });
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgMemberShip');
        }
    });
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnMemberShip",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditMemberShip(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewMemberShip(event) } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateMemberShip(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");


    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDonationAmount",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDonationAmount(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDonationAmount(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDonationAmount(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");


    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnMemberShipType",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditMemberShipType(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditMemberShipType(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditMemberShipType(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadMemberShip(memberNamePrefix) {
    $("#jqgMemberShip").jqGrid('GridUnload');
    $("#jqgMemberShip").jqGrid({
        url: getBaseURL() + '/MembershipRegistration/GetMembershipHeaderByNamePrefix?memberNamePrefix=' + memberNamePrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.BusinessKey, localization.MemberId, localization.MemberName, localization.FirstName, localization.MiddleName, localization.LastName, localization.RegisteredDate,localization.Gender,  localization.Age, localization.Isdcode, localization.MobileNumber, localization.EmailId, localization.CityCode, localization.StateCode, localization.Uhid, localization.DonationAmount, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 40, editable: true, align: 'left', hidden: true },
            { name: "MemberId", width: 40, editable: true, align: 'left', hidden: false },
            { name: "MemberName", width: 70, editable: true, align: 'left', hidden: false },
            { name: "FirstName", width: 70, editable: true, align: 'left', hidden: true },
            { name: "MiddleName", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "LastName", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            {
                name: "RegisteredDate", editable: false, width: 70, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: "Gender", editable: true, align: 'left', width: 40, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "M: Male;F: Female" } },
            { name: "AgeYy", width: 35, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Isdcode", width: 35, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "MobileNumber", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "EmailId", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "CityCode", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "StateCode", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Uhid", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DonationAmount", width: 50, editable: false, hidden: false, align: 'right', resizable: true },
            { name: "ActiveStatus", editable: true, width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnMemberShip"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        pager: "#jqpMemberShip",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        loadComplete: function (data) {
            SetMemberShipGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen('jqgMemberShip');
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

    }).jqGrid('navGrid', '#jqpMemberShip', { add: false, edit: false, search: false, del: false, refresh: false }, {}, {}, {}, {
        closeOnEscape: true,
        caption: "Search...",
        multipleSearch: true,
        Find: "Find",
        Reset: "Reset",
        odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }]
        }).jqGrid('navButtonAdd', '#jqpMemberShip', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshMemberShip
        }).jqGrid('navButtonAdd', '#jqpMemberShip', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgDMAdd', position: 'first', onClickButton: fnGridAddMemberShip
    });

    fnAddGridSerialNoHeading();
    
}

function fnGridAddMemberShip() {
    fnClearFields();
    $("#btnSaveMemberShip").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnClearMemberShip").show();
    $("#divGrid").hide();
    $('#divMemberShipForm').css('display', 'block');
    _formEdit = true;
    _formDelete = true;
    //$("#txtCouponId").attr('readonly', false);
    $("select").next().prop("disabled", false);
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    fnGridMemberShipType();
    fnGridDonationAmount();
    $('#txMemberShiptDonationAmount').attr('readonly', true);
    //fnGridDonationAmount();
}

function fnGridRefreshMemberShip() {
    $("#jqgMemberShip").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditMemberShip(e) {

    if (_userFormRole.IsEdit === false) {
        toastr.warning("Your are not authorized to Edit");
        return;
    }
    $("#divGrid").hide();
    $('#divMemberShipForm').css('display', 'block');
    fnClearFields();
    $("#btnSaveMemberShip").html('<i class="far fa-save"></i> ' + localization.Update);
    $("#btnClearMemberShip").hide();
    var rowid = $("#jqgMemberShip").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMemberShip').jqGrid('getRowData', rowid);
    _formEdit = true;
    _formDelete = true;

    fnGetMemberShip(rowData);
    //fnGridMemberShipType();
    //fnGridDonationAmount();
    //$("#txtCouponId").attr('readonly', true);
    $("select").next().prop("disabled", false);
    $("#btnSave").show();
    $("#chkActiveStatus").attr('disabled', true);
    $('#txMemberShiptDonationAmount').attr('readonly', true);
}

function fnViewMemberShip(e) {

    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not authorized to View");
        return;
    }
    fnClearFields();
    var rowid = $("#jqgMemberShip").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMemberShip').jqGrid('getRowData', rowid);
    _formEdit = false;
    _formDelete = false;
    fnGetMemberShip(rowData);
    //fnGridMemberShipType();
    //fnGridDonationAmount();
    $("#divGrid").hide();
    $('#divMemberShipForm').css('display', 'block');
    $("#btnSaveMemberShip").hide();
    $("#btnClearMemberShip").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().prop("disabled", true);
    $("input[type=checkbox]").attr('disabled', true);
    $("#btnSave").hide();
    $('#txMemberShiptDonationAmount').attr('readonly', true);
}

function fnGetMemberShip(data) {
    if (data != null) {
        objm =
            {
            BusinessKey: data.BusinessKey,
            MemberId: data.MemberId
            };

        $.ajax({
            url: getBaseURL() + '/MembershipRegistration/GetMembershipHeaderByMemberId',
            type: 'POST',
            datatype: 'json',
            data: { objm },
            success: function (response) {
                if (response != null) {
                    fnFillMemberShipData(response);
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

function fnFillMemberShipData(data) {

    $('#hdvBusinesskey').val(data.BusinessKey);
    $('#hdvMemberShipId').val(data.MemberId);
    $('#txtFirstName').val(data.FirstName);
    $('#txtMiddleName').val(data.MiddleName);
    $('#txtLastName').val(data.LastName);
    $('#cboGender').val(data.Gender).selectpicker('refresh');
    $('#txtAge').val(data.AgeYy);
    $('#cboMemberMobile').val(data.Isdcode).selectpicker('refresh');
    $('#txtMemberMobile').val(data.MobileNumber);
    BindStates();
    $('#cboState').val(data.StateCode).selectpicker('refresh');
    BindCities();
    $('#cboCity').val(data.CityCode).selectpicker('refresh');
    $('#txtEMailId').val(data.EmailId);
    $('#txMemberShiptDonationAmount').val(data.DonationAmount);
    $("#txMemberShiptDonationAmount").attr('readonly', true);
    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");
    fnGridMemberShipType();
    fnGridDonationAmount();
}

function fnSaveMemberShip() {

    if (IsStringNullorEmpty($('#txtFirstName').val())) {
        toastr.warning("Please Enter the First Name");
        $('#txtFirstName').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtLastName').val())) {
        toastr.warning("Please Enter the Last Name");
        $('#txtLastName').focus();
        return;
    }
    if (($('#cboGender').val() === '0') || $('#cboGender').val() === "0") {
        toastr.warning("Please Select a Gender");
        $('#cboGender').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtAge').val())) {
        toastr.warning("Please Enter the Age");
        $('#txtAge').focus();
        return;
    }
   
    if (IsStringNullorEmpty($("#cboMemberMobile").val()) || $("#cboMemberMobile").val() <= 0) {
        toastr.warning("Please Select a ISD");
        $('#cboMemberMobile').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtMemberMobile').val())) {
        toastr.warning("Please Enter the Mobile Number");
        $('#txtMemberMobile').focus();
        return;
    }
    if ($("#txtMemberMobile").inputmask("isComplete") === false) {
        toastr.warning("Please Enter the Mobile Number");
        $('#txtMemberMobile').focus();
        return;
    }
   

    if (!IsStringNullorEmpty($("#txtEMailId").val())) {

        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test($("#txtEMailId").val())) {
            toastr.warning("Please enter the valid Email ID");
            return false;
        }
    }
   
    $("#btnSaveMemberShip").attr("disabled", true);

    var obj = {

        BusinessKey: $('#hdvBusinesskey').val(),
        MemberId: $('#hdvMemberShipId').val(),
      //RegisteredDate :getDate($('#RegisteredDate').val()),
        FirstName: $('#txtFirstName').val(),
        MiddleName: $('#txtMiddleName').val(),
        LastName: $('#txtLastName').val(),
        Gender: $('#cboGender').val(),
        AgeYy: $('#txtAge').val(),
        Isdcode: $('#cboMemberMobile').val(),
        MobileNumber: $('#txtMemberMobile').val(),
        EmailId: $('#txtEMailId').val(),
        CityCode: $('#cboCity').val(),
        StateCode: $('#cboState').val(),
       //Uhid: $('#Uhid').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    };

    var Url;
    if ($('#hdvMemberShipId').val() === null || $('#hdvMemberShipId').val() === '')
        Url = getBaseURL() + '/MembershipRegistration/InsertIntoMembershipHeader';
    else
        Url = getBaseURL() + '/MembershipRegistration/UpdateMembershipHeader';

    $.ajax({
        url: Url,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    //fnClearHeaderFields();
                    fnGridRefreshMemberShip();
                    ReadMemberShipCode(response);
                    $("#btnSaveMemberShip").attr('disabled', false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveMemberShip").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveMemberShip").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveMemberShip").attr("disabled", false);
        }
    });
    $("#btnSaveMemberShip").attr('disabled', false);
}

function ReadMemberShipCode(res) {
    $("#hdvBusinesskey").val('');
    $("#hdvBusinesskey").val(res.bKey);
    $("#hdvMemberShipId").val('');
    $("#hdvMemberShipId").val(res.MId);
}

function fnClearFields() {
    $('#hdvBusinesskey').val('');
    $('#hdvMemberShipId').val('');
    $('#hdMemberName').val('');
    $('#txtFirstName').val('');
    $('#txtMiddleName').val('');
    $('#txtLastName').val('');
    $('#cboGender').val('0').selectpicker('refresh');
    $('#txtAge').val('');
    $('#cboMemberMobile').val('0').selectpicker('refresh');
    $('#txtMemberMobile').val('');
    $('#cboMembershipType').val('0').selectpicker('refresh');
    $('#cboState').val('0').selectpicker('refresh');
    $('#cboCity').val('0').selectpicker('refresh');
    $('#txtEMailId').val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveMemberShip").html('<i class="far fa-save"></i> ' + localization.Save);
    $('#txMemberShiptDonationAmount').val('');

}

//function fnClearHeaderFields() {
//    $('#hdMemberName').val('');
//    $('#txtFirstName').val('');
//    $('#txtMiddleName').val('');
//    $('#txtLastName').val('');
//    $('#cboGender').val('0').selectpicker('refresh');
//    $('#txtAge').val('');
//    $('#cboMemberMobile').val('0').selectpicker('refresh');
//    $('#txtMemberMobile').val('');
//    $('#cboMembershipType').val('0').selectpicker('refresh');
//    $('#cboState').val('0').selectpicker('refresh');
//    $('#cboCity').val('0').selectpicker('refresh');
//    $('#txtEMailId').val('');
//    $('#chkActiveStatus').parent().addClass("is-checked");

//}

function SetMemberShipGridControlByAction() {

    if (_userFormRole.IsInsert === false) {
        $('#jqgDMAdd').addClass('ui-state-disabled');
    }

}

function fnCloseMemberShip() {

    $("#divGrid").show();
    $('#divMemberShipForm').css('display', 'none');
    $("#btnSaveMemberShip").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("input[type=checkbox]").attr('disabled', false);
    fnClearFields();
    fnGridRefreshMemberShip();
}

function fnDeActivateMemberShip(e) {

    if (_userFormRole.IsDelete === false) {
        toastr.warning("You are not authorized to Delete");
        return;
    }
    var rowid = $("#jqgMemberShip").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMemberShip').jqGrid('getRowData', rowid);
    var businesskey = rowData.BusinessKey;
    var memberId = rowData.MemberId;
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to De Activate Member Ship?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want Activate Member Ship?";
        lbl = localization.Activate;
    }
    bootbox.confirm({
        title: 'Doctor Master',
        message: msg,
        buttons: {
            confirm: {
                label: lbl,
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent primary-button'
            },
            cancel: {
                label: 'Cancel',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result) {
                if (memberId == null || memberId == undefined || memberId == "0" || memberId == '') {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/MembershipRegistration/ActiveOrDeActiveMembershipHeader?status=' + a_status + '&businesskey=' + businesskey + '&memberId=' + memberId ,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            toastr.success(response.Message);
                            fnGridRefreshMemberShip();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        fnGridRefreshMemberShip();
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}

// Memeber Ship Header End

//Memeber Ship Type Start

function fnGridAddMemberShipType() {
    if ($('#hdvMemberShipId').val() === null || $('#hdvMemberShipId').val() === '') {
        toastr.warning("Please add the Membership Header first");
        return;
    }
    else {
        fnClearMemberShipTypeFields();
        $("#modalMembershipType").modal('show');
        $("#chkMembershipActiveStatus").parent().addClass("is-checked");
        $("#chkMembershipActiveStatus").prop('disabled', true);
        $('#modalMembershipType').find('.modal-title').text(localization.AddMemberShipType);
        $("#btnSaveMembershiptype").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveMembershiptype").show();
        $("#btndeActiveMembershiptype").hide();
        $("#txtCouponId").attr('readonly', false);
        $("#txtValidFrom, txtValidFrom").prop("disabled", false);
        $("#txtValidTill, txtValidTill").prop("disabled", false);
        $("#btnSaveMembershiptype").attr("disabled", false);
    }

}

function fnEditMemberShipType(e, actiontype) {
    var rowid = $("#jqgMemberShipType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMemberShipType').jqGrid('getRowData', rowid);

    $('#modalMembershipType').modal('show');
    $('#cboMemberShipType').val(rowData.MembershipType);
    $('#cboMemberShipType').selectpicker('refresh');
    $('#txtCouponId').val(rowData.CouponId);
    $("#txtCouponId").attr('readonly', true);
    $('#txtNumberofYear').val(rowData.NoOfYear);
    if (rowData.ValidFrom !== null) {
        setDate($('#txtValidFrom'), fnGetDateFormat(rowData.ValidFrom));
    }
    else {
        $('#txtValidFrom').val('');
    }
    if (rowData.ValidTill !== null) {
        setDate($('#txtValidTill'), fnGetDateFormat(rowData.ValidTill));
    }
    else {
        $('#txtValidTill').val('');
    }
    $('#cboRoomType').val(rowData.RoomType);
    $('#cboRoomType').selectpicker('refresh');
    $('#txtNumberofPersons').val(rowData.NoOfPersons);
    $('#txtBookingDiscountPercentage').val(rowData.BookingDiscountPercentage);
    if (rowData.ActiveStatus == 'true') {
        $("#chkMembershipActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkMembershipActiveStatus").parent().removeClass("is-checked");
    }

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#modalMembershipType').find('.modal-title').text(localization.UpdateMemberShipType);
        $("#btnSaveMembershiptype").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveMembershiptype").hide();
        $("#chkMembershipActiveStatus").prop('disabled', true);
        $("#btnSaveMembershiptype").attr("disabled", false);
        $("#txtValidFrom, txtValidFrom").prop("disabled", false);
        $("#txtValidTill, txtValidTill").prop("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#modalMembershipType').find('.modal-title').text(localization.ViewMemberShipType);
        $("#btnSaveMembershiptype").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveMembershiptype").hide();
        $("#btndeActiveMembershiptype").hide();
        $("#chkMembershipActiveStatus").prop('disabled', true);
        $("#txtValidFrom, txtValidFrom").prop("disabled", true);
        $("#txtValidTill, txtValidTill").prop("disabled", true);
        $("#modalMembershipType").on('hidden.bs.modal', function () {
            $("#btnSaveMembershiptype").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#modalMembershipType').find('.modal-title').text("Activate/De Activate MemberShip Type");
        $("#btnSaveMembershiptype").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveMembershiptype").hide();
        $("#txtValidFrom, txtValidFrom").prop("disabled", true);
        $("#txtValidTill, txtValidTill").prop("disabled", true);
        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveMembershiptype").html(localization.DActivate);
        }
        else {
            $("#btndeActiveMembershiptype").html(localization.Activate);
        }

        $("#btndeActiveMembershiptype").show();
        $("#chkMembershipActiveStatus").prop('disabled', true);
        $("#modalMembershipType").on('hidden.bs.modal', function () {
            $("#btnSaveMembershiptype").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshMemberShipType() {
    $("#jqgMemberShipType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridMemberShipType() {
    $("#jqgMemberShipType").jqGrid('GridUnload');
    $("#jqgMemberShipType").jqGrid({
        url: getBaseURL() + '/MembershipRegistration/GetMembershipTypes?businesskey=' + $('#hdvBusinesskey').val() + '&memberId=' + $('#hdvMemberShipId').val(),
        datatype: 'json',
        mtype: 'post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.BusinessKey, localization.MemberId, localization.CouponId, localization.MemberShipType, localization.MemberShipType, localization.NumberOfYears, localization.ValidFrom, localization.ValidTill, localization.RoomType, localization.RoomType, localization.BookingDiscountPercentage, localization.NoOfPersons, localization.Active, localization.Actions],
        colModel: [

            { name: "BusinessKey", width: 40, editable: true, align: 'left', hidden: true },
            { name: "MemberId", width: 60, editable: true, align: 'left', hidden: false },
            { name: "CouponId", width: 70, editable: true, align: 'left', hidden: false },
            { name: "MembershipType", width: 50, editable: true, align: 'left', hidden: true },
            { name: "MemberTypedesc", width: 90, editable: true, align: 'left', hidden: false },
            { name: "NoOfYear", width: 100, editable: true, align: 'left', hidden: false },
            {
                name: "ValidFrom", editable: false, width: 70, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            }, {
                name: "ValidTill", editable: false, width: 70, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            
            { name: "RoomType", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "RoomTypedesc", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "BookingDiscountPercentage", width: 120, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "NoOfPersons", width: 120, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: true, width: 125, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 95, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnMemberShipType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        pager: "#jqpMemberShipType",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        loadComplete: function (data) {

            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen('jqgMemberShipType');

        },
    }).jqGrid('navGrid', '#jqpMemberShipType', {
        add: false, edit: false, search: false, del: false, refresh: false
        }).jqGrid('navButtonAdd', '#jqpMemberShipType', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custDARefresh", position: "first", onClickButton: fnGridRefreshMemberShipType
        }).jqGrid('navButtonAdd', '#jqpMemberShipType', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgDAAdd', position: 'first', onClickButton: fnGridAddMemberShipType
    });
    $("#jqgMemberShipType").jqGrid('setGridWidth', $('.tab-content').width());
}

function fnDeActivateMemberShipType(e) {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkMembershipActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveMembershiptype").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MembershipRegistration/ActiveOrDeActiveMembershipType?status=' + a_status + '&businesskey=' + $('#hdvBusinesskey').val() + '&memberId=' + $('#hdvMemberShipId').val() + '&couponId=' + $('#txtCouponId').val() ,
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveMembershiptype").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#modalMembershipType").modal('hide');
                fnClearMemberShipTypeFields();
                fnGridRefreshMemberShipType();
                $("#btndeActiveMembershiptype").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveMembershiptype").attr("disabled", false);
                $("#btndeActiveMembershiptype").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveMembershiptype").attr("disabled", false);
            $("#btndeActiveMembershiptype").html('De Activate');
        }
    });
}

function fnClearMemberShipTypeFields() {

    $('#cboMemberShipType').val('0').selectpicker('refresh');
    $('#txtCouponId').val('');
    $('#txtNumberofYear').val('');
    $('#txtValidFrom').val('');
    $('#txtValidTill').val('');
    $('#cboRoomType').val('0').selectpicker('refresh');
    $('#txtNumberofPersons').val('');
    $('#txtBookingDiscountPercentage').val('');
    $('#chkMembershipActiveStatus').parent().addClass("is-checked");
    $("#btnSaveMembershiptype").html('<i class="far fa-save"></i> ' + localization.Save);

}

$("#membershipType-tab").click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    fnGridMemberShipType(); 
    
});

$("#donationAmount-tab").click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    fnGridDonationAmount();
    
});

function fnSaveMemberShipType() {
    if ($('#hdvMemberShipId').val() === null || $('#hdvMemberShipId').val() === '') {
        toastr.warning("Please add the Membership Header");
        return;
    }
    if ($('#hdvBusinesskey').val() === null || $('#hdvBusinesskey').val() === '') {
        toastr.warning("Please add the Membership Header");
        return;
    }
    if (IsStringNullorEmpty($("#cboMemberShipType").val()) || $("#cboMemberShipType").val() === '0' || $("#cboMemberShipType").val() === "0") {
        toastr.warning("Please Select a Membership Type");
        $('#cboMemberShipType').focus();
        return;
    }
     if (IsStringNullorEmpty($('#txtCouponId').val())) {
        toastr.warning("Please Enter the Coupon ID");
        $('#txtCouponId').focus();
        return;
    }
     if (IsStringNullorEmpty($('#txtNumberofYear').val())) {
        toastr.warning("Please Enter the Number of Year");
        $('#txtNumberofYear').focus();
        return;
    }
     if (IsStringNullorEmpty($('#txtValidFrom').val())) {
        toastr.warning("Please Select a Valid From");
        $('#txtValidFrom').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtValidTill').val())) {
        toastr.warning("Please Select a Valid Till");
        $('#txtValidTill').focus();
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomType").val()) || $("#cboRoomType").val() === '0' || $("#cboRoomType").val() === "0") {
        toastr.warning("Please Select a Room Type");
        $('#cboRoomType').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtNumberofPersons').val())) {
        toastr.warning("Please Enter the Number of Persons");
        $('#txtNumberofPersons').focus();
        return;
    }
     if (IsStringNullorEmpty($('#txtBookingDiscountPercentage').val()) || $('#txtBookingDiscountPercentage').val() === "0" || $('#txtBookingDiscountPercentage').val() === '0') {
        toastr.warning("Please Enter the Booking Discount Percentage");
        $('#txtBookingDiscountPercentage').focus();
        return;
    }

    objmtype = {
        BusinessKey: $('#hdvBusinesskey').val(),
        MemberId: $('#hdvMemberShipId').val(),
        MembershipType: $('#cboMemberShipType').val(),
        CouponId: $('#txtCouponId').val(),
        NoOfYear: $('#txtNumberofYear').val(),
        ValidFrom: getDate($('#txtValidFrom')),
        ValidTill: getDate($('#txtValidTill')),
        RoomType: $('#cboRoomType').val(),
        BookingDiscountPercentage: $('#txtBookingDiscountPercentage').val(),
        NoOfPersons: $('#txtNumberofPersons').val(),
        ActiveStatus: $('#chkMembershipActiveStatus').parent().hasClass("is-checked")
    };

    $("#btnSaveMembershiptype").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/MembershipRegistration/InsertOrUpdateIntoMembershipType',
        type: 'POST',
        datatype: 'json',
        data: { objmtype },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveMembershiptype").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#modalMembershipType").modal('hide');
                fnGridMemberShipType();
                fnClearMemberShipTypeFields();

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveMembershiptype").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveMembershiptype").attr("disabled", false);
        }
    });
}
//Member Ship Type End

//Member Ship Donation Start

function fnGridAddDonationAmount() {
    if ($('#hdvMemberShipId').val() === null || $('#hdvMemberShipId').val() === '') {
        toastr.warning("Please add the Membership Header first");
        return;
    }
    else {
        fnClearMemberShipDonationFields();
        $("#modalMemberShipDonation").modal('show');
        $("#chkDTActiveStatus").parent().addClass("is-checked");
        $("#chkDTActiveStatus").prop('disabled', true);
        $('#modalMemberShipDonation').find('.modal-title').text(localization.AddMemberShipDonation);
        $("#btnSaveMembershipDonation").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveMembershipDonation").show();
        $("#btndeActiveMembershipDonation").hide();
        $("#txtSerialNo").val('');
        $("#txtDonationdate, txtDonationdate").prop("disabled", false);
        $("#btnSaveMembershipDonation").attr("disabled", false);
    }

}

function fnClearMemberShipDonationFields() {

    $('#txtSerialNo').val('');
    $('#txtDonationAmount').val('');
    $('#txtDonationdate').val('');
    $('#txtReceiptVoucherReference').val('');
    $('#txtComments').val('');
    $('#chkDTActiveStatus').parent().addClass("is-checked");
    $("#btnSaveMembershipDonation").html('<i class="far fa-save"></i> ' + localization.Save);

}

function fnGridDonationAmount() {
    $("#jqgDonationAmount").jqGrid('GridUnload');
    $("#jqgDonationAmount").jqGrid({
        url: getBaseURL() + '/MembershipRegistration/GetMembershipDonations?businesskey=' + $('#hdvBusinesskey').val() + '&memberId=' + $('#hdvMemberShipId').val(),
        datatype: 'json',
        mtype: 'post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.BusinessKey, localization.SerialNumber, localization.MemberId, localization.DonationDate, localization.DonationAmount, localization.ReceiptVoucherReference, localization.Comments, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 40, editable: true, align: 'left', hidden: true },
            { name: "SerialNumber", width: 40, editable: true, align: 'left', hidden: true },
            { name: "MemberId", width: 90, editable: true, align: 'left', hidden: false },
            {
                name: "DonationDate", editable: false, width: 120, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: "DonationAmount", width: 150, editable: true, align: 'right', hidden: false },
            { name: "ReceiptVoucherReference", width: 200, editable: true, align: 'left', hidden: false },
            { name: "Comments", width: 170, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: true, width: 125, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 105, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDonationAmount"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        pager: "#jqpDonationAmount",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        loadComplete: function (data) {
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen('jqgDonationAmount');

        },
    }).jqGrid('navGrid', '#jqpDonationAmount', {
        add: false, edit: false, search: false, del: false, refresh: false
        }).jqGrid('navButtonAdd', '#jqpDonationAmount', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custMTRefresh", position: "first", onClickButton: fnGridRefreshDonationAmount
        }).jqGrid('navButtonAdd', '#jqpDonationAmount', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgMTAdd', position: 'first', onClickButton: fnGridAddDonationAmount
    });
    $("#jqgDonationAmount").jqGrid('setGridWidth', $('.tab-content').width());
}

function fnEditDonationAmount(e, actiontype) {
    var rowid = $("#jqgDonationAmount").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDonationAmount').jqGrid('getRowData', rowid);

    $('#modalMemberShipDonation').modal('show');
    $('#txtSerialNo').val(rowData.SerialNumber);
    if (rowData.DonationDate !== null) {
        setDate($('#txtDonationdate'), fnGetDateFormat(rowData.DonationDate));
    }
    else {
        $('#txtDonationdate').val('');
    }
    $('#txtDonationAmount').val(rowData.DonationAmount);
    
    $('#txtReceiptVoucherReference').val(rowData.ReceiptVoucherReference);
    $('#txtComments').val(rowData.Comments);
    if (rowData.ActiveStatus == 'true') {
        $("#chkDTActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkDTActiveStatus").parent().removeClass("is-checked");
    }

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#modalMemberShipDonation').find('.modal-title').text(localization.UpdateMemberShipDonation);
        $("#btnSaveMembershipDonation").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveMembershipDonation").hide();
        $("#chkDTActiveStatus").prop('disabled', true);
        $("#btnSaveMembershipDonation").attr("disabled", false);
        $("#txtDonationdate, txtDonationdate").prop("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#modalMemberShipDonation').find('.modal-title').text(localization.ViewMemberShipDonation);
        $("#btnSaveMembershipDonation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveMembershipDonation").hide();
        $("#btndeActiveMembershiptype").hide();
        $("#fnDeActivateMembershipDonation").prop('disabled', true);
        $("#txtDonationdate, txtDonationdate").prop("disabled", true);
        $("#modalMemberShipDonation").on('hidden.bs.modal', function () {
            $("#fnSaveMembershipDonation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $('#modalMemberShipDonation').find('.modal-title').text("Activate/De Activate Member Ship Donation");
        $("#btnSaveMembershipDonation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveMembershipDonation").hide();
        $("#txtDonationdate, txtDonationdate").prop("disabled", true);
        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveMembershipDonation").html(localization.DActivate);
        }
        else {
            $("#btndeActiveMembershipDonation").html(localization.Activate);
        }

        $("#btndeActiveMembershipDonation").show();
        $("#chkDTActiveStatus").prop('disabled', true);
        $("#modalMemberShipDonation").on('hidden.bs.modal', function () {
            $("#fnSaveMembershipDonation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshDonationAmount() {
    $("#jqgDonationAmount").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnDeActivateMembershipDonation(e) {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkDTActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveMembershipDonation").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MembershipRegistration/ActiveOrDeActiveMembershipDonation?status=' + a_status + '&businesskey=' + $('#hdvBusinesskey').val() + '&memberId=' + $('#hdvMemberShipId').val() + '&serialno=' + $('#txtSerialNo').val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveMembershipDonation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#modalMemberShipDonation").modal('hide');
                fnClearMemberShipDonationFields();
                fnGridRefreshDonationAmount();
                $("#btndeActiveMembershipDonation").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveMembershipDonation").attr("disabled", false);
                $("#btndeActiveMembershipDonation").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveMembershipDonation").attr("disabled", false);
            $("#btndeActiveMembershipDonation").html('De Activate');
        }
    });
}

function fnSaveMembershipDonation() {
    if ($('#hdvMemberShipId').val() === null || $('#hdvMemberShipId').val() === '') {
        toastr.warning("Please add the Membership Header");
        return;
    }
    if ($('#hdvBusinesskey').val() === null || $('#hdvBusinesskey').val() === '') {
        toastr.warning("Please add the Membership Header");
        return;
    }
    if (IsStringNullorEmpty($('#txtDonationdate').val())) {
        toastr.warning("Please Select a Donation date");
        $('#txtValidTill').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDonationAmount').val()) || $('#txtDonationAmount').val() === "0" || $('#txtDonationAmount').val()==='0') {
        toastr.warning("Please Enter the Donation Amount");
        $('#txtDonationAmount').focus();
        return;
    }
  
    objdonation = {
        BusinessKey: $('#hdvBusinesskey').val(),
        MemberId: $('#hdvMemberShipId').val(),
        SerialNumber: $("#txtSerialNo").val() === '' ? 0 : $("#txtSerialNo").val(),
        DonationDate: getDate($('#txtDonationdate')),
        DonationAmount: $('#txtDonationAmount').val(),
        ReceiptVoucherReference: $('#txtReceiptVoucherReference').val(),
        Comments:  $('#txtComments').val(),
        ActiveStatus: $('#chkDTActiveStatus').parent().hasClass("is-checked")
    };

    $("#fnSaveMembershipDonation").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/MembershipRegistration/InsertOrUpdateIntoMembershipDonation',
        type: 'POST',
        datatype: 'json',
        data: { objdonation },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#fnSaveMembershipDonation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#modalMemberShipDonation").modal('hide');
                fnGridDonationAmount();
                calculateDonation();
                fnClearMemberShipDonationFields();
            }
            else {
                toastr.error(response.Message);
                $("#fnSaveMembershipDonation").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#fnSaveMembershipDonation").attr("disabled", false);
        }
    });
}

function calculateDonation()
{
   
    var first = parseFloat($("#txMemberShiptDonationAmount").val());
    var num = isNaN(first);
    if (num == true) {
        first = 0;
    }
    var second = parseFloat($("#txtDonationAmount").val());
    $("#txMemberShiptDonationAmount").val(+(first + second).toFixed(2));
}
//Member Ship Donation End