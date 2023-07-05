var prevSelectedID = '';

$(document).ready(function () {
    $("#btnDeleteNode").hide();
    $("#pnlWardMaster").hide();
    fnLoadWardMasterTree();
    //$("#btnDeleteNode").attr("disabled", _userFormRole.IsDelete === false);
    //$("#btnSaveWardMaster").attr("disabled", _userFormRole.IsInsert === false);
});

function fnLoadWardMasterTree() {
    $.ajax({
        url: getBaseURL() + '/WardServices/GetWardMasterList',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstWardMaster").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });

    $("#jstWardMaster").on('loaded.jstree', function () {
        $("#jstWardMaster").jstree()._open_to(prevSelectedID);
        $('#jstWardMaster').jstree().select_node(prevSelectedID);
    });

    $('#jstWardMaster').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlWardMaster").hide();

                var parentNode = $("#jstWardMaster").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode === "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#pnlWardMaster').hide();
                            toastr.warning(errorMsgCS["E006"]);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.AddWardDetails);
                        $("#txtWardId").val('0');
                        $("#txtWardDescription").val('');
                        $("#txtWardShortDescription").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        //$("#btnSaveWardMaster").html("<i class='fa fa-plus'></i>" + localization.Save);
                        $("#btnSaveWardMaster").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveWardMaster").show();
                        $("#pnlWardMaster").show();
                        $("#txtWardDescription").prop("disabled", false);
                        $("#txtWardShortDescription").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else if (parentNode === "WM") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlWardMaster').hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.ViewWardDetails);
                        $("#btnSaveWardMaster").hide();
                        $("#pnlWardMaster").show();
                        $("#txtWardId").val(data.node.id);
                        $("#txtWardDescription").prop("disabled", true);
                        $("#txtWardShortDescription").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);
                        fnFillWardMasterDetail(data.node.id);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlWardMaster').hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.EditWardDetails);
                        //$("#btnSaveWardMaster").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSaveWardMaster").html('<i class="fa fa-save"></i> ' + localization.Update);
                        $("#btnSaveWardMaster").show();
                        $("#pnlWardMaster").show();
                        $("#txtWardId").val(data.node.id);
                        $("#txtWardDescription").prop("disabled", false);
                        $("#txtWardShortDescription").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                        fnFillWardMasterDetail(data.node.id);
                    });
                }
                else {
                    fnClearFields();
                    $("#pnlWardMaster").hide();
                }
            }
        }
    });

    $('#jstWardMaster').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstWardMaster').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#divJstWardMaster");
}

function fnFillWardMasterDetail(wardID) {
    $.ajax({
        url: getBaseURL() + '/WardServices/GetWardMasterByID',
        data: {
            wardId: wardID
        },
        success: function (result) {
            $("#txtWardDescription").val(result.WardDesc);
            $("#txtWardShortDescription").val(result.WardShortDesc);
            if (result.ActiveStatus === true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}

function fnSaveWardMaster() {
    if (IsStringNullorEmpty($("#txtWardDescription").val())) {
        toastr.error("Please enter the Ward Description");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtWardShortDescription").val())) {
        toastr.error("Please enter the Ward Short Description");
        return false;
    }
    else {
        $("#btnSaveWardMaster").attr("disabled", true);

        var URL = getBaseURL() + '/WardServices/InsertIntoWardMaster';
        if (!IsStringNullorEmpty($("#txtWardId").val()) && $("#txtWardId").val() !== "0")
            URL = getBaseURL() + '/WardServices/UpdateWardMaster';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: {
                WardId: $("#txtWardId").val(),
                WardDesc: $("#txtWardDescription").val(),
                WardShortDesc: $("#txtWardShortDescription").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnClearFields();
                    $("#jstWardMaster").jstree("destroy");
                    fnLoadWardMasterTree();
                    $("#pnlWardMaster").hide();
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSaveWardMaster").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSaveWardMaster").attr("disabled", false);
            }
        });
    }
}

function fnClearFields() {
    $("#txtWardId").val('0');
    $("#txtWardDescription").val('');
    $("#txtWardShortDescription").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
}

function fnExpandAll() {
    $("#pnlWardMaster").hide();
    $('#jstWardMaster').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlWardMaster").hide();
    $('#jstWardMaster').jstree('close_all');
}

function fnDeleteNode() {
    
}

function fnTreeSize() {
    $("#jstWardMaster").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}