﻿var ServiceTypeID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadServiceTypeTree()
    $('#chkSTActiveStatus').parent().addClass("is-checked");
    $("#btnSTAdd").attr("disabled", _userFormRole.IsInsert === false);
    // $("#btnDelete").attr("disabled", _userFormRole.IsDelete === false);

});
function fnLoadServiceTypeTree() {
    $.ajax({
        url: getBaseURL() + '/Services/GetServiceTypes',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ServiceTypeTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ServiceTypeTree");
            $(window).on('resize', function () {
                fnTreeSize("#ServiceTypeTree");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });

    $("#ServiceTypeTree").on('loaded.jstree', function () {
        $("#ServiceTypeTree").jstree()._open_to(prevSelectedID);
        $('#ServiceTypeTree').jstree().select_node(prevSelectedID);
    });

    $('#ServiceTypeTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceType").hide();
                //$(".divTreeActions").hide();
                var parentNode = $("#ServiceTypeTree").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {

                        if (_userFormRole.IsInsert === false) {
                            // $('#dvServiceType').hide();
                            toastr.warning(errorMsgCS["E003"]);
                            return;
                        }

                        $("#pnlAddServiceType .mdl-card__title-text").text(localization.AddServiceType);
                        $("#txtServiceTypeDesc").val('');
                        $('#chkSTActiveStatus').parent().addClass("is-checked");
                        $("#btnSTAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSTAdd").show();
                        $("#dvServiceType").show();
                        //$(".divTreeActions").show();
                        ServiceTypeID = "0";
                        $("#txtServiceTypeDesc").prop("disabled", false);
                        $("#chkSTActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else if (parentNode == "ST") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvItemGroup').hide();
                            toastr.warning(errorMsgCS["E001"]);
                            return;
                        }
                        $("#pnlAddServiceType .mdl-card__title-text").text(localization.ViewServiceType);
                        $("#btnSTAdd").hide();
                        $("#dvServiceType").show();
                        $(".divTreeActions").show();
                        ServiceTypeID = data.node.id;
                        $("#txtServiceTypeDesc").prop("disabled", true);
                        $("#chkSTActiveStatus").prop("disabled", true);
                        fnFillServiceTypeDetail(ServiceTypeID);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvItemGroup').hide();
                            toastr.warning(errorMsgCS["E002"]);
                            return;
                        }
                        $("#pnlAddServiceType .mdl-card__title-text").text(localization.EditServiceType);
                        $("#btnSTAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSTAdd").show();
                        $("#dvServiceType").show();
                        $(".divTreeActions").show();
                        ServiceTypeID = data.node.id;
                        $("#txtServiceTypeDesc").prop("disabled", false);
                        $("#chkSTActiveStatus").prop("disabled", false);
                        fnFillServiceTypeDetail(ServiceTypeID);

                    });



                }
                else {
                    $("#dvServiceType").hide();
                    // $(".divTreeActions").hide();
                }

            }
        }
    });
    $('#ItemGrouServiceTypeTreepTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ServiceTypeTree').jstree().deselect_node(closingNode.children);
    });
}
function fnFillServiceTypeDetail(ServiceTypeID) {
    $.ajax({
        url: getBaseURL() + '/Services/GetServiceTypeByID',
        data: {
            ServiceTypeID: ServiceTypeID
        },
        success: function (result) {
            $("#txtServiceTypeDesc").val(result.ServiceTypeDesc);
            if (result.ActiveStatus == true)
                $('#chkSTActiveStatus').parent().addClass("is-checked");
            else
                $('#chkSTActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateServiceType() {
    var txtServiceTypeDesc = $("#txtServiceTypeDesc").val()
    if (txtServiceTypeDesc == "" || txtServiceTypeDesc == null || txtServiceTypeDesc == undefined) {
        toastr.error("Please enter the Service Type Description");
        return false;
    }
    else {
        $("#btnSTAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Services/AddOrUpdateServiceType',
            type: 'POST',
            datatype: 'json',
            data: {
                ServiceTypeID: ServiceTypeID,
                ServiceTypeDesc: $("#txtServiceTypeDesc").val(),
                ActiveStatus: $("#chkSTActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceTypeID == 0) {
                        toastr.success("Service Type Added");
                        $("#txtServiceTypeDesc").val('');
                        $('#chkSTActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        toastr.success("Service Type Updated");
                    }
                    $("#ServiceTypeTree").jstree("destroy");
                    fnLoadServiceTypeTree();

                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSTAdd").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSTAdd").attr("disabled", false);
            }
        });
    }
}
function fnMoveItemUpDown(updown) {
    var isMoveUp = false, isMoveDown = false;
    var str;
    if (updown === "U") {
        isMoveUp = true;
        str = ' up';
    }
    else if (updown === "D") {
        isMoveDown = true;
        str = ' down';
    }
    var selectedNode = $('#ServiceTypeTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        toastr.warning('Please select a Service Type to move.');
    }
    else {
        selectedNode = selectedNode[0];
        var data = {};
        data.isMoveUp = isMoveUp;
        data.isMoveDown = isMoveDown;
        data.ServiceTypeId = selectedNode.id;
        $("#btnMoveUp").attr("disabled", true);
        $("#btnMoveDown").attr("disabled", true);
        if (confirm(localization.Doyouwanttomovenode + selectedNode.text + str + ' ?')) {

            $.ajax({
                url: getBaseURL() + '/Services/UpdateServiceTypeIndex',
                type: 'POST',
                datatype: 'json',
                data: data,
                success: function (response) {
                    if (response.Status === true) {
                        toastr.success("Moved");
                        $("#ServiceTypeTree").jstree("destroy");
                        fnLoadServiceTypeTree();
                    }
                    else {
                        toastr.error(response.Message);
                    }
                    $("#btnMoveUp").attr("disabled", false);
                    $("#btnMoveDown").attr("disabled", false);
                },
                error: function (error) {
                    toastr.error(error.statusText);
                    $("#btnMoveUp").attr("disabled", false);
                    $("#btnMoveDown").attr("disabled", false);
                }
            });
        }
    }
}
function fnDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        toastr.warning(errorMsgCS["E004"]);
        return;
    }

    var selectedNode = $('#ServiceTypeTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        toastr.warning('Please select a Service Type to delete.');
    }
    else {
        selectedNode = selectedNode[0];
        var data = {};
        data.ServiceTypeId = selectedNode.id;

        $("#btnDelete").attr("disabled", true);
        if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

            $.ajax({
                url: getBaseURL() + '/Services/DeleteServiceType',
                type: 'POST',
                datatype: 'json',
                data: data,
                success: function (response) {
                    if (response.Status === true) {
                        toastr.success("Deleted");
                        $("#ServiceTypeTree").jstree("destroy");
                        fnLoadServiceTypeTree();
                    }
                    else {
                        toastr.error(response.Message);
                    }
                    $("#btnDelete").attr("disabled", false);
                },
                error: function (error) {
                    toastr.error(error.statusText);
                    $("#btnDelete").attr("disabled", false);
                }
            });
        }
    }
}

