var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnTreeSize();
    fnLoadSpecialtyCode();
    $('#chkActiveStatus').parent().addClass("is-checked");
});

function fnLoadSpecialtyCode() {

    $.ajax({
        url: getBaseURL() + '/Facilities/Specialty/GetSpecialtyTree',
        success: function (result) {
            $('#jstSpecialtyCode').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': false }
            });
        }
    });

    $("#jstSpecialtyCode").on('loaded.jstree', function () {
        $("#jstSpecialtyCode").jstree('open_all');
    });

    $('#jstSpecialtyCode').on("changed.jstree", function (e, data) {

        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlMainMenu").hide();

                if (data.node.parent === "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#Add').on('click', function () {
                        $(".mdl-card__title-text").text(localization.AddSpecialty);
                        fnClearFields();
                        fnSetControlStatus(false);
                        $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Add);
                        $("#btnSaveSpecialty").attr("disabled", _userFormRole.IsInsert === false);
                        $("#pnlMainMenu").show();
                        $("#btnSaveSpecialty").show();
                    });
                }
                else if (data.node.parent === "H0") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlMainMenu').hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.ViewSpecialty);
                        $("#btnSaveSpecialty").hide();
                        fnSetControlStatus(true);
                        fnShowSpecialtyDetail(data.node.id);
                        $("#pnlMainMenu").show();
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlMainMenu').hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        $("#btnSaveSpecialty").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $(".mdl-card__title-text").text(localization.EditSpecialty);
                        $("#btnSaveSpecialty").show();
                        fnSetControlStatus(false);
                        fnShowSpecialtyDetail(data.node.id);
                        $("#pnlMainMenu").show();
                    });
                }
                else {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
            }
        }
    });
}

function fnShowSpecialtyDetail(specialtyId) {

    $.ajax({
        url: getBaseURL() + '/Facilities/Specialty/GetSpecialtyCode?specialtyId=' + specialtyId,
        type: 'POST',
        datatype: 'json',
        success: function (response) {

            if (response !== null) {
                $('#txtSpecialtyId').val(response.SpecialtyID);
                $('#txtSpecialtyDesc').val(response.SpecialtyDesc);
                $('#cboGender').val(response.Gender);
                $('#cboGender').selectpicker('refresh');
                $('#cboSpecialtyType').val(response.SpecialtyType);
                $('#cboSpecialtyType').selectpicker('refresh');
                $('#cboAliedServices').val(response.AlliedServices);
                $('#cboAliedServices').selectpicker('refresh');
                if (response.ActiveStatus === true)
                    $('#chkActiveStatus').parent().addClass("is-checked");
                else
                    $('#chkActiveStatus').parent().removeClass("is-checked");
            }
            else {
                fnClearFields();
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

function fnDeleteNode() {

    var selectedNode = $('#jstSpecialtyCode').jstree().get_selected(true);
    
    if (selectedNode.length !== 1) {
        toastr.warning('Please select any one Specialty Code.');
    }
    else {
        selectedNode = selectedNode[0];
        if (selectedNode.id === "H0") {
            toastr.warning('Please select any one Specialty Code.');
        }
        else if (selectedNode.parent === "H0") {
    
            var obj = {};

            obj.SpecialtyId = selectedNode.id;
            obj.ActiveStatus = false;

            $("#btnDeleteNode").attr("disabled", true);
            $.ajax({
                url: getBaseURL() + '/Facilities/Specialty/DeleteSpecialtyCodes',
                type: 'POST',
                datatype: 'json',
                data: obj,
                async: false,
                success: function (response) {
                    if (response.Status === true) {
                        toastr.success("Deleted");
                        $("#jstSpecialtyCode").jstree("destroy");
                        fnLoadSpecialtyCode();
                        fnClearFields();
                        //$('#pnlMainMenu').hide();
                    }
                    else {
                        toastr.error(response.Message);
                    }
                    $("#btnDeleteNode").attr("disabled", false);
                },
                error: function (error) {
                    toastr.error(error.statusText);
                    $("#btnDeleteNode").attr("disabled", false);
                }
            });
        }
        else {
            toastr.warning('Please select Specialty Code to Delete');
        }
    }
}

function fnExpandAll() {
    $('#jstSpecialtyCode').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstSpecialtyCode').jstree('close_all');
}

function fnTreeSize() {
    $("#jstSpecialtyCode").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnSaveSpecialtyCodes() {

    if (fnValidateBeforeSave() === false)
        return;

    $("#btnSaveSpecialty").attr('disabled', true);

    var obj =
    {
        SpecialtyID: $('#txtSpecialtyId').val(),
        SpecialtyDesc: $('#txtSpecialtyDesc').val(),
        Gender: $('#cboGender').val(),
        SpecialtyType: $('#cboSpecialtyType').val(),
        AlliedServices: $('#cboAliedServices').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    };
    
    var URL;
    if ($('#txtSpecialtyId').val() !== "")
        URL = getBaseURL() + '/Facilities/Specialty/UpdateSpecialtyCodes';
    else
        URL = getBaseURL() + '/Facilities/Specialty/InsertSpecialtyCodes';

    //$("#btnSaveSpecialty").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
    $("#btnSaveSpecialty").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: obj,
        //contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#pnlMainMenu").hide();
                    $('#jstSpecialtyCode').jstree("destroy");
                    fnLoadSpecialtyCode();
                    fnClearFields();
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveSpecialty").attr('disabled', false);
                }

                $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Add);
                $("#btnSaveSpecialty").attr('disabled', false);
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveSpecialty").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveSpecialty").attr("disabled", false);
            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Add);
        }
    });
    $("#btnSaveSpecialty").attr('disabled', false);
}

function fnClearFields() {
    $('#txtSpecialtyId').val('');
    $('#txtSpecialtyDesc').val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
}

function fnSetControlStatus(isdisabled) {
    $("#txtSpecialtyDesc").prop("disabled", isdisabled);
    $("#cboGender").prop("disabled", isdisabled);
    $('#cboGender').selectpicker('refresh');
    $("#cboSpecialtyType").prop("disabled", isdisabled);
    $('#cboSpecialtyType').selectpicker('refresh');
    $("#cboAliedServices").prop("disabled", isdisabled);
    $('#cboAliedServices').selectpicker('refresh');
    $("#chkActiveStatus").prop("disabled", isdisabled);
}

function fnValidateBeforeSave() {

    if ($('#txtSpecialtyDesc').val() === "" || $('#txtSpecialtyDesc').val() === null) {
        toastr.warning("Please Enter the Specialty Description");
        $('#txtSpecialtyDesc').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboGender').val())) {
        toastr.warning("Please select a gender");
        $('#cboGender').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboSpecialtyType').val())) {
        toastr.warning("Please select a  Specialty Type");
        $('#cboSpecialtyType').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboAliedServices').val())) {
        toastr.warning("Please select a  Allied Services Type");
        $('#cboAliedServices').focus();
        return false;
    }
    if ($('#txtSpecialtyId').val() === "" && $('#chkActiveStatus').parent().hasClass("is-checked") === false) {
        toastr.warning("Please select a Status");
        $('#chkActiveStatus').focus();
        return false;
    }
    return true;
}