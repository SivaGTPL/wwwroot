var _UT = 0;
var l_vType = {
    'N': localization.NewConsultation,
    'S': localization.FollowUpSurgical,
    'R': localization.FollowUpNutrition
};

var l_rChannel = {
    '0': "Clinic",
    '1': "App",
}

$(document).ready(function () {
    _UT = $('#hdUT').val();
    if (_UT != '20001' && _UT != '20008' && _UT != '20009') { 
        $('#divVType').hide();
        $('#divAddPatient').hide();
        $('#cboVisitType').append(new Option(' ', '0'));
        $('#cboVisitType').selectpicker('refresh');
        $('#cboVisitType').val('0');
        $('#cboVisitType').selectpicker('refresh');
    }
        if (_UT == '20009') 
            {
                $('#divVType').hide();
                $('#divAddPatient').hide();
                $('#cboVisitType').val('R');
                $('#cboVisitType').selectpicker('refresh');
            }
    $("#cboApptPatientSearch").autocomplete({
        source: getBaseURL() + '/AppointmentSchedular/GetPatientSearch',
        minLength: 3,
        select: function (event, ui) {
            var url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PatientEMR?UHID=' + ui.item.HospitalNumber;
           // document.location.assign(getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PatientEMR?UHID=' + ui.item.HospitalNumber);
            window.open(
                url,
                '_blank' // <- This is what makes it open in a new window.
            );
        }
    });

    fnSetCurrentdate();

    //if (_userFormRole.IsNutrition === true) {
    //    $('#cboVisitType').val('N');
    //    $('#cboVisitType').selectpicker('refresh');
    //    fnLoadAppointmentDetail();
    //}
    //else if (_userFormRole.IsSurgeon === true) {
    //    fnLoadAppointmentDetail();
    //}
    //else {
    //    $('#cboVisitType').val('');
    //    $('#cboVisitType').selectpicker('refresh');
    //}
    fnLoadAppointmentDetail();
    $('#txtSearchBox').on('change focusout', function () {

        var searchString = $("#txtSearchBox").val();

        var f = { groupOp: "OR", rules: [] };

        f.rules.push({ field: "PatientName", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "UHID", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "PatientID", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "PatientMobileNumber", op: "cn", data: searchString });
        $("#jqgAppointmentDetail")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgAppointmentDetail")[0].p.postData, { filters: JSON.stringify(f) });


        $("#jqgAppointmentDetail").trigger("reloadGrid", [{ current: true }]);
    });
});
function fnSetCurrentdate() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    document.getElementById("txtfromdate").value = today;
    document.getElementById("txttodate").value = today;
}
function fnLoadAppointmentDetail() {

    $("#jqgAppointmentDetail").jqGrid('GridUnload');
    var fromdate = $("#txtfromdate").val();
    var todate = $("#txttodate").val();

    if (fromdate == "" || fromdate == null) {
        fnAlert("Please select From Date", "e");
        return false;
    }
    if (todate == "" || todate == null) {
        fnAlert("Please select To Date", "e");
        return false;
    }

    $("#jqgAppointmentDetail").jqGrid(
        {
            url: getBaseURL() + '/PatientRegistration/GetAppointmentDetailByDate',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                startDate: fromdate,
                endDate: todate,
                vType: $('#cboVisitType').val(),
                status: $('#cboAPStatus').val()
            },
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
            colNames: [localization.VisitNumber, localization.MRN, localization.MRN, localization.PatientName, localization.Mobile, localization.Email, localization.VisitType,"Request Channel", localization.AppointmentDate, localization.AppointmentTime, localization.Status, /* "Reffered By", "Created By", "Create Date", "Modified By", "Modify Date",*/localization.CaseSummary, localization.Forms],
            //colNames: ["Booking Number", "MRN", "Patient Name", "Mobile", "Email", "Visit Type", "Appointment Date", "Appointment Time", "Status", /* "Reffered By", "Created By", "Create Date", "Modified By", "Modify Date",*/ "Actions"],
            colModel: [
                { name: "AppointmentKey", width: 50, editable: true, align: 'left', hidden: false },
                { name: "PatienID", width: 50, editable: true, align: 'left', hidden: true },
                { name: "UHID", width: 50, editable: true, align: 'left', hidden: true },
                
                { name: "PatientName", width: 100, editable: true, align: 'left', hidden: false },
                { name: "PatientMobileNumber", width: 50, editable: true, align: 'left', hidden: false },
                { name: "PatientEmailID", width: 100, editable: true, align: 'left', hidden: false },
                {
                    name: "EpisodeType", width: 60, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_vType
                    },
                },
                {
                    name: "RequestChannel", width: 60, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_rChannel
                    },
                },
                { name: "AppointmentDate", width: 50, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                { name: "AppointmentFromTime", width: 50, editable: true, align: 'center', hidden: false },
                { name: "AppointmentStatus", width: 50, editable: true, align: 'left', hidden: true },
                //{ name: "RefferedBy", width: 80, editable: true, align: 'left', hidden: false },
                //{ name: "StrCreatedBy", width: 60, editable: true, align: 'left', hidden: false },
                //{ name: "CreadtedOn", width: 110, editable: true, align: 'left', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                //{ name: "StrModifiedBy", width: 60, editable: true, align: 'left', hidden: false },
                //{ name: "ModifiedOn", width: 110, editable: true, align: 'left', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                {
                    name: "Button",  editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnEMR_" + i + " type='button' style='width:145px;'  class='btn btn-primary' onclick=fnOpenForm('EMR','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i>  " + localization.CaseSummary + " </button >";
                    }
                },
                {
                    name: "Button", width: 200, editable: false, align: 'left', hidden: true, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnPreOP_" + i + " type='button' style='margin-right: 5px; width:145px;'  class='btn btn-primary' onclick=fnOpenForm('PO','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.PreOperative + " </button >"
                            +
                            "<button id=btnSFoll_" + i + " type='button' style='margin-right: 5px; width:145px;' class='btn btn-primary' onclick=fnOpenForm('SF','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.FollowUpSurgical + " </button >"
                            +
                            "<button id=btnFStay_" + i + " type='button' style='margin-right: 5px; width:145px;' class='btn btn-primary' onclick=fnOpenForm('FS','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.FacilityStay + " </button >"
                            +
                            "<button id=btnNFoll_" + i + " type='button' style='margin-right: 5px; width:145px;' class='btn btn-primary' onclick=fnOpenForm('NF','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.FollowUpNutrition + " </button >";
                    }
                },
            ],
            rowNum: 100000,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            scroll: false,
            loadonce: true,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: false,
            pager: "#jqpAppointmentDetail",
            onSelectRow: function (rowid) {

            },
            loadComplete: function (data) {
                fnJqgridSmallScreen('jqgAppointmentDetail');
                AutoCompleteList = [];
                var rows = jQuery("#jqgAppointmentDetail").getDataIDs();
                for (a = 0; a < rows.length; a++) {
                    row = jQuery("#jqgAppointmentDetail").getRowData(rows[a]);

                    if (row['EpisodeType'].startsWith('N')) {
                        $("#btnPreOP_" + rows[a]).show();
                        $("#btnFStay_" + rows[a]).show();
                        $("#btnSFoll_" + rows[a]).hide();
                        $("#btnNFoll_" + rows[a]).hide();
                    }
                    else if (row['EpisodeType'].startsWith('S')) {
                        $("#btnPreOP_" + rows[a]).hide();
                        $("#btnFStay_" + rows[a]).show();
                        $("#btnSFoll_" + rows[a]).show();
                        $("#btnNFoll_" + rows[a]).hide();
                    }
                    else if (row['EpisodeType'].startsWith('R')) {
                        $("#btnPreOP_" + rows[a]).hide();
                        $("#btnFStay_" + rows[a]).hide();
                        $("#btnSFoll_" + rows[a]).hide();
                        $("#btnNFoll_" + rows[a]).show();
                    }
                    else  {
                        $("#btnPreOP_" + rows[a]).hide();
                        $("#btnFStay_" + rows[a]).hide();
                        $("#btnSFoll_" + rows[a]).hide();
                        $("#btnNFoll_" + rows[a]).hide();
                    }


                    
                    AutoCompleteList.push({ label: row.PatientName, value: row.PatientName });
                    AutoCompleteList.push({ label: row.UHID, value: row.UHID });
                    AutoCompleteList.push({ label: row.PatientID, value: row.PatientID });
                    AutoCompleteList.push({ label: row.PatientMobileNumber, value: row.PatientMobileNumber });
                }
                $("#txtSearchBox").autocomplete({
                    source: AutoCompleteList
                });

                $("#txtSearchBox").autocomplete({
                    source: AutoCompleteList
                });
            }
        });


}
function fnOpenForm(ftype,appKey,uhid) {
    var url = "";
    if (ftype === "PO") {
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PreOperative?UHID=' + uhid + '&AppKey=' + appKey ;
    }
    if (ftype === "FS") {
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/FacilityStay?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "SF") {
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/SurgicalFollowup?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "NF") {
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/NutritionFollowup?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "EMR") {
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PatientEMR?UHID=' + uhid;
    }

    //window.location.replace(url);
    window.open(
        url,
        '_blank' // <- This is what makes it open in a new window.
    );
 
}
function fnInsertInToPatientMaster() {
    if (!IsValid())
        return;
    try {
        $("#btnAddPatient").attr('disabled', true);

        var obj = {
            UHID: '0',

            FirstName: $('#txtFirstName').val().trim(),
            LastName: $('#txtLastName').val().trim(),
            Gender: $('#cboGender').val(),
            DateOfBirth: $('#txtDateOfBirth').val(),
            Isdcode: $('#cboMobileNumber').val(),
            MobileNumber: $('#txtMobileNumber').val().trim(),
            EMailId: $('#txtEmailID').val().trim(),
        };

        var URL = getBaseURL() + '/PatientRegistration/InsertInToPatientMaster';
        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            async: true,
            success: function (response) {

                if (response.Status) {
                    $("#btnAddPatient").attr('disabled', false);
                    $('#PopupAddPatient').modal('hide');
                     toastr.success("Patient Added");
                }
                else {
                    toastr.error(response.Message);
                }

                $("#btnAddPatient").attr('disabled', false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnAddPatient").attr('disabled', false);
            }
        });
    }
    catch
    {
        toastr.error("error");
        $("#btnAddPatient").attr('disabled', false);
    }
}
function fnClearPatientInput() {

    $('#txtFirstName').val("");
    $('#txtLastName').val("");
    $('#txtMobileNumber').val("");
    $('#txtEmailID').val("");
    $('#cboGender').val("");
    $('#txtDateOfBirth').val("");


}
function fnAddNewPatient() {
    fnClearPatientInput();
    $('#PopupAddPatient').modal('show');
}
function IsValid() {

    if (IsStringNullorEmpty($("#txtFirstName").val())) {
        toastr.warning("Please Enter the First Name");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtLastName").val())) {
        toastr.warning("Please Enter the Last Name");
        return false;
    }
    else if (IsStringNullorEmpty($("#cboGender").val())) {
        toastr.warning("Please select a Gender");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtDateOfBirth").val())) {
        toastr.warning("Please Enter the Date of Birth");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtMobileNumber").val())) {
        toastr.warning("Please Enter the Mobile Number");
        return false;
    }
    else if (!IsStringNullorEmpty($("#txtEmailID").val())) {
        if (!$("#txtEmailID").inputmask("isComplete")) {
            toastr.warning("Please Enter the valid Email ID");
            return false;
        }
    }
    return true;
}
function fnSearchPatient(){
    $('#cboApptPatientSearch').val('');
    $('#PopupSearchPatient').modal('show');
}