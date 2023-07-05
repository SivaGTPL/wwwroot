var dcnamePrefix = "";

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        dcnamePrefix = $(this).text();
        fnGridLoadDrugCategories(dcnamePrefix);
        $(this).addClass('active');
    });
    fnGridLoadDrugCategories(dcnamePrefix);
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDrugCategories",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugGeneric(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugGeneric(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnGridLoadDrugCategories(dcnamePrefix) {
    $("#jqgDrugCategories").jqGrid('GridUnload');
    $("#jqgDrugCategories").jqGrid({
        url: getBaseURL() + '/ConfigureDrug/GetDrugCategoryListByNamePrefix?drugCategoryPrefix=' + dcnamePrefix,
        datatype: 'json',
        // mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.GenericId, localization.Generics, localization.IsCombinationDrugs, localization.DrugClassId, localization.DrugClass, localization.PharmacyGroup, localization.PharmacyGroupDesc, localization.Usagestatus, localization.Active, localization.Actions],
        colModel: [
            { name: "GenericId", width: 135, editable: true, align: 'left', hidden: true },
            { name: "GenericDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "IsCombiDrug", width: 85, editable: true, align: 'center', hidden: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "DrugClassId", width: 20, editable: true, align: 'left', hidden: true },
            { name: "DrugClassDesc", width: 90, editable: true, align: 'left', hidden: false },
            { name: "PharmacyGroup", width: 20, editable: true, align: 'left', hidden: true },
            { name: "PharmacyGroupDesc", width: 90, editable: true, align: 'left', hidden: false },
            { name: "UsageStatus", editable: true, width: 38, align: 'center', hidden: true, resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 75, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDrugGeneric(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditDrugGeneric(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDrugCategories"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDrugCategories",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55, 
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

        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

        },
    }).
        jqGrid('navGrid', '#jqpDrugCategories', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpDrugCategories', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddCategories
        }).
        jqGrid('navButtonAdd', '#jqpDrugCategories', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshCategories
        });

    //    jqGrid('navGrid', '#jqpDrugCategories', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDrugCategories', {
    //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCategories
    //}).jqGrid('navButtonAdd', '#jqpDrugCategories', {
    //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddCategories
    //    });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnGridAddCategories() {
    $("#divGridDrugCategories").hide();
    $("#divDrugCategoriesForm").css('display', 'block');
    fnEnableControl(false);
    fnClearDrugGeneric();
}

function fnEditDrugGeneric(e, actiontype) {
    fnClearDrugGeneric();
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgDrugCategories').jqGrid('getRowData', rowid);
    var rowid = $("#jqgDrugCategories").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugCategories').jqGrid('getRowData', rowid);
    $('#txtGenericId').val(rowData.GenericId);
    $("#txtGenerics").val(rowData.GenericDesc);

    $("#cboDrugClass").val(rowData.DrugClassId);
    $("#cboDrugClass").selectpicker('refresh');

    $("#cboPharmacyGroup").val(rowData.PharmacyGroup);
    $("#cboPharmacyGroup").selectpicker('refresh');

    if (rowData.IsCombiDrug === "true") {
        $("#chkIsCombinationDrug").parent().addClass("is-checked");
    }
    else { $("#chkIsCombinationDrug").parent().removeClass("is-checked"); }

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveDrugCategory").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $("#divGridDrugCategories").hide();
        $("#divDrugCategoriesForm").css('display', 'block');

        $("#btnSaveDrugCategory").html('<i class="fa fa-sync"></i> '+localization.Update);

        fnEnableControl(false);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $("#divGridDrugCategories").hide();
        $("#divDrugCategoriesForm").css('display', 'block');

        $("#btnSaveDrugCategory").hide();
        fnEnableControl(true);
    }
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkIsCombinationDrug").attr('disabled', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSaveDrugCategory() {
    if (validateDrugCategory() === false) {
        return;
    }

    $("#btnSaveDrugCategory").attr('disabled', true);
    var genricId = $("#txtGenericId").val();
    var drugCategory;
    if (genricId === null || genricId === "") {
        drugCategory = {
            GenericDesc: $("#txtGenerics").val(),
            GenericId: 0,
            DrugClassId: $("#cboDrugClass").val(),
            PharmacyGroup: $("#cboPharmacyGroup").val(),
            IsCombiDrug: $("#chkIsCombinationDrug").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }
    else {
        drugCategory = {
            GenericDesc: $("#txtGenerics").val(),
            GenericId: $("#txtGenericId").val(),
            DrugClassId: $("#cboDrugClass").val(),
            PharmacyGroup: $("#cboPharmacyGroup").val(),
            IsCombiDrug: $("#chkIsCombinationDrug").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }

    $.ajax({
        url: getBaseURL() + '/ConfigureDrug/InsertOrUpdateDrugCategory',
        type: 'POST',
        datatype: 'json',
        data: { drugCategory },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshCategories();
                $("#btnSaveDrugCategory").attr('disabled', false);
                fnBackToGrid();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDrugCategory").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDrugCategory").attr("disabled", false);
        }
    });
}

function validateDrugCategory() {
    if ($("#cboDrugClass").val() === "0" || $("#cboDrugClass").val() === "") {
        toastr.warning("Please Select a Drug Class");
        $('#cboDrugClass').focus();
        return false;
    }
    if ($("#cboPharmacyGroup").val() === "0" || $("#cboPharmacyGroup").val() === "") {
        toastr.warning("Please Select a Pharmacy Group");
        $('#cboPharmacyGroup').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtGenerics").val())) {
        toastr.warning("Please Enter the Generics");
        return false;
    }
}

function fnClearDrugGeneric() {
    $('#txtGenericId').val('');
    $('#txtGenerics').val('');
    $("#chkIsCombinationDrug").parent().removeClass("is-checked");
    $('#cboDrugClass').val("0");
    $('#cboDrugClass').selectpicker('refresh');
    $('#cboPharmacyGroup').val("0");
    $('#cboPharmacyGroup').selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");

    $("#btnSaveDrugCategory").html('<i class="fa fa-save"></i> '+localization.Save);
    $("#btnSaveDrugCategory").show();
}

function fnGridRefreshCategories() {
    $("#jqgDrugCategories").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}
  
function fnBackToGrid() {
    $("#divGridDrugCategories").show();
    $("#divDrugCategoriesForm").css('display', 'none');

}