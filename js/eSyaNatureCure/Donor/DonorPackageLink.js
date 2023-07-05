$(function () {
    fnGridLoadDonorPackageLink();
    $.contextMenu({
        selector: "#btnDonorPackageLink",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDonorPackageLink(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDonorPackageLink(event, 'view') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
})

var actiontype = "";

function fnPackage_change()
{
    fnGridLoadDonorPackageLink();
}
function fnGridLoadDonorPackageLink() {

    $("#jqgDonorPackageLink").GridUnload();
   
    $("#jqgDonorPackageLink").jqGrid({
        url: getBaseURL() + '/Donor/GetDonorLinkbyPackage?packageId=' + $("#cboPackageId").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DonorType, localization.PackageID, localization.DonorTypeDesc, localization.PackageDesc, localization.UsageStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "DonorType", width: 50, editable: true, align: 'left', hidden: true },
            { name: "PackageId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DonorTypeDesc", width: 250, editable: true, align: 'left', hidden: false },
            { name: "PackageDesc", width: 250, editable: true, align: 'left', hidden: false },
            { name: "UsageStatus", width: 75, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 75, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDonorPackageLink"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDonorPackageLink",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
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
        scrollOffset: 0, caption: 'Donor Package Link',
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgDonorPackageLink");
        },
    }).jqGrid('navGrid', '#jqpDonorPackageLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDonorPackageLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDonorPackageLink
    }).jqGrid('navButtonAdd', '#jqpDonorPackageLink', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDonorPackageLink
    });

}

function fnGridRefreshDonorPackageLink() {
    $("#jqgDonorPackageLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddDonorPackageLink() {
    if (IsStringNullorEmpty($("#cboPackageId").val()) || $("#cboPackageId").val() === '0' || $("#cboPackageId").val() === "0") {
        toastr.warning("Please Select the Package to Link Donor Type");
        return;
    }
    else
    {
        fnClearFields();
        $("#PopupDonorPackageLink").modal('show');
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $('#PopupDonorPackageLink').find('.modal-title').text(localization.PackageLinktoDonorType);
        $("#btnSaveDonorPackageLink").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveACtivities").show();
       

    }
}

function fnEditDonorPackageLink(e, actiontype) {
    var rowid = $("#jqgDonorPackageLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDonorPackageLink').jqGrid('getRowData', rowid);

    $('#PopupDonorPackageLink').modal('show');
    $('#cboPackageId').val(rowData.PackageId);
    $('#cboPackageId').selectpicker('refresh');
    $('#cboDonorType').val(rowData.DonorType);
    $('#cboDonorType').selectpicker('refresh');

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if (rowData.UsageStatus == 'true') {
        $("#chkUsageStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkUsageStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDonorPackageLink").attr("disabled", false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupDonorPackageLink').find('.modal-title').text(localization.PackageLinktoDonorType);
        $("#btnSaveDonorPackageLink").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#chkActiveStatus").prop('disabled', false);
        $("#chkUsageStatus").prop('disabled', false);
        $("#btnSaveDonorPackageLink").attr("disabled", false);
        $("#cboDonorType").next().attr('disabled', true);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $('#PopupDonorPackageLink').find('.modal-title').text(localization.ViewPackageLinktoDonorType);
        $("#btnSaveDonorPackageLink").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("#cboDonorType").next().attr('disabled', true);
        $("#btnSaveDonorPackageLink").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkUsageStatus").prop('disabled', true);
        $("#PopupDonorPackageLink").on('hidden.bs.modal', function () {
            $("#btnSaveDonorPackageLink").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    
}

function fnClearFields() {
    $('#cboDonorType').val("0");
    $('#cboDonorType').selectpicker('refresh');
    $("#cboDonorType").next().attr('disabled', false);
    $("#chkUsageStatus").parent().removeClass("is-checked");
    $("#chkActiveStatus").prop('disabled', false);
    $("#chkActiveStatus").parent().removeClass("is-checked");
    $("#chkUsageStatus").prop('disabled', false);
    $("#btnSaveDonorPackageLink").attr("disabled", false);
}

function fnSaveDonorPackageLink() {

    if (IsStringNullorEmpty($("#cboPackageId").val()) || $("#cboPackageId").val() === '0' || $("#cboPackageId").val() === "0") {
        toastr.warning("Please Select a Package");
        return;
    }
    if (IsStringNullorEmpty($("#cboDonorType").val()) || $("#cboDonorType").val() === '0' || $("#cboDonorType").val() === "0") {
        toastr.warning("Please Select a Donor Type");
        return;
    }
    objlink = {
        DonorType: $("#cboDonorType").val(),
        PackageId: $("#cboPackageId").val(),
        UsageStatus: $("#chkUsageStatus").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDonorPackageLink").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Donor/InsertOrUpdateDonorLinkwithPackage',
        type: 'POST',
        datatype: 'json',
        data: { obj: objlink },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveDonorPackageLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDonorPackageLink").modal('hide');
                fnClearFields();
                fnGridRefreshDonorPackageLink();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDonorPackageLink").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDonorPackageLink").attr("disabled", false);
        }
    });
}