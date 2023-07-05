var dcnamePrefix = "";
var _dcnamePrefix = "";
var _group = 1;
var _therapClass = 2;
var _usedTreat = 3;
var _genericId = "0";
var prevSelectedID = '';

$(document).ready(function () {
    $(".dot").click(function () {
        $('.filter-div').empty();
        $('.dot').removeClass('active');
        drugBrandPrefix = $(this).text();
        // fnGridLoadDrugCompositions(dcnamePrefix);
        $("#divAlphabets").hide(100);
        $(this).addClass('active');
        $("#divSearch").show(500);
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var numbers = "0123456789".split("");
        // From Single char to double char 
        if (drugBrandPrefix == "0-9") {
            $.each(numbers, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + numbers[letter] + '</span>'));
            });
        }
        else if (drugBrandPrefix == "All") {
            $.each(alphabet, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + alphabet[letter] + '</span>'));
            });
        }
        else {
            $.each(alphabet, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + drugBrandPrefix + alphabet[letter].toLowerCase() + '</span>'));
            });
        }
        //Two Character alphabets Selection
        $(".filter-chars").click(function () {
            $(".filter-chars").removeClass('active');
            drugBrandPrefix = $(this).text();
            _dcnamePrefix = drugBrandPrefix;
            fnGridLoadDrugCategories(drugBrandPrefix);
            fnLoadGenericsTree();
            $(this).addClass('active');
        });
        //Going Back to the A to Z Selection
        $("#lblBackToAlphabets").click(function () {
            $("#divSearch").hide(500);
            $('.filter-div').empty();
            $("#divAlphabets").show(500);
            $('.filter-char').removeClass('active');
            $("#divDrugBrandsForm").css("display", "none");
            $("#divGrid").show();
        })
    });
    $.contextMenu({
        // define which elements trigger this menu
        selector: ".btn-actions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugGeneric(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugGeneric(event, 'view') } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");

    fnLoadDrugCharacteristics();
});

function fnGridLoadDrugCategories(dcnamePrefix) {
    $("#jqgDrugCategories").jqGrid('GridUnload');
    $("#jqgDrugCategories").jqGrid({
        url: getBaseURL() + '/Generic/GetGenericByPrefix?prefix=' + dcnamePrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.GenericId, localization.Generics, localization.IsCombinationDrugs, localization.PharmacyGroup, localization.PharmacyGroupDesc, localization.TheraupaticClass, localization.TheraupaticClassDesc, localization.UsedinTreatOf, localization.UsedinTreatOfDesc, localization.Usagestatus, localization.Active, localization.Actions],
        colModel: [
            { name: "GenericId", width: 135, editable: true, align: 'left', hidden: true },
            { name: "GenericDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "IsCombiDrug", width: 85, editable: true, align: 'center', hidden: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "PharmacyGroup", width: 20, editable: true, align: 'left', hidden: true },
            { name: "StrPharmacyGroup", width: 90, editable: true, align: 'left', hidden: false },
            { name: "TheraupaticClass", width: 20, editable: true, align: 'left', hidden: true },
            { name: "StrTheraupaticClass", width: 90, editable: true, align: 'left', hidden: false },
            { name: "UsedinTreatOf", width: 20, editable: true, align: 'left', hidden: true },
            { name: "StrUsedinTreatOf", width: 90, editable: true, align: 'left', hidden: false },
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
                name: 'Action', search: false, align: 'left', width: 70, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnDrugActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
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
            //SetGridControlByAction();
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
    $("#jqgDrugCategories").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" })
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

function fnGridAddCategories() {
    //$("#divGridDrugCategories").hide();
    //$("#divDrugCategoriesForm").css('display', 'block');
    $('#PopupGeneric').modal('show');
    fnEnableControl(false);
    fnClearDrugGeneric();
}
function fnTreeAddCategories() {
    fnEnableControl(false);
    fnClearDrugGeneric();
}

function fnEditDrugGeneric(e, actiontype) {
    fnClearDrugGeneric();
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowid = $("#jqgDrugCategories").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugCategories').jqGrid('getRowData', rowid);

    $('#txtGenericId').val(rowData.GenericId);
    $("#txtGenerics").val(rowData.GenericDesc);

    $("#cboPharmacyGroup").val(rowData.PharmacyGroup);
    $("#cboPharmacyGroup").selectpicker('refresh');
    $("#cboTheraupaticClass").val(rowData.TheraupaticClass);
    $("#cboTheraupaticClass").selectpicker('refresh');
    $("#cboUsedinTreatOf").val(rowData.UsedinTreatOf);
    $("#cboUsedinTreatOf").selectpicker('refresh');

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
        //$("#divGridDrugCategories").hide();
        //$("#divDrugCategoriesForm").css('display', 'block');
        $('#PopupGeneric').modal('show');

        $("#btnSaveDrugCategory").html(localization.Update);

        fnEnableControl(false);
    }
    if (actiontype.trim() == "view") {
        //$("#divGridDrugCategories").hide();
        //$("#divDrugCategoriesForm").css('display', 'block');
        $('#PopupGeneric').modal('show');
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

function fnSaveDrugCategory(_source) {
    if (_source == "Grid") {

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
                PharmacyGroup: $("#cboPharmacyGroup").val(),
                TheraupaticClass: $("#cboTheraupaticClass").val(),
                UsedinTreatOf: $("#cboUsedinTreatOf").val(),
                IsCombiDrug: $("#chkIsCombinationDrug").parent().hasClass("is-checked"),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            };
        }
        else {
            drugCategory = {
                GenericDesc: $("#txtGenerics").val(),
                GenericId: $("#txtGenericId").val(),
                PharmacyGroup: $("#cboPharmacyGroup").val(),
                TheraupaticClass: $("#cboTheraupaticClass").val(),
                UsedinTreatOf: $("#cboUsedinTreatOf").val(),
                IsCombiDrug: $("#chkIsCombinationDrug").parent().hasClass("is-checked"),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            };
        }
    }
    else if (_source == "Tree") {

        if (validateDrugCategoryTree() === false) {
            return;
        }

        $("#btnSaveDrugCategory-t").attr('disabled', true);
        var genricId = $("#txtGenericId-t").val();
        var drugCategory;
        if (genricId === null || genricId === "") {
            drugCategory = {
                GenericDesc: $("#txtGenerics-t").val(),
                GenericId: 0,
                PharmacyGroup: $("#cboPharmacyGroup-t").val(),
                TheraupaticClass: $("#cboTheraupaticClass-t").val(),
                UsedinTreatOf: $("#cboUsedinTreatOf-t").val(),
                IsCombiDrug: $("#chkIsCombinationDrug-t").parent().hasClass("is-checked"),
                ActiveStatus: $("#chkActiveStatus-t").parent().hasClass("is-checked")
            };
        }
        else {
            drugCategory = {
                GenericDesc: $("#txtGenerics-t").val(),
                GenericId: $("#txtGenericId-t").val(),
                PharmacyGroup: $("#cboPharmacyGroup-t").val(),
                TheraupaticClass: $("#cboTheraupaticClass-t").val(),
                UsedinTreatOf: $("#cboUsedinTreatOf-t").val(),
                IsCombiDrug: $("#chkIsCombinationDrug-t").parent().hasClass("is-checked"),
                ActiveStatus: $("#chkActiveStatus-t").parent().hasClass("is-checked")
            };
        }
    }
    else {
        return;
    }
    $.ajax({
        url: getBaseURL() + '/Generic/AddOrUpdateGeneric',
        type: 'POST',
        datatype: 'json',
        data: { obj: drugCategory },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshCategories();
                $("#btnSaveDrugCategory").attr('disabled', false);
                $("#btnSaveDrugCategory-t").attr('disabled', false);
                fnBackToGrid();
                $("#jsTreeGeneric").jstree("destroy");
                fnLoadGenericsTree();
                fnClearDrugGeneric();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDrugCategory").attr('disabled', false);
                $("#btnSaveDrugCategory-t").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDrugCategory").attr("disabled", false);
        }
    });
}

function validateDrugCategory() {
    
    if ($("#cboPharmacyGroup").val() === "0" || $("#cboPharmacyGroup").val() === "") {
        toastr.warning("Please Select a Pharmacy Group");
        $('#cboPharmacyGroup').focus();
        return false;
    }
    if ($("#cboTheraupaticClass").val() === "0" || $("#cboTheraupaticClass").val() === "") {
        toastr.warning("Please Select a Theraupatic Class");
        $('#cboTheraupaticClass').focus();
        return false;
    }
    if ($("#cboUsedinTreatOf").val() === "0" || $("#cboUsedinTreatOf").val() === "") {
        toastr.warning("Please Select a Used In Treat Of");
        $('#cboUsedinTreatOf').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtGenerics").val())) {
        toastr.warning("Please Enter the Generics");
        return false;
    }
}
function validateDrugCategoryTree() {

    if ($("#cboPharmacyGroup-t").val() === "0" || $("#cboPharmacyGroup-t").val() === "") {
        toastr.warning("Please Select a Pharmacy Group");
        $('#cboPharmacyGroup-t').focus();
        return false;
    }
    if ($("#cboTheraupaticClass-t").val() === "0" || $("#cboTheraupaticClass-t").val() === "") {
        toastr.warning("Please Select a Theraupatic Class");
        $('#cboTheraupaticClass-t').focus();
        return false;
    }
    if ($("#cboUsedinTreatOf-t").val() === "0" || $("#cboUsedinTreatOf-t").val() === "") {
        toastr.warning("Please Select a Used In Treat Of");
        $('#cboUsedinTreatOf-t').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtGenerics-t").val())) {
        toastr.warning("Please Enter the Generics");
        return false;
    }
}

$("#lblGridView").click(function () {
    $("#divGridSection").css('display', 'block').fadeIn(3000);
    $("#divTreeSection").css('display', 'none');
})
$("#lblTreeView").click(function () {
   // fnLoadGenericsTree();
    $("#divTreeSection").css('display', 'block').fadeIn(3000);
    $("#divGridSection").css('display', 'none');
})

function fnClearDrugGeneric() {
    $('#txtGenericId').val('');
    $('#txtGenerics').val('');
    $("#chkIsCombinationDrug").parent().removeClass("is-checked");
    $('#cboPharmacyGroup').val("0");
    $('#cboPharmacyGroup').selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#cboTheraupaticClass').val("0");
    $('#cboTheraupaticClass').selectpicker('refresh');
    $('#cboUsedinTreatOf').val("0");
    $('#cboUsedinTreatOf').selectpicker('refresh');
    $("#btnSaveDrugCategory").html(localization.Save);
    $("#btnSaveDrugCategory").show();

    $('#txtGenericId-t').val('');
    $('#txtGenerics-t').val('');
    $("#chkIsCombinationDrug-t").parent().removeClass("is-checked");
    $('#cboPharmacyGroup-t').val("0");
    $('#cboPharmacyGroup-t').selectpicker('refresh');
    $("#chkActiveStatus-t").parent().addClass("is-checked");
    $('#cboTheraupaticClass-t').val("0");
    $('#cboTheraupaticClass-t').selectpicker('refresh');
    $('#cboUsedinTreatOf-t').val("0");
    $('#cboUsedinTreatOf-t').selectpicker('refresh');
    $("#btnSaveDrugCategory-t").html(localization.Save);
    $("#btnSaveDrugCategory-t").show();
}

function fnGridRefreshCategories() {
    $("#jqgDrugCategories").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}
  
function fnBackToGrid() {
    $('#PopupGeneric').modal('hide');
}

function fnLoadDrugCharacteristics() {
    var _list = _group + ',' + _therapClass +',' + _usedTreat ;
    $.ajax({
        url: getBaseURL() + '/Generic/GetDrugCharacteristicsByTypeList',
        data: {
            l_type: _list
        },
        success: function (result) {
            var _cboGroup = result.filter(item => item.Type === _group);
            for (var i = 0; i < _cboGroup.length; i++) {
                $('#cboPharmacyGroup').append('<option value="' + _cboGroup[i]["Id"] + '">' + _cboGroup[i]["Description"] + '</option>');
                $('#cboPharmacyGroup-t').append('<option value="' + _cboGroup[i]["Id"] + '">' + _cboGroup[i]["Description"] + '</option>');
            }
            $("#cboPharmacyGroup").selectpicker('refresh');
            $("#cboPharmacyGroup-t").selectpicker('refresh');

            var _cboTherapClass = result.filter(item => item.Type === _therapClass);
            for (var i = 0; i < _cboTherapClass.length; i++) {
                $('#cboTheraupaticClass').append('<option value="' + _cboTherapClass[i]["Id"] + '">' + _cboTherapClass[i]["Description"] + '</option>');
                $('#cboTheraupaticClass-t').append('<option value="' + _cboTherapClass[i]["Id"] + '">' + _cboTherapClass[i]["Description"] + '</option>');
            }
            $("#cboTheraupaticClass").selectpicker('refresh');
            $("#cboTheraupaticClass-t").selectpicker('refresh');

            var _cboUsedTreat = result.filter(item => item.Type === _usedTreat);
            for (var i = 0; i < _cboUsedTreat.length; i++) {
                $('#cboUsedinTreatOf').append('<option value="' + _cboUsedTreat[i]["Id"] + '">' + _cboUsedTreat[i]["Description"] + '</option>');
                $('#cboUsedinTreatOf-t').append('<option value="' + _cboUsedTreat[i]["Id"] + '">' + _cboUsedTreat[i]["Description"] + '</option>');
            }
            $("#cboUsedinTreatOf").selectpicker('refresh');
            $("#cboUsedinTreatOf-t").selectpicker('refresh');
        }
    });

}

function fnLoadGenericsTree() {
    $("#jsTreeGeneric").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Generic/GetGenericForTree?prefix=' + _dcnamePrefix,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jsTreeGeneric").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jsTreeGeneric");
            $(window).on('resize', function () {
                fnTreeSize("#jsTreeGeneric");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });

    $("#jsTreeGeneric").on('loaded.jstree', function () {
        $("#jsTreeGeneric").jstree()._open_to(prevSelectedID);
        $('#jsTreeGeneric').jstree().select_node(prevSelectedID);
    });

    $('#jsTreeGeneric').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvGeneric").hide();
               
                var parentNode = $("#jsTreeGeneric").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {

                        //if (_userFormRole.IsInsert === false) {
                          
                        //    toastr.warning(errorMsgCS["E003"]);
                        //    return;
                        //}
                        _genericId = "0";
                        $("#pnlAddGeneric .mdl-card__title-text").text(localization.AddGeneric);
                        $('#dvGeneric').show();
                        fnTreeAddCategories();
                    });
                }
                // If Child node is selected
                else if (parentNode == "G") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')




                    $('#View').on('click', function () {
                        //if (_userFormRole.IsView === false) {
                        //    $('#dvGeneric').hide();
                        //    toastr.warning(errorMsgCS["E001"]);
                        //    return;
                        //}
                        $("#pnlAddGeneric .mdl-card__title-text").text(localization.ViewGeneric);
                        $("#btnSaveDrugCategory").attr('disabled', false);
                        $("#btnSaveDrugCategory-t").hide();
                        $('#dvGeneric').show();
                        fnEnableControl(true);
                        _genericId = data.node.id;
                        fnFillGenericDetail(_genericId);

                    });

                    $('#Edit').on('click', function () {
                        //if (_userFormRole.IsEdit === false) {
                        //    $('#dvGeneric').hide();
                        //    toastr.warning(errorMsgCS["E002"]);
                        //    return;
                        //}
                        $("#pnlAddGeneric .mdl-card__title-text").text(localization.EditGeneric);
                        $("#btnSaveDrugCategory-t").attr('disabled', false);
                        $("#btnSaveDrugCategory-t").html(localization.Update);
                        $("#btnSaveDrugCategory-t").show();
                        $('#dvGeneric').show();
                        fnEnableControl(false);
                        _genericId = data.node.id;
                        fnFillGenericDetail(_genericId);

                    });



                }
                else {
                    $("#dvGeneric").hide();
                  
                }

            }
        }
    });
    $('#jsTreeGeneric').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jsTreeGeneric').jstree().deselect_node(closingNode.children);
    });
}

function fnFillGenericDetail(_genericId) {
    $.ajax({
        url: getBaseURL() + '/Generic/GetGenericByID',
        data: {
            GenericID: _genericId
        },
        success: function (result) {
            $('#txtGenericId-t').val(result.GenericId);
            $("#txtGenerics-t").val(result.GenericDesc);
            $("#cboPharmacyGroup-t").val(result.PharmacyGroup);
            $("#cboPharmacyGroup-t").selectpicker('refresh');
            $("#cboTheraupaticClass-t").val(result.TheraupaticClass);
            $("#cboTheraupaticClass-t").selectpicker('refresh');
            $("#cboUsedinTreatOf-t").val(result.UsedinTreatOf);
            $("#cboUsedinTreatOf-t").selectpicker('refresh');

            if (result.IsCombiDrug === true) {
                $("#chkIsCombinationDrug-t").parent().addClass("is-checked");
            }
            else { $("#chkIsCombinationDrug-t").parent().removeClass("is-checked"); }

            if (result.ActiveStatus === true) {
                $("#chkActiveStatus-t").parent().addClass("is-checked");
            }
            else {
                $("#chkActiveStatus-t").parent().removeClass("is-checked");
            }
        }
    });
}