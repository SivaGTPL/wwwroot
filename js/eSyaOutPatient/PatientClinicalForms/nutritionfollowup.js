var fValid = true;
var _height = 0;
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
    _height = result[0].Height;
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

    fnProcessLoading(true);
    $.when(Utils_ClinicalCharts.populateClinicalTemplate("NF1"))

        .then(getClinicalInformation("NF1", function (data) {
            Utils_ClinicalCharts.setTemplateInformation(data);
        }))
        .then(Utils_ClinicalCharts.gridClinicalCharts("BM"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("FI"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("AL"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("MF"))
        .then(Utils_ClinicalCharts.gridClinicalCharts("INV"))
   
    
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
                $.getJSON(getBaseURL() + "/json/eSyaOutPatient/nutritionfollowup.json",
                    function (data) {
                        cl_catalog = data;
                        var i = 0;
                        var d = data.filter(element => element.cltype === type);

                        $.each(d, function (key, item_nav) {
                            $.each(item_nav.item, function (keys, item_control) {
                                //console.log(type + ';' + item_control.controlid + ';' + item_control.name)
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
                                else if (colId === "ChartNumber") {
                                    dataRow["ChartNumber"] = data.ChartNumber;
                                }
                                else {
                                    $.each(data.l_ControlValue, function (ky, cl) {
                                        if (cl.CLControlID === colId) {
                                            if (cl.CLControlID === colId) {
                                                if (cl.CLControlID === "INV-5" || cl.CLControlID === "BM-9") {
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
                    }).then(function () {

                        gv_colNames.push("Action");
                        gv_colModel.push({
                            name: 'edit', search: false, align: 'left', width: 90,
                            formatter: function (cellValue, options, rowdata, action) {
                                return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editClinicalCharts(\'' + type + '\',event,\'view\')"><i class="far fa-eye"></i> </button>'
                               // return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editClinicalCharts(\'' + type + '\',event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>'
                                +
                                    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgView" onclick="return DeleteClinicalInformationData(\'' + type + '\',\'' + rowdata.TransactionID + '\',event,\'view\')"><i class="fas fa-trash"></i> </button>';
                            }
                        });

                        if (type === "BM") {
                            
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
                                   // fnJqgridSmallScreen('jqgBM-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpBM-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
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
                            fnProcessLoading(false);
                        }                       
                        else if (type === "FI") {
                            $("#jqgFI-GRID").jqGrid('GridUnload');
                            $("#jqgFI-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpFI-GRID",
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
                                   // fnJqgridSmallScreen('jqgFI-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpFI-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();

                        }
                        else if (type === "AL") {
                            $("#jqgAL-GRID").jqGrid('GridUnload');
                            $("#jqgAL-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpAL-GRID",
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
                                   // fnJqgridSmallScreen('jqgAL-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpAL-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();


                        }
                        else if (type === "MF") {
                            $("#jqgMF-GRID").jqGrid('GridUnload');
                            $("#jqgMF-GRID").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpMF-GRID",
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
                                   // fnJqgridSmallScreen('jqgMF-GRID');
                                }
                            }).jqGrid('navGrid', '#jqpMF-GRID', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth();
                           
                        }
                        
                    });
            });
    },
    populateClinicalTemplate: function (type) {
        
        var section_item = "";
        return new Promise(function (resolve) {
            $.getJSON(getBaseURL() + "/json/eSyaOutPatient/nutritionfollowup.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);

                $.each(d, function (key, item_nav) {
                    section_item = "<div class='row border-bottom m-0'>";
                    $.each(item_nav.item, function (keys, item_control) {
                        //console.log(type + ';' + item_control.controlid + ';' + item_control.name)
                        if ($('#lblGender').html() === item_control.specific_to || IsStringNullorEmpty(item_control.specific_to)) {
                            if (item_control.valuetype === "") {

                            }
                            if (item_control.valuetype === "header") {
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><h5>" + item_control.name + "</h5><hr></div>";
                            }
                            if (item_control.valuetype === "heading") {
                                section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 p-0'><h6 class='sub-heading'>" + item_control.name + "</h6></div>";
                            }
                            if (item_control.valuetype === "htmltag") {
                                section_item += "<div>" + item_control.name + "</div>";
                            }
                            if (item_control.valuetype === "float") {
                                if (type === "NC")
                                    section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><div class= 'form-group'>";
                                else
                                    section_item += "<div class='col-lg-4 col-md-4 col-sm-6 pl-0'><div class= 'form-group'>";
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
                                else {

                                    if (item_control.controlid == "BM-2") {
                                        section_item += "<input id='" + item_control.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' value='" + _height + "' style='width:80px' onchange=" + eventName + " >";
                                    }
                                    else {
                                        section_item += "<input id='" + item_control.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:80px' onchange=" + eventName + " >";
                                    }

                                }
                                section_item += "<span class='f-italic'>" + item_control.unittype + "</span>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "text") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0'><div class= 'form-group'>";
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
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0' style='margin-bottom: 15px;'>";
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
                                        section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0' style='margin-bottom: 15px;'>";
                                        section_item += "<label class='lblCheck' for='" + chd.controlid + "'>";
                                        section_item += "<input id='" + chd.controlid + "' class='' type='checkbox' />";
                                        section_item += "<span class=''>" + chd.name + "</span>";
                                        section_item += "</label></div>";
                                    }
                                    if (chd.valuetype === "text") {
                                        section_item += "<div class='col-lg-4 col-md-6 col-sm-6 col-6 pl-0'><div class= 'form-group'>";
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
                                        section_item += "<option value='0' selected>Select</option>";
                                        $.each(chd.values, function (keyv, item_values) {
                                            //console.log(chd.controlid + ';' + item_values.value + ';' + item_values.name)
                                            section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                                        });
                                        section_item += "</select>";
                                        section_item += "</div></div>";
                                    }
                                    if (chd.valuetype === "datetime") {
                                        section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0'><div class= 'form-group'>";
                                        section_item += "<label>" + chd.name + "</label>";
                                        section_item += "<input id='" + chd.controlid + "' class='form-control' type='datetime-local' />";
                                        section_item += "</div></div>";
                                    }
                                    if (chd.valuetype === "date") {
                                        section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0'><div class= 'form-group'>";
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
                                        section_item += "<div class='col-lg-4 col-md-4 col-sm-6 pl-0'><div class= 'form-group'>";
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
                                });

                                section_item += "</div></div>";

                            }
                            if (item_control.valuetype === "combox") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<select class='selectpicker form-control' id='" + item_control.controlid + "' onchange=Utils_ClinicalCharts.onChange_Combox('" + item_control.controlid + "') data-container='body'>";
                                section_item += "<option value='0' selected>Select</option>";
                                $.each(item_control.values, function (keyv, item_values) {
                                    //console.log(item_control.controlid + ';' + item_values.value + ';' + item_values.name)
                                    section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                                });
                                section_item += "</select>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "datetime") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0'><div class= 'form-group'>";
                                section_item += "<label>" + item_control.name + "</label>";
                                section_item += "<input id='" + item_control.controlid + "' class='form-control' type='datetime-local' />";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "date") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0'><div class= 'form-group'>";
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
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px'>";
                                section_item += "<table id='jqg" + item_control.controlid + "'></table>";
                                section_item += "<div id='jqp" + item_control.controlid + "'></div>";
                                section_item += "</div>";
                                section_item += "<div class='col-lg-12 col-md-12 col-sm-12' style='padding-right:0px;padding-top: 10px;padding-bottom: 10px;'>";
                                section_item += "<button type='button' class='mdl-button' onclick=addtogrid('" + item_control.type + "')><i class='fa fa-plus'></i></button>";
                                section_item += "</div></div>";
                            }
                            if (item_control.valuetype === "fileupload") {
                                section_item += "<div class='col-lg-4 col-md-6 col-sm-6 pl-0'><div class= 'form-group'>";
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

                if (type === "NF1")
                    $("#dvNutritionFollowupTemplate").html(section_item);
                if (type === "BM")
                    $("#dvBodyMeasures").html(section_item);
                if (type === "INV")
                    $("#dvInvestigations").html(section_item);
                if (type === "FI")
                    $("#dvFluidIntake").html(section_item);
                if (type === "AL")
                    $("#dvActivitylevel").html(section_item);
                if (type === "MF")
                    $("#dvMealfrequencies").html(section_item);
                

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
        });

        $(".selectpicker").selectpicker('refresh');
        $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
    },
    getClinicalTemplate: function (type) {

        return new Promise(function (resolve) {
            var l_Control = [];

            $.getJSON(getBaseURL() + "/json/eSyaOutPatient/nutritionfollowup.json", function (data) {
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
                        if (item_control.valuetype === "date") {
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
                            if (item_control.mandatory === "Y" && (IsStringNullorEmpty($('#' + item_control.controlid).val()) || $('#' + item_control.controlid).val() === '0')) {
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
                                // console.log(files)
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

function addBodyMeasures() {
    setDate($('#dpBodyMeasuresDate'), new Date());
    $('#tpBodyMeasuresTime').val(new Date().timeToInput());
    $("#btnSaveBodyMeasures").show();
    $("#PopupBodyMeasures").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("BM");
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
function addFluidIntake() {
    setDate($('#dpFluidIntakeDate'), new Date());
    $('#tpFluidIntakeTime').val(new Date().timeToInput());
    $("#btnSaveFluidIntake").show();
    $("#PopupFluidIntake").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("FI");
}
function addActivitylevel() {
    setDate($('#dpActivitylevelDate'), new Date());
    $('#tpActivitylevelTime').val(new Date().timeToInput());
    $("#btnSaveActivitylevel").show();
    $("#PopupActivitylevel").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("AL");
}
function addMealfrequencies() {
    setDate($('#dpMealfrequenciesDate'), new Date());
    $('#tpMealfrequenciesTime').val(new Date().timeToInput());
    $("#btnSaveMealfrequencies").show();
    $("#PopupMealfrequencies").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("MF");
}



function saveBodyMeasures() {
    fnProcessLoading(true, "saving");
    $("#btnSaveBodyMeasures").attr('disabled', true);

    var l_BodyMeasures = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("BM"))

        .then(function (l_BodyMeasures) {
        var med = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpBodyMeasuresDate')),
            TransactionTime: $('#tpBodyMeasuresTime').val(),
            l_ControlValue: l_BodyMeasures,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(med, function (result) {
            fnProcessLoading(false);
            $("#btnSaveBodyMeasures").attr('disabled', false);
            if (result) {
                $("#PopupBodyMeasures").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("BM");
            }
        });


        });
    $("#btnSaveBodyMeasures").attr('disabled', false);
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
function saveFluidIntake() {
    fnProcessLoading(true, "saving");
    $("#btnSaveFluidIntake").attr('disabled', true);

    var l_FluidIntake = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("FI")).then(function (l_FluidIntake) {
        var bs = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpFluidIntakeDate')),
            TransactionTime: $('#tpFluidIntakeTime').val(),
            l_ControlValue: l_FluidIntake,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(bs, function (result) {
            fnProcessLoading(false);
            $("#btnSaveFluidIntake").attr('disabled', false);
            if (result) {
                $("#PopupFluidIntake").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("FI");
            }
        });

    });
}
function saveActivitylevel() {
    fnProcessLoading(true, "saving");
    $("#btnSaveActivitylevel").attr('disabled', true);

    var l_Activitylevel = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("AL")).then(function (l_Activitylevel) {
        var nb = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpActivitylevelDate')),
            TransactionTime: $('#tpActivitylevelTime').val(),
            l_ControlValue: l_Activitylevel,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(nb, function (result) {
            fnProcessLoading(false);
            $("#btnSaveActivitylevel").attr('disabled', false);
            if (result) {
                $("#PopupActivitylevel").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("AL");
            }
        });

    });
}
function saveMealfrequencies() {
    fnProcessLoading(true, "saving");
    $("#btnSaveMealfrequencies").attr('disabled', true);

    var l_Mealfrequencies = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("MF")).then(function (l_Mealfrequencies) {
        var bm = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            VisitNumber: $('#hdAppKey').val(),
            TransactionDate: getDate($('#dpMealfrequenciesDate')),
            TransactionTime: $('#tpMealfrequenciesTime').val(),
            l_ControlValue: l_Mealfrequencies,
            ActiveStatus: true,
            UserID: 0
        };
        saveClinicalInformationData(bm, function (result) {
            fnProcessLoading(false);
            $("#btnSaveMealfrequencies").attr('disabled', false);
            if (result) {
                $("#PopupMealfrequencies").modal('hide');

                Utils_ClinicalCharts.gridClinicalCharts("MF");
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
    if (value === 'FI') {
        addFluidIntake();
    }
    if (value === 'BM') {
        addBodyMeasures();
    }
    if (value === 'INV') {
        addInvestigations();
    }
    if (value === 'AL') {
        addActivitylevel();
    }
    if (value === 'MF') {
        addMealfrequencies();
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
function saveNutritionFollowupInformation(l_data, callback) {
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
function fnSaveNutritionFollowup() {
    fnProcessLoading(true, "saving");
    $("#btnSaveNutritionFollowup").attr('disabled', true);
    var fs_val = $('#NF1').val();
    var l_NF = [];
    var l_All = [];
    $.when(Utils_ClinicalCharts.getClinicalTemplate("NF1")).then(function (l_NF) {
        l_All = l_All.concat(l_NF);
    })
        .then(function () {
            var nf = {
                TransactionID: $('#hdTransactionID').val(),
                UHID: $('#hdUHID').val(),
                VisitNumber: $('#hdAppKey').val(),
                l_ControlValue: l_All,
                ActiveStatus: true,
                UserID: 0
            };
            saveNutritionFollowupInformation(nf, function (result) {
                fnProcessLoading(false);
                $("#btnSaveNutritionFollowup").attr('disabled', false);
            });
        });
        
    $("#btnSaveNutritionFollowup").attr('disabled', false);
}

function editClinicalCharts(type, e, actiontype) {
    if (type === "INV")
        editInvValuesCharts(e, actiontype);
    else if (type === "BM")
        editBMValuesCharts(e, actiontype);
    else if (type === "FI")
        editFIValuesCharts(e, actiontype);
    else if (type === "AL")
        editALSValuesCharts(e, actiontype);
    else if (type === "MF")
        editMFValuesCharts(e, actiontype);
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
function editBMValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBM-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveBodyMeasures").hide();
    $("#PopupBodyMeasures").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;
   
    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpBodyMeasuresDate'), val.TransactionDate);
            $('#tpBodyMeasuresTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("BM")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
   
}
function editFIValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgFI-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveFluidIntake").hide();
    $("#PopupFluidIntake").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpFluidIntakeDate'), val.TransactionDate);
            $('#tpFluidIntakeTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("FI")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editALSValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAL-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveActivitylevel").hide();
    $("#PopupActivitylevel").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpActivitylevelDate'), val.TransactionDate);
            $('#tpActivitylevelTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("AL")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}
function editMFValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgMF-GRID').jqGrid('getRowData', rowid);
    $("#btnSaveMealfrequencies").hide();
    $("#PopupMealfrequencies").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpMealfrequenciesDate'), val.TransactionDate);
            $('#tpBodyMealfrequenciesTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("MF")).then(function () {
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

