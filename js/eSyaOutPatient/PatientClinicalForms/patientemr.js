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
    '11': 'MGB (OAGB)',
    '12': 'Other'
};
var l_vType = {
    'N': 'New Consultation',
    'S': 'Surgical Follow-Up',
    'R': 'Nutrition Follow-Up'
};
var l_inv = {
    'EN': 'Endoscopy',
    'LA': 'Laboratory',
    'RA': 'Radiology',
    'OT': 'Other'
};
var l_med = {
    'GE': 'GERD',
    'DI': 'Diabetes',
    'HT': 'HTN',
    'CA': 'Cardiac',
    'TH': 'Thromboembolism',
    'DE': 'Depression',
    'OT': 'Other'
};
var l_bs = {
    '1': 'LAGB',
    '2': 'LSG',
    '3': 'MGB',
    '4': 'RYGB',
    '5': 'VBG',
    '6': 'butterfly gastroplasty',
    '7': 'Intragastric ballon/capsule',
    '8': 'gastric plication',
    '9': 'SADI-S',
    '10': 'SASI',
    '11':'Other'
};
var l_nbs = {
    '1': 'Cholecystectomy',
    '2': 'Abdominplasty',
    '3': 'Ventral hernia repair ',
    '4': 'Anti-reflux surgery',
    '5': 'Bowel resection',
    '6': 'open exploration',
    '7': 'laparoscopic exploration',
    '8': 'cancer surgery',
    '9': 'Angioplasty (PCI)',
    '10': 'CABG',
    '11': 'Spine surgery',
    '12': 'Transplantation',
    '13': 'Other'
};
var l_medc = {
    '1': 'antihypertensives',
    '2': 'OHG',
    '3': 'insulin',
    '4': 'Anticoagulants - Antiplatelets',
    '5': 'Steroids',
    '6': 'NSAIDS',
    '7': 'anti-reflux',
    '8': 'Vitamins',
    '9': 'OCPs',
    '10': 'Hormonal therapy',
    '11': 'other'
};
var l_cons = {
    '1': 'Cardiac',
    '2': 'pulmonology',
    '3': 'Endocrinal',
    '4': 'Rheumatological',
    '5': 'oncological',
    '6': 'other'
};
var l_invs = {
    '1': 'Abdominal US',
    '2': 'CT abdomen & pelvis',
    '3': 'CT gastroscopy',
    '4': 'contrast study',
    '5': 'Echocardiography',
    '6': 'CT chest',
    '7': 'Duplex',
    '8': 'ECG',
    '9': 'CXR',
    '10': 'CBC',
    '11': 'ABG',

    '12': 'urea',
    '13': 'creatinine',
    '14': 'ALT',
    '15': 'AST',
    '16': 'Albumin',

    '17': 'Ca',
    '18': 'Fe',
    '19': 'Mg',
    '20': 'Zn',
    '21': 'Na',
    '22': 'K',
    '23': 'Ferritin',

    '24': 'INR',
    '25': 'PTT',
    '26': 'D-dimer',

    '27': 'CRP',
    '28': 'Procalcitonin',
    '29': 'LDH',

    '30': 'Vitamin D',
    '31': 'Vitamin B',

    '32': 'TSH',
    '33': 'Cortisol',

    '34': 'HCV Ab',
    '35': 'HBsAg',
    '36': 'HIV Ab',

    '37': 'HbA1c',
    '38': 'FBS',
    '39': 'RBS',
    '40': 'C-peptide',
    '41': 'Insulin',

    '42': 'TG',
    '43': 'HDL',
    '44': 'LDL',
    '45': 'VLDL'
};
var l_fType = {
    'PO': localization.PreOperative,
    'FS': localization.FacilityStay,
    'SF': localization.FollowUpSurgical,
    'NF': localization.FollowUpNutrition
};
var rad_combox = "<option value='0' selected>Select</option>";
rad_combox += "<option value='1' >Abdominal US</option>";
rad_combox += "<option value='2' >CT abdomen & pelvis</option>";
rad_combox += "<option value='3' >CT gastroscopy</option>";
rad_combox += "<option value='4' >contrast study</option>";
rad_combox += "<option value='5' >Echocardiography</option>";
rad_combox += "<option value='6' >CT chest</option>";
rad_combox += "<option value='7' >Duplex</option>";
rad_combox += "<option value='8' >ECG</option>";
rad_combox += "<option value='9' >CXR</option>";

var lab_combox = "<option value='0' selected>Select</option>";
lab_combox += "<option value='10' >CBC</option>";
lab_combox += "<option value='11' >ABG</option>";
lab_combox += "<optgroup label='Chemistry'>";
lab_combox += "<option value='12' >urea</option>";
lab_combox += "<option value='13' >creatinine</option>";
lab_combox += "<option value='14' >ALT</option>";
lab_combox += "<option value='15' >AST</option>";
lab_combox += "<option value='16' >Albumin</option>";
lab_combox += "</optgroup><optgroup label='Electrolytes'>";
lab_combox += "<option value='17' >Ca</option>";
lab_combox += "<option value='18' >Fe</option>";
lab_combox += "<option value='19' >Mg</option>";
lab_combox += "<option value='20' >Zn</option>";
lab_combox += "<option value='21' >Na</option>";
lab_combox += "<option value='22' >K</option>";
lab_combox += "<option value='23' >Ferritin</option>";
lab_combox += "</optgroup><optgroup label='Coagulation profile'>";
lab_combox += "<option value='24' >INR</option>";
lab_combox += "<option value='25' >PTT</option>";
lab_combox += "<option value='26' >D-dimer</option>";
lab_combox += "</optgroup><optgroup label='Inflammatory markers'>";
lab_combox += "<option value='27' >CRP</option>";
lab_combox += "<option value='28' >Procalcitonin</option>";
lab_combox += "<option value='29' >LDH</option>";
lab_combox += "</optgroup><optgroup label='Vitamins'>";
lab_combox += "<option value='30' >Vitamin D</option>";
lab_combox += "<option value='31' >Vitamin B</option>";
lab_combox += "</optgroup><optgroup label='Hormones'>";
lab_combox += "<option value='32' >TSH</option>";
lab_combox += "<option value='33' >Cortisol</option>";
lab_combox += "</optgroup><optgroup label='Virology'>";
lab_combox += "<option value='34' >HCV Ab</option>";
lab_combox += "<option value='35' >HBsAg</option>";
lab_combox += "<option value='36' >HIV Ab</option>";
lab_combox += "</optgroup><optgroup label='Glucose homeostasis'>";
lab_combox += "<option value='37' >HbA1c</option>";
lab_combox += "<option value='38' >FBS</option>";
lab_combox += "<option value='39' >RBS</option>";
lab_combox += "<option value='40' >C-peptide</option>";
lab_combox += "<option value='41' >Insulin</option>";
lab_combox += "</optgroup><optgroup label='Lipid profile'>";
lab_combox += "<option value='42' >TG</option>";
lab_combox += "<option value='43' >HDL</option>";
lab_combox += "<option value='44' >LDL</option>";
lab_combox += "<option value='45' >VLDL</option>";
lab_combox += "</optgroup>";



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
    _UT = $('#hdUT').val();
    //console.log($('#hdUT').val())
    if (_UT != '20001' && _UT != '20008' && _UT != '20009') {
        $('#v-emr8-tab').hide();
    }
});
$.get(getBaseURL() + '/PatientRegistration/GetPatientByUHID', {
    uhid: $('#hdUHID').val()
}, function (result, status) {

    setTimeout(function () {
        fnProcessLoading(true);
    }, 200);
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


    $.when(Utils_ClinicalCharts.populateClinicalTemplate("EMR2"))
        .then(fnLoadAppointmentDetail())
        .then(fnLoadFormsDetail())
        .then(fnLoadSurgeries())
        .then(Utils_ClinicalCharts.populateClinicalTemplate("EMR3"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("EMR7"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("EMR4"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("EMR5"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("EMR6"))
        .then(getClinicalInformation("PO3", function (data) {
            Utils_ClinicalCharts.setTemplateInformation(data);
        }))
        .then(Utils_ClinicalCharts.gridClinicalCharts("NBS"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("BS"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("BM"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("MED"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("INV"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("CONS"))

    
});




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

        $.get(getBaseURL() + '/PatientClinicalForms/GetInformationValueView',
            {
                UHID: $('#hdUHID').val(),
                vNumber: -1,
                clType: type
            }, function (data, status) {
                cl_result = data;
            }).then(function () {
                $.getJSON(getBaseURL() + "/json/eSyaOutPatient/patientemr.json",
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
                                                            value: l_invs
                                                        }
                                                    });
                                                }
                                                else {
                                                    gv_colModel.push({
                                                        name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                        edittype: 'select', editoptions: {
                                                            value: l_inv
                                                        }
                                                    });
                                                }
                                            }
                                            else if (type === "CONS") {
                                                gv_colModel.push({
                                                    name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                    edittype: 'select', editoptions: {
                                                        value: l_cons
                                                    }
                                                });
                                            }
                                            else if (type === "MED") {
                                                if (item_control.name === 'Medication') {
                                                    gv_colModel.push({
                                                        name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                        edittype: 'select', editoptions: {
                                                            value: l_medc
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
                                            else if (type === "BS") {
                                                gv_colModel.push({
                                                    name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                    edittype: 'select', editoptions: {
                                                        value: l_bs
                                                    }
                                                });
                                            }
                                            else if (type === "NBS") {
                                                gv_colModel.push({
                                                    name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                    edittype: 'select', editoptions: {
                                                        value: l_nbs
                                                    }
                                                });
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
                                                if (cl.CLControlID === "CONS-3" || cl.CLControlID === "INV-5" || cl.CLControlID === "BM-9") {
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
                                return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editClinicalCharts(\'' + type + '\',event,\'view\')"><i class="far fa-eye"></i> </button>';
                                //return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editClinicalCharts(\'' + type + '\',event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>'
                                    //+
                                    //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editClinicalCharts(\'' + type + '\',event,\'view\')"><i class="far fa-eye"></i> </button>';
                            }
                        });

                        if (type === "MED") {
                            
                            $("#jqgMedications").jqGrid('GridUnload');
                            $("#jqgMedications").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpMedications",
                                rowNum: 10000,
                                loadonce: false,
                                viewrecords: true,
                                gridview: true,
                                rownumbers: true,
                                align:'left',
                                rownumWidth: '55',
                                height: 'auto',
                                width: 'auto',
                                autowidth: true,
                                shrinkToFit: true,
                                forceFit: true,
                                loadComplete: function (data) {
                                   
                                    $("#jqgMedications").jqGrid('hideCol', ["edit"]); 
                                    $("#jqgMedications").hideCol("edit"); 
                                    console.log("medication:" + $('#jqgMedications').getGridParam('data'));
                                   // fnJqgridSmallScreen('jqgMedications');
                                }
                            }).jqGrid('navGrid', '#jqpMedications', { add: false, edit: false, search: false, del: false, refresh: false });
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
                                  //  fnJqgridSmallScreen('jqgInvestigations');
                                }
                            }).jqGrid('navGrid', '#jqpInvestigations', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();
                            fnProcessLoading(false);
                        }                       
                        else if (type === "BM") {
                            $("#jqgBodyMeasures").jqGrid('GridUnload');
                            $("#jqgBodyMeasures").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpBodyMeasures",
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
                                   // fnJqgridSmallScreen('jqgBodyMeasures');
                                }
                            }).jqGrid('navGrid', '#jqpBodyMeasures', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();


                        }
                        else if (type === "CONS") {

                            $("#jqgConsultations").jqGrid('GridUnload');
                            $("#jqgConsultations").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpConsultations",
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
                                    //fnJqgridSmallScreen('jqgConsultations');
                                }
                            }).jqGrid('navGrid', '#jqpConsultations', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }  
                        else if (type === "BS") {
                            $("#jqgBS-GRID").jqGrid('GridUnload');
                            $("#jqgBS-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpBS-GRID",
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
                                    //fnJqgridSmallScreen('jqgBS-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpBS-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }
                        else if (type === "NBS") {
                            $("#jqgNB-GRID").jqGrid('GridUnload');
                            $("#jqgNB-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpNB-GRID",
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
                                    //fnJqgridSmallScreen('jqgNB-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpNB-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();


                        }
                        else if (type === "BM") {
                            $("#jqgBM-GRID").jqGrid('GridUnload');
                            $("#jqgBM-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpBM-GRID",
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
                                    //fnJqgridSmallScreen('jqgBM-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpBM-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }
                        
                    });
            });
        
    },
    populateClinicalTemplate: function (type) {
        
        var section_item = "";
        return new Promise(function (resolve) {
            $.getJSON(getBaseURL() + "/json/eSyaOutPatient/patientemr.json", function (data) {
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
                                section_item += "<span class=''>" + item_control.name + "</span>";
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
                                section_item += "<span class=''>" + item_control.name + "</span>";
                                section_item += "</label>";
                                section_item += "<div class='row  pl-5 pt-3' id='childs_" + item_control.controlid + "' style='display:none;'>";
                                $.each(item_control.child, function (keys, chd) {
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

                if (type === "EMR2")
                    $("#dvSurgicalHistoryTemplate").html(section_item);
                if (type === "EMR7")
                    $("#dvMedicalHistoryTemplate").html(section_item);
                if (type === "MED")
                    $("#dvMedications").html(section_item);
                if (type === "INV")
                    $("#dvInvestigations").html(section_item);
                if (type === "BS")
                    $("#dvBariatric").html(section_item);
                if (type === "NBS")
                    $("#dvNonBariatric").html(section_item);
                if (type === "BM")
                    $("#dvBodyMeasures").html(section_item);
                if (type === "CONS")
                    $("#dvConsultations").html(section_item);
                

                $(".selectpicker").selectpicker('refresh');
                $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
                
                fnsideBarSetup();
            });
            resolve();
        });
    },
    setClinicalTemplate: function (result) {
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

            $.getJSON(getBaseURL() + "/json/eSyaOutPatient/patientemr.json", function (data) {
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
                                    fileData.append('Visit', $('#hdAppKey').val());
                                    var uploadurl = getBaseURL() + '/PatientClinicalForms/UploadFiles';
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
            if ($('#INV-1').val() === 'RA') {
                $('#INV-2').html(rad_combox);
                $('#INV-2').selectpicker('refresh');
            }
            else if ($('#INV-1').val() === 'LA') {
                $('#INV-2').html(lab_combox);
                $('#INV-2').selectpicker('refresh');
            }
            else {
                $('#INV-2').html("<option value='0' selected>Select</option>");
                $('#INV-2').selectpicker('refresh');
            }
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

function addMedications() {
    setDate($('#dpMedicationsDate'), new Date());
    $('#tpMedicationsTime').val(new Date().timeToInput());
    $("#btnSaveMedications").show();
    $("#PopupMedications").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("MED");
}
function addInvestigations() {
    setDate($('#dpInvestigationsDate'), new Date());
    $('#tpInvestigationsTime').val(new Date().timeToInput());
    $("#btnSaveInvestigations").show();
    $("#PopupInvestigations").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("INV");
    setTimeout(
        function () {
                for (let i = 1; i <= 16; i++) {
                    $('#INV-6-' + i).parent().hide();
                }
        }, 200);
}
function addConsultations() {
    setDate($('#dpConsultationsDate'), new Date());
    $('#tpConsultationsTime').val(new Date().timeToInput());
    $("#btnSaveConsultations").show();
    $("#PopupConsultations").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("CONS");
}
function addBodyMeasures() {
    setDate($('#dpBodyMeasuresDate'), new Date());
    $('#tpBodyMeasuresTime').val(new Date().timeToInput());
    $("#btnSaveBodyMeasures").show();
    $("#PopupBodyMeasures").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("BM");
}
function addBariatric() {
    setDate($('#dpBariatricDate'), new Date());
    $('#tpBariatricTime').val(new Date().timeToInput());
    $("#btnSaveBariatric").show();
    $("#PopupBariatric").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("BS");
}
function addNonBariatric() {
    setDate($('#dpNonBariatricDate'), new Date());
    $('#tpNonBariatricTime').val(new Date().timeToInput());
    $("#btnSaveNonBariatric").show();
    $("#PopupNonBariatric").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("NBS");
}

function addmed(value) {
    
    addMedications();
    setTimeout(
        function () {
            $('#MED-1').val(value);
            $('#MED-1').selectpicker('refresh');
            $('#MED-1').attr('disabled', true);
        }, 200);

}
function addinv(value) {

    addInvestigations();
    setTimeout(
        function () {
            $('#INV-1').val(value);
            $('#INV-1').selectpicker('refresh');
            $('#INV-1').attr('disabled', true);    
            if (value === 'EN') {
                for (let i = 1; i <= 16; i++) {
                    $('#INV-6-' + i).parent().show();
                }
            }
           
        }, 200);

}

function saveMedications() {
    fnProcessLoading(true, "saving");
    $("#btnSaveMedications").attr('disabled', true);

    var l_Medications = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("MED")).then(function (l_Medications) {
        var med = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpMedicationsDate')),
            TransactionTime: $('#tpMedicationsTime').val(),
            l_ControlValue: l_Medications,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(med, function (result) {
            fnProcessLoading(false);
            $("#btnSaveMedications").attr('disabled', false);
            if (result) {
                $("#PopupMedications").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("MED");
            }
        });

    });
}
function saveInvestigations() {
    fnProcessLoading(true, "saving");
    $("#btnSaveInvestigations").attr('disabled', true);

    var l_Investigations = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("INV")).then(function (l_Investigations) {
        var inv = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpInvestigationsDate')),
            TransactionTime: $('#tpInvestigationsTime').val(),
            l_ControlValue: l_Investigations,
            ActiveStatus: true,
            UserID: 0
        };
       
        saveClinicalInformationData(inv, function (result) {
            fnProcessLoading(false);
            $("#btnSaveInvestigations").attr('disabled', false);
            if (result) {
                $("#PopupInvestigations").modal('hide');

               Utils_ClinicalCharts.gridClinicalCharts("INV");
            }
        });

    });
}
function saveConsultations() {
    fnProcessLoading(true, "saving");
    $("#btnSaveConsultations").attr('disabled', true);

    var l_Consultations = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("CONS")).then(function (l_Consultations) {
        var inv = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpConsultationsDate')),
            TransactionTime: $('#tpConsultationsTime').val(),
            l_ControlValue: l_Consultations,
            ActiveStatus: true,
            UserID: 0
        };

        saveClinicalInformationData(inv, function (result) {
            fnProcessLoading(false);
            $("#btnSaveConsultations").attr('disabled', false);
            if (result) {
                $("#PopupConsultations").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("CONS");
            }
        });

    });
}
function saveBariatric() {
    fnProcessLoading(true, "saving");
    $("#btnSaveBariatric").attr('disabled', true);

    var l_Bariatric = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("BS")).then(function (l_Bariatric) {
        var bs = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpBariatricDate')),
            TransactionTime: $('#tpBariatricTime').val(),
            l_ControlValue: l_Bariatric,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(bs, function (result) {
            fnProcessLoading(false);
            $("#btnSaveBariatric").attr('disabled', false);
            if (result) {
                $("#PopupBariatric").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("BS");
            }
        });

    });
}
function saveNonBariatric() {
    fnProcessLoading(true, "saving");
    $("#btnSaveNonBariatric").attr('disabled', true);

    var l_NonBariatric = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("NBS")).then(function (l_NonBariatric) {
        var nb = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpNonBariatricDate')),
            TransactionTime: $('#tpNonBariatricTime').val(),
            l_ControlValue: l_NonBariatric,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(nb, function (result) {
            fnProcessLoading(false);
            $("#btnSaveNonBariatric").attr('disabled', false);
            if (result) {
                $("#PopupNonBariatric").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("NBS");
            }
        });

    });
}
function saveBodyMeasures() {
    fnProcessLoading(true, "saving");
    $("#btnSaveBodyMeasures").attr('disabled', true);

    var l_BodyMeasures = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("BM")).then(function (l_BodyMeasures) {
        var bm = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpBodyMeasuresDate')),
            TransactionTime: $('#tpBodyMeasuresTime').val(),
            l_ControlValue: l_BodyMeasures,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(bm, function (result) {
            fnProcessLoading(false);
            $("#btnSaveBodyMeasures").attr('disabled', false);
            if (result) {
                $("#PopupBodyMeasures").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("BM");
            }
        });

    });
}

function addtogrid(value) {
    if (value === 'NB') {
        addNonBariatric();
    }
    if (value === 'BS') {
        addBariatric();
    }
    if (value === 'BM') {
        addBodyMeasures();
    }
}

function saveClinicalInformationData(l_data, callback) {
    var url = getBaseURL() + '/PatientClinicalForms/InsertPatientClinicalInformation';

    if (_isUpdate === true)
       url = getBaseURL() + '/PatientClinicalForms/UpdatePatientClinicalInformation';

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
function savePreOperativeInformation(l_data, callback) {
    var url = getBaseURL() + '/PatientClinicalForms/InsertIntoPreOperativeInformation';

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
function fnSavePreOperative() {
    fnProcessLoading(true, "saving");
    $("#btnSavePreOperative").attr('disabled', true);
    var l_PO = [];
    var l_PO1 = [];
    var l_PO3 = [];
    var l_PO7 = [];
    var l_PO8 = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("PO1")).then(function (l_PO1) {
        l_PO = l_PO.concat(l_PO1);
    });
    $.when(Utils_ClinicalCharts.getClinicalTemplate("PO3")).then(function (l_PO3) {
        l_PO = l_PO.concat(l_PO3);
    });
    $.when(Utils_ClinicalCharts.getClinicalTemplate("PO7")).then(function (l_PO7) {
        l_PO = l_PO.concat(l_PO7);
    });
        $.when(Utils_ClinicalCharts.getClinicalTemplate("PO8")).then(function (l_PO8) {
            l_PO = l_PO.concat(l_PO8);
        })
        .then(function () {
            var po = {
                TransactionID: $('#hdTransactionID').val(),
                UHID: $('#hdUHID').val(),
                vNumber: $('#hdAppKey').val(),
                l_ControlValue: l_PO,
                ActiveStatus: true,
                UserID: 0
            };
           // console.log(po)
            savePreOperativeInformation(po, function (result) {
                fnProcessLoading(false);
                $("#btnSavePreOperative").attr('disabled', false);
            });
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

function editInvValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgInvestigations').jqGrid('getRowData', rowid);
    $("#btnSaveInvestigations").hide();
    $("#PopupInvestigations").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, rowData.VisitNumber, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpInvestigationsDate'), val.TransactionDate);
            $('#tpInvestigationsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("INV")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editCONSValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgConsultations').jqGrid('getRowData', rowid);
    $("#btnSaveConsultations").hide();
    $("#PopupConsultations").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, rowData.VisitNumber,function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpConsultationsDate'), val.TransactionDate);
            $('#tpConsultationsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("CONS")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editMedValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgMedications').jqGrid('getRowData', rowid);
    $("#btnSaveMedications").hide();
    $("#PopupMedications").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, rowData.VisitNumber,function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpMedicationsDate'), val.TransactionDate);
            $('#tpMedicationsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("MED")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editBSValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBS-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveBariatric").hide();
    $("#PopupBariatric").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID,rowData.VisitNumber, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpBariatricDate'), val.TransactionDate);
            $('#tpBariatricTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("BS")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editNBSValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgNB-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveNonBariatric").hide();
    $("#PopupNonBariatric").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID,rowData.VisitNumber, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpNonBariatricDate'), val.TransactionDate);
            $('#tpNonBariatricTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("NB")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editBMValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBM-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveBodyMeasures").hide();
    $("#PopupBodyMeasures").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID,rowData.VisitNumber, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpBodyMeasuresDate'), val.TransactionDate);
            $('#tpBodyMeasuresTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("BM")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}

function getClinicalInformationByID(transactionID, visitNumber, callback) {
    //console.log(visitNumber)
    $.get(getBaseURL() + '/PatientClinicalForms/GetClinicalInformationValueByTransaction',
        {
            UHID: $('#hdUHID').val(),
            vNumber: visitNumber,
            transactionID: transactionID
        }, function (data, status) {
            callback(data);
        });
}
function getClinicalInformation(cltype,callback) {
    $.get(getBaseURL() + '/PatientClinicalForms/GetPreOperativeInformation',
        {
            UHID: $('#hdUHID').val(),
            vNumber: $('#hdAppKey').val(),
            clType: cltype
        }, function (data, status) {
            callback(data);
        });
}

$("#v-emr1-tab").on('click', function () { fnLoadAppointmentDetail(); });
$("#v-emr2-tab").on('click', function () { fnLoadSurgeries(); })
$("#v-emr1-tab").on('click', function () { fnLoadAppointmentDetail(); })
$("#v-emr1-tab").on('click', function () { fnLoadAppointmentDetail(); })
$("#v-emr1-tab").on('click', function () { fnLoadAppointmentDetail(); })
$("#v-emr1-tab").on('click', function () { fnLoadAppointmentDetail(); })
$("#v-emr1-tab").on('click', function () { fnLoadAppointmentDetail(); })
$("#v-emr8-tab").on('click', function () { fnLoadFormsDetail(); })

function fnLoadAppointmentDetail() {

   // $("#jqgAppointmentDetail").jqGrid('GridUnload');
    $("#jqgAppointmentDetail").jqGrid(
        {
            url: getBaseURL() + '/PatientRegistration/GetAppointmentDetailByUHID',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                uhid: $('#hdUHID').val(),
            },
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
           colNames: [localization.VisitNumber, localization.AppointmentDate, localization.MRN, localization.PatientName, localization.Mobile, localization.Email, localization.VisitType, localization.AppointmentTime, localization.Status, /* "Reffered By", "Created By", "Create Date", "Modified By", "Modify Date",*/ localization.Forms],
            colModel: [
                { name: "AppointmentKey", width: 50, editable: true, align: 'left', hidden: false },
                { name: "AppointmentDate", width: 50, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                { name: "UHID", width: 50, editable: true, align: 'left', hidden: true },

                { name: "PatientName", width: 100, editable: true, align: 'left', hidden: true },
                { name: "PatientMobileNumber", width: 50, editable: true, align: 'left', hidden: true },
                { name: "PatientEmailID", width: 100, editable: true, align: 'left', hidden: true },
                {
                    name: "EpisodeType", width: 50, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_vType
                    },
                },
                { name: "AppointmentFromTime", width: 50, editable: true, align: 'center', hidden: false },
                { name: "AppointmentStatus", width: 50, editable: true, align: 'left', hidden: true },
                //{ name: "RefferedBy", width: 80, editable: true, align: 'left', hidden: false },
                //{ name: "StrCreatedBy", width: 60, editable: true, align: 'left', hidden: false },
                //{ name: "CreadtedOn", width: 110, editable: true, align: 'left', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                //{ name: "StrModifiedBy", width: 60, editable: true, align: 'left', hidden: false },
                //{ name: "ModifiedOn", width: 110, editable: true, align: 'left', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                {
                    name: "Button", width: 200, editable: false, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnPreOP_" + i + " type='button' style='margin-right: 5px; width:145px;'  class='btn btn-primary' onclick=fnOpenForm('PO','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i>" + localization.PreOperative + " </button >"
                            +
                            "<button id=btnSFoll_" + i + " type='button' style='margin-right: 5px; width:145px;' class='btn btn-primary' onclick=fnOpenForm('SF','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.FollowUpSurgical +" </button >"
                            +
                            "<button id=btnFStay_" + i + " type='button' style='margin-right: 5px; width:145px;' class='btn btn-primary' onclick=fnOpenForm('FS','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.FacilityStay +" </button >"
                            +
                            "<button id=btnNFoll_" + i + " type='button' style='margin-right: 5px; width:145px;' class='btn btn-primary' onclick=fnOpenForm('NF','" + rowObject.AppointmentKey + "','" + rowObject.UHID + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.FollowUpNutrition +" </button >";
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
               // fnJqgridSmallScreen('jqgAppointmentDetail');
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
                    else {
                        $("#btnPreOP_" + rows[a]).hide();
                        $("#btnFStay_" + rows[a]).hide();
                        $("#btnSFoll_" + rows[a]).hide();
                        $("#btnNFoll_" + rows[a]).hide();
                    }



                    AutoCompleteList.push({ label: row.PatientName, value: row.PatientName });
                    AutoCompleteList.push({ label: row.UHID, value: row.UHID });
                    AutoCompleteList.push({ label: row.PatientMobileNumber, value: row.PatientMobileNumber });
                }
                $("#txtSearchBox").autocomplete({
                    source: AutoCompleteList
                });

                $("#txtSearchBox").autocomplete({
                    source: AutoCompleteList
                });
                if (_UT != '20001' && _UT != '20008' && _UT != '20009') {
                    $("#jqgAppointmentDetail").hideCol("Button")
                }
            }
        });


}
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
            colNames: [localization.TransactionDate, localization.VisitNumber, localization.FormType,localization.CreatedBy, localization.Actions],
            colModel: [
                { name: "TransactionDate", width: 20, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                { name: "VisitNumber", width: 20, editable: true, align: 'left', hidden: false },
                {
                    name: "CLType", width: 30, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_fType
                    },
                },
                { name: "StrCreatedBy", width: 20, editable: true, align: 'left', hidden: false },
                {
                    name: "Button", width: 30, editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnEMR_" + i + " type='button' style='margin-right: 5px;'  class='btn btn-primary' onclick=fnOpenFormf('" + rowObject.VisitNumber + "','" + rowObject.CLType + "') > <i class='fas fa-external-link-alt c-white'></i> " + localization.ViewForm + " </button >";
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
function fnLoadSurgeries() {

    $("#jqgSurgeries").jqGrid('GridUnload');
    $("#jqgSurgeries").jqGrid(
        {
            url: getBaseURL() + '/PatientClinicalForms/GetSurgeries',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                UHID: $('#hdUHID').val()
            },
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8', async: true },
            colNames: [localization.SurgeryDate, localization.Surgery],
            colModel: [
                { name: "TransactionDate", width: 20, editable: true, align: 'center', hidden: false, formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
                {
                    name: "Value", width: 30, editable: true, formatter: 'select',
                    edittype: 'select', editoptions: {
                        value: l_sur
                    },
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
            pager: "#jqpSurgeries",
            onSelectRow: function (rowid) {

            },
            loadComplete: function () {
               // fnJqgridSmallScreen('jqgSurgeries');
            }
        });


}
function fnOpenForm(ftype, appKey, uhid) {
    var url = "";
    var IsApp = '';
    if ($('#hdIsApp').val() === 'Y') {
        IsApp = '&IsApp=Y';
    }
    if (ftype === "PO") {
        if (_UT == '20001' || _UT == '20008') {
            url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PreOperative?UHID=' + uhid + '&AppKey=' + appKey + IsApp;
        }
        else {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        
    }
    if (ftype === "FS") {
        if (_UT == '20001' || _UT == '20008') {
            url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/FacilityStay?UHID=' + uhid + '&AppKey=' + appKey + IsApp;
        }
        else {
            toastr.warning("You are not authorized to view this page");
            return;
        }
    }
    if (ftype === "SF") {
        if (_UT == '20001' || _UT == '20008') {
            url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/SurgicalFollowup?UHID=' + uhid + '&AppKey=' + appKey + IsApp;
        }
        else {
            toastr.warning("You are not authorized to view this page");
            return;
        }  
    }
    if (ftype === "NF") {
        if (_UT == '20001' || _UT == '20008' || _UT == '20009') {
            url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/NutritionFollowup?UHID=' + uhid + '&AppKey=' + appKey + IsApp;
        }
        else {
            toastr.warning("You are not authorized to view this page");
            return;
        }
    }
    //document.location.assign(url);
    window.open(
        url,
        '_blank' 
        // <- This is what makes it open in a new window.
        ,''
    );

}
function fnOpenFormf(appKey, ftype) {
    var uhid = $('#hdUHID').val();
    fnOpenForm(ftype, appKey, uhid)
}
function fnPatientForms() {
    //if (_userFormRole.IsSurgeon === false || _userFormRole.IsNutrition === false) {
    //    toastr.warning("You are not authorized to view this page");
    //    return;
    //}
    var uhid = $('#hdUHID').val();
    var url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PatientForms?UHID=' + uhid;
   // window.location.replace(url);
    //document.location.assign(url);
    window.open(
        url,
        '_blank' // <- This is what makes it open in a new window.
    );
}
function fnAddNewForm(ftype) {
    var msg = "";
    var url = "";
    var IsApp = '';
    if ($('#hdIsApp').val() === 'Y') {
        IsApp = '&IsApp=Y';
    }
    var uhid = $('#hdUHID').val();

    if (ftype === "PO") {

        if (_UT != '20001' && _UT != '20008')  {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Pre-Operative form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/PreOperative?UHID=' + uhid + IsApp + '&AppKey=';
    }
    if (ftype === "FS") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Facility Stay form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/FacilityStay?UHID=' + uhid + IsApp + '&AppKey=';
    }
    if (ftype === "SF") {
        if (_UT != '20001' && _UT != '20008') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Surgical Follow-Up form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/SurgicalFollowup?UHID=' + uhid + IsApp + '&AppKey=';
    }
    if (ftype === "NF") {
        if (_UT != '20001' && _UT != '20008' && _UT != '20009') {
            toastr.warning("You are not authorized to view this page");
            return;
        }
        msg = "Do you want to create new Nutrition Follow-Up form without a visit ?";
        url = getBaseURL() + '/eSyaOutPatient/PatientClinicalForms/NutritionFollowup?UHID=' + uhid + IsApp + '&AppKey=';
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
                            //document.location.assign(url + response.Message);
                            window.open(
                                url + response.Message,
                                '_blank' // <- This is what makes it open in a new window.
                            );
                        }
                        else {
                            toastr.error(response.Message);
                        }
                    },
                    error: function (error) {
                        toastr.error(error.statusText);
                    }
                });
                fnProcessLoading(false);
            }
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
    $('#mainContent').offset().top = 0;
    setTimeout(function () { fnsideBarSetup() }, 1000);
   
});
$(window).on('resize', function () {
    fnsideBarSetup();
    
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

