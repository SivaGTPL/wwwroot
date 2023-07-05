$(document).ready(function () {
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

 
    fnLoadPatientList();
    $('#txtSearchBox').on('change focusout', function () {

        var searchString = $("#txtSearchBox").val();

        var f = { groupOp: "OR", rules: [] };

        f.rules.push({ field: "PatientName", op: "cn", data: searchString });
        $("#jqgPatientList")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgPatientList")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "RUhid", op: "cn", data: searchString });
        $("#jqgPatientList")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgPatientList")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "PatientId", op: "cn", data: searchString });
        $("#jqgPatientList")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgPatientList")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "EMailId", op: "cn", data: searchString });
        $("#jqgPatientList")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgPatientList")[0].p.postData, { filters: JSON.stringify(f) });

        f.rules.push({ field: "MobileNumber", op: "cn", data: searchString });
        $("#jqgPatientList")[0].p.search = f.rules.length > 0;
        $.extend($("#jqgPatientList")[0].p.postData, { filters: JSON.stringify(f) });


        $("#jqgPatientList").trigger("reloadGrid", [{ current: true }]);
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

}
function fnLoadPatientList() {

    $("#jqgPatientList").jqGrid('GridUnload');
    

    $("#jqgPatientList").jqGrid(
        {
            url: getBaseURL() + '/PatientRegistration/GetPatientList',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
            colNames: [localization.MRN, "", "", "", localization.PatientName, "", "", localization.Mobile, localization.Email, localization.DateOfBirth, localization.Chat, localization.Other, localization.AppSignIn, ""],
            colModel: [
                { name: "PatientId", width: 50, editable: true, align: 'left', hidden: false },
                { name: "RUhid", width: 50, editable: true, align: 'left', hidden: true },
                { name: "FirstName", width: 100, editable: true, align: 'left', hidden: true },
                { name: "LastName", width: 100, editable: true, align: 'left', hidden: true },
                { name: "PatientName", width: 100, editable: true, align: 'left', hidden: false },
                { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
                { name: "MobileNumber", width: 50, editable: true, align: 'left', hidden: true },
                {
                    name: 'MobileNumber_Full', index: 'MobileNumber_Full', width: 50, formatter: function (cellvalue, options, rowObject) {
                        return '+' + rowObject['Isdcode'] + ' ' + rowObject['MobileNumber'] ;
                    }, sortable: false, sorttype: 'text'
                },
                { name: "EMailId", width: 100, editable: true, align: 'left', hidden: false },               
                { name: "DateOfBirth", width: 50, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'm/d/Y' } },
                { name: "IsChatApplicable", editable: true, width: 30, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
                { name: "IsGuideApplicable", editable: true, width: 30, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
                { name: "AppSignIn", editable: true, width: 30, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
                {
                    name: "Button",  editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnEdit_" + i + " type='button' style='width:145px;'  class='btn btn-primary' onclick=fnEditPatient('" + rowObject.RUhid + "') > <i class='fas fa-edit c-white'></i>  " + localization.Edit + " </button >";
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
            pager: "#jqpPatientList",
            onSelectRow: function (rowid) {

            },
            loadComplete: function (data) {
                fnJqgridSmallScreen('jqgPatientList');
                AutoCompleteList = [];
                var rows = jQuery("#jqgPatientList").getDataIDs();
                for (a = 0; a < rows.length; a++) {
                    row = jQuery("#jqgPatientList").getRowData(rows[a]);

                                      
                    AutoCompleteList.push({ label: row.PatientName, value: row.PatientName });
                    AutoCompleteList.push({ label: row.RUhid, value: row.RUhid });
                    AutoCompleteList.push({ label: row.EMailId, value: row.EMailId });
                    AutoCompleteList.push({ label: row.PatientId, value: row.PatientId });
                    AutoCompleteList.push({ label: row.MobileNumber, value: row.MobileNumber });
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
function fnClearFields() {
    $("#RUhid").val('');
    $("#txtFirstName").val('');
    $("#txtLastName").val('');
    $("#txtDateOfBirth").val('');
    $("#txtEmailID").val('');
    $('#chkChat').parent().removeClass("is-checked");
    $('#chkOther').parent().removeClass("is-checked");
    $('#chkSign').parent().removeClass("is-checked");
}
function fnEditPatient(_uhid) {
    fnClearFields();
    
    var rows = jQuery("#jqgPatientList").getDataIDs();
    for (a = 0; a < rows.length; a++) {
        row = jQuery("#jqgPatientList").getRowData(rows[a]);
        if (row['RUhid'] === _uhid) {
            $("#hdUHID").val(row['RUhid']);
            $("#txtFirstName").val(row['FirstName']);
            $("#txtLastName").val(row['LastName']);
            $("#txtDateOfBirth").val(fnFormatDateJsonToInput(new Date(row['DateOfBirth'])));
            $("#cboMobileNumber").val(row['Isdcode']);
            $("#cboMobileNumber").selectpicker('refresh');
            $("#txtMobileNumber").val(row['MobileNumber']);
            $("#txtEmailID").val(row['EMailId']);
            if (row['IsChatApplicable'] === "true") {
                $('#chkChat').parent().addClass("is-checked");
            }
            if (row['IsGuideApplicable'] === "true") {
                $('#chkOther').parent().addClass("is-checked");
            }
            if (row['AppSignIn'] === "true") {
                $('#chkSign').parent().addClass("is-checked");
            }
            $('#PopuEditPatient').modal('show');
            return;
        }
        
    }




    $.ajax({
        url: getBaseURL() + '/PatientRegistration/GetPatientData',
        data: {
            ServiceID: ServiceID
        },
        success: function (result) {
            $("#txtServiceDesc").val(result.ServiceDesc);
            $("#txtServiceShortDesc").val(result.ServiceShortDesc);
            $("#txtInternalServiceCode").val(result.InternalServiceCode);
            $("#cboGender").val(result.Gender);
            $('#cboGender').
                picker('refresh');
            if (result.IsServiceBillable == true) {
                $('#chkBillable').parent().addClass("is-checked");
            }
            else {
                $('#chkBillable').parent().removeClass("is-checked");
            };

            if (result.ActiveStatus == true) {
                $('#chkActiveStatus').parent().addClass("is-checked");
            }
            else {
                $('#chkActiveStatus').parent().removeClass("is-checked");
            };

            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result.l_ServiceParameter);
        }
    });


    $('#PopupServiceMaster').find('.modal-title').text(localization.EditServiceMaster);
    $("#btnSave").html(localization.Update);

    $('#PopupServiceMaster').modal('show');
}
function fnUpdatePatientMaster() {
    if (!IsValid())
        return;
    try {
        $("#btnAddPatient").attr('disabled', true);

        var obj = {
            RUhid: $('#hdUHID').val(),
            FirstName: $('#txtFirstName').val().trim(),
            LastName: $('#txtLastName').val().trim(),
            Gender: $('#cboGender').val(),
            DateOfBirth: $('#txtDateOfBirth').val(),
            MobileNumber: $('#txtMobileNumber').val().trim(),
            Isdcode: $('#cboMobileNumber').val(),
            EMailId: $('#txtEmailID').val().trim(),
            IsChatApplicable: $("#chkChat").parent().hasClass("is-checked"),
            IsGuideApplicable: $("#chkOther").parent().hasClass("is-checked"),
            AppSignIn: $("#chkSign").parent().hasClass("is-checked"),
        };

        var URL = getBaseURL() + '/PatientRegistration/UpdatePatientData';
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
                    $('#PopuEditPatient').modal('hide');
                    toastr.success("Patient Data Updated");
                    fnLoadPatientList();
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
    //else if (IsStringNullorEmpty($("#cboGender").val())) {
    //    toastr.warning("Please select the Gender");
    //    return false;
    //}
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
    else if (!IsStringNullorEmpty($("#cboMobileNumber").val())) {
        if ($("#cboMobileNumber").val() === '0') {
            toastr.warning("Please Select a Country Code");
            return false;
        }
    }
    return true;
}
function fnSearchPatient(){
    $('#cboApptPatientSearch').val('');
    $('#PopupSearchPatient').modal('show');
}