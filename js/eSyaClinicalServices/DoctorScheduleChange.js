$(document).ready(function () {
    //$("#txtFRMDocSpecialtyChange").timepicker();
    //$("#txtToDocSpecialtyChange").timepicker();
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDocScheduleChange');
        }
    })
});

function fnBindDoctorSchedulechangeLocationbyDoctorId() {
    $('#cboDoctorScheduleChangeLocation').selectpicker('refresh');
    $.ajax({
        type: "Post",
        url: getBaseURL() + '/Doctor/GetDoctorLocationbyDoctorId?doctorId=' + $('#txtDoctorId').val(),
        dataType: "json",
        success: function (data) {
            var opt = $("#cboDoctorScheduleChangeLocation");
            $("#cboDoctorScheduleChangeLocation").empty();
            $("#cboDoctorScheduleChangeLocation").append($("<option value='0'>Choose Location</option>"));
            $.each(data, function () {
                opt.append($("<option />").val(this.BusinessKey).text(this.LocationDescription));
            });
            
            if ($('#cboDoctorScheduleChangeLocation option').length == 2) {
                $('#cboDoctorScheduleChangeLocation').prop('selectedIndex', 1);
                $('#cboDoctorScheduleChangeLocation').selectpicker('refresh');
            } else {

                $("#cboDoctorScheduleChangeLocation").val($('#cboDoctorScheduleChangeLocation option:first').val());
                $('#cboDoctorScheduleChangeLocation').selectpicker('refresh');
            }
            fnLoadScheduleChangeSpecialty();

        },

        error: function (xhr, ajaxOptions, thrownError) {
            alert('Failed to retrieve Doctor Location.');
        }
    });


}

function fnLoadDoctorScheduleChangeGrid() {

    $("#jqgDocScheduleChange").GridUnload();
    $("#jqgDocScheduleChange").jqGrid({
        url: getBaseURL() + '/Doctor/GetDoctorScheduleChangeListAll?businessKey=' + $('#cboDoctorScheduleChangeLocation').val() + '&doctorId=' + $('#txtDoctorId').val(),
        datatype: 'json',
        mtype: 'POST',
        colNames: ["", "", "", "", "", localization.ScheduleDate, localization.Specialty, localization.Clinic, localization.ConsultationType, localization.FromTime, localization.ToTime, localization.Active, ""],
        colModel: [

            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationID", width: 70, editable: true, align: 'left', hidden: true },
            {
                name: "ScheduleChangeDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "ClinicDesc", width: 100, editable: true, align: 'left' },
            { name: "ConsultationType", width: 100, editable: true, align: 'left' },
            
            { name: 'ScheduleFromTime', index: 'Tid', width: 65, editable: true, formatoptions: { mask: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 65, editable: true, formatoptions: { mask: 'ShortTime' }, editrules: { time: true } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'center', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return Fn_EditDoctorScheduleChange(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'

                }
            },

        ],
        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpDocScheduleChange",
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
        loadComplete: function () {
            fnJqgridSmallScreen('jqgDocScheduleChange');
        }
    }).jqGrid('navGrid', '#jqpDocScheduleChange', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDocScheduleChange', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: toRefresh
    });
    fnAddGridSerialNoHeading();
}

function fnRefreshDoctorSchedulerChangeGrid() {
    $("#jqgDocScheduleChange").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnLoadScheduleChangeSpecialty() {

    fnLoadDoctorScheduleChangeGrid();
    
    $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
    $('#cboDoctorScheduleChangeClinic').selectpicker('refresh');
    $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetSpecialtyListByBKeyDoctorId?businessKey=' + $('#cboDoctorScheduleChangeLocation').val() + '&doctorId=' + $('#txtDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
                var options = $("#cboDoctorScheduleChangeSpecialty");
                $("#cboDoctorScheduleChangeSpecialty").empty();
                $("#cboDoctorScheduleChangeSpecialty").append($("<option value='0'>Choose Specialty</option>"));
                $.each(response, function () {
                    options.append($("<option />").val(this.SpecialtyID).text(this.SpecialtyDesc));
            });
            if ($('#cboDoctorScheduleChangeSpecialty option').length == 2) {
                $('#cboDoctorScheduleChangeSpecialty').prop('selectedIndex', 1);
                $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
            } else {

                $("#cboDoctorScheduleChangeSpecialty").val($('#cboDoctorScheduleChangeSpecialty option:first').val());
                $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
            }

            $('#chkDoctorScheduleChangeActive').parent().addClass("is-checked");
            fnLoadScheduleChangeClinic();
            
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

var lstChangeClinicConsultationType;
function fnLoadScheduleChangeClinic() {
    $('#cboDoctorScheduleChangeClinic').selectpicker('refresh');
    $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetDoctorClinicLinkList?businessKey=' + $('#cboDoctorScheduleChangeLocation').val() + '&doctorId=' + $('#txtDoctorId').val() + '&specialtyId=' + $('#cboDoctorScheduleChangeSpecialty').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            if (response != null) {

                lstChangeClinicConsultationType = response;
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

                var options = $("#cboDoctorScheduleChangeClinic");
                $("#cboDoctorScheduleChangeClinic").empty();
                $("#cboDoctorScheduleChangeClinic").append($("<option value='0'>Choose Clinic</option>"));

                $.each(clinics, function () {
                    options.append($("<option />").val(this.ClinicId).text(this.ClinicDesc));
                });
              
                if ($('#cboDoctorScheduleChangeClinic option').length == 2) {
                    $('#cboDoctorScheduleChangeClinic').prop('selectedIndex', 1);
                    $('#cboDoctorScheduleChangeClinic').selectpicker('refresh');
                } else {

                    $("#cboDoctorScheduleChangeClinic").val($('#cboDoctorScheduleChangeClinic option:first').val());
                    $('#cboDoctorScheduleChangeClinic').selectpicker('refresh');
                }
                fnLoadScheduleChangeConsultationType();
            }
           

        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

function fnLoadScheduleChangeConsultationType() {

    $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');

    var value = $('#cboDoctorScheduleChangeClinic').val();

    var options = $("#cboDoctorScheduleChangeConsultationType");

    $("#cboDoctorScheduleChangeConsultationType").empty();

    $("#cboDoctorScheduleChangeConsultationType").append($("<option value='0'>Choose Consultation Type</option>"));

    $.each(lstChangeClinicConsultationType, function () {
        if (this.ClinicId == value) {
            options.append($("<option />").val(this.ConsultationId).text(this.ConsultationDesc));
        }
    })
   
    if ($('#cboDoctorScheduleChangeConsultationType option').length == 2) {
        $('#cboDoctorScheduleChangeConsultationType').prop('selectedIndex', 1);
        $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');
    } else {

        $("#cboDoctorScheduleChangeConsultationType").val($('#cboDoctorScheduleChangeConsultationType option:first').val());
        $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');
    }
}

function Fn_EditDoctorScheduleChange(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDocScheduleChange').jqGrid('getRowData', rowid);

    if (rowData != null) {

        $.ajax({
            url: getBaseURL() + '/Doctor/GetDoctorScheduleChange?businessKey=' + rowData.BusinessKey + '&clinicId=' + rowData.ClinicID + '&specialtyId=' + rowData.SpecialtyID + '&doctorId=' + rowData.DoctorId + '&consultationType=' + rowData.ConsultationID + '&scheduleChangeDate=' + fnGetDateFormat(rowData.ScheduleChangeDate).toDateString(),
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response != null) {
                  
                    $('#hdvDoctorScheduleChangeDate').val(response.ScheduleChangeDate);
                    $('#cboDoctorScheduleChangeLocation').val(response.BusinessKey);
                    $('#cboDoctorScheduleChangeLocation').selectpicker('refresh');
                    $('#cboDoctorScheduleChangeSpecialty').val(response.SpecialtyID);
                    $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
                    fnLoadScheduleChangeClinic();
                    $('#cboDoctorScheduleChangeClinic').val(response.ClinicID);
                    $('#cboDoctorScheduleChangeClinic').selectpicker('refresh');
                    fnLoadScheduleChangeConsultationType();
                    $('#cboDoctorScheduleChangeConsultationType').val(response.ConsultationID);
                    $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');

                    if (response.ScheduleChangeDate !== null) {
                        setDate($('#dtDoctorScheduleChangeDate'), response.ScheduleChangeDate);
                    }
                    else {
                        $('#dtDoctorScheduleChangeDate').val('');
                    }

                    //$('#dtDoctorScheduleChangeDate').val(response.ScheduleChangeDate);
                    $('#txtDoctorScheduleChangeFromTime').val(response.ScheduleFromTime);
                    $('#txtDoctorScheduleChangeToTime').val(response.ScheduleToTime);
                    if (response.ActiveStatus)
                        $('#chkDoctorScheduleChangeActive').parent().addClass("is-checked");
                    else
                        $('#chkDoctorScheduleChangeActive').parent().removeClass("is-checked");

                    $("#btnSaveDoctorScheduleChange").html('<i class="far fa-save"></i> ' + localization.Update);
                    fnDisableControlForUpdate(true);

                }
                else {

                }

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });

    }
}

function fnSaveDoctorScheduleChange() {
    if ($('#txtDoctorId').val() == '') {
        toastr.warning("Please Select Doctor");
        return;
    }
    if ($('#cboDoctorScheduleChangeLocation').val() == '' || $('#cboDoctorScheduleChangeLocation').val() == '0') {
        toastr.warning("Please Select Location");
        $('#cboDoctorScheduleChangeLocation').focus();
        return;
    }
    if ($('#cboDoctorScheduleChangeSpecialty').val() == '' || $('#cboDoctorScheduleChangeSpecialty').val() == '0') {
        toastr.warning("Please Select Specialty");
        $('#cboDoctorScheduleChangeSpecialty').focus();
        return;
    }
    if ($('#cboDoctorScheduleChangeClinic').val() == '' || $('#cboDoctorScheduleChangeClinic').val() == '0') {
        toastr.warning("Please Select Clinic");
        $('#cboDoctorScheduleChangeClinic').focus();
        return;
    }
    if ($('#cboDoctorScheduleChangeConsultationType').val() == '' || $('#cboDoctorScheduleChangeConsultationType').val() == '0') {
        toastr.warning("Please Select Consultation Type");
        $('#cboDoctorScheduleChangeConsultationType').focus();
        return;
    }
    if ($('#dtDoctorScheduleChangeDate').val() == '') {
        toastr.warning("Please Select Schedule Change Date");
        $('#dtDoctorScheduleChangeDate').focus();
        return;
    }
    if ($('#txtDoctorScheduleChangeFromTime').val() >= $('#txtDoctorScheduleChangeToTime').val()) {
        toastr.warning("From Time can't be more than or equal to To Time.");
        $('#txtToTime').focus();
        return;
    }

    $("#btnSaveDoctorScheduleChange").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboDoctorScheduleChangeLocation').val(),
        ConsultationId: $('#cboDoctorScheduleChangeConsultationType').val(),
        ClinicId: $('#cboDoctorScheduleChangeClinic').val(),
        SpecialtyId: $('#cboDoctorScheduleChangeSpecialty').val(),
        DoctorId: $('#txtDoctorId').val(),
        ScheduleChangeDate: getDate($('#dtDoctorScheduleChangeDate')),
        ScheduleFromTime: $('#txtDoctorScheduleChangeFromTime').val(),
        ScheduleToTime: $('#txtDoctorScheduleChangeToTime').val(),
        ActiveStatus: $('#chkDoctorScheduleChangeActive').parent().hasClass("is-checked")
    }

    var URL = '';
    if ($('#hdvDoctorScheduleChangeDate').val() == '')
        URL = getBaseURL() + '/Doctor/InsertDoctorScheduleChange';
    else
        URL = getBaseURL() + '/Doctor/UpdateDoctorScheduleChange';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnClearDoctorScheduleChangeSave();
                    fnLoadDoctorScheduleChangeGrid();

                    $("#btnSaveDoctorScheduleChange").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctorScheduleChange").attr('disabled', false);
                    toastr.error(response.Message);

                }
            }
            else {
                $("#btnSaveDoctorScheduleChange").attr('disabled', false);
                toastr.error(response.Message);

            }
        },
        error: function (error) {
            $("#btnSaveDoctorScheduleChange").attr("disabled", false);
            toastr.error(error.statusText);

        }
    });
}

function fnClearDoctorScheduleChangeSave() {
    $('#cboDoctorScheduleChangeSpecialty').val('0');
    $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
    $('#cboDoctorScheduleChangeClinic').val('0');
    $('#cboDoctorScheduleChangeClinic').selectpicker('refresh');
    $('#cboDoctorScheduleChangeConsultationType').val('0');
    $('#cboDoctorScheduleChangeConsultationType').selectpicker('refresh');
    $('#txtDoctorScheduleChangeFromTime').val('');
    $('#txtDoctorScheduleChangeToTime').val('');
    $('#dtDoctorScheduleChangeDate').val('');
    $('#chkDoctorScheduleChangeActive').parent().addClass("is-checked");

    $('#hdvDoctorScheduleChangeDate').val('');

    $("#btnSaveDoctorScheduleChange").html('<i class="far fa-save"></i> ' + localization.Save);
    fnDisableControlForUpdate(false);
}

function fnDisableControlForUpdate(flag) {

    $('#cboDoctorScheduleChangeSpecialty').attr('disabled', flag);
    $('#cboDoctorScheduleChangeClinic').attr('disabled', flag);
    $('#cboDoctorScheduleChangeConsultationType').attr('disabled', flag);
    $('#dtDoctorScheduleChangeDate').attr('disabled', flag);
    
}