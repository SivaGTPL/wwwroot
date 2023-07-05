﻿var flag = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadItemGroupCategoryTree();
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnIGCAdd").attr("disabled", _userFormRole.IsInsert === false);

});
function fnLoadItemGroupCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/Grouping/LoadItemGroupCateSubCateTree',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ItemGroupCategoryTree").jstree({ core: { data: result, multiple: true } });
            fnTreeSize("#ItemGroupCategoryTree");
            $(window).on('resize', function () {
                fnTreeSize("#ItemGroupCategoryTree");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });
    $("#ItemGroupCategoryTree").on('loaded.jstree', function () {
        $("#ItemGroupCategoryTree").jstree()._open_to(prevSelectedID);
        $('#ItemGroupCategoryTree').jstree().select_node(prevSelectedID);
    });
    $('#ItemGroupCategoryTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvItemGroupCate").hide();
                $("#chkActiveStatus").prop("disabled", false);

                var parentNode = $("#ItemGroupCategoryTree").jstree(true).get_parent(data.node.id);
                // If Group node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $("#dvItemGroupCate").hide();
                            toastr.warning(errorMsgCS["E006"]);
                            return;
                        }
                        flag = "0";
                        $("#cboitemgroup").val('0');
                        $("#cboitemgroup").prop("disabled", false);
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val('0');
                        $("#cboitemcategory").prop("disabled", false);
                        $('#cboitemcategory').selectpicker('refresh');
                        $("#cboitemsubcategory").empty();
                        $("#cboitemsubcategory").prop("disabled", false);
                        $('#cboitemsubcategory').selectpicker('refresh');
                        $("#cboitemsubcategory").append('<option value="0">' + localization.SelectItemSubCategory + '</option>');
                        $('#cboitemsubcategory').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnIGCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnIGCAdd").show();
                        $("#dvItemGroupCate").show();
                    });                    
                }
                // If Link node is selected
                else if (parentNode.startsWith('C')) {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvItemGroupCate').hide();
                            toastr.warning(errorMsgCS["E004"]);
                            return;
                        }

                        $("#chkActiveStatus").prop("disabled", true);
                        $("#cboitemgroup").val($("#ItemGroupCategoryTree").jstree(true).get_parent(parentNode).substring(1));
                        $("#cboitemgroup").prop("disabled", true);
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val(parentNode.substring(1 + $("#ItemGroupCategoryTree").jstree(true).get_parent(parentNode).length));
                        $("#cboitemcategory").prop("disabled", true);
                        $('#cboitemcategory').selectpicker('refresh');
                        fnloadSubCategoryCbo();
                        $("#cboitemsubcategory").val(data.node.id.substring(1 + parentNode.length));
                        $("#cboitemsubcategory").prop("disabled", true);
                        $('#cboitemsubcategory').selectpicker('refresh');
                        fnGetMappingRecord();
                        $("#btnIGCAdd").hide();
                        $('#dvItemGroupCate').show();
                        
                       

                    });
                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvItemGroupCate').hide();
                            toastr.warning(errorMsgCS["E005"]);
                            return;
                        }
                        flag = "1";
                        $("#chkActiveStatus").prop("disabled", false);
                        $("#cboitemgroup").val($("#ItemGroupCategoryTree").jstree(true).get_parent(parentNode).substring(1));
                        $("#cboitemgroup").prop("disabled", true);
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val(parentNode.substring(1 + $("#ItemGroupCategoryTree").jstree(true).get_parent(parentNode).length));
                        $("#cboitemcategory").prop("disabled", true);
                        $('#cboitemcategory').selectpicker('refresh');
                        fnloadSubCategoryCbo();
                        $("#cboitemsubcategory").val(data.node.id.substring(1 + parentNode.length));
                        $("#cboitemsubcategory").prop("disabled", true);
                        $('#cboitemsubcategory').selectpicker('refresh');
                        fnGetMappingRecord();
                        $("#btnIGCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnIGCAdd").show();
                        $('#dvItemGroupCate').show();
                    });
                }
            }
        }
    });
    $('#ItemGroupCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ItemGroupCategoryTree').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#divItemGroupCategoryTree");
}
function fnloadSubCategoryCbo() {
    $("#cboitemsubcategory").empty();
    //$('#cboitemsubcategory').selectpicker('refresh');
    var ItemCategoryID = $("#cboitemcategory").val();
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemSubCategoryByCateID',
        async: false,
        data: {
            ItemCategory: ItemCategoryID
        },
        success: function (result) {
            //debugger;
            //$("#cboitemsubcategory").append('<option value="0">' + localization.SelectItemSubCategory + '</option>');
            //$('#cboitemsubcategory').selectpicker('refresh');
            //for (var i = 0; i < result.length; i++) {
            //    $("#cboitemsubcategory").append('<option value="' + result[i].ItemSubCategory + '"> ' + result[i].ItemSubCategoryDesc + ' </option>');
            //    $('#cboitemsubcategory').selectpicker('refresh');
            //}
            if (result != null) {
                //refresh each time
                $("#cboitemsubcategory").empty();

                $("#cboitemsubcategory").append($('<option value="0">' + localization.SelectItemSubCategory + '</option>'));
                for (var i = 0; i < result.length; i++) {

                    $("#cboitemsubcategory").append($("<option></option>").val(result[i].ItemSubCategory).html(result[i].ItemSubCategoryDesc));
                }
                $('#cboitemsubcategory').selectpicker('refresh');
            }
            else {
                $("#cboitemsubcategory").empty();
                $("#cboitemsubcategory").append($('<option value="0">' + localization.SelectItemSubCategory + '</option>'));
                $('#cboitemsubcategory').selectpicker('refresh');
            }
        }
    });
  
}
function fnItemGroupCateSubCateMapping() {
    var cboitemgroup = $("#cboitemgroup").val();
    var cboitemcategory = $("#cboitemcategory").val();
    var cboitemsubcategory = $("#cboitemsubcategory").val();
    if (cboitemgroup == "0" || cboitemgroup == null || cboitemgroup == undefined) {
        toastr.error("Please Select Item Group");
        return false;
    }
    else if (cboitemcategory == "0" || cboitemcategory == null || cboitemcategory == undefined) {
        toastr.error("Please Select Item Category");
        return false;
    }
    else if (cboitemsubcategory == "0" || cboitemsubcategory == null || cboitemsubcategory == undefined) {
        toastr.error("Please Select Item Sub Category");
        return false;
    }
    else {
        $("#btnIGCAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Grouping/ItemGroupCateSubCateMapping',
            type: 'POST',
            datatype: 'json',
            data: {
                flag: flag,
                ItemGroupID: cboitemgroup,
                ItemCategory: cboitemcategory,
                ItemSubCategory: cboitemsubcategory,
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            },
            success: function (response) {
                if (response.Status == true) {
                    if (flag == "1") {
                        toastr.success("Record Updated");
                    }
                    else if (flag == "0") {
                        toastr.success("Record Added");
                        $("#cboitemgroup").val('0');
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val('0');
                        $('#cboitemcategory').selectpicker('refresh');
                        $("#cboitemsubcategory").html('<option value="0">' + localization.SelectItemSubCategory +'</option>');
                        $('#cboitemsubcategory').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                    }
                    
                    $("#ItemGroupCategoryTree").jstree("destroy");
                    fnLoadItemGroupCategoryTree();
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnIGCAdd").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnIGCAdd").attr("disabled", false);
            }
        });
    }
}
function fnGetMappingRecord() {
    $("#btnIGCAdd").attr("disabled", false);
    $.ajax({
        url: getBaseURL() + '/Grouping/GetMappingRecord',
        data: {
            ItemGroupID: $("#cboitemgroup").val(),
            ItemCategory: $("#cboitemcategory").val(),
            ItemSubCategory: $("#cboitemsubcategory").val()
        },
        success: function (result) {
            if (result != null) {
                flag = "1";
                $("#btnIGCAdd").html("<i class='fa fa-sync'></i>" + localization.Update);
                $("#btnIGCAdd").attr("disabled", _userFormRole.IsEdit === false);
                if (result.ActiveStatus == true)
                    $('#chkActiveStatus').parent().addClass("is-checked");
                else
                    $('#chkActiveStatus').parent().removeClass("is-checked");
            }
            else {
                flag = "0";
                $("#btnIGCAdd").html("<i class='fa fa-plus'></i>" + localization.Save);
                $("#btnIGCAdd").attr("disabled", _userFormRole.IsInsert === false);
                $('#chkActiveStatus').parent().addClass("is-checked");
            }
        }
    });
}
