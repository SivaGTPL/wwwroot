var dcnamePrefix = "";
var _dcnamePrefix = "";
var _drugform = 4;
var _dosage = 5;
var _compositionId = "0";
var prevSelectedID = '';
var drugBrandPrefix = '';
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
            //fnGridDrugBrands(drugBrandPrefix);
            _dcnamePrefix = drugBrandPrefix;
            fnGridLoadDrugCompositions(drugBrandPrefix);
            fnLoadCompositionsTree();
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
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugComposition(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugComposition(event, 'view') } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");

    fnLoadDrugCharacteristics();
});

function fnGridLoadDrugCompositions(dcnamePrefix) {
    $("#jqgDrugCompositions").jqGrid('GridUnload');
    $("#jqgDrugCompositions").jqGrid({
        url: getBaseURL() + '/Generic/GetCompositionByPrefix?prefix=' + dcnamePrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CompositionId, localization.Compositions, localization.DrugForm, localization.DrugFormDesc, localization.Dosage, localization.DosageDesc,localization.Active, localization.Actions],
        colModel: [
            { name: "CompositionId", width: 135, editable: true, align: 'left', hidden: true },
            { name: "CompositionDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "DrugForm", width: 20, editable: true, align: 'left', hidden: true },
            { name: "StrDrugForm", width: 90, editable: true, align: 'left', hidden: false },
            { name: "Dosage", width: 20, editable: true, align: 'left', hidden: true },
            { name: "StrDosage", width: 90, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 75, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDrugComposition(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditDrugComposition(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

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
        pager: "#jqpDrugCompositions",
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
        jqGrid('navGrid', '#jqpDrugCompositions', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpDrugCompositions', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddCompositions
        }).
        jqGrid('navButtonAdd', '#jqpDrugCompositions', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshCompositions
        });

    //    jqGrid('navGrid', '#jqpDrugCompositions', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDrugCompositions', {
    //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCompositions
    //}).jqGrid('navButtonAdd', '#jqpDrugCompositions', {
    //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddCompositions
    //    });
    fnAddGridSerialNoHeading();
    $("#jqgDrugCompositions").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" })
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

function fnGridAddCompositions() {
    //$("#divGridDrugCompositions").hide();
    //$("#divDrugCompositionsForm").css('display', 'block');
    $('#PopupComposition').modal('show');
    fnEnableControl(false);
    fnClearDrugComposition();
}
function fnTreeAddCompositions() {
    fnEnableControl(false);
    fnClearDrugComposition();
}

function fnEditDrugComposition(e, actiontype) {
    fnClearDrugComposition();
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowid = $("#jqgDrugCompositions").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugCompositions').jqGrid('getRowData', rowid);

    $('#txtCompositionId').val(rowData.CompositionId);
    $("#txtCompositions").val(rowData.CompositionDesc);

    $("#cboDrugForm").val(rowData.DrugForm);
    $("#cboDrugForm").selectpicker('refresh');
    $("#cboDosage").val(rowData.Dosage);
    $("#cboDosage").selectpicker('refresh');

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveDrugComposition").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        //$("#divGridDrugCompositions").hide();
        //$("#divDrugCompositionsForm").css('display', 'block');
        $('#PopupComposition').modal('show');

        $("#btnSaveDrugComposition").html(localization.Update);

        fnEnableControl(false);
    }
    if (actiontype.trim() == "view") {
        //$("#divGridDrugCompositions").hide();
        //$("#divDrugCompositionsForm").css('display', 'block');
        $('#PopupComposition').modal('show');
        $("#btnSaveDrugComposition").hide();
        fnEnableControl(true);
    }
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkIsCombinationDrug").attr('disabled', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSaveDrugComposition(_source) {
    if (_source == "Grid") {

        if (validateDrugComposition() === false) {
            return;
        }

        $("#btnSaveDrugComposition").attr('disabled', true);
        var genricId = $("#txtCompositionId").val();
        var drugComposition;
        if (genricId === null || genricId === "") {
            drugComposition = {
                CompositionDesc: $("#txtCompositions").val(),
                CompositionId: 0,
                DrugForm: $("#cboDrugForm").val(),
                Dosage: $("#cboDosage").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            };
        }
        else {
            drugComposition = {
                CompositionDesc: $("#txtCompositions").val(),
                CompositionId: $("#txtCompositionId").val(),
                DrugForm: $("#cboDrugForm").val(),
                Dosage: $("#cboDosage").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            };
        }
    }
    else if (_source == "Tree") {

        if (validateDrugCompositionTree() === false) {
            return;
        }

        $("#btnSaveDrugComposition-t").attr('disabled', true);
        var genricId = $("#txtCompositionId-t").val();
        var drugComposition;
        if (genricId === null || genricId === "") {
            drugComposition = {
                CompositionDesc: $("#txtCompositions-t").val(),
                CompositionId: 0,
                DrugForm: $("#cboDrugForm-t").val(),
                Dosage: $("#cboDosage-t").val(),
                ActiveStatus: $("#chkActiveStatus-t").parent().hasClass("is-checked")
            };
        }
        else {
            drugComposition = {
                CompositionDesc: $("#txtCompositions-t").val(),
                CompositionId: $("#txtCompositionId-t").val(),
                DrugForm: $("#cboDrugForm-t").val(),
                Dosage: $("#cboDosage-t").val(),
                ActiveStatus: $("#chkActiveStatus-t").parent().hasClass("is-checked")
            };
        }
    }
    else {
        return;
    }
    $.ajax({
        url: getBaseURL() + '/Generic/AddOrUpdateComposition',
        type: 'POST',
        datatype: 'json',
        data: { obj: drugComposition },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshCompositions();
                $("#btnSaveDrugComposition").attr('disabled', false);
                $("#btnSaveDrugComposition-t").attr('disabled', false);
                fnBackToGrid();
                $("#jsTreeComposition").jstree("destroy");
                fnLoadCompositionsTree();
                fnClearDrugComposition();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDrugComposition").attr('disabled', false);
                $("#btnSaveDrugComposition-t").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDrugComposition").attr("disabled", false);
        }
    });
}

function validateDrugComposition() {
    
    if ($("#cboDrugForm").val() === "0" || $("#cboDrugForm").val() === "") {
        toastr.warning("Please Select a Drug Form");
        $('#cboDrugForm').focus();
        return false;
    }
    if ($("#cboDosage").val() === "0" || $("#cboDosage").val() === "") {
        toastr.warning("Please Select a Dosage");
        $('#cboDosage').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtCompositions").val())) {
        toastr.warning("Please Enter the Compositions");
        return false;
    }
}
function validateDrugCompositionTree() {

    if ($("#cboDrugForm-t").val() === "0" || $("#cboDrugForm-t").val() === "") {
        toastr.warning("Please Select a Drug Form");
        $('#cboDrugForm-t').focus();
        return false;
    }
    if ($("#cboDosage-t").val() === "0" || $("#cboDosage-t").val() === "") {
        toastr.warning("Please Select a Dosage");
        $('#cboDosage-t').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtCompositions-t").val())) {
        toastr.warning("Please Enter the Compositions");
        return false;
    }
}

$("#lblGridView").click(function () {
    $("#divGridSection").css('display', 'block').fadeIn(3000);
    $("#divTreeSection").css('display', 'none');
})
$("#lblTreeView").click(function () {
   // fnLoadCompositionsTree();
    $("#divTreeSection").css('display', 'block').fadeIn(3000);
    $("#divGridSection").css('display', 'none');
})

function fnClearDrugComposition() {
    $('#txtCompositionId').val('');
    $('#txtCompositions').val('');    
    $('#cboDrugForm').val("0");
    $('#cboDrugForm').selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#cboDosage').val("0");
    $('#cboDosage').selectpicker('refresh');
    $("#btnSaveDrugComposition").html(localization.Save);
    $("#btnSaveDrugComposition").show();

    $('#txtCompositionId-t').val('');
    $('#txtCompositions-t').val('');
    $('#cboDrugForm-t').val("0");
    $('#cboDrugForm-t').selectpicker('refresh');
    $("#chkActiveStatus-t").parent().addClass("is-checked");
    $('#cboDosage-t').val("0");
    $('#cboDosage-t').selectpicker('refresh');
    $("#btnSaveDrugComposition-t").html(localization.Save);
    $("#btnSaveDrugComposition-t").show();
}

function fnGridRefreshCompositions() {
    $("#jqgDrugCompositions").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}
  
function fnBackToGrid() {
    $('#PopupComposition').modal('hide');
}

function fnLoadDrugCharacteristics() {
    var _list = _drugform + ',' + _dosage ;
    $.ajax({
        url: getBaseURL() + '/Generic/GetDrugCharacteristicsByTypeList',
        data: {
            l_type: _list
        },
        success: function (result) {
            var _cboDrugForm = result.filter(item => item.Type === _drugform);
            for (var i = 0; i < _cboDrugForm.length; i++) {
                $('#cboDrugForm').append('<option value="' + _cboDrugForm[i]["Id"] + '">' + _cboDrugForm[i]["Description"] + '</option>');
                $('#cboDrugForm-t').append('<option value="' + _cboDrugForm[i]["Id"] + '">' + _cboDrugForm[i]["Description"] + '</option>');
            }
            $("#cboDrugForm").selectpicker('refresh');
            $("#cboDrugForm-t").selectpicker('refresh');

            var _cboDosage = result.filter(item => item.Type === _dosage);
            for (var i = 0; i < _cboDosage.length; i++) {
                $('#cboDosage').append('<option value="' + _cboDosage[i]["Id"] + '">' + _cboDosage[i]["Description"] + '</option>');
                $('#cboDosage-t').append('<option value="' + _cboDosage[i]["Id"] + '">' + _cboDosage[i]["Description"] + '</option>');
            }
            $("#cboDosage").selectpicker('refresh');
            $("#cboDosage-t").selectpicker('refresh');

        }
    });

}

function fnLoadCompositionsTree() {
    $("#jsTreeComposition").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Generic/GetCompositionForTree?prefix=' + _dcnamePrefix,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jsTreeComposition").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jsTreeComposition");
            $(window).on('resize', function () {
                fnTreeSize("#jsTreeComposition");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });

    $("#jsTreeComposition").on('loaded.jstree', function () {
        $("#jsTreeComposition").jstree()._open_to(prevSelectedID);
        $('#jsTreeComposition').jstree().select_node(prevSelectedID);
    });

    $('#jsTreeComposition').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvComposition").hide();
               
                var parentNode = $("#jsTreeComposition").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {

                        //if (_userFormRole.IsInsert === false) {
                          
                        //    toastr.warning(errorMsgCS["E003"]);
                        //    return;
                        //}
                        _compositionId = "0";
                        $("#pnlAddComposition .mdl-card__title-text").text(localization.AddComposition);
                        $('#dvComposition').show();
                        fnTreeAddCompositions();
                    });
                }
                // If Child node is selected
                else if (parentNode == "C") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')




                    $('#View').on('click', function () {
                        //if (_userFormRole.IsView === false) {
                        //    $('#dvComposition').hide();
                        //    toastr.warning(errorMsgCS["E001"]);
                        //    return;
                        //}
                        $("#pnlAddComposition .mdl-card__title-text").text(localization.ViewComposition);
                        $("#btnSaveDrugComposition").attr('disabled', false);
                        $("#btnSaveDrugComposition-t").hide();
                        $('#dvComposition').show();
                        fnEnableControl(true);
                        _compositionId = data.node.id;
                        fnFillCompositionDetail(_compositionId);

                    });

                    $('#Edit').on('click', function () {
                        //if (_userFormRole.IsEdit === false) {
                        //    $('#dvComposition').hide();
                        //    toastr.warning(errorMsgCS["E002"]);
                        //    return;
                        //}
                        $("#pnlAddComposition .mdl-card__title-text").text(localization.EditComposition);
                        $("#btnSaveDrugComposition-t").attr('disabled', false);
                        $("#btnSaveDrugComposition-t").html(localization.Update);
                        $("#btnSaveDrugComposition-t").show();
                        $('#dvComposition').show();
                        fnEnableControl(false);
                        _compositionId = data.node.id;
                        fnFillCompositionDetail(_compositionId);

                    });



                }
                else {
                    $("#dvComposition").hide();
                  
                }

            }
        }
    });
    $('#jsTreeComposition').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jsTreeComposition').jstree().deselect_node(closingNode.children);
    });
}

function fnFillCompositionDetail(_compositionId) {
    $.ajax({
        url: getBaseURL() + '/Generic/GetCompositionByID',
        data: {
            CompositionID: _compositionId
        },
        success: function (result) {
            $('#txtCompositionId-t').val(result.CompositionId);
            $("#txtCompositions-t").val(result.CompositionDesc);
            $("#cboDrugForm-t").val(result.DrugForm);
            $("#cboDrugForm-t").selectpicker('refresh');
            $("#cboDosage-t").val(result.Dosage);
            $("#cboDosage-t").selectpicker('refresh');
            
            if (result.ActiveStatus === true) {
                $("#chkActiveStatus-t").parent().addClass("is-checked");
            }
            else {
                $("#chkActiveStatus-t").parent().removeClass("is-checked");
            }
        }
    });
}