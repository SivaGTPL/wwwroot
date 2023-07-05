﻿var ServiceGroupID = "0";
var ServiceTypeID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadServiceGroupTree();
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSGAdd").attr("disabled", _userFormRole.IsInsert === false);
});
function fnLoadServiceGroupTree() {
    $.ajax({
        url: getBaseURL() + '/ServiceManagement/GetServiceGroups',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            $("#ServiceGroupTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ServiceGroupTree");
            $(window).on('resize', function () {
                fnTreeSize("#ServiceGroupTree");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });

    $("#ServiceGroupTree").on('loaded.jstree', function () {
        $("#ServiceGroupTree").jstree()._open_to(prevSelectedID);
        $('#ServiceGroupTree').jstree().select_node(prevSelectedID);
    });
    $('#ServiceGroupTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceGroup").hide();

                var parentNode = $("#ServiceGroupTree").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $("#dvServiceGroup").hide();
                }
                // If Type node is selected
                else if (parentNode == "SG") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvServiceGroup').hide();
                            toastr.warning(errorMsgCS["E003"]);
                            return;
                        }
                        $("#pnlAddServiceGroup .mdl-card__title-text").text(localization.AddServiceGroup);
                        $("#txtServiceGroupDesc").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnSGAdd").html("<i class='fa fa-save'></i>" + localization.Save);
                        $("#btnSGAdd").show();
                        ServiceGroupID = "0";
                        ServiceTypeID = data.node.id;
                        $("#dvServiceGroup").show();
                        $("#txtServiceGroupDesc").prop("disabled", false);
                        $("#cboservicecriteria").val('0');
                        $("#cboservicecriteria").prop("disabled", false);
                        $('#cboservicecriteria').selectpicker('refresh');
                        $("#chkActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvServiceGroup').hide();
                            toastr.warning(errorMsgCS["E001"]);
                            return;
                        }
                        $("#pnlAddServiceGroup .mdl-card__title-text").text(localization.ViewServiceGroup);
                        $("#btnSGAdd").hide();
                        ServiceGroupID = data.node.id;
                        ServiceGroupID = ServiceGroupID.substring(1);
                        fnFillServiceGroupDetail(ServiceGroupID);
                        $("#dvServiceGroup").show();
                        $("#txtServiceGroupDesc").prop("disabled", true);
                        $("#cboservicecriteria").prop("disabled", true);
                        $('#cboservicecriteria').selectpicker('refresh');
                        $("#chkActiveStatus").prop("disabled", true);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvServiceGroup').hide();
                            toastr.warning(errorMsgCS["E002"]);
                            return;
                        }
                        $("#pnlAddServiceGroup .mdl-card__title-text").text(localization.EditServiceGroup);
                        $("#btnSGAdd").html("<i class='fa fa-sync'></i>" + localization.Update);
                        $("#btnSGAdd").show();
                        ServiceGroupID = data.node.id;
                        ServiceGroupID = ServiceGroupID.substring(1);
                        fnFillServiceGroupDetail(ServiceGroupID);
                        $("#dvServiceGroup").show();
                        $("#txtServiceGroupDesc").prop("disabled", false);
                        $("#cboservicecriteria").prop("disabled", false);
                        $('#cboservicecriteria').selectpicker('refresh');
                        $("#chkActiveStatus").prop("disabled", false);

                    });

                }
            }
        }
    });

    $('#ServiceGroupTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ServiceGroupTree').jstree().deselect_node(closingNode.children);
    });

}
function fnFillServiceGroupDetail(ServiceGroupID) {
    $.ajax({
        url: getBaseURL() + '/ServiceManagement/GetServiceGroupByID',
        data: {
            ServiceGroupID: ServiceGroupID
        },
        success: function (result) {
            $("#txtServiceGroupDesc").val(result.ServiceGroupDesc);
            $("#cboservicecriteria").val(result.ServiceCriteria);
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateServiceGroup() {
    var txtServiceGroupDesc = $("#txtServiceGroupDesc").val()
    if (txtServiceGroupDesc == "" || txtServiceGroupDesc == null || txtServiceGroupDesc == undefined) {
        toastr.error("Please enter the Service Group Description");
        return false;
    }

    else {
        if (ServiceGroupID == "0") {
            if (ServiceTypeID == "0" || ServiceTypeID == null || ServiceTypeID == undefined) {
                toastr.error("Please select Service Type");
                return false;
            }
        }
        $("#btnSGAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/ServiceManagement/AddOrUpdateServiceGroup',
            type: 'POST',
            datatype: 'json',
            data: {
                ServiceTypeID: ServiceTypeID,
                ServiceGroupID: ServiceGroupID,
                ServiceGroupDesc: $("#txtServiceGroupDesc").val(),
                ServiceCriteria: $("#cboservicecriteria").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            async: false,
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceGroupID == 0) {
                        toastr.success("Service Group Added");
                        $("#txtServiceGroupDesc").val('');
                        $("#cboservicecriteria").val('0');
                        $('#cboservicecriteria').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        toastr.success("Service Group Updated");
                    }
                    $("#ServiceGroupTree").jstree("destroy");
                    fnLoadServiceGroupTree();

                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSGAdd").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSGAdd").attr("disabled", false);
            }
        });
    }
}
function fnExpandAll() {
    $("#ServiceGroupTree").jstree('open_all');
}
function fnCollapseAll() {
    $("#ServiceGroupTree").jstree('close_all');
    $('#dvServiceGroup').hide();
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
    var selectedNode = $('#ServiceGroupTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        toastr.warning('Please select a Service Group to move.');
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("G")) {
            toastr.warning('Please select a Service Group to move.');
        }
        else {
            var data = {};
            data.isMoveUp = isMoveUp;
            data.isMoveDown = isMoveDown;
            data.serviceTypeId = selectedNode.parent;
            data.serviceGroupId = selectedNode.id.substring(1);

            $("#btnMoveUp").attr("disabled", true);
            $("#btnMoveDown").attr("disabled", true);
            if (confirm(localization.Doyouwanttomovenode + selectedNode.text + str + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/ServiceManagement/UpdateServiceGroupIndex',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
                    async: false,
                    success: function (response) {
                        if (response.Status === true) {
                            toastr.success("Moved");
                            $("#ServiceGroupTree").jstree("destroy");
                            fnLoadServiceGroupTree();
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
}
function fnDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        toastr.warning(errorMsgCS["E004"]);
        return;
    }

    var selectedNode = $('#ServiceGroupTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        toastr.warning('Please select a Service Group to delete.');
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("G")) {
            toastr.warning('Please select a Service Group to delete.');
        }
        else {
            var data = {};
            data.serviceGroupId = selectedNode.id.substring(1);

            $("#btnDelete").attr("disabled", true);
            if (confirm(localization.Doyouwanttodeletenode + selectedNode.text +  ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/ServiceManagement/DeleteServiceGroup',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
                    async: false,
                    success: function (response) {
                        if (response.Status === true) {
                            toastr.success("Deleted");
                            $("#ServiceGroupTree").jstree("destroy");
                            fnLoadServiceGroupTree();
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
}
