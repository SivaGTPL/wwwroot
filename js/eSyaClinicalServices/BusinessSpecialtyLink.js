﻿var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnTreeSize();
});

function fnLoadSpecialtyLink() {
    $("#pnlMainMenu").hide();
    $('#jstSpecialtyClinicLink').jstree('destroy');
    if ($('#cboBusinessKey').val() === '')
        return;
    fnCreateSpecialtyTree();
}

function fnCreateSpecialtyTree() {

    $.ajax({
        url: getBaseURL() + '/Specialty/GetSpecialtyLinkTree?businessKey=' + $('#cboBusinessKey').val(),
        success: function (result) {

            $('#jstSpecialtyClinicLink').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true }
            });
        }
    });

    $("#jstSpecialtyClinicLink").on('loaded.jstree', function () {
        $("#jstSpecialtyClinicLink").jstree('open_all');
    });

    $('#jstSpecialtyClinicLink').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlMainMenu").hide();

                if (data.node.parent === "#") {
                    if (data.node.id.startsWith("N")) {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                        $('#Add').on('click', function () {
                            fnClearFields();
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.AddSpecialtyLink);
                            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
                            $("#btnSaveSpecialty").attr("disabled", _userFormRole.IsInsert === false);
                            $("#pnlMainMenu").show();
                            $("#btnSaveSpecialty").show();
                        });
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E004"]);
                                return;
                            }
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.ViewSpecialtyLink);
                            $("#btnSaveSpecialty").hide();
                            $("#pnlMainMenu").show();
                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E005"]);
                                return;
                            }
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.EditSpecialtyLink);
                            $("#btnSaveSpecialty").html('<i class="fa fa-sync"></i> ' + localization.Update);
                            $("#btnSaveSpecialty").attr("disabled", _userFormRole.IsEdit === false);
                            $("#pnlMainMenu").show();
                            $("#btnSaveSpecialty").show();
                        });
                    }
                }
                else {
                    $("#pnlMainMenu").hide();
                    fnClearFields();
                }
            }
        }
    });
}

function fnTreeSize() {
    $("#jstSpecialtyClinicLink").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnSpecialtyParameter(specialtyId) {

    fnFillSpecialtyDetail(specialtyId);
    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/Specialty/GetSpecialtyParameter?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + specialtyId,
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response !== null) {
                eSyaParams.SetJSONValue(response);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
    /*
    $("#jqgSpecialtyClinic").jqGrid('GridUnload');
    $("#jqgSpecialtyClinic").jqGrid({
        url: getBaseURL() + '/Specialty/GetSpecialtyClinicLink?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + specialtyId,
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        //jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Clinic ID", localization.Clinic, localization.Status],
        colModel: [
            { name: 'ClinicID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ClinicDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", editoptions: { value: "true:false" }, formatoptions: { disabled: false } }
        ],
        caption: "",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true
        //url:null
    });*/
 }

function fnFillSpecialtyDetail(specialtyId) {

    $.ajax({
        url: getBaseURL() + '/Specialty/GetSpecialtyCode?specialtyId=' + specialtyId,
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

function fnSaveSpecialtyClinicLink() {

    var obj =
    {
        BusinessKey: $('#cboBusinessKey').val(),
        SpecialtyID: $('#txtSpecialtyId').val(),
        ActiveStatus: true
    };

    var objPar = eSyaParams.GetJSONValue();

    var specialtyId = $('#txtSpecialtyId').val();
    var businessKey = $('#cboBusinessKey').val();
    $("#btnSaveSpecialty").attr('disabled', true);
    var URL;
    URL = getBaseURL() + '/Specialty/InsertSpecialtyBusinessLinkList';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj, objPar, specialtyId, businessKey },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#pnlMainMenu").hide();
                //$("#btnSaveSpecialty").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
                $("#btnSaveSpecialty").attr('disabled', false);
                $('#jstSpecialtyClinicLink').jstree('destroy');
                fnCreateSpecialtyTree();
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveSpecialty").attr('disabled', false);
            }

            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
            $("#btnSaveSpecialty").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveSpecialty").attr("disabled", false);
            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
        }
    });
}

function fnClearFields() {
    eSyaParams.ClearValue();
}