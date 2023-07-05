﻿var ItemGroupID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadItemGroupTree();
    
    $('#chkActiveStatus').parent().addClass("is-checked");
});
function fnLoadItemGroupTree() {
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemGroup',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ItemGroupTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ItemGroupTree");
            $(window).on('resize', function () {
                fnTreeSize("#ItemGroupTree");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });
    $("#ItemGroupTree").on('loaded.jstree', function () {
        $("#ItemGroupTree").jstree()._open_to(prevSelectedID);
        $('#ItemGroupTree').jstree().select_node(prevSelectedID);
    });

    $('#ItemGroupTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvItemGroup").hide();

                var parentNode = $("#ItemGroupTree").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvItemGroup').hide();
                            toastr.warning(errorMsgCS["E006"]);
                            return;
                        }
                        $("#pnlAddItemGroup .mdl-card__title-text").text(localization.AddItemGroup);
                        $("#txtItemGroupDesc").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnIGAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnIGAdd").show();
                        $("#dvItemGroup").show();
                        ItemGroupID = "0";
                        $("#txtItemGroupDesc").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else if (parentNode == "IG") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvItemGroup').hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }
                        $("#pnlAddItemGroup .mdl-card__title-text").text(localization.ViewItemGroup);
                        $("#btnIGAdd").hide();
                        $("#dvItemGroup").show();
                        ItemGroupID = data.node.id;
                        $("#txtItemGroupDesc").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);
                        fnFillItemGroupDetail(ItemGroupID);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvItemGroup').hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        $("#pnlAddItemGroup .mdl-card__title-text").text(localization.EditItemGroup);
                        $("#btnIGAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnIGAdd").show();
                        $("#dvItemGroup").show();
                        ItemGroupID = data.node.id
                        $("#txtItemGroupDesc").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                        fnFillItemGroupDetail(ItemGroupID);

                    });

                }
                else {
                    $("#dvItemGroup").hide();
                }
            }
        }
    });
    $('#ItemGroupTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ItemGroupTree').jstree().deselect_node(closingNode.children);
    });
}
function fnFillItemGroupDetail(ItemGroupID) {
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemGroupByID',
        data: {
            ItemGroupID: ItemGroupID
        },
        success: function (result) {
            $("#txtItemGroupDesc").val(result.ItemGroupDesc);
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateItemGroup() {
    var txtItemGroupDesc = $("#txtItemGroupDesc").val()
    if (txtItemGroupDesc == "" || txtItemGroupDesc == null || txtItemGroupDesc == undefined) {
        toastr.error("Please enter the Item Group Description");
        return false;
    }
    else {
        $("#btnIGAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Grouping/AddOrUpdateItemGroup',
            type: 'POST',
            datatype: 'json',
            data: {
                ItemGroupID: ItemGroupID,
                ItemGroupDesc: $("#txtItemGroupDesc").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ItemGroupID == 0) {
                        toastr.success("Item Group Added");
                        $("#txtItemGroupDesc").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        toastr.success("Item Group Updated");
                    }
                    $("#ItemGroupTree").jstree("destroy");
                    fnLoadItemGroupTree();

                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnIGAdd").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnIGAdd").attr("disabled", false);
            }
        });
    }
}