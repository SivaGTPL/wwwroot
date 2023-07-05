$(document).ready(function () {

    fnLoadUnitofMeasureGrid();   

    $("#txtUOMPurchaseDesc").focus(function () {
        
        if (!IsStringNullorEmpty($("#txtUOMPurchase").val())) {

            $.ajax({
                url: getBaseURL() + '/Inventory/GetUOMPDescriptionbyUOMP?uomp=' + $("#txtUOMPurchase").val(),
                type: 'POST',
                datatype: 'json',
                async: false,
                success: function (response) {
                    if (response !== null) {

                        $("#txtUOMPurchaseDesc").val('');
                        $("#txtUOMPurchaseDesc").val(response.Uompdesc);
                        return true;
                    }
                    else {
                        $("#txtUOMPurchaseDesc").val('');
                        return false;
                    }
                },
                error: function (error) {
                    toastr.error(error.statusText);
                }
            });

        }

    });

    $("#txtUOMStackDesc").focus(function () {
        
        if (!IsStringNullorEmpty($("#txtUOMStack").val())) {
        $.ajax({
            url: getBaseURL() + '/Inventory/GetUOMSDescriptionbyUOMS?uoms=' + $("#txtUOMStack").val(),
            type: 'POST',
            datatype: 'json',
            async: false,
            success: function (response) {

                if (response !== null) {
                    
                    $("#txtUOMStackDesc").val('');
                    $("#txtUOMStackDesc").val(response.Uomsdesc);
                    return true;
                }
                else {
                    $("#txtUOMStackDesc").val('');
                    return false;
                }
            },
            error: function (error) {
                toastr.error(error.statusText);
            }
            });

        }

    });

});

function fnLoadUnitofMeasureGrid() {

    $("#jqgUnitofMeasure").GridUnload();

    $("#jqgUnitofMeasure").jqGrid({
        url: getBaseURL() + '/Inventory/GetUnitofMeasurements',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.UnitofMeasure, localization.UnitofPurchase, localization.Description, localization.UOMStock, localization.Description, localization.ConvFactor, localization.Active, localization.Actions],

        colModel: [

            { name: "UnitOfMeasure", width: 80, editable: true, align: 'left', hidden: true },
            { name: "Uompurchase", width: 80, editable: true, align: 'left', hidden: false },
            { name: "Uompdesc", width: 80, editable: true, align: 'left', hidden: false },
            { name: "Uomstock", width: 80, editable: true, align: 'left', hidden: false },
            { name: "Uomsdesc", width: 80, editable: true, align: 'left', hidden: false },
            { name: "ConversionFactor", width: 80, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditUnitofMeasure(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'+
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditUnitofMeasure(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditUnitofMeasure(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                 }
            },

        ],    
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpUnitofMeasure",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'Unit of Measure',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen('jqpUnitofMeasure');
        },
    }).jqGrid('navGrid', '#jqpUnitofMeasure', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpUnitofMeasure', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUnitofMeasure
    }).jqGrid('navButtonAdd', '#jqpUnitofMeasure', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddUnitofMeasure
        });
    fnAddGridSerialNoHeading();
}

function fnAddUnitofMeasure() {
    fnClearFields();
    $("#PopupUnitofMeasure").modal('show');
    $(".modal-title").text(localization.AddUnitofMeasure);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveUnitofMeasure").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveUnitofMeasure").show();
    $("#btnDeactivateUnitofMeasure").hide();
}

function fnEditUnitofMeasure(e,actiontype) {
    fnClearFields();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgUnitofMeasure').jqGrid('getRowData', rowid);
    $("#txtUnitofMeasure").val(rowData.UnitOfMeasure);
    $("#txtUOMPurchase").val(rowData.Uompurchase);
    $("#txtUOMPurchaseDesc").val(rowData.Uompdesc);
    $("#txtUOMStack").val(rowData.Uomstock);
    $("#txtUOMStackDesc").val(rowData.Uomsdesc);
    $("#txtConversionFactor").val(rowData.ConversionFactor);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateUnitofMeasure").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateUnitofMeasure").html(localization.Activate);
    }

    $("#chkActiveStatus").prop('disabled', false);
    $("#PopupUnitofMeasure").modal('show');
    $(".modal-title").text(localization.EditUnitofMeasure);
    $("#btnSaveUnitofMeasure").html('<i class="fa fa-sync"></i>' + localization.Update);
    $("#btnSaveUnitofMeasure").attr("disabled", false);
    if (actiontype.trim() == "edit") {
        $("#btnSaveUnitofMeasure").show();
        fnEnableUnitofMeasure(false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveUnitofMeasure").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveUnitofMeasure").show();
        $("#btnDeactivateUnitofMeasure").hide();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveUnitofMeasure,#btnDeactivateUnitofMeasure").hide();
        fnEnableUnitofMeasure(true);
        $("#chkActiveStatus").prop('disabled', true);
        $(".modal-title").text(localization.ViewUnitofMeasure);
    }
    if (actiontype.trim() == "delete") {
        $("#btnSaveUnitofMeasure").hide();
        fnEnableUnitofMeasure(true);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnDeactivateUnitofMeasure").show();
        $(".modal-title").text("Active / De Active Unit of Measure" );
    }
    $("#PopupUnitofMeasure").on('hidden.bs.modal', function () {
        $("#btnSaveUnitofMeasure").show();
        fnEnableUnitofMeasure(false);
    });
}

function fnSaveUnitofMeasure() {
  
    if (validationUnitofMeasure() === false) {
        return;
    }
        uoms = {
            UnitOfMeasure: $("#txtUnitofMeasure").val() === '' ? 0 : $("#txtUnitofMeasure").val(),
            Uompurchase: $("#txtUOMPurchase").val(),
            Uompdesc: $("#txtUOMPurchaseDesc").val(),
            Uomstock: $("#txtUOMStack").val(),
            Uomsdesc: $("#txtUOMStackDesc").val(),
            ConversionFactor: $("#txtConversionFactor").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSaveUnitofMeasure").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Inventory/InsertOrUpdateUnitofMeasurement',
        type: 'POST',
        datatype: 'json',
        data: { uoms },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveUnitofMeasure").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupUnitofMeasure").modal('hide');
                fnClearFields();
                fnLoadUnitofMeasureGrid();
                return true;
            }
            else{
                toastr.error(response.Message);
                $("#btnSaveUnitofMeasure").attr("disabled", false);
                return false;
            }
            $("#btnSaveUnitofMeasure").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveUnitofMeasure").attr("disabled", false);
        }
    });



}

function validationUnitofMeasure() {
    if (IsStringNullorEmpty($("#txtUOMPurchase").val())) {
        toastr.warning("Please Enter Unit of Purchase");
        return false;
    }
    if (IsStringNullorEmpty($("#txtUOMPurchaseDesc").val())) {
        toastr.warning("Please Enter Unit of Purchase Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtUOMStack").val())) {
        toastr.warning("Please Enter Unit of Stack");
        return false;
    }
    if (IsStringNullorEmpty($("#txtUOMStackDesc").val())) {
        toastr.warning("Please Enter Unit of Stack Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtConversionFactor").val())) {
        toastr.warning("Please Enter Conversion Factor");
        return false;
    }
}

function fnGridRefreshUnitofMeasure() {

    $("#jqgUnitofMeasure").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtUnitofMeasure").val('');
    $("#txtUOMPurchase").val('');
    $("#txtUOMPurchaseDesc").val('');
    $("#txtUOMStack").val('');
    $("#txtUOMStackDesc").val('');
    $("#txtConversionFactor").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveUnitofMeasure").attr("disabled", false);
}

function fnEnableUnitofMeasure(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    var btn_editEnable = document.querySelectorAll('#jqgEdit');
    var btn_viewEnable = document.querySelectorAll('#jqgView');
    var btn_deleteEnable = document.querySelectorAll('#jqgDelete');
    for (var i = 0; i < btn_editEnable.length; i++) {
        btn_editEnable[i].disabled = false;
    }
    for (var j = 0; j < btn_viewEnable.length; j++) {
        btn_viewEnable[j].disabled = false;
    }
    for (var k = 0; k < btn_deleteEnable.length; k++) {
        btn_deleteEnable[k].disabled = false;
    }


    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var btn_editDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < btn_editDisable.length; i++) {
            btn_editDisable[i].disabled = true;
            btn_editDisable[i].className = "ui-state-disabled";
        }
    }
    if (_userFormRole.IsView === false) {
        var btn_viewDisable = document.querySelectorAll('#jqgView');
        for (var j = 0; j < btn_viewDisable.length; j++) {
            btn_viewDisable[j].disabled = true;
            btn_viewDisable[j].className = "ui-state-disabled";
        }
    }

    if (_userFormRole.IsDelete === false) {
        var btn_deleteDisable = document.querySelectorAll('#jqgDelete');
        for (var k = 0; k < btn_deleteDisable.length; k++) {
            btn_deleteDisable[k].disabled = true;
            btn_deleteDisable[k].className = "ui-state-disabled";
        }
    }
}

function fnDeleteUnitofMeasure() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateUnitofMeasure").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Inventory/ActiveOrDeActiveUnitofMeasure?status=' + a_status + '&unitId=' + $("#txtUnitofMeasure").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateUnitofMeasure").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupUnitofMeasure").modal('hide');
                fnGridRefreshUnitofMeasure();
                fnClearFields();
                $("#btnDeactivateUnitofMeasure").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateUnitofMeasure").attr("disabled", false);
                $("#btnDeactivateUnitofMeasure").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateUnitofMeasure").attr("disabled", false);
            $("#btnDeactivateUnitofMeasure").html(localization.DeActivate);
        }
    });
}


