var ItemCategoryID = "0";
var ItemSubCategoryID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadItemSubCategoryTree()
    $('#chkActiveStatusSub').parent().addClass("is-checked");
});

function fnLoadItemSubCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/Grouping/LoadItemSubCategoryTree',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ItemCategoryTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ItemCategoryTree");
            $(window).on('resize', function () {
                fnTreeSize("#ItemGroupCategoryTree");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });
    $("#ItemCategoryTree").on('loaded.jstree', function () {
        $("#ItemCategoryTree").jstree()._open_to(prevSelectedID);
        $('#ItemCategoryTree').jstree().select_node(prevSelectedID);
    });
    $('#ItemCategoryTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvItemCategory").hide();
                $("#dvItemSubCategory").hide();


                var parentNode = $("#ItemCategoryTree").jstree(true).get_parent(data.node.id);

                // If Category node is selected
                if (parentNode == "ISC") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            toastr.warning(errorMsgCS["E006"]);
                            return;
                        }
                        $("#txtItemSubCategoryDesc").prop("disabled", false);
                        $("#chkActiveStatusSub").prop("disabled", false);
                        $("#dvItemCategory").hide();
                        $("#dvItemSubCategory").show();
                        $("#pnlAddItemSubCategory .mdl-card__title-text").text(localization.AddItemSubCategory);
                        $("#txtItemSubCategoryDesc").val('');
                        $('#chkActiveStatusSub').parent().addClass("is-checked");
                        $("#btnISCAdd").html("<i class='fa fa-save'></i>" + localization.Save);
                        $("#btnISCAdd").show();
                        ItemCategoryID = data.node.id
                        ItemSubCategoryID = "0"
                    });
                }
                // If Sub Category node is selected
                else if (data.node.id.startsWith('S')){
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }
                        $("#txtItemSubCategoryDesc").prop("disabled", true);
                        $("#chkActiveStatusSub").prop("disabled", true);
                        $("#dvItemCategory").hide();
                        $("#dvItemSubCategory").show();
                        $("#pnlAddItemSubCategory .mdl-card__title-text").text(localization.ViewItemSubCategory);
                        $("#btnISCAdd").hide();
                        ItemSubCategoryID = data.node.id;
                        ItemCategoryID = parentNode;
                        ItemSubCategoryID = ItemSubCategoryID.substring(1);
                        fnFillItemSubCateDetail(ItemSubCategoryID);
                    });


                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        $("#txtItemSubCategoryDesc").prop("disabled", false);
                        $("#chkActiveStatusSub").prop("disabled", false);
                        $("#dvItemCategory").hide();
                        $("#dvItemSubCategory").show();
                        $("#pnlAddItemSubCategory .mdl-card__title-text").text(localization.EditItemSubCategory);
                        $("#btnISCAdd").html("<i class='fa fa-sync'></i>" + localization.Update);
                        $("#btnISCAdd").show();
                        ItemSubCategoryID = data.node.id;
                        ItemCategoryID = parentNode;
                        ItemSubCategoryID = ItemSubCategoryID.substring(1);
                        fnFillItemSubCateDetail(ItemSubCategoryID);
                    });
                }
            }
        }
    });
    $('#ItemCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ItemCategoryTree').jstree().deselect_node(closingNode.children);
    });
}
function fnFillItemSubCateDetail(ItemSubCategoryID) {
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemSubCategoryByID',
        data: {
            ItemSubCategory: ItemSubCategoryID
        },
        success: function (result) {
            $("#txtItemSubCategoryDesc").val(result.ItemSubCategoryDesc);
            if (result.ActiveStatus == true)
                $('#chkActiveStatusSub').parent().addClass("is-checked");
            else
                $('#chkActiveStatusSub').parent().removeClass("is-checked");
        }
    });
}

function fnAddOrUpdateItemSubCategory() {
    var txtItemSubCategoryDesc = $("#txtItemSubCategoryDesc").val()
    if (txtItemSubCategoryDesc == "" || txtItemSubCategoryDesc == null || txtItemSubCategoryDesc == undefined) {
        toastr.error("Please enter the Item Sub Category Description");
        return false;
    }
    else if (ItemCategoryID == "0" || ItemCategoryID == null || ItemCategoryID == undefined) {
        toastr.error("Please select a category");
        return false;
    }
    else {
        $("#btnISCAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Grouping/AddOrUpdateItemSubCategory',
            type: 'POST',
            datatype: 'json',
            data: {
                ItemCategory: ItemCategoryID,
                ItemSubCategory: ItemSubCategoryID,
                ItemSubCategoryDesc: $("#txtItemSubCategoryDesc").val(),
                ActiveStatus: $("#chkActiveStatusSub").parent().hasClass("is-checked"),
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ItemSubCategoryID == "0") {
                        toastr.success("Item Sub Category Added");
                        $("#txtItemSubCategoryDesc").val('');
                        $('#chkActiveStatusSub').parent().addClass("is-checked");
                    }
                    else {
                        toastr.success("Item Sub Category Updated");
                    }
                    $("#ItemCategoryTree").jstree("destroy");
                    fnLoadItemSubCategoryTree();
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnISCAdd").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnISCAdd").attr("disabled", false);
            }
        });
    }
}

