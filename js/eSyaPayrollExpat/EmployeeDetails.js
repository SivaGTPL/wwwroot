var EmployeeNamePrefix = "";
var EmployeeNo;
var isAdd = 0;
$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        EmployeeNamePrefix = $(this).text();
        fnGridEmployeeDetails(EmployeeNamePrefix);
        $(this).addClass('active');
    });

    fnGridEmployeeDetails(EmployeeNamePrefix);


    $("#divDateofTermination").hide();
    $("#divTerminationReason").hide();

    $("#chkIsTerminated").change(function () {
        if (this.checked) {
            $('#divDateofTermination').show();
            $('#divTerminationReason').show();

        } else {
            $("#divDateofTermination").hide();
            $("#divTerminationReason").hide();

        }
    });

});


//function fnBusinessKeyChanges() {
//    fnGridEmployeeDetails(EmployeeNamePrefix);
//}

function fnBusinessLocation_onChange() {

    fnGridEmployeeDetails(EmployeeNamePrefix);
}

function fnGridEmployeeDetails(EmployeeNamePrefix) {
    $("#jqgEmployeeDetails").jqGrid('GridUnload');
    $("#jqgEmployeeDetails").jqGrid({
        url: getBaseURL() + '/EmployeeExpat/GetEmployeeListByNamePrefix?BusinessKey=' + $("#cboBusinessLocation").val() + '&employeeNamePrefix=' + EmployeeNamePrefix,
        datatype: 'json',
        //mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Business Key", "Employee Number", "Employee ID", "Biometric Code", "Title", "Employee Name", "Gender", "Email ID", "Mobile Number", "Employee Group", "Status", "Active Status", "Actions"],
        colModel: [
            { name: "BusinessKey", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "EmployeeNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "EmployeeID", width: 30, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "BiometricID", width: 10, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "Title", width: 15, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmployeeName", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Gender", editable: true, width: 20, align: 'left', edittype: "select", formatter: 'select', editoptions: { value: "M: Male;F: Female" } },
            { name: "EmailID", width: 60, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "MobileNumber", width:50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmployeeGroupDescription", width: 45, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "EmployeeStatus", editable: true, width: 20, align: 'center', edittype: "select", formatter: 'select', editoptions: { value: "Y: Active;N: In-Active" } },
            { name: "ActiveStatus", width: 25, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, hidden: true },
            {
                name: 'edit', search: false, align: 'left', width: 45, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditEmpDetails(event,\'edit\');"><i class="fas fa-pen"></i>' + 'Edit' + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditEmpDetails(event,\'view\');"><i class="far fa-eye"></i>' + 'View' + '</button>'
                }
            },
        ],
        pager: "#jqpEmployeeDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: true,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        rownumWidth:'50',
        loadComplete: function (data) {
        //    fnSetGridwidth("jqpEmployeeDetails");
        },

        //}).jqGrid('navGrid', '#jqpEmployeeDetails', {
        //    add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload'
        //}).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
        //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmployeeDetails
        //}).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
        //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmployeeDetails
        //});
    }).jqGrid('navGrid', '#jqpEmployeeDetails', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
        closeOnEscape: true,
        caption: "Search...",
        multipleSearch: true,
        Find: "Find",
        Reset: "Reset",
        odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
    }).jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmployeeDetails
    }).
        jqGrid('navButtonAdd', '#jqpEmployeeDetails', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshEmployeeDetails
        });

    $(window).on("resize", function () {
      //  fnSetGridwidth("jqpEmployeeDetails");
    });
    fnAddGridSerialNoHeading();
}

$('#v-pills-tab a').on('click', function (e) {
    var activeTabName = "";
    e.preventDefault();
    $(".tab-pane").removeClass('show active');
    activeTabName = $(this).attr("href");
    $(activeTabName).addClass("show");
});

function SetGridControlByAction() {
    //if (_userFormRole.IsInsert === false) {
    //    $('#jqgAdd').addClass('ui-state-disabled');
    //}
    //if (_userFormRole.IsEdit === false) {
    //    var eleDisable = document.querySelectorAll('#jqgEdit');
    //    for (var i = 0; i < eleDisable.length; i++) {
    //        eleDisable[i].disabled = true;
    //        eleDisable[i].className = "ui-state-disabled";
    //    }
    //}
}

function fnGridRefreshEmployeeDetails() {
    $("#jqgEmployeeDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditEmpDetails(e, actiontype) {
    isAdd = 0;
    fnClearFields();
    fnClearFieldsPersonal();
    fnClearSalaryInfoFields();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgEmployeeDetails').jqGrid('getRowData', rowid);
    EmployeeNo = rowData.EmployeeNumber;
    $("#txtEmployeeNumber").val(EmployeeNo);

    if (EmployeeNo !== '' && EmployeeNo !== undefined) {
        $("#divForm").css("display", "block");
        $("#divGrid").hide();
        fnFillEmployeeCreationValues();
        fnFillEmployeePersonalValues();
        fnGridSalaryInfo();
    }

    if (actiontype.trim() == "edit") {

    }
    if (actiontype.trim() == "view") {

    }
}

function fnFillEmployeeCreationValues() {

    if ($("#txtEmployeeNumber").val() !== '' && $("#txtEmployeeNumber").val() !== undefined) {

        $.ajax({
            async: false,
            url: getBaseURL() + '/EmployeeExpat/GetEmployeeDetails?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $('#txtEmployeeId').val(result.EmployeeID);
                $('#txtBiometriccode').val(result.BiometricID);
                $("#cboEmployeegroup").val(result.EmployeeGroup);
                $("#cboEmployeegroup").selectpicker('refresh');
                $("#cboTitle").val(result.Title);
                $("#cboTitle").selectpicker('refresh');
                $('#txtEmployeename').val(result.EmployeeName);
                $("#cboGender").val(result.Gender);
                $("#cboGender").selectpicker('refresh');
                $('#txtMobilenumber').val(result.MobileNumber);
                $('#txtEmailId').val(result.EmailID);
                $("#cboWorkStatus").val(result.WorkStatus);
                $("#cboWorkStatus").selectpicker('refresh');
                $("#cboEmployeeStatus").val(result.EmployeeLocation);
                $("#cboEmployeeStatus").selectpicker('refresh');

                if (result.ExemptedFromAttendance === true) {
                    $("#chkExemptedfromATT").parent().addClass("is-checked");
                }
                else {
                    $("#chkExemptedfromATT").parent().removeClass("is-checked");
                }

                $("#cboEmployeeStatus").val(result.EmployeeStatus);
                $("#cboEmployeeStatus").selectpicker('refresh');

                if (result.DateOfJoining !== null) {
                    setDate($('#txtDateofjoining'), result.DateOfJoining);
                }
                else {
                    $('#txtDateofjoining').val('');
                }

                if (result.DateOfJoining !== null) {
                    setDate($('#txtDateofconfirmation'), result.DateOfJoining);
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

                if (result.DateOfRelieving !== null) {
                    setDate($('#txtDateofrelieving'), result.DateOfRelieving);

                }
                else {
                    $('#txtDateofrelieving').val('');

                }
                if (result.Termination === true) {
                    $("#chkIsTerminated").parent().addClass("is-checked");
                }
                else {
                    $("#chkIsTerminated").parent().removeClass("is-checked");
                }

                if (result.DateOfTermination !== null) {
                    setDate($('#txtDateoftermination'), result.DateOfTermination);
                    $('#divDateofTermination').show();
                    $('#divTerminationReason').show();
                    $("#chkIsTerminated").parent().addClass("is-checked");


                }
                else {
                    $('#txtDateoftermination').val('');
                    $('#divDateofTermination').hide();
                    $('#divTerminationReason').hide();
                    $("#chkIsTerminated").parent().removeClass("is-checked");
                }

                $('#txtTerminationReason').val(result.TerminationReason);

                if (result.EmployeeImage !== null && result.EmployeeImage !== "") {
                    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + result.EmployeeImage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }

                if (result.DateOfBirth !== null) {
                    setDate($('#txtpersonalinfodateofbirth'), result.DateOfBirth);
                }
                else {
                    $('#txtpersonalinfodateofbirth').val('');
                }

                $("#cboBloodgroup").val(result.BloodGroup);
                $("#cboBloodgroup").selectpicker('refresh');
                $("#cboMothertongue").val(result.MotherTongue);
                $("#cboMothertongue").selectpicker('refresh');
            }
        });
    }
}

function fnAddEmployeeDetails() {

    if ($("#cboBusinessLocation").val().trim().length <= 0) {
        toastr.warning("Please Select a Business Location");
        return false;
    }

    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    fnClearFields();
    fnClearFieldsPersonal();
    $("#chkExemptedfromATT").parent().removeClass("is-checked");
    //fnClearSalaryInfoFields();
    //fnEmptySalaryBreakupGrid();
    fnGridSalaryInfo();
    isAdd = 1;
}

function fnWorkStatusChanges() {

    if (isAdd == 1) {
        if ($('#cboWorkStatus option:selected').text() == "Work Permit") {
            $("#chkNHIF").parent().addClass("is-checked");
            $("#chkNSSF").parent().addClass("is-checked");
        }
        else {
            $("#chkNHIF").parent().removeClass("is-checked");
            $("#chkNSSF").parent().removeClass("is-checked");
        }

        MethodsCheckChanged();
    }
}

function MethodsCheckChanged() {
    if ($("#chkNHIF").parent().hasClass("is-checked") == true) {
        $('#txtNHIFPercentage').val('0');
        $("#divNHIF").css('display', 'block')
    }
    else {
        $("#divNHIF").css('display', 'none')
    }

    if ($("#chkNSSF").parent().hasClass("is-checked") == true) {
        $('#txtNSSFPercentage').val('0');
        $("#divNSSF").css('display', 'block')
    }
    else {
        $("#divNSSF").css('display', 'none')
    }
}

function validateEmployeeDetails() {
    var EmailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if ($("#txtEmployeeId").val().trim().length <= 0) {
        toastr.warning("Please Enter the Employee Id");
        ('#txtEmployeeId').focus();
        return false;
    }
    if ($("#cboEmployeegroup").val() === "0" || $("#cboEmployeegroup").val() === "") {
        toastr.warning("Please Select a Employee Group");
        $('#cboEmployeegroup').focus();
        return false;
    }

    if (!IsStringNullorEmpty($("#txtEmailId").val())) {

        if (!EmailPattern.test($("#txtEmailId").val())) {
            toastr.warning("Please enter the valid Email ID");
            $('#txtEmailId').focus();
            return false;
        }
    }

    if ($("#cboTitle").val() === "0" || $("#cboTitle").val() === "") {
        toastr.warning("Please Select a Title");
        $('#cboTitle').focus();
        return false;
    }
    if ($("#txtEmployeename").val().trim().length <= 0) {
        toastr.warning("Please Enter the Employee Name");
        $('#txtMobileNo').focus();
        return false;
    }
    if ($("#cboGender").val() === "0" || $("#cboGender").val() === "") {
        toastr.warning("Please Select a Gender");
        $('#cboGender').focus();
        return false;
    }

    //if ($("#txtMobilenumber").val().trim().length <= 0) {
    //    toastr.warning("Please Enter Mobile Number");
    //    $('#txtMobilenumber').focus();
    //    return false;
    //}
    if ($("#cboWorkStatus").val() === "0" || $("#cboWorkStatus").val() === "") {
        toastr.warning("Please Select a Work Status");
        $('#cboWorkStatus').focus();
        return false;
    }
    if ($("#cboEmployeeStatus").val() === "0" || $("#cboEmployeeStatus").val() === "") {
        toastr.warning("Please Select a Employee Status");
        $('#cboEmployeeStatus').focus();
        return false;
    }
    if ($("#cboEmployeeStatus").val() === "0" || $("#cboEmployeeStatus").val() === "") {
        toastr.warning("Please Select a Employee Status");
        $('#cboEmployeeStatus').focus();
        return false;
    }
    if ($("#txtDateofjoining").val().trim().length <= 0) {
        toastr.warning("Please Enter the Date of joining");
        $('#txtDateofjoining').focus();
        return false;
    }

    var is_terminated = $("#chkIsTerminated").parent().hasClass("is-checked");
    if (is_terminated === true) {
        if ($("#txtDateoftermination").val().trim().length <= 0) {
            toastr.warning("Please Enter the Date of Termination");
            $('#txtDateoftermination').focus();
            return false;
        }
        if ($("#txtTerminationReason").val().trim().length <= 0) {
            toastr.warning("Please Enter the Termination Reason");
            $('#txtTerminationReason').focus();
            return false;
        }

    }

}

function fnSaveEmployeeDetails() {
    if (validateEmployeeDetails() === false) {
        return;
    }

    $("#btnSaveEmployeeDetails").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveEmployeeDetails").attr('disabled', true);

    var elem = document.getElementById('imgPhotoimageblah').src

    file = $('#imgPhoto img').attr('src');// Data URI

    var chk_terminated = $("#chkIsTerminated").parent().hasClass("is-checked");

    if (chk_terminated === false) {
        $('#txtDateoftermination').val('');
        $("#txtTerminationReason").val('');
    }



    var employeeNumber = $("#txtEmployeeNumber").val();
    var employeeMaster;
    if (employeeNumber === null || employeeNumber === "") {
        $("#btnSaveUserMaster").attr('disabled', true);
        employeeMaster = {
            BusinessKey: $("#cboBusinessLocation").val(),
            EmployeeID: $("#txtEmployeeId").val(),
            EmployeeNumber: 0,
            BiometricID: $("#txtBiometriccode").val(),
            EmployeeGroup: $("#cboEmployeegroup").val(),
            Title: $("#cboTitle").val(),
            EmployeeName: $("#txtEmployeename").val(),
            Gender: $("#cboGender").val(),
            MobileNumber: $("#txtMobilenumber").val() === '' ? '0' : $("#txtMobilenumber").val(),
            //MobileNumber: $("#txtMobilenumber").val(),
            EmailID: $("#txtEmailId").val(),
            WorkStatus: $("#cboWorkStatus").val(),
            ExemptedFromAttendance: $("#chkExemptedfromATT").parent().hasClass("is-checked"),
            EmployeeStatus: $("#cboEmployeeStatus").val(),
            DateOfJoining: $("#txtDateofjoining").val(),
            DateOfConfirmation: $("#txtDateofconfirmation").val(),
            DateOfResignation: $("#txtDateofresignation").val(),
            DateOfRelieving: $("#txtDateofrelieving").val(),
            Termination: $("#chkIsTerminated").parent().hasClass("is-checked"),
            DateOfTermination: $("#txtDateoftermination").val(),
            TerminationReason: $("#txtTerminationReason").val(),
            DateOfRelieving: $("#txtDateofrelieving").val()
        };
    }
    else {
        employeeMaster = {
            BusinessKey: $("#cboBusinessLocation").val(),
            EmployeeID: $("#txtEmployeeId").val(),
            EmployeeNumber: $("#txtEmployeeNumber").val(),
            BiometricID: $("#txtBiometriccode").val(),
            EmployeeGroup: $("#cboEmployeegroup").val(),
            Title: $("#cboTitle").val(),
            EmployeeName: $("#txtEmployeename").val(),
            Gender: $("#cboGender").val(),
            MobileNumber: $("#txtMobilenumber").val() === '' ? '0' : $("#txtMobilenumber").val(),
            //MobileNumber: $("#txtMobilenumber").val(),
            EmailID: $("#txtEmailId").val(),
            WorkStatus: $("#cboWorkStatus").val(),
            ExemptedFromAttendance: $("#chkExemptedfromATT").parent().hasClass("is-checked"),
            EmployeeStatus: $("#cboEmployeeStatus").val(),
            DateOfJoining: $("#txtDateofjoining").val(),
            DateOfConfirmation: $("#txtDateofconfirmation").val(),
            DateOfResignation: $("#txtDateofresignation").val(),
            DateOfRelieving: $("#txtDateofrelieving").val(),
            Termination: $("#chkIsTerminated").parent().hasClass("is-checked"),
            DateOfTermination: $("#txtDateoftermination").val(),
            TerminationReason: $("#txtTerminationReason").val(),
            DateOfRelieving: $("#txtDateofrelieving").val()
        };
    }

    $.ajax({
        async: false,
        url: getBaseURL() + '/EmployeeExpat/InsertOrUpdateEmployeeMaster',
        type: 'POST',
        data: {
            obj: employeeMaster,
            file: file
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#txtEmployeeNumber").val(response.ID);
                EmployeeNo = $("#txtEmployeeNumber").val();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveEmployeeDetails").html('Save');
            $("#btnSaveEmployeeDetails").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEmployeeDetails").attr("disabled", false);
            $("#btnSaveEmployeeDetails").html('Save');
        }
    });
}

function fnClearFields() {
    EmployeeNo = "";
    $("#txtEmployeeNumber").val('');
    $("#txtEmployeeId").val('');
    $("#txtBiometriccode").val('');
    $("#cboEmployeegroup").val('0');
    $("#cboEmployeegroup").selectpicker('refresh');
    $("#cboTitle").val('0');
    $("#cboTitle").selectpicker('refresh');
    $("#txtEmployeename").val('');
    $("#cboGender").val('0');
    $("#cboGender").selectpicker('refresh');
    $("#txtMobilenumber").val('');
    $("#txtEmailId").val('');
    $("#cboWorkStatus").val('0');
    $("#cboWorkStatus").selectpicker('refresh');
    $("#chkExemptedfromATT").parent().removeClass("is-checked");
    $("#cboEmployeeStatus").val('0');
    $("#cboEmployeeStatus").selectpicker('refresh');

    $('#Photoimage').val('');

    $('#imgPhotoimageblah').removeAttr('src');
    $('#txtDateofjoining').val('');
    $('#txtDateofconfirmation').val('');
    $('#txtDateofresignation').val('');
    $('#txtDateofrelieving').val('');
    $('#txtDateoftermination').val('');
    $('#txtTerminationReason').val('');
    $("#chkIsTerminated").parent().removeClass("is-checked");
}

function fnCloseEmployeeDetails() {
    fnClearFields();
    fnClearFieldsPersonal();
    fnGridRefreshEmployeeDetails();
    $("#divGrid").show();
    $("#divForm").css("display", "none");
}

function fnClearFieldsPersonal() {
    $("#txtpersonalinfodateofbirth").val('');
    $("#cboBloodgroup").val('0');
    $("#cboBloodgroup").selectpicker('refresh');
    $("#cboMothertongue").val('0');
    $("#cboMothertongue").selectpicker('refresh');
    $("#cboPermanentOrCurrent").val('0');
    $("#cboPermanentOrCurrent").selectpicker('refresh');
    $("#cboCountry").val('0');
    $("#cboCountry").selectpicker('refresh');
    $("#cboState").val('0');
    $("#cboState").selectpicker('refresh');
    $("#cboCity").val('0');
    $("#cboCity").selectpicker('refresh');
    $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
    $('#txtPincode').val('');
    $('#txtAddress').val('');
    $('#txtLandlinenumber').val('');
}

function fnFillEmployeePersonalValues() {
    if ($("#txtEmployeeNumber").val() !== '' && $("#txtEmployeeNumber").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + '/EmployeeExpat/GetEmployeePersonalInfo?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#cboPermanentOrCurrent").val(result.PermanentOrCurrent);
                $("#cboPermanentOrCurrent").selectpicker('refresh');
                $("#cboCountry").val(result.Country);
                $("#cboCountry").selectpicker('refresh');
                $("#cboState").val(result.State);
                $("#cboState").selectpicker('refresh');
                $("#cboCity").val(result.City);
                $("#cboCity").selectpicker('refresh');

                $("#txtPincode").val(result.Pincode);
                $("#txtAddress").val(result.Address);
                $("#txtLandlinenumber").val(result.LandLineNumber);

                if (result.Address != '' && result.ActiveStatus === true) {
                    $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
                }
                else if (result.Address != '' && result.ActiveStatus === false) {
                    $("#chkPersonalinfoActiveStatus").parent().removeClass("is-checked");
                }
                else {
                    $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
                }
            }
        });
    }
}

function fnPermanentOrCurrentChanges() {
    if ($("#txtEmployeeNumber").val() !== '' && $("#txtEmployeeNumber").val() !== undefined) {
        $("#cboCountry").val('0');
        $("#cboCountry").selectpicker('refresh');
        $("#cboState").val('0');
        $("#cboState").selectpicker('refresh');
        $("#cboCity").val('0');
        $("#cboCity").selectpicker('refresh');
        $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
        $('#txtPincode').val('');
        $('#txtAddress').val('');
        $('#txtLandlinenumber').val('');
        $.ajax({
            url: getBaseURL() + '/EmployeeExpat/GetAddressDetail?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val() + '&PermanentOrCurrent=' + $("#cboPermanentOrCurrent").val(),
            datatype: 'json',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#cboCountry").val(result.Country);
                $("#cboCountry").selectpicker('refresh');
                $("#cboState").val(result.State);
                $("#cboState").selectpicker('refresh');
                $("#cboCity").val(result.City);
                $("#cboCity").selectpicker('refresh');

                $("#txtPincode").val(result.Pincode);
                $("#txtAddress").val(result.Address);
                $("#txtLandlinenumber").val(result.LandLineNumber);

                if (result.Address != '' && result.ActiveStatus === true) {
                    $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
                }
                else if (result.Address != '' && result.ActiveStatus === false) {
                    $("#chkPersonalinfoActiveStatus").parent().removeClass("is-checked");
                }
                else {
                    $("#chkPersonalinfoActiveStatus").parent().addClass("is-checked");
                }
            }
        });
    }
}

function validateEmployeePersonal() {
    if ($("#txtEmployeeNumber").val().trim().length <= 0) {
        toastr.warning("Please enter the Employee Details Not Created");
        return false;
    }
    if ($("#cboPermanentOrCurrent").val() === "0" || $("#cboPermanentOrCurrent").val() === "") {
        toastr.warning("Please Select a Permanent Or Current");
        $('#cboPermanentOrCurrent').focus();
        return false;
    }
    if ($("#cboCountry").val() === "0" || $("#cboCountry").val() === "") {
        toastr.warning("Please Select a Country");
        $('#cboCountry').focus();
        return false;
    }
    if ($("#cboState").val() === "0" || $("#cboState").val() === "") {
        toastr.warning("Please Select a State");
        $('#cboState').focus();
        return false;
    }
    if ($("#cboCity").val() === "0" || $("#cboCity").val() === "") {
        toastr.warning("Please Select a City");
        $('#cboCity').focus();
        return false;
    }
    if ($("#txtPincode").val().trim().length <= 0) {
        toastr.warning("Please Enter the Pincode");
        $('#txtPincode').focus();
        return false;
    }
    if ($("#txtAddress").val().trim().length <= 0) {
        toastr.warning("Please Enter the Address");
        $('#txtAddress').focus();
        return false;
    }
}

function fnSaveEmployeePersonalInfo() {
    if (validateEmployeePersonal() === false) {
        return;
    }

    $("#btnSaveEmployeePersonalInfo").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveEmployeePersonalInfo").attr('disabled', true);

    var employeePersonal = {
        BusinessKey: $("#cboBusinessLocation").val(),
        EmployeeNumber: $("#txtEmployeeNumber").val(),
        DateOfBirth: $("#txtpersonalinfodateofbirth").val(),
        BloodGroup: $("#cboBloodgroup").val(),
        MotherTongue: $("#cboMothertongue").val(),
        PermanentOrCurrent: $("#cboPermanentOrCurrent").val(),
        Country: $("#cboCountry").val(),
        State: $("#cboState").val(),
        City: $("#cboCity").val(),
        Pincode: $("#txtPincode").val(),
        Address: $("#txtAddress").val(),
        LandLineNumber: $("#txtLandlinenumber").val(),
        ActiveStatus: $("#chkPersonalinfoActiveStatus").parent().hasClass("is-checked"),
    };

    $.ajax({
        async: false,
        url: getBaseURL() + '/EmployeeExpat/InsertOrUpdatePersonalInfo',
        type: 'POST',
        data: {
            obj: employeePersonal
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveEmployeePersonalInfo").html('Save');
            $("#btnSaveEmployeePersonalInfo").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveEmployeePersonalInfo").attr("disabled", false);
            $("#btnSaveEmployeePersonalInfo").html('Save');
        }
    });
}

function fnCloseEmployeeDetails() {
    fnClearFields();
    fnClearFieldsPersonal();
    fnGridRefreshEmployeeDetails();
    $("#divGrid").show();
    $("#divForm").css("display", "none");
}

function fnEmptySalaryBreakupGrid() {

    $("#jqgSalaryInfo").GridUnload();
    $("#jqgSalaryInfo").jqGrid({
        //url: getBaseURL() + '/EmployeeExpat/GetSalaryBreakup?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
        //datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Currency", "CurrencyDescription", "Amount", "TransferTo", "TransferToDescription", "Actions"],
        colModel: [
            { name: "PaymentByCurrency", width: 140, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "CurrencyDescription", width: 240, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "PaymentAmountBySalaryCurrency", width: 125, align: 'right', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "TransferTo", width: 125, align: 'left', editable: false, hidden: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "TransferToDescription", width: 150, align: 'left', editable: false, hidden: false, editoptions: { maxlength: 50 }, resizable: false },
            {
                name: 'edit', search: false, align: 'left', width: 190, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSalaryInfo(event);"><i class="fas fa-pen"></i>' + 'Edit' + '</button>' +
                        //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSalaryInfo(event,\'view\');"><i class="far fa-eye"></i>' + 'View' + '</button>'
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" onclick="return fnDeleteSalaryInfo(event);"><i class="fa fa-trash"></i>' + 'Delete' + '</button>'
                }
            },
        ],
        pager: "#jqpSalaryInfo",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
            //SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpSalaryInfo', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSalaryInfo', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSalaryInfo
    }).jqGrid('navButtonAdd', '#jqpSalaryInfo', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmpSalaryInfo
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgSalaryInfo"),
            newWidth = $grid.closest(".SalaryInfocontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnGridSalaryInfo() {
    fnFillSalaryInfo();

    $("#jqgSalaryInfo").GridUnload();
    $("#jqgSalaryInfo").jqGrid({
        url: getBaseURL() + '/EmployeeExpat/GetSalaryBreakup?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Currency to pay", "Currency to pay", "Amount in Salary Currency", "TransferTo", "Transfer To", "Actions"],
        colModel: [
            { name: "PaymentByCurrency", width: 200, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CurrencyDescription", width: 240, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "PaymentAmountBySalaryCurrency", width: 250, align: 'right', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "TransferTo", width: 125, align: 'left', editable: false, hidden: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "TransferToDescription", width: 150, align: 'left', editable: false, hidden: false, editoptions: { maxlength: 50 }, resizable: false },
            {
                name: 'edit', search: false, align: 'left', width: 190, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSalaryInfo(event);"><i class="fas fa-pen"></i>' + 'Edit' + '</button>' +
                        //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSalaryInfo(event,\'view\');"><i class="far fa-eye"></i>' + 'View' + '</button>'
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" onclick="return fnDeleteSalaryInfo(event);"><i class="fa fa-trash"></i>' + 'Delete' + '</button>'
                }
            },
        ],
        pager: "#jqpSalaryInfo",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
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
            //SetGridControlByAction();
           // fnSetGridwidth("jqgSalaryInfo");
        },
    }).jqGrid('navGrid', '#jqpSalaryInfo', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSalaryInfo', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSalaryInfo
    }).jqGrid('navButtonAdd', '#jqpSalaryInfo', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmpSalaryInfo
    });

    $(window).on("resize", function () {
      //  fnSetGridwidth("jqgSalaryInfo");
     });
    fnAddGridSerialNoHeading();
}

function fnFillSalaryInfo() {
    fnClearSalaryInfoFields();
    if ($("#txtEmployeeNumber").val() !== '' && $("#txtEmployeeNumber").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + '/EmployeeExpat/GetSalaryInfo?BusinessKey=' + $("#cboBusinessLocation").val() + '&EmployeeNumber=' + $("#txtEmployeeNumber").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#txtsalary").val(result.SalaryAmount);
                $("#cboSalaryCurrency").val(result.SalaryCurrency);
                $("#cboSalaryCurrency").selectpicker('refresh');
                if (result.IsIncentiveApplicable === true) {
                    $("#chkIncentiveApplicable").parent().addClass("is-checked");
                }
                else {
                    $("#chkIncentiveApplicable").parent().removeClass("is-checked");
                }
                if (result.IsBankChargeApplicable === true) {
                    $("#chkBankChargeApplicable").parent().addClass("is-checked");
                }
                else {
                    $("#chkBankChargeApplicable").parent().removeClass("is-checked");
                }
                if (result.IsNHIFApplicable === true) {
                    $("#chkNHIF").parent().addClass("is-checked");
                    $("#divNHIF").css('display', 'block')
                }
                else {
                    $("#chkNHIF").parent().removeClass("is-checked");
                    $("#divNHIF").css('display', 'none')
                }
                $("#txtNHIFPercentage").val(result.NHIFAmount);

                if (result.IsNSSFApplicable === true) {
                    $("#chkNSSF").parent().addClass("is-checked");
                    $("#divNSSF").css('display', 'block')
                }
                else {
                    $("#chkNSSF").parent().removeClass("is-checked");
                    $("#divNSSF").css('display', 'none')
                }
                $("#txtNSSFPercentage").val(result.NSSFAmount);
            }
        });
    }
}

function fnClearSalaryInfoFields() {
    $("#txtsalary").val('');
    $("#cboSalaryCurrency").val('0');
    $("#cboSalaryCurrency").selectpicker('refresh');
    $("#chkBankChargeApplicable").parent().removeClass("is-checked");
    $("#chkIncentiveApplicable").parent().removeClass("is-checked");
    $("#chkNHIF").parent().removeClass("is-checked");
    $("#divNHIF").css('display', 'none')
    $("#chkNSSF").parent().removeClass("is-checked");
    $("#divNSSF").css('display', 'none')
    $("#txtNHIFPercentage").val('');
    $("#txtNSSFPercentage").val('');

    $("#btnSaveSalaryInfo").attr("disabled", false);
    $("#btnSaveSalaryInfo").html("Save");
}