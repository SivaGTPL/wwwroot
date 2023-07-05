var _formEdit = true;
var _formDelete = true;

$(document).ready(function () {
    fnGridLoadDoctorMaster("0");
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var doctorNamePrefix = $(this).text();
        if (doctorNamePrefix === "All")
            doctorNamePrefix = "";
        fnGridLoadDoctorMaster(doctorNamePrefix);
        $(this).addClass('active');
    });
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorMaster');
        }
    });
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctorMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctorMaster(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewDoctorMaster(event) } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateDoctorMaster(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadDoctorMaster(doctorPrefix) {
    $("#jqgDoctorMaster").jqGrid('GridUnload');
    $("#jqgDoctorMaster").jqGrid({
        url: getBaseURL() + '/Doctors/GetDoctorMasterList?doctorNamePrefix=' + doctorPrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: ["Doctor Id", localization.DoctorShortName, localization.DoctorName, "Doctor Registration No", localization.Gender, localization.Qualification, localization.MobileNumber, localization.DoctorClassCode, localization.DoctorClass, localization.DoctorCategoryCode, localization.DoctorCategory, localization.PatientPerHour,localization.AllowConsultation, localization.AllowSMS, localization.IsRevenueShareAppicable, localization.TraiffFrom, localization.DoctorRemarks, localization.TimeSlotInMintues,localization.Active, localization.Actions],
        colModel: [
            { name: "DoctorId", width: 40, editable: true, align: 'left', hidden: true },
            { name: "DoctorShortName", width: 35, editable: true, align: 'left', hidden: false },
            { name: "DoctorName", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorRegnNo", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Gender", width: 25, editable: true, align: 'left', hidden: false, editoptions: { value: "M: Male;F: Female" } },
            { name: "Qualification", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MobileNumber", width: 35, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorClass", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorClassDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorCategory", width: 60, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorCategoryDesc", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "PatientPerHour", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AllowConsultation", width: 40, editable: true, align: 'left', hidden: true },
            { name: "AllowSMS", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "IsRevenueShareAppicable", width: 40, editable: true, align: 'left', hidden: true },
            { name: "TraiffFrom", width: 10, editable: true, align: 'left', hidden: true, editoptions: { value: "N: None;R: Service Rate;S: Specialty;D: Doctor" } },
            //{ name: "LanguageKnown", width: 70, editable: true, align: 'left', hidden: true },
            //{ name: "Experience", width: 70, editable: true, align: 'left', hidden: true },
            { name: "DoctorRemarks", width: 70, editable: true, align: 'left', hidden: true },
            { name: "TimeSlotInMintues", width: 10, editable: true, align: 'left', hidden: true, editoptions: { value: "5: 5 Minutes;10: 10 Minutes;15: 15 Minutes;20: 20 Minutes;25: 25 Minutes;30: 30 Minutes;45: 45 Minutes;60: 60 Minutes" } },
            { name: "ActiveStatus", editable: true, width: 20, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgDMEdit" onclick="return fnEditDoctorMaster(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "View" id="jqgDMView" onclick = "return fnViewDoctorMaster(event)" > <i class="far fa-eye"></i> ' + localization.View + ' </button > ' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDMDelete", onclick="return fnDeActivateDoctorMaster(event)"><i class="fas fa-trash"></i>' + localization.DeActivate + '</button>'

            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
            
        ],
        pager: "#jqpDoctorMaster",
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
        loadComplete: function (data) {
            SetDoctorMasterGridControlByAction();
            fnJqgridSmallScreen('jqgDoctorMaster');
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

    }).jqGrid('navGrid', '#jqpDoctorMaster', { add: false, edit: false, search: true, del: false, refresh: false }, {}, {}, {}, {
        closeOnEscape: true,
        caption: "Search...",
        multipleSearch: true,
        Find: "Find",
        Reset: "Reset",
        odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }]
    }).jqGrid('navButtonAdd', '#jqpDoctorMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDoctorMaster
    }).jqGrid('navButtonAdd', '#jqpDoctorMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgDMAdd', position: 'first', onClickButton: fnGridAddDoctorMaster
    });

    fnAddGridSerialNoHeading();
}

function fnGridAddDoctorMaster() {
    fnClearFields();
    //$('#PopupDoctorMaster').find('.modal-title').text(localization.AddDoctor);
    $("#btnSaveDoctorMaster").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnClearDoctor").show();
    $("#divGrid").hide();
    $('#divDoctorCodesForm').css('display', 'block');

    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');

    _formEdit = true;
    _formDelete = true;

    fnGridDoctorBusinessLink();
    fnGridDoctorSpecialtyLink();
    fnLoadDoctorSchedulerGrid();
    fnLoadDoctorScheduleChangeGrid();
    fnLoadDoctorLeaveGrid();
    $("#chkActiveStatus").attr('disabled', true);
}

function fnGridRefreshDoctorMaster() {
    $("#jqgDoctorMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditDoctorMaster(e) {
    
    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not authorized to Edit");
        return;
    }
    $("#divGrid").hide();
    $('#divDoctorCodesForm').css('display', 'block');
    fnClearFields();
    $("#btnSaveDoctorMaster").html('<i class="far fa-save"></i> ' + localization.Update);
    $("#btnClearDoctor").hide();
    var rowid = $("#jqgDoctorMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorMaster').jqGrid('getRowData', rowid);
    _formEdit = true;
    _formDelete = true;

    fnGetDoctorMaster(rowData);
    $("#btnSaveDoctorBusinessLink").show();
    $("#btnClearDoctorBusinessLink").show();
    $("#btnDoctorSpecialtySave").show();
    $("#btnSave").show();
    $("#btnSaveDoctorSchedule").show();
    $("#btnClearDoctorSchedule").show();
    $("#btnSaveDoctorScheduleChange").show();
    $("#btnClearDoctorScheduleChange").show();
    $("#btnSaveDoctorLeave").show();
    $("#btnClearDoctorLeave").show();

    $("#cboSpecialty").prop("disabled", false);
    $("#cboDoctorScheduleSpecialty, #cboDoctorClinic, #cboScheduleConsultationType, #cboDoctorScheduleWeekDays").prop("disabled", false);
    $("#cboDoctorScheduleChangeSpecialty, #cboDoctorScheduleChangeClinic, #cboDoctorScheduleChangeConsultationType").prop("disabled", false);
    $("#txtOnLeaveFromDoctor, txtOnLeaveTillDoctor").prop("disabled", false);
    $("#chkActiveStatus").attr('disabled', true);
}

function fnViewDoctorMaster(e) {
    
    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not Authorized to View");
        return;
    }
    fnClearFields();
    var rowid = $("#jqgDoctorMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorMaster').jqGrid('getRowData', rowid);
    _formEdit = false;
    _formDelete = false;
    fnGetDoctorMaster(rowData);

    $("#divGrid").hide();
    $('#divDoctorCodesForm').css('display', 'block');
    $("#btnSaveDoctorMaster").hide();
    $("#btnClearDoctor").hide();
    $("input,textarea").attr('readonly', true);
    //$("select").next().prop("disabled", true);

    $("#cboSpecialty").prop("disabled", true);
    $("#cboDoctorScheduleSpecialty, #cboDoctorClinic, #cboScheduleConsultationType, #cboDoctorScheduleWeekDays").prop("disabled", true);
    $("#cboDoctorScheduleChangeSpecialty, #cboDoctorScheduleChangeClinic, #cboDoctorScheduleChangeConsultationType").prop("disabled", true);
    $("#txtOnLeaveFromDoctor, txtOnLeaveTillDoctor").prop("disabled", true);

    $("input[type=checkbox]").attr('disabled', true);
    //$("#PopupDoctorMaster").on('hidden.bs.modal', function () {
    //    $("#btnSaveDoctorMaster").show();
    //    $("input,textarea").attr('readonly', false);
    //    $("select").next().prop("disabled", true);
    //    $("input[type=checkbox]").attr('disabled', false);

    //});
    $("#btnSaveDoctorBusinessLink").hide();
    $("#btnClearDoctorBusinessLink").hide();
    $("#btnDoctorSpecialtySave").hide();
    $("#btnSave").hide();
    $("#btnSaveDoctorSchedule").hide();
    $("#btnClearDoctorSchedule").hide();
    $("#btnSaveDoctorScheduleChange").hide();
    $("#btnClearDoctorScheduleChange").hide();
    $("#btnSaveDoctorLeave").hide();
    $("#btnClearDoctorLeave").hide();

}

function fnGetDoctorMaster(data) {
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

function fnFillDataMasterData(data) {

    $('#hdvDoctorId').val(data.DoctorId);
    $('#txtDoctorId').val(data.DoctorId);
    $('#hdDoctorName').html(data.DoctorName);
    $('#txtDoctorName').val(data.DoctorName);
    $('#txtDoctorShortName').val(data.DoctorShortName);
    $('#txtDoctorRegnNo').val(data.DoctorRegnNo);
    $('#cboGender').val(data.Gender);
    $('#cboGender').selectpicker('refresh');
    $('#txtQualification').val(data.Qualification);
    $('#txtEMailId').val(data.EMailId);
    $('#cboDoctorMobile').val(data.ISDCode).selectpicker('refresh');
    $('#txtDoctorMobile').val(data.MobileNumber);
    $('#cboDoctorClass').val(data.DoctorClass);
    $('#cboDoctorClass').selectpicker('refresh');
    $('#cboDoctorCategory').val(data.DoctorCategory);
    $('#cboDoctorCategory').selectpicker('refresh');
    $('#cboTimeSlotInMintues').val(data.TimeSlotInMintues);
    $('#cboTimeSlotInMintues').selectpicker('refresh');
   
    if (data.userimage !== null && data.userimage !== "") {
        document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + data.userimage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
    }

    //alert(data.AllowConsultation);
    if (data.AllowConsultation === true)
        $('#chkAllowConsultation').parent().addClass("is-checked");
    else
        $('#chkAllowConsultation').parent().removeClass("is-checked");
    if (data.IsRevenueShareApplicable == true)
        $('#chkIsRevenueShareApplicable').parent().addClass("is-checked");
    else
        $('#chkIsRevenueShareApplicable').parent().removeClass("is-checked");
    if (data.AllowSMS == true)
        $('#chkAllowSMS').parent().addClass("is-checked");
    else
        $('#chkAllowSMS').parent().removeClass("is-checked");
    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");

    $('#cboTraiffFrom').val(data.TraiffFrom).selectpicker('refresh');
    //$('#txtLanguageKnown').val(data.LanguageKnown);
    //$('#txtExperience').val(data.Experience);
    $('#txtDoctorRemarks').val(data.DoctorRemarks);
    fnGridDoctorBusinessLink();
    fnGridDoctorSpecialtyLink();
    fnLoadDoctorSchedulerGrid();
    fnLoadDoctorScheduleChangeGrid();
    fnLoadDoctorLeaveGrid();

    //fnLoadClinicBusinessList();
}

function fnSaveDoctorMaster() {
    var file = '';

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
    if (IsStringNullorEmpty($('#txtDoctorRegnNo').val())) {
        toastr.warning("Please Enter the Doctor Registration Number");
        $('#txtDoctorRegnNo').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboGender').val())) {
        toastr.warning("Please Select a Gender");
        $('#cboGender').focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtQualification').val())) {
        toastr.warning("Please Enter the Doctor Qualification");
        $('#txtQualification').focus();
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
    if (IsStringNullorEmpty($('#cboTraiffFrom').val())) {
        toastr.warning("Please Select a Traiff From");
        $('#cboTraiffFrom').focus();
        return;
    }
    
    if (IsStringNullorEmpty($("#cboDoctorMobile").val()) || $("#cboDoctorMobile").val() <= 0) {
        toastr.warning("Please Select a ISD");
        $('#cboDoctorMobile').focus();
        return;
    }
    if (IsStringNullorEmpty($("#cboTimeSlotInMintues").val()) || $("#cboTimeSlotInMintues").val() === '0') {
        toastr.warning("Please Select a Time Slot In Mintues");
        $('#cboTimeSlotInMintues').focus();
        return;
    }
    
    if ($("#txtDoctorMobile").inputmask("isComplete") === false) {
        toastr.warning("Please enter the mobile no.");
        $('#txtDoctorMobile').focus();
        return;
    }

    if (IsStringNullorEmpty($('#txtEMailId').val())) {
        if (!IsValidateEmail($('#txtEMailId').val())) {
            toastr.warning("Please Enter the Valid Email Id");
            $('#txtEMailId').focus();
            return;
        }
    }

    if ($('#imgPhoto img').attr('src') !== undefined) {

        file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    }

    $("#btnSaveDoctorMaster").attr("disabled", true);

    var obj = {
        DoctorId: $('#hdvDoctorId').val(),
        DoctorName: $('#txtDoctorName').val(),
        DoctorShortName: $('#txtDoctorShortName').val(),
        DoctorRegnNo: $('#txtDoctorRegnNo').val(),
        Gender: $('#cboGender').val(),
        Qualification: $('#txtQualification').val(),
        EMailId: $('#txtEMailId').val(),
        ISDCode: $('#cboDoctorMobile').val(),
        MobileNumber: $('#txtDoctorMobile').val(),
        DoctorClass: $('#cboDoctorClass').val(),
        DoctorCategory: $('#cboDoctorCategory').val(),
        AllowConsultation: $('#chkAllowConsultation').parent().hasClass("is-checked"),
        IsRevenueShareApplicable: $('#chkIsRevenueShareApplicable').parent().hasClass("is-checked"),
        AllowSMS: $('#chkAllowSMS').parent().hasClass("is-checked"),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked"),
        TraiffFrom: $('#cboTraiffFrom').val(),
        TimeSlotInMintues:$('#cboTimeSlotInMintues').val(),
        //LanguageKnown: $('#txtLanguageKnown').val(),
        //Experience: $('#txtExperience').val(),
        DoctorRemarks: $('#txtDoctorRemarks').val()
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
        data: {
            obj:obj,
            file: file
        },
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $('#txtDoctorId').val(response.ID);
                    $('#hdDoctorName').html($('#txtDoctorName').val());
                    //$('#PopupDoctorMaster').modal('hide');
                    $("#btnSaveDoctorMaster").attr('disabled', false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveDoctorMaster").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDoctorMaster").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDoctorMaster").attr("disabled", false);
        }
    });
    $("#btnSaveDoctorMaster").attr('disabled', false);
}

function fnClearFields() {

    $('#hdvDoctorId').val('');
    $('#txtDoctorId').val('');
    $('#txtDoctorName').val('');
    $('#hdDoctorName').val('');
    $('#hdDoctorName').html('');
    $('#txtDoctorShortName').val('');
    $('#txtDoctorRegnNo').val('');
    $('#txtQualification').val('');
    $('#txtEMailId').val('');
    $('#txtDoctorMobile').val('');
    $('#cboDoctorClass').val('');
    $('#cboDoctorClass').selectpicker('refresh');
    $('#cboDoctorCategory').val('');
    $('#cboDoctorCategory').selectpicker('refresh');
    $('#chkAllowConsultation').parent().removeClass("is-checked");
    $('#chkIsRevenueShareApplicable').parent().removeClass("is-checked");
    $('#chkAllowSMS').parent().removeClass("is-checked");
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveDoctorMaster").html('<i class="far fa-save"></i> ' + localization.Save);
    $('#cboTraiffFrom').val('N').selectpicker('refresh');;
    $('#cboTimeSlotInMintues').val('0').selectpicker('refresh');; 
    //$('#txtLanguageKnown').val('');
    //$('#txtExperience').val('');
    $('#txtDoctorRemarks').val('');

    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    //$('#imgPhotoimageblah').attr('src', '');
    //document.getElementById('Photoimage').value="";
}

function SetDoctorMasterGridControlByAction() {

    if (_userFormRole.IsInsert === false) {
        $('#jqgDMAdd').addClass('ui-state-disabled');
    }
   
}

function fnCloseDoctorMaster() {

    $("#divGrid").show();
    $('#divDoctorCodesForm').css('display', 'none');
    $("#btnSaveDoctorMaster").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("input[type=checkbox]").attr('disabled', false);
    fnClearFields();
    $("#btnSaveDoctorBusinessLink").show();
    $("#btnClearDoctorBusinessLink").show();
    $("#btnDoctorSpecialtySave").show();
    $("#btnSaveDoctorSchedule").show();
    $("#btnClearDoctorSchedule").show();
    $("#btnSaveDoctorScheduleChange").show();
    $("#btnClearDoctorScheduleChange").show();
    $("#btnSaveDoctorLeave").show();
    $("#btnClearDoctorLeave").show();
    fnGridRefreshDoctorMaster();
}

function fnDeActivateDoctorMaster(e) {
   
    if (_userFormRole.IsDelete === false) {
        toastr.warning("You are not authorized to Delete");
        return;
    }
    var rowid = $("#jqgDoctorMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorMaster').jqGrid('getRowData', rowid);
    var doctorId = rowData.DoctorId;
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to De Activate Doctor?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want Activate Doctor?";
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
                if (doctorId == null || doctorId == undefined || doctorId == "0" || doctorId == '') {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/Doctors/ActiveOrDeActiveDoctor?status=' + a_status + '&doctorId=' + doctorId,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            toastr.success(response.Message);
                            fnGridRefreshDoctorMaster();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        fnGridRefreshDoctorMaster();
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}