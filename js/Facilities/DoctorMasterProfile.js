﻿var _formEdit = true;
var _formDelete = true;

$(document).ready(function () {

    fnGridLoadDoctorProfile("0");
   
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var doctorNamePrefix = $(this).text();
        if (doctorNamePrefix === "All")
            doctorNamePrefix = "";
        fnGridLoadDoctorProfile(doctorNamePrefix);
        $(this).addClass('active');
    });
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorProfile');
        }
    }); 
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctorProfile",
        trigger: 'left',
        // define the elements of the menu 
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctorProfile(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewDoctorProfile(event) } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateDoctorProfile(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + 'Edit' + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + 'View' + " </span>");
    //$(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadDoctorProfile(doctorPrefix) {
    $("#jqgDoctorProfile").jqGrid('GridUnload');
    $("#jqgDoctorProfile").jqGrid({
        url: getBaseURL() + '/Doctors/GetDoctorMasterList?doctorNamePrefix=' + doctorPrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: ["Doctor Id", localization.DoctorShortName, localization.DoctorName, "Doctor Registration No", localization.Gender, localization.DoctorClassCode, localization.DoctorClass, localization.DoctorCategoryCode, localization.DoctorCategory, "Payout Type Desc", "SeniorityLevel", "Seniority Level Desc",  "EmailId", "Traiff From", "Isdcode", "Mobile Number", "Password", localization.Active, localization.Actions],
        colModel: [
            { name: "DoctorId", width: 40, editable: true, align: 'left', hidden: true },
            { name: "DoctorShortName", width: 35, editable: true, align: 'left', hidden: true },
            { name: "DoctorName", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorRegnNo", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Gender", width: 25, editable: true, align: 'left', hidden: false, editoptions: { value: "M: Male;F: Female" } },
            { name: "DoctorClass", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorClassDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorCategory", width: 60, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorCategoryDesc", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            //{ name: "PayoutType", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PayoutTypeDesc", width: 35, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "SeniorityLevel", width: 35, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "SeniorityLevelDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            //{ name: "AllowConsultation", width: 40, editable: true, align: 'left', hidden: true },
            //{ name: "AllowSms", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "EmailId", width: 40, editable: true, align: 'left', hidden: true },
            { name: "TraiffFrom", width: 10, editable: true, align: 'left', hidden: true, editoptions: { value: "N: None;R: Service Rate;S: Specialty;D: Doctor" } },
            { name: "Isdcode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "MobileNumber", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Password", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 20, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorProfile"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        pager: "#jqpDoctorProfile",
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
            SetDoctorProfileGridControlByAction();
            fnJqgridSmallScreen('jqgDoctorProfile');
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

    }).jqGrid('navGrid', '#jqpDoctorProfile', { add: false, edit: false, search: true, del: false, refresh: false }, {}, {}, {}, {
        closeOnEscape: true,
        caption: "Search...",
        multipleSearch: true,
        Find: "Find",
        Reset: "Reset",
        odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }]
        }).jqGrid('navButtonAdd', '#jqpDoctorProfile', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDoctorProfile
        }).jqGrid('navButtonAdd', '#jqpDoctorProfile', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgDMAdd', position: 'first', onClickButton: fnGridAddDoctorProfile
    });

    fnAddGridSerialNoHeading();
    fnProcessLoading(false);
}

function fnGridAddDoctorProfile() {

    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnClearDoctor").show();
    $("#divGrid").hide();
    $('#divDoctorProfileForm').css('display', 'block');
    _formEdit = true;
    _formDelete = true;
     fnClearFields();


    //$('#Photoimage').val('');
    //$('#imgPhotoimageblah').removeAttr('src');

    //fnClearFields();
    ////$('#PopupDoctorMaster').find('.modal-title').text(localization.AddDoctor);
    //$("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Save);
    //$("#btnClearDoctor").show();
    //$("#divGrid").hide();
    //$('#divDoctorProfileForm').css('display', 'block');

    //$('#Photoimage').val('');
    //$('#imgPhotoimageblah').removeAttr('src');

    fnGridDoctorProfileBusinessLink();
    fnLoadDoctorParameters();
    //fnGetDoctorAddressbyDoctorId();
    //fnBindDoctorBusinessLinkList();
    //fnGetDoctorAddressbyDoctorId();

    //fnGridDoctorSpecialtyLink();
    //fnLoadDoctorSchedulerGrid();
    //fnLoadDoctorScheduleChangeGrid();
    //fnLoadDoctorLeaveGrid();
    //$("#chkActiveStatus").attr('disabled', true);
}
function fnGridRefreshDoctorProfile() {
    $("#jqgDoctorProfile").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditDoctorProfile(e) {

    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not Authorized to Edit");
        return;
    }
    $("#btnSaveDoctorProfile,#btnSaveAboutDoctor,#btnSaveDoctorProfileImage, #btnSaveDoctorProfileBusinessLink, #btnSaveDoctorProfileAddress, #btnSaveDoctorStatutoryDetails,#btnSaveDoctorConsultationRate").html("<i class='fa fa-sync'></i> Update");
    $("#divGrid").hide();
    $('#divDoctorProfileForm').css('display', 'block');
    fnClearFields();
    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Update);
    $("#btnClearDoctor").hide();
    var rowid = $("#jqgDoctorProfile").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorProfile').jqGrid('getRowData', rowid);
    _formEdit = true;
    _formDelete = true;

    fnGetDoctorMasterProfile(rowData);
    $("#btnSaveDoctorProfileBusinessLink").show();
    $("#btnClearDoctorProfileBusinessLink").show();
    $("#btnSaveDoctorProfileImage").show();
    $("#btnSaveDoctorStatutoryDetails").show();
    $("#btnClearDoctor").show();
    $("#divUploadPhoto").css('display', 'block');
    //$("#btnSave").show();
    //$("#btnSaveDoctorSchedule").show();
    //$("#btnClearDoctorSchedule").show();
    //$("#btnSaveDoctorScheduleChange").show();
    //$("#btnSaveDoctorStatutoryDetails").show();
    //$("#btnSaveDoctorLeave").show();
    //$("#btnClearDoctorLeave").show();

    //$("#cboSpecialty").prop("disabled", false);
    //$("#cboDoctorScheduleSpecialty, #cboDoctorClinic, #cboScheduleConsultationType, #cboDoctorScheduleWeekDays").prop("disabled", false);
    //$("#cboDoctorScheduleChangeSpecialty, #cboDoctorScheduleChangeClinic, #cboDoctorScheduleChangeConsultationType").prop("disabled", false);
    //$("#txtOnLeaveFromDoctor, txtOnLeaveTillDoctor").prop("disabled", false);
    //$("#chkActiveStatus").attr('disabled', true);
}

function fnViewDoctorProfile(e) {

    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not authorized to View");
        return;
    }
   
    fnClearFields();
    var rowid = $("#jqgDoctorProfile").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorProfile').jqGrid('getRowData', rowid);
    _formEdit = false;
    _formDelete = false;
    fnGetDoctorMasterProfile(rowData);

    $("#divGrid").hide();
    $('#divDoctorProfileForm').css('display', 'block');
    $("#btnSaveDoctorProfile").hide();
    $("#btnClearDoctor").hide();
    $("input,textarea").attr('readonly', true);
    //$("select").next().prop("disabled", true);

    //$("#cboSpecialty").prop("disabled", true);
    //$("#cboDoctorScheduleSpecialty, #cboDoctorClinic, #cboScheduleConsultationType, #cboDoctorScheduleWeekDays").prop("disabled", true);
    //$("#cboDoctorScheduleChangeSpecialty, #cboDoctorScheduleChangeClinic, #cboDoctorScheduleChangeConsultationType").prop("disabled", true);
    //$("#txtOnLeaveFromDoctor, txtOnLeaveTillDoctor").prop("disabled", true);

    $("input[type=checkbox]").attr('disabled', true);
    $("#btnSaveDoctorProfile,#btnClearDoctor,#btnSaveAboutDoctor,#btnClearAboutDoctor, #btnSaveDoctorProfileImage, #btnClearDoctor, #btnSaveDoctorProfileBusinessLink, #btnClearDoctorProfileBusinessLink,#btnSaveDoctorProfileAddress, #btnClearDoctorAddress, #btnSaveDoctorStatutoryDetails, #btnClearDoctor, #btnClearDoctor").css('display', 'none');
    $("#btnSaveDoctorProfileBusinessLink").hide();
    $("#btnClearDoctorProfileBusinessLink").hide();
    //$("#btnDoctorSpecialtySave").hide();
    //$("#btnSave").hide();
    //$("#btnSaveDoctorSchedule").hide();
    //$("#btnClearDoctorSchedule").hide();
    //$("#btnSaveDoctorScheduleChange").hide();
    //$("#btnClearDoctorScheduleChange").hide();
    //$("#btnSaveDoctorLeave").hide();
    //$("#btnClearDoctorLeave").hide();

}

function fnGetDoctorMasterProfile(data) {
    //alert(JSON.stringify(data));
    if (data != null) {
        //alert(data.DoctorId);
        $.ajax({
            url: getBaseURL() + '/Doctors/GetDoctorMaster?doctorId=' + data.DoctorId,
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                //alert(js.stringify(response));
                if (response != null) {
                    fnFillDataMasterData(response);
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
//function fnEditDoctorProfile(e) {
//    $("#divGrid").hide();
//    $('#divDoctorProfileForm').css('display', 'block');
//    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Update);
//    $("#btnClearDoctor").hide();
//}
function fnFillDataMasterData(data) {

    $('#hdvDoctorId').val(data.DoctorId);
    $('#txtDoctorId').val(data.DoctorId);
    $('#hdDoctorName').html(data.DoctorName);
    $('#txtDoctorName').val(data.DoctorName);
    $('#txtDoctorShortName').val(data.DoctorShortName);
    $('#txtDoctorRegnNo').val(data.DoctorRegnNo);
    $('#cboGender').val(data.Gender);
    $('#cboGender').selectpicker('refresh');
    $('#txtEMailId').val(data.EMailId);
    $('#cboDoctorMobile').val(data.ISDCode).selectpicker('refresh');
    $('#txtDoctorMobile').val(data.MobileNumber);
    $('#cboDoctorClass').val(data.DoctorClass);
    $('#cboDoctorClass').selectpicker('refresh');
    $('#cboDoctorCategory').val(data.DoctorCategory);
    $('#cboDoctorCategory').selectpicker('refresh');
    //$('#cboPayoutType').val(data.PayoutType);
    //$('#cboPayoutType').selectpicker('refresh');
    $('#cboSeniorityLevel').val(data.SeniorityLevel);
    $('#cboSeniorityLevel').selectpicker('refresh');
    //if (data.userimage !== null && data.userimage !== "") {
    //    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + data.userimage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
    //}

    $('#txtPassword').val(data.Password);
    //if (data.AllowConsultation === true)
    //    $('#chkAllowConsultation').parent().addClass("is-checked");
    //else
    //    $('#chkAllowConsultation').parent().removeClass("is-checked");
   
    //if (data.AllowSMS == true)
    //    $('#chkAllowSMS').parent().addClass("is-checked");
    //else
    //    $('#chkAllowSMS').parent().removeClass("is-checked");
    //if (data.ActiveStatus == true)
    //    $('#chkActiveStatus').parent().addClass("is-checked");
    //else
    //    $('#chkActiveStatus').parent().removeClass("is-checked");

    $('#cboTraiffFrom').val(data.TraiffFrom).selectpicker('refresh');

    fnLoadDoctorParameters();

    //fnGetDoctorAddressbyDoctorId();

    //fnGridDoctorProfileBusinessLink();

    //fnGridDoctorSpecialtyLink();
    //fnLoadDoctorSchedulerGrid();
    //fnLoadDoctorScheduleChangeGrid();
    //fnLoadDoctorLeaveGrid();

    //fnLoadClinicBusinessList();
   
}

function fnSaveDoctorProfile() {
    //var file = '';

    if (IsStringNullorEmpty($('#txtDoctorShortName').val())) {
        toastr.warning("Please Enter the Doctor Short Name");
        $('#txtDoctorShortName').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDoctorName').val())) {
        toastr.warning("Please Enter the Doctor Name");
        $('#txtDoctorName').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboGender').val())) {
        toastr.warning("Please Select a Gender");
        $('#cboGender').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDoctorRegnNo').val())) {
        toastr.warning("Please Enter the Doctor Registration Number");
        $('#txtDoctorRegnNo').focus();
        return;
    }
   
    
    if (IsStringNullorEmpty($('#cboDoctorMobile').val())) {
        toastr.warning("Please Select a ISD Code");
        $('#cboISDCode').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDoctorMobile').val())) {
        toastr.warning("Please Enter the Mobile Number");
        $('#txtMobileNumber').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboDoctorClass').val())) {
        toastr.warning("Please Select a Doctor Class");
        $('#cboDoctorClass').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboDoctorCategory').val())) {
        toastr.warning("Please Select a Doctor Category");
        $('#cboDoctorCategory').focus();
        return;
    }
    //if (IsStringNullorEmpty($('#cboPayoutType').val())) {
    //    toastr.warning("Please Select a Payout Type");
    //    $('#cboPayoutType').focus();
    //    return;
    //}
    if (IsStringNullorEmpty($('#cboTraiffFrom').val())) {
        toastr.warning("Please Select a Traiff From");
        $('#cboTraiffFrom').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboSeniorityLevel').val())) {
        toastr.warning("Please Select a Seniority Level");
        $('#cboSeniorityLevel').focus();
        return;
    }
   

    if (IsStringNullorEmpty($("#cboDoctorMobile").val()) || $("#cboDoctorMobile").val() <= 0) {
        toastr.warning("Please Select a ISD");
        $('#cboDoctorMobile').focus();
        return;
    }
  

    if ($("#txtDoctorMobile").inputmask("isComplete") === false) {
        toastr.warning("Please Enter the mobile no.");
        $('#txtDoctorMobile').focus();
        return;
    }

    if (IsStringNullorEmpty($('#txtEMailId').val())) {
        if (!IsValidateEmail($('#txtEMailId').val())) {
            toastr.warning("Please Enter a Valid Email Id");
            $('#txtEMailId').focus();
            return;
        }
    }
    
    //if ($('#imgPhoto img').attr('src') !== undefined) {

    //    file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    //}

    $("#btnSaveDoctorProfile").attr("disabled", true);

    var obj = {
        DoctorId: $('#hdvDoctorId').val(),
        DoctorName: $('#txtDoctorName').val(),
        DoctorShortName: $('#txtDoctorShortName').val(),
        DoctorRegnNo: $('#txtDoctorRegnNo').val(),
        Gender: $('#cboGender').val(),
        ISDCode: $('#cboDoctorMobile').val(),
        MobileNumber: $('#txtDoctorMobile').val(),
        EMailId: $('#txtEMailId').val(),
        DoctorClass: $('#cboDoctorClass').val(),
        DoctorCategory: $('#cboDoctorCategory').val(),
        //AllowConsultation: $('#chkAllowConsultation').parent().hasClass("is-checked"),
        //PayoutType: $('#cboPayoutType').val(),
        SeniorityLevel: $('#cboSeniorityLevel').val(),
        //AllowSMS: $('#chkAllowSMS').parent().hasClass("is-checked"),
        TraiffFrom: $('#cboTraiffFrom').val(),
        ActiveStatus: true,
        Password: $('#txtPassword').val(),
        l_DoctorParameter: eSyaParams.GetJSONValue()
        
    };

    var Url;
    if ($('#hdvDoctorId').val() === null || $('#hdvDoctorId').val() === '')
        Url = getBaseURL() + '/Doctors/InsertDoctorMaster';
    else
        Url = getBaseURL() + '/Doctors/UpdateDoctorMaster';

    $.ajax({
        url: Url,
        type: 'POST',
        datatype: 'json',
        data: {obj: obj},
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $('#txtDoctorId').val(response.ID);
                    $('#hdDoctorName').html($('#txtDoctorName').val());
                    $("#btnSaveDoctorProfile").attr('disabled', false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveDoctorProfile").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDoctorProfile").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDoctorProfile").attr("disabled", false);
        }
    });
    $("#btnSaveDoctorProfile").attr('disabled', false);
}

function fnClearFields() {

    $('#hdvDoctorId').val('');
    $('#txtDoctorId').val('');
    $('#txtDoctorName').val('');
    $('#hdDoctorName').val('');
    $('#hdDoctorName').html('');
    $('#txtDoctorShortName').val('');
    $('#txtDoctorRegnNo').val('');
    $('#txtEMailId').val('');
    $('#txtDoctorMobile').val('');
    $('#cboDoctorClass').val('');
    $('#cboDoctorClass').selectpicker('refresh');
    $('#cboDoctorCategory').val('');
    $('#cboDoctorCategory').selectpicker('refresh');
    //$('#cboPayoutType').val('');
    //$('#cboPayoutType').selectpicker('refresh'); 
    $('#cboGender').val('');
    $('#cboGender').selectpicker('refresh');
    $('#cboSeniorityLevel').val('');
    $('#cboSeniorityLevel').selectpicker('refresh');
    //$('#chkAllowConsultation').parent().removeClass("is-checked");
    //$('#chkAllowSMS').parent().removeClass("is-checked");
    //$('#chkActiveStatus').parent().addClass("is-checked");
    $('#txtPassword').val(''); 
    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Save);
    $('#cboTraiffFrom').val('').selectpicker('refresh');;
    $('#cboTimeSlotInMintues').val('0').selectpicker('refresh');;
    $('#divCapturePhoto,#divUploadPhoto').css('display', 'none');

    $("#imgPhotoimageblah,#imgSignatureblah").attr('src', '');
    //$('#Photoimage').val('');
    //$('#imgPhotoimage').removeAttr('src');
    //$('#imgPhotoimageblah').attr('src', '');
    //document.getElementById('Photoimage').value="";
    $("button[id^=btnSave],button[id^=btnClear]").css('display', 'inline-block');
    eSyaParams.ClearValue();

    $("#cboLocation").empty();
    $("#cboLocation").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#txtIsdcode").empty();
    $("#txtIsdcode").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboState").empty();
    $("#cboState").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboCity").empty();
    $("#cboCity").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboZipDesc").empty();
    $("#cboZipDesc").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboArea").empty();
    $("#cboArea").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#txtZipCode").val('');
    $("#txtAddress").val('');
    
}

function SetDoctorProfileGridControlByAction() {

    if (_userFormRole.IsInsert === false) {
        $('#jqgDMAdd').addClass('ui-state-disabled');
    }

}

function fnCloseDoctorProfile() {
    $("#divGrid").show();
    $('#divDoctorProfileForm').css('display', 'none');
    $('.tab-pane').removeClass('active show');
    $("#doctorprofile").addClass('active show');
    $('#v-pills-tab a').removeClass('active');
    $('#doctorprofile-tab').addClass('active');

    $("#btnSaveDoctorProfile").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("input[type=checkbox]").attr('disabled', false);
    fnClearFields();
    $("#btnSaveDoctorProfileBusinessLink").show();
    $("#btnClearDoctorProfileBusinessLink").show();
    //$("#btnDoctorSpecialtySave").show();
    //$("#btnSaveDoctorSchedule").show();
    //$("#btnClearDoctorSchedule").show();
    //$("#btnSaveDoctorScheduleChange").show();
    //$("#btnClearDoctorScheduleChange").show();
    //$("#btnSaveDoctorLeave").show();
    //$("#btnClearDoctorLeave").show();
    fnGridRefreshDoctorProfile();
    fnLoadDoctorParameters();
}

//function fnDeActivateDoctorProfile(e) {

//    if (_userFormRole.IsDelete === false) {
//        toastr.warning("your Not Authorized to Delete");
//        return;
//    }
//    var rowid = $("#jqgDoctorProfile").jqGrid('getGridParam', 'selrow');
//    var rowData = $('#jqgDoctorProfile').jqGrid('getRowData', rowid);
//    var doctorId = rowData.DoctorId;
//    var a_status;
//    var msg;
//    var lbl;
//    //Activate or De Activate the status
//    if (rowData.ActiveStatus === "true") {
//        a_status = false;
//        msg = "Are you sure you want to De Activate Doctor?";
//        lbl = localization.DeActivate;
//    }
//    else {
//        a_status = true;
//        msg = "Are you sure you want Activate Doctor?";
//        lbl = localization.Activate;
//    }
//    bootbox.confirm({
//        title: 'Doctor Master',
//        message: msg,
//        buttons: {
//            confirm: {
//                label: lbl,
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent primary-button'
//            },
//            cancel: {
//                label: 'Cancel',
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
//            }
//        },
//        callback: function (result) {
//            if (result) {
//                if (doctorId == null || doctorId == undefined || doctorId == "0" || doctorId == '') {
//                    alert("Could not Delete");
//                    return false;
//                }
//                $.ajax({
//                    url: getBaseURL() + '/Doctors/ActiveOrDeActiveDoctor?status=' + a_status + '&doctorId=' + doctorId,
//                    type: 'POST',
//                    success: function (response) {

//                        if (response.Status) {
//                            toastr.success(response.Message);
//                            fnGridRefreshDoctorProfile();
//                        }
//                        else {
//                            toastr.error(response.Message);
//                        }
//                        fnGridRefreshDoctorProfile();
//                    },
//                    error: function (response) {
//                        toastr.error("Couldn't Delete");
//                    }
//                });
//            }
//        }
//    });
//}

function fnLoadDoctorParameters() {

    eSyaParams.ClearValue();
    $.ajax({
        url : getBaseURL() + '/Doctors/GetDoctorParameterList?doctorId=' + $('#hdvDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response !== null) {
                eSyaParams.SetJSONValue(response);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
   
}