

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
       var EmployeeNamePrefix = $(this).text();
        fnGridEmployeeDetails(EmployeeNamePrefix);
        $(this).addClass('active');
    });
    $("#jqgEmployeeDetails").jqGrid({
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.EmployeeNumber, localization.EmployeeID, localization.BiometricCode, localization.EmployeeName, localization.EmailID, localization.MobileNumber, localization.Active, ""],
        colModel: [
            { name: "BusinessKey", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "EmployeeNumber", width: 110, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "EmployeeId", width: 110, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "BiometricId", width: 110, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmployeeName", width: 110, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmailID", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "MobileNumber", width: 110, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", width: 65, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 130, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit"  onclick="return fnEditEmpDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View"  onclick="return fnEditEmpDetails(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button"  onclick="return fnDeActivateEmpDetails(event)"><i class="fas fa-trash"></i>' + localization.DeActivate + '</button>'
                }
            },
        ],
        pager: "#jqpEmployeeDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        
    }).jqGrid('navGrid', '#jqpEmployeeDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmployeeDetails
    }).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmployeeDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgEmployeeDetails"),
            newWidth = $grid.closest(".codetypecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();

});


$('#v-pills-tab a').on('click', function (e) {
    var activeTabName = "";
    e.preventDefault();
    $(".tab-pane").removeClass('show active');
    activeTabName = $(this).attr("href");
    $(activeTabName).addClass("show");
});
var actiontype = "";

function fnGridEmployeeDetails(alphabet) {

    $("#jqgEmployeeDetails").GridUnload();

    $("#jqgEmployeeDetails").jqGrid({
        url: getBaseURL() + '/Employee/GetEmployeesInfobySuffix?Alphabet=' + alphabet,
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.EmployeeNumber, localization.EmployeeID, localization.BiometricCode, localization.EmployeeName, localization.EmailID, localization.MobileNumber, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "EmployeeNumber", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "EmployeeId", width: 70, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden:false },
            { name: "BiometricId", width: 70, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmployeeName", width: 110, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmailID", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "MobileNumber", width: 70, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", width: 65, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 130, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditEmpDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + localization.Edit + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditEmpDetails(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDelete" onclick="return fnDeActivateEmpDetails(event)"><i class="fas fa-trash"></i>' + localization.DeActivate + '</button>'
                }
            },
        ],
        pager: "#jqpEmployeeDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpEmployeeDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmployeeDetails
        }).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmployeeDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgEmployeeDetails"),
            newWidth = $grid.closest(".codetypecontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}


function fnSaveEmployeeDetails() {
    if (IsValidEmployee() == false) {
        return;
    }

    $("#btnSaveEmployeeDetails").attr('disabled', true);
    
    var file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    var obj = {
        BusinessKey: $("#cboBusinessKey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val() === '' ? 0 : $("#txtEmployeenumber").val(),
        EmployeeId: $("#txtEmployeeId").val(),
        BiometricId: $("#txtBiometriccode").val(),
        Title: $("#cboTitle").val(),
        EmployeeName: $("#txtEmployeename").val(),
        Gender: $("#cboGender").val(),
        MobileNumber: $("#txtMobilenumber").val(),
        WillingnessToWorkInShifts: 0,
        ExemptedFromAttendance: $('#chkExemptedfromATT').parent().hasClass("is-checked"),
        EmployeeStatus: $("#txtEmployeeStatus").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        EmployeeGroup: $("#cboEmployeegroup").val(),
        EmployeeClass: $("#cboEmployeeclass").val(),
        EmployeePayCategory: $("#cboEmployeepaycategory").val(),
        DateProbationTill: $("#txtDateofProbationTill").val(),
        DateOfJoining: $("#txtDateofjoining").val(),
        DateOfConfirmation: $("#txtDateofconfirmation").val(),
        DateOfResignation: $("#txtDateofresignation").val(),
        DateOfTermination: $("#txtDateoftermination").val(),
        DateOfRelieving: $("#txtDateofrelieving").val(),
        AnySuspension: $("#chkSuspensionemploymenttenure").parent().hasClass("is-checked"),
        CurrentDepartment: $("#txtCurrentdepartment").val(),
        CurrentLocationPosted: $("#txtCurrentlocationposted").val(),
        CurrentBasic: $("#txtCurrentbasic").val(),
        CurrentGross: $("#txtCurrentgross").val(),
    };
   
    $.ajax({

        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeeInfo',
        type: 'POST',
        datatype: 'json',
        data: {
            obj,
            file: file,
        },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshEmployeeDetails();
                ReadEmployeeNumber(response);
                $("#btnSaveEmployeeDetails").attr('disabled', false);
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveEmployeeDetails").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEmployeeDetails").attr('disabled', false);
        }
    });
}

function ReadEmployeeNumber(res) {
    $("#txtEmployeenumber").val('');
    $("#txtEmployeenumber").val(res.EmpNumber);
    $("#txtBusinesskey").val(res.Businesskey); 
}

function IsValidEmployee() {

    //var EmailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    //if ($("#txtemailid").val().trim().length <= 0) {
    //    toastr.warning("Please Enter Email Id");
    //    return false;
    //}
    //if (!EmailPattern.test($("#txtemailid").val())) {
    //    toastr.warning("Email ID is Not Valid");
    //    return false;
    //}
    if ($("#cboBusinessKey").val() === '0' || $("#cboBusinessKey").val() === '') {
        toastr.warning("Please Select a Business Key");
        return false;
    }


    if (IsStringNullorEmpty($("#txtEmployeeId").val())) {
        toastr.warning("Please Enter the Employee ID");
        return false;
    }
    if ($('#imgPhotoimageblah').attr('src') === undefined || $('#imgPhotoimageblah').attr('src') === "")
    {
        toastr.warning("Please Select a Employee Image");
        return false;
    }
    
   
    if (IsStringNullorEmpty($("#txtEmployeename").val())) {
        toastr.warning("Please Enter the Employee Name");
        return false;
    }

    if ($("#cboGender").val() === "0") {
        toastr.warning("Please Select a Gender");
        return false;
    }
    if (IsStringNullorEmpty($("#txtMobilenumber").val())) {
        toastr.warning("Please Enter the Mobile Number");
        return false;
    }
    if ($("#cboTitle").val() === "0") {
        toastr.warning("Please Select a Title");
        return false;
    }
    if (IsStringNullorEmpty($("#txtEmployeeStatus").val())) {
        toastr.warning("Please Enter the Employee Status");
        return false;
    }
    if ($("#cboEmployeeclass").val() === "0") {
        toastr.warning("Please Select a Employee Class");
        return false;
    }
    if ($("#cboEmployeegroup").val() === "0") {
        toastr.warning("Please Select a Employee Group");
        return false;
    }
    if ($("#cboEmployeepaycategory").val() === "0") {
        toastr.warning("Please Select a Employee Pay Category");
        return false;
    }

    if (IsStringNullorEmpty($("#txtDateofjoining").val())) {
        toastr.warning("Please Enter the Date of joining");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCurrentdepartment").val())) {
        toastr.warning("Please Enter the Current Department");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCurrentlocationposted").val())) {
        toastr.warning("Please Enter the Current Location Posted");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCurrentbasic").val())) {
        toastr.warning("Please Enter the Current Basic");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCurrentgross").val())) {
        toastr.warning("Please Enter the Current Gross");
        return false;
    }
    
    
}

function fnEditEmpDetails(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgEmployeeDetails').jqGrid('getRowData', rowid);
    EmpNo = rowData.EmployeeNumber;

    $("#txtEmployeenumber").val(EmpNo);
    if ($("#txtEmployeenumber").val() !== '' && $("#txtEmployeenumber").val() !== undefined) {
        fnFillEmployeeDetails(actiontype);
    }
}

function fnFillEmployeeDetails(actiontype) {
    if ($("#txtEmployeenumber").val() !== '' && $("#txtEmployeenumber").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/Employee/GetEmployeeInfobyEmployeeNumber?EmpNumber=" + $("#txtEmployeenumber").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {

                $("#divForm").css("display", "block");
                $("#divGrid").hide();

                $('#cboBusinessKey').val(result.BusinessKey).selectpicker('refresh');
                $('#cboBusinessKey').prop('disabled', true).selectpicker('refresh');
                $("#txtEmployeenumber").val('');
                $('#txtEmployeenumber').val(result.EmployeeNumber);
                $("#txtBusinesskey").val(''); 
                $('#txtBusinesskey').val(result.BusinessKey); 
                $('#txtEmployeeId').val(result.EmployeeId);
                $("#txtBiometriccode").val(result.BiometricId);
                $("#cboTitle").val(result.Title).selectpicker('refresh');
                $('#txtEmployeename').val(result.EmployeeName);
                $('#cboGender').val(result.Gender).selectpicker('refresh');
                $('#txtMobilenumber').val(result.MobileNumber);
                
               
                //if (result.WillingnessToWorkInShifts === true) {

                //    $("#chkWillingnesstoworkInShifts").parent().addClass("is-checked");
                //}
                //else {
                //    $("#chkWillingnesstoworkInShifts").parent().removeClass("is-checked");
                //}
                if (result.ExemptedFromAttendance === true) {

                    $("#chkExemptedfromATT").parent().addClass("is-checked");
                }
                else {
                    $("#chkExemptedfromATT").parent().removeClass("is-checked");
                }
                $('#txtEmployeeStatus').val(result.EmployeeStatus);
                if (result.ActiveStatus === true) {

                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else {
                    $("#chkActiveStatus").parent().removeClass("is-checked");
                }
                $('#cboEmployeegroup').val(result.EmployeeGroup).selectpicker('refresh');
                $('#cboEmployeeclass').val(result.EmployeeClass).selectpicker('refresh');
                $('#cboEmployeepaycategory').val(result.EmployeePayCategory).selectpicker('refresh');

                if (result.DateProbationTill !== null) {
                    setDate($('#txtDateofProbationTill'), result.DateProbationTill);
                }
                else {
                    $('#txtDateofProbationTill').val('');
                }
                if (result.DateOfJoining !== null) {
                    setDate($('#txtDateofjoining'), result.DateOfJoining);
                }
                else {
                    $('#txtDateofjoining').val('');
                }
                if (result.DateOfConfirmation !== null) {
                    setDate($('#txtDateofconfirmation'), result.DateOfConfirmation);
                }
                else {
                    $('#txtDateofconfirmation').val('');
                }
                if (result.DateOfResignation !== null) {
                    setDate($('#txtDateofresignation'), result.DateOfResignation);
                }
                else {
                    $('#txtDateofresignation').val('');
                }
                if (result.DateOfTermination !== null) {
                    setDate($('#txtDateoftermination'), result.DateOfTermination);
                }
                else {
                    $('#txtDateoftermination').val('');
                }
                if (result.DateOfRelieving !== null) {
                    setDate($('#txtDateofrelieving'), result.DateOfRelieving);
                }
                else {
                    $('#txtDateofrelieving').val('');
                }
                if (result.AnySuspension === true) {

                    $("#chkSuspensionemploymenttenure").parent().addClass("is-checked");
                }
                else {
                    $("#chkSuspensionemploymenttenure").parent().removeClass("is-checked");
                }
                $('#txtCurrentdepartment').val(result.CurrentDepartment);
                $('#txtCurrentlocationposted').val(result.CurrentLocationPosted);
                $('#txtCurrentbasic').val(result.CurrentBasic);
                $('#txtCurrentgross').val(result.CurrentGross);
                if (result.Emplyeeimage !== null && result.Emplyeeimage !== "") {
                    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + result.Emplyeeimage + '"  alt=" &nbsp; Employee Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }

            }
        });


        if (actiontype.trim() == "edit") {
            $("#btnSaveEmployeeDetails").show();
            $("#btnCancel").show();
            fnEnableEmployeeDetails(false);
            $("#btnSaveEmployeeDetails").html(localization.Update);
            $("#btnSaveBankDetails,#btnSaveCurrentjob,#btnSaveEducation,#btnSaveEmployeeDetails,#btnSaveFamilyDetails,#btnSaveFixedDeduction,#btnSavePreviousjob,#btnSaveSalaryDetails,#btnSaveEmployeePersonalInfo").show();
           
        }
        if (actiontype.trim() == "view") {
            $("#btnSaveEmployeeDetails").hide();
            $("#btnCancel").hide();
            fnEnableEmployeeDetails(true);
            $("#btnSaveBankDetails,#btnSaveCurrentjob,#btnSaveEducation,#btnSaveEmployeeDetails,#btnSaveFamilyDetails,#btnSaveFixedDeduction,#btnSavePreviousjob,#btnSaveSalaryDetails,#btnSaveEmployeePersonalInfo").hide();
           
        }

    }
    fnFillEmployeePersonalInfo(actiontype);
}


function fnEnableEmployeeDetails(val) {
    $("input,textarea").attr('readonly', val);
    //$("#chkActiveStatus").attr('disabled', val);
    $("#chklocationstatus").prop('disabled', val);
    $("input[id*='chk']").attr('disabled', val);
    $("select").next().attr('disabled', val);
    $("#txtDateofProbationTill").prop('disabled', val);
    $("#txtDateofjoining").prop('disabled', val);
    $("#txtDateofconfirmation").prop('disabled', val);
    $("#txtDateofresignation").prop('disabled', val);
    $("#txtDateoftermination").prop('disabled', val);
    $("#txtDateofrelieving").prop('disabled', val);

    $("#chkActiveStatus").attr('disabled', true);
}

function fnAddEmployeeDetails() {
    fnClearEmpdetailsFields();
    fnClearEmpPersonalInfoFields();
    fnEnableEmployeeDetails(false);
    fnEnableEmployeePersonalInfo(false);
    $("#cboPermanentOrCurrent").attr('disabled', false).selectpicker('refresh');
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    $("#btnSaveEmployeeDetails").html(localization.Save);
    fnGridLanguagesKnown();
}

function fnClearEmpdetailsFields() {
    $('#cboBusinessKey').val('0').selectpicker('refresh');
    $('#cboBusinessKey').prop('disabled', false).selectpicker('refresh');
    $("#txtEmployeenumber").val('');
    $("#txtBusinesskey").val('');
    $("#txtEmployeeId").val('');
    $("#txtEmployeename").val('');
    $("#txtBiometriccode").val('');
    $('#cboGender').val('0').selectpicker('refresh');
    $('#cboTitle').val('0').selectpicker('refresh');
    $("#txtEmailId").val('');
    $("#txtMobilenumber").val(''); 
    $("#chkWillingtoworkinshifts").parent().removeClass("is-checked");
    $("#chkExemptedfromATT").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    $('#cboEmployeeclass').val('0').selectpicker('refresh');
    $('#cboEmployeegroup').val('0').selectpicker('refresh');
    $('#cboEmployeepaycategory').val('0').selectpicker('refresh');
    $("#txtDateofProbationTill").val('');
    $("#txtEmployeeStatus").val('');
    $("#txtDateofjoining").val('');
    $("#txtDateofconfirmation").val('');
    $("#txtDateofresignation").val('');
    $("#txtDateofrelieving").val('');
    $("#txtDateoftermination").val('');
    $("#txtCurrentdepartment").val('');
    $("#txtCurrentlocationposted").val('');
    $("#txtCurrentbasic").val('');
    $("#txtCurrentgross").val('');
    $("#chkSuspensionemploymenttenure").parent().removeClass("is-checked");
    $("#btnSaveEmployeeDetails").attr('disabled', false);
    $("#btnSaveEmployeeDetails").show();
    $("#btnCancel").show();
}

function fnGridRefreshEmployeeDetails() {
    $("#jqgEmployeeDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnCloseEmployeeDetails(){
    $("#divGrid").show();
    $("#divForm").css("display", "none");
}

//function SetGridControlByAction() {
//    $('#jqgAdd').removeClass('ui-state-disabled');
//    var eleEnable = document.querySelectorAll('#jqgEdit');

//    for (var i = 0; i < eleEnable.length; i++) {
//        eleEnable[i].disabled = false;
//    }
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }
//}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    var btn_editEnable = document.querySelectorAll('#jqgEdit');
    var btn_viewEnable = document.querySelectorAll('#jqgView');
    var btn_deleteEnable = document.querySelectorAll('#jqgDelete');
    for (var i = 0; i < btn_editEnable.length; i++) {
        btn_editEnable[i].disabled = false;
    }
    for (var j = 0; j < btn_viewEnable.length; j++) {
        btn_viewEnable[j].disabled = false;
    }
    for (var k = 0; k < btn_deleteEnable.length; k++) {
        btn_deleteEnable[k].disabled = false;
    }


    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var btn_editDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < btn_editDisable.length; i++) {
            btn_editDisable[i].disabled = true;
            btn_editDisable[i].className = "ui-state-disabled";
        }
    }
    if (_userFormRole.IsView === false) {
        var btn_viewDisable = document.querySelectorAll('#jqgView');
        for (var j = 0; j < btn_viewDisable.length; j++) {
            btn_viewDisable[j].disabled = true;
            btn_viewDisable[j].className = "ui-state-disabled";
        }
    }

    if (_userFormRole.IsDelete === false) {
        var btn_deleteDisable = document.querySelectorAll('#jqgDelete');
        for (var k = 0; k < btn_deleteDisable.length; k++) {
            btn_deleteDisable[k].disabled = true;
            btn_deleteDisable[k].className = "ui-state-disabled";
        }
    }
}
//Employee Personal Info

function fnFillEmployeePersonalInfo(actiontype) {

    if ($("#txtEmployeenumber").val() !== '' && $("#txtEmployeenumber").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/Employee/GetEmployeePersonalInfobyEmployeeNumber?EmpNumber=" + $("#txtEmployeenumber").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#divForm").css("display", "block");
                $("#divGrid").hide();
                //Personal Info

                if (response !== null) {
                    if (response.DateOfBirth !== null) {
                        setDate($('#txtpersonalinfodateofbirth'), response.DateOfBirth);
                    }
                    else {
                        $('#txtpersonalinfodateofbirth').val('');
                    }
                    $("#cboBloodgroup").val(response.BloodGroup).selectpicker('refresh');
                    $('#cboBloodgroup').prop('disabled', false).selectpicker('refresh');
                    $("#cboMothertongue").val(response.MotherTongue).selectpicker('refresh');
                    $('#cboMothertongue').prop('disabled', false).selectpicker('refresh');
                    $("#cboReligion").val(response.Religion).selectpicker('refresh');
                    $('#cboReligion').prop('disabled', false).selectpicker('refresh');
                    $("#cboCaste").val(response.Caste).selectpicker('refresh');
                    $('#cboCaste').prop('disabled', false).selectpicker('refresh');
                    $("#cboUniqueId").val(response.EmployeeUniqueId).selectpicker('refresh');
                    $('#cboUniqueId').prop('disabled', false).selectpicker('refresh');
                    $("#txtUniqueIdInfo").val(response.EmployeeUniqueInfo);

                    //Contact Info
                    $('#cboPermanentOrCurrent').val(response.PermanentOrCurrent).selectpicker('refresh');
                    $("#cboPermanentOrCurrent").attr('disabled', true).selectpicker('refresh');
                    $('#cboCountry').val(response.Country).selectpicker('refresh');
                    $('#cboCountry').prop('disabled', false).selectpicker('refresh');
                    $('#cboState').val(response.State).selectpicker('refresh');
                    $('#cboState').prop('disabled', false).selectpicker('refresh');
                    $('#cboCity').val(response.City).selectpicker('refresh');
                    $('#cboCity').prop('disabled', false).selectpicker('refresh');
                    $('#txtPermanentaddress').val(response.Address);
                    $('#txtLandlinenumber').val(response.LandLineNumber);
                    $('#txtPincode').val(response.Pincode);
                    if (response.PermanenActiveStatus === true) {

                        $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
                    }
                    else {
                        $("#chkPersonalinfoActiveStatus").parent().removeClass("is-checked");
                    }

                }
                fnGridLanguagesKnown();
            }
        });


        if (actiontype.trim() == "edit") {
            $("#btnSaveEmployeePersonalInfo").show();
            $("#btnCancel").show();
            fnEnableEmployeePersonalInfo(false);
            $("#btnSaveEmployeePersonalInfo").html(localization.Update);
        }
        if (actiontype.trim() == "view") {
            $("#btnSaveEmployeePersonalInfo").hide();
            $("#btnCancel").hide();
            fnEnableEmployeePersonalInfo(true);

        }

    }
  
}

function fnEnableEmployeePersonalInfo(val) {
    //Personal Info
    $("#txtpersonalinfodateofbirth").prop('disabled', val);
    $("#cboBloodgroup").attr('disabled', val).selectpicker('refresh');;
    $("#cboMothertongue").attr('disabled', val).selectpicker('refresh');;
    $("#cboReligion").attr('disabled', val).selectpicker('refresh');;
    $("#cboCaste").attr('disabled', val).selectpicker('refresh');;
    $("#cboUniqueId").attr('disabled', val).selectpicker('refresh');;
    $("#txtUniqueIdInfo").prop('disabled', val);

    //Contact Info
    //$("#cboPermanentOrCurrent").attr('disabled', val).selectpicker('refresh');
    $("#cboCountry").attr('disabled', val).selectpicker('refresh');;
    $("#cboState").attr('disabled', val).selectpicker('refresh');;
    $("#cboCity").attr('disabled', val).selectpicker('refresh');;
    $("#txtPermanentaddress").prop('disabled', val);
    $("#txtLandlinenumber").prop('disabled', val);
    $("#txtPincode").prop('disabled', val);
    $("#chkPersonalinfoActiveStatus").attr('disabled', val);
    
}

function fnSaveEmployeePersonalInfo() {
    if (IsValidEmployeePersonalInfo() == false) {
        return;
    }

    $("#btnSaveEmployeePersonalInfo").attr('disabled', true);

    var $grid = $("#jqgLanguagesKnown");
    var obj_langlist = [];
    var lan_list = [];
    var ids = jQuery("#jqgLanguagesKnown").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLanguagesKnown').jqGrid('getRowData', rowId);
        obj_langlist.push({
            ApplicationCode: rowData.ApplicationCode,
            SpeakStatus: rowData.SpeakStatus,
            ReadStatus: rowData.ReadStatus,
            WritekStatus: rowData.WritekStatus
            });
    }
    if (obj_langlist !== null && obj_langlist != "undefined" && obj_langlist.length > 0)
    {
        for (var k = 0; k < obj_langlist.length; k++) {
        
            lan_list.push({
                Language: obj_langlist[k].ApplicationCode,
                Speak: obj_langlist[k].SpeakStatus,
                Reads: obj_langlist[k].ReadStatus,
                Write: obj_langlist[k].WritekStatus
        });
    }
  }
    

    var obj = {
        BusinessKey: $("#txtBusinesskey").val(),
        EmployeeNumber: $("#txtEmployeenumber").val(),
        //Personal Info
        DateOfBirth: $("#txtpersonalinfodateofbirth").val(),
        BloodGroup: $("#cboBloodgroup").val(),
        MotherTongue: $("#cboMothertongue").val(),
        Religion: $("#cboReligion").val(),
        Caste: $("#cboCaste").val(),
        EmployeeUniqueId: $("#cboUniqueId").val(),
        EmployeeUniqueInfo: $("#txtUniqueIdInfo").val(),
        //Contact Info
        PermanentOrCurrent: $("#cboPermanentOrCurrent").val(),
        Address: $("#txtPermanentaddress").val(),
        City: $("#cboCity").val(),
        Pincode: $("#txtPincode").val(),
        State: $("#cboState").val(),
        Country: $("#cboCountry").val(),
        LandLineNumber: $("#txtLandlinenumber").val(),
        PermanenActiveStatus: $("#chkPersonalinfoActiveStatus").parent().hasClass("is-checked"),
        EmplanguageList: lan_list
    };

    $.ajax({

        url: getBaseURL() + '/Employee/InsertOrUpdateEmployeePersonalInfo',
        type: 'POST',
        datatype: 'json',
        data: {
            obj,
            langlist: obj_langlist,
        },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                //fnClearEmpPersonalInfoFields();
                $("#btnSaveEmployeePersonalInfo").attr('disabled', false);
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveEmployeePersonalInfo").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEmployeePersonalInfo").attr('disabled', false);
        }
    });
}

function IsValidEmployeePersonalInfo() {

    if (IsStringNullorEmpty($("#txtEmployeenumber").val())) {
        toastr.warning("Please Create the Employee details Details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBusinesskey").val())) {
        toastr.warning("Please Create the Employee details Details");
        return false;
    }
    if (IsStringNullorEmpty($("#txtpersonalinfodateofbirth").val())) {
        toastr.warning("Please Select a Date of Birth");
        return false;
    }

    if ($("#cboBloodgroup").val() === "0") {
        toastr.warning("Please Select a Blood Group");
        return false;
    }
    if ($("#cboMothertongue").val() === "0") {
        toastr.warning("Please Select a Mother Tongue");
        return false;
    }
    if ($("#cboReligion").val() === "0") {
        toastr.warning("Please Select a Religion");
        return false;
    }
    if ($("#cboCaste").val() === "0") {
        toastr.warning("Please Select a Caste");
        return false;
    }
    if ($("#cboUniqueId").val() === "0") {
        toastr.warning("Please Select a Unique ID");
        return false;
    }

    if ($("#cboPermanentOrCurrent").val() === "0") {
        toastr.warning("Please Select a Permanent Or Current Address");
        return false;
    }
    if (IsStringNullorEmpty($("#txtPermanentaddress").val())) {
        toastr.warning("Please Enter the Address");
        return false;
    }
    if ($("#cboCountry").val() === "0") {
        toastr.warning("Please Select a Country");
        return false;
    }
    //if ($("#cboState").val() === "0") {
    //    toastr.warning("Please Select State");
    //    return false;
    //}
    //if ($("#cboCity").val() === "0") {
    //    toastr.warning("Please Select City");
    //    return false;
    //}

    if (IsStringNullorEmpty($("#txtPincode").val())) {
        toastr.warning("Please Enter the Pin Code");
        return false;
    }
    
}

function fnClearEmpPersonalInfoFields() {
    //Personal Info
    $("#txtpersonalinfodateofbirth").val('');
    $('#cboBloodgroup').val('0').selectpicker('refresh');
    $('#cboMothertongue').val('0').selectpicker('refresh');
    $('#cboReligion').val('0').selectpicker('refresh');
    $('#cboCaste').val('0').selectpicker('refresh');
    $('#cboUniqueId').val('0').selectpicker('refresh');
    $("#txtUniqueIdInfo").val('');
    //Contact Info   
    $('#cboPermanentOrCurrent').val('0').selectpicker('refresh');
    $('#cboCountry').val('0').selectpicker('refresh');
    $('#cboState').val('0').selectpicker('refresh');
    $('#cboCity').val('0').selectpicker('refresh');
    $("#txtPermanentaddress").val('');
    $("#txtLandlinenumber").val('');
    $("#txtPincode").val('');
    $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
    $("#btnSaveEmployeePersonalInfo").attr('disabled', false);
    $("#btnSaveEmployeePersonalInfo").show();
    $("#btnSaveEmployeePersonalInfo").html(localization.Save);
    $("#btnCancel").show();
}

function fnDeActivateEmpDetails(e) {
    debugger;
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgEmployeeDetails').jqGrid('getRowData', rowid);
    var EmpNo = rowData.EmployeeNumber;
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to De Activate Employee?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want to Activate Employee?";
        lbl = localization.Activate;
    }
    bootbox.confirm({
        title: 'Employee',
        message: msg,
        buttons: {
            confirm: {
                label: lbl,
                className: 'mdl-button  primary-button'
            },
            cancel: {
                label: 'Cancel',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result) {
                if (EmpNo == null || EmpNo == undefined || EmpNo == "0" || EmpNo == '') {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/Employee/ActiveOrDeActiveEmployee?status=' + a_status + '&EmpNo=' + EmpNo,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            toastr.success(response.Message);
                            fnGridRefreshEmployeeDetails();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        $("#jqgEmployeeDetails").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}