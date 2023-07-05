
Date.prototype.timeToInput = function () {
    return ('0' + (this.getHours())).substr(-2, 2) + ':' + ('0' + this.getMinutes()).substr(-2, 2);
};

$(function () {
   
});

$.get(getBaseURL() + '/NurseAssessment/GetInPatientDetailsByIPNumber', {
    ipnumber: $('#hdIPNumber').val()
}, function (result, status) {
    $('#lblPatientName').html(result.PatientName);
    $('#lblGender').html(result.Sex);
    $('#lblAge').html(result.Age);
    $('#lblDOA').html(fnFormatDateJsonToInput(result.EffectiveDateOfAdmission));
    $('#lblConsultantName').html(result.DoctorName);
    $('#lblRoomType').html(result.RoomTypeDesc);
    $('#lblBedNumber').html(result.BedNumber);
    fnsideBarSetup();
    fnProcessLoading(false);
    fnGridNurseNotes();

    Utils_ClinicalCharts.gridClinicalCharts("VT");

    Utils_ClinicalCharts.gridClinicalCharts("IO");

    Utils_ClinicalCharts.gridClinicalCharts("NC");

    gridDrugCharts();

});
function fnGridNurseNotes() {
    $("#jqgNursingCarePlan").jqGrid({
        url: getBaseURL() + '/PatientClinicalInformation/GetClinicalInformationValueForPatient',
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        postData: {
            UHID: function () { return $('#hdUHID').val(); },
            IPNumber: function () { return $('#hdIPNumber').val(); },
            clType: "NN"
        },
        colNames: ["ID", "Date", "Nurse Notes", "Actions"],
        colModel: [
            { name: "TransactionID", hidden: true },
            {
                name: 'TransactionDate', index: 'TransactionDate', width: 90, resizable: false, sorttype: "date", formatter: "date",
                formatoptions: { srcformat: "ISO8601Long", newformat: _cnfjqgDateFormat + " h:i A" }
                //formatoptions: { srcformat: "ISO8601Long", newformat: "m/d/Y h:i A" }
            },
            { name: "Value", width: 180, editable: true, align: 'left', resizable: true },
            {
                name: 'edit', search: false, align: 'left', width: 90, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editNurseNotes(event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editNurseNotes(event,\'view\')"><i class="far fa-eye"></i> </button>';
                    //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditNurseNotes(event,\'delete\')" > <i class="fas fa-trash"></i> Delete</button >'
                }
            }
        ],
        pager: "#jqpNursingCarePlan",
        rowNum: 10000,
        loadonce: true,
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
            fnJqgridSmallScreen('jqgNursingCarePlan');
        }
    }).jqGrid('navGrid', '#jqpNursingCarePlan', { add: false, edit: false, search: false, del: false, refresh: false });
    if ($('.sidebar').hasClass('hide')) {
        fnRefreshGridFullWidth();
    }
    else {
        fnRefreshGridWidth(); 
    }
   
}
 

function addNurseNotes() {
    setDate($('#dpNurseDate'), new Date());
    $('#tpNurseTime').val(new Date().timeToInput());
    $('#txtNurseNotes').val("");
    $("#PopupNurseNotes").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;
}

var _isUpdate = false;
var _intTransactionId = 0;

function editNurseNotes(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgNursingCarePlan').jqGrid('getRowData', rowid);

    $("#PopupNurseNotes").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpNurseDate'), val.TransactionDate);
            $('#tpNurseTime').val(new Date(val.TransactionDate).timeToInput());
            $('#txtNurseNotes').val(val.Value);
        });
    });
}

function saveNurseNotes() {
    fnProcessLoading(true, "saving");
    $("#btnSaveNurseNotes").attr('disabled', true);

    var l_NurseNotes = [];
    l_NurseNotes.push({
        CLType: "NN",
        CLControlID: "NN",
        ValueType: "text",
        Value: $('#txtNurseNotes').val()
    });

    var ns = {
        TransactionID: _intTransactionId,
        UHID: $('#hdUHID').val(),
        IPNumber: $('#hdIPNumber').val(),
        TransactionDate: getDate($('#dpNurseDate')),
        TransactionTime: $('#tpNurseTime').val(),
        l_CL_ControlValue: l_NurseNotes,
        ActiveStatus: true,
        UserID: 0
    };

    saveClinicalInformationData(ns, function (result) {
        fnProcessLoading(false);
        $("#btnSaveNurseNotes").attr('disabled', false);
        if (result) {
            $("#PopupNurseNotes").modal('hide');
            jQuery("#jqgNursingCarePlan").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
        }
    });
}


function gridDoctorNotes() {

    $("#jqgDoctorNotes").jqGrid({
        url: getBaseURL() + '/PatientClinicalInformation/GetClinicalInformationValueForPatient',
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        postData: {
            UHID: function () { return $('#hdUHID').val(); },
            IPNumber: function () { return $('#hdIPNumber').val(); },
            clType: "DN"
        },
        colNames: ["ID", "Date", "Doctor Notes", "Actions"],
        colModel: [
            { name: "TransactionID", hidden: true },
            {
                name: 'TransactionDate', index: 'TransactionDate', width: 90, resizable: false, sorttype: "date", formatter: "date",
                formatoptions: { srcformat: "ISO8601Long", newformat: _cnfjqgDateFormat + " h:i A" }
            },
            { name: "Value", width: 220, editable: true, align: 'left', resizable: true },
            {
                name: 'edit', search: false, align: 'left', width: 170, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editDoctorNotes(event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editDoctorNotes(event,\'view\')"><i class="far fa-eye"></i> </button>';
                }
            }
        ],
        pager: "#jqpDoctorNotes",
        rowNum: 10000,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        rownumWidth: '55',
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: false,
        forceFit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgDoctorNotes');
        }
    }).jqGrid('navGrid', '#jqpDoctorNotes', { add: false, edit: false, search: false, del: false, refresh: false });
        
    fnAddGridSerialNoHeading();
    fnRefreshGridWidth(); 
}

function addDoctorNotes() {
    setDate($('#dpDoctorDate'), new Date());
    $('#tpDoctorTime').val(new Date().timeToInput());
    $('#txtDoctorNotes').val("");
    $("#PopupDoctorNotes").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;
}

function editDoctorNotes(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDoctorNotes').jqGrid('getRowData', rowid);

    $("#PopupDoctorNotes").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpDoctorDate'), val.TransactionDate);
            $('#tpDoctorTime').val(new Date(val.TransactionDate).timeToInput());
            $('#txtDoctorNotes').val(val.Value);
        });
    });
}

function saveDoctorNotes() {
    fnProcessLoading(true, "saving");
    $("#btnSaveDoctorNotes").attr('disabled', true);

    var l_DoctorNotes = [];
    l_DoctorNotes.push({
        CLType: "DN",
        CLControlID: "DN",
        ValueType: "text",
        Value: $('#txtDoctorNotes').val()
    });

    var ns = {
        TransactionID: _intTransactionId,
        UHID: $('#hdUHID').val(),
        IPNumber: $('#hdIPNumber').val(),
        TransactionDate: getDate($('#dpDoctorDate')),
        TransactionTime: $('#tpDoctorTime').val(),
        l_CL_ControlValue: l_DoctorNotes,
        ActiveStatus: true,
        UserID: 0
    };

    saveClinicalInformationData(ns, function (result) {
        fnProcessLoading(false);
        $("#btnSaveDoctorNotes").attr('disabled', false);
        if (result) {
            $("#PopupDoctorNotes").modal('hide');
            jQuery("#jqgDoctorNotes").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
        }
    });
}


var Utils_ClinicalCharts = {

    gridClinicalCharts: function (type) {

        var cl_result;
        var gv_colNames = [];
        var gv_colModel = [];
        var gv_colId = [];
        var gv_data = [];

        var IO_I_cols = 0;
        var IO_O_cols = 0;

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

        if (type === "IO") {
            gv_colNames.push("Chart No");
            gv_colModel.push({
                name: "ChartNumber", width: 90
            });
            gv_colId.push("ChartNumber");
        }

        $.get(getBaseURL() + '/PatientClinicalInformation/GetClinicalInformationValueView',
            {
                UHID: $('#hdUHID').val(),
                IPNumber: $('#hdIPNumber').val(),
                clType: type
            }, function (data, status) {
                cl_result = data;
            }).then(function () {
                $.getJSON(getBaseURL() + "/json/eSyaNursingStation/patientclinicalinformation.json",
                    function (data) {

                        var i = 0;
                        var d = data.filter(element => element.cltype === type);
                        $.each(d, function (key, item_nav) {
                            $.each(item_nav.item, function (keys, item_control) {
                                if (item_control.valuetype !== "header") {

                                    gv_colNames.push(item_control.name);
                                    if (item_control.controlid === "IO-I-GT" || item_control.controlid === "IO-O-GT")
                                        gv_colModel.push({ name: item_control.controlid, width: 80, align: "right", sorttype: 'number', formatter: 'number', summaryType: 'sum' });
                                    else
                                        gv_colModel.push({ name: item_control.controlid, width: 80 });
                                    gv_colId.push(item_control.controlid);
                                }
                                else {
                                    if (item_control.category === "I")
                                        IO_I_cols = item_control.controlid;
                                    if (item_control.category === "O")
                                        IO_O_cols = item_control.controlid;
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
                                    $.each(data.l_CL_ControlValue, function (ky, cl) {
                                        if (cl.CLControlID === colId) {
                                            dataRow[colId] = cl.Value;
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
                                return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editClinicalCharts(\'' + type + '\',event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>' +
                                    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editClinicalCharts(\'' + type + '\',event,\'view\')"><i class="far fa-eye"></i> </button>';
                            }
                        });

                        if (type === "VT") {

                            $("#jqgVitalCharts").jqGrid('GridUnload');
                            $("#jqgVitalCharts").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                pager: "#jqpVitalCharts",
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
                                    fnJqgridSmallScreen('jqgVitalCharts');
                                }
                            }).jqGrid('navGrid', '#jqpVitalCharts', { add: false, edit: false, search: false, del: false, refresh: false });
                            fnRefreshGridWidth(); 
                            
                            populateVitalCharts(gv_data, gv_colId, gv_colNames);

                        }
                        else if (type === "IO") {
                            $("#jqgIntakeOutputCharts").jqGrid('GridUnload');
                            $("#jqgIntakeOutputCharts").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                rowNum: 1000,
                                pager: '#jqpIntakeOutputCharts',
                                sortname: 'TransactionDate',
                                viewrecords: true,
                                sortorder: "asc",
                                autowidth: true,
                                shrinkToFit: false,
                                forceFit: true,
                                height: 'auto',
                                grouping: true,
                                loadComplete: function () {
                                    fnJqgridSmallScreen('jqgIntakeOutputCharts');
                                },
                                groupingView: {
                                    groupField: ['ChartNumber'],
                                    groupSummary: [true],
                                    groupColumnShow: [false],
                                    groupText: ['<b>Chart No : {0} Total Intake: {IO-I-GT}  Total Outtake: {IO-O-GT} </b>'],
                                    groupCollapse: false,
                                    groupOrder: ['asc']
                                    //groupText: ['<b>{0} - {1} Item(s)</b>']
                                }
                            });
                            // $("#jqgIntakeOutputCharts").jqGrid('setFrozenColumns');
                            //$("#jqgIntakeOutputCharts").jqGrid('destroyFrozenColumns');
                            //$("#jqgIntakeOutputCharts").jqGrid('setColProp', 'TransactionDate', { frozen: true });
                            //$("#jqgIntakeOutputCharts").jqGrid('setFrozenColumns');
                            // $("#jqgIntakeOutputCharts").trigger('reloadGrid');

                            $("#jqgIntakeOutputCharts").jqGrid('setGroupHeaders', {
                                useColSpanStyle: true,
                                groupHeaders: [
                                    { startColumnName: 'IO-I-1', numberOfColumns: IO_I_cols, titleText: '<em>Intake</em>' },
                                    { startColumnName: 'IO-O-1', numberOfColumns: IO_O_cols, titleText: 'Output' }
                                ]
                            });
                        }
                        else if (type === "NC") {
                            $("#jqgVentilatorLabValuesCharts").jqGrid('GridUnload');
                            $("#jqgVentilatorLabValuesCharts").jqGrid({
                                data: gv_data,
                                datatype: "local",
                                colNames: gv_colNames,
                                colModel: gv_colModel,
                                rowNum: 1000,
                                pager: '#jqpVentilatorLabValuesCharts',
                                sortname: 'TransactionDate',
                                viewrecords: true,
                                sortorder: "asc",
                                autowidth: true,
                                shrinkToFit: false,
                                forceFit: true,
                                height: 'auto',
                                loadComplete: function () {
                                    fnJqgridSmallScreen('jqgVentilatorLabValuesCharts');
                                },
                            });
                        }
                    });
            });
    },

    populateClinicalTemplate: function (type) {
        var section_item = "";
        return new Promise(function (resolve) {
            $.getJSON(getBaseURL() + "/json/eSyaNursingStation/patientclinicalinformation.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);

                $.each(d, function (key, item_nav) {
                    section_item = "<div class='row border-bottom '>";
                    $.each(item_nav.item, function (keys, item_control) {
                        if (item_control.valuetype === "header") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><h5>" + item_control.name + "</h5><hr></div>";
                        }
                        if (item_control.valuetype === "float") {
                            if (type === "NC")
                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2'><div class= 'form-group'>";
                            else
                                section_item += "<div class='col-lg-4 col-md-4 col-sm-4'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";

                            var eventName = "";
                            var readonly = "";
                            if (item_control.readonly === "Y")
                                readonly = "readonly";

                            if (item_control.event === "Y")
                                eventName = "Utils_ClinicalCharts.onChange_ClinicalValue('" + item_control.formula + "')";

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
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-4'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<input id='" + item_control.controlid + "' class='form-control' type='text' />";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "textarea") {
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-12'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='3' cols='50'></textarea>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "checkbox") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><div class='row pb-2'>";
                            section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + item_control.name + "</label></div>";
                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2'><label class=''><input type='radio' id='" + item_control.controlid + "_y' class='mr-1' name=" + item_control.controlid + " value='Y'>Yes</label></div>";
                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2'><label class=''><input type='radio' id='" + item_control.controlid + "_n' class='mr-1' name=" + item_control.controlid + " value='N'>No</label></div>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "combox") {
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-12'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<select class='selectpicker form-control' id='" + item_control.controlid + "' data-container='body'>";
                            section_item += "<option value='0' selected>NA</option>";
                            $.each(item_control.values, function (keyv, item_values) {
                                section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                            });
                            section_item += "</select>";
                            section_item += "</div></div>";
                        }
                    });
                    section_item += "</div>";
                });
            }).done(function () {
                if (type === "VT")
                    $("#dvClinicalTemplate").html(section_item);
                if (type === "IO")
                    $("#dvIntakeOutputClinicalTemplate").html(section_item);
                if (type === "NC")
                    $("#dvVentilatorLabValuesClinicalTemplate").html(section_item);

                $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
                fnProcessLoading(false);
              
                $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
            });
            resolve();
        });
    },

    setClinicalTemplate: function (result) {

        $.each(result, function (keys, item) {

            if (item.ValueType === "float" || item.ValueType === "text" || item.ValueType === "textarea") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "combox") {
                $('#' + item.CLControlID).val(item.Value);
            }
            if (item.ValueType === "checkbox") {
                if (item.Value === "Y")
                    $('#' + item.CLControlID + '_y').prop('checked', true);
                if (item.Value === "N")
                    $('#' + item.CLControlID + '_n').prop('checked', true);
            }
            if (item.ValueType === "radio") {
                $('input:radio[name="' + item.CLControlID + '"][value=' + item.Value + ']').prop('checked', true).trigger("click");
            }
        });
    },

    getClinicalTemplate: function (type) {

        return new Promise(function (resolve) {
            var l_VitalCharts = [];

            $.getJSON(getBaseURL() + "/json/eSyaNursingStation/patientclinicalinformation.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);
                $.each(d, function (key, item_nav) {
                    $.each(item_nav.item, function (keys, item_control) {

                        if (item_control.valuetype === "float") {
                            l_VitalCharts.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "text") {
                            l_VitalCharts.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea") {
                            ns_result.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "checkbox") {
                            var rd_value = $("input[type='radio'][name='" + item_control.controlid + "']:checked").val();
                            ns_result.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: rd_value
                            });
                        }
                        if (item_control.valuetype === "combox") {
                            ns_result.push({
                                CLType: type,
                                CLControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                    });
                });
            });

            resolve(l_VitalCharts);
        });
    },
    onChange_ClinicalValue: function (ev) {
        var cn = ev.split("=");
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
    }

};

var COLOR = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

function populateVitalCharts(data, col_id, col_name) {

    var l_datasets = [];
    for (let i = 0; i < col_id.length; i++) {
        if (col_id[i].startsWith("VT")) {
            l_datasets.push({
                label: col_name[i],
                data: data,
                parsing: {
                    yAxisKey: col_id[i]
                },
                borderColor: COLOR[i]
            });
        }
    }

    var l_label = [];
    $.each(data, function (keys, item) {
        l_label.push(item.TransactionDate);
    });

    data = data.map(function (obj) {
        obj['x'] = obj['TransactionDate']; // Assign new key
        delete obj['TransactionDate']; // Delete old key
        return obj;
    });

    new Chart("myChart", {
        type: "line",
        data: {
            labels: l_label,
            datasets: l_datasets
        }

        //{
        //    labels: ['Jan', 'Feb'],
        //    datasets: [{
        //        label: 'Net sales',
        //        data: data,
        //        parsing: {
        //            yAxisKey: 'net'
        //        },
        //        borderColor: CHART_COLORS.red
        //    }, {
        //        label: 'Cost of goods sold',
        //        data: data,
        //        parsing: {
        //            yAxisKey: 'cogs'
        //        }
        //    }, {
        //        label: 'Gross margin',
        //        data: data,
        //        parsing: {
        //            yAxisKey: 'gm'
        //        }
        //    }]
        //}
    });
}


function editClinicalCharts(type, e, actiontype) {
    if (type === "VT")
        editVitalCharts(e, actiontype);
    else if (type === "IO")
        editIntakeOutputCharts(e, actiontype);
    else if (type === "NC")
        editVentilatorLabValuesCharts(e, actiontype);
}

function addVitalCharts() {
    setDate($('#dpVitalChartsDate'), new Date());
    $('#tpVitalChartsTime').val(new Date().timeToInput());

    $("#PopupVitalCharts").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("VT");
}

function editVitalCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVitalCharts').jqGrid('getRowData', rowid);

    $("#PopupVitalCharts").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpVitalChartsDate'), val.TransactionDate);
            $('#tpVitalChartsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("VT")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}

function saveVitalCharts() {
    fnProcessLoading(true, "saving");
    $("#btnSaveVitalCharts").attr('disabled', true);

    var l_VitalCharts = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("VT")).then(function (l_VitalCharts) {
        var ns = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            TransactionDate: getDate($('#dpVitalChartsDate')),
            TransactionTime: $('#tpVitalChartsTime').val(),
            l_CL_ControlValue: l_VitalCharts,
            ActiveStatus: true,
            UserID: 0
        };

        saveClinicalInformationData(ns, function (result) {
            fnProcessLoading(false);
            $("#btnSaveVitalCharts").attr('disabled', false);
            if (result) {
                $("#PopupVitalCharts").modal('hide');
                //  jQuery("#jqgVitalCharts").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                Utils_ClinicalCharts.gridClinicalCharts("VT");
            }
        });

    });



    //$.getJSON(getBaseURL() + "/json/eSyaNursingStation/patientclinicalinformation.json", function (data) {
    //    var i = 0;
    //    var d = data.filter(element => element.cltype === "VT");
    //    $.each(d, function (key, item_nav) {
    //        $.each(item_nav.item, function (keys, item_control) {

    //            if (item_control.valuetype === "float") {
    //                l_VitalCharts.push({
    //                    CLType: "VT",
    //                    CLControlID: item_control.controlid,
    //                    ValueType: item_control.valuetype,
    //                    Value: $('#' + item_control.controlid).val()
    //                });
    //            }
    //            if (item_control.valuetype === "text") {
    //                l_VitalCharts.push({
    //                    CLType: "VT",
    //                    CLControlID: item_control.controlid,
    //                    ValueType: item_control.valuetype,
    //                    Value: $('#' + item_control.controlid).val()
    //                });
    //            }
    //            if (item_control.valuetype === "textarea") {
    //                ns_result.push({
    //                    CLType: "VT",
    //                    CLControlID: item_control.controlid,
    //                    ValueType: item_control.valuetype,
    //                    Value: $('#' + item_control.controlid).val()
    //                });
    //            }
    //            if (item_control.valuetype === "checkbox") {
    //                var rd_value = $("input[type='radio'][name='" + item_control.controlid + "']:checked").val();
    //                ns_result.push({
    //                    CLType: "VT",
    //                    CLControlID: item_control.controlid,
    //                    ValueType: item_control.valuetype,
    //                    Value: rd_value
    //                });
    //            }
    //            if (item_control.valuetype === "combox") {
    //                ns_result.push({
    //                    CLType: "VT",
    //                    CLControlID: item_control.controlid,
    //                    ValueType: item_control.valuetype,
    //                    Value: $('#' + item_control.controlid).val()
    //                });
    //            }
    //        });
    //    });
    //}).done(function () {

    //    var ns = {
    //        TransactionID: _intTransactionId,
    //        UHID: $('#hdUHID').val(),
    //        IPNumber: $('#hdIPNumber').val(),
    //        TransactionDate: getDate($('#dpVitalChartsDate')),
    //        TransactionTime: $('#tpVitalChartsTime').val(),
    //        l_CL_ControlValue: l_VitalCharts,
    //        ActiveStatus: true,
    //        UserID: 0
    //    };

    //    saveClinicalInformationData(ns, function (result) {
    //        fnProcessLoading(false);
    //        $("#btnSaveVitalCharts").attr('disabled', false);
    //        if (result) {
    //            $("#PopupVitalCharts").modal('hide');
    //            jQuery("#jqgVitalCharts").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
    //        }
    //    });

    //});
}


function addIntakeOutputCharts() {
    setDate($('#dpIntakeOutputChartsDate'), new Date());
    $('#tpIntakeOutputChartsTime').val(new Date().timeToInput());
   
    $("#PopupIntakeOutputCharts").modal('show');
    
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("IO");
}

function editIntakeOutputCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgIntakeOutputCharts').jqGrid('getRowData', rowid);
    
    $("#PopupIntakeOutputCharts").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpIntakeOutputChartsDate'), val.TransactionDate);
            $('#tpIntakeOutputChartsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("IO")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}

function saveIntakeOutputCharts() {
    fnProcessLoading(true, "saving");
    $("#btnSaveIntakeOutputCharts").attr('disabled', true);

    var l_IntakeOutputCharts = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("IO")).then(function (l_IntakeOutputCharts) {
        var ns = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            TransactionDate: getDate($('#dpIntakeOutputChartsDate')),
            TransactionTime: $('#tpIntakeOutputChartsTime').val(),
            l_CL_ControlValue: l_IntakeOutputCharts,
            ActiveStatus: true,
            UserID: 0
        };

        saveClinicalInformationData(ns, function (result) {
            fnProcessLoading(false);
            $("#btnSaveIntakeOutputCharts").attr('disabled', false);
            if (result) {
                $("#PopupIntakeOutputCharts").modal('hide');
                Utils_ClinicalCharts.gridClinicalCharts("IO");
            }
        });

    });
}


function addVentilatorLabValuesCharts() {
    setDate($('#dpVentilatorLabValuesChartsDate'), new Date());
    $('#tpVentilatorLabValuesChartsTime').val(new Date().timeToInput());

    $("#PopupVentilatorLabValuesCharts").modal('show');
    _isUpdate = false;
    _intTransactionId = 0;

    Utils_ClinicalCharts.populateClinicalTemplate("NC");
}

function editVentilatorLabValuesCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVentilatorLabValuesCharts').jqGrid('getRowData', rowid);

    $("#PopupVentilatorLabValuesCharts").modal('show');
    _isUpdate = true;
    _intTransactionId = rowData.TransactionID;

    getClinicalInformationByID(rowData.TransactionID, function (data) {
        $.each(data, function (key, val) {
            setDate($('#dpVentilatorLabValuesChartsDate'), val.TransactionDate);
            $('#tpVentilatorLabValueslChartsTime').val(new Date(val.TransactionDate).timeToInput());
        });

        $.when(Utils_ClinicalCharts.populateClinicalTemplate("NC")).then(function () {
            Utils_ClinicalCharts.setClinicalTemplate(data);
        });

    });
}

function saveVentilatorLabValuesCharts() {
    fnProcessLoading(true, "saving");
    $("#btnSaveVentilatorLabValuesCharts").attr('disabled', true);

    var l_VentilatorLabValuesCharts = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate("NC")).then(function (l_VentilatorLabValuesCharts) {
        var ns = {
            TransactionID: _intTransactionId,
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            TransactionDate: getDate($('#dpVentilatorLabValuesChartsDate')),
            TransactionTime: $('#tpVentilatorLabValuesChartsTime').val(),
            l_CL_ControlValue: l_VentilatorLabValuesCharts,
            ActiveStatus: true,
            UserID: 0
        };

        saveClinicalInformationData(ns, function (result) {
            fnProcessLoading(false);
            $("#btnSaveVentilatorLabValuesCharts").attr('disabled', false);
            if (result) {
                $("#PopupVentilatorLabValuesCharts").modal('hide');
                Utils_ClinicalCharts.gridClinicalCharts("NC");
            }
        });

    });

}


function getClinicalInformationByID(transactionID, callback) {
    $.get(getBaseURL() + '/PatientClinicalInformation/GetClinicalInformationValueByTransaction',
        {
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            transactionID: transactionID
        }, function (data, status) {
            callback(data);
        });
}

function saveClinicalInformationData(l_data, callback) {

    var url = getBaseURL() + '/PatientClinicalInformation/InsertIntoPatientClinicalInformation';

    if (_isUpdate === true)
        url = getBaseURL() + '/PatientClinicalInformation/UpdatePatientClinicalInformation';

    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: l_data,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved!");
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


function gridDrugCharts() {
  
    $("#jqgDrugCharts").jqGrid({
        url: getBaseURL() + '/PatientClinicalInformation/GetPatientMedicationDrug',
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        postData: {
            UHID: function () { return $('#hdUHID').val(); },
            IPNumber: function () { return $('#hdIPNumber').val(); }
        },
        colNames: ["DrugCode", "Drug Name", "Dosages", "Frequency", "Route", "Med. Start Date", "End Date", "Last Med.Date", "Actions"],
        colModel: [
            { name: "DrugCode", width: 60, align: 'left', resizable: true },
            { name: "DrugName", width: 150, align: 'left', resizable: true },
            { name: "Dosages", width: 80, align: 'left', resizable: true },
            { name: "Frequency", width: 80, align: 'left', resizable: true },
            { name: "Route", width: 80, align: 'left', resizable: true },
            {
                name: 'MedicationStartDate', index: 'MedicationStartDate', width: 90, resizable: false, sorttype: "date", formatter: "date",
                formatoptions: { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'MedicationEndDate', index: 'MedicationEndDate', width: 90, resizable: false, sorttype: "date", formatter: "date",
                formatoptions: { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'LastMedicationDate', index: 'LastMedicationDate', width: 90, resizable: false, sorttype: "date", formatter: "date",
                formatoptions: { srcformat: "ISO8601Long", newformat: _cnfjqgDateFormat + " h:i A" }
            },
            {
                name: 'edit', search: false, align: 'left', width: 130, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return editDrugCharts(event,\'edit\')"><i class="fas fa-pencil-alt"></i> </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return editDrugCharts(event,\'view\')"><i class="far fa-eye"></i> </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return popupDrugMedication(event)"><i class="fa fa-history"></i></button>';
                }
            }
        ],
        pager: "#jqpDrugCharts",
        rowNum: 10000,
        loadonce: true,
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
            fnJqgridSmallScreen('jqgDrugCharts');
        },
    }).jqGrid('navGrid', '#jqpDrugCharts', { add: false, edit: false, search: false, del: false, refresh: false });
        
    fnAddGridSerialNoHeading();
    fnRefreshGridWidth(); 
   
}

var _drugCode = 0;
var _drugName = "";

function addDrugCharts() {
   // $('#cboDrug').val("0").selectpicker('refresh');
    $('#txtDrugName').val("");
    $('#txtDosages').val("");
    $('#txtFrequency').val("");
    $('#txtRoute').val("");
    setDate($('#dpMedicationStartDate'), new Date());
    document.querySelector('#chkMedicationEndDateDisable').checked = false;
    $("#dpMedicationEndDate").attr("disabled", false);
    $('#dpMedicationEndDate').val("");
    $("#PopupDrugCharts").modal('show');
    _isUpdate = false;
    _drugCode = 0;
    _drugName = "";
}

function editDrugCharts(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDrugCharts').jqGrid('getRowData', rowid);

    $("#PopupDrugCharts").modal('show');
    _isUpdate = true;
    _drugCode = rowData.DrugCode;

    $.get(getBaseURL() + '/PatientClinicalInformation/GetPatientMedicationDetailByDrugCode',
        {
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            drugCode: _drugCode
        }, function (data, status) {
            _drugName = data.DrugName;
            //$('#cboDrug').val(data.DrugCode).selectpicker('refresh');
            $('#txtDrugName').val(data.DrugName);
            $('#txtDosages').val(data.Dosages);
            $('#txtFrequency').val(data.Frequency);
            $('#txtRoute').val(data.Route);
            setDate($('#dpMedicationStartDate'), data.MedicationStartDate);
            if (data.MedicationEndDate !== null)
                document.querySelector('#chkMedicationEndDateDisable').checked = true;
            else
                document.querySelector('#chkMedicationEndDateDisable').checked = false;
            setDate($('#dpMedicationEndDate'), data.MedicationEndDate);
        });

}

function saveDrugCharts() {
    fnProcessLoading(true, "saving");
    $("#btnSaveDrugCharts").attr('disabled', true);

    var dg = {
        UHID: $('#hdUHID').val(),
        IPNumber: $('#hdIPNumber').val(),
        DrugCode: _drugCode,
        DrugName: _drugName,
        Dosages: $('#txtDosages').val(),
        Frequency: $('#txtFrequency').val(),
        Route: $('#txtRoute').val(),
        MedicationStartDate: getDate($('#dpMedicationStartDate')),
        MedicationEndDate: getDate($('#dpMedicationEndDate')),
        ActiveStatus: true,
        UserID: 0
    };

    $.ajax({
        url: getBaseURL() + '/PatientClinicalInformation/InsertIntoPatientMedicationDrug',
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: dg,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved!");
                $("#PopupDrugCharts").modal('hide');
                jQuery("#jqgDrugCharts").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
            }
            else {
                toastr.error(response.Message);
            }
            fnProcessLoading(false, "saving");
            $("#btnSaveDrugCharts").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            fnProcessLoading(false, "saving");
            $("#btnSaveDrugCharts").attr('disabled', false);
        }
    });

}

function popupDrugMedication(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDrugCharts').jqGrid('getRowData', rowid);
    _drugCode = rowData.DrugCode;
    $("#txtMedicationDrugName").val(rowData.DrugName);
    $("#PopupDrugMedicationGiven").modal('show');
    setTimeout(function () { gridDrugMedication(); }, 1000);
}

function gridDrugMedication() {
    $("#jqgDrugMedication").jqGrid('GridUnload');
    $("#jqgDrugMedication").jqGrid({
        url: getBaseURL() + '/PatientClinicalInformation/GetPatientMedicationDrugGivenTiming',
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        postData: {
            UHID: function () { return $('#hdUHID').val(); },
            IPNumber: function () { return $('#hdIPNumber').val(); },
            drugCode: function () { return _drugCode; }
        },
        colNames: ["Medication Given On"],
        colModel: [
            {
                name: 'MedicationGivenOn', index: 'MedicationGivenOn', width: 90, resizable: false, sorttype: "date", formatter: "date",
                formatoptions: { srcformat: "ISO8601Long", newformat: _cnfjqgDateFormat + " h:i A" }
            }
        ],
        pager: "#jqpDrugMedication",
        rowNum: 10000,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        rownumWidth:'55',
        height: 'auto',
        width: '100%',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgDrugMedication');
        },
    }).jqGrid('navGrid', '#jqpDrugMedication', { add: false, edit: false, search: false, del: false, refresh: false })
       
    fnAddGridSerialNoHeading();
    fnRefreshGridWidth(); 

}

function disableMedicationEndDate() {
    $("#dpMedicationEndDate").attr("disabled", !$("#chkMedicationEndDateDisable").is(":checked"));
    if (!$("#chkMedicationEndDateDisable").is(":checked"))
        $("#dpMedicationEndDate").val("");
}

function saveDrugMedication() {
    fnProcessLoading(true, "saving");
    $("#btnSaveDrugMedication").attr('disabled', true);

    var dg = {
        UHID: $('#hdUHID').val(),
        IPNumber: $('#hdIPNumber').val(),
        DrugCode: _drugCode,
        MedicationGivenOn: getDate($('#dpMedicationGivenDate')),
        MedicationTime: $('#tpMedicationGivenTime').val(),
        ActiveStatus: true,
        UserID: 0
    };

    $.ajax({
        url: getBaseURL() + '/PatientClinicalInformation/InsertIntoPatientMedicationGiven',
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: dg,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved!");
                $("#PopupDrugMedicationGiven").modal('hide');
                jQuery("#jqgDrugMedication").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
            }
            else {
                toastr.error(response.Message);
            }
            fnProcessLoading(false);
            $("#btnSaveDrugMedication").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            fnProcessLoading(false);
            $("#btnSaveDrugMedication").attr('disabled', false);
        }
    });

}
  
$(document).ready(function () {
   
    setTimeout(function () { fnsideBarSetup() }, 1000);
});


function fnRefreshGridWidth() {
    var gridW = $(window).width() - $('.sidebar').width() - 30;
    $("#jqgDrugCharts, #jqgVitalCharts, #jqgDoctorNotes, #jqgNursingCarePlan").jqGrid('setGridWidth', parseInt(gridW)).trigger('reloadGrid');
    $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
}
function fnRefreshGridFullWidth() {
    var gridW = $(window).width();
    $("#jqgDrugCharts, #jqgVitalCharts, #jqgDoctorNotes, #jqgNursingCarePlan").jqGrid('setGridWidth', parseInt(gridW)).trigger('reloadGrid');
    $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
}
$('.main-heading').click(function () {

    if ($('.sidebar').hasClass('hide')) {
        var sidebarW = $('.sidebar').width();
        $('.sidebar').toggleClass('hide');
        $('#mainContent').removeClass('moveLeft');
        $('#myChart').css('width', '100%');
    }
    else {

        $('.sidebar').addClass('hide');
        $('#mainContent').css('width', '100%').addClass('moveLeft');
        $('#myChart').css('width', '100%');
    }
});

$(window).on('resize', function () {
    fnsideBarSetup();
});
function fnsideBarSetup() {
    var docWidth = $(document).width();
    var marginLeft = $("#navbar-patientClinicalInfo").outerWidth(true);
    var winH = $(window).outerHeight(true);
    var divHeight = Math.floor($(".divFixedBar").outerHeight(true) + $("section.header").outerHeight(true) + $("div.header").outerHeight(true)) - 1;
    var maxH = ($(window).outerHeight(true) - ($("section.header").outerHeight(true) + $(".banner").outerHeight(true) + $(".divFixedBar").outerHeight(true)))
    const headerH = $('section.header').outerHeight(true);
    const headerBannerH = headerH + $('.banner').outerHeight(true);
    const headerBannerFixedBarH = headerBannerH + $('.divFixedBar').outerHeight(true);
    const tabContentH = headerBannerFixedBarH + $('.main-heading').height();
    
        $("#mainContent").css({
            "top": divHeight,
            'max-height': winH - tabContentH - 24,
            'margin-left': marginLeft,
            'overflow-y': 'auto',
            'width': '100%'
        });
        
        $(".sidebar").css({
            'top': divHeight, 'display': 'block',
            'overflow-y': 'auto',
            'max-height': maxH
        });
        $("#navbar-patientClinicalInfo").on('click', 'a', function () {
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            $('.tab-pane').removeClass('show active');
            var v = $(this).attr('data-bs-target');
            $(v).addClass('show active');
           
         });
    fnRefreshGridWidth();
}