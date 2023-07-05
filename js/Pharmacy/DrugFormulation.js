var dfnamePrefix = "";

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        dfnamePrefix = $(this).text();
        fnGridLoadDrugFormulation(dfnamePrefix);
        $(this).addClass('active');
    });
    fnGridLoadDrugFormulation(dfnamePrefix);
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDrugBrands",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugFormulation(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugFormulation(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnGridLoadDrugFormulation(dfnamePrefix) {
    $("#jqgDrugBrands").jqGrid('GridUnload');
    $("#jqgDrugBrands").jqGrid({
        url: getBaseURL() + '/ConfigureDrug/GetDrugFormulationListByNamePrefix?drugFormulationPrefix=' + dfnamePrefix,
        datatype: 'json',
        // mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.GenericId, localization.Generic, localization.FormulationId, localization.Formulation, localization.DrugClassId, localization.DrugClass, localization.Dosage, localization.DosageDesc, localization.DrugForm, localization.DrugFormDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "GenericId", width: 135, editable: true, align: 'left', hidden: true },
            { name: "GenericDesc", width: 120, editable: true, align: 'left', hidden: false },
            { name: "DrugFormulaID", width: 50, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DrugFormulation", width: 160, editable: true, align: 'left', hidden: false },
            { name: "DrugClassId", width: 20, editable: true, align: 'left', hidden: true },
            { name: "DrugClassDesc", width: 75, editable: true, align: 'left', hidden: false },
            { name: "Dosage", width: 20, editable: true, align: 'left', hidden: true },
            { name: "DosageDesc", width: 85, editable: true, align: 'left', hidden: false },
            { name: "DrugForm", width: 20, editable: true, align: 'left', hidden: true },
            { name: "DrugFormDesc", width: 85, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 75, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDrugFormulation(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditDrugFormulation(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDrugBrands"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDrugBrands",
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
        jqGrid('navGrid', '#jqpDrugBrands', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpDrugBrands', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddDrugBrands
        }).
        jqGrid('navButtonAdd', '#jqpDrugBrands', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshDrugBrands
        });

    //    jqGrid('navGrid', '#jqpDrugBrands', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDrugBrands', {
    //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDrugBrands
    //}).jqGrid('navButtonAdd', '#jqpDrugBrands', {
    //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddDrugBrands
    //});
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnGetGenericDetails() {
    
    var drugCategory = $("#cboDrugCategory").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/ConfigureDrug/GetGenericDetails?drugCategory=' + drugCategory,
        success: function (result) {
            $('#txtDrugClass').val(result.DrugClassDesc);
        }
    });
}

function fnGridAddDrugBrands() {
    $("#divGrid").hide();
    $("#divDrugBrandsForm").css("display", "block");
    fnEnableControl(false);
    $("#cboDrugCategory").attr('disabled', false);
    fnClearControl();
}

function fnEditDrugFormulation(e, actiontype) {
    fnClearControl();
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgDrugBrands').jqGrid('getRowData', rowid);
    var rowid = $("#jqgDrugBrands").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugBrands').jqGrid('getRowData', rowid);
    $("#cboDrugCategory").val(rowData.GenericId);
    $("#cboDrugCategory").selectpicker('refresh');
    
    $('#txtFormulationId').val(rowData.DrugFormulaID);
    $("#txtFormulation").val(rowData.DrugFormulation);
    $("#txtDrugClass").val(rowData.DrugClassDesc);

    $("#cboDosage").val(rowData.Dosage);
    $("#cboDosage").selectpicker('refresh');
    $("#cboDrugForm").val(rowData.DrugForm);
    $("#cboDrugForm").selectpicker('refresh');

    //$("#cboDrugCategory").attr('disabled', true);
    
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveDrugFormulation").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $("#divGrid").hide();
        $("#divDrugBrandsForm").css('display', 'block');

        $("#btnSaveDrugFormulation").html("<i class='fa fa-sync'></i> "+localization.Update);

        fnEnableControl(false);
        $("#cboDrugCategory").attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $("#divGrid").hide();
        $("#divDrugBrandsForm").css('display', 'block');

        $("#btnSaveDrugFormulation").hide();
        
        fnEnableControl(true);
        $("#cboDrugCategory").attr('disabled', true);
        
        
    }
}

function fnSaveDrugFormulation() {
    if (validateDrugFormulation() === false) {
        return;
    }

    $("#btnSaveDrugFormulation").attr('disabled', true);

    var formulationId = $("#txtFormulationId").val();
    var obj;
    if (formulationId === null || formulationId === "") {
        obj = {
            GenericID: $("#cboDrugCategory").val(),
            DrugFormulaID: 0,
            DrugFormulation: $("#txtFormulation").val(),
            Dosage: $("#cboDosage").val(),
            DrugForm: $("#cboDrugForm").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }
    else {
        obj = {
            GenericID: $("#cboDrugCategory").val(),
            DrugFormulaID: $("#txtFormulationId").val(),
            DrugFormulation: $("#txtFormulation").val(),
            Dosage: $("#cboDosage").val(),
            DrugForm: $("#cboDrugForm").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }

    $.ajax({
        url: getBaseURL() + '/ConfigureDrug/InsertOrUpdateDrugFormulation',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshDrugBrands();
                $("#btnSaveDrugFormulation").attr('disabled', false);
                fnBackToGrid();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDrugFormulation").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDrugFormulation").attr("disabled", false);
        }
    });
}

function validateDrugFormulation() {
    if ($("#cboDrugCategory").val() === "0" || $("#cboDrugCategory").val() === "") {
        toastr.warning("Please Select a Drug Category");
        $('#cboDrugCategory').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtFormulation").val())) {
        toastr.warning("Please Enter the Drug Categpry Description");
        return false;
    }
    if ($("#cboDosage").val() === "0" || $("#cboDosage").val() === "") {
        toastr.warning("Please Select a Dosage");
        $('#cboDosage').focus();
        return false;
    }
    if ($("#cboDrugForm").val() === "0" || $("#cboDrugForm").val() === "") {
        toastr.warning("Please Select a Drug Form");
        $('#cboDrugForm').focus();
        return false;
    }
}

function fnEnableControl(val) {
    $("#txtDrugClass").attr('disabled', true);
    $("#txtFormulation").attr('disabled', val);
    //$("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("select").next().attr('disabled', val);
    //$("#cboDosage").attr('disabled', val);
    //$("#cboDrugForm").attr('disabled', val);
}

function fnClearControl() {
    $('#cboDrugCategory').val("0");
    $('#cboDrugCategory').selectpicker('refresh');
    $('#txtFormulationId').val('');
    $('#txtFormulation').val('');
    $('#txtDrugClass').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");

    $('#cboDosage').val("0");
    $('#cboDosage').selectpicker('refresh');
    $('#cboDrugForm').val("0");
    $('#cboDrugForm').selectpicker('refresh');

    $("#btnSaveDrugFormulation").html("<i class='fa fa-save'></i> "+localization.Save);
    $("#btnSaveDrugFormulation").show();
}

function fnGridRefreshDrugBrands() {
    $("#jqgDrugBrands").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $("#divGrid").show();
    $("#divDrugBrandsForm").css("display", "none");
}