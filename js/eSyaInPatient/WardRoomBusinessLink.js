var prevSelectedID = '';
var actionValue = "";

$(document).ready(function () {
    $("#btnDeleteNode").hide();
    $("#pnlWRBusinessLink").hide();
    fnTreeSize();
    fnLoadWRBusinessLinkTree();
    //$("#btnDeleteNode").attr("disabled", _userFormRole.IsDelete === false);
    //$("#btnSaveWRBuisnessLink").attr("disabled", _userFormRole.IsInsert === false);
});

function fnLoadWRBusinessLinkTree() {
    $.ajax({
        url: getBaseURL() + '/WardServices/GetActiveWardMasterList',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstWRBusinessLink").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            alert(error.statusText);
        }
    });

    $("#jstWRBusinessLink").on('loaded.jstree', function () {
        $("#jstWRBusinessLink").jstree()._open_to(prevSelectedID);
        $('#jstWRBusinessLink').jstree().select_node(prevSelectedID);
    });

    $('#jstWRBusinessLink').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlWRBusinessLink").hide();

                var parentNode = $("#jstWRBusinessLink").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                //if (parentNode === "#") {
                //}
                // If Child node is selected
                if (parentNode === "WM") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#pnlWRBusinessLink').hide();
                            toastr.warning(errorMsgCS["E006"]);
                            return;
                        }
                        if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
                            toastr.error("Please select Business Location");
                            return;
                        }
                        //$("#pnlWRBusinessLinkHeading.mdl-card__title-text").text(localization.AddServiceType);
                        $(".mdl-card__title-text").text(localization.AddWardRoomBusinessLink);
                        actionValue = "I";
                        fnClearFields();
                        $("#txtWardId").val(data.node.id);
                        $('#txtWard').val(data.node.text);
                        //$("#btnSaveWRBuisnessLink").html("<i class='fa fa-plus'></i>" + localization.Save);
                        $("#btnSaveWRBuisnessLink").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveWRBuisnessLink").show();
                        $("#pnlWRBusinessLink").show();
                        fnSetControlDisable(false);
                    });

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlWRBusinessLink').hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }
                        if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
                            toastr.error("Please select Business Location");
                            return;
                        }
                        //$("#pnlWRBusinessLinkHeading.mdl-card__title-text").text(localization.ViewServiceType);
                        $(".mdl-card__title-text").text(localization.ViewWardRoomBusinessLink);
                        $("#btnSaveWRBuisnessLink").hide();
                        $("#pnlWRBusinessLink").show();
                        actionValue = "V";
                        fnClearFields();
                        $("#txtWardId").val(data.node.id);
                        $('#txtWard').val(data.node.text);
                        fnSetControlDisable(true);
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlWRBusinessLink').hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
                            toastr.error("Please select Business Location");
                            return;
                        }
                        //$("#pnlWRBusinessLinkHeading.mdl-card__title-text").text(localization.EditServiceType);
                        $(".mdl-card__title-text").text(localization.EditWardRoomBusinessLink);
                        //$("#btnSaveWardMaster").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSaveWRBuisnessLink").html('<i class="fa fa-save"></i> ' + localization.Update);
                        $("#btnSaveWRBuisnessLink").show();
                        $("#pnlWRBusinessLink").show();
                        actionValue = "E";
                        fnClearFields();
                        $("#txtWardId").val(data.node.id);
                        $('#txtWard').val(data.node.text);
                        fnSetControlDisable(false);
                    });
                }
                else {
                    fnClearFields();
                    $("#pnlWRBusinessLink").hide();
                }
            }
        }
    });

    $('#jstWRBusinessLink').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstWRBusinessLink').jstree().deselect_node(closingNode.children);
    });
}

function fnFillWRBusinessLinkDetail() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || IsStringNullorEmpty($("#txtWardId").val()) || IsStringNullorEmpty($("#cboRoom").val()) || $("#txtWardId").val() === "0")
        return;

    $.ajax({
        url: getBaseURL() + '/WardServices/GetWardRoomBusinessByBkWrRmId',
        data: {
            businessKey: $("#cboBusinessLocation").val(),
            wardId: $("#txtWardId").val(),
            roomId: $("#cboRoom").val()
        },
        success: function (result) {
            $("#txtNoofBed").val(result.NoOfBeds);
            $("#txtOccupiedBeds").val(result.OccupiedBeds);
            $("#txtConsignmentPerc").val(result.ConsignmentMarkupPerc);
            if (result.ActiveStatus === false)
                $('#chkActiveStatus').parent().removeClass("is-checked");
            else
                $('#chkActiveStatus').parent().addClass("is-checked");
        }
    });
}

function fnSaveWRBusinessLink() {

    if (IsStringNullorEmpty($("#txtOccupiedBeds").val()))
        $("#txtOccupiedBeds").val(0);
    if (IsStringNullorEmpty($("#txtConsignmentPerc").val()))
        $("#txtConsignmentPerc").val(0);
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.error("Please select Business Location.");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtWardId").val())) {
        toastr.error("Please select Ward.");
        return false;
    }
    else if (IsStringNullorEmpty($("#cboRoom").val())) {
        toastr.error("Please select Room Description.");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtNoofBed").val())) {
        toastr.error("Please select Number of beds.");
        return false;
    }
    else {
        $("#btnSaveWRBuisnessLink").attr("disabled", true);

        var URL = getBaseURL() + '/WardServices/InsertIntoWardRoomBusinessLink';
        if (!IsStringNullorEmpty(actionValue) && actionValue === "E")
            URL = getBaseURL() + '/WardServices/UpdateWardRoomBusinessLink';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: {
                BusinessKey: $("#cboBusinessLocation").val(),
                WardId: $("#txtWardId").val(),
                RoomId: $("#cboRoom").val(),
                NoOfBeds: $("#txtNoofBed").val(),
                OccupiedBeds: $("#txtOccupiedBeds").val(),
                ConsignmentMarkupPerc: $("#txtConsignmentPerc").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnClearFields();
                    $("#jstWRBusinessLink").jstree("destroy");
                    prevSelectedID = '';
                    fnLoadWRBusinessLinkTree();
                    $("#pnlWRBusinessLink").hide();
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSaveWRBuisnessLink").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSaveWRBuisnessLink").attr("disabled", false);
            }
        });
    }
}

function fnSetControlDisable(value) {
    //$("#cboRoom").prop("disabled", value);
    $("#txtNoofBed").prop("disabled", value);
    $("#txtOccupiedBeds").prop("disabled", value);
    $("#txtConsignmentPerc").prop("disabled", value);
    $("#chkActiveStatus").prop("disabled", value);
}

function fnClearFields() {
    $("#txtWardId").val('0');
    $('#txtWard').val('');
    $('#cboRoom').val('');
    $('#cboRoom').selectpicker('refresh');
    $("#txtNoofBed").val('');
    $("#txtOccupiedBeds").val('0');
    $("#txtConsignmentPerc").val('0');
    $('#chkActiveStatus').parent().addClass("is-checked");
}

function fnExpandAll() {
    $("#pnlWRBusinessLink").hide();
    $('#jstWRBusinessLink').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlWRBusinessLink").hide();
    $('#jstWRBusinessLink').jstree('close_all');
}

function fnDeleteNode() {

}

function fnTreeSize() {
    $("#jstWRBusinessLink").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}