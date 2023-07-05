function fnHideshowImageDiv() {
    var optionValue = $("#cboOptionType").val();
    if (optionValue == "IMG") {
        $("#divimage").show();
        $("#divOptionValue").hide();
        $("#txtOptionValue").val('');

    }
    else {
        $("#divimage").hide();
        $("#divOptionValue").show();
        document.getElementById('Photoimage').value = "";
        document.getElementById('imgPhoto').src = "";

    }
}

$(document).ready(function () {
    fnGridPackageAminities();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPackageAmenities",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnPackageAminities(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnPackageAminities(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnPackageAminities(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
function fnGridPackageAminities() {

    var packageId = $("#cboPackageId").val();
    $("#jqgPackageAmenities").GridUnload();

    $("#jqgPackageAmenities").jqGrid({
        url: getBaseURL() + '/PackageAmenities/GetAllPackageAmenitiesbyPackageId?packageId=' + packageId,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PackageId, localization.PackageDescription, localization.SerialNumber, localization.OptionType, localization.OptionValues, localization.OptionDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "PackageId", width: 10, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PackageDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "SerialNumber", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "OptionType", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "OptionValues", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false },
            { name: "OptionDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnPackageAminities(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnPackageAminities(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnPackageAminities(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPackageAmenities"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpPackageAmenities",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true, caption:"Package Amenities",
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgPackageAmenities");
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

    }).jqGrid('navGrid', '#jqpPackageAmenities', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPackageAmenities', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPackageAmenities
        }).jqGrid('navButtonAdd', '#jqpPackageAmenities', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPackageAminities
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPackageAmenities"),
            newWidth = $grid.closest(".PackageAmenitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPackageAminities() {
    $('#cboOptionType').attr('disabled', false).selectpicker('refresh');
    $('#txtSerialNumber').attr('readonly', false);
    fnClearFields();

    var id = $("#cboPackageId").val();
    if (id === 0 || id === "0") {
        toastr.warning("Please select any Package");
        return;
    }
    else {
        _isInsert = true;
        fnClearFields();
        $('#PopupPackageAmenities').modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#cboOptionType').val('0').selectpicker('refresh');
        $('#cboOptionType').attr('readonly', false).selectpicker('refresh');
        $('#txtSerialNumber').attr('readonly', false);
        $('#PopupPackageAmenities').find('.modal-title').text(localization.AddPackageAmenities);
        $("#btnSavePackageAmenities").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePackageAmenities").show();
        $("#btndeActivePackageAmenities").hide();

    }

}

var _isInsert = true;
function fnSavePackageAminities() {

    if (IsStringNullorEmpty($("#cboOptionType").val()) || $("#cboOptionType").val() === "0") {
        toastr.warning("Please Select a Option Type");
        return;
    }
    
    if (IsStringNullorEmpty($("#txtSerialNumber").val())) {
        toastr.warning("Please Enter the Serial Number");
        return;
    }
    
    var obj = new FormData();
    //appending image file object
    obj.append("Imagefile", $("#Photoimage").get(0).files[0]);
    obj.append("PackageId", document.getElementById("cboPackageId").value);
    obj.append("OptionType", document.getElementById("cboOptionType").value);
    obj.append("SerialNumber", document.getElementById("txtSerialNumber").value);
    obj.append("OptionValues", document.getElementById("txtOptionValue").value);
    obj.append("OptionDesc", document.getElementById("txtOptionDesc").value);
    obj.append("ActiveStatus", $('#chkActiveStatus').parent().hasClass("is-checked"));
    obj.append("isInsert", _isInsert);
    $("#btnSavePackageAmenities").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/PackageAmenities/InsertOrUpdatePackageAmenities',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSavePackageAmenities").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackageAmenities").modal('hide');
                fnClearFields();
                fnGridRefreshPackageAmenities();
            }
            else {
                toastr.error(response.Message);
                $("#btnSavePackageAmenities").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePackageAmenities").attr("disabled", false);
        }
    });
}

function fnGridRefreshPackageAmenities() {
    $("#jqgPackageAmenities").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#divimage").hide();
    $("#divOptionValue").show();
    document.getElementById('Photoimage').value = "";
    $('#imgPhoto').attr('src', '');
    $("#cboOptionType").val("0").selectpicker('refresh');
    $("#cboOptionType").attr('readonly', false).selectpicker('refresh');
    $('#txtSerialNumber').val('');
    $('#txtSerialNumber').attr('readonly', false);
    $('#txtOptionValue').val('');
    $('#txtOptionDesc').val('');
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePackageAmenities").attr("disabled", false);
    $("#btndeActivePackageAmenities").attr("disabled", false);
}

$("#btnCancelPackageAmenities").click(function () {
    $("#jqgPackageAmenities").jqGrid('resetSelection');
    $('#PopupPackageAmenities').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
  
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnDeletePackageAminities() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    obj_pkgami = {
        PackageId: $("#cboPackageId").val(),
        OptionType: $("#cboOptionType").val(),
        SerialNumber: $("#txtSerialNumber").val(),
        OptionValues: $("#txtOptionValue").val(),
        OptionDesc: $("#txtOptionDesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Status: a_status,
    };

    $("#btndeActivePackageAmenities").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PackageAmenities/ActiveOrDeActivePackageAmenities',
        type: 'POST',
        datatype: 'json',
        data: { objamenities: obj_pkgami },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActivePackageAmenities").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPackageAmenities").modal('hide');
                fnClearFields();
                fnGridRefreshPackageAmenities();
                $("#btndeActivePackageAmenities").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActivePackageAmenities").attr("disabled", false);
                $("#btndeActivePackageAmenities").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActivePackageAmenities").attr("disabled", false);
            $("#btndeActivePackageAmenities").html('De Activate');
        }
    });
}


function fnPackageAminities(e, actiontype) {

    $("#btnSavePackageAmenities").attr("disabled", false);

    _isInsert = false;



    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        var rowid = $("#jqgPackageAmenities").jqGrid('getGridParam', 'selrow');
        var rowData = $('#jqgPackageAmenities').jqGrid('getRowData', rowid);
        $('#cboPackageId').val(rowData.PackageId);
        $('#cboPackageId').selectpicker('refresh');

        fnGetPackageAmenities(rowData);


        $('#cboOptionType').attr('disabled', true).selectpicker('refresh');
        $('#txtSerialNumber').attr('readonly', true);

        $('#PopupPackageAmenities').find('.modal-title').text(localization.UpdatePackageAmenities);
        $("#btnSavePackageAmenities").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActivePackageAmenities").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkReadyForOccupancy").prop('disabled', false);
        $("#btnSavePackageAmenities").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }

        var rowid = $("#jqgPackageAmenities").jqGrid('getGridParam', 'selrow');
        var rowData = $('#jqgPackageAmenities').jqGrid('getRowData', rowid);
        $('#cboPackageId').val(rowData.PackageId);
        $('#cboPackageId').selectpicker('refresh');

        fnGetPackageAmenities(rowData);

        $('#PopupPackageAmenities').find('.modal-title').text(localization.ViewPackageAmenities);
        $("#btnSavePackageAmenities").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackageAmenities").hide();
        $("#btndeActivePackageAmenities").hide();
        $("#chkActiveStatus").prop('disabled', true);

        $("#PopupPackageAmenities").on('hidden.bs.modal', function () {
            $("#btnSavePackageAmenities").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        var rowid = $("#jqgPackageAmenities").jqGrid('getGridParam', 'selrow');
        var rowData = $('#jqgPackageAmenities').jqGrid('getRowData', rowid);
        $('#cboPackageId').val(rowData.PackageId);
        $('#cboPackageId').selectpicker('refresh');

        fnGetPackageAmenities(rowData);

        $('#PopupPackageAmenities').find('.modal-title').text("Activate/De Activate Package Amenities");
        $("#btnSavePackageAmenities").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePackageAmenities").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActivePackageAmenities").html(localization.DActivate);
        }
        else {
            $("#btndeActivePackageAmenities").html(localization.Activate);
        }

        $("#btndeActivePackageAmenities").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPackageAmenities").on('hidden.bs.modal', function () {
            $("#btnSavePackageAmenities").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}




function fnGetPackageAmenities(data) {
    if (data != null) {

        $.ajax({
            url: getBaseURL() + '/PackageAmenities/GetPackageAmenitiesbyOptiontype?packageId=' + data.PackageId + '&optionType=' + data.OptionType
                + '&serilalNo=' + data.SerialNumber,
            type: 'GET',
            datatype: 'json',
            success: function (response) {

                if (response != null) {

                    fnFillPackageAmenities(response);
                }
                else {
                    fnClearFields();

                }

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });
    }
}


function fnFillPackageAmenities(data) {


    $('#cboPackageId').val(data.PackageId);
    $('#cboPackageId').selectpicker('refresh');
    $('#PopupPackageAmenities').modal('show');
    $('#cboOptionType').val(data.OptionType).selectpicker('refresh');
    $('#txtSerialNumber').val(data.SerialNumber);
    $('#txtOptionValue').val(data.OptionValues);
    $('#txtOptionDesc').val(data.OptionDesc);

    if (data.ProfileImagePath != null) {
        //$('#imgPhotoimageblah').attr('src','/'+ data.ProfileImagePath);
        //for server path
        $('#imgPhotoimageblah').attr('src', data.ProfileImagePath);

    }
    else {
        $('#imgPhotoimageblah').attr('src', '');

    }

    if (data.OptionType == "IMG") {
        $("#divimage").show();
        $("#divOptionValue").hide();

    }
    else {
        $("#divimage").hide();
        $("#divOptionValue").show();

    }

    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");

}