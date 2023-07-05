var resulttype = '';
var businesskey = '';
var serviceId = '';
var l_testmethod = '';
var l_labservices = '';
var l_units = '';


$(document).ready(function () {
    fnLoadCboUnit();
    fnLoadCboTestMethod();
    tinymce.init({
        selector: 'textarea#txtDescriptive',
        height: 200,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    });
});

//============================ Main Screen ===================================

function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '' && $('#cboServiceClass').val() != '') {
        fnLoadServiceTemplateCreator();
        fnLoadCboLabServices();
    }
}
function fnLoadServiceTemplateCreator() {
    $("#jqgServiceTemplateCreator").jqGrid('GridUnload');
    $("#jqgServiceTemplateCreator").jqGrid({
        url: getBaseURL() + '/ServiceTemplateCreator/GetServiceTemplateByBKeyServiceClass?businessKey=' + $('#cboBusinessKey').val() + '&serviceClass=' + $('#cboServiceClass').val() ,
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID", localization.ServiceShortName, localization.ServiceDescription, localization.ResultType,localization.ResultType, localization.SampleType, localization.PrintSequence, localization.ReportingTime,"",""],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', key: true, hidden: true },  
            { name: "ServiceShortDesc", width: 40, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 80, editable: false, align: 'left' },
            { name: "ResultType", editable: false, width: 30, align: 'left', hidden: true },
            { name: "ResultTypeDesc", editable: false, width: 30, align: 'left' },
            { name: "SampleTypeDesc", editable: false, width: 30, align: 'left' },
            { name: "LabPrintSequence", width: 30, editable: true, align: 'left', edittype: 'text' },
            { name: "TimeRequiredForReport", width: 30, editable: true, align: 'left', edittype: 'text' },
            {
                name: "Button", width: 80, editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                    return "<button type='button'  class='btn btn-primary' onclick=fnCreateTemplateMaster('" + rowObject.IsResultCreated + "','" + rowObject.ServiceId + "')><i class='fas fa-pen c-white'></i> Edit </button> "+
                        " <button type = 'button'  class='btn btn-primary' onclick=fnCreateTemplate('" + rowObject.IsResultCreated + "','" + rowObject.ServiceId +"')> <i class='fas fa-external-link-alt c-white'></i> Template Creator </button>";
                }
            },
            { name: "IsResultCreated", editable: false, width: 30, align: 'left', hidden: true },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth: 55,
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceTemplateCreator",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceTemplateCreator").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
           
        }
    }).jqGrid('navGrid', '#jqpServiceTemplateCreator', { add: false, edit: false, search: false, del: false, refresh: false });   
    
}
function fnLoadCboUnit() {
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetAppCodeByCodeType?codetype=152',
        success: function (result) {
            $("#cboShortUnit").empty();
            $('#cboShortUnit').selectpicker('refresh');
            $("#cboShortUnit").append('<option value="0">' + localization.Select + '</option>');
            $('#cboShortUnit').selectpicker('refresh');
            $("#cboAnalysisUnit").empty();
            $('#cboAnalysisUnit').selectpicker('refresh');
            $("#cboAnalysisUnit").append('<option value="0">' + localization.Select + '</option>');
            $('#cboAnalysisUnit').selectpicker('refresh');
            for (var i = 0; i < result.length; i++) {
                $("#cboShortUnit").append('<option value="' + result[i].Value + '"> ' + result[i].Text + ' </option>');
                $('#cboShortUnit').selectpicker('refresh');
                $("#cboAnalysisUnit").append('<option value="' + result[i].Value + '"> ' + result[i].Text + ' </option>');
                $('#cboAnalysisUnit').selectpicker('refresh');
                l_units += result[i].Value + ":" + result[i].Text + ";";
            }
        }
    });
}
function fnLoadCboTestMethod() {
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetAppCodeByCodeType?codetype=153',
        success: function (result) {
            
            $("#cboTestMethod").empty();
            $('#cboTestMethod').selectpicker('refresh');
            $("#cboTestMethod").append('<option value="0">' + localization.Select + '</option>');
            $('#cboTestMethod').selectpicker('refresh');
            $("#cboAnalysisTestMethod").empty();
            $('#cboAnalysisTestMethod').selectpicker('refresh');
            $("#cboAnalysisTestMethod").append('<option value="0">' + localization.Select + '</option>');
            $('#cboAnalysisTestMethod').selectpicker('refresh');
            for (var i = 0; i < result.length; i++) {
                $("#cboTestMethod").append('<option value="' + result[i].Value + '"> ' + result[i].Text + ' </option>');
                $('#cboTestMethod').selectpicker('refresh');
                $("#cboAnalysisTestMethod").append('<option value="' + result[i].Value + '"> ' + result[i].Text + ' </option>');
                $('#cboAnalysisTestMethod').selectpicker('refresh');
                l_testmethod += result[i].Value + ":" + result[i].Text + ";";
            }
        }
    });
}
function fnLoadCboLabServices() {
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetLabServicesByBKey?businessKey=' + $('#cboBusinessKey').val(),
        success: function (result) {

            $("#cboLabServices").empty();
            $('#cboLabServices').selectpicker('refresh');
            $("#cboLabServices").append('<option value="0">' + localization.Select + '</option>');
            $('#cboLabServices').selectpicker('refresh');
            for (var i = 0; i < result.length; i++) {
                $("#cboLabServices").append('<option value="' + result[i].Value + '"> ' + result[i].Text + ' </option>');
                $('#cboLabServices').selectpicker('refresh');
                l_labservices += result[i].Value + ":" + result[i].Text + ";";
            }
        }
    });
}
//============================================================================


//============================ Template Master ===============================
function fnClearFields() {
    $("#txtServiceID").val('');
    $("#txtServiceDesc").val('');
    $("#cboPopResultType").val('0');
    $('#cboPopResultType').selectpicker('refresh');
    $("#cboPopSampleType").val('0');
    $('#cboPopSampleType').selectpicker('refresh');
    $("#txtPrintSequence").val('0');
    $("#txtReportingTime").val('0');
    $('#chkActiveStatus').parent().addClass("is-checked");
}
function fnCreateTemplateMaster(resultcreated, serviceid) {
    fnClearFields();
    $("#txtServiceID").val(serviceid);
    
    if (resultcreated === 'true') {
        fnLoadServiceServiceTemplateMaster(serviceid);
    }
    else {
        var servicedesc = jQuery('#jqgServiceTemplateCreator').jqGrid('getCell', serviceid, 'ServiceDesc');
        $("#txtServiceDesc").val(servicedesc);      
        $('#PopupServiceTemplateMaster').modal('show');
    }
}
function fnLoadServiceServiceTemplateMaster(serviceid) {
    businesskey = $("#cboBusinessKey").val();
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetServiceTemplateByBKeyServiceID',
        data: {
            businessKey: businesskey,
            serviceID: serviceid
        },
        success: function (result) {
            $("#cboPopResultType").val(result.ResultType);
            $('#cboPopResultType').selectpicker('refresh');
            $("#cboPopSampleType").val(result.SampleType);
            $('#cboPopSampleType').selectpicker('refresh');
            $("#txtPrintSequence").val(result.LabPrintSequence);
            $("#txtReportingTime").val(result.TimeRequiredForReport);
            $("#txtServiceDesc").val(result.ServiceDesc);          
            //if (result.ActiveStatus == true) {
            //    $('#chkActiveStatus').parent().addClass("is-checked");
            //}
            //else {
            //    $('#chkActiveStatus').parent().removeClass("is-checked");
            //};
            $('#PopupServiceTemplateMaster').modal('show');
        }
    });
}
function fnAddOrUpdateServiceTemplateMaster() {
   
    var cboResultType = $("#cboPopResultType").val();
    if (cboResultType == "0" || cboResultType == undefined) {
        toastr.error("Please Select Result Type");
        return false;
    }
    var cboSampleType = $("#cboPopSampleType").val();
    if (cboSampleType == "0" || cboSampleType == undefined) {
        toastr.error("Please Select Sample Type");
        return false;
    }
    var txtPrintSequence = $("#txtPrintSequence").val();
    if (txtPrintSequence == "" ||txtPrintSequence == "0" || txtPrintSequence == undefined) {
        toastr.error("Please enter Print Sequence");
        return false;
    }
    var txtReportingTime = $("#txtReportingTime").val();
    if (txtReportingTime == "" || txtReportingTime == "0" || txtReportingTime == undefined) {
        toastr.error("Please enter Reporting Time");
        return false;
    }
    businesskey = $("#cboBusinessKey").val();
    var txtServiceID = $("#txtServiceID").val();

    $("#btnPopSave").attr("disabled", true);
        var obj = {
            BusinessKey: businesskey,
            ServiceId: txtServiceID,
            ResultType: cboResultType,
            SampleType: cboSampleType,
            TimeRequiredForReport: txtReportingTime,
            LabPrintSequence: txtPrintSequence,
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),

        }
        $.ajax({
            url: getBaseURL() + '/ServiceTemplateCreator/AddOrUpdateServiceTemplateMaster',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {

                        toastr.success("Service Template Master Updated");

                    $('#PopupServiceTemplateMaster').modal('hide');
                    $("#jqgServiceTemplateCreator").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnPopSave").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnPopSave").attr("disabled", false);
            }
        });
    }
//============================================================================


//============================ Template Creator ===============================
function fnCreateTemplate(resultcreated, serviceid) {
    if (resultcreated === 'true') {
        $("#divServiceTemplate").hide();
        $("#divShortResult,#divLongResult,#divAnalysisResult,#divDescriptiveResult").css('display', 'none');
        var rowData = jQuery('#jqgServiceTemplateCreator').jqGrid('getRowData', serviceid);
        
        $("#txtServiceNameDetail").val(rowData["ServiceDesc"]); 
        $("#txtResultTypeDetail").val(rowData["ResultTypeDesc"]);
        $("#txtSampleTypeDetail").val(rowData["SampleTypeDesc"]);

        $("#txtInterpretation").val('');
        $("#txtImpression").val('');
        $("#txtNotes").val('');

        serviceId = serviceid;
        businesskey = $("#cboBusinessKey").val();
        resulttype = rowData["ResultType"];

        if (resulttype === 'S') {
            $("#divShortResult").css('display', 'block');
            fnLoadShortResult(serviceId, businesskey, resulttype);
        }
        else if (resulttype === 'L') {
            $("#divLongResult").css('display', 'block');
            fnLoadLongResult(serviceId, businesskey, resulttype);
        }
        else if (resulttype === 'A') {
            $("#divAnalysisResult").css('display', 'block');
            fnLoadAnalysisResult(serviceId, businesskey, resulttype);
        }
        else if (resulttype === 'D') {
            $("#divDescriptiveResult").css('display', 'block');
            fnLoadDescriptiveResult(serviceId, businesskey, resulttype,'P');
        }
        
        $("#divServiceFields,#divInputFields").css('display', 'block');
    }
    else {
        toastr.error("Please create Service Template Master first");
        return false;
    }
    
}
function fnCancelTemplateCreator() {
    $("#divServiceTemplate").show();   
    $("#divShortResult,#divLongResult,#divAnalysisResult,#divDescriptiveResult").css('display', 'none');
    $("#divServiceFields,#divInputFields").css('display', 'none');
}
//============================================================================


//============================ Short Template Creator =========================
function fnLoadShortResult(serviceid, businesskey, resulttype) {
    $("#cboShortUnit").val('0');
    $('#cboShortUnit').selectpicker('refresh');
    $("#chkResultComputed").parent().removeClass("is-checked");
    $("#chkResultNumeric").parent().removeClass("is-checked");
    $("#txtShortFormula").val('');
    $("#txtShortFormula").prop("disabled", true);



    //Prepare short values grid
    $("#jqgShortResult").jqGrid('GridUnload');
    $("#jqgShortResult").jqGrid({
       // url: getBaseURL() + '/ServiceTemplateCreator/GetServiceShortValuesByBKeyServiceID?businessKey=' + businesskey + '&serviceID=' + serviceid,
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Serial Number","Test Parameter", "Gender", "Start Age", "Start Age Type", "End Age", "End Age Type", "Min Value", "Max Value", "Normal Value", "Hypo", "Hyper"],

        colModel: [
            { name: "SerialNumber", width: 10, editable: false, align: 'left', hidden: true },

            { name: "TestParameter", width: 10, editable: false, align: 'left', hidden: true },
            { name: "Sex", width: 50, editable: true, align: 'left', edittype: "select", formatter: 'select', editoptions: { value: "M:Male;F:Female;T:TransGender;A:All" } },
            { name: "StartAge", width: 80, editable: true, align: 'left' },
            { name: "StartAgeType", editable: true, width: 60, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "Y:Year;M:Month;W:Week;D:Day" } },
            { name: "EndAge", width: 80, editable: true, align: 'left' },
            { name: "EndAgeType", editable: true, width: 60, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "Y:Year;M:Month;W:Week;D:Day" } },
            { name: "MinValue", width: 80, editable: true, align: 'left' },
            { name: "MaxValue", width: 80, editable: true, align: 'left' },
            { name: "NormalValues", width: 80, editable: true, align: 'left' },
            { name: "HypoValue", width: 80, editable: true, align: 'left' },
            { name: "HyperValue", width: 80, editable: true, align: 'left' },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth: 55,
        emptyrecords: "No records to Veiw",
        pager: "#jqpShortResult",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        cellsubmit: 'clientArray',
    
    }).jqGrid('navGrid', '#jqpShortResult', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpShortResult', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddShortValue
        });

    // Prepare test method grid
    $("#jqgTestMethod").jqGrid('GridUnload');
    $("#jqgTestMethod").jqGrid({
        //url: getBaseURL() + '',
        datatype: 'json',
        //mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Test Method", "Active Status"],

        colModel: [
            { name: "TestMethod", width: 70, editable: false, align: 'left', edittype: "select", formatter: 'select', editoptions: { value: l_testmethod } },
            { name: "ActiveStatus", width: 30, editable: true, align: 'left', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },           
        ],
        rowNum: 100000,
        rownumWidth: 55,
        pgtext: null,
        pgbuttons: null,
        emptyrecords: "No records to Veiw",
        pager: "#jqpTestMethod",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        cellsubmit: 'clientArray',

    }).jqGrid('navGrid', '#jqpTestMethod', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpTestMethod', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTestMethod
        });
    //Calling full profile
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetFullServiceResultTemplate',
        data: {
            businessKey: businesskey,
            serviceID: serviceid,
            resultType: resulttype
        },
        success: function (result) {
            //Fill common values
            if (result.CommonValues != null) {
                $("#txtInterpretation").val(result.CommonValues.Interpretation);
                $("#txtImpression").val(result.CommonValues.Impression);
                $("#txtNotes").val(result.CommonValues.Note);
            }
            //Fill Short Header
            if (result.ShortHeader != null) {
                $("#cboShortUnit").val(result.ShortHeader.Unit);
                $('#cboShortUnit').selectpicker('refresh');
                if (result.ShortHeader.IsNumericResultValue == true) {
                    $('#chkResultNumeric').parent().addClass("is-checked");
                }
                else {
                    $('#chkResultNumeric').parent().removeClass("is-checked");
                };
                if (result.ShortHeader.ResultComputed == true) {
                    $('#chkResultComputed').parent().addClass("is-checked");
                    $("#txtShortFormula").prop("disabled", false);
                }
                else {
                    $('#chkResultComputed').parent().removeClass("is-checked");
                    $("#txtShortFormula").prop("disabled", true);
                };
                $("#txtShortFormula").val(result.ShortHeader.ResultFormula);
            }
            
            //Fill Short Values
            $("#jqgShortResult")[0].addJSONData(result.l_ShortValues);
            //Fill Test Methods
            $("#jqgTestMethod")[0].addJSONData(result.l_TestMethod);



        }
    });
}
function fnResultcomputed() {
    var iscomputed = $("#chkResultComputed").parent().hasClass("is-checked");
    $("#txtShortFormula").val('');
    if (iscomputed) {
        $("#txtShortFormula").prop("disabled", true);
    }
    else {
        $("#txtShortFormula").prop("disabled", false);
    }
}
function fnAddShortValue() {
    $("#jqgShortResult").jqGrid('editCell', 0, 0, false);
    fnClearShortFields();
    $('#PopupShortValues').modal('show');

}
function fnClearShortFields() {
    $("#cboPopShortGender").val('0');
    $('#cboPopShortGender').selectpicker('refresh');
    $("#txtShortStartAge").val('');
    $("#cboShortStartAgeType").val('0');
    $('#cboShortStartAgeType').selectpicker('refresh');
    $("#txtShortEndAge").val('');
    $("#cboShortEndAgeType").val('0');
    $('#cboShortEndAgeType').selectpicker('refresh');
    $("#txtShortMinValue").val('');
    $("#txtShortMaxValue").val('');
    $("#txtShortNormalValue").val('');
    $("#txtShortHypoValue").val('');
    $("#txtShortHyperValue").val('');
    $('#chkShortActiveStatus').parent().addClass("is-checked");
}
function fnAddGridShortValue() {
    var cboGender = $("#cboPopShortGender").val();
    if (cboGender == "0" || cboGender == undefined) {
        toastr.error("Please Select Gender");
        return false;
    }
    var txtStartAge = $("#txtShortStartAge").val();
    if (txtStartAge == "0" ||txtStartAge == "" || txtStartAge == undefined) {
        toastr.error("Please Enter Start Age");
        return false;
    }
    var cboStartAgeType = $("#cboShortStartAgeType").val();
    if (cboStartAgeType == "0" || cboStartAgeType == undefined) {
        toastr.error("Please Select Start Age Type");
        return false;
    }
    var txtEndAge = $("#txtShortEndAge").val();
    if (txtEndAge == "0" || txtEndAge == "" || txtEndAge == undefined) {
        toastr.error("Please Enter End Age");
        return false;
    }
    var cboEndAgeType = $("#cboShortEndAgeType").val();
    if (cboEndAgeType == "0" || cboEndAgeType == undefined) {
        toastr.error("Please Select End Age Type");
        return false;
    }
    var txtMinValue = $("#txtShortMinValue").val();
    if (txtMinValue == "" || txtReportingTime == undefined) {
        toastr.error("Please Enter Min Value");
        return false;
    }
    var txtMaxValue = $("#txtShortMaxValue").val();
    if (txtMaxValue == "" || txtMaxValue == undefined) {
        toastr.error("Please Enter Max Value");
        return false;
    }
    var txtNormalValue = $("#txtShortNormalValue").val();
    if (txtNormalValue == "") {
        $("#txtShortNormalValue").val(txtMinValue + ' - ' + txtMaxValue);
    }
    var myData = {
        SerialNumber: "0",TestParameter: "0", Sex: $("#cboPopShortGender").val(), StartAge: $("#txtShortStartAge").val(),
        StartAgeType: $("#cboShortStartAgeType").val(), EndAge: $("#txtShortEndAge").val(), EndAgeType: $("#cboShortEndAgeType").val(),
        MinValue: $("#txtShortMinValue").val(), MaxValue: $("#txtShortMaxValue").val(), NormalValues: $("#txtShortNormalValue").val(),
        HypoValue: $("#txtShortHypoValue").val(), HyperValue: $("#txtShortHyperValue").val()
    };
    var id_list = jQuery("#jqgShortResult").jqGrid('getDataIDs');
    $("#jqgShortResult").jqGrid("addRowData", id_list.length + 1, myData);
    toastr.success("Record Added");
    fnClearShortFields();
}

function fnAddTestMethod() {
    $("#jqgTestMethod").jqGrid('editCell', 0, 0, false);
    fnClearTestMethodFields();
    $('#PopupTestMethods').modal('show');

}
function fnClearTestMethodFields() {
    $("#cboTestMethod").val('0');
    $('#cboTestMethod').selectpicker('refresh');
    $('#chkTestMethodActiveStatus').parent().addClass("is-checked");
}
function fnAddGridTestMethod() {
    var cboTestmethod = $("#cboTestMethod").val();
    if (cboTestmethod == "0" || cboTestmethod == undefined) {
        toastr.error("Please Select Test Method");
        return false;
    }
    
    var myData = {
        TestMethod: $("#cboTestMethod").val(),
        ActiveStatus: $("#chkTestMethodActiveStatus").parent().hasClass("is-checked"), 
    };
    var id_list = jQuery("#jqgTestMethod").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgTestMethod').jqGrid('getRowData', rowId);
        if (cboTestmethod === rowData.TestMethod) {
            toastr.error("Record Already Exist");
            return false;
        }
    }
    $("#jqgTestMethod").jqGrid("addRowData", id_list.length + 1, myData);
    toastr.success("Record Added");
    fnClearTestMethodFields();
}
//=============================================================================


//============================ Long Template Creator =========================
function fnLoadLongResult(serviceid, businesskey, resulttype) {

    //Prepare Long Values grid
    $("#jqgLongResult").jqGrid('GridUnload');
    $("#jqgLongResult").jqGrid({
        //url: getBaseURL() + '',
        datatype: 'json',
        //mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Template Code", "Description", "Reporting Sequence","Active Status"],

        colModel: [

            { name: "ProfileServiceId", width: 50, editable: false, align: 'left'},
            { name: "ProfileServiceId", width: 150, editable: false, align: 'left', edittype: "select", formatter: 'select', editoptions: { value: l_labservices }},
            { name: "ReportingSequence", width: 50, editable: true, align: 'left' },
            { name: "ActiveStatus", width: 50, editable: true, align: 'left', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth: 55,
        emptyrecords: "No records to Veiw",
        pager: "#jqpLongResult",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            $("#jqgLongResult").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpLongResult', { add: false, edit: false, search: false, del: false, refresh: false })
     .jqGrid('navButtonAdd', '#jqpLongResult', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddLongResult
        });

    //Calling full profile
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetFullServiceResultTemplate',
        data: {
            businessKey: businesskey,
            serviceID: serviceid,
            resultType: resulttype
        },
        success: function (result) {
            //Fill common values
            if (result.CommonValues != null) {
                $("#txtInterpretation").val(result.CommonValues.Interpretation);
                $("#txtImpression").val(result.CommonValues.Impression);
                $("#txtNotes").val(result.CommonValues.Note);
            }           
            //Fill Long Values
            $("#jqgLongResult")[0].addJSONData(result.l_LongValues);
        }
    });



}
function fnAddLongResult() {
    $("#jqgLongResult").jqGrid('editCell', 0, 0, false);
    fnClearLongFields();
    $('#PopupLongValues').modal('show');
}
function fnClearLongFields() {
    $("#cboLabServices").val('0');
    $('#cboLabServices').selectpicker('refresh');
    $("#txtReportingSequence").val('');
    $('#chkLongActiveStatus').parent().addClass("is-checked");
}
function fnAddGridLongValue() {
    var cboService = $("#cboLabServices").val();
    if (cboService == "0" || cboService == undefined) {
        toastr.error("Please Select Service");
        return false;
    }
    var txtReportingSequ = $("#txtReportingSequence").val();
    if (txtReportingSequ == "0" || txtReportingSequ == "" || txtReportingSequ == undefined) {
        toastr.error("Please Enter Reporting Sequence");
        return false;
    }

    var myData = {
        ProfileServiceId: $("#cboLabServices").val(),
        ReportingSequence: $("#txtReportingSequence").val(),
        ActiveStatus: $("#chkLongActiveStatus").parent().hasClass("is-checked"), 
    };
    var id_list = jQuery("#jqgLongResult").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgLongResult').jqGrid('getRowData', rowId);
        if (cboService === rowData.ProfileServiceId) {
            toastr.error("Record Already Exist");
            return false;
        }
    }
    $("#jqgLongResult").jqGrid("addRowData", id_list.length + 1, myData);
    toastr.success("Record Added");
    fnClearLongFields();
}
//=============================================================================

//============================ Analysis Template Creator =========================
function fnLoadAnalysisResult(serviceid, businesskey, resulttype) {

    //Prepare analysis values grid
    $("#jqgAnalysisResult").jqGrid('GridUnload');
    $("#jqgAnalysisResult").jqGrid({
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Serial Number", "Heading", "Test", "Unit", "Normal Values", "Test Method", "Reporting Sequence"],

        colModel: [
            { name: "SerialNumber", width: 10, editable: false, align: 'left', hidden: true },
            { name: "Heading", width: 25, editable: false, align: 'left' },
            { name: "TestParameterDesc", width: 25, editable: true, align: 'left' },
            { name: "Unit", width: 10, editable: true, align: 'left', edittype: "select", formatter: 'select', editoptions: { value: l_units }  },
            { name: "NormalValues", editable: true, width: 10, align: 'left' },
            { name: "TestMethod", width: 10, editable: true, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: l_testmethod }  },
            { name: "ReportingSequence", editable: true, width: 10, align: 'left' },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth: 55,
        emptyrecords: "No records to Veiw",
        pager: "#jqpAnalysisResult",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        cellsubmit: 'clientArray',

    }).jqGrid('navGrid', '#jqpAnalysisResult', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpAnalysisResult', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddAnalysisValue
        });

    //Calling full profile
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetFullServiceResultTemplate',
        data: {
            businessKey: businesskey,
            serviceID: serviceid,
            resultType: resulttype
        },
        success: function (result) {
            //Fill common values
            if (result.CommonValues != null) {
                $("#txtInterpretation").val(result.CommonValues.Interpretation);
                $("#txtImpression").val(result.CommonValues.Impression);
                $("#txtNotes").val(result.CommonValues.Note);
            }

            //Fill Analysis Values
            $("#jqgAnalysisResult")[0].addJSONData(result.l_AnalysisValues);

        }
    });
}
function fnAddAnalysisValue() {
    $("#jqgAnalysisResult").jqGrid('editCell', 0, 0, false);
    fnClearAnalysisFields();
    $('#PopupAnalysisValues').modal('show');

}
function fnClearAnalysisFields() {
    $("#txtAnalysisHeading").val('');
    $("#txtAnalysisTest").val('');
    $("#txtAnalysisRepSequence").val('');
    $("#txtAnalysisNormalValue").val('');
    $("#cboAnalysisUnit").val('0');
    $('#cboAnalysisUnit').selectpicker('refresh');
    $("#cboAnalysisTestMethod").val('0');
    $('#cboAnalysisTestMethod').selectpicker('refresh');
    
   // $('#chkAnalysisActiveStatus').parent().addClass("is-checked");
}
function fnAddGridAnalysisValue() {
    var txtAnalysisHeading = $("#txtAnalysisHeading").val();
    if (txtAnalysisHeading == "" || txtAnalysisHeading == undefined) {
        toastr.error("Please Enter Heading");
        return false;
    }
    var txtAnalysisTest = $("#txtAnalysisTest").val();
    if (txtAnalysisTest == "" || txtAnalysisTest == undefined) {
        toastr.error("Please Enter Test");
        return false;
    }
    var txtAnalysisNormalValue = $("#txtAnalysisNormalValue").val();
    if (txtAnalysisNormalValue == "" || txtAnalysisNormalValue == undefined) {
        toastr.error("Please Enter Normal Value");
        return false;
    }
    var txtAnalysisRepSequence = $("#txtAnalysisRepSequence").val();
    if (txtAnalysisRepSequence == "" || txtAnalysisRepSequence == undefined) {
        toastr.error("Please Enter Reporting Sequence");
        return false;
    }
    var cboAnalysisUnit = $("#cboAnalysisUnit").val();
    if (cboAnalysisUnit == "0" || cboAnalysisUnit == undefined) {
        toastr.error("Please Select Unit");
        return false;
    }
    var cboAnalysisTestMethod = $("#cboAnalysisTestMethod").val();
    if (cboAnalysisTestMethod == "0" || cboAnalysisTestMethod == undefined) {
        toastr.error("Please Select Test Method");
        return false;
    }
   
    var myData = {
        SerialNumber: "0", Heading: $("#txtAnalysisHeading").val(), TestParameterDesc: $("#txtAnalysisTest").val(),
        NormalValues: $("#txtAnalysisNormalValue").val(), ReportingSequence: $("#txtAnalysisRepSequence").val(), 
        Unit: $("#cboAnalysisUnit").val(), TestMethod: $("#cboAnalysisTestMethod").val()
    };
    var id_list = jQuery("#jqgAnalysisResult").jqGrid('getDataIDs');
    $("#jqgAnalysisResult").jqGrid("addRowData", id_list.length + 1, myData);
    toastr.success("Record Added");
    fnClearAnalysisFields();
}

//=============================================================================

//============================ Descriptive Template Creator =========================
function fnLoadDescriptiveResult(serviceid, businesskey, resulttype,templatetype) {
    //Calling full profile
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/GetFullServiceResultTemplate',
        data: {
            businessKey: businesskey,
            serviceID: serviceid,
            resultType: resulttype,
            templateType: templatetype
        },
        success: function (result) {
            //Fill common values
            if (result.CommonValues != null) {
                $("#txtInterpretation").val(result.CommonValues.Interpretation);
                $("#txtImpression").val(result.CommonValues.Impression);
                $("#txtNotes").val(result.CommonValues.Note);
            }

            //Fill Descriptive Values
            if (result.DescriptiveResult != null) {
                $("#cboDesTemplateType").val(result.DescriptiveResult.TemplateType);
                tinymce.get("txtDescriptive").setContent(result.DescriptiveResult.DescriptiveResult);
            }
            else {
                tinymce.get("txtDescriptive").setContent('');
            }

        }
    });
}
function fnChangeTemplateType() {
    var templatetype = $('#cboDesTemplateType').val();
    fnLoadDescriptiveResult(serviceId, businesskey, resulttype, templatetype);
}

//=============================================================================


function fnSaveFullTemplate() {
    //common values
    var commonvalues = {
        BusinessKey: businesskey,
        ServiceId: serviceId,
        ResultType: resulttype,

        Interpretation: $("#txtInterpretation").val(),
        Impression: $("#txtImpression").val(),
        Note: $("#txtNotes").val(),
    }

    var obj;

    // Short Result
    if (resulttype === 'S') {
        $("#jqgShortResult").jqGrid('editCell', 0, 0, false);
        $("#jqgTestMethod").jqGrid('editCell', 0, 0, false);

        //Short Header
        var shortheader = {
            Unit: $("#cboShortUnit").val(),
            IsNumericResultValue: $("#chkResultNumeric").parent().hasClass("is-checked"),
            ResultComputed: $("#chkResultComputed").parent().hasClass("is-checked"),
            ResultFormula: $("#txtShortFormula").val()
        }

        //Short Values
        var l_short = [];
        var id_list = jQuery("#jqgShortResult").jqGrid('getDataIDs');
        for (var i = 0; i < id_list.length; i++) {
            var rowId = id_list[i];
            var rowData = jQuery('#jqgShortResult').jqGrid('getRowData', rowId);

            l_short.push({
                SerialNumber: rowData.SerialNumber,
                Sex: rowData.Sex,
                StartAge: rowData.StartAge,
                StartAgeType: rowData.StartAgeType,
                EndAge: rowData.EndAge,
                EndAgeType: rowData.EndAgeType,
                MinValue: rowData.MinValue,
                MaxValue: rowData.MaxValue,
                NormalValues: rowData.NormalValues,
                HypoValue: rowData.HypoValue,
                HyperValue: rowData.HyperValue,
            });
        }
        //Test Method
        var l_testmethod = [];
        var id_list_t = jQuery("#jqgTestMethod").jqGrid('getDataIDs');
        for (var i = 0; i < id_list_t.length; i++) {
            var rowId = id_list_t[i];
            var rowData = jQuery('#jqgTestMethod').jqGrid('getRowData', rowId);
            l_testmethod.push({
                TestMethod: rowData.TestMethod,
                ActiveStatus: rowData.ActiveStatus,
            });
        }

        obj = {
            CommonValues: commonvalues,
            ShortHeader: shortheader,
            l_ShortValues: l_short,
            l_TestMethod: l_testmethod           
        };
    }
    // Long Result
    if (resulttype === 'L') {
        $("#jqgLongResult").jqGrid('editCell', 0, 0, false);

        //Long Values
        var l_long = [];
        var id_list = jQuery("#jqgLongResult").jqGrid('getDataIDs');
        for (var i = 0; i < id_list.length; i++) {
            var rowId = id_list[i];
            var rowData = jQuery('#jqgLongResult').jqGrid('getRowData', rowId);

            l_long.push({
                ProfileServiceId: rowData.ProfileServiceId,
                ReportingSequence: rowData.ReportingSequence,
                ActiveStatus: rowData.ActiveStatus
            });
        }
        

        obj = {
            CommonValues: commonvalues,
            l_LongValues: l_long
        };
    }
    // Analysis Result
    if (resulttype === 'A') {
        $("#jqgAnalysisResult").jqGrid('editCell', 0, 0, false);

        //Analysis Values
        var l_analysis = [];
        var id_list = jQuery("#jqgAnalysisResult").jqGrid('getDataIDs');
        for (var i = 0; i < id_list.length; i++) {
            var rowId = id_list[i];
            var rowData = jQuery('#jqgAnalysisResult').jqGrid('getRowData', rowId);

            l_analysis.push({
                SerialNumber: rowData.SerialNumber,
                Heading: rowData.Heading,
                TestParameterDesc: rowData.TestParameterDesc,
                NormalValues: rowData.NormalValues,
                ReportingSequence: rowData.ReportingSequence,
                Unit: rowData.Unit,
                TestMethod: rowData.TestMethod
            });
        }

        obj = {
            CommonValues: commonvalues,
            l_AnalysisValues: l_analysis
        };

    }
    // Descriptive Result
    if (resulttype === 'D') {
        var descResult = tinymce.get("txtDescriptive").getContent();
        var descriptive = {
            TemplateType: $('#cboDesTemplateType').val(),
            DescriptiveResult: descResult
        }

        obj = {
            CommonValues: commonvalues,
            DescriptiveResult: descriptive
        };
    }

    $("#btnSaveAll").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ServiceTemplateCreator/AddOrUpdateFullServiceResultTemplate',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Data Saved");
                if (resulttype === 'S') {
                    $("#jqgShortResult").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                    $("#jqgTestMethod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                }
                if (resulttype === 'L') {
                    $("#jqgLongResult").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                }
                if (resulttype === 'A') {
                    $("#jqgAnalysisResult").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                }
                
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveAll").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveAll").attr("disabled", false);
        }
    });
   
}



