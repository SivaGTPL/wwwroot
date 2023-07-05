var prevSelectedID = '';
var dcnamePrefix = "";
var _dcnamePrefix = "";
var drugBrandPrefix = '';
$(document).ready(function () {
    $(".dot").click(function () {
        $('.filter-div').empty();
        $('.dot').removeClass('active');
        drugBrandPrefix = $(this).text();
        // fnGridLoadDrugCompositions(dcnamePrefix);
        _dcnamePrefix = drugBrandPrefix;
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
            fnGridLoadGenericComposition(drugBrandPrefix);
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

    fnLoadGenericComposition();
});

function fnGridLoadGenericComposition(dcnamePrefix) {
    $("#jqgDrugCategories").jqGrid('GridUnload');
    $("#jqgDrugCategories").jqGrid({
        url: getBaseURL() + '/Generic/GetGenericComposition?prefix=' + dcnamePrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.GenericId, localization.Generics, localization.CompositionId, localization.Compositions, localization.Active, localization.Actions],
        colModel: [
            { name: "GenericId", width: 135, editable: true, align: 'left', hidden: true },
            { name: "GenericDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "CompositionId", width: 135, editable: true, align: 'left', hidden: true },
            { name: "CompositionDesc", width: 170, editable: true, align: 'left', hidden: false },
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

    $("#cboGeneric").val(rowData.GenericId);
    $("#cboGeneric").selectpicker('refresh');
    $("#cboComposition").val(rowData.CompositionId);
    $("#cboComposition").selectpicker('refresh');
    
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
        
            drugCategory = {
                GenericId: $("#cboGeneric").val(),
                CompositionId: $("#cboComposition").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            };
        
    }
    else if (_source == "Tree") {

        if (validateDrugCategoryTree() === false) {
            return;
        }

        $("#btnSaveDrugCategory-t").attr('disabled', true);
        var genricId = $("#txtGenericId-t").val();
        var drugCategory;      
            drugCategory = {
                GenericId: $("#cboGeneric-t").val(),
                CompositionId: $("#cboComposition-t").val(),
                ActiveStatus: $("#chkActiveStatus-t").parent().hasClass("is-checked")
            };
        
    }
    else {
        return;
    }
    $.ajax({
        url: getBaseURL() + '/Generic/AddOrUpdateGenericComposition',
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
    
    if ($("#cboGeneric").val() === "0" || $("#cboGeneric").val() === "") {
        toastr.warning("Please Select a Generic");
        $('#cboGeneric').focus();
        return false;
    }
    if ($("#cboComposition").val() === "0" || $("#cboComposition").val() === "") {
        toastr.warning("Please Select a Composition");
        $('#cboComposition').focus();
        return false;
    }
    
}
function validateDrugCategoryTree() {

    if ($("#cboGeneric-t").val() === "0" || $("#cboGeneric-t").val() === "") {
        toastr.warning("Please Select a Generic");
        $('#cboGeneric-t').focus();
        return false;
    }
    if ($("#cboComposition-t").val() === "0" || $("#cboComposition-t").val() === "") {
        toastr.warning("Please Select a Composition");
        $('#cboComposition-t').focus();
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
    $('#cboGeneric').val("0");
    $('#cboGeneric').selectpicker('refresh');
    $('#cboComposition').val("0");
    $('#cboComposition').selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveDrugCategory").html(localization.Save);
    $("#btnSaveDrugCategory").show();

    $('#cboGeneric-t').val("0");
    $('#cboGeneric-t').selectpicker('refresh');
    $('#cboComposition-t').val("0");
    $('#cboComposition-t').selectpicker('refresh');
    $("#chkActiveStatus-t").parent().addClass("is-checked");
    $("#btnSaveDrugCategory-t").html(localization.Save);
    $("#btnSaveDrugCategory-t").show();
}

function fnGridRefreshCategories() {
    $("#jqgDrugCategories").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}
  
function fnBackToGrid() {
    $('#PopupGeneric').modal('hide');
}

function fnLoadGenericComposition() {
    
    $.ajax({
        url: getBaseURL() + '/Generic/GetGenericByPrefix?prefix=All',
        success: function (result) {
            var l_generic = result.filter(item => item.ActiveStatus === true);
            for (var i = 0; i < l_generic.length; i++) {
                $('#cboGeneric').append('<option value="' + l_generic[i]["GenericId"] + '">' + l_generic[i]["GenericDesc"] + '</option>');
                $('#cboGeneric-t').append('<option value="' + l_generic[i]["GenericId"] + '">' + l_generic[i]["GenericDesc"] + '</option>');
            }
            $("#cboGeneric").selectpicker('refresh');
            $("#cboGeneric-t").selectpicker('refresh');
        }
    });
    $.ajax({
        url: getBaseURL() + '/Generic/GetCompositionByPrefix?prefix=All',
        success: function (result) {
            var l_composition = result.filter(item => item.ActiveStatus === true);
            for (var i = 0; i < l_composition.length; i++) {
                $('#cboComposition').append('<option value="' + l_composition[i]["CompositionId"] + '">' + l_composition[i]["CompositionDesc"] + '</option>');
                $('#cboComposition-t').append('<option value="' + l_composition[i]["CompositionId"] + '">' + l_composition[i]["CompositionDesc"] + '</option>');
            }
            $("#cboComposition").selectpicker('refresh');
            $("#cboComposition-t").selectpicker('refresh');
        }
    });

}

function fnLoadGenericsTree() {
    $("#jsTreeGeneric").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Generic/GetGenericCompositionForTree?prefix=' + _dcnamePrefix,
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
                else if (parentNode.startsWith("G")) {
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
                        _genericId = parentNode.substring(1);
                        _compositionID = data.node.id.substring(_genericId.length + 1);
                        fnFillGenericDetail(_genericId, _compositionID);

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
                        _genericId = parentNode.substring(1);
                        _compositionID = data.node.id.substring(_genericId.length + 1);
                        fnFillGenericDetail(_genericId, _compositionID);

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

function fnFillGenericDetail(_genericId, _compositionID) {
  

    $.ajax({
        url: getBaseURL() + '/Generic/GetGenericCompositionByID',
        data: {
            GenericID: _genericId,
            CompositionID: _compositionID
        },
        success: function (result) {
            $("#cboGeneric-t").val(result.GenericId);
            $("#cboGeneric-t").selectpicker('refresh');
            $("#cboComposition-t").val(result.CompositionId);
            $("#cboComposition-t").selectpicker('refresh');
           
            if (result.ActiveStatus === true) {
                $("#chkActiveStatus-t").parent().addClass("is-checked");
            }
            else {
                $("#chkActiveStatus-t").parent().removeClass("is-checked");
            }
        }
    });
}