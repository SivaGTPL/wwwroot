var drugBrandPrefix ;
var drugVolume;
$(function () {
    //

     //Single Character alphabet Selection
    $(".filter-char").click(function () {
        $('.filter-div').empty();
        $('.filter-char').removeClass('active');
        drugBrandPrefix = $(this).text();
        
        fnGridDrugBrands(drugBrandPrefix);

        $("#lblSelectedAlphabets").text(drugBrandPrefix);
        $("#divAlphabets").hide(100);
        
        $(this).addClass('active');

        
        $("#divSearch").show(500);

        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");        
        var numbers = "0123456789".split("");
        // From Single char to double char 
        if (drugBrandPrefix == "0-9") {
            $.each(numbers, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">'  + numbers[letter] + '</span>'));
            });
        }
        else if (drugBrandPrefix == "All") {
            $.each(alphabet, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + alphabet[letter]+ '</span>'));
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
            fnGridDrugBrands(drugBrandPrefix);

            $(this).addClass('active');

            
           // console.log($(this).text()); Active two character alphabets.
        })
        
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
    fnGridDrugBrands(drugBrandPrefix);
})

function fnISDCodeChanges() {
    fnGridDrugBrands(drugBrandPrefix);
}

function fnDrugCategoryChanges() {
    $("#cboFormulation").empty().selectpicker('refresh');
    $('#txtDosage').val('');
    $('#txtDrugForm').val('');

    $.ajax({
        url: getBaseURL() + '/Drug/GetDrugFormulationList?DrugGenerics=' + $('#cboGenerics').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            //$('#cboFormulation').empty();
            $("#cboFormulation").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboFormulation").append($("<option></option>").val(result[i]["DrugFormulaID"]).html(result[i]["DrugFormulation"]));
                }
            }
            $('#cboFormulation').val($("#cboFormulation option:first").val());
            $('#cboFormulation').selectpicker('refresh');

        }
    });
}

function fnDrugFormulationChanges() {
    $.ajax({
        url: getBaseURL() + '/Drug/GetDrugFormulationDetails?DrugFormulation=' + $('#cboFormulation').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (result != null) {
                $('#txtDosage').val(result.DosageDesc);
                $('#txtDrugForm').val(result.DrugFormDesc);
                fnGridDrugBrands(drugBrandPrefix);
            }
        }
    });
}

function fnGridDrugBrands(drugBrandPrefix) {
    $("#jqgDrugBrands").jqGrid('GridUnload');
    $("#jqgDrugBrands").jqGrid({
        url: getBaseURL() + '/Drug/GetDrugBrandListByNamePrefix?ISDCode=' + $("#cboISDCode").val() + '&drugFormulaId=' + $("#cboFormulation").val() + '&drugBrandPrefix=' + drugBrandPrefix,
        datatype: 'json',
        //mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["GenericID", "DrugFormulaID", localization.DrugCode, localization.DrugBrand, localization.ManufacturerId, localization.Manufacturer, localization.PrintDescription, localization.PackSize, localization.PackingId, localization.Packing, localization.Volume, localization.ReferenceMRP, localization.BarcodeID, localization.Active, localization.Actions],
        colModel: [
            { name: "GenericID", width: 15, editable: true, align: 'left', hidden: true },
            { name: "DrugFormulaID", width: 150, editable: true, align: 'left', hidden: true },
            { name: "DrugCode", width: 15, editable: true, align: 'left', hidden: true },
            { name: "DrugBrand", width: 150, editable: true, align: 'left', hidden: false },
            { name: "ManufacturerID", width: 15, editable: true, align: 'left', hidden: true },
            { name: "Manufacturer", width: 120, editable: true, align: 'left', hidden: false },
            { name: "DrugPrintDesc", width: 15, editable: true, align: 'left', hidden: true },
            { name: "PackSize", width: 85, editable: true, align: 'left', hidden: false },
            { name: "PackingId", width: 15, editable: true, align: 'left', hidden: true },
            { name: "Packing", width: 85, editable: true, align: 'left', hidden: false },
            { name: "DrugVolume", width: 85, editable: true, align: 'left', hidden: false },
            { name: "ReferenceMRP", width: 15, editable: true, align: 'left', hidden: true },
            { name: "BarcodeId", width: 15, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width: 74, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDrugBrands(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditDrugBrands(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

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
        //scrollOffset: 0,
        loadComplete: function (data) {
            SetGridControlByAction();
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

    //    jqGrid('navGrid', '#jqpDrugBrands', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDrugBrands', {
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
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

//function fnDrugParameters() {
//    $("#jqgDrugParameters").jqGrid({
//        data: [{ DrugParameter: 'Is Banned', ActiveStatus: true }, { DrugParameter: 'Is Narcotic', ActiveStatus: false }],
//        datatype: 'local',
//        colNames: ["Drug Parameter", "Active"],
//        colModel: [
//            { name: "DrugParameter", width: 140, editable: true, align: 'left', hidden: false },
//            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        rowNum: 100000,
//        pgtext: null,
//        pgbuttons: false,
//        loadonce: true,
//        rownumWidth: 25,
//        viewrecords: false,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
         
//    }).jqGrid('navGrid', '#jqpDrugParameters', { add: false, edit: false, search: false, del: false, refresh: false });
//}

function fnGridAddDrugBrands() {

    fnClearFields();

    if ($("#cboISDCode").val() === "0" || $("#cboISDCode").val() === "") {
        toastr.warning("Please Select ISD Code");
        $('#cboISDCode').focus();
        return;
    }
    if ($("#cboGenerics").val() === "0" || $("#cboGenerics").val() === "") {
        toastr.warning("Please Select Generics");
        $('#cboGenerics').focus();
        return;
    }
    if ($("#cboFormulation").val() === "0" || $("#cboFormulation").val() === "") {
        toastr.warning("Please Select Formulation");
        $('#cboFormulation').focus();
        return;
    }
    fnEnableControl(false);
    $("#divGrid").hide();
    $("#divDrugBrandsForm").css("display", "block");
    $("#divAlphabets,#divSearch").hide(500);
}

function fnDrugPacking_onChanged() {
    $("#txtDrugVolume").val('');
    if ($("#cboPacking").val() === "0" || $("#cboPacking").val() === "") {
        toastr.warning("Please Select Packing");
        $('#cboPacking').focus();
        return;
    }
    $.ajax({
        url: getBaseURL() + '/Drug/IsDrugVolumeRequired?packingID=' + $('#cboPacking').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (result != null) {
                if (result.IsDrugVolumeRequired) {
                    drugVolume = 1;
                    $("#txtDrugVolume").attr('disabled', false);
                }
                else {
                    drugVolume = 0;
                    $("#txtDrugVolume").attr('disabled', true);
                }
            }
        }
    });
}

function fnFillDrugFormulationDetails() {
    $.ajax({
        url: getBaseURL() + '/Drug/GetDrugFormulationDetails?DrugFormulation=' + $('#cboFormulation').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (result != null) {
                $('#txtDosage').val(result.DosageDesc);
                $('#txtDrugForm').val(result.DrugFormDesc);
                fnGridDrugBrands(drugBrandPrefix);
            }
        }
    });
}

function fnEditDrugBrands(e, actiontype) {
    fnClearFields();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDrugBrands').jqGrid('getRowData', rowid);

    $("#cboGenerics").val(rowData.GenericID).selectpicker('refresh');
    fnDrugCategoryChanges();
    $("#cboFormulation").val(rowData.DrugFormulaID).selectpicker('refresh');
    fnFillDrugFormulationDetails();
    $("#txtDrugCode").val(rowData.DrugCode);
    $("#txtDrugBrand").val(rowData.DrugBrand);
    $("#cboManufacturer").val(rowData.ManufacturerID).selectpicker('refresh');
    $("#txtPrintDesc").val(rowData.DrugPrintDesc);
    $("#txtPackSize").val(rowData.PackSize);
    $("#cboPacking").val(rowData.PackingId).selectpicker('refresh');
    $("#txtDrugVolume").val(rowData.DrugVolume);

    $.ajax({
        url: getBaseURL() + '/Drug/IsDrugVolumeRequired?packingID=' + $('#cboPacking').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (result != null) {
                if (result.IsDrugVolumeRequired) {
                    drugVolume = 1;
                    $("#txtDrugVolume").attr('disabled', false);
                }
                else {
                    drugVolume = 0;
                    $("#txtDrugVolume").attr('disabled', true);
                }
            }
        }
    });

    $("#txtBarCodeID").val(rowData.BarcodeId);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    eSyaParams.ClearValue();

    $.ajax({
        async: false,
        url: getBaseURL() + "/Drug/GetDrugParameterList?drugCode=" + $("#txtDrugCode").val(),
        type: 'POST',
        datatype: 'json',
        success: function (result) {
            if (result != null) {
                eSyaParams.SetJSONValue(result.l_FormParameter);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });

    $("#btnAddDrugBrand").attr('disabled', false);

    if (actiontype.trim() == "edit") {
       
        $("#divGrid").hide();
        $("#divDrugBrandsForm").css("display", "block");
        $("#divAlphabets,#divSearch").hide(500);

        $("#btnAddDrugBrand").html(localization.Update);

        fnEnableControl(false);
    }
    if (actiontype.trim() == "view") {
        $("#divGrid").hide();
        $("#divDrugBrandsForm").css("display", "block");
        $("#divAlphabets,#divSearch").hide(500);

        $("#btnAddDrugBrand").hide();

        fnEnableControl(true);
    }
}

function fnEnableControl(val) {
    $("input[type=checkbox]").attr('disabled', val);
    $("#txtDrugBrand").attr('disabled', val);
    $("#txtPackSize").attr('disabled', val);
    $("#txtDrugVolume").attr('disabled', val);
    $("#txtPrintDesc").attr('disabled', val);
    $("#txtBarCodeID").attr('disabled', val);
    //$("input,textarea").attr('readonly', val);
    //$("#chkActiveStatus").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSaveDrugBrand() {

    if (validatiOnSave() === false) {
        return;
    }
    $("#btnAddDrugBrand").attr('disabled', true);
    var DrugCode = $("#txtDrugCode").val();

    var DrugBrands;
    if (DrugCode == null || DrugCode == "") {
        DrugBrands = {
            DrugCode: 0,
            ISDCode: $("#cboISDCode").val(),
            GenericID: $("#cboGenerics").val(),
            DrugFormulaID: $("#cboFormulation").val(),
            ManufacturerID: $("#cboManufacturer").val(),
            DrugBrand: $("#txtDrugBrand").val(),
            DrugPrintDesc: $("#txtPrintDesc").val(),
            PackSize: $("#txtPackSize").val(),
            PackingId: $("#cboPacking").val(),
            DrugVolume: $("#txtDrugVolume").val(),
            BarcodeID: $("#txtBarCodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };

    }
    else {
        DrugBrands = {
            DrugCode: $("#txtDrugCode").val(),
            ISDCode: $("#cboISDCode").val(),
            GenericID: $("#cboGenerics").val(),
            DrugFormulaID: $("#cboFormulation").val(),
            ManufacturerID: $("#cboManufacturer").val(),
            DrugBrand: $("#txtDrugBrand").val(),
            DrugPrintDesc: $("#txtPrintDesc").val(),
            PackSize: $("#txtPackSize").val(),
            PackingId: $("#cboPacking").val(),
            DrugVolume: $("#txtDrugVolume").val(),
            BarcodeID: $("#txtBarCodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }


    var fmParams = eSyaParams.GetJSONValue();
    DrugBrands.l_FormParameter = fmParams;

    $.ajax({
        url: getBaseURL() + '/Drug/InsertOrUpdateDrugBrand',
        type: 'POST',
        datatype: 'json',
        data: { DrugBrands },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnAddDrugBrand").attr('disabled', false);
                //location.reload();
                fnGridRefreshDrugBrands();
                fnBackToGrid();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnAddDrugBrand").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            $("#btnAddDrugBrand").attr('disabled', false);
            toastr.error(error.statusText);
        }
    });
}

function validatiOnSave() {
    if (IsStringNullorEmpty($("#txtDrugBrand").val())) {
        toastr.warning("Please Enter Drug Brand");
        return false;
    }
    if ($("#cboManufacturer").val() === "0" || $("#cboManufacturer").val() === "") {
        toastr.warning("Please Select Manufacturer");
        return false;
    }
    if (IsStringNullorEmpty($("#txtPackSize").val()) || $("#txtPackSize").val() === "0") {
        toastr.warning("Please Enter Pack Size");
        return false;
    }
    if ($("#cboPacking").val() === "0" || $("#cboPacking").val() === "") {
        toastr.warning("Please Select Packing");
        return false;
    }
    if (drugVolume == 1 && IsStringNullorEmpty($("#txtDrugVolume").val())) {
        toastr.warning("Please Enter Drug Volume");
        return false;
    }
}

function fnClearFields() {
    $("#txtDrugCode").val('');
    $("#txtDrugBrand").val('');
    $("#cboManufacturer").val('0');
    $("#cboManufacturer").selectpicker('refresh');
    $("#txtPackSize").val('');
    $("#cboPacking").val('0');
    $("#cboPacking").selectpicker('refresh');
    $("#txtDrugVolume").val('');
    $("#txtPrintDesc").val('');
    $("#txtBarCodeID").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");

    eSyaParams.ClearValue();

    $("#btnAddDrugBrand").html(' Save');
    $("#btnAddDrugBrand").show();
}

function fnGridRefreshDrugBrands() {
    $("#jqgDrugBrands").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $("#divGrid").show();
    $("#divDrugBrandsForm").css("display", "none");
    $("#divSearch").hide(500);
    $('.filter-div').empty();
    $("#divAlphabets").show(500);
    $('.filter-char').removeClass('active');
    $("input[type=checkbox]").attr('disabled', true);
    $("select").next().attr('disabled', false);
}