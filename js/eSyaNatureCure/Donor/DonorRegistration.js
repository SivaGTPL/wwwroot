$(function () {

    BindStates();

    fnGridLoadDonorRegistration();

    //$("#txtSearchBox").button().click(function () {
    //    var text = $("#txtSearchBox").val();
    //    var postdata = grid.jqGrid('getGridParam', 'postData');
    //    // build up the filter
    //    // ['equal','not equal', 'less', 'less or equal','greater','greater or equal', 'begins with','does not begin with','is in','is not in','ends with','does not end with','contains','does not contain']
    //    // ['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc']
    //    var myfilter = { groupOp: "OR", rules: [] };
    //    myfilter.rules.push({ field: "ItemNum", op: "cn", data: text });
    //    myfilter.rules.push({ field: "BrandName", op: "cn", data: text });
    //    myfilter.rules.push({ field: "ProducName", op: "cn", data: text });

    //    $.extend(postdata, { filters: JSON.stringify(myfilter) });
    //    grid.jqGrid('setGridParam', { search: text.length > 2, postData: postdata });
    //    grid.trigger("reloadGrid", [{ page: 1 }]);
    //});


    $("#txtSearchBox").on('change keyup paste', function () {
        //  Fetch the text from our <input> control
        var searchString = $("#txtSearchBox").val();

        //  Prepare to pass a new search filter to our jqGrid
        //var f = { groupOp: "AND", rules: [] };

        var f = { groupOp: "OR", rules: [] };

        f.rules.push({ field: "DonorFirstName", op: "cn", data: searchString });
        f.rules.push({ field: "DonorRegistrationNo", op: "cn", data: searchString });
        f.rules.push({ field: "RegisteredMobileNumber", op: "cn", data: searchString });

        $("#jqgDonorRegistration")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgDonorRegistration")[0].p.postData, { filters: JSON.stringify(f) });
        $("#jqgDonorRegistration").trigger("reloadGrid", [{ page: 1 }]);
    });


    $.contextMenu({
        selector: "#btnDonorRegistration",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDonorRegistration(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDonorRegistration(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDonorRegistration(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})
function fnBusinessLocation_onChange()
{
    fnGridLoadDonorRegistration();
}

var actiontype = "";
var _isInsert = true;

function fnGridLoadDonorRegistration() {
    $("#jqgDonorRegistration").GridUnload();

    $("#jqgDonorRegistration").jqGrid({
        url: getBaseURL() + '/Donor/GetDonorsListbyBusinesskey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key",localization.DonorID, localization.DonorRegistrationNo, localization.DonorType, localization.DonorFirstName, localization.DonorMiddleName, localization.DonorLastName,
            localization.AgeYY, localization.Gender, localization.ISDCode, localization.RegisteredMobileNumber, localization.EmailID, localization.Password, localization.Address, localization.State, localization.City,
            localization.ZIPcode, localization.Area, localization.RoomType, localization.NoOfPersons, localization.ValidFrom, localization.ValidTill, localization.DiscountPercentage,
            localization.DonatedSoFar, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DonorId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DonorRegistrationNo", width: 50, editable: true, align: 'left', hidden: false },
            { name: "DonorType", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DonorFirstName", width: 70, editable: true, align: 'left', hidden: false },
            { name: "DonorMiddleName", width: 70, editable: true, align: 'left', hidden: true },
            { name: "DonorLastName", width: 70, editable: true, align: 'left', hidden: false },
            { name: "AgeYy", width: 50, editable: true, align: 'left', hidden: false },
            { name: "Gender", editable: true, align: 'left', width: 50, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "M: Male;F: Female;B: Both;" } },
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "RegisteredMobileNumber", width: 70, editable: true, align: 'left', hidden: false },
            { name: "EmailId", width: 50, editable: true, align: 'left', hidden: false },
            { name: "Password", width: 50, editable: true, align: 'left', hidden: true },
            { name: "Address", width: 50, editable: true, align: 'left', hidden: true },
            { name: "StateCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "CityCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "Pincode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "AreaCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "RoomType", width: 50, editable: true, align: 'left', hidden: true },
            { name: "NoOfPersons", width: 50, editable: true, align: 'left', hidden: true },
            {
                name: 'ValidFrom', index: 'ValidFrom', width: 80, sorttype: "date",hidden: true, formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'ValidTill', index: 'ValidTill', width: 80, sorttype: "date", hidden: true, formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "Discount", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DonatedSoFar", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDonorRegistration"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        ignoreCase: true,
        pager: "#jqpDonorRegistration",
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
        forceFit: true,
        caption: 'Donor Registration',
        loadComplete: function () {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgDonorRegistration");
        },
    }).jqGrid('navGrid', '#jqpDonorRegistration', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDonorRegistration', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDonorRegistration
    }).jqGrid('navButtonAdd', '#jqpDonorRegistration', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDonorRegistration
    });

}

function fnGridRefreshDonorRegistration() {
    $("#jqgDonorRegistration").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

}

function fnAddDonorRegistration() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please Select a Location");
        return;
    }
    else
    {

        _isInsert = true;
        fnClearDonorRegistrationFields();

        $("#btnSaveDonorRegistration").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);

        $("#PopupDonorRegistration").modal('show');
        $("#section-grid").css('display', 'none');
        $("#section-businesskey").css('display', 'none');
        $("#section-donoregistration").css('display', 'block');

        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDonorRegistration").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveDonorRegistration").show();
        $("#btndeActiveDonorRegistration").hide();
        $('#txtDonorId').val('');
        $("#txtNoOfPersons").attr('readonly', true);
        $("#txtDiscount").attr('readonly', true);
    }
}

function fnEditDonorRegistration(e, actiontype) {

    var Gprowid = $("#jqgDonorRegistration").jqGrid('getGridParam', 'selrow');
    var GprowData = $('#jqgDonorRegistration').jqGrid('getRowData', Gprowid);

    $("#txtDonorRegistrationNo").val(GprowData.DonorRegistrationNo);
    $("#txtDonorId").val(GprowData.DonorId);
    $("#cboBusinessLocation").val(GprowData.BusinessKey).selectpicker('refresh');
    $("#cboDonorType").val(GprowData.DonorType).selectpicker('refresh');
    $("#txtDonorFirstName").val(GprowData.DonorFirstName);
    $("#txtDonorMiddleName").val(GprowData.DonorMiddleName);
    $("#txtDonorLastName").val(GprowData.DonorLastName);
    $("#txtAgeYY").val(GprowData.AgeYy);
    $("#cboGender").val(GprowData.Gender).selectpicker('refresh');
    $("#cboDonorMobileNo").val(GprowData.Isdcode).selectpicker('refresh');
    $("#txtDonorMobileNo").val(GprowData.RegisteredMobileNumber);
    $("#txtEmailID").val(GprowData.EmailId);
    //$("#txtpassword").val(GprowData.Password);
    $("#txtGAddress").val(GprowData.Address);
    BindStates();
    $("#cboGState").val(GprowData.StateCode).selectpicker('refresh');
    BindCities();
    $("#cboGCity").val(GprowData.CityCode).selectpicker('refresh');
    BindAreas();
    $("#cboGArea").val(GprowData.AreaCode).selectpicker('refresh');
    $("#txtGPincode").val(GprowData.Pincode);
    BindRoomTypes();
    $('#cboRoomType').val(GprowData.RoomType).selectpicker('refresh');
    $('#txtNoOfPersons').val(GprowData.NoOfPersons);

    if (GprowData.ValidFrom !== null) {
        setDate($('#dtValidFrom'), fnGetDateFormat(GprowData.ValidFrom));
    }
    else {
        $('#dtValidFrom').val('');
    }
    if (GprowData.ValidTill !== null) {
        setDate($('#dtValidTill'), fnGetDateFormat(GprowData.ValidTill));
    }
    else {
        $('#dtValidTill').val('');
    }
    $('#txtDiscount').val(GprowData.Discount);
    $('#txtDonatedSoFar').val(GprowData.DonatedSoFar);
    if (GprowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    $("#PopupDonorRegistration").modal('show');
    $("#section-grid").css('display', 'none');
    $("#section-businesskey").css('display', 'none');
    $("#section-donoregistration").css('display', 'block');

   
   
    $("#btnSaveDonorRegistration").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $("#btnSaveDonorRegistration").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);

        $("#btnSaveDonorRegistration").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveDonorRegistration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDonorRegistration").attr("disabled", false);

        $("#txtNoOfPersons").attr('readonly', true);
        $("#txtDiscount").attr('readonly', true);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $("#btnSaveDonorRegistration").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDonorRegistration").hide();
        $("#btndeActiveDonorRegistration").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDonorRegistration").on('hidden.bs.modal', function () {
            $("#btnSaveDonorRegistration").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $("#btnSaveDonorRegistration").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDonorRegistration").hide();

        if (GprowData.ActiveStatus == 'true') {
          
            $("#btndeActiveDonorRegistration").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDonorRegistration").html(localization.Activate);
        }

        $("#btndeActiveDonorRegistration").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDonorRegistration").on('hidden.bs.modal', function () {
            $("#btnSaveDonorRegistration").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnClearDonorRegistrationFields() {

    $("#section-grid").css('display', 'block');
    $("#section-businesskey").css('display', 'block'); 
    $("#section-donoregistration").css('display', 'none');

    $("#txtDonorId").val('');
    $("#txtDonorRegistrationNo").val('');
    $('#cboDonorType').val("0").selectpicker('refresh');
    $('#txtDonorFirstName').val('');
    $('#txtDonorMiddleName').val('');
    $('#txtDonorLastName').val('');
    $('#txtAgeYY').val('');
    $('#cboGender').val("0").selectpicker('refresh');
    $('#cboDonorMobileNo').val('0').selectpicker('refresh');
    $('#txtDonorMobileNo').val('');
    $('#txtEmailID').val('');
    //$('#txtpassword').val('');
    $('#txtGAddress').val('');
    $("#txtGAddress").val('');
    $("#txtGPincode").val('');
    $('#cboGState').val('0').selectpicker('refresh');
    $('#cboGCity').val('0').selectpicker('refresh');
    $('#cboGArea').val('0').selectpicker('refresh');
    $('#cboRoomType').val('0').selectpicker('refresh');
    $("#txtNoOfPersons").val(''); 
    $("#dtValidFrom").val('');  
    $("#dtValidTill").val('');  
    $('#txtDiscount').val('');
    $("#txtDonatedSoFar").val('');  
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveDonorRegistration").attr("disabled", false);
    $("#btndeActiveDonorRegistration").attr("disabled", false);
}


$(document).ready(function () {

    $('#txtGPincode').blur(function () {

        if (!IsStringNullorEmpty($("#txtGPincode").val())) {
            $.ajax({
                url: getBaseURL() + '/Donor/GetAreaDetailsbyPincode?isdCode=' + _cnfISDCode + '&pincode=' + $("#txtGPincode").val(),
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    if (result != null) {
                        BindStates();
                        $('#cboGState').val(result.StateCode);
                        $('#cboGState').selectpicker('refresh');
                        BindCities();
                        $('#cboGCity').val(result.CityCode);
                        $('#cboGCity').selectpicker('refresh');
                        BindAreas();
                        if ($('#cboGArea').children('option').length > 2)
                            $('#cboGArea').val("0");
                        else
                            $('#cboGArea').val(result.AreaCode);
                        $('#cboGArea').selectpicker('refresh');
                    }

                    else {
                        $('#cboGState').selectpicker('refresh');
                        $('#CityGCode').selectpicker('refresh');
                        $('#cboGArea').selectpicker('refresh');
                    }
                },
                error: function (result) {
                    //Your error message
                    $('#cboGState').selectpicker('refresh');
                    $('#CityGCode').selectpicker('refresh');
                    $('#cboGArea').selectpicker('refresh');
                },
                async: false,
                processData: false
            });
        }
        else {
            var cityCode = $('#cboGCity').val();
            BindCities();
            $('#cboGCity').val(cityCode);
            $('#cboGCity').selectpicker('refresh');
            BindAreas();
        }

    });

});

function fncboGState_change() {
    BindCities();
    BindAreas();
}

function fncboGCity_change() {
    BindAreas();
}

function BindStates() {

    $("#cboGState").empty();

    $.ajax({
        url: getBaseURL() + '/Donor/GetStateList?isdCode=' + _cnfISDCode,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboGState").empty();
            $("#cboGState").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboGState").append($("<option></option>").val(response[i]["PlaceId"]).html(response[i]["PlaceName"]));
            }
            $('#cboGState').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


}

function BindCities() {

    $("#cboGCity").empty();
    $.ajax({
        url: getBaseURL() + '/Donor/GetCityList?isdCode=' + _cnfISDCode + '&stateCode=' + $("#cboGState").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboGCity").empty();

            $("#cboGCity").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboGCity").append($("<option></option>").val(response[i]["PlaceId"]).html(response[i]["PlaceName"]));
            }
            $('#cboGCity').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


}

function BindAreas() {

    $("#cboGArea").empty();
    $.ajax({

        url: getBaseURL() + '/Donor/GetAreaList?isdCode=' + _cnfISDCode + "&stateCode=" + $('#cboGState').val()
            + "&cityCode=" + $('#cboGCity').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {

            //refresh each time
            $("#cboGArea").empty();
            $("#cboGArea").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboGArea").append($("<option data-pincode=" + response[i].Pincode + "></option>").val(response[i]["AreaCode"]).html(response[i]["AreaName"]));
            }
            $('#cboGArea').selectpicker('refresh');
        },

        async: false,
        processData: false
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnSaveDonorRegistration() {

    if (IsStringNullorEmpty($("#txtDonorRegistrationNo").val())) {
        toastr.warning("Please Enter the Donor Registration Number");
        return;
    }
    if (IsStringNullorEmpty($("#cboDonorType").val()) || $("#cboDonorType").val() === '0' || $("#cboDonorType").val() === "0") {
        toastr.warning("Please Select a Donor Type");
        return;
    }
    if (IsStringNullorEmpty($("#txtDonorFirstName").val())) {
        toastr.warning("Please Enter the First Name");
        return;
    }
    if (IsStringNullorEmpty($("#txtDonorLastName").val())) {
        toastr.warning("Please Enter the Last Name");
        return;
    }
    if (IsStringNullorEmpty($("#txtAgeYY").val())) {
        toastr.warning("Please Enter the Age");
        return;
    }
    if (IsStringNullorEmpty($("#cboGender").val()) || $("#cboGender").val() === '0' || $("#cboGender").val() === "0") {
        toastr.warning("Please Select a Gender");
        return;
    }

    if (IsStringNullorEmpty($("#cboDonorMobileNo").val()) || $("#cboDonorMobileNo").val() <= 0 || $("#cboDonorMobileNo").val() === '0' || $("#cboDonorMobileNo").val() === "0") {
        toastr.warning("Please Select a ISD Code");
        return;
    }
    if ($("#txtDonorMobileNo").inputmask("isComplete") === false) {
        toastr.warning("Please Enter the Mobile Number.");
        return;
    }
    if (IsStringNullorEmpty($("#txtEmailID").val())) {
        toastr.warning("Please Enter the Email ID");
        return;
    }
    if (IsStringNullorEmpty($('#txtEmailID').val())) {
        if (!IsValidateEmail($('#txtEmailID').val())) {
            toastr.warning("Please Enter the Valid Email ID");
            return;
        }
    }
    //if (IsStringNullorEmpty($("#txtpassword").val())) {
    //    toastr.warning("Please Enter password");
    //    return;
    //}
    if (IsStringNullorEmpty($("#txtGAddress").val())) {
        toastr.warning("Please Enter the Address");
        return;
    }
    if (IsStringNullorEmpty($("#cboGState").val()) || $("#cboGState").val() === '0' || $("#cboGState").val() === "0") {
        toastr.warning("Please Select a State");
        return;
    }
    if (IsStringNullorEmpty($("#cboGCity").val()) || $("#cboGCity").val() === '0' || $("#cboGCity").val() === "0") {
        toastr.warning("Please Select a City");
        return;
    }
    if (IsStringNullorEmpty($("#cboGArea").val()) || $("#cboGArea").val() === '0' || $("#cboGArea").val() === "0") {
        toastr.warning("Please Select a Area");
        return;
    }
    if (IsStringNullorEmpty($("#cboRoomType").val()) || $("#cboRoomType").val() === '0' || $("#cboRoomType").val() === "0") {
        toastr.warning("Please Select a Room Type");
        return;
    }
    if (IsStringNullorEmpty($("#txtNoOfPersons").val())) {
        toastr.warning("Please Enter the Number of Persons");
        return;
    }
    if (IsStringNullorEmpty($("#dtValidFrom").val())) {
        toastr.warning("Please Select a Valid From");
        return;
    }
    if (IsStringNullorEmpty($("#dtValidTill").val())) {
        toastr.warning("Please Select a Valid Till");
        return;
    }
    if (IsStringNullorEmpty($("#txtDiscount").val())) {
        toastr.warning("Please Enter the Discount");
        return;
    }
    if (IsStringNullorEmpty($("#txtDonatedSoFar").val())) {
        toastr.warning("Please Enter the Donated So Far");
        return;
    }
    objrej = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DonorId: $("#txtDonorId").val() === '' ? 0 : $("#txtDonorId").val(),
        DonorRegistrationNo: $("#txtDonorRegistrationNo").val(),
        DonorType: $("#cboDonorType").val(),
        DonorFirstName: $('#txtDonorFirstName').val(),
        DonorMiddleName: $('#txtDonorMiddleName').val(),
        DonorLastName: $('#txtDonorLastName').val(),
        AgeYy: $('#txtAgeYY').val(),
        Gender: $('#cboGender').val(),
        Isdcode: $('#cboDonorMobileNo').val(),
        RegisteredMobileNumber: $('#txtDonorMobileNo').val(),
        EmailId: $('#txtEmailID').val(),
        //Password: $('#txtpassword').val(),
        Address: $('#txtGAddress').val(),
        StateCode: $('#cboGState').val(),
        CityCode: $('#cboGCity').val(),
        Pincode: $('#txtGPincode').val(),
        AreaCode: $('#cboGArea').val(),
        RoomType: $('#cboRoomType').val(),
        NoOfPersons: $('#txtNoOfPersons').val(),
        ValidFrom: getDate($('#dtValidFrom')),
        ValidTill: getDate($('#dtValidTill')),
        Discount: $('#txtDiscount').val(),
        DonatedSoFar: $('#txtDonatedSoFar').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveACtivities").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Donor/InsertOrUpdateIntoDonorRegistration',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objrej },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveDonorRegistration").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClearDonorRegistrationFields();
                fnGridRefreshDonorRegistration();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDonorRegistration").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDonorRegistration").attr("disabled", false);
        }
    });
}

function fnDeleteDonorRegistration() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveDonorRegistration").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Donor/ActiveOrDeActiveDonorRegistration?status=' + a_status + '&businesskey=' + $("#cboBusinessLocation").val() + '&donorId=' + $("#txtDonorId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDonorRegistration").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClearDonorRegistrationFields();
                fnGridRefreshDonorRegistration();
                $("#btndeActiveDonorRegistration").attr("disabled", false);
                $("#btndeActiveDonorRegistration").html('De Activate');
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDonorRegistration").attr("disabled", false);
                $("#btndeActiveDonorRegistration").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDonorRegistration").attr("disabled", false);
            $("#btndeActiveDonorRegistration").html('De Activate');
        }
    });
}

function BindRoomTypes() {

    $("#cboRoomType").empty();
    $('#txtDiscount').val('0');
    $('#txtNoOfPersons').val('0');
    $.ajax({
        url: getBaseURL() + '/Donor/GetRoomTypebyDonorId?donortype=' + $("#cboDonorType").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboRoomType").empty();

                $("#cboRoomType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboRoomType").append($("<option></option>").val(response[i]["RoomType"]).html(response[i]["RoomTypeDesc"]));
                }
                $('#cboRoomType').selectpicker('refresh');
            }
            else {
                $("#cboRoomType").empty();
                $("#cboRoomType").append($("<option value='0'> Select </option>"));
                $('#cboRoomType').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function GetDiscountbyDonorId() {

    $.ajax({
        url: getBaseURL() + '/Donor/GetDiscountbyDonorId?donortype=' + $("#cboDonorType").val() + '&roomType=' + $("#cboRoomType").val(),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                toastr.error('Error: ' + xhr.statusText);
            },
            success: function (response) {
                if (response != null) {
                    $('#txtDiscount').val(response.DiscountPercentage);
                    $('#txtNoOfPersons').val(response.NoOfPersons);
                } else
                {
                    $('#txtDiscount').val('0');
                    $('#txtNoOfPersons').val('0');
                }
            },
            async: false,
            processData: false
        });

    
}