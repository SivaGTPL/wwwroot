var _procedures = 3;
var _inv = 2;
var _UT = 0;
var _vNumber = 0;

var l_inv = {

};
var l_ser = {

};
var l_medc = {

};
var l_invs = {

};
var l_sers = {

};

var g_inv = ":Select;";
var g_invs = ":Select;";
var g_ser = ":Select;";
var g_sers = ":Select;";
var g_medc = ":Select;";



Date.prototype.timeToInput = function () {
    return ('0' + (this.getHours())).substr(-2, 2) + ':' + ('0' + this.getMinutes()).substr(-2, 2);
};

$(function () {
   fnProcessLoading(true);
    $("#mainContent").on('scroll', function () {
        // alert($("#mainContent").offset().top)
    });
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        // Do something
        // console.log(scroll);
    });

});
$(document).ready(function () {
    
    
});
$.get(getBaseURL() + '/ClinicalForms/GetPatientByUHID', {
    uhid: $('#hdUHID').val()
}, function (result, status) {

    setTimeout(function () {
        // fnProcessLoading(true);
    }, 200);
    
    $('#lblPatientName').html(result[0].PatientName);
    $('#lblGender').html(result[0].Gender);
    $('#lblAge').html(result[0].Age + 'Y');
    $('#lblDOB').html(fnFormatDateJsonToInput(result[0].DateOfBirth));
    //$('#lblEmail').html(result[0].PatientEmailID);
    $('#lblPatientID').html(result[0].PatientID);
    $('#lblTel').html(result[0].PatientMobileNumber);
    $('#lblPatName').html(result[0].PatientName);
    $('#lblPatAge').html(result[0].PatientID + ' - ' + result[0].Age + 'Y - ' + result[0].Gender);

    $.when(fnGetOPNumber())
        .then(fnLoadVisitInfo())
        .then(fnGetMasterData())
        .then(Utils_ClinicalCharts.populateClinicalTemplate("TRI"))
        .then(getClinicalInformation("TRI", function (data) {
            Utils_ClinicalCharts.setTemplateInformation(data);
        })) 
        .then(Utils_ClinicalCharts.gridClinicalCharts("ALLE"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("CRON"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("MED"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("DIAG"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("INV"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("SER"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("DOC"))


});
var l_val = [];
function fnGetOPNumber() {
    if ($('#hdvNumber').val() === '0') {
        $.ajax({
            url: getBaseURL() + '/DoctorDesk/GetLastOPNumber',
            type: "GET",
            enctype: 'multipart/form-data',
            async: false,
            data: {
                uhid: $('#hdUHID').val()
            },
            success: function (result) {
                _vNumber = result;
                $('#hdvNumber').val(result);
            },
            error: function (err) {
                toastr.error(err.statusText);
            }
        });
    }
    else {
        _vNumber = $('#hdvNumber').val();
    }
   
}
function fnGetMasterData() {
    $.ajax({
        url: getBaseURL() + '/Master/GetServiceClassesByTypeID',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        data: {
            serviceType: _inv
        },
        success: function (result) {
            l_val.push({ "value": '', "text": 'Select' });
            //l_val.push({ "value": 0, "text": 'All' });
            for (i = 0; i < result.length; i++) {
                l_val.push({ "value": result[i].ServiceClassId, "text": result[i].ServiceClassDesc });
                if (i == result.length - 1) {
                    g_inv += "" + result[i].ServiceClassId + ":" + result[i].ServiceClassDesc + "";
                }
                else {
                    g_inv += "" + result[i].ServiceClassId + ":" + result[i].ServiceClassDesc + ";";
                }
            }
            l_inv = l_val;
            l_val = [];
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
    $.ajax({
        url: getBaseURL() + '/Master/GetServiceClassesByTypeID',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        data: {
            serviceType: _procedures
        },
        success: function (result) {
            l_val.push({ "value": '', "text": 'Select' });
            //l_val.push({ "value": 0, "text": 'All' });
            for (i = 0; i < result.length; i++) {
                l_val.push({ "value": result[i].ServiceClassId, "text": result[i].ServiceClassDesc });
                if (i == result.length - 1) {
                    g_ser += "" + result[i].ServiceClassId + ":" + result[i].ServiceClassDesc + "";
                }
                else {
                    g_ser += "" + result[i].ServiceClassId + ":" + result[i].ServiceClassDesc + ";";
                }
            }
            l_ser = l_val;
            l_val = [];
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
    $.ajax({
        url: getBaseURL() + '/Master/GetServiceCodesByClassID',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        data: {
            serviceClass: 0,
            serviceType: _inv
        },
        success: function (result) {
            for (i = 0; i < result.length; i++) {
                l_val.push({ "value": result[i].ServiceId, "text": result[i].ServiceDesc });
                if (i == result.length - 1) {
                    g_invs += "" + result[i].ServiceId + ":" + result[i].ServiceDesc + "";
                }
                else {
                    g_invs += "" + result[i].ServiceId + ":" + result[i].ServiceDesc + ";";
                }
            }
            l_invs = l_val;
            l_val = [];
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
    $.ajax({
        url: getBaseURL() + '/Master/GetServiceCodesByClassID',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        data: {
            serviceClass: 0,
            serviceType: _procedures
        },
        success: function (result) {
            for (i = 0; i < result.length; i++) {
                l_val.push({ "value": result[i].ServiceId, "text": result[i].ServiceDesc });
                if (i == result.length - 1) {
                    g_sers += "" + result[i].ServiceId + ":" + result[i].ServiceDesc + "";
                }
                else {
                    g_sers += "" + result[i].ServiceId + ":" + result[i].ServiceDesc + ";";
                }
            }
            l_sers = l_val;
            l_val = [];
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
    l_val.push({ "value": '', "text": 'Select' });
    $.ajax({
        url: getBaseURL() + '/Master/GetDrugMaster',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        success: function (result) {
            for (i = 0; i < result.length; i++) {
                l_val.push({ "value": result[i].DrugCode, "text": result[i].DrugBrand });
                if (i == result.length - 1) {
                    g_medc += "" + result[i].DrugCode + ":" + result[i].DrugBrand + "";
                }
                else {
                    g_medc += "" + result[i].DrugCode + ":" + result[i].DrugBrand + ";";
                }
            }
            l_medc = l_val;
            l_val = [];
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
}
function fnGetServices(_serviceClass) {
    $("#INV-1 option[value='']").remove();
    $('#INV-1').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/Master/GetServiceCodesByClassID',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        data: {
            serviceClass: _serviceClass,
            serviceType: _inv
        },
        success: function (result) {
            $("#INV-2").empty();
            for (i = 0; i < result.length; i++) {
                $("#INV-2").append('<option value="' + result[i].ServiceId + '">' + result[i].ServiceDesc + '</option>');
            }
            $('#INV-2').selectpicker('refresh');
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
}
function fnGetProceServices(_serviceClass) {
    $("#SER-1 option[value='']").remove();
    $('#SER-1').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/Master/GetServiceCodesByClassID',
        type: "GET",
        enctype: 'multipart/form-data',
        async: false,
        data: {
            serviceClass: _serviceClass,
            serviceType: _procedures
        },
        success: function (result) {
            $("#SER-2").empty();
            for (i = 0; i < result.length; i++) {
                $("#SER-2").append('<option value="' + result[i].ServiceId + '">' + result[i].ServiceDesc + '</option>');
            }
            $('#SER-2').selectpicker('refresh');
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
}
function fnPopulateServiceClass() {
    $("#INV-1").empty();
    for (i = 0; i < l_inv.length; i++) {
        $("#INV-1").append('<option value="' + l_inv[i].value + '">' + l_inv[i].text + '</option>');
    }
    $('#INV-1').selectpicker('refresh');
}
function fnPopulateProceServiceClass() {
    $("#SER-1").empty();
    for (i = 0; i < l_ser.length; i++) {
        $("#SER-1").append('<option value="' + l_ser[i].value + '">' + l_ser[i].text + '</option>');
    }
    $('#SER-1').selectpicker('refresh');
}
function fnPopulateDrugMaster() {
    $("#MED-1").empty();
    for (i = 0; i < l_medc.length; i++) {
        $("#MED-1").append('<option value="' + l_medc[i].value + '">' + l_medc[i].text + '</option>');
    }
    $('#MED-1').selectpicker('refresh');
}
var _isUpdate = false;
var _intTransactionId = 0;

var Utils_ClinicalCharts = {

    gridClinicalCharts: function (type) {

        var cl_result;
        var cl_catalog;
        var gv_colNames = [];
        var gv_colModel = [];
        var gv_colId = [];
        var gv_data = [];

        var cl_cols = 0;

        gv_colNames.push("Date");
        gv_colModel.push({
            name: 'TransactionDate', index: 'TransactionDate', width: 130, frozen: true, sortable: true, editable: true, formatter: "date",
            formatoptions: { srcformat: "ISO8601Long", newformat: _cnfjqgDateFormat + " h:i A" }
        });
        gv_colId.push("TransactionDate");

        gv_colNames.push("ID");
        gv_colModel.push({
            name: "TransactionID", width: 90, hidden: true, frozen: true, sortable: true, editable: true
        });
        gv_colId.push("TransactionID");

        gv_colNames.push("Visit");
        gv_colModel.push({
            name: "VisitNumber", width: 90, hidden: true, frozen: true, sortable: true, editable: true
        });
        gv_colId.push("VisitNumber");

        $.get(getBaseURL() + '/ClinicalForms/GetInformationValueView',
            {
                UHID: $('#hdUHID').val(),
                vNumber: -1,
                clType: type
            }, function (data, status) {
                cl_result = data;
            }).then(function () {
                $.getJSON(getBaseURL() + "/json/PatientManagement/patientemr.json",
                    function (data) {
                        cl_catalog = data;
                        var i = 0;
                        var d = data.filter(element => element.cltype === type);

                        $.each(d, function (key, item_nav) {
                            $.each(item_nav.item, function (keys, item_control) {
                                if ($('#lblGender').html() === item_control.specific_to || IsStringNullorEmpty(item_control.specific_to)) {
                                    if (item_control.valuetype !== "header" && item_control.valuetype !== "checklist" && item_control.valuetype !== "checklist_l") {
                                        gv_colNames.push(item_control.name);
                                        if (item_control.valuetype === "combox") {
                                            if (type === "INV") {
                                                if (item_control.name === 'Test Name') {
                                                    gv_colModel.push({
                                                        name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                        edittype: 'select', editoptions: {
                                                            value: g_invs
                                                        }
                                                    });
                                                }
                                                else {
                                                    gv_colModel.push({
                                                        name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                        edittype: 'select', editoptions: {
                                                            value: g_inv,
                                                        }
                                                    });
                                                }
                                            }
                                            else if (type === "MED") {
                                                if (item_control.name === 'Medication') {
                                                    gv_colModel.push({
                                                        name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                        edittype: 'select', editoptions: {
                                                            value: g_medc
                                                        }
                                                    });
                                                }
                                                else {
                                                    gv_colModel.push({
                                                        name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                        edittype: 'select', editoptions: {
                                                            value: l_med
                                                        }
                                                    });
                                                }
                                            }

                                            else {
                                                gv_colModel.push({ name: item_control.controlid, width: 80 });
                                            }
                                        }
                                        else {
                                            gv_colModel.push({ name: item_control.controlid, width: 80 });
                                        }
                                        gv_colId.push(item_control.controlid);

                                    }
                                    else {
                                        cl_cols = item_control.controlid;

                                    }
                                }
                            });
                        });

                    }).then(function () {
                        $.each(cl_result, function (key, data) {
                            //console.log('result')
                            //console.log(data)
                            //console.log('catalog')
                            //console.log(cl_catalog)
                            var dataRow = {};
                            var dataColumn = "";
                            var dataValue = "";
                            $.each(gv_colId, function (keys, colId) {
                                if (colId === "TransactionID") {
                                    dataRow["TransactionID"] = data.TransactionID;
                                }
                                else if (colId === "TransactionDate") {
                                    dataRow["TransactionDate"] = data.TransactionDate;
                                }
                                else if (colId === "VisitNumber") {
                                    dataRow["VisitNumber"] = data.VisitNumber;
                                }
                                else if (colId === "ChartNumber") {
                                    dataRow["ChartNumber"] = data.ChartNumber;
                                }
                                else {
                                    $.each(data.l_ControlValue, function (ky, cl) {
                                        if (cl.CLControlID === colId) {
                                            if (cl.CLControlID === colId) {
                                                if (cl.CLControlID === "INV-5" || cl.CLControlID === "DOC-3") {
                                                    dataRow[colId] = '<div style="display:flex"><a class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid f-11" href="' + getBaseURL() + '/ClinicalFormsAttachments/' + cl.Value + '" target="_blank">View</a>';
                                                }

                                                else {
                                                    dataRow[colId] = cl.Value;
                                                }

                                            }

                                        }

                                    });
                                }

                            });
                            gv_data.push(dataRow);
                        });
                        //console.log(JSON.stringify(gv_colNames));
                        //console.log(JSON.stringify(gv_colModel));
                        //console.log(JSON.stringify(gv_data));
                    }).then(function () {

                        gv_colNames.push("Action");
                        gv_colModel.push({
                            name: 'edit', search: false, align: 'left', width: 90,
                            formatter: function (cellValue, options, rowdata, action) {
                                return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editPopupInfo(\'' + type + '\',event,\'view\')"><i class="far fa-eye"></i> </button>'
                                    +
                                    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editPopupInfo(\'' + type + '\',event,\'delete\')"><i class="fas fa-trash"></i> </button>';
                                //+
                                //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editClinicalCharts(\'' + type + '\',event,\'view\')"><i class="far fa-eye"></i> </button>';
                            }
                        });

                        if (type === "MED") {

                            $("#jqgMedication").jqGrid('GridUnload');
                            $("#jqgMedication").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpMedication",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    //$("[class*='ui-jqgrid']").css('width', '100%');
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
                                }
                            }).jqGrid('navGrid', '#jqpMedication', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();

                        }
                        else if (type === "INV") {
                            $("#jqgInvestigations").jqGrid('GridUnload');
                            $("#jqgInvestigations").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpInvestigations",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
                                }
                            }).jqGrid('navGrid', '#jqpInvestigations', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();
                            fnProcessLoading(false);
                        }
                        else if (type === "SER") {
                            $("#jqgServices").jqGrid('GridUnload');
                            $("#jqgServices").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpServices",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
                                }
                            }).jqGrid('navGrid', '#jqpServices', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();
                            fnProcessLoading(false);
                        }
                        else if (type === "ALLE") {
                            $("#jqgAllergy").jqGrid('GridUnload');
                            $("#jqgAllergy").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpAllergy",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
                                }
                            }).jqGrid('navGrid', '#jqpAllergy', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();
                        }
                        else if (type === "CRON") {

                            $("#jqgChronicCondition").jqGrid('GridUnload');
                            $("#jqgChronicCondition").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpChronicCondition",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
                                }
                            }).jqGrid('navGrid', '#jqpChronicCondition', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();

                        }
                        else if (type === "DIAG") {
                            $("#jqgDiagnosis").jqGrid('GridUnload');
                            $("#jqgDiagnosis").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpDiagnosis",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');

                                }
                            }).jqGrid('navGrid', '#jqpDiagnosis', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();

                        }
                        else if (type === "DOC") {
                            $("#jqgDocumentUpload").jqGrid('GridUnload');
                            $("#jqgDocumentUpload").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpDocumentUpload",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function () {
                                    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid").css('width', '100%');
                                }
                            }).jqGrid('navGrid', '#jqpDocumentUpload', { add: false, edit: false, search: false, del: false, refresh: false })
                                ;
                            fnRefreshGridWidth();


                        }


                    });
            });

    },
    populateClinicalTemplate: function (type) {

        var section_item = "";
        return new Promise(function (resolve) {
            $.getJSON(getBaseURL() + "/json/PatientManagement/patientemr.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);

                $.each(d, function (key, item_nav) {
                    section_item = "<div class='row border-bottom m-0'>";

                    $.each(item_nav.item, function (keys, item_control) {
                        if ($('#lblGender').html() === item_control.specific_to || IsStringNullorEmpty(item_control.specific_to)) {
                            var readonly = "";
                            if (item_control.readonly === "Y") {
                                readonly = "readonly";
                            }
                            if (item_control.valuetype === "") {

                            }
                            if (item_control.valuetype === "header") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' ><h5>" + item_control.name + "</h5><hr></div>";
                            }
                            if (item_control.valuetype === "heading") {
                                section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 pl-0'><h6 class='main-heading'>" + item_control.name + "</h6></div>";
                            }
                            if (item_control.valuetype === "htmltag") {
                                section_item += "<div>" + item_control.name + "</div>";
                            }
                            if (item_control.valuetype === "float") {
                                if (type === "NC")
                                    section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><div class= 'form-group'>";
                                else
                                    section_item += "<div class='col-lg-4 col-md-4 col-sm-4 pl-0' " + readonly + "><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";

                                var eventName = "";
                                var readonly = "";
                                if (item_control.readonly === "Y")
                                    readonly = "readonly";

                                if (item_control.event === "Y") {
                                    eventName = "Utils_ClinicalCharts.onChange_ClinicalValue('" + item_control.formula + "')";
                                }

                                if (!IsStringNullorEmpty(item_control.controlid_2)) {
                                    section_item += "<input id='" + item_control.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>  / ";
                                    section_item += "<input id='" + item_control.controlid_2 + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>";
                                }
                                else
                                    section_item += "<input id='" + item_control.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:80px' onchange=" + eventName + " >";

                                section_item += "<span class='f-italic'>" + item_control.unittype + "</span>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "text") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<input id='" + item_control.controlid + "' class='form-control' type='text' />";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "ltext") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<input id='" + item_control.controlid + "' class='form-control' type='text' />";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "textarea") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='3' cols='90'></textarea>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "textarea_l") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='3' cols='90'></textarea>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "textarea_xl") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='7' cols='90'></textarea>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "textarea_xxl") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='50' cols='90'></textarea>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "checkbox") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class='row pb-2'>";
                                section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + item_control.name + "</label></div>";
                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + item_control.controlid + "_y' class='mr-1' name=" + item_control.controlid + " value='Y'>Yes</label></div>";
                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + item_control.controlid + "_n' class='mr-1' name=" + item_control.controlid + " value='N'>No</label></div>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "checklist") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0' style='margin-bottom: 15px;'>";
                                section_item += "<label class='lblCheck' for='" + item_control.controlid + "'>";
                                section_item += "<input id='" + item_control.controlid + "' class='' type='checkbox' />";
                                section_item += "<span class='pl-2'>" + item_control.name + "</span>";
                                section_item += "</label></div>";

                            }
                            if (item_control.valuetype === "checklist_l") {
                                if (item_control.controlid.startsWith('PO3')) {
                                    section_item += "<div class='col-10 pl-0' id='childs_" + item_control.controlid + "' style='margin-bottom: 15px;'>";
                                    section_item += "<div class='col-lg-12 col-md-12 col-sm-12' ><h6 class='main-heading'>" + item_control.name + "</h6><hr></div>";
                                    section_item += "<div class='row  pl-5 pt-3' >";
                                    $.each(item_control.child, function (keys, chd) {
                                        if (chd.controlid.startsWith('PO3')) {
                                            if (chd.valuetype === "checklist") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0' style='margin-bottom: 15px;'>";
                                                section_item += "<label class='lblCheck' for='" + chd.controlid + "'>";
                                                section_item += "<input id='" + chd.controlid + "' class='' type='checkbox'  />";
                                                section_item += "<span class=''>" + chd.name + "</span>";
                                                section_item += "</label></div>";
                                            }
                                            if (chd.valuetype === "text") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<input id='" + chd.controlid + "' class='form-control' type='text' />";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "textarea") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<textarea id='" + chd.controlid + "' class='form-control' rows='3'  cols='90'></textarea>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "combox") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<select class='selectpicker form-control' id='" + chd.controlid + "' data-container='body'>";
                                                section_item += "<option value='0' selected>NA</option>";
                                                $.each(chd.values, function (keyv, item_values) {
                                                    section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                                                });
                                                section_item += "</select>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "datetime") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<input id='" + chd.controlid + "' class='form-control' type='datetime-local'  />";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "date") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<input id='" + chd.controlid + "' class='form-control' type='date' />";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "checkbox") {
                                                section_item += "<div class='col-lg-6 col-md-8 col-sm-6 pl-0'><div class='row pb-2'>";
                                                section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + chd.name + "</label></div>";
                                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + chd.controlid + "_y' class='mr-1' name=" + chd.controlid + " value='Y' >Yes</label></div>";
                                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + chd.controlid + "_n' class='mr-1' name=" + chd.controlid + " value='N' >No</label></div>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "float") {
                                                section_item += "<div class='col-lg-4 col-md-4 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";

                                                var eventName = "";
                                                var readonly = "";
                                                if (chd.readonly === "Y")
                                                    readonly = "readonly";

                                                if (chd.event === "Y") {
                                                    eventName = "Utils_ClinicalCharts.onChange_ClinicalValue('" + chd.formula + "')";
                                                }

                                                if (!IsStringNullorEmpty(chd.controlid_2)) {
                                                    section_item += "<input id='" + chd.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px' >  / ";
                                                    section_item += "<input id='" + chd.controlid_2 + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px' >";
                                                }
                                                else
                                                    section_item += "<input id='" + chd.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:80px'  onchange=" + eventName + " >";

                                                section_item += "<span class='f-italic'>" + chd.unittype + "</span>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "heading") {
                                                section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 pl-0 form-group'><label>" + chd.name + "</label></div>";
                                            }
                                            if (chd.valuetype === "grid") {
                                                section_item += "<div class='row mr-0' style='margin-right:0px;'>";
                                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px'>";
                                                section_item += "<table id='jqg" + chd.type + chd.controlid + "'></table>";
                                                section_item += "<div id='jqp" + chd.type + chd.controlid + "'></div>";
                                                section_item += "</div>";
                                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                                                section_item += "<button type='button' class='mdl-button' onclick=add" + chd.type + "('" + chd.value + "')><i class='fa fa-plus'></i></button>";
                                                section_item += "</div></div><br>";
                                            }
                                        }

                                    });
                                    section_item += "</div>";
                                    section_item += "<div class='row  pl-5 pt-3' stlye='border:2px; width:85%;'>";
                                    $.each(item_control.child, function (keys, chd) {
                                        if (chd.controlid.startsWith('SF')) {
                                            if (chd.valuetype === "checklist") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0' style='margin-bottom: 15px;'>";
                                                section_item += "<label class='lblCheck' for='" + chd.controlid + "'>";
                                                section_item += "<input id='" + chd.controlid + "' class='' type='checkbox' />";
                                                section_item += "<span class=''>" + chd.name + "</span>";
                                                section_item += "</label></div>";
                                            }
                                            if (chd.valuetype === "text") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<input id='" + chd.controlid + "' class='form-control' type='text' />";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "textarea") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<textarea id='" + chd.controlid + "' class='form-control' rows='3' cols='90'></textarea>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "combox") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<select class='selectpicker form-control' id='" + chd.controlid + "' data-container='body'>";
                                                section_item += "<option value='0' selected>NA</option>";
                                                $.each(chd.values, function (keyv, item_values) {
                                                    section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                                                });
                                                section_item += "</select>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "datetime") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<input id='" + chd.controlid + "' class='form-control' type='datetime-local' />";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "date") {
                                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";
                                                section_item += "<input id='" + chd.controlid + "' class='form-control' type='date' />";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "checkbox") {
                                                section_item += "<div class='col-lg-6 col-md-8 col-sm-6 pl-0'><div class='row pb-2'>";
                                                section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + chd.name + "</label></div>";
                                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + chd.controlid + "_y' class='mr-1' name=" + chd.controlid + " value='Y'>Yes</label></div>";
                                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + chd.controlid + "_n' class='mr-1' name=" + chd.controlid + " value='N'>No</label></div>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "float") {
                                                section_item += "<div class='col-lg-4 col-md-4 col-sm-4 pl-0'><div class= 'form-group'>";
                                                section_item += "<label>" + chd.name + "</label>";

                                                var eventName = "";
                                                var readonly = "";
                                                if (chd.readonly === "Y")
                                                    readonly = "readonly";

                                                if (chd.event === "Y") {
                                                    eventName = "Utils_ClinicalCharts.onChange_ClinicalValue('" + chd.formula + "')";
                                                }

                                                if (!IsStringNullorEmpty(chd.controlid_2)) {
                                                    section_item += "<input id='" + chd.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>  / ";
                                                    section_item += "<input id='" + chd.controlid_2 + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>";
                                                }
                                                else
                                                    section_item += "<input id='" + chd.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:80px' onchange=" + eventName + " >";

                                                section_item += "<span class='f-italic'>" + chd.unittype + "</span>";
                                                section_item += "</div></div>";
                                            }
                                            if (chd.valuetype === "heading") {
                                                section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 pl-0 form-group'><label>" + chd.name + "</label></div>";
                                            }
                                            if (chd.valuetype === "grid") {
                                                section_item += "<div class='row mr-0' style='margin-right:0px;'>";
                                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px'>";
                                                section_item += "<table id='jqg" + chd.type + chd.controlid + "'></table>";
                                                section_item += "<div id='jqp" + chd.type + chd.controlid + "'></div>";
                                                section_item += "</div>";
                                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                                                section_item += "<button type='button' class='mdl-button' onclick=add" + chd.type + "('" + chd.value + "')><i class='fa fa-plus'></i></button>";
                                                section_item += "</div></div><br>";
                                            }
                                        }

                                    });
                                    section_item += "</div></div>";
                                }
                                else {
                                    section_item += "<div class='col-12 pl-0' style='margin-bottom: 15px;'>";
                                    section_item += "<label class='lblCheck' for='" + item_control.controlid + "'>";
                                    section_item += "<input id='" + item_control.controlid + "' class='' type='checkbox' onchange=Utils_ClinicalCharts.onChange_Checklist('" + item_control.controlid + "')>";
                                    section_item += "<span class='pl-2'>" + item_control.name + "</span>";
                                    section_item += "</label>";
                                    section_item += "<div class='row  pl-5 pt-3' id='childs_" + item_control.controlid + "' style='display:none;'>";
                                    $.each(item_control.child, function (keys, chd) {
                                        if (chd.valuetype === "checklist") {
                                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0' style='margin-bottom: 15px;'>";
                                            section_item += "<label class='lblCheck' for='" + chd.controlid + "'>";
                                            section_item += "<input id='" + chd.controlid + "' class='' type='checkbox' />";
                                            section_item += "<span class='pl-2'>" + chd.name + "</span>";
                                            section_item += "</label></div>";
                                        }
                                        if (chd.valuetype === "text") {
                                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                            section_item += "<label>" + chd.name + "</label>";
                                            section_item += "<input id='" + chd.controlid + "' class='form-control' type='text' />";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "textarea") {
                                            section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                            section_item += "<label>" + chd.name + "</label>";
                                            section_item += "<textarea id='" + chd.controlid + "' class='form-control' rows='3' cols='90'></textarea>";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "combox") {
                                            section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                            section_item += "<label>" + chd.name + "</label>";
                                            section_item += "<select class='selectpicker form-control' data-container='body' data-size='5' id='" + chd.controlid + "'>";
                                            section_item += "<option value='0' selected>Select</option>";
                                            $.each(chd.values, function (keyv, item_values) {
                                                section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                                            });
                                            section_item += "</select>";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "datetime") {
                                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                            section_item += "<label>" + chd.name + "</label>";
                                            section_item += "<input id='" + chd.controlid + "' class='form-control' type='datetime-local' />";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "date") {
                                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                            section_item += "<label>" + chd.name + "</label>";
                                            section_item += "<input id='" + chd.controlid + "' class='form-control' type='date' />";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "checkbox") {
                                            section_item += "<div class='col-lg-6 col-md-8 col-sm-6 pl-0'><div class='row pb-2'>";
                                            section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + chd.name + "</label></div>";
                                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + chd.controlid + "_y' class='mr-1' name=" + chd.controlid + " value='Y'>Yes</label></div>";
                                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + chd.controlid + "_n' class='mr-1' name=" + chd.controlid + " value='N'>No</label></div>";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "float") {
                                            section_item += "<div class='col-lg-4 col-md-4 col-sm-4 pl-0'><div class= 'form-group'>";
                                            section_item += "<label>" + chd.name + "</label>";

                                            var eventName = "";
                                            var readonly = "";
                                            if (chd.readonly === "Y")
                                                readonly = "readonly";

                                            if (chd.event === "Y") {
                                                eventName = "Utils_ClinicalCharts.onChange_ClinicalValue('" + chd.formula + "')";
                                            }

                                            if (!IsStringNullorEmpty(chd.controlid_2)) {
                                                section_item += "<input id='" + chd.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>  / ";
                                                section_item += "<input id='" + chd.controlid_2 + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>";
                                            }
                                            else
                                                section_item += "<input id='" + chd.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:80px' onchange=" + eventName + " >";

                                            section_item += "<span class='f-italic'>" + chd.unittype + "</span>";
                                            section_item += "</div></div>";
                                        }
                                        if (chd.valuetype === "heading") {
                                            section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 pl-0 form-group'><label>" + chd.name + "</label></div>";
                                        }
                                        if (chd.valuetype === "grid") {
                                            section_item += "<div class='row mr-0' style='margin-right:0px;'>";
                                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px'>";
                                            section_item += "<table id='jqg" + chd.type + chd.controlid + "'></table>";
                                            section_item += "<div id='jqp" + chd.type + chd.controlid + "'></div>";
                                            section_item += "</div>";
                                            //section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                                            // section_item += "<button type='button' class='mdl-button' onclick=add" + chd.type + "('" + chd.value + "')><i class='fa fa-plus'></i></button>";
                                            // section_item += "</div></div><br>";
                                            section_item += "</div><br>";
                                        }
                                    });

                                    section_item += "</div></div>";

                                }
                            }


                            if (item_control.valuetype === "combox") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<select class='selectpicker form-control' data-container='body' data-size='5' id='" + item_control.controlid + "' onchange=Utils_ClinicalCharts.onChange_Combox('" + item_control.controlid + "')>";
                                section_item += "<option value='0' selected>Select</option>";
                                $.each(item_control.values, function (keyv, item_values) {
                                    section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                                });
                                section_item += "</select>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "datetime") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<input id='" + item_control.controlid + "' class='form-control' type='datetime-local' />";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "date") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<input id='" + item_control.controlid + "' class='form-control' type='date' />";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "table") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><h6 class='sub-heading'>" + item_control.name + "</h6></div>";
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'>";
                                section_item += "<div class='table-responsive'>";
                                section_item += "<table class='table'>";
                                section_item += "<thead>";

                                $.each(item_control.table.column, function (keys, col) {
                                    if (col.name !== "ID")
                                        section_item += "<th scope='col'>" + col.name + "</th>";
                                });
                                section_item += "</thead>";
                                section_item += "<tbody>";
                                $.each(item_control.table.row, function (keys, row) {
                                    section_item += "<tr>";
                                    $.each(item_control.table.column, function (keys, col) {
                                        if (col.name !== "ID") {
                                            if (col.readonly === "Y") {
                                                section_item += "<td>";
                                                section_item += "<label>" + row[col.controlid] + "</label>";
                                                section_item += "</td>";
                                            }
                                            else {
                                                section_item += "<td>";
                                                section_item += "<input id='" + col.controlid + "-" + row.id + "' class='form-control' type='text' />";
                                                section_item += "</td>";
                                            }
                                        }
                                    });
                                    section_item += "</tr>";
                                });
                                section_item += "</tbody></table>";
                                section_item += "</div>";
                                section_item += "</div>";
                            }
                            if (item_control.valuetype === "painscore") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<h6 class='sub-heading'>" + item_control.name + "</h6>";
                                section_item += "<div class='col-lg-9 col-md-12 col-xs-12 pl-0'>";
                                section_item += "<div id='divScaleNumbers' hidden>";
                                section_item += "<span class='lblNumbers'>0</span><span class='lblNumbers'>1</span><span class='lblNumbers'>2</span><span class='lblNumbers'>3</span><span class='lblNumbers'>4</span><span class='lblNumbers'>5</span>";
                                section_item += "<span class='lblNumbers'>6</span><span class='lblNumbers'>7</span><span class='lblNumbers'>8</span><span class='lblNumbers'>9</span><span class='lblNumbers'>10</span>";
                                section_item += "</div>";
                                section_item += "<div id='divScaleLines'>";
                                section_item += "<div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div>";
                                section_item += "<div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div>";
                                section_item += "</div>";
                                section_item += " <div class='ratings d-flex flex-row'>";
                                section_item += "<label onclick=fnratingsActive('NoPain') id='lblNoPain'><img src='/images/smiley/smile.png' alt='No Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>No Pain</span></label>";
                                section_item += "<label onclick=fnratingsActive('MildPain') id='lblMildPain'><img src='/images/smiley/happy.png' alt='Mild Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Mild Pain </span></label>";
                                section_item += "<label onclick=fnratingsActive('ModeratePain') id='lblModeratePain'><img src='/images/smiley/sad.png' alt='Moderate Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Moderate Pain </span></label>";
                                section_item += "<label onclick=fnratingsActive('SeverePain') id='lblSeverePain'><img src='/images/smiley/confused.png' alt='Severe Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Severe Pain </span></label>";
                                section_item += "<label onclick=fnratingsActive('VerySeverePain') id='lblVerySeverePain'><img src='/images/smiley/angry.png' alt='Very Severe Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Very Severe Pain </span></label>";
                                section_item += "<label onclick=fnratingsActive('WorstPainPossible') id='lblWorstPainPossible'><img src='/images/smiley/cry.png' alt='Worst Pain Possible' class='m-auto' name='painscore'/><span class='d-block pt-2'>Worst Pain Possible </span></label>";
                                section_item += "</div ></div > ";
                                section_item += "</div ></div > ";
                            }
                            if (item_control.valuetype === "grid") {
                                section_item += "<div class='row mr-0' style='margin-right:0px;'>";
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px'>";
                                section_item += "<table id='jqg" + item_control.controlid + "'></table>";
                                section_item += "<div id='jqp" + item_control.controlid + "'></div>";
                                section_item += "</div>";
                                //section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                                //section_item += "<button type='button' class='mdl-button' onclick=addtogrid('" + item_control.type + "')><i class='fa fa-plus'></i></button>";
                                //section_item += "</div></div>";
                                section_item += "</div>";
                            }
                            if (item_control.valuetype === "fileupload") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<div class='input-group'><div class='custom-file'>";
                                section_item += "<input type='file' name='files' id='" + item_control.controlid + "' />";
                                section_item += "</div></div></div></div>";
                            }
                        }
                    });
                    section_item += "</div>";
                });
            }).done(function () {
                if (type === "INV" || type === "SER" || type === "MED" || type === "ALLE" || type === "DOC" || type === "DIAG" || type === "CRON") {
                    $("#dvPopupBody").html(section_item);
                    if (type === "INV") {
                        fnPopulateServiceClass();
                    }
                    if (type === "SER") {
                        fnPopulateProceServiceClass();
                    }
                    if (type === "MED") {
                        fnPopulateDrugMaster();
                    }
                }

                if (type === "TRI")
                    $("#dvTriageTemplate").html(section_item);
                //if (type === "EMR7")
                //    $("#dvMedicalHistoryTemplate").html(section_item);
                //if (type === "MED")
                //    $("#dvMedications").html(section_item);
                //if (type === "INV")
                //    $("#dvInvestigations").html(section_item);
                //if (type === "BS")
                //    $("#dvBariatric").html(section_item);
                //if (type === "NBS")
                //    $("#dvNonBariatric").html(section_item);
                //if (type === "BM")
                //    $("#dvBodyMeasures").html(section_item);
                //if (type === "CONS")
                //    $("#dvConsultations").html(section_item);


                $(".selectpicker").selectpicker('refresh');
                $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });

                //fnsideBarSetup();
            });
            resolve();
        });
    },
    setClinicalTemplate: function (result) {
        //console.log(result)
        $.each(result, function (keys, item) {

            if (item.ValueType === "float" || item.ValueType === "date" || item.ValueType === "text" || item.ValueType === "ltext"
                || item.ValueType === "textarea" || item.ValueType === "textarea_l"
                || item.ValueType === "textarea_xl" || item.ValueType === "textarea_xxl") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "combox") {
                $('#' + item.CLControlID).val(item.Value);
                Utils_ClinicalCharts.onChange_Combox(item.CLControlID);
            }
            if (item.ValueType === "checkbox") {
                if (item.Value === "Y")
                    $('#' + item.CLControlID + '_y').prop('checked', true);
                if (item.Value === "N")
                    $('#' + item.CLControlID + '_n').prop('checked', true);
            }
            if (item.ValueType === "checklist") {
                // console.log(item)
                if (item.Value === 'true')
                    $('#' + item.CLControlID).prop("checked", true);
                if (item.Value === 'false')
                    $('#' + item.CLControlID).prop("checked", false);
            }
            if (item.ValueType === "checklist_l") {
                if (item.CLControlID.startsWith('PO3')) {
                    if (item.Value === 'true') {
                        $('#childs_' + item.CLControlID).show();
                    }
                    if (item.Value === 'false') {
                        $('#childs_' + item.CLControlID).hide();
                    }
                }
                else {
                    if (item.Value === 'true') {
                        $('#' + item.CLControlID).prop("checked", true);
                    }
                    if (item.Value === 'false') {
                        $('#' + item.CLControlID).prop("checked", false);
                    }
                    Utils_ClinicalCharts.onChange_Checklist(item.CLControlID);
                }

            }
            if (item.ValueType === "radio") {
                $('input:radio[name="' + item.CLControlID + '"][value=' + item.Value + ']').prop('checked', true).trigger("click");
            }
            if (item.ValueType === "datetime") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "table") {
                $('#' + item.CLControlID).val(item.Value);
            }
        });

        $(".selectpicker").selectpicker('refresh');
        $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
    },
    getClinicalTemplate: function (type) {

        return new Promise(function (resolve) {
            var l_Control = [];

            $.getJSON(getBaseURL() + "/json/PatientManagement/patientemr.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);
                $.each(d, function (key, item_nav) {
                    $.each(item_nav.item, function (keys, item_control) {

                        if (item_control.valuetype === "float") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "text") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "ltext") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "date") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea_l") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "checkbox") {
                            var rd_value = $("input[type='radio'][name='" + item_control.controlid + "']:checked").val();
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: rd_value
                            });
                        }
                        if (item_control.valuetype === "checklist") {
                            var ck_value = $('#' + item_control.controlid).prop("checked");
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: ck_value
                            });
                        }
                        if (item_control.valuetype === "checklist_l") {
                            var ck_value = $('#' + item_control.controlid).prop("checked");
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: ck_value
                            });
                            if (ck_value === true) {
                                $.each(item_control.child, function (keys, chd) {
                                    if (chd.valuetype === "float") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                    if (chd.valuetype === "text") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                    if (chd.valuetype === "ltext") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                    if (chd.valuetype === "date") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                    if (chd.valuetype === "textarea") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                    if (chd.valuetype === "textarea_l") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                    if (chd.valuetype === "checkbox") {
                                        var rd_value = $("input[type='radio'][name='" + chd.controlid + "']:checked").val();
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: rd_value
                                        });
                                    }
                                    if (chd.valuetype === "checklist") {
                                        var ck_value = $('#' + chd.controlid).prop("checked");
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: ck_value
                                        });
                                    }
                                    if (chd.valuetype === "combox") {
                                        l_Control.push({
                                            CLType: type,
                                            CLControlID: chd.controlid,
                                            ValueType: chd.valuetype,
                                            Value: $('#' + chd.controlid).val()
                                        });
                                    }
                                });
                            }
                            if (ck_value === false) {
                                $.each(item_control.child, function (keys, chd) {
                                    l_Control.push({
                                        CLType: type,
                                        CLControlID: chd.controlid,
                                        ValueType: chd.valuetype,
                                        Value: null
                                    });
                                });
                            }
                        }
                        if (item_control.valuetype === "combox") {
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "fileupload") {
                            // Checking whether FormData is available in browser  
                            if (window.FormData !== undefined) {
                                var fileUpload = $('#' + item_control.controlid).get(0);
                                var files = fileUpload.files;
                                // console.log(files)
                                //  console.log(files.length)
                                if (files.length > 0) {
                                    // Create FormData object  
                                    var fileData = new FormData();

                                    // Looping over all files and add it to FormData object  
                                    for (var i = 0; i < files.length; i++) {
                                        //    // check file size
                                        //    if (files[i]["size"] <= 4194304) {
                                        fileData.append('file', files[i]);
                                        //    }
                                        //    else {
                                        //        toastr.error("Max. file size is 4 MB");
                                        //        return false;
                                        //    }

                                    }

                                    // Adding one more key to FormData object  
                                    fileData.append('UHID', $('#hdUHID').val());
                                    fileData.append('Visit', $('#hdvNumber').val());
                                    var uploadurl = getBaseURL() + '/ClinicalForms/UploadFiles';
                                    $.ajax({
                                        url: uploadurl,
                                        type: "POST",
                                        enctype: 'multipart/form-data',
                                        contentType: false, // Not to set any content header  
                                        processData: false, // Not to process data 
                                        async: false,
                                        data: fileData,
                                        success: function (result) {
                                            //  console.log(result)
                                            l_Control.push({
                                                CLType: type,
                                                CLControlID: item_control.controlid,
                                                ValueType: item_control.valuetype,
                                                Value: result
                                            });
                                        },
                                        error: function (err) {
                                            toastr.error(err.statusText);
                                        }
                                    });
                                }

                            } else {
                                toastr.error("FormData is not supported.");
                            }

                        }
                    });
                });
            });
            resolve(l_Control);
        });
    },
    onChange_ClinicalValue: function (ev) {
        var f_arr = ev.split("|");
        $.each(f_arr, function (keys, data) {
            var cn = data.split("=");
            var fr = cn[1].split("_");

            var fr_value = "";
            $.each(fr, function (keys, item) {

                if (item.startsWith("[")) {
                    var val = $('#' + item.replace("[", "").replace("]", "")).val();
                    if (IsStringNullorEmpty(val))
                        val = 0;
                    fr_value = fr_value + val;
                }
                else {
                    fr_value = fr_value + item;
                }
            });
            $('#' + cn[0]).val(eval(fr_value));
        });

    },
    onChange_Checklist: function (id) {
        if ($('#' + id).prop("checked")) {
            $('#childs_' + id).show();
        }
        else {
            $('#childs_' + id).hide();
        }
    },
    onChange_Combox: function (id) {
        if ($('#' + id).val() === 'EN') {
            for (let i = 1; i <= 16; i++) {
                $('#INV-6-' + i).parent().show();
            }
        }
        else {
            for (let i = 1; i <= 16; i++) {
                $('#INV-6-' + i).parent().hide();
            }
        }
        if (id === 'INV-1') {
            fnGetServices($('#INV-1').val());
        }
        if (id === 'SER-1') {
            fnGetProceServices($('#SER-1').val());
        }
        if (id === 'MED-1') {
            $("#MED-1 option[value='']").remove();
            $('#MED-1').selectpicker('refresh');
        }
    },
    setTemplateInformation: function (result) {
        // console.log(result)
        $('div[id^="childs_"]').hide();
        $.each(result, function (keys, item) {
            if (item.ValueType === "float" || item.ValueType === "date" || item.ValueType === "text" || item.ValueType === "ltext"
                || item.ValueType === "textarea" || item.ValueType === "textarea_l"
                || item.ValueType === "textarea_xl" || item.ValueType === "textarea_xxl") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "combox") {
                $('#' + item.CLControlID).val(item.Value);
                Utils_ClinicalCharts.onChange_Combox(item.CLControlID);
            }
            if (item.ValueType === "checkbox") {
                if (item.Value === "Y")
                    $('#' + item.CLControlID + '_y').prop('checked', true);
                if (item.Value === "N")
                    $('#' + item.CLControlID + '_n').prop('checked', true);
            }
            if (item.ValueType === "checklist") {
                if (item.Value === 'true')
                    $('#' + item.CLControlID).prop("checked", true);
                if (item.Value === 'false')
                    $('#' + item.CLControlID).prop("checked", false);
            }
            if (item.ValueType === "checklist_l") {
                if (item.CLControlID.startsWith('PO3')) {
                    if (item.Value === 'true') {
                        $('#childs_' + item.CLControlID).show();
                    }
                    if (item.Value === 'false') {
                        $('#childs_' + item.CLControlID).hide();
                    }
                }
                else {
                    if (item.Value === 'true') {
                        $('#' + item.CLControlID).prop("checked", true);
                    }
                    if (item.Value === 'false') {
                        $('#' + item.CLControlID).prop("checked", false);
                    }
                    Utils_ClinicalCharts.onChange_Checklist(item.CLControlID);
                }

            }
            if (item.ValueType === "radio") {
                $('input:radio[name="' + item.CLControlID + '"][value=' + item.Value + ']').prop('checked', true).trigger("click");
            }
            if (item.ValueType === "datetime") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "table") {
                $('#' + item.CLControlID).val(item.Value);
            }
        });

        $(".selectpicker").selectpicker('refresh');
        $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
    },


    //}

};




function saveClinicalInformationData(l_data, callback) {
    var url = getBaseURL() + '/ClinicalForms/InsertPatientClinicalInformation';

    if (_isUpdate === true)
        url = getBaseURL() + '/ClinicalForms/UpdatePatientClinicalInformation';

    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: l_data,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved");
                callback(true);
            }
            else {
                toastr.error(response.Message);
                callback(false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            callback(false);
        }
    });
}


function editClinicalCharts(type, e, actiontype) {
    if (type === "INV")
        editInvValuesCharts(e, actiontype);
    else if (type === "MED")
        editMedValuesCharts(e, actiontype);
    else if (type === "BS")
        editBSValuesCharts(e, actiontype);
    else if (type === "NBS")
        editNBSValuesCharts(e, actiontype);
    else if (type === "BM")
        editBMValuesCharts(e, actiontype);
    else if (type === "CONS")
        editCONSValuesCharts(e, actiontype);
}

function editPopupInfo(type, e, actiontype) {
    //console.log(actiontype)
    var _grid = "";
    var _title = "";
    if (type === "INV") {
        _grid = "jqgInvestigations";
        _title = "Investigations";
    }
    else if (type === "SER") {
        _grid = "jqgServices";
        _title = "Services";
    }

    else if (type === "MED") {
        _grid = "jqgMedication";
        _title = "Medication";
    }

    else if (type === "ALLE") {
        _grid = "jqgAllergy";
        _title = "Allergy";
    }

    else if (type === "DIAG") {
        _grid = "jqgDiagnosis";
        _title = "Diagnosis";
    }

    else if (type === "DOC") {
        _grid = "jqgDocumentUpload";
        _title = "";
    }

    else if (type === "CRON") {
        _grid = "jqgChronicCondition";
        _title = "Chronic Condition";
    }


    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#' + _grid).jqGrid('getRowData', rowid);
    _intTransactionId = rowData.TransactionID;

    if (actiontype === "view") {
        $("#btnsavePopupInfo").hide();
        $('#popTitle').html(_title);
        $("#PopupInfo").modal('show');
        _isUpdate = true;


        getClinicalInformationByID(rowData.TransactionID, rowData.VisitNumber, function (data) {
            $.each(data, function (key, val) {
                setDate($('#dpDate'), val.TransactionDate);
                $('#tpTime').val(new Date(val.TransactionDate).timeToInput());
                $('#hdPopType').val(type);
            });

            $.when(Utils_ClinicalCharts.populateClinicalTemplate(type)).then(function () {
                Utils_ClinicalCharts.setClinicalTemplate(data);
            });

        });
    }
    else if (actiontype === "delete") {
        bootbox.confirm({
            message: "Are you sure you want to delete this record?",
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
                    var obj = {
                        UHID: $('#hdUHID').val(),
                        VisitNumber: rowData.VisitNumber,
                        CLType: type,
                        TransactionID: _intTransactionId
                    };
                    $.ajax({
                        url: getBaseURL() + '/ClinicalForms/DeletePatientClinicalInformation',
                        type: 'POST',
                        datatype: 'json',
                        data: obj,
                        success: function (response) {
                            Utils_ClinicalCharts.gridClinicalCharts(type);
                                fnProcessLoading(false);

                                toastr.success("Record Deleted");
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
}


function getClinicalInformationByID(transactionID, visitNumber, callback) {

    $.get(getBaseURL() + '/ClinicalForms/GetClinicalInformationValueByTransaction',
        {
            UHID: $('#hdUHID').val(),
            vNumber: visitNumber,
            transactionID: transactionID
        }, function (data, status) {
            callback(data);
        });
}
function getClinicalInformation(cltype, callback) {
    $.get(getBaseURL() + '/ClinicalForms/GetClinicalInformation',
        {
            UHID: $('#hdUHID').val(),
            vNumber: $('#hdvNumber').val(),
            clType: cltype
        }, function (data, status) {
            callback(data);
        });
}


function fnLoadVisitInfo() {

    $("#jqgVisitInfo").jqGrid('GridUnload');
    $("#jqgVisitInfo").jqGrid(
        {
            url: getBaseURL() + '/DoctorDesk/GetAppointmentDetailByUHID',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                uhid: $('#hdUHID').val(),
            },
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
            colNames: [localization.VisitNumber, localization.AppointmentDate, localization.MRN, localization.PatientName, localization.Mobile, localization.Email, localization.AppointmentTime, localization.Status],
            colModel: [
                { name: "AppointmentKey", width: 50, editable: true, align: 'left', hidden: false },
                { name: "AppointmentDate", width: 50, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                { name: "UHID", width: 50, editable: true, align: 'left', hidden: true },

                { name: "PatientName", width: 100, editable: true, align: 'left', hidden: true },
                { name: "PatientMobileNumber", width: 50, editable: true, align: 'left', hidden: true },
                { name: "PatientEmailID", width: 100, editable: true, align: 'left', hidden: true },

                { name: "AppointmentFromTime", width: 50, editable: true, align: 'center', hidden: false },
                { name: "AppointmentStatus", width: 50, editable: true, align: 'left', hidden: true },
                ,
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
            pager: "#jqpVisitInfo",
            onSelectRow: function (rowid) {

            },
            loadComplete: function (data) {
                $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100%');
               // console.log(data.AppointmentFromTime);
            },
            loadBeforeSend: function () {
                $("#jqgh_jqgVisitInfo_AppointmentDate,#jqgh_jqgVisitInfo_AppointmentFromTime").css('text-align', 'center');
            }
        });


}

// UI
var scrollLink = $(".nav-link");
$(".sidebar-sticky .nav-link").click(function () {
    $(".nav-link.active").removeClass("active");
    $(this).addClass("active");
});
$(document).ready(function () {
    $(".nav-link.active").removeClass("active");
    $(".sidebar-sticky .nav-link").first().addClass('active');
    //$('#mainContent').offset().top = 0;
    // setTimeout(function () { fnsideBarSetup() }, 1000);

});
$(window).on('resize', function () {
    //  fnsideBarSetup();

});
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

    $("#jqgMedications").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $('div[id*="jqg"]').jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $("#jqgDoctorNotes").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
}

function fnratingsActive(id) {

    $(".ratings label.active").removeClass('active');
    $('#lbl' + id).addClass('active');
    _painscore_id = id;
}

function fnAddToGrid(type, name) {
    setDate($('#dpDate'), new Date());
    $('#tpTime').val(new Date().timeToInput());
    $("#btnsavePopupInfo").show();
    $('#hdPopType').val(type);
    $('#popTitle').html(name);
    $("#dvPopupBody").html('');
    $("#PopupInfo").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate(type);
}
function savePopupInfo() {
    fnProcessLoading(true, "saving");
    var _type = $('#hdPopType').val();
    $("#btnsavePopupInfo").attr('disabled', true);

    var l_info = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate(_type)).then(function (l_info) {
        var inf = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: _vNumber,
            TransactionDate: getDate($('#dpDate')),
            TransactionTime: $('#tpTime').val(),
            l_ControlValue: l_info,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(inf, function (result) {
            fnProcessLoading(false);
            $("#btnsavePopupInfo").attr('disabled', false);
            if (result) {
                // $("#PopupInfo").modal('hide');
                Utils_ClinicalCharts.populateClinicalTemplate(_type);
                Utils_ClinicalCharts.gridClinicalCharts(_type);
            }
        });

    });
}