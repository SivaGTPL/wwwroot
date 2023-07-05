$(document).ready(function () {
    fnLoadScheduleSpecialty();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctordaySchedule",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
  
});

//Drop down Methods Start -- -

function fnBusinessLocation_onChange() {

    fnLoadScheduleSpecialty();
}

function fnLoadScheduleSpecialty() {

    //fnLoadDoctorSchedulerGrid();

    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').selectpicker('refresh');
    $('#cboDoctors').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctors/GetSpecialtiesByBusinessKey?businessKey=' + $('#cboBusinessLocation').val(),
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
            if ($('#cboDoctorScheduleSpecialty option').length >= 2) {
                $('#cboDoctorScheduleSpecialty').prop('selectedIndex', 1);
                $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
            } else {

                $("#cboDoctorScheduleSpecialty").val($('#cboDoctorScheduleSpecialty option:first').val());
                $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
            }

            fnLoadScheduleClinic();
            //fnLoadScheduleConsultationType();
            //fnLoadScheduleDoctors();
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
    $('#cboDoctors').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctors/GetClinicAndConsultationTypebySpecialty?businessKey=' + $('#cboBusinessLocation').val() + '&specialtyId=' + $('#cboDoctorScheduleSpecialty').val(),
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
                if ($('#cboDoctorClinic option').length >= 2) {
                    $('#cboDoctorClinic').prop('selectedIndex', 1);
                    $('#cboDoctorClinic').selectpicker('refresh');
                } else {
                    $("#cboDoctorClinic").val($('#cboDoctorClinic option:first').val());
                    $('#cboDoctorClinic').selectpicker('refresh');
                }

                fnLoadScheduleConsultationType();
                //fnLoadScheduleDoctors();
            }


        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

function fnLoadScheduleConsultationType() {

    $('#cboScheduleConsultationType').selectpicker('refresh');
    $('#cboDoctors').selectpicker('refresh');

    var value = $('#cboDoctorClinic').val();

    var options = $("#cboScheduleConsultationType");
    $("#cboScheduleConsultationType").empty();
    $("#cboScheduleConsultationType").append($("<option value='0'>Choose Consultation Type</option>"));
    $.each(lstClinicConsultationType, function () {
        if (this.ClinicId == value) {
            options.append($("<option />").val(this.ConsultationId).text(this.ConsultationDesc));
        }
    })
    if ($('#cboScheduleConsultationType option').length >= 2) {
        $('#cboScheduleConsultationType').prop('selectedIndex', 1);
        $('#cboScheduleConsultationType').selectpicker('refresh');
    } else {

        $("#cboScheduleConsultationType").val($('#cboScheduleConsultationType option:first').val());
        $('#cboScheduleConsultationType').selectpicker('refresh');
    }
    fnLoadScheduleDoctors();
}

function fnLoadScheduleDoctors() {

    $('#cboDoctors').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctors/GetDoctorsbySpecialtyClinicAndConsultation?businessKey=' + $('#cboBusinessLocation').val() + '&specialtyId=' + $('#cboDoctorScheduleSpecialty').val()
            + '&clinicId=' + $('#cboDoctorClinic').val() + '&consultationId=' + $('#cboScheduleConsultationType').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {

            var options = $("#cboDoctors");
            $("#cboDoctors").empty();
            $("#cboDoctors").append($("<option value='0'>Choose Doctor</option>"));
            $.each(response, function () {
                options.append($("<option />").val(this.DoctorId).text(this.DoctorName));
            });
            if ($('#cboDoctors option').length >= 2) {
                $('#cboDoctors').prop('selectedIndex', 1);
                $('#cboDoctors').selectpicker('refresh');
            } else {

                $("#cboDoctors").val($('#cboDoctors option:first').val());
                $('#cboDoctors').selectpicker('refresh');
            }

            //$('#chkScheduleActive').parent().addClass("is-checked");
            //fnLoadScheduleClinic();
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

function fnClearDoctordaySchedule() {
    
    $('#cboDoctorScheduleSpecialty').val('0');
    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
    $('#cboDoctorClinic').val('0');
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').val('0');
    $('#cboScheduleConsultationType').selectpicker('refresh');
    $('#cboDoctors').val('0');
    $('#cboDoctors').selectpicker('refresh');
    $('#dtfromdate').val('');
    $('#dttodate').val('');
    
}

//Drop down Method Ends --- -

//Grid Part and functionality Starts-- -

function fnLoadDoctordaySchedulebySearchCriteria() {

    fnLoadDoctordayScheduleGrid();
}

function fnLoadDoctordayScheduleGrid() {

    $("#jqgDoctordaySchedule").GridUnload();

    $("#jqgDoctordaySchedule").jqGrid({

        url: getBaseURL() + '/Doctors/GetDoctordaySchedulebySearchCriteria?businessKey=' + $('#cboBusinessLocation').val() + '&specialtyId=' + $('#cboDoctorScheduleSpecialty').val()
            + '&clinicId=' + $('#cboDoctorClinic').val() + '&consultationId=' + $('#cboScheduleConsultationType').val() + '&doctorId=' + $('#cboDoctors').val()
            + '&scheduleFromDate=' + getDate($('#dtfromdate')) + '&scheduleToDate=' + getDate($('#dttodate')),
        datatype: 'json',
        mtype: 'POST',
        //ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        //serializeGridData: function (postdata) {
        //    postdata.doctorId = $('#txtDoctorId').val();
        //    return JSON.stringify(postdata.doctorId);
        //},
        colNames: ["", "", "", "", "", "", localization.SpecialtyDesc, localization.ClinicDesc, localization.ConsultationType, localization.DoctorName, localization.ScheduleDate, localization.ScheduleFromTime, localization.ScheduleToTime, localization.NoOfPatients, localization.XlsheetReference, localization.Active, ""],
        colModel: [

            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationId", width: 100, editable: true, align: 'left', hidden: true },
            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "ClinicDesc", width: 80, editable: true, align: 'left' },
            { name: "ConsultationDesc", width: 130, editable: true, align: 'left' },
            { name: "DoctorName", width: 130, editable: true, align: 'left' },
            {
                name: "ScheduleDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: 'ScheduleFromTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: "NoOfPatients", width: 60, editable: true, align: 'left', hidden: false },
            { name: "XlsheetReference", width: 80, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctordaySchedule"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpDoctordaySchedule",
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
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgDoctordaySchedule');
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

    }).jqGrid('navGrid', '#jqpDoctordaySchedule', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctordaySchedule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctordaySchedule
        }).jqGrid('navButtonAdd', '#jqpDoctordaySchedule', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctordaySchedule
    });
    fnAddGridSerialNoHeading();
}

function fnRefreshDoctordaySchedule() {
    $("#jqgDoctordaySchedule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

var _isInsert = true;

function fnAddDoctordaySchedule() {
    $("#PopupDoctordaySchedule").modal('show');
    $('#PopupDoctordaySchedule').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDoctordaySchedule').find('.modal-title').text(localization.AddDoctordaySchedule);
    $("#chkActiveStatus").parent().addClass("is-checked");
    fnClearFields();
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDoctordaySchedule").html('<i class="fa fa-save"></i>  ' + localization.Save);
    $("#btnSaveDoctordaySchedule").show();
    $("#btndeActiveDoctordaySchedule").hide();
    _isInsert = true;
}

function fnEditDoctordaySchedule(e, actiontype) {

    var rowid = $("#jqgDoctordaySchedule").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctordaySchedule').jqGrid('getRowData', rowid);
    _isInsert = false;

    $('#cboBusinessLocation').val(rowData.BusinessKey).selectpicker('refresh');
    $('#cboDoctorScheduleSpecialty').val(rowData.SpecialtyId).selectpicker('refresh');
    $('#cboDoctorClinic').val(rowData.ClinicId).selectpicker('refresh');
    $('#cboScheduleConsultationType').val(rowData.ConsultationId).selectpicker('refresh');
    $('#cboDoctors').val(rowData.DoctorId).selectpicker('refresh');

    if (rowData.ScheduleDate !== null) {
        setDate($('#dtfromdate'), fnGetDateFormat(rowData.ScheduleDate));
    }
    else {
        $('#dtfromdate').val('');
    }

    $('#txtDoctordayScheduleFromTime').val(rowData.ScheduleFromTime);
    $('#txtDoctordayScheduleToTime').val(rowData.ScheduleToTime);
    $('#txtXlSheetReference').val(rowData.XlsheetReference);
    $('#txtcurrentdocNumber').val(rowData.CurrentDocNumber);
    $('#txtNoofPatients').val(rowData.NoOfPatients);
    $('#txtSerialNumber').val(rowData.SerialNo);
   
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDoctordaySchedule").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("your Not Authorized to Edit");
            return;
        }
        $('#PopupDoctordaySchedule').modal('show');
        $('#PopupDoctordaySchedule').find('.modal-title').text(localization.EditDoctordaySchedule);
        $("#btnSaveDoctordaySchedule").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveDoctordaySchedule").show();
        $("#btndeActiveDoctordaySchedule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDoctordaySchedule").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("your Not Authorized to View");
            return;
        }
        $('#PopupDoctordaySchedule').modal('show');
        $('#PopupDoctordaySchedule').find('.modal-title').text(localization.ViewDoctordaySchedule);
        $("#btnSaveDoctordaySchedule").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctordaySchedule").hide();
        $("#btndeActiveDoctordaySchedule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDoctordaySchedule").on('hidden.bs.modal', function () {
            $("#btnSaveDoctordaySchedule").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("your Not Authorized to Delete");
            return;
        }
        $('#PopupDoctordaySchedule').modal('show');
        $('#PopupDoctordaySchedule').find('.modal-title').text("Activate/De Activate Doctor Day Schedule");
        $("#btndeActiveDoctordaySchedule").show();
        $("#btndeActiveDoctordaySchedule").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctordaySchedule").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDoctordaySchedule").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDoctordaySchedule").html(localization.Activate);
        }

        $("#chkActiveStatus").prop('disabled', true);

        $("#PopupDoctordaySchedule").on('hidden.bs.modal', function () {
            $("#btnSaveDoctordaySchedule").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveDoctordaySchedule() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0') {
        toastr.warning("Please Select Location");
        return;
        $('#cboBusinessLocation').focus();
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleSpecialty").val()) || $("#cboDoctorScheduleSpecialty").val() === '0') {
        toastr.warning("Please Select Specialty");
        return;
        $('#cboDoctorScheduleSpecialty').focus();
    }
    if (IsStringNullorEmpty($("#cboDoctorClinic").val()) || $("#cboDoctorClinic").val() === '0') {
        toastr.warning("Please Select Clinic");
        return;
        $('#cboDoctorClinic').focus();
    }
    if (IsStringNullorEmpty($("#cboScheduleConsultationType").val()) || $("#cboScheduleConsultationType").val() === '0') {
        toastr.warning("Please Select Consultation Type");
        return;
        $('#cboScheduleConsultationType').focus();
    }
    if (IsStringNullorEmpty($("#cboDoctors").val()) || $("#cboDoctors").val() === '0') {
        toastr.warning("Please Select Doctor");
        return;
        $('#cboDoctors').focus();
    }

    if (IsStringNullorEmpty($("#dtfromdate").val())) {
        toastr.warning("Please Select Schedule Date");
        return;
        $('#dtfromdate').focus();
    }
    if (IsStringNullorEmpty($("#txtDoctordayScheduleFromTime").val())) {
        toastr.warning("Please Select Schedule From Time");
        return;
        $('#txtDoctordayScheduleFromTime').focus();
    }
    if (IsStringNullorEmpty($("#txtDoctordayScheduleToTime").val())) {
        toastr.warning("Please Select Schedule To Time");
        return;
        $('#txtDoctordayScheduleToTime').focus();
    }

    if ($('#txtDoctordayScheduleFromTime').val() >= $('#txtDoctordayScheduleToTime').val()) {
        toastr.warning("From Time can't be more than or equal to To Time.");
        $('#txtDoctordayScheduleToTime').focus();
        return;
    }
    if (IsStringNullorEmpty($("#txtNoofPatients").val())) {
        toastr.warning("Please Enter Number of Patients");
        return;
        $('#txtNoofPatients').focus();
    }
    if (IsStringNullorEmpty($("#txtXlSheetReference").val())) {
        toastr.warning("Please Select Xl Sheet Reference");
        return;
        $('#txtXlSheetReference').focus();
    }

    $("#btnSaveDoctordaySchedule").attr('disabled', true);

    var obj = {

        BusinessKey: $('#cboBusinessLocation').val(),
        ConsultationId: $('#cboScheduleConsultationType').val(),
        ClinicId: $('#cboDoctorClinic').val(),
        SpecialtyId: $('#cboDoctorScheduleSpecialty').val(),
        DoctorId: $('#cboDoctors').val(),
        ScheduleDate: getDate($("#dtfromdate")),
        SerialNo: $("#txtSerialNumber").val() === '' ? 0 : $("#txtSerialNumber").val(),
        ScheduleFromTime: $('#txtDoctordayScheduleFromTime').val(),
        ScheduleToTime: $('#txtDoctordayScheduleToTime').val(),
        NoOfPatients: $('#txtNoofPatients').val(),
        XlsheetReference: $('#txtXlSheetReference').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    };
    $.ajax({
        url: getBaseURL() + '/Doctors/InsertOrUpdateDoctordaySchedule',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#PopupDoctordaySchedule").modal('hide');
                    //fnLoadDoctordayScheduleGrid();

                    fnRefreshDoctordaySchedule();
                    fnClearFields();
                   
                    $("#btnSaveDoctordaySchedule").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctordaySchedule").attr('disabled', false);
                    toastr.error(response.Message);

                }
            }
            else {
                $("#btnSaveDoctordaySchedule").attr('disabled', false);
                toastr.error(response.Message);

            }
        },
        error: function (error) {
            $("#btnSaveDoctordaySchedule").attr("disabled", false);
            toastr.error(error.statusText);

        }
    });
}

function fnDeleteDoctordaySchedule() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    var objdel = {

        BusinessKey: $('#cboBusinessLocation').val(),
        ConsultationId: $('#cboScheduleConsultationType').val(),
        ClinicId: $('#cboDoctorClinic').val(),
        SpecialtyId: $('#cboDoctorScheduleSpecialty').val(),
        DoctorId: $('#cboDoctors').val(),
        ScheduleDate: getDate($("#dtfromdate")),
        SerialNo: $("#txtSerialNumber").val() === '' ? 0 : $("#txtSerialNumber").val(),
        ScheduleFromTime: $('#txtDoctordayScheduleFromTime').val(),
        ScheduleToTime: $('#txtDoctordayScheduleToTime').val(),
        NoOfPatients: $('#txtNoofPatients').val(),
        XlsheetReference: $('#txtXlSheetReference').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked"),
        status: a_status,
    };
    
    $("#btndeActiveDoctordaySchedule").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Doctors/ActiveOrDeActiveDoctordaySchedule',
        type: 'POST',
        datatype: 'json',
        data: { objdel },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDoctordaySchedule").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDoctordaySchedule").modal('hide');
                fnRefreshDoctordaySchedule();
                fnClearFields();
                $("#btndeActiveDoctordaySchedule").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDoctordaySchedule").attr("disabled", false);
                $("#btndeActiveDoctordaySchedule").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDoctordaySchedule").attr("disabled", false);
            $("#btndeActiveDoctordaySchedule").html('De Activate');
        }
    });
}

$("#btnCancelDoctordaySchedule").click(function () {
    $("#jqgDoctordaySchedule").jqGrid('resetSelection');
    $('#PopupDoctordaySchedule').modal('hide');
    fnClearFields();
});

function fnClearFields()
{
    $('#txtDoctordayScheduleFromTime').val('');
    $('#txtDoctordayScheduleToTime').val('');
    $('#txtXlSheetReference').val('');
    $('#txtNoofPatients').val('');
    $('#txtSerialNumber').val('');
    $("#btnSaveDoctordaySchedule").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#btnSaveDoctordaySchedule").html('<i class="far fa-save"></i> ' + localization.Save);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
//Grid Part and functionality Ends -- -


//Export To Excel

function fnExportToExcel() {

    window.location.href = getBaseURL() + '/Doctors/Export?businessKey=' + $('#cboBusinessLocation').val() + '&specialtyId=' + $('#cboDoctorScheduleSpecialty').val()
        + '&clinicId=' + $('#cboDoctorClinic').val() + '&consultationId=' + $('#cboScheduleConsultationType').val() + '&doctorId=' + $('#cboDoctors').val()
        + '&scheduleFromDate=' + getDate($('#dtfromdate')) + '&scheduleToDate=' + getDate($('#dttodate'));
}
//Export To Excel Ends

//Import Excel
function fnImportExcel() {

   
    if (IsStringNullorEmpty($("#postedFile").val())) {
        toastr.warning("Please Select Excel file");
        return;
    }
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0') {
        toastr.warning("Please Select Location");
        return;
    }
    $("#btnImportExcel").attr('disabled', true);
    var obj = new FormData();
    //appending  file object
    obj.append("postedFile", $("#postedFile").get(0).files[0]);
    obj.append("BusinessKey", $("#cboBusinessLocation").val());
    $.ajax({
        url: getBaseURL() + '/Doctors/Insert_ImpotedDoctorScheduleList',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#btnImportExcel").attr('disabled', false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnImportExcel").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnImportExcel").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnImportExcel").attr("disabled", false);
        }
    });
    $("#btnImportExcel").attr('disabled', false);
}
// End Import Excel