var _UT = 0;
var l_appr = {
    '1': 'Laparoscopic',
    '2': 'Robotic'
};
var l_anes = {
    '1': 'General',
    '2': 'Regional'
};
var l_sur = {
    '1': 'LAGB',
    '2': 'Sleeve Gastrectomy',
    '4': 'RYGB',
    '5': 'VBG',
    '6': 'butterfly gastroplasty',
    '7': 'Intragastric ballon/capsule',
    '8': 'gastric plication',
    '9': 'SADI-S',
    '10': 'SASI',
    '11': 'MGB (OAGB)'
};
var l_fType = {
    'PO': localization.PreOperative,
    'FS': localization.FacilityStay,
    'SF': localization.FollowUpSurgical,
    'NF': localization.FollowUpNutrition
};
$(document).ready(function () {
    _UT = $('#hdUT').val();
});
$.get(getBaseURL() + '/PatientRegistration/GetPatientByUHID', {
    uhid: $('#hdUHID').val()
}, function (result, status) {
    //$(document).ready(function () {


    $('#lblPatientName').html(result[0].PatientName);
    $('#lblGender').html(result[0].Gender);
    $('#lblAge').html(result[0].Age + 'Y');
    $('#lblDOA').html(fnFormatDateJsonToInput(result[0].DateOfBirth));
    $('#lblEmail').html(result[0].PatientEmailID);
    $('#lblPatientID').html(result[0].PatientID);
    $('#lblTel').html(result[0].PatientMobileNumber);
    $('#lblBMI').html(result[0].BMI);
    $('#lblApproach').html(l_appr[result[0].Approach]);
    $('#lblAnesthesia').html(l_anes[result[0].Anesthesia]);
    var sur = result[0].SurgeryCode;
    if (sur != "0" && sur != null) {
        const d = new Date(result[0].SurgeryDate)
        var _month = d.getMonth() + 1;
        $('#lblSurgeryDate').html(d.getDate() + '-' + _month + '-' + d.getFullYear());
        if (sur == "12") {
            $('#lblSurgery').html(result[0].SurgeryName);
        }
        else {
            $('#lblSurgery').html(l_sur[result[0].SurgeryCode] + result[0].SurgeryName);
        }
    }

    fnsideBarSetup();
    fnLoadFormsDetail();
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
           // fnJqgridSmallScreen('jqgFormsDetail');
        }
    });
});

function fnLoadFormsDetail() {

    $("#jqgFormsDetail").jqGrid('GridUnload');
    $("#jqgFormsDetail").jqGrid(
        {
            url: getBaseURL() + '/PatientClinicalForms/GetFormDetailByType',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                fType: 'All',
                UHID: $('#hdUHID').val()
            },
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
            colNames: [localization.TransactionDate, localization.VisitNumber, localization.FormType, localization.Actions],
            colModel: [
                { name: "TransactionDate", width: 20, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                { name: "VisitNumber", width: 20, editable: true, align: 'left', hidden: false },
                {
                    name: "CLType", width: 30, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_fType
                    },
                },
                {
                    name: "Button", width: 30, editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnEMR_" + i + " type='button' style='margin-right: 5px;'  class='btn btn-primary' onclick=fnOpenForm('" + rowObject.VisitNumber + "','" + rowObject.CLType + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.ViewForm + " </button >";
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
            pager: "#jqpFormsDetail",
            onSelectRow: function (rowid) {

            }
        });


}

function fnOpenForm(appKey, ftype) {
    var url = "";
    var uhid = $('#hdUHID').val();
    if (ftype === "PO") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PreOperative?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "FS") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/FacilityStay?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "SF") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/SurgicalFollowup?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "NF") {
        if (_UT != '20001' && _UT != '20008' && _UT != '20009') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/NutritionFollowup?UHID=' + uhid + '&AppKey=' + appKey;
    }
    if (ftype === "EMR") {
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PatientEMR?UHID=' + uhid;
    }
    document.location.assign(url);
    //window.open(
    //    url,
    //    '_blank' // <- This is what makes it open in a new window.
    //);

}

function fnAddNewForm(ftype) {
    var msg = "";
    var url = "";
    var uhid = $('#hdUHID').val();

    if (ftype === "PO") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Pre-Operative form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PreOperative?UHID=' + uhid + '&AppKey=';
    }
    if (ftype === "FS") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Facility Stay form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/FacilityStay?UHID=' + uhid + '&AppKey=';
    }
    if (ftype === "SF") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Surgical Follow-Up form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/SurgicalFollowup?UHID=' + uhid + '&AppKey=';
    }
    if (ftype === "NF") {
        if (_UT != '20001' && _UT != '20008' && _UT != '20009') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Nutrition Follow-Up form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/NutritionFollowup?UHID=' + uhid + '&AppKey=';
    }

    var obj = {

    };
    bootbox.confirm({
        message: msg,
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                fnProcessLoading(true);
                $.ajax({
                    url: getBaseURL() + '/PatientRegistration/AddDummyVisit',
                    type: 'POST',
                    datatype: 'json',
                    data: obj,
                    success: function (response) {
                        if (response.Status === true) {
                            document.location.assign(url + response.Message);
                            //window.open(
                            //    url + response.Message,
                            //    '_blank' // <- This is what makes it open in a new window.
                            //);
                        }
                        else {
                            fnProcessLoading(false);
                            toastr.error(response.Message);
                        }
                    },
                    error: function (error) {
                        fnProcessLoading(false);
                        toastr.error(error.statusText);
                    }
                });
            }
        }
    });
}
 
$('.main-heading').click(function () {
    if ($('.sidebar').hasClass('hide') == true) {
        var sidebarW = $('.sidebar').width();
        $('.sidebar').toggleClass('hide');
        $('#mainContent').removeClass('moveLeft').css('width', '100%');
    }
    else {
        $('.sidebar').addClass('hide');
        $('#mainContent').css('width', '100%').addClass('moveLeft');
    }
});
function fnRefreshGridWidth() {
    $("#jqgFormsDetail").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $('div[id*="jqg"]').jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
}