$(document).ready(function () {
     
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorSchedule');
        }
    })
});
function fnBindDoctorScheduleLocationbyDoctorId() {
    $('#cboDoctorLocation').selectpicker('refresh');
    $.ajax({
        type: "Post",
        url: getBaseURL() + '/Doctor/GetDoctorLocationbyDoctorId?doctorId=' + $('#txtDoctorId').val(),
        dataType: "json",
        success: function (data) {
            var opt = $("#cboDoctorLocation");
            $("#cboDoctorLocation").empty();
            $("#cboDoctorLocation").append($("<option value='0'>Choose Location</option>"));
            $.each(data, function () {
                opt.append($("<option />").val(this.BusinessKey).text(this.LocationDescription));
            });
            if ($('#cboDoctorLocation option').length == 2) {
                $('#cboDoctorLocation').prop('selectedIndex', 1);
                $('#cboDoctorLocation').selectpicker('refresh');
            } else {

                $("#cboDoctorLocation").val($('#cboDoctorLocation option:first').val());
                $('#cboDoctorLocation').selectpicker('refresh');
            }
            fnLoadScheduleSpecialty();

        },

        error: function (xhr, ajaxOptions, thrownError) {
            alert('Failed to retrieve Doctor Location.');
        }
    });


}

function fnLoadDoctorSchedulerGrid() {

    $("#jqgDoctorSchedule").GridUnload();

    $("#jqgDoctorSchedule").jqGrid({

        url: getBaseURL() + '/Doctor/GetDoctorScheduleListAll?businessKey=' + $('#cboDoctorLocation').val() + '&doctorId=' + $('#txtDoctorId').val(),
        datatype: 'json',
        mtype: 'POST',
        //ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        //serializeGridData: function (postdata) {
        //    postdata.doctorId = $('#txtDoctorId').val();
        //    return JSON.stringify(postdata.doctorId);
        //},
        colNames: ["", "", "", "", "", "", localization.Specialty, localization.Clinic, localization.ConsultationType, localization.Dayoftheweek, localization.NumberofPatients, localization.Week1, localization.Week2, localization.Week3, localization.Week4, localization.Week5, localization.FromTime, localization.ToTime, localization.Active, ""],
        colModel: [

            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationID", width: 100, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "ClinicDesc", width: 80, editable: true, align: 'left' },
            { name: "ConsultationType", width: 130, editable: true, align: 'left' },
            { name: "DayOfWeek", width: 70, editable: true, align: 'left' },
            { name: "NoOfPatients", width: 60, editable: true, align: 'left', hidden: false },
            { name: "Week1", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week2", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week3", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week4", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week5", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: 'ScheduleFromTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'center', width: 90, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid"  title="Edit" onclick="return Fn_EditDoctorSchedule(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'

                }
            },

        ],

        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpDoctorSchedule",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgDoctorSchedule');
        }
    }).jqGrid('navGrid', '#jqpDoctorSchedule', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctorSchedule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctorSchedule()
    });
    fnAddGridSerialNoHeading();
}

function fnRefreshDoctorSchedule() {
    $("#jqgDoctorSchedule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnLoadScheduleSpecialty() {

    fnLoadDoctorSchedulerGrid();

    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetSpecialtyListByBKeyDoctorId?businessKey=' + $('#cboDoctorLocation').val() + '&doctorId=' + $('#txtDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            
            var options = $("#cboDoctorScheduleSpecialty");
            $("#cboDoctorScheduleSpecialty").empty();
            $("#cboDoctorScheduleSpecialty").append($("<option value='0'>Choose Specialty</option>"));
            $.each(response, function () {
                options.append($("<option />").val(this.SpecialtyID).text(this.SpecialtyDesc));
            });
            if ($('#cboDoctorScheduleSpecialty option').length == 2) {
                $('#cboDoctorScheduleSpecialty').prop('selectedIndex', 1);
                $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
            } else {

                $("#cboDoctorScheduleSpecialty").val($('#cboDoctorScheduleSpecialty option:first').val());
                $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
            }

            $('#chkScheduleActive').parent().addClass("is-checked");
            fnLoadScheduleClinic();
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

var lstClinicConsultationType;
function fnLoadScheduleClinic() {
  
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetDoctorClinicLinkList?businessKey=' + $('#cboDoctorLocation').val() + '&doctorId=' + $('#txtDoctorId').val() + '&specialtyId=' + $('#cboDoctorScheduleSpecialty').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            if (response != null) {

                lstClinicConsultationType = response;
                var clinics = [];
                $.each(response, function (j, v) {
                    var cl = { ClinicId: v.ClinicId, ClinicDesc: v.ClinicDesc };
                    if (clinics.length == 0) {
                        clinics.push(cl);
                    }
                    else {
                        var valExist = false;
                        $.each(clinics, function (i, value) {
                            if (value.ClinicId == v.ClinicId) {
                                valExist = true;
                                return false;
                            }
                            
                        });
                        if (valExist == false) {
                            clinics.push(cl);
                        }
                    }
                });
        
                var options = $("#cboDoctorClinic");
                $("#cboDoctorClinic").empty();
                $("#cboDoctorClinic").append($("<option value='0'>Choose Clinic</option>"));
                $.each(clinics, function () {
                    options.append($("<option />").val(this.ClinicId).text(this.ClinicDesc));
                });
               
                if ($('#cboDoctorClinic option').length == 2) {
                    $('#cboDoctorClinic').prop('selectedIndex', 1);
                    $('#cboDoctorClinic').selectpicker('refresh');
                } else {

                    $("#cboDoctorClinic").val($('#cboDoctorClinic option:first').val());
                    $('#cboDoctorClinic').selectpicker('refresh');
                }

                fnLoadScheduleConsultationType();
            }
           

        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

function fnLoadScheduleConsultationType() {

    $('#cboScheduleConsultationType').selectpicker('refresh');

    var value = $('#cboDoctorClinic').val();

    var options = $("#cboScheduleConsultationType");
    $("#cboScheduleConsultationType").empty();
    $("#cboScheduleConsultationType").append($("<option value='0'>Choose Consultation Type</option>"));
    $.each(lstClinicConsultationType, function () {
        if (this.ClinicId == value) {
            options.append($("<option />").val(this.ConsultationId).text(this.ConsultationDesc));
        }
    })
    if ($('#cboScheduleConsultationType option').length == 2) {
        $('#cboScheduleConsultationType').prop('selectedIndex', 1);
        $('#cboScheduleConsultationType').selectpicker('refresh');
    } else {

        $("#cboScheduleConsultationType").val($('#cboScheduleConsultationType option:first').val());
        $('#cboScheduleConsultationType').selectpicker('refresh');
    }  
}

function Fn_EditDoctorSchedule(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDoctorSchedule').jqGrid('getRowData', rowid);

    if (rowData != null) {

        $.ajax({
            url: getBaseURL() + '/Doctor/GetDoctorSchedule?businessKey=' + rowData.BusinessKey + '&clinicId=' + rowData.ClinicID + '&specialtyId=' + rowData.SpecialtyID + '&doctorId=' + rowData.DoctorId + '&consultationType=' + rowData.ConsultationID + '&serialNo=' + rowData.SerialNo,
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response !== null) {

                    $('#hdvDoctorScheduleSerialNo').val(response.SerialNo);
                    $('#cboDoctorLocation').val(response.BusinessKey);
                    $('#cboDoctorLocation').selectpicker('refresh');
                    $('#cboDoctorScheduleSpecialty').val(response.SpecialtyID);
                    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
                    fnLoadScheduleClinic();
                    $('#cboDoctorClinic').val(response.ClinicID);
                    $('#cboDoctorClinic').selectpicker('refresh');
                    fnLoadScheduleConsultationType();
                    $('#cboScheduleConsultationType').val(response.ConsultationID);
                    $('#cboScheduleConsultationType').selectpicker('refresh');
                    $('#cboDoctorScheduleWeekDays').val(response.DayOfWeek);
                    $('#cboDoctorScheduleWeekDays').selectpicker('refresh');
                    $('#txtFromTime').val(response.ScheduleFromTime);
                    $('#txtToTime').val(response.ScheduleToTime);
                    $('#txtNumberOfPatients').val(response.NoOfPatients);
                    if (response.Week1)
                        $('#chkWeek1').parent().addClass("is-checked");
                    else
                        $('#chkWeek1').parent().removeClass("is-checked");
                    if (response.Week2)
                        $('#chkWeek2').parent().addClass("is-checked");
                    else
                        $('#chkWeek2').parent().removeClass("is-checked");
                    if (response.Week3)
                        $('#chkWeek3').parent().addClass("is-checked");
                    else
                        $('#chkWeek3').parent().removeClass("is-checked");
                    if (response.Week4)
                        $('#chkWeek4').parent().addClass("is-checked");
                    else
                        $('#chkWeek4').parent().removeClass("is-checked");
                    if (response.Week5)
                        $('#chkWeek5').parent().addClass("is-checked");
                    else
                        $('#chkWeek5').parent().removeClass("is-checked");
                    if (response.ActiveStatus)
                        $('#chkScheduleActive').parent().addClass("is-checked");
                    else
                        $('#chkScheduleActive').parent().removeClass("is-checked");

                    $("#btnSaveDoctorSchedule").html('<i class="far fa-save"></i> ' + localization.Update);
                    
                }
               

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });

    }
}

function fnSaveDoctorSchedule() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        toastr.warning("Please Select Doctor");
        return;
    }
    if ($('#cboDoctorLocation').val() == '' || $('#cboDoctorLocation').val() == '0') {
        toastr.warning("Please Select Location");
        $('#cboDoctorLocation').focus();
        return;
    }
    if ($('#cboDoctorScheduleSpecialty').val() == '' || $('#cboDoctorScheduleSpecialty').val() == '0') {
        toastr.warning("Please Select Specialty");
        $('#cboDoctorScheduleSpecialty').focus();
        return;
    }
    if ($('#cboDoctorClinic').val() == '' || $('#cboDoctorClinic').val() == '0') {
        toastr.warning("Please Select Clinic");
        $('#cboDoctorClinic').focus();
        return;
    }
    if ($('#cboScheduleConsultationType').val() == '' || $('#cboScheduleConsultationType').val() == '0') {
        toastr.warning("Please Select Consultation Type");
        $('#cboScheduleConsultationType').focus();
        return;
    }
    if ($('#cboDoctorScheduleWeekDays').val() == '0') {
        toastr.warning("Please Select Day of the week");
        $('#cboDoctorScheduleWeekDays').focus();
        return;
    }
    if ($('#txtFromTime').val() >= $('#txtToTime').val()) {
        toastr.warning("From Time can't be more than or equal to To Time.");
        $('#txtToTime').focus();
        return;
    }
    if (!$('#chkWeek1').parent().hasClass("is-checked") && !$('#chkWeek2').parent().hasClass("is-checked") && !$('#chkWeek3').parent().hasClass("is-checked")
        && !$('#chkWeek4').parent().hasClass("is-checked") && !$('#chkWeek5').parent().hasClass("is-checked")) {
        toastr.warning("Please Select at least 1 Week");
        $('#chkWeek1').focus();
        return;
    }

    $("#btnSaveDoctorSchedule").attr('disabled', true);

    var obj = {
        SerialNo: $('#hdvDoctorScheduleSerialNo').val(),
        BusinessKey: $('#cboDoctorLocation').val(),
        ConsultationId: $('#cboScheduleConsultationType').val(),
        ClinicId: $('#cboDoctorClinic').val(),
        SpecialtyId: $('#cboDoctorScheduleSpecialty').val(),
        DoctorId: $('#txtDoctorId').val(),
        DayOfWeek: $('#cboDoctorScheduleWeekDays').val(),
        ScheduleFromTime: $('#txtFromTime').val(),
        ScheduleToTime: $('#txtToTime').val(),
        NoOfPatients: $('#txtNumberOfPatients').val(),
        Week1: $('#chkWeek1').parent().hasClass("is-checked"),
        Week2: $('#chkWeek2').parent().hasClass("is-checked"),
        Week3: $('#chkWeek3').parent().hasClass("is-checked"),
        Week4: $('#chkWeek4').parent().hasClass("is-checked"),
        Week5: $('#chkWeek5').parent().hasClass("is-checked"),
        RoomNo: '-',
        ActiveStatus: $('#chkScheduleActive').parent().hasClass("is-checked")
    };

    var URL = '';
    if ($('#hdvDoctorScheduleSerialNo').val() == '')
        URL = getBaseURL() + '/Doctor/InsertDoctorSchedule';
    else
        URL = getBaseURL() + '/Doctor/UpdateDoctorSchedule';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    if ($('#hdvDoctorScheduleSerialNo').val() == '')
                        fnClearDoctorScheduleSave();
                    else
                        fnClearDoctorSchedule();
                    fnLoadDoctorSchedulerGrid();

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

function fnClearDoctorScheduleSave() {
    $('#cboDoctorScheduleWeekDays').val('0');
    $('#cboDoctorScheduleWeekDays').selectpicker('refresh');
    $('#txtFromTime').val('');
    $('#txtToTime').val('');
    $('#txtNumberOfPatients').val('');
    $('#chkWeek1').parent().removeClass("is-checked");
    $('#chkWeek2').parent().removeClass("is-checked");
    $('#chkWeek3').parent().removeClass("is-checked");
    $('#chkWeek4').parent().removeClass("is-checked");
    $('#chkWeek5').parent().removeClass("is-checked");
    $('#chkScheduleActive').parent().addClass("is-checked");

    $('#hdvDoctorScheduleSerialNo').val('');

    $("#btnSaveDoctorSchedule").html('<i class="far fa-save"></i> ' + localization.Save);
}

function fnClearDoctorSchedule() {
    //$('#cboDoctorLocation').val('0');
    //$('#cboDoctorLocation').selectpicker('refresh');
    $('#cboDoctorScheduleSpecialty').val('0');
    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
    $('#cboDoctorClinic').val('0');
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').val('0');
    $('#cboScheduleConsultationType').selectpicker('refresh');
    $('#cboDoctorScheduleWeekDays').val('0');
    $('#cboDoctorScheduleWeekDays').selectpicker('refresh');
    $('#txtFromTime').val('');
    $('#txtToTime').val('');
    $('#txtNumberOfPatients').val('');
    $('#chkWeek1').parent().removeClass("is-checked");
    $('#chkWeek2').parent().removeClass("is-checked");
    $('#chkWeek3').parent().removeClass("is-checked");
    $('#chkWeek4').parent().removeClass("is-checked");
    $('#chkWeek5').parent().removeClass("is-checked");
    $('#chkScheduleActive').parent().addClass("is-checked");

    $('#hdvDoctorScheduleSerialNo').val('');

    $("#btnSaveDoctorSchedule").html('<i class="far fa-save"></i> ' + localization.Save);
}