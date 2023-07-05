var storeID;
var prevSelectedID;

$(document).ready(function () {
       
});
function fnBusinessLocation_onChange() {

    fnFormaction();
    fnTreeSize(); 
}


function fnFormaction() {
    $('#btnAddStoreBusinessLink').show();
    BusinessKey = $("#cboBusinessLocation").val();
    $.ajax({
        url: getBaseURL() + '/Inventory/GetStoreList?BusinessKey=' + BusinessKey,
        success: function (result) {
            fnGetUserMenuList_Success(result, BusinessKey);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
   
}

function fnGetUserMenuList_Success(dataArray, BusinessKey) {
    $('#jstStoreBusinessLink').jstree('destroy');
    $("#jstStoreBusinessLink").jstree({
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
        "plugins": ["search"],

        "search": {
            "case_sensitive": false,
            "show_only_matches": true,
            "show_only_matches_children": true
        }
    });
    
    $("#jstStoreBusinessLink").on('loaded.jstree', function () {
        $("#jstStoreBusinessLink").jstree('open_all');
        $("#jstStoreBusinessLink").jstree()._open_to(prevSelectedID);
        $('#jstStoreBusinessLink').jstree().select_node(prevSelectedID);

    });

    $('#jstStoreBusinessLink').on("changed.jstree", function (e, data) {
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
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                    else if (data.node.id.startsWith("ST")) {

                        if ($("#cboBusinessLocation").val() <= 0 || $("#cboBusinessLocation").val() === "") {
                            toastr.warning("Please Select Business Location First");
                            return;
                        }
                        storeID = 0;
                        storeID = data.node.id.substring(2).split("_")[1];
                        
                        if (data.node.id.substring(2).split("_")[0] == "F") {
                            $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                        }
                        else {
                            $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                            $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')

                        }

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E003"]);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.AddStoreBusinessLink);
                            fnClearFields();
                            $('#txtStoreCode').val(storeID);
                            $('#txtStoreDescription').val(data.node.text);
                            $("#chkActiveStatus").parent().addClass("is-checked");

                            $("#btnAddStoreBusinessLink").show();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#btnAddStoreBusinessLink").html('<i class="fa fa-save"></i> ' + localization.Save);
                            $("#chkActiveStatus").attr('disabled', true);
                            //$("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsInsert === false);

                        });

                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E001"]);
                                return;
                            }
                            
                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.ViewStoreBusinessLink);
                            $('#txtStoreCode').val(storeID);
                            $('#txtStoreDescription').val(data.node.text);
                            fnFillStoreBusinessLinkInfo();
                            $('.lblFormName').text(data.node.text);

                            $("#btnAddStoreBusinessLink").hide();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', true);
                            $("#chkActiveStatus").attr('disabled', true);
                        });

                        $('#Edit').on('click', function () {

                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E002"]);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.EditStoreBusinessLink);
                            $('#txtStoreCode').val(storeID);
                            $('#txtStoreDescription').val(data.node.text);
                            
                            fnFillStoreBusinessLinkInfo();
                            $('.lblFormName').text(data.node.text);

                            $("#btnAddStoreBusinessLink").show();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#chkActiveStatus").attr('disabled', true);
                            $("#btnAddStoreBusinessLink").html('<i class="fa fa-sync"></i> ' + localization.Update);

                            //$("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsEdit === false);
                        });


                        //if (data.node.id.substring(2).split("_")[0] == "F") {
                        //    $("#pnlMainMenu").show();
                        //    $(".mdl-card__title-text").text("Add Store Business Link");
                        //    fnClearFields();
                        //    $('#txtStoreCode').val(storeID);
                        //    $('#txtStoreDescription').val(data.node.text);
                        //    $("#btnAddStoreBusinessLink").html('<i class="fa fa-plus"></i> Add');
                        //    $("#chkActiveStatus").parent().addClass("is-checked");
                        //    $("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsInsert === false);
                        //}
                        //else {
                        //    $("#pnlMainMenu").show();
                        //    $(".mdl-card__title-text").text("Edit Store Business Link");
                        //    $('#txtStoreCode').val(storeID);
                        //    $('#txtStoreDescription').val(data.node.text);
                        //    $("input,textarea").attr('readonly', true);
                        //    fnFillStoreBusinessLinkInfo();
                        //    $('.lblFormName').text(data.node.text);
                        //    $("#btnAddStoreBusinessLink").html('<i class="fa fa-sync"></i> Update');
                        //    $("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsEdit === false);
                        //}
                    }
                    else {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                }
            }
        }
    });

    $('#jstStoreBusinessLink').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstStoreBusinessLink').jstree().deselect_node(closingNode.children);
    });

};

function fnFillStoreBusinessLinkInfo() {
    if ($("#txtStoreCode").val() != '' && $("#txtStoreCode").val() != undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/Inventory/GetStoreBusinessLinkInfo?BusinessKey=" + $("#cboBusinessLocation").val() + "&StoreCode=" + $("#txtStoreCode").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.IsAccounting == 1) {
                    $("#chkIsAccounting").parent().addClass("is-checked");
                }
                else { $('#chkIsAccounting').parent().removeClass("is-checked"); }

                if (result.IsCustodian == 1) {
                    $("#chkIsCustodian").parent().addClass("is-checked");
                }
                else { $('#chkIsCustodian').parent().removeClass("is-checked"); }

                if (result.IsConsumption == 1) {
                    $("#chkIsConsumption").parent().addClass("is-checked");
                }
                else { $('#chkIsConsumption').parent().removeClass("is-checked"); }

                if (result.IsPointofSales == 1) {
                    $("#chkIsPointofSales").parent().addClass("is-checked");
                }
                else { $('#chkIsPointofSales').parent().removeClass("is-checked"); }

                if (result.ActiveStatus == 1) {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else { $('#chkActiveStatus').parent().removeClass("is-checked"); }
            }
        });
    }
}

function fnSaveStoreBusinessLink() {

    if (validationStoreBusinessLink() === false) {
        return;
    }

    $("#btnAddStoreBusinessLink").attr('disabled', true);
   
    var strbuss = {
        BusinessKey: $("#cboBusinessLocation").val(),
        StoreCode: $("#txtStoreCode").val(),
        IsAccounting: $("#chkIsAccounting").parent().hasClass("is-checked"),
        IsCustodian: $("#chkIsCustodian").parent().hasClass("is-checked"),
        IsConsumption: $("#chkIsConsumption").parent().hasClass("is-checked"),
        IsPointofSales: $("#chkIsPointofSales").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $.ajax({
        url: getBaseURL() + '/Inventory/InsertUpdateStoreBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { strbuss },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnAddStoreBusinessLink").attr('disabled', false);
                location.reload();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnAddStoreBusinessLink").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnAddStoreBusinessLink").attr('disabled', false);
        }
    });
}

function validationStoreBusinessLink() {

    if ($("#cboBusinessLocation").val() <= 0) {
        toastr.warning("Please Select Business Location First");
        return;
    }

    if (IsStringNullorEmpty($("#txtStoreCode").val())) {
        toastr.warning("Please Select Store");
        return false;
    }

    if (IsStringNullorEmpty($("#txtStoreDescription").val())) {
        toastr.warning("Please Select Store");
        return false;
    }

}

function fnClearFields() {
    $('#txtStoreDescription').val("");
    $("#chkIsAccounting").parent().removeClass("is-checked");
    $("#chkIsConsumption").parent().removeClass("is-checked");
    $("#chkIsCustodian").parent().removeClass("is-checked");
    $("#chkIsPointofSales").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().removeClass("is-checked");
}

function fnExpandAll() {
    $('#jstStoreBusinessLink').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlMainMenu").hide();
    fnClearFields();
    $('#jstStoreBusinessLink').jstree('close_all');
}

function fnTreeSize() {
    $("#jstStoreBusinessLink").css({
        'height': $(window).innerHeight() - 211,
        'overflow': 'auto'
    });
}