var fValid = true;
_painscore_id = '';
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
var l_int = {
    '1': 'Cholecystectomy',
    '2': 'exploration',
    '3': 'Percutaneous drainage',
    '4': 'EGD intervention',
    '5': 'ERCP',
    '6': 'PTC',
    '7': 'other (specify)'
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
    //fnProcessLoading(true);
    $("#mainContent").on('scroll', function () {
       // alert($("#mainContent").offset().top)
    });
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        // Do something
       // console.log(scroll);
    });
    
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
        const d = new Date(result[0].SurgeryDate);
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

    
    $.when(Utils_ClinicalCharts.populateClinicalTemplate("FS0"))

        .then(getClinicalInformation("FS0", function (data) {
            Utils_ClinicalCharts.setTemplateInformation(data);
        }))

   
    
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

        

        $.get(getBaseURL() + '/PatientClinicalForms/GetInformationValueView',
            {
                UHID: $('#hdUHID').val(),
                vNumber: $('#hdAppKey').val(),
                clType: type
            }, function (data, status) {
                cl_result = data;
            }).then(function () {
                $.getJSON(getBaseURL() + "/json/eSyaOutPatient/facilitystay.json",
                    function (data) {
                        cl_catalog = data;
                        var i = 0;
                        var d = data.filter(element => element.cltype === type);

                        $.each(d, function (key, item_nav) {
                            $.each(item_nav.item, function (keys, item_control) {
                                //console.log(type + ';' + item_control.controlid + ';' + item_control.name)
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
                                                } });
                                            }
                                            
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
                                        else if (type === "INT") {
                                            gv_colModel.push({
                                                name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                edittype: 'select', editoptions: {
                                                    value: l_int
                                                }
                                            });
                                        }
                                        else if (type === "CONS") {
                                            gv_colModel.push({
                                                name: item_control.controlid, width: 80, editable: true, formatter: 'select',
                                                edittype: 'select', editoptions: {
                                                    value: l_cons
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
                            //if (data["l_ControlValue"][0]["CLType"] === "CONS") {
                            //    console.log('result')
                            //    console.log(data)
                            //}
                            $.each(gv_colId, function (keys, colId) {
                                if (colId === "TransactionID") {
                                    dataRow["TransactionID"] = data.TransactionID;
                                }
                                else if (colId === "TransactionDate") {
                                    dataRow["TransactionDate"] = data.TransactionDate;
                                }
                                else if (colId === "ChartNumber") {
                                    dataRow["ChartNumber"] = data.ChartNumber;
                                }
                                else {
                                    $.each(data.l_ControlValue, function (ky, cl) {
                                        if (cl.CLControlID === colId) {
                                            if (cl.CLControlID === "CONS-3" || cl.CLControlID === "INT-3" || cl.CLControlID === "INV-5") {
                                                dataRow[colId] = '<div style="display:flex"><a class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid f-11" href="' + getBaseURL() + '/ClinicalFormsAttachments/' + cl.Value + '" target="_blank">View</a>';
                                            }

                                            else {
                                                dataRow[colId] = cl.Value;
                                            }
                                            
                                        }

                                    });
                                }

                            });
                            gv_data.push(dataRow);
                        });
                        //alert(JSON.stringify(gv_colNames));
                        //alert(JSON.stringify(gv_colModel));
                        //alert(JSON.stringify(gv_data));
                    }).then(function () {

                        gv_colNames.push("Action");
                        gv_colModel.push({
                            name: 'edit', search: false, align: 'left', width: 90,
                            formatter: function (cellValue, options, rowdata, action) {
                                return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editClinicalCharts(\''+ type +'\',event,\'view\')"><i class="far fa-eye"></i> </button>'
                                //return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editClinicalCharts(\'' + type + '\',event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>'
                                    +
                                    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgView" onclick="return DeleteClinicalInformationData(\'' + type + '\',\'' + rowdata.TransactionID + '\',event,\'view\')"><i class="fas fa-trash"></i> </button>';
                            }
                        });

                        if (type === "MED") {
                            
                            $("#jqgMED-GRID").jqGrid('GridUnload');
                            $("#jqgMED-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpMED-GRID",
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
                                    //fnJqgridSmallScreen('jqgMED-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpMED-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();
                            
                        }
                        else if (type === "INV") {

                            $("#jqgINV-GRID").jqGrid('GridUnload');
                            $("#jqgINV-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpINV-GRID",
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
                                   // fnJqgridSmallScreen('jqgINV-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpINV-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();                            
                        }                       
                        else if (type === "PN") {
                            $("#jqgPN-GRID").jqGrid('GridUnload');
                            $("#jqgPN-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpPN-GRID",
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
                                   // fnJqgridSmallScreen('jqgPN-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpPN-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }
                        else if (type === "CONS") {
                            $("#jqgCONS-GRID").jqGrid('GridUnload');
                            $("#jqgCONS-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpCONS-GRID",
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
                                  //  fnJqgridSmallScreen('jqgCONS-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpCONS-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }
                        else if (type === "ST") {
                            $("#jqgST-GRID").jqGrid('GridUnload');
                            $("#jqgST-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpST-GRID",
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
                                   // fnJqgridSmallScreen('jqgST-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpST-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();


                        }
                        else if (type === "INT") {
                            $("#jqgINT-GRID").jqGrid('GridUnload');
                            $("#jqgINT-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpINT-GRID",
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
                                   // fnJqgridSmallScreen('jqgINT-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpINT-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }
                        
                    });
            });
    },
    populateClinicalTemplate: function (type) {
        
        var section_item = "";
        return new Promise(function (resolve) {
            $.getJSON(getBaseURL() + "/json/eSyaOutPatient/facilitystay.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);

                $.each(d, function (key, item_nav) {
                    section_item = "<div class='row border-bottom m-0'>";
                    $.each(item_nav.item, function (keys, item_control) {
                        //console.log(type + ';' + item_control.controlid + ';' + item_control.name)
                        if (item_control.valuetype === "") {

                        }
                        if (item_control.valuetype === "header") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><h5>" + item_control.name + "</h5><hr></div>";
                        }
                        if (item_control.valuetype === "heading") {
                            section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 pl-0'><h6 class='main-heading'>" + item_control.name + "</h6></div>";
                        }
                        if (item_control.valuetype === "htmltag") {
                            section_item += "<div>" + item_control.name + "</div>";
                        }
                        if (item_control.valuetype === "htmldiv") {
                            section_item += item_control.name ;
                        }
                        if (item_control.valuetype === "float") {
                            if (type === "NC")
                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><div class= 'form-group'>";
                            else
                                section_item += "<div class='col-lg-4 col-md-4 col-sm-4 pl-0'><div class= 'form-group'>";
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
                                    section_item += "<select class='selectpicker form-control' data-container='body' id='" + chd.controlid + "'>";
                                    section_item += "<option value='0' selected>Select</option>";
                                    $.each(chd.values, function (keyv, item_values) {
                                        //console.log(chd.controlid + ';' + item_values.value + ';' + item_values.name)
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
                                if (chd.valuetype === "time") {
                                    section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                                    section_item += "<label>" + chd.name + "</label>";
                                    section_item += "<input id='" + chd.controlid + "' class='form-control' type='time' />";
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
                                    section_item += "<table id='jqg" +chd.type + chd.controlid + "'></table>";
                                    section_item += "<div id='jqp" + chd.type + chd.controlid + "'></div>";
                                    section_item += "</div>";
                                    section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                                    section_item += "<button type='button' class='mdl-button' onclick=add" + chd.type + "('" + chd.value + "')><i class='fa fa-plus'></i></button>";
                                    section_item += "</div></div><br>";
                                }
                            });
                              
                            section_item += "</div></div>";
                            
                        }
                        if (item_control.valuetype === "combox") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<select class='selectpicker form-control' data-container='body' id='" + item_control.controlid + "' onchange=Utils_ClinicalCharts.onChange_Combox('" + item_control.controlid + "')>";
                            section_item += "<option value='0' selected>Select</option>";
                            $.each(item_control.values, function (keyv, item_values) {
                                //console.log(item_control.controlid + ';' + item_values.value + ';' + item_values.name)
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
                        if (item_control.valuetype === "time") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<input id='" + item_control.controlid + "' class='form-control' type='time' />";
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
                            section_item += "<h6 class='main-heading'>" + item_control.name + "</h6>";
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
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 overflow-y-auto' style='padding-right:0px'>";
                            section_item += "<table id='jqg" + item_control.controlid + "'></table>";
                            section_item += "<div id='jqp" + item_control.controlid + "'></div>";
                            section_item += "</div>";
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                            section_item += "<button type='button' class='mdl-button' onclick=addtogrid('" + item_control.type + "')><i class='fa fa-plus'></i></button>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "fileupload") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<div class='input-group'><div class='custom-file'>";
                            section_item += "<input type='file' name='files' id='" + item_control.controlid + "' />";
                            section_item += "</div></div></div></div>";
                        }
                        
                    });
                    section_item += "</div>";
                     });
            }).done(function () {

                if (type === "FS0")
                    $("#dvFacilityStayTemplate").html(section_item);
                if (type === "FS1" || type === "FS3" || type === "FS4")
                    $("#dvFacilityStayDetailsTemplate").html(section_item);

                if (type === "MED")
                    $("#dvMedications").html(section_item);
                if (type === "INV")
                    $("#dvInvestigations").html(section_item);
                if (type === "INT")
                    $("#dvInterventions").html(section_item);
                if (type === "PN")
                    $("#dvProgressNotes").html(section_item);
                if (type === "ST")
                    $("#dvStaples").html(section_item);
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
            if (item.ValueType === "float" || item.ValueType === "date" || item.ValueType === "time" || item.ValueType === "text" || item.ValueType === "ltext"
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
                if (item.Value === 'true') {
                    $('#' + item.CLControlID).prop("checked", true);
                }                    
                if (item.Value === 'false') {
                    $('#' + item.CLControlID).prop("checked", false);
                }                    
                Utils_ClinicalCharts.onChange_Checklist(item.CLControlID);
                
            }
            if (item.ValueType === "radio") {
                $('input:radio[name="' + item.CLControlID + '"][value=' + item.Value + ']').prop('checked', true).trigger("click");
            }
            if (item.ValueType === "datetime") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "time") {
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

            $.getJSON(getBaseURL() + "/json/eSyaOutPatient/facilitystay.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);
                $.each(d, function (key, item_nav) {
                    $.each(item_nav.item, function (keys, item_control) {
                        //console.log(type + ';' + item_control.controlid + ';' + item_control.name)
                        if (item_control.valuetype === "float") {
                            if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                toastr.warning("Please enter the " + item_control.name + " Value");
                                fnProcessLoading(false);
                                fValid = false;
                                return false;
                            }
                            fValid = true;
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "text") {
                            if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                toastr.warning("Please enter the " + item_control.name + " Value");
                                fnProcessLoading(false);
                                fValid = false;
                                return false;
                            }
                            fValid = true;
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
                        if (item_control.valuetype === "date" || item_control.valuetype === "time") {
                            if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                toastr.warning("Please enter the " + item_control.name + " Value");
                                fnProcessLoading(false);
                                fValid = false;
                                return false;
                            }
                            fValid = true;
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
                                    if (chd.valuetype === "date" || chd.valuetype === "time") {
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
                            if (item_control.mandatory === "Y" && (IsStringNullorEmpty($('#' + item_control.controlid).val()) || $('#' + item_control.controlid).val()==='0' )) {
                                toastr.warning("Please select the " + item_control.name);
                                fnProcessLoading(false);
                                fValid = false;
                                return false;
                            }
                            fValid = true;
                            l_Control.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "painscore") {
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty(_painscore_id)) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            if (!IsStringNullorEmpty(_painscore_id)) {
                                l_Control.push({
                                    CLType: type,
                                    CLControlID: item_control.controlid,
                                    ValueType: item_control.valuetype,
                                    Value: _painscore_id
                                });
                            }

                            
                        }
                        if (item_control.valuetype === "fileupload") {
                            // Checking whether FormData is available in browser  
                            if (window.FormData !== undefined) {
                                var fileUpload = $('#' + item_control.controlid).get(0);
                                var files = fileUpload.files;
                                //console.log(files)
                               // console.log(files.length)
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
                                           // console.log(result)
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
            }).done(function () {
                if (fValid) {
                    resolve(l_Control);
                }

            });
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
        if (id === 'FS0-1') {
            fnProcessLoading(true)
            var temp = $('#' + id).val();
            if (temp === 'FS1' || temp === 'FS2') {
                $.when(Utils_ClinicalCharts.populateClinicalTemplate("FS1"))                    
                    .then(Utils_ClinicalCharts.gridClinicalCharts("INT"))
                    .then(Utils_ClinicalCharts.gridClinicalCharts("MED"))
                    .then(Utils_ClinicalCharts.gridClinicalCharts("INV"))
                    .then(Utils_ClinicalCharts.gridClinicalCharts("PN"))
                    .then(Utils_ClinicalCharts.gridClinicalCharts("CONS"))
                    .then(getClinicalInformation("FS1", function (data) {
                        Utils_ClinicalCharts.setTemplateInformation(data);
                    }))
            }
            if (temp === 'FS3') {
                $.when(Utils_ClinicalCharts.populateClinicalTemplate(temp))
                    .then(Utils_ClinicalCharts.gridClinicalCharts("ST"))
                    .then(getClinicalInformation("FS3", function (data) {
                        Utils_ClinicalCharts.setTemplateInformation(data);
                    }))
                    
            }
            if (temp === 'FS4') {
                $.when(Utils_ClinicalCharts.populateClinicalTemplate(temp))
                    .then(Utils_ClinicalCharts.gridClinicalCharts("ST"))
                    .then(getClinicalInformation("FS4", function (data) {
                        Utils_ClinicalCharts.setTemplateInformation(data);
                    }))

            }
           
        }
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
             else{
                $('#INV-2').html("<option value='0' selected>Select</option>");
                $('#INV-2').selectpicker('refresh');
             }
        }
       
        if (id === 'FS4-5' || id === 'FS4-5-18' || id === 'FS3-5') {
            var sVal = $('#' + id).val();
            $('#' + id + '_4').hide();
            $('#' + id + '_11').hide();
            $('#' + id + '_2').hide();
            if (sVal === '4') {
                $('#' + id + '_4').show();
            }
            if (sVal === '2') {
                $('#' + id + '_2').show();
            }
            if (sVal === '11' || sVal === '9' || sVal === '10') {
                $('#' + id + '_11').show();
            }
        }
   
    },
    setTemplateInformation: function (result) {
        $.each(result, function (keys, item) {
            if (item.ValueType === "float" || item.ValueType === "date" || item.ValueType === "time"  || item.ValueType === "text" || item.ValueType === "ltext"
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
                if (item.Value === 'true') {
                    $('#' + item.CLControlID).prop("checked", true);
                }
                if (item.Value === 'false') {
                    $('#' + item.CLControlID).prop("checked", false);
                }
                Utils_ClinicalCharts.onChange_Checklist(item.CLControlID);

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
            if (item.ValueType === "painscore") {
                $(".ratings label.active").removeClass('active');
                _painscore_id = "lbl" + item.Value;
                $("#lbl" + item.Value).addClass('active');
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
function addInterventions() {
    setDate($('#dpInterventionsDate'), new Date());
    $('#tpInterventionsTime').val(new Date().timeToInput());
    $("#btnSaveInterventions").show();
    $("#PopupInterventions").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("INT");
}
function addProgressNotes() {
    setDate($('#dpProgressNotesDate'), new Date());
    $('#tpProgressNotesTime').val(new Date().timeToInput());
    $("#btnSaveProgressNotes").show();
    $("#PopupProgressNotes").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("PN");
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
function addStaples() {
    setDate($('#dpStaplesDate'), new Date());
    $('#tpStaplesTime').val(new Date().timeToInput());
    $("#btnSaveStaples").show();
    $("#PopupStaples").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("ST");
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
function saveInterventions() {
    fnProcessLoading(true, "saving");
    $("#btnSaveInterventions").attr('disabled', true);

    var l_Interventions = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("INT")).then(function (l_Interventions) {
        var bs = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpInterventionsDate')),
            TransactionTime: $('#tpInterventionsTime').val(),
            l_ControlValue: l_Interventions,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(bs, function (result) {
            fnProcessLoading(false);
            $("#btnSaveInterventions").attr('disabled', false);
            if (result) {
                $("#PopupInterventions").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("INT");
            }
        });

    });
}
function saveProgressNotes() {
    fnProcessLoading(true, "saving");
    $("#btnSaveProgressNotes").attr('disabled', true);

    var l_ProgressNotes = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("PN")).then(function (l_ProgressNotes) {
        var nb = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpProgressNotesDate')),
            TransactionTime: $('#tpProgressNotesTime').val(),
            l_ControlValue: l_ProgressNotes,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(nb, function (result) {
            fnProcessLoading(false);
            $("#btnSaveProgressNotes").attr('disabled', false);
            if (result) {
                $("#PopupProgressNotes").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("PN");
            }
        });

    });
}
function saveConsultations() {
    fnProcessLoading(true, "saving");
    $("#btnSaveConsultations").attr('disabled', true);

    var l_Consultations = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("CONS")).then(function (l_Consultations) {
        var cons = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpConsultationsDate')),
            TransactionTime: $('#tpConsultationsTime').val(),
            l_ControlValue: l_Consultations,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(cons, function (result) {
            fnProcessLoading(false);
            $("#btnSaveConsultations").attr('disabled', false);
            if (result) {
                $("#PopupConsultations").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("CONS");
            }
        });

    });
}
function saveStaples() {
    fnProcessLoading(true, "saving");
    $("#btnSaveStaples").attr('disabled', true);

    var l_Staples = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("ST")).then(function (l_Staples) {
        var st = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpStaplesDate')),
            TransactionTime: $('#tpStaplesTime').val(),
            l_ControlValue: l_Staples,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(st, function (result) {
            fnProcessLoading(false);
            $("#btnSaveStaples").attr('disabled', false);
            if (result) {
                $("#PopupStaples").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("ST");
            }
        });

    });
}
function DeleteClinicalInformationData(type, trans) {
    bootbox.confirm({
        message: "Do you want to delete this record?",
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
                var l_val = [];

                $.when(Utils_ClinicalCharts.getClinicalTemplate(type)).then(function (l_val) {
                    var r = {
                        TransactionID: trans,
                        UHID: $('#hdUHID').val(),
                        VisitNumber: $('#hdAppKey').val(),
                        TransactionDate: getDate($('#dpStaplesDate')),
                        TransactionTime: $('#tpStaplesTime').val(),
                        l_ControlValue: l_val,
                        ActiveStatus: false,
                        UserID: 0
                    };
                    deleteClinicalInformationData(r, function (result) {
                        if (result) {
                            Utils_ClinicalCharts.gridClinicalCharts(type);
                        }
                    });

                });
            }
        }
    });
    
}
function deleteClinicalInformationData(l_data, callback) {
    var url = getBaseURL() + '/PatientClinicalForms/DeletePatientClinicalInformation';

    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: l_data,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Deleted");
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

function addtogrid(value) {
    if (value === 'INT') {
        addInterventions();
    }
    if (value === 'MED') {
        addMedications();
    }
    if (value === 'INV') {
        addInvestigations();
    }
    if (value === 'PN') {
        addProgressNotes();
    }
    if (value === 'CONS') {
        addConsultations();
    }
    if (value === 'ST') {
        addStaples();
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
function saveFacilityStayInformation(l_data, callback) {
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
function fnSaveFacilityStay() {
    fnProcessLoading(true, "saving");
    $("#btnSaveFacilityStay").attr('disabled', true);
    var fs_val = $('#FS0-1').val();
    var l_All = [];
    var l_FS = [];
    var l_FS_ = [];

    if (fs_val === 'FS2') {
        fs_val === 'FS1';
    }

    $.when(Utils_ClinicalCharts.getClinicalTemplate("FS0")).then(function (l_FS) {
        l_All = l_All.concat(l_FS);
    });
    $.when(Utils_ClinicalCharts.getClinicalTemplate(fs_val)).then(function (l_FS_) {
        l_All = l_All.concat(l_FS_);
    })
        .then(function () {
            var fs = {
                TransactionID: $('#hdTransactionID').val(),
                UHID: $('#hdUHID').val(),
                VisitNumber: $('#hdAppKey').val(),
                l_ControlValue: l_All,
                ActiveStatus: true,
                UserID: 0
            };
            saveFacilityStayInformation(fs, function (result) {
                fnProcessLoading(false);
                $("#btnSaveFacilityStay").attr('disabled', false);
            });
        });
        
    $("#btnSaveFacilityStay").attr('disabled', false);
}

function editClinicalCharts(type, e, actiontype) {
    if (type === "INV")
        editInvValuesCharts(e, actiontype);
    else if (type === "MED")
        editMedValuesCharts(e, actiontype);
    else if (type === "INT")
        editINTValuesCharts(e, actiontype);
    else if (type === "PN")
        editPNSValuesCharts(e, actiontype);
    else if (type === "CONS")
        editCONSValuesCharts(e, actiontype);
    else if (type === "ST")
        editSTValuesCharts(e, actiontype);
}

function editInvValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgINV-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveInvestigations").hide();
    $("#PopupInvestigations").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpInvestigationsDate'), val.TransactionDate);
            $('#tpInvestigationsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("INV")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editMedValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgMED-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveMedications").hide();
    $("#PopupMedications").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpMedicationsDate'), val.TransactionDate);
            $('#tpMedicationsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("MED")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editINTValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgINT-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveInterventions").hide();
    $("#PopupInterventions").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpInterventionsDate'), val.TransactionDate);
            $('#tpInterventionsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("INT")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editPNSValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgPN-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveProgressNotes").hide();
    $("#PopupProgressNotes").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpProgressNotesDate'), val.TransactionDate);
            $('#tpProgressNotesTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("PN")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editCONSValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCONS-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveConsultations").hide();
    $("#PopupConsultations").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpConsultationsDate'), val.TransactionDate);
            $('#tpConsultationsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("CONS")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editSTValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgST-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveStaples").hide();
    $("#PopupStaples").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpStaplesDate'), val.TransactionDate);
            $('#tpBodyStaplesTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("ST")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}

function getClinicalInformationByID(transactionID, callback) {
    $.get(getBaseURL() + '/PatientClinicalForms/GetClinicalInformationValueByTransaction',
        {
            UHID: $('#hdUHID').val(),
            vNumber: $('#hdAppKey').val(),
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
            fnProcessLoading(false)
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

    if ($('.sidebar').hasClass('hide')) {
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

    $("#jqgDrugCharts").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $("#jqgVitalCharts").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $("#jqgDoctorNotes").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
}
 
function fnratingsActive(id) {

    $(".ratings label.active").removeClass('active');
    $('#lbl' + id).addClass('active');
    _painscore_id = id;
}

