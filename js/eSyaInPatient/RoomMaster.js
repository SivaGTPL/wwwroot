var prevSelectedID = '';

$(document).ready(function () {
    $("#btnDeleteNode").hide();
    $("#pnlRoomMaster").hide();
    fnTreeSize();
    fnLoadRoomMasterTree();
    //$("#btnDeleteNode").attr("disabled", _userFormRole.IsDelete === false);
    //$("#btnSaveRoomMaster").attr("disabled", _userFormRole.IsInsert === false);
});

function fnLoadRoomMasterTree() {
    $.ajax({
        url: getBaseURL() + '/WardServices/GetRoomMasterList',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstRoomMaster").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            alert(error.statusText);
        }
    });

    $("#jstRoomMaster").on('loaded.jstree', function () {
        $("#jstRoomMaster").jstree()._open_to(prevSelectedID);
        $('#jstRoomMaster').jstree().select_node(prevSelectedID);
    });

    $('#jstRoomMaster').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlRoomMaster").hide();

                var parentNode = $("#jstRoomMaster").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode === "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#pnlRoomMaster').hide();
                            toastr.warning(errorMsgCS["E006"]);
                            return;
                        }
                        //$("#pnlRoomMasterHeading.mdl-card__title-text").text(localization.AddServiceType);
                        $(".mdl-card__title-text").text(localization.AddRoomDetails);
                        $("#txtRoomId").val('0');
                        $("#txtRoomDescription").val('');
                        $("#txtRoomShortDescription").val('');
                        $('#cboGender').val('M');
                        $('#cboGender').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        //$("#btnSaveRoomMaster").html("<i class='fa fa-plus'></i>" + localization.Save);
                        $("#btnSaveRoomMaster").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveRoomMaster").show();
                        $("#pnlRoomMaster").show();
                        $("#txtRoomDescription").prop("disabled", false);
                        $("#txtRoomShortDescription").prop("disabled", false);
                        $("#cboGender").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else if (parentNode === "RM") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlRoomMaster').hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }
                        //$("#pnlRoomMasterHeading.mdl-card__title-text").text(localization.ViewServiceType);
                        $(".mdl-card__title-text").text(localization.ViewRoomDetails);
                        $("#btnSaveRoomMaster").hide();
                        $("#pnlRoomMaster").show();
                        $("#txtRoomId").val(data.node.id);
                        $("#txtRoomDescription").prop("disabled", true);
                        $("#txtRoomShortDescription").prop("disabled", true);
                        $("#cboGender").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);
                        fnFillRoomMasterDetail(data.node.id);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlRoomMaster').hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        //$("#pnlRoomMasterHeading.mdl-card__title-text").text(localization.EditServiceType);
                        $(".mdl-card__title-text").text(localization.EditRoomDetails);
                        //$("#btnSaveWardMaster").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSaveRoomMaster").html('<i class="fa fa-save"></i> ' + localization.Update);
                        $("#btnSaveRoomMaster").show();
                        $("#pnlRoomMaster").show();
                        $("#txtRoomId").val(data.node.id);
                        $("#txtRoomDescription").prop("disabled", false);
                        $("#txtRoomShortDescription").prop("disabled", false);
                        $("#cboGender").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                        fnFillRoomMasterDetail(data.node.id);
                    });
                }
                else {
                    fnClearFields();
                    $("#pnlRoomMaster").hide();
                }
            }
        }
    });

    $('#jstRoomMaster').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstRoomMaster').jstree().deselect_node(closingNode.children);
    });
}

function fnFillRoomMasterDetail(roomID) {
    $.ajax({
        url: getBaseURL() + '/WardServices/GetRoomMasterById',
        data: {
            roomId: roomID
        },
        success: function (result) {
            $("#txtRoomDescription").val(result.RoomDesc);
            $("#txtRoomShortDescription").val(result.RoomShortDesc);
            $("#cboGender").val(result.Gender);
            $('#cboGender').selectpicker('refresh');
            if (result.ActiveStatus === true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}

function fnSaveRoomMaster() {
    if (IsStringNullorEmpty($("#txtRoomDescription").val())) {
        toastr.warning("Please enter the Room Description");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtRoomShortDescription").val())) {
        toastr.warning("Please enter the Room Short Description");
        return false;
    }
    else {
        $("#btnSaveRoomMaster").attr("disabled", true);

        var URL = getBaseURL() + '/WardServices/InsertIntoRoomMaster';
        if (!IsStringNullorEmpty($("#txtRoomId").val()) && $("#txtRoomId").val() !== "0")
            URL = getBaseURL() + '/WardServices/UpdateRoomMaster';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: {
                RoomId: $("#txtRoomId").val(),
                Gender: $("#cboGender").val(),
                RoomShortDesc: $("#txtRoomShortDescription").val(),
                RoomDesc: $("#txtRoomDescription").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnClearFields();
                    $("#jstRoomMaster").jstree("destroy");
                    fnLoadRoomMasterTree();
                    $("#pnlRoomMaster").hide();
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSaveRoomMaster").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSaveRoomMaster").attr("disabled", false);
            }
        });
    }
}

function fnClearFields() {
    $("#txtRoomId").val('0');
    $("#txtRoomDescription").val('');
    $("#txtRoomShortDescription").val('');
    $('#cboGender').val('M');
    $('#cboGender').selectpicker('refresh');
    $('#chkActiveStatus').parent().addClass("is-checked");
}

function fnExpandAll() {
    $("#pnlRoomMaster").hide();
    $('#jstRoomMaster').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlRoomMaster").hide();
    $('#jstRoomMaster').jstree('close_all');
}

function fnDeleteNode() {

}

function fnTreeSize() {
    $("#jstRoomMaster").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}