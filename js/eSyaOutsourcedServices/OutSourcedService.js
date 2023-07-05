var NodeID;
var prevSelectedID;

$(document).ready(function () {

    $('#cboBusinessLocation').selectpicker('refresh');

    $('#cboServiceGroup').selectpicker('refresh');
    $('#cboServiceClass').selectpicker('refresh');
    $('#cboService').selectpicker('refresh');

    $("#pnlMainMenu").hide();
    fnTreeSize();
    LoadOutSourcedServiceTree();
});
function fnBusinessLocation_onChange() {

    LoadOutSourcedServiceTree();
}
function fnDisableEnablDatePicker(){

    if ($("#cboOutSourcedStatus").val() === "P") {

        $("#txtEffectiveFrom").prop('disabled', true);
        $("#txtEffectiveFrom").val('');
        $("#txtEffectiveTill").prop('disabled', true);
        $("#txtEffectiveTill").val('');
    }
    else
    {
        $("#txtEffectiveFrom").prop('disabled', false);
        $("#txtEffectiveTill").prop('disabled', false);
    }
}
function fnLoadCboServiceClass() {
    $('#cboServiceClass').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/OutSourcedVendor/GetServiceClassbyGroupId?GroupId=' + $('#cboServiceGroup').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboServiceClass').empty();
            $("#cboServiceClass").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboServiceClass").append($("<option></option>").val(result[i]["ClassId"]).html(result[i]["ClassDesc"]));
                }
            }
            $('#cboServiceClass').val($("#cboServiceClass option:first").val());
            $('#cboServiceClass').selectpicker('refresh');
            fnLoadCboService();

        }
    });
}

function fnLoadCboService() {
    $('#cboService').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/OutSourcedVendor/GetServicebyClassId?ClassId=' + $('#cboServiceClass').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboService').empty();
            $("#cboService").append($("<option value='0'>Select </option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboService").append($("<option></option>").val(result[i]["ServiceId"]).html(result[i]["ServiceDesc"]));
                }
            }
            $('#cboService').val($("#cboService option:first").val());
            $('#cboService').selectpicker('refresh');

        }
    });
}

function LoadOutSourcedServiceTree() {
    $("#pnlMainMenu").hide();
    $.ajax({
        url: getBaseURL() + '/OutsourcedVendor/GetServicebyBusinessKeyforTreeView?Businesskey=' + $("#cboBusinessLocation").val(),

        success: function (result) {


            fnGetOutSourcedService_Success(result);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
}

function fnGetOutSourcedService_Success(dataArray) {

    $("#jstOutSourcedService").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    //for dropdown changed value need to refresh with new data
    $('#jstOutSourcedService').jstree(true).settings.core.data = dataArray;
    $('#jstOutSourcedService').jstree(true).refresh();
    //

    $("#jstOutSourcedService").on('loaded.jstree', function () {
        $("#jstOutSourcedService").jstree('open_all');
        $("#jstOutSourcedService").jstree()._open_to(prevSelectedID);
        $('#jstOutSourcedService').jstree().select_node(prevSelectedID);

    });

    $('#jstOutSourcedService').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMainMenu").hide();

                    if (data.node.parent == "#") {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#Add').on('click', function () {
                            //if (_userFormRole.IsInsert === false) {
                            //    $('#pnlMainMenu').hide();
                            //    toastr.warning(errorMsgCS["E003"]);
                            //    return;
                            //}
                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.AddOutSourcedService);
                            fnClearFields();
                            $("#btnSaveOutsourcedService").show();
                            $("input,textarea").attr('readonly', false);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#btnSaveOutsourcedService").html('<i class="fa fa-plus"></i> ' + localization.Save);
                            $("#cboService").prop("disabled", false);
                            $("#cboService").empty();
                            $("#cboService").append($("<option value='0'>Select </option>"));
                            $('#cboService').selectpicker('refresh');
                            $("#cboServiceClass").empty();
                            $("#cboServiceClass").append($("<option value='0'>Select </option>"));
                            $('#cboServiceClass').selectpicker('refresh');
                            $("#cboOutSourcedStatus").prop("disabled", false);
                            $("#cboOutSourcedStatus").val('0');
                            $("#cboOutSourcedStatus").selectpicker('refresh');

                            $("#txtEffectiveFrom").prop('disabled', false);
                            $("#txtEffectiveTill").prop('disabled', false);

                            $("#divServicegroup").show();
                            $("#divServiceclass").show();
                        });
                    }
                    else if (data.node.id.startsWith("FM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];

                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')



                        $('#View').on('click', function () {

                            //if (_userFormRole.IsView === false) {
                            //    $('#pnlMainMenu').hide();
                            //    toastr.warning(errorMsgCS["E001"]);
                            //    return;
                            //}

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.ViewOutSourcedService);
                            $('#txtServiceId').val(NodeID);
                            $("#cboService").prop("disabled", true);
                            $("#cboService").selectpicker('refresh');
                            $("#cboOutSourcedStatus").prop("disabled", true);
                            $("#cboOutSourcedStatus").selectpicker('refresh');
                            $("#txtEffectiveFrom").prop('disabled', true);
                            $("#txtEffectiveTill").prop('disabled', true);
                            fnFillOutSourcedServiceInfo();

                            $("#btnSaveOutsourcedService").hide();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', true);
                            $("#divServicegroup").hide();
                            $("#divServiceclass").hide();
                        });

                        $('#Edit').on('click', function () {
                            //if (_userFormRole.IsEdit === false) {
                            //    $('#pnlMainMenu').hide();
                            //    toastr.warning(errorMsgCS["E002"]);
                            //    return;
                            //}

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.EditOutSourcedService);
                            $('#txtServiceId').val(NodeID);
                            $("#cboService").prop("disabled", true);
                            $("#cboService").selectpicker('refresh');
                            $("#cboOutSourcedStatus").prop("disabled", false);
                            $("#cboOutSourcedStatus").selectpicker('refresh');
                            $("#txtEffectiveFrom").prop('disabled', false);
                            $("#txtEffectiveTill").prop('disabled', false);
                            fnFillOutSourcedServiceInfo();
                            $("#btnSaveOutsourcedService").show();
                            $("input,textarea").attr('readonly', false);
                            $("input[type=checkbox]").attr('disabled', false);

                            $("#btnSaveOutsourcedService").html('<i class="fa fa-sync"></i> ' + localization.Update);
                            $("#divServicegroup").hide();
                            $("#divServiceclass").hide();

                            //$("#btnSaveOutsourcedService").attr("disabled", _userFormRole.IsEdit === false);
                        });
                    }
                    else {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                }
            }
        }
    });

    $('#jstOutSourcedService').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstOutSourcedService').jstree().deselect_node(closingNode.children);
    });

};

function fnFillOutSourcedServiceInfo() {
    if ($("#txtServiceId").val() != '' && $("#txtServiceId").val() != undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/OutsourcedVendor/GetOutSourcedServiceInfo?Businesskey=" + $("#cboBusinessLocation").val() + "&ServiceId=" + $("#txtServiceId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $('#cboService').empty();
                $("#cboService").append($("<option></option>").val(result.ServiceId).html(result.ServiceName));
                $("#cboService").val($("#cboService option:last").val());
                $('#cboService').selectpicker('refresh');
                if (result.EffectiveFrom !== null) {
                    setDate($('#txtEffectiveFrom'), result.EffectiveFrom);
                }
                else {
                    $('#txtEffectiveFrom').val('');
                }
                if (result.EffectiveTill !== null) {
                    setDate($('#txtEffectiveTill'), result.EffectiveTill);
                }
                else {
                    $('#txtEffectiveTill').val('');
                }

                $("#cboOutSourcedStatus").val(result.OutsourcedStatus);
                $('#cboOutSourcedStatus').selectpicker('refresh');

                if ($("#cboOutSourcedStatus").val() === "P") {

                    $("#txtEffectiveFrom").prop('disabled', true);
                    $("#txtEffectiveFrom").val('');
                    $("#txtEffectiveTill").prop('disabled', true);
                    $("#txtEffectiveTill").val('');
                }
                else {
                    $("#txtEffectiveFrom").prop('disabled', false);
                    $("#txtEffectiveTill").prop('disabled', false);
                }


                if (result.ActiveStatus === true) {
                    $("#chkActivestatus").parent().addClass("is-checked");
                }
                else { $('#chkActivestatus').parent().removeClass("is-checked"); }
            }
        });
    }
}

function fnSaveOutSourcedService() {
    if (validateOutSourcedService() === false) {
        return;
    }
    $("#btnSaveOutsourcedService").attr('disabled', true);

    obj = {
        BusinessKey: $("#cboBusinessLocation").val(),
        ServiceId: $("#cboService").val(),
        OutsourcedStatus: $("#cboOutSourcedStatus").val(),
        EffectiveFrom: $("#txtEffectiveFrom").val(),
        EffectiveTill: $("#txtEffectiveTill").val(),
        ActiveStatus: $("#chkActivestatus").parent().hasClass("is-checked")
    };

    $.ajax({
        url: getBaseURL() + '/OutSourcedVendor/InsertOrUpdateOutSourcedService',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                location.reload();

                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveOutsourcedService").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveOutsourcedService").attr('disabled', false);
        }
    });
}

function validateOutSourcedService() {

    if ($("#cboService").val() === "0" || $("#cboService").val() === "") {
        toastr.warning("Please Select a Service");
        return false;
    }
    if ($("#cboOutSourcedStatus").val() === "0" || $("#cboService").val() === "") {
        toastr.warning("Please Select a Out Sourced Status");
        return false;
    }
    if (getDate($('#txtEffectiveTill')) < getDate($('#txtEffectiveFrom'))) {
        toastr.warning("Till Date can't be less than From Date.");
        return false;
    }

}

function fnClearFields() {

    $("#txtServiceId").val('');
    $("#txtEffectiveFrom").val('');
    $("#txtEffectiveTill").val('');
    $("#chkActivestatus").parent().addClass("is-checked");
    $("#btnSaveOutsourcedService").html('<i class="fa fa-plus"></i> Add');
}

function fnExpandAll() {
    $('#jstOutSourcedService').jstree('open_all');
}

function fnCollapseAll() {
    fnClearFields();
    $("#pnlMainMenu").hide();
    $('#jstOutSourcedService').jstree('close_all');
}

function fnTreeSize() {
    $("#jstOutSourcedService").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}