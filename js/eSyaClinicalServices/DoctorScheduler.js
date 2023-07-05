var lstChangeClinicConsultationType;
var lstChangeDoctorSpecialty;
var isUpdate = 0;

$(document).ready(function () {
    setDate($('#dtFromDate'), new Date());
    setDate($('#dtToDate'), new Date());
    fnGridLoadDoctorScheduler();
});

function fnLoadSchedulerClinic() {

    if ($('#cboHBusinessKey').val() === '')
        return;

    $("#cboHClinic").empty();
    $('#cboHClinic').selectpicker('refresh');
    lstChangeClinicConsultationType = "";
    lstChangeDoctorSpecialty = "";
    $('#cboHConsultationType').empty();
    $('#cboHConsultationType').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetClinicConsultantIdList?businessKey=' + $('#cboHBusinessKey').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            if (response !== null) {
                lstChangeClinicConsultationType = response;
                var clinics = [];
                $.each(response, function (j, v) {
                    var cl = { ClinicId: v.ClinicId, ClinicDesc: v.ClinicDesc };
                    if (clinics.length === 0) {
                        clinics.push(cl);
                    }
                    else {
                        var valExist = false;
                        $.each(clinics, function (i, value) {
                            if (value.ClinicId === v.ClinicId) {
                                valExist = true;
                                return false;
                            }

                        });
                        if (valExist === false) {
                            clinics.push(cl);
                        }
                    }
                });

                var options = $("#cboHClinic");
                $("#cboHClinic").empty();

                $.each(clinics, function () {
                    options.append($("<option />").val(this.ClinicId).text(this.ClinicDesc));
                });
                $('#cboHClinic').selectpicker('refresh');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
    fnGridLoadDoctorScheduler();
}

function fnLoadSchedulerConsultationType() {

    var value = $('#cboHClinic').val();
    var options = $("#cboHConsultationType");
    $("#cboHConsultationType").empty();

    $.each(lstChangeClinicConsultationType, function () {
        if (this.ClinicId.toString() === value.toString()) {
            options.append($("<option />").val(this.ConsultationId).text(this.ConsultationDesc));
        }
    });
    $('#cboHConsultationType').selectpicker('refresh');

    fnGridLoadDoctorScheduler();
}

function fnGridLoadDoctorScheduler() {

    $("#jqgDoctorScheduler").GridUnload();
    $("#jqgDoctorScheduler").jqGrid({
        url: getBaseURL() + '/Doctor/GetDoctorSchedulerListAll?businessKey=' + $('#cboHBusinessKey').val() + '&clinicId=' + $('#cboHClinic').val() + '&consultationId=' + $('#cboHConsultationType').val() + '&scheduleFromDate=' + getDate($('#dtFromDate')) + '&scheduleToDate=' + getDate($('#dtToDate')),
        datatype: 'json',
        mtype: 'POST',
        colNames: [localization.SerialNumber, localization.ScheduleDate, localization.Location, localization.Clinic, localization.ConsultationType, localization.SpecialtyId, localization.Specialty, localization.DoctorId, localization.DoctorName, localization.FromTime, localization.ToTime, localization.Satus, localization.Actions],
        colModel: [

            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            {
                name: "ScheduleChangeDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "DoctorName", width: 100, editable: true, align: 'left' },
            { name: 'ScheduleFromTime', index: 'Tid', width: 65, editable: true, formatoptions: { mask: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 65, editable: true, formatoptions: { mask: 'ShortTime' }, editrules: { time: true } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width: 100, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDoctorScheduler(event,\'edit\')"><i class="fas fa-pen"></i> ' + "Edit" + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "View" id="jqgView" onclick="return fnEditDoctorScheduler(event,\'view\')"> <i class="far fa-eye"></i> ' + "View" + ' </button > ' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditDoctorScheduler(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.DeActivate + '</button >'

                }
            }
        ],
        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpDoctorScheduler",
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
            SetGridControlByAction();

        },
    }).jqGrid('navGrid', '#jqpDoctorScheduler', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctorScheduler', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "jqgRefresh", position: "first", onClickButton: fnGridRefreshDoctorScheduler
        }).jqGrid('navButtonAdd', '#jqpDoctorScheduler', {
            caption: '<span class="fa fa-plus btn-pager"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctorScheduler
    });
    fnAddGridSerialNoHeading();
}

function fnLoadSchedulerSpecialty() {

    if ($('#cboHConsultationType').val() === '')
        return;

    $("#cboSpecialty").empty();
    $('#cboSpecialty').selectpicker('refresh');
    lstChangeDoctorSpecialty = "";
    $('#cboDoctorName').empty();
    $('#cboDoctorName').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetDoctorClinicLinkListbyClinicConsultation?businessKey=' + $('#cboHBusinessKey').val() + '&clinicId=' + $('#cboHClinic').val() + '&consultationId=' + $('#cboHConsultationType').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            if (response !== null) {
                lstChangeDoctorSpecialty = response;
                var specialty = [];
                $.each(response, function (j, v) {
                    var sp = { SpecialtyId: v.SpecialtyId, SpecialtyDesc: v.SpecialtyDesc };
                    if (specialty.length === 0) {
                        specialty.push(sp);
                    }
                    else {
                        var valExist = false;
                        $.each(specialty, function (i, value) {
                            if (value.SpecialtyId === v.SpecialtyId) {
                                valExist = true;
                                return false;
                            }
                        });
                        if (valExist === false) {
                            specialty.push(sp);
                        }
                    }
                });

                var options = $("#cboSpecialty");
                $("#cboSpecialty").empty();

                $.each(specialty, function () {
                    options.append($("<option />").val(this.SpecialtyId).text(this.SpecialtyDesc));
                });
                $('#cboSpecialty').selectpicker('refresh');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });

    fnGridLoadDoctorScheduler();
}

function fnLoadSchedulerDoctor() {

    var value = $('#cboSpecialty').val();
    var options = $("#cboDoctorName");
    $("#cboDoctorName").empty();

    $.each(lstChangeDoctorSpecialty, function () {
        if (this.SpecialtyId.toString() === value.toString()) {
            options.append($("<option />").val(this.DoctorId).text(this.DoctorName));
        }
    });
    $('#cboDoctorName').selectpicker('refresh');
}

function fnAddDoctorScheduler() {
    fnClearDoctorScheduler();
    $('#txtBusinessDesc').val(fnGetSelectText("cboHBusinessKey"));
    $('#txtClinicDesc').val(fnGetSelectText("cboHClinic"));
    $('#txtConsultationDesc').val(fnGetSelectText("cboHConsultationType"));
    $("#PopupDoctorScheduler").modal('show');
    $(".modal-title").text("Add Doctor Schedule");
    $("#cboSpecialty").prop("disabled", false);
    $('#cboSpecialty').selectpicker('refresh');
    $("#cboDoctorName").prop("disabled", false);
    $('#cboDoctorName').selectpicker('refresh');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDoctorSchedule").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveDoctorSchedule").show();
    $("#btnDeactivateDoctorScheduler").hide();

    isUpdate = 0;
}

function fnEditDoctorScheduler(e, actiontype) {
    fnClearDoctorScheduler();
    $('#txtBusinessDesc').val(fnGetSelectText("cboHBusinessKey"));
    $('#txtClinicDesc').val(fnGetSelectText("cboHClinic"));
    $('#txtConsultationDesc').val(fnGetSelectText("cboHConsultationType"));

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDoctorScheduler').jqGrid('getRowData', rowid);

    $('#txtSerialNumber').val(rowData.SerialNo);
    $('#cboSpecialty').val(rowData.SpecialtyID);
    $('#cboSpecialty').selectpicker('refresh');
    fnLoadSchedulerDoctor();
    $('#cboDoctorName').val(rowData.DoctorId);
    $('#cboDoctorName').selectpicker('refresh');
    $('#dtScheduleDate').val(rowData.ScheduleChangeDate);
    $('#txtFromTime').val(rowData.ScheduleFromTime);
    $('#txtToTime').val(rowData.ScheduleToTime);

    if (rowData.ActiveStatus === "true") {
        $('#chkActiveStatus').parent().addClass("is-checked");
    }
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");

    $("#PopupDoctorScheduler").modal('show');
    isUpdate = 1;
    $("#cboSpecialty").prop("disabled", true);
    $('#cboSpecialty').selectpicker('refresh');
    $("#cboDoctorName").prop("disabled", true);
    $('#cboDoctorName').selectpicker('refresh');

    if (actiontype.trim() === "edit") {
        $('#PopupDoctorScheduler').find('.modal-title').text(localization.EditDoctorSchedule);
        $("#btnSaveDoctorSchedule").show();
        fnEnableDoctorScheduleDetail(false);
        $("#btnSaveDoctorSchedule").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnDeactivateDoctorScheduler").hide();
        $("#btnSaveDoctorSchedule").show();
        $("#chkActiveStatus").prop('disabled', true);
    }
    if (actiontype.trim() === "view") {
        $('#PopupDoctorScheduler').find('.modal-title').text(localization.ViewDoctorSchedule);
        $("#btnSaveDoctorSchedule").hide();
        $("#btnDeactivateDoctorScheduler").hide();
        fnEnableDoctorScheduleDetail(true);
    }
    if (actiontype.trim() == "delete") {
        $('#PopupDoctorScheduler').find('.modal-title').text(localization.ActiveDeActiveDoctorSchedule);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateDoctorScheduler").html(localization.DeActivate);
        }
        else {
        
            $("#btnDeactivateDoctorScheduler").html(localization.Activate);
        }
        $("#btnSaveDoctorSchedule").hide();
        $("#btnDeactivateDoctorScheduler").show();
        $("#chkActiveStatus").prop('disabled', true);
        fnEnableDoctorScheduleDetail(true);
    }
}

function fnGetSelectText(selId) {
    var sel = document.getElementById(selId);
    var i = sel.selectedIndex;
    var selected_text = sel.options[i].text;
    return selected_text;
}

function fnSaveDoctorScheduler() {
    if (IsStringNullorEmpty($('#cboHBusinessKey').val())) {
        toastr.warning("Please Select Location");
        $('#cboHBusinessKey').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboHClinic').val())) {
        toastr.warning("Please Select Clinic");
        $('#cboHClinic').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboHConsultationType').val())) {
        toastr.warning("Please Select Consultation Type");
        $('#cboHConsultationType').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboDoctorName').val())) {
        toastr.warning("Please Select Doctor");
        $('#cboDoctorName').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboSpecialty').val())) {
        toastr.warning("Please Select Specialty");
        $('#cboSpecialty').focus();
        return;
    }
    if ($('#dtScheduleDate').val() === '') {
        toastr.warning("Please Select Schedule Date");
        $('#dtScheduleDate').focus();
        return;
    }
    if ($('#txtFromTime').val() >= $('#txtToTime').val()) {
        toastr.warning("From Time can't be more than or equal to To Time.");
        $('#txtToTime').focus();
        return;
    }

    if (isUpdate === 1) {
        if (IsStringNullorEmpty($('#txtSerialNumber').val())) {
            toastr.warning("Please select record to update");
            return;
        }
    }

    $("#btnSaveDoctorSchedule").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboHBusinessKey').val(),
        ConsultationId: $('#cboHConsultationType').val(),
        ClinicId: $('#cboHClinic').val(),
        SpecialtyId: $('#cboSpecialty').val(),
        DoctorId: $('#cboDoctorName').val(),
        ScheduleChangeDate: getDate($('#dtScheduleDate')),
        SerialNo: IsStringNullorEmpty($('#txtSerialNumber').val()) ? 0 : $('#txtSerialNumber').val(),
        ScheduleFromTime: $('#txtFromTime').val(),
        ScheduleToTime: $('#txtToTime').val(),
        NoOfPatients: 0,
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    };

    var URL = '';
    if (isUpdate === 0)
        URL = getBaseURL() + '/Doctor/InsertIntoDoctorScheduler';
    else
        URL = getBaseURL() + '/Doctor/UpdateDoctorScheduler';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnClearDoctorScheduler();
                    $("#PopupDoctorScheduler").modal('hide');
                    fnGridRefreshDoctorScheduler();

                    $("#btnSaveDoctorSchedule").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctorSchedule").attr('disabled', false);
                    toastr.error(response.Message);

                }
            }
            else {
                $("#btnSaveDoctorSchedule").attr('disabled', false);
                toastr.error(response.Message);

            }
        },
        error: function (error) {
            $("#btnSaveDoctorSchedule").attr("disabled", false);
            toastr.error(error.statusText);
        }
    });
}

function fnClearDoctorScheduler() {
    $('#txtSerialNumber').val('');
    $('#txtBusinessDesc').val('');
    $('#txtClinicDesc').val('');
    $('#txtConsultationDesc').val('');
    $('#cboSpecialty').val('');
    $('#cboSpecialty').selectpicker('refresh');
    $('#cboDoctorName').val('');
    $('#cboDoctorName').selectpicker('refresh');
    $('#txtFromTime').val('');
    $('#txtToTime').val('');
    $('#dtScheduleDate').val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveDoctorSchedule").html('<i class="far fa-save"></i>' + localization.Save);
}

function fnGridRefreshDoctorScheduler() {
    $("#jqgDoctorScheduler").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEnableDoctorScheduleDetail(val) {
    $("#dtScheduleDate").attr('disabled', val);
    $("#txtFromTime").attr('readonly', val);
    $("#txtToTime").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
}
function fnDeleteDoctorScheduler() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateDoctorScheduler").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Doctor/ActiveOrDeActiveDoctorScheduler?status=' + a_status + '&businesskey=' + $("#cboHBusinessKey").val() + '&consultationId=' + $("#cboHConsultationType").val()
            + '&clinicId=' + $("#cboHClinic").val() + '&specialtyId=' + $("#cboSpecialty").val()
            + '&doctorId=' + $("#cboDoctorName").val() + '&serialNo=' + $("#txtSerialNumber").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateDoctorScheduler").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDoctorScheduler").modal('hide');
                fnClearDoctorScheduler();
                fnGridRefreshDoctorScheduler();
                $("#btnDeactivateDoctorScheduler").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateDoctorScheduler").attr("disabled", false);
                $("#btnDeactivateDoctorScheduler").html('D-Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateDoctorScheduler").attr("disabled", false);
            $("#btnDeactivateDoctorScheduler").html('D-Activate');
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    var btn_editEnable = document.querySelectorAll('#jqgEdit');
    var btn_viewEnable = document.querySelectorAll('#jqgView');
    var btn_deleteEnable = document.querySelectorAll('#jqgDelete');
    for (var i = 0; i < btn_editEnable.length; i++) {
        btn_editEnable[i].disabled = false;
    }
    for (var j = 0; j < btn_viewEnable.length; j++) {
        btn_viewEnable[j].disabled = false;
    }
    for (var k = 0; k < btn_deleteEnable.length; k++) {
        btn_deleteEnable[k].disabled = false;
    }


    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var btn_editDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < btn_editDisable.length; i++) {
            btn_editDisable[i].disabled = true;
            btn_editDisable[i].className = "ui-state-disabled";
        }
    }
    if (_userFormRole.IsView === false) {
        var btn_viewDisable = document.querySelectorAll('#jqgView');
        for (var j = 0; j < btn_viewDisable.length; j++) {
            btn_viewDisable[j].disabled = true;
            btn_viewDisable[j].className = "ui-state-disabled";
        }
    }

    if (_userFormRole.IsDelete === false) {
        var btn_deleteDisable = document.querySelectorAll('#jqgDelete');
        for (var k = 0; k < btn_deleteDisable.length; k++) {
            btn_deleteDisable[k].disabled = true;
            btn_deleteDisable[k].className = "ui-state-disabled";
        }
    }
}