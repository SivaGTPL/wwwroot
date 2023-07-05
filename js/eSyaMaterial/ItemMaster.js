
var _isSubCategoryApplicable = 0;

$(document).ready(function () {
    _isSubCategoryApplicable = 0;
    fnGridLoadItemMaster();
});

function fnGetItemDetails() {
    $('#cboItemGroup').val('');
    $('#cboItemGroup').selectpicker('refresh');
    $('#cboItemCategory').val('');
    $('#cboItemCategory').selectpicker('refresh');
    $('#cboItemSubCategory').val('');
    $('#cboItemSubCategory').selectpicker('refresh');
    $("#jqgItemMaster").jqGrid("clearGridData");
    var ItemCode = $("#cboItemDesc").val();

    var URL = getBaseURL() + '/ItemManagement/GetItemDetails?ItemCode=' + ItemCode
    $.ajax({
        type: 'POST',
        url: URL,
        success: function (result) {
            if (result.length > 0) {
                $("#cboItemGroup").val(result[0]["ItemGroup"]);
                $("#cboItemGroup").selectpicker('refresh');

                fnGetItemCategoryByItem(result[0]["ItemCategory"]);

                fnGetItemSubCategoryByItem(result[0]["ItemCategory"], result[0]["ItemSubCategory"]);

                $("#jqgItemMaster").jqGrid('GridUnload');
                $("#jqgItemMaster").jqGrid({
                    url: URL,
                    mtype: 'Post',
                    datatype: 'json',
                    ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                    jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
                    colNames: ["Item Code", localization.ItemDescription, localization.UnitOfMeasure, "Pack Unit", localization.PackUnit, localization.PackSize, localization.InventoryClass, localization.ItemClass, localization.ItemSource, localization.ItemCriticality, "Barcode ID", localization.Active, localization.Actions],
                    colModel: [
                        { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "ItemDescription", width: 70, editable: true, align: 'left', hidden: false },
                        { name: "UnitOfMeasure", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
                        { name: "PackUnit", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
                        { name: "PackUnitDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
                        { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
                        { name: "InventoryClass", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
                        { name: "ItemClass", width: 40, editable: true, align: 'left', hidden: false },
                        { name: "ItemSource", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
                        { name: "ItemCriticality", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
                        { name: "BarCodeID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
                        { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
                        {
                            name: 'Action', search: false, align: 'left', width: 60, sortable: false, resizable: false,
                            formatter: function (cellValue, options, rowdata, action) {
                                return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditItemMaster(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewItemMaster(event)"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

                            }
                        },
                    ],
                    pager: "#jqpItemMaster",
                    rowNum: 10,
                    rowList: [10, 20, 50, 100],
                    rownumWidth: 55,
                    loadonce: true,
                    viewrecords: true,
                    gridview: true,
                    rownumbers: true,
                    height: 'auto',
                    align: "left",
                    width: 'auto',
                    autowidth: true,
                    shrinkToFit: true,
                    forceFit: true,
                    scrollOffset: 0,
                    loadComplete: function (data) {
                        SetGridControlByAction();
                    },
                }).jqGrid('navGrid', '#jqpItemMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemMaster', {
                    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemMaster
                }).jqGrid('navButtonAdd', '#jqpItemMaster', {
                    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddItemMaster
                });
            }
            else
                jqgItemMaster.jqGrid().trigger('reloadGrid', [{ page: 1 }]);
        }
    });
}

function fnGetItemCategoryByItem(ItemCategory) {
    $("#cboItemCategory").empty().selectpicker('refresh');
    $("#cboItemSubCategory").empty().selectpicker('refresh');
    
    _isSubCategoryApplicable = 0;
    var ItemGroup = $("#cboItemGroup").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/ItemManagement/GetItemCategory?ItemGroup=' + ItemGroup,
        success: function (result) {
            $("#cboItemCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboItemCategory').append('<option value="' + result[i]["ItemCategory"] + '">' + result[i]["ItemCategoryDesc"] + '</option>');
                }
            }
            $("#cboItemCategory").val(ItemCategory);
            $("#cboItemCategory").selectpicker('refresh');
        }
    });
}

function fnGetItemSubCategoryByItem(ItemCategory, ItemSubCategory) {
    $("#cboItemSubCategory").empty().selectpicker('refresh');
    _isSubCategoryApplicable = 0;

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/ItemManagement/GetItemSubCategory?ItemCategory=' + ItemCategory,
        success: function (result) {
            $("#cboItemSubCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboItemSubCategory').append('<option value="' + result[i]["ItemSubCategory"] + '">' + result[i]["ItemSubCategoryDesc"] + '</option>');
                }
                _isSubCategoryApplicable = 1;
            }
            $("#cboItemSubCategory").val(ItemSubCategory);
            $("#cboItemSubCategory").selectpicker('refresh');
        }
    });
}

function fnGetItemCategory() {
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    $("#jqgItemMaster").jqGrid("clearGridData");
    $("#cboItemCategory").empty().selectpicker('refresh');
    $("#cboItemSubCategory").empty().selectpicker('refresh');
    _isSubCategoryApplicable = 0;
    var ItemGroup = $("#cboItemGroup").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/ItemManagement/GetItemCategory?ItemGroup=' + ItemGroup,
        success: function (result) {
            $("#cboItemCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $("#cboItemCategory").append($("<option></option>").val(result[i]["ItemCategory"]).html(result[i]["ItemCategoryDesc"]));
                }
            }
            $('#cboItemCategory').val($("#cboItemCategory option:first").val());
            $('#cboItemCategory').selectpicker('refresh');
        }
    });
}

function fnGetItemSubCategory() {
   
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    $("#jqgItemMaster").jqGrid("clearGridData");
    $("#cboItemSubCategory").empty().selectpicker('refresh');

    _isSubCategoryApplicable = 0;
    var ItemCategory = $("#cboItemCategory").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/ItemManagement/GetItemSubCategory?ItemCategory=' + ItemCategory,
        success: function (result) {
            $("#cboItemSubCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboItemSubCategory").append($("<option></option>").val(result[i]["ItemSubCategory"]).html(result[i]["ItemSubCategoryDesc"]));
                }
                _isSubCategoryApplicable = 1;
            }
            $('#cboItemSubCategory').val($("#cboItemSubCategory option:first").val());
            $('#cboItemSubCategory').selectpicker('refresh');
        }
    });

    if (_isSubCategoryApplicable == 0) {
        fnGridLoadItemMaster();
    }
}

function fnItemSubCategoryOnChanges() {
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    fnGridLoadItemMaster();
}

function fnGridLoadItemMaster() {
    var ItemGroup = $("#cboItemGroup").val();
    var ItemCategory = $("#cboItemCategory").val();
    var ItemSubCategory = $("#cboItemSubCategory").val();
    var URL = getBaseURL() + '/ItemManagement/GetItemMaster?ItemGroup=' + ItemGroup + '&ItemCategory=' + ItemCategory + '&ItemSubCategory=' + ItemSubCategory;
    $("#jqgItemMaster").jqGrid('GridUnload');
    $("#jqgItemMaster").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Item Code", localization.ItemDescription, localization.UnitOfMeasure, "Pack Unit", localization.PackUnit, localization.PackSize, localization.InventoryClass, localization.ItemClass, localization.ItemSource, localization.ItemCriticality, "Barcode ID", localization.Active, localization.Actions],
        colModel: [
            { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ItemDescription", width: 70, editable: true, align: 'left', hidden: false },
            { name: "UnitOfMeasure", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PackUnit", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PackUnitDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
            { name: "InventoryClass", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemClass", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ItemSource", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemCriticality", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BarCodeID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'Action', search: false, align: 'left', width: 60, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditItemMaster(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewItemMaster(event)"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

                }
            },
        ],
        pager: "#jqpItemMaster",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,

        loadComplete: function (data) {
            SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpItemMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemMaster
    }).jqGrid('navButtonAdd', '#jqpItemMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddItemMaster
    });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnGridAddItemMaster() {
    fnClearFields();

    if ($("#cboItemGroup").val() === "0" || $("#cboItemGroup").val() === "") {
        toastr.warning("Please Select a Item Group");
        $('#cboItemGroup').focus();
        return false;
    }
    if ($("#cboItemCategory").val() === "0" || $("#cboItemCategory").val() === "") {
        toastr.warning("Please Select a Item Category");
        $('#cboItemCategory').focus();
        return false;
    }
    if (_isSubCategoryApplicable == 1 && ($("#cboItemSubCategory").val() === "0" || $("#cboItemSubCategory").val() === "")) {
        toastr.warning("Please Select a Item Sub Category");
        $('#cboItemSubCategory').focus();
        return false;
    }

    $("#btnSaveItem").html(localization.Save);
    $('#PopupItemMaster').modal('show');
    $('#PopupItemMaster').find('.modal-title').text(localization.AddItem);
    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}

function fnGridRefreshItemMaster() {
    $("#jqgItemMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditItemMaster(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);

    $("#btnSaveItem").html(localization.Update);
    $('#PopupItemMaster').find('.modal-title').text(localization.EditItem);
    $('#PopupItemMaster').modal('show');

    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });

    $('#txtItemCode').val(rowData.ItemCode);
    $('#txtItemDescription').val(rowData.ItemDescription);
    $("#cboUnitOfMeasure").val(rowData.UnitOfMeasure);
    $("#cboUnitOfMeasure").selectpicker('refresh');
    $("#cboPackUnit").val(rowData.PackUnit);
    $("#cboPackUnit").selectpicker('refresh');
    $('#txtPackSize').val(rowData.PackSize);
    $("#cboInventoryClass").val(rowData.InventoryClass.substring(0, 1));
    $("#cboInventoryClass").selectpicker('refresh');
    $("#cboItemClass").val(rowData.ItemClass.substring(0, 1));
    $("#cboItemClass").selectpicker('refresh');
    $("#cboItemSource").val(rowData.ItemSource.substring(0, 1));
    $("#cboItemSource").selectpicker('refresh');
    $("#cboItemCriticality").val(rowData.ItemCriticality.substring(0, 1));
    $("#cboItemCriticality").selectpicker('refresh');
    $('#txtBarCodeID').val(rowData.BarCodeID);
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/ItemManagement/GetItemParameterList?ItemCode=' + $('#txtItemCode').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(response.l_FormParameter);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });

    $("#btnSaveItem").attr('disabled', false);
}

function fnViewItemMaster(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);

    $('#PopupItemMaster').modal('show');
    $('#PopupItemMaster').find('.modal-title').text(localization.ViewItem);
    $('#PopupItemMaster').modal('show');

    $('#txtItemCode').val(rowData.ItemCode);
    $('#txtItemDescription').val(rowData.ItemDescription);
    $("#cboUnitOfMeasure").val(rowData.UnitOfMeasure);
    $("#cboUnitOfMeasure").selectpicker('refresh');
    $("#cboPackUnit").val(rowData.PackUnit);
    $("#cboPackUnit").selectpicker('refresh');
    $('#txtPackSize').val(rowData.PackSize);
    $("#cboInventoryClass").val(rowData.InventoryClass.substring(0, 1));
    $("#cboInventoryClass").selectpicker('refresh');
    $("#cboItemClass").val(rowData.ItemClass.substring(0, 1));
    $("#cboItemClass").selectpicker('refresh');
    $("#cboItemSource").val(rowData.ItemSource.substring(0, 1));
    $("#cboItemSource").selectpicker('refresh');
    $("#cboItemCriticality").val(rowData.ItemCriticality.substring(0, 1));
    $("#cboItemCriticality").selectpicker('refresh');
    $('#txtBarCodeID').val(rowData.BarCodeID);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/ItemManagement/GetItemParameterList?ItemCode=' + $('#txtItemCode').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                eSyaParams.SetJSONValue(response.l_FormParameter);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });

    $("#btnSaveItem").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("#btnSaveItem").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    })
}

function fnSaveItemCreation() {

    if (validateItemMaster() === false) {
        return;
    }

    var ItemCodes;
    
    $("#btnSaveItem").attr('disabled', true);

    var itemCode = $("#txtItemCode").val();

    if (itemCode == null || itemCode == "") {
        ItemCodes = {
            ItemCode: 0,
            ItemGroup: $("#cboItemGroup").val(),
            ItemCategory: $("#cboItemCategory").val(),
            ItemSubCategory: $("#cboItemSubCategory").val(),
            ItemDescription: $("#txtItemDescription").val(),
            UnitOfMeasure: $("#cboUnitOfMeasure").val(),
            PackUnit: $("#cboPackUnit").val(),
            PackSize: $("#txtPackSize").val(),
            InventoryClass: $("#cboInventoryClass").val(),
            ItemClass: $("#cboItemClass").val(),
            ItemSource: $("#cboItemSource").val(),
            ItemCriticality: $("#cboItemCriticality").val(),
            BarCodeID: $("#txtBarCodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
    }
    else {
        ItemCodes = {
            ItemCode: itemCode,
            ItemGroup: $("#cboItemGroup").val(),
            ItemCategory: $("#cboItemCategory").val(),
            ItemSubCategory: $("#cboItemSubCategory").val(),
            ItemDescription: $("#txtItemDescription").val(),
            UnitOfMeasure: $("#cboUnitOfMeasure").val(),
            PackUnit: $("#cboPackUnit").val(),
            PackSize: $("#txtPackSize").val(),
            InventoryClass: $("#cboInventoryClass").val(),
            ItemClass: $("#cboItemClass").val(),
            ItemSource: $("#cboItemSource").val(),
            ItemCriticality: $("#cboItemCriticality").val(),
            BarCodeID: $("#txtBarCodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
    }

    //var objPar = [];
    //objPar = eSyaParams.GetValue();

    var fmParams = eSyaParams.GetJSONValue();
    ItemCodes.l_FormParameter = fmParams;

    $.ajax({
        //async: false,
        url: getBaseURL() + '/ItemManagement/InsertOrUpdateItemCodes',
        type: 'POST',
        data: {
            ItemCodes
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveItem").attr('disabled', true);
                $("#btnSaveItem").hide();
                $("#PopupItemMaster").modal('hide');
                fnGridRefreshItemMaster();
                eSyaParams.ClearValue();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveItem").attr('disabled', false);
            $("#btnSaveItem").show();
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveItem").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#txtItemCode").val('')
    $('#txtItemDescription').val('');
    $('#cboUnitOfMeasure').val('');
    $('#cboUnitOfMeasure').selectpicker('refresh');
    $('#cboPackUnit').val('');
    $('#cboPackUnit').selectpicker('refresh');
    $('#txtPackSize').val('');
    $('#cboInventoryClass').val('');
    $('#cboInventoryClass').selectpicker('refresh');
    $('#cboItemClass').val('');
    $('#cboItemClass').selectpicker('refresh');
    $('#cboItemSource').val('');
    $('#cboItemSource').selectpicker('refresh');
    $('#cboItemCriticality').val('');
    $('#cboItemCriticality').selectpicker('refresh');
    $('#txtBarCodeID').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    eSyaParams.ClearValue();
}

function validateItemMaster() {

    if ($("#txtItemDescription").val().trim().length <= 0) {
        toastr.warning("Please Enter Item Description");
        $('#txtItemDescription').focus();
        return false;
    }
    if ($("#cboUnitOfMeasure").val() === "0" || $("#cboUnitOfMeasure").val() === "") {
        toastr.warning("Please Select Unit of Measure");
        $('#cboUnitOfMeasure').focus();
        return false;
    }
    if ($("#cboPackUnit").val() === "0" || $("#cboPackUnit").val() === "") {
        toastr.warning("Please Select Pack Unit");
        $('#cboPackUnit').focus();
        return false;
    }
    if ($("#cboInventoryClass").val() === "0" || $("#cboInventoryClass").val() === "") {
        toastr.warning("Please Select Inventory Class");
        $('#cboInventoryClass').focus();
        return false;
    }
    if ($("#cboItemClass").val() === "0" || $("#cboItemClass").val() === "") {
        toastr.warning("Please Select Item Class");
        $('#cboItemClass').focus();
        return false;
    }
    if ($("#cboItemSource").val() === "0" || $("#cboItemSource").val() === "") {
        toastr.warning("Please Select Item Source");
        $('#cboItemSource').focus();
        return false;
    }
    if ($("#cboItemCriticality").val() === "0" || $("#cboItemCriticality").val() === "") {
        toastr.warning("Please Select Item Criticality");
        $('#cboItemCriticality').focus();
        return false;
    }
    if ($("#txtPackSize").val() === "0" || $("#txtPackSize").val() === "") {
        toastr.warning("Please Enter Pack Size");
        $('#txtPackSize').focus();
        return false;
    }
}

 