
var UserID;
var prevSelectedID;
var formID;
var BusinessKey;
var UserGroup;
var UserType;
var UserAuth;

$(document).ready(function () {
    fnGridLoadUserCreation();
    fnFillUserCreationValues();
    
    $('#txtSearch').keyup(function () {
        var searchString = $(this).val();
        $('#jstUserGroup').jstree('search', searchString);
    });

    $("#dvForm").hide();
    $("#divUserCreationForm").css('display', 'none');
    $("#divUserCreationGrid").show();
});

function fnGridLoadUserCreation() {
    if ($("#txtUserAuthetication").val() == 0)
        var URL = getBaseURL() + '/UserManagement/GetUserMaster';
    else
        var URL = getBaseURL() + '/UserManagement/GetUserMasterForUserAuthentication';

    $("#jqgUserCreation").jqGrid('GridUnload');
    $("#jqgUserCreation").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["User ID", localization.LoginID, localization.LoginDescription, localization.MobileNumber, localization.LastActivityDate, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 120, editable: true, align: 'left', hidden: true },
            { name: "LoginID", width: 120, editable: true, align: 'left', hidden: false },
            { name: "LoginDesc", width: 300, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MobileNumber", width: 100, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            {
                name: 'LastActivityDate', index: 'LastActivityDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'Edit', search: false, align: 'left', width: 170, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditUserCreation(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'

                }
            }
        ],
        pager: "#jqpUserCreation",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        rownumWidth:55,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        forceFit: true,
        width: 'auto',
        autowidth: true,
        //onSelectRow: function (rowid) {
        //    UserID = $("#jqgUserCreation").jqGrid('getCell', rowid, 'UserID');

        //},
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen('jqgUserCreation');
        },
        
        shrinkToFit: true,
        scrollOffset: 0
    }).
        jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpUserCreation', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
        }).
        jqGrid('navButtonAdd', '#jqpUserCreation', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshUserCreation
        });

        //jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpUserCreation', {
        //caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserCreation
        //}).jqGrid('navButtonAdd', '#jqpUserCreation', {
        //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
        //});
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if ($("#txtUserAuthetication").val() == 1)
        $('#jqgAdd').addClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnGridRefreshUserCreation() {
    $("#jqgUserCreation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridAddUserCreation() {
    $('#txtLoginId').val('');
    $('#txtLoginDescription').val('');
    $('#txtPassword').val('');
    $('#cboMobileNo').val("0");
    $('#cboMobileNo').selectpicker('refresh');
    $('#txtMobileNo').val('');
    $('#txtemailid').val('');
    $("#chkAllowMobileLogin").parent().removeClass("is-checked");

    $('#Photoimage').val('');
    $('#DSimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    $('#imgDSimageblah').removeAttr('src');

    fnGridUserSegment();
    $("#jqgUserBusinessSegment").trigger('reloadGrid');
    UserID = 0;
    
    //location.href = getBaseURL() + "/eSyaUser/UserManagement/_UserCreation?UserID=" + UserID;
    $("#divUserCreationForm").css('display', 'block');
    $("#divUserCreationGrid").hide();
    $("#txtPassword").attr('disabled', false);
    $("#txtLoginId").attr('disabled', false);
    $("#jqBusinessSegmentDiv").hide();
} 

function fnEditUserCreation(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgUserCreation').jqGrid('getRowData', rowid);
    UserID = rowData.UserID;
        
    $("#txtUserId").val(UserID);
    if (UserID !== '' && UserID !== undefined) {
        $("#divUserCreationForm").css('display', 'block');
        $("#divUserCreationGrid").hide();
        $("#txtPassword").attr('disabled', true);
        $("#txtLoginId").attr('disabled', true);
        $("#jqBusinessSegmentDiv").show();
        fnFillUserCreationValues();
        //location.href = getBaseURL() + "/eSyaUser/UserManagement/_UserCreation?UserID=" + UserID;
    }
}

function fnFillUserCreationValues() {
    if ($("#txtUserId").val() !== '' && $("#txtUserId").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/UserManagement/GetUserDetails?UserID=" + $("#txtUserId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $('#txtLoginId').val(result.LoginID);
                $('#txtLoginDescription').val(result.LoginDesc);
                $('#txtPassword').val(result.Password);
                $("#cboMobileNo").val(result.ISDCode);
                $("#cboMobileNo").selectpicker('refresh');
                $("#cboMobileNo").trigger("change");
                $('#txtMobileNo').val(result.MobileNumber);
                $('#txtemailid').val(result.eMailID);
                
                if (result.AllowMobileLogin === true) {
                    
                    $("#chkAllowMobileLogin").parent().addClass("is-checked");
                }
                else {
                    $("#chkAllowMobileLogin").parent().removeClass("is-checked");
                }

                if (result.userimage !== null && result.userimage !== "") {
                    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + result.userimage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }


                if (result.DSimage !== null && result.DSimage !== "") {
                    document.getElementById('imgDS').innerHTML = '<img id="imgDSimageblah" src=" ' + result.DSimage + '"  alt="User Signature"  /> <input class="fileInput" id="DSimage" type="file" name="file" onchange="readDSimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }
            }
        });
    }

    fnGridUserSegment();
}



function fnCancelUserMaster() {
    $("#jqgUserCreation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#divUserCreationForm").css('display', 'none');
    $("#divUserCreationGrid").show();
}

function fnClearUserMaster() {
    //$('#txtLoginId').val('');
    $('#txtLoginDescription').val('');
    $('#txtPassword').val('');
    $('#cboMobileNo').val("0");
    $('#cboMobileNo').selectpicker('refresh');
    $('#txtMobileNo').val('');
    $('#txtemailid').val('');
    $("#chkAllowMobileLogin").parent().removeClass("is-checked");

    $("#jqgUserBusinessSegment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#jqBusinessSegmentDiv").hide();
    $("#txtPassword").attr('disabled', false);

    $('#Photoimage').val('');
    $('#DSimage').val('');

    $('#imgPhotoimageblah').removeAttr('src');
    $('#imgDSimageblah').removeAttr('src');
}

function validateUserMaster() {

    var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    var EmailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if ($("#txtLoginId").val().trim().length <= 0) {
        toastr.warning("Please Enter Login Id");
        return false;
    }
    if ($("#txtLoginDescription").val().trim().length <= 0) {
        toastr.warning("Please Enter Login Description");
        return false;
    }
    if ($("#txtPassword").val().trim().length <= 0) {
        toastr.warning("Please Enter Password");
        return false;
    }
    if ($("#cboMobileNo").val() === "0" || $("#cboMobileNo").val() === "") {
        toastr.warning("Please Select ISD");
        $('#cboMobileNo').focus();
        return false;
    }
    if ($("#txtMobileNo").val().trim().length <= 0) {
        toastr.warning("Please Enter Mobile No");
        return false;
    }
    if ($("#txtemailid").val().trim().length <= 0) {
        toastr.warning("Please Enter Email Id");
        return false;
    }
    if (!EmailPattern.test($("#txtemailid").val())) {
        toastr.warning("Email ID is Not Valid");
        return false;
    }
    if (!PasswordPattern.test($("#txtPassword").val())) {
        toastr.warning("Password Should Contains : Minimum 8 character, Minimum 1 uppercase character/lowercase character required, Minimum 1 special symbol(@@#$%!&*) required, Minimum 1 digit required.");
        return false;
    }
}
 
function fnSaveUserMaster() {
    var file = '';
    var DSfile = '';
    //alert($("#txtUserId").val());
    if (validateUserMaster() === false) {
        return;
    }

    $("#btnSaveUserMaster").attr('disabled', true);

    //var file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    //var DSfile = ($('#imgDS img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgDS img').attr('src');// Data URI

    if ($('#imgPhoto img').attr('src') !== undefined) {

        file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    }
    if ($('#imgDS img').attr('src') !== undefined) {

        DSfile = ($('#imgDS img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgDS img').attr('src');// Data URI
    }

    var userId = $("#txtUserId").val();
    var userMaster;
    if (userId === null || userId === "") {
        $("#btnSaveUserMaster").attr('disabled', true);
        userMaster = {
            LoginID: $("#txtLoginId").val(),
            UserID: 0,
            LoginDesc: $("#txtLoginDescription").val(),
            Password: $("#txtPassword").val(),
            ISDCode: $("#cboMobileNo").val(),
            MobileNumber: $("#txtMobileNo").val(),
            AllowMobileLogin: $("#chkAllowMobileLogin").parent().hasClass("is-checked"),
            eMailID: $("#txtemailid").val(),
            Authenticated: $("#txtUserAuthetication").val()
        };
    }
    else {
        userMaster = {
            LoginID: $("#txtLoginId").val(),
            UserID: $("#txtUserId").val(),
            LoginDesc: $("#txtLoginDescription").val(),
            Password: $("#txtPassword").val(),
            ISDCode: $("#cboMobileNo").val(),
            MobileNumber: $("#txtMobileNo").val(),
            AllowMobileLogin: $("#chkAllowMobileLogin").parent().hasClass("is-checked"),
            eMailID: $("#txtemailid").val(),
            Authenticated: $("#txtUserAuthetication").val()
        };
    }

    $.ajax({
        async: false,
        url: getBaseURL() + '/UserManagement/InsertOrUpdateUserMaster',
        type: 'POST',
        data: {
            userMaster: userMaster,
            file: file,
            DSfile: DSfile
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveUserMaster").attr('disabled', true);
                $("#btnSaveUserMaster").hide();
                $("#txtUserId").val(response.ID);
                UserID = $("#txtUserId").val();
                fnGridUserSegment();
                $("#jqBusinessSegmentDiv").show();
                $("#txtPassword").attr('disabled', false);
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveUserMaster").attr('disabled', false);
            $("#btnSaveUserMaster").show();
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveUserMaster").attr("disabled", false);
        }
    }); 
}

function fnGridUserSegment() {

    var UserID = $("#txtUserId").val();
    if (UserID == null || UserID == "") {
        UserID = 0;
    }

    var URL = getBaseURL() + '/UserManagement/GetUserBusinessLocation?UserID=' + UserID;
    $("#jqgUserBusinessSegment").jqGrid('GridUnload');
    $("#jqgUserBusinessSegment").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["IU Status", "Business Key", localization.LocationDescription, "User Group Code", localization.UserGroup, "User Type Code", localization.UserType, localization.AllowMFY, localization.Active, localization.Actions],
        colModel: [
            { name: "IUStatus", width: 20, editable: false, align: 'left', hidden: true },
            { name: "BusinessKey", width: 20, editable: false, align: 'left', hidden: true },
            { name: "LocationDescription", width: 100, editable: true, align: 'left' },

            { name: "UserGroup", width: 70, editable: false, align: 'left', resizable: false, hidden: true },
            { name: "UserGroupDesc", width: 70, editable: false, align: 'left', resizable: false },
            { name: "UserType", editable: false, width: 60, align: 'center', resizable: false, hidden: true },
            { name: "UserTypeDesc", editable: false, width: 60, align: 'left', resizable: false },
            { name: "AllowMTFY", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'Actions', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditBusinessSegment(event)"><i class="fas fa-pencil-alt"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewBusinessSegment(event)"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="btnAddMenuLink" onclick="return fnAddMenuLink(event)"><i class="fa fa-bars"></i> ' + localization.MenuLink + ' </button>'

                }
            },
        ],
        rowNum: 10,
        loadonce: true,
        pager: "#jqpUserBusinessSegment",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        multiselect: false,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgUserBusinessSegment');
        },
        scrollOffset: 0
    }).jqGrid('navGrid', '#jqpUserBusinessSegment', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgUserBusinessSegment").jqGrid('inlineNav', '#jqpUserBusinessSegment',
        {
            edit: false,
            editicon: " fa fa-pen",
            edittext: "Edit",
            add: false,
            addicon: "fa fa-plus",
            addtext: "Add",
            save: true,
            savetext: "  Save ",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: "  Cancel ",
            editParams: {
                keys: false,
                oneditfunc: function (formid) {

                    $("#" + formid + "_LanguageCode").prop('disabled', true);
                    $("#" + formid + "_TableCode").prop('disabled', true);
                },
                url: null,

                extraparam: {

                },

                successfunc: function (result) {
                },
                aftersavefunc: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST"
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    url: null,
                    extraparam: {

                    },

                    oneditfunc: function (rowid) {

                    },
                    successfunc: function (result) {
                    }
                }
            }
        });
}

function fnGridRefreshUserBL() {
    $("#jqgUserBusinessSegment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditBusinessSegment(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgUserBusinessSegment').jqGrid('getRowData', rowid);
    $("#PopupBusinessSegment").modal('show');
    $("#PopupBusinessSegment").find('.modal-title').text(localization.EditBusinessSegment);

    $('#txtIUStatus').val(rowData.IUStatus);
    $('#txtBusinessKey').val(rowData.BusinessKey);
    $('#txtLocationDescription').val(rowData.LocationDescription);
    $("#txtLocationDescription").attr('disabled', true);
    $("#cboUserGroup").val(rowData.UserGroup);
    $("#cboUserGroup").selectpicker('refresh');
    $("#cboUserType").val(rowData.UserType);
    $("#cboUserType").selectpicker('refresh');

    if (rowData.AllowMTFY === "true") {
        $("#chkIsMultiSegmentApplicable").parent().addClass("is-checked");
    }
    else { $("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked"); }
    
    $("#chkActiveStatus").parent().addClass("is-checked");

    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupBusinessSegment").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
        $("#chkAllowMobileLogin").attr('disabled', false);
    });

    $("#btnSaveBusinessSegment").attr('disabled', false);

}

function fnViewBusinessSegment(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgUserBusinessSegment').jqGrid('getRowData', rowid);
    $("#PopupBusinessSegment").modal('show');
    $("#PopupBusinessSegment").find('.modal-title').text(localization.ViewBusinessSegment);

    $('#txtIUStatus').val(rowData.IUStatus);
    $('#txtBusinessKey').val(rowData.BusinessKey);
    $('#txtLocationDescription').val(rowData.LocationDescription);
    $("#cboUserGroup").val(rowData.UserGroup);
    $("#cboUserGroup").selectpicker('refresh');
    $("#cboUserType").val(rowData.UserType);
    $("#cboUserType").selectpicker('refresh');

    if (rowData.AllowMTFY === "true") {
        $("#chkIsMultiSegmentApplicable").parent().addClass("is-checked");
    }
    else { $("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked"); }

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveBusinessSegment").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[type=checkbox]").attr('disabled', true);
    $("#PopupBusinessSegment").on('hidden.bs.modal', function () {
        $("#btnSaveBusinessSegment").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    });
}

function validateBusinessLocation() {
    if ($("#txtUserId").val().trim().length <= 0) {
        toastr.warning("Please Select Login Id");
        return false;
    }
    if ($("#txtBusinessKey").val().trim().length <= 0) {
        toastr.warning("Please Select Business Location");
        return false;
    }
    if ($("#txtLocationDescription").val().trim().length <= 0) {
        toastr.warning("Please Select Business Location");
        return false;
    }
    if ($("#cboUserGroup").val() === "0" || $("#cboUserGroup").val() === "") {
        toastr.warning("Please Select User Group");
        return false;
    }
    if ($("#cboUserType").val() === "0" || $("#cboUserType").val() === "") {
        toastr.warning("Please Select User Type");
        return false;
    }
}

function fnSaveUserBusinessLocation() {

    if (validateBusinessLocation() === false) {
        return;
    }

    var userBL;
    var IsMltSeg = $("#chkIsMultiSegmentApplicable").parent().hasClass("is-checked");

    $("#btnSaveBusinessSegment").attr('disabled', true);

    userBL = {
        IUStatus: $("#txtIUStatus").val(),
        UserID: $("#txtUserId").val(),
        BusinessKey: $("#txtBusinessKey").val(),
        UserGroup: $("#cboUserGroup").val(),
        UserType: $("#cboUserType").val(),
        AllowMTFY: IsMltSeg,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
   

    $.ajax({
        async: false,
        url: getBaseURL() + '/UserManagement/InsertOrUpdateUserBL',
        type: 'POST',
        data: {
            UserBusinessLink: userBL
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBusinessSegment").attr('disabled', true);
                $("#btnSaveBusinessSegment").hide();
                $("#PopupBusinessSegment").modal('hide');
                fnGridRefreshUserCreation();
                $("#jqBusinessSegmentDiv").show(200);
                fnGridUserSegment();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveBusinessSegment").attr('disabled', false);
            $("#btnSaveBusinessSegment").show();
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBusinessSegment").attr("disabled", false);
        }
    });
}

// User Menu and User Action

$("#PopupMenuLink").on("hidden.bs.modal", function () {
    $("#dvForm").hide();
})

function fnGridRefreshFormAction() {
    $("#jqgFormAction").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddMenuLink(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgUserBusinessSegment').jqGrid('getRowData', rowid);

    UserGroup = rowData.UserGroup;
    UserType = rowData.UserType;
    BusinessKey = rowData.BusinessKey;
    UserID = $("#txtUserId").val();

    if (BusinessKey <= 0) {
        toastr.warning("Please Link with Business Location First");
        return;
    }
    if (UserGroup <= 0) {
        toastr.warning("Please Link User Group from Edit Option");
        return;
    }
    if (UserType <= 0) {
        toastr.warning("Please Link User Type from Edit Option");
        return;
    }

    $("#PopupMenuLink").modal('show');
    $("#PopupMenuLinkbody").css({ 'height': $(document).height() - 142 , 'overflow-x':'hidden' });
    $("#jqgFormAction").css({ 'max-height': $(document).height() - 180, 'overflow-y': 'auto' });

    fnGridRefreshFormAction();
    fnFormaction();

    $("#PopupMenuLink").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
        $("#chkAllowMobileLogin").attr('disabled', false);
    });
    $("#PopupMenuLinkbody").css({
        'height': $(window).innerHeight() - 110,
        'overflow-y': 'auto'
    });
}

$(window).on('resize', function () {
    $("#PopupMenuLinkbody").css({ 'height': $(document).height() - 148, 'overflow-x': 'hidden' });
})

function fnFormaction() {
    $('#btnSaveFormAction').show();
    $.ajax({
        url: getBaseURL() + '/UserManagement/GetMenulist?UserGroup=' + UserGroup + '&UserType=' + UserType + '&UserID=' + UserID + '&BusinessKey=' + BusinessKey,
        type: 'POST',
        datatype: 'json',
        success: function (result) {
            
            fnGetUserMenuList_Success(result, BusinessKey);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
}

function fnGetUserMenuList_Success(dataArray, BusinessKey) {
    $('#jstUserGroup').jstree('destroy');
    $("#jstUserGroup").jstree({
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
        "plugins": ["search"],
        
        "search": {
            "case_sensitive": false,
            "show_only_matches": true,
            "show_only_matches_children": true
        }
        
    });
    
    $("#jstUserGroup").on('loaded.jstree', function () {
        $("#jstUserGroup").jstree('open_all');
        $("#jstUserGroup").jstree()._open_to(prevSelectedID);
        $('#jstUserGroup').jstree().select_node(prevSelectedID);
        
    });

    $('#jstUserGroup').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            //if (prevSelectedID != data.node.id) {
            prevSelectedID = data.node.id;
            
            if (data.node.id == "0") {
                fnGridRefreshFormAction();
                $("#dvForm").hide();
            }
            else {
                if (data.node.parent == "#") {
                    fnGridRefreshFormAction();
                    $("#dvForm").hide();
                }
                else if (data.node.id.startsWith("FM")) {
                    $("#dvForm").show();

                    formID = 0;
                    formID = data.node.id.substring(2).split(".")[1];
                    $('#UserActionTitle').text(data.node.text);
                    $('.lblFormName').text(data.node.text);

                    if (data.node.id.substring(2).split(".")[2] == "1")
                        $("#chkFormName").parent().addClass("is-checked");
                    else
                        $("#chkFormName").parent().removeClass("is-checked");

                    $("input[type=checkbox]").attr('disabled', false);

                    $("#jqgFormAction").GridUnload();

                    fnUserActionGrid(BusinessKey, formID);
                }
                else {
                    fnGridRefreshFormAction();
                    $("#dvForm").hide();
                }
            }
        }
    });

    $('#jstUserGroup').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstUserGroup').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize();
};

function fnUserActionGrid(BusinessKey, formID) {
  
    var UserID = $("#txtUserId").val();
    $("#jqgFormAction").jqGrid('GridUnload');
    $("#jqgFormAction").jqGrid({
        url: getBaseURL() + '/UserManagement/GetUserFormActionLink?UserID=' + UserID + '&BusinessKey=' + BusinessKey + '&MenuKey=' + formID,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Action ID", localization.Action, localization.Active],
        colModel: [
            { name: 'ActionID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ActionDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false},
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", formatoptions: { disabled: false } }
        ],
        caption: "",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgFormAction');
        },
    });
}

function fnSaveFormAction() {
    var IsForChecked = $("#chkFormName").parent().hasClass("is-checked");

    var uml = {
        UserID: $("#txtUserId").val(),
        BusinessKey: BusinessKey,
        MenuKey: formID,
        ActiveStatus: IsForChecked
    };

    var formAction = [];
    var jqgFormAction = jQuery("#jqgFormAction").jqGrid('getRowData');
    for (var i = 0; i < jqgFormAction.length; ++i) {
        if (parseFloat(jqgFormAction[i]["ActionID"]) > 0) {
            formAction.push({
                ActionID: jqgFormAction[i]["ActionID"],
                Active: jqgFormAction[i]["ActiveStatus"]
            });
        }
    }

    uml.l_formAction = formAction;
    
    $("#btnSaveFormAction").attr('disabled', true);
    
    $.ajax({
        url: getBaseURL() + '/UserManagement/InsertIntoUserMenuAction',
            type: 'POST',
            datatype: 'json',
            data: {
                UserMenuLink: uml
            },
            async: false,
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveFormAction").attr('disabled', true);
                fnReloadTreeAfterSave();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveFormAction").attr('disabled', false);
            $("#btnSaveFormAction").show();
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFormAction").attr("disabled", false);
        }
    });
}

function fnReloadTreeAfterSave() {
   
    UserID = $("#txtUserId").val();

    if (BusinessKey <= 0) {
        toastr.warning("Please Link with Business Location First");
        return;
    }
    if (UserGroup <= 0) {
        toastr.warning("Please Link User Group from Edit Option");
        return;
    }
    if (UserType <= 0) {
        toastr.warning("Please Link User Type from Edit Option");
        return;
    }
    
    fnGridRefreshFormAction();
    fnFormaction();
}

function fnCancelFormAction() {
    $("#dvForm").hide();
}
function fnTreeSize() {
    $('#jstUserGroup').css({
        'height': $(window).innerHeight() - 215,
        'overflow': 'auto'
    });
  
}