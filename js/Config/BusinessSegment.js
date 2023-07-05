var Isadd = 0;
var actiontype = "";
$(document).ready(function () {
    fnGridLoadBusinessSegment();
});

function fnGridLoadBusinessSegment() {

    var businessId = $('#cboBusinessId').val();

    $("#jqgBusinessSegment").jqGrid('GridUnload');

    $("#jqgBusinessSegment").jqGrid({
        url: getBaseURL() + '/BusinessStructure/GetBusinessSegmentByBusinessId?BusinessId=' + businessId,
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["","", "Segment Description", "Is Location Applicable","","","","", "Active Status","Actions"],
        colModel: [
            { name: "BusinessId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "SegmentId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "SegmentDesc", width: 120, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "IsLocationApplicable", editable: true, width: 50, hidden: false, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "CurrencyName", width: 50, editable: true, align: 'left', hidden: true },
            { name: "CurrencyCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "TaxIdentification", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 70, hidden: false, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            {
                name: 'edit', search: false, align: 'left', width: 100, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditBusinessSegment(event,\'edit\')"><i class="fas fa-pencil-alt"></i> Edit </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditBusinessSegment(event,\'view\')"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpBusinessSegment",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: 'Business Segment',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgBusinessSegment");
        },
    }).jqGrid('navGrid', '#jqpBusinessSegment', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpBusinessSegment', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBusinessSegment
    }).jqGrid('navButtonAdd', '#jqpBusinessSegment', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnAddBusinessSegment
        });
    fnAddGridSerialNoHeading();
}

function fnAddBusinessSegment() {
    $('#txtBusinessSegmentId').attr('readonly', false);
    if ($("#cboBusinessId").val() == "0") {
        toastr.warning("Please Select Business Entity");
    }
    else {
        Isadd = 1;
        fnClearFields();
        $('#PopupBusinessSegment').modal('show');
        $('#PopupBusinessSegment').modal({ backdrop: 'static', keyboard: false });
        $('#PopupBusinessSegment').find('.modal-title').text("Add Business Segment");
        $("#btnSaveBusinessSegment").html(' Save');
    }
}

function fnEditBusinessSegment(e,actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBusinessSegment').jqGrid('getRowData', rowid);
    Isadd = 0;
    fnClearFields();

    $('#txtBusinessSegmentId').val(rowData.SegmentId).attr('readonly', true);
    $('#txtBusinessId').val(rowData.BusinessId);
    $('#txtSegmentDescription').val(rowData.SegmentDesc);

    if (rowData.IsLocationApplicable == 'true') {
        $("#chkIsLocationApplicable").parent().addClass("is-checked");
    }
    else {
        $("#chkIsLocationApplicable").parent().removeClass("is-checked");
    }

    $('#cboIsdcode').val(rowData.Isdcode);
    $('#cboIsdcode').selectpicker('refresh');
    $('#txtCurrencyCode').val(rowData.CurrencyCode);
    $('#txtCurrencyName').val(rowData.CurrencyName).attr('readonly', true);
    $('#cboTaxIdentification').val(rowData.TaxIdentification);
    $('#cboTaxIdentification').selectpicker('refresh');
    $('#cboActiveStatus').val(rowData.ActiveStatus);
    $('#cboActiveStatus').selectpicker('refresh');

    $('#PopupBusinessSegment').modal('show');
   
    if (actiontype.trim() == "edit") {
        $('#PopupBusinessSegment').find('.modal-title').text("Update Business Segment");
        $("#btnSaveBusinessSegment").html(' Update');
    }
    if (actiontype.trim() == "view") {
        $('#PopupBusinessSegment').find('.modal-title').text("View Business Segment");
        $("#btnSaveBusinessSegment").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupBusinessSegment").on('hidden.bs.modal', function () {
            $("#btnSaveBusinessSegment").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[type=checkbox]").attr('disabled', false);
        })
    }
}

function fnSaveBusinessSegment() {

    if (IsStringNullorEmpty($("#txtBusinessSegmentId").val())) {
        toastr.warning("Please Enter Segment SegmentId");
        return;
    }
    if (IsStringNullorEmpty($("#txtSegmentDescription").val())) {
        toastr.warning("Please Enter Segment Description");
        return;
    }
    if (Isadd === 1) {

        var BusinessSegment = {
            SegmentId: $("#txtBusinessSegmentId").val(),
            BusinessId: $("#cboBusinessId").val(),
            SegmentDesc: $("#txtSegmentDescription").val(),
            IsLocationApplicable: $("#chkIsLocationApplicable").parent().hasClass("is-checked"),
            Isdcode: $("#cboIsdcode").val(),
            CurrencyCode: $("#txtCurrencyCode").val(),
            TaxIdentification: $("#cboTaxIdentification").val(),
            ActiveStatus: $("#cboActiveStatus").val(),
            Isadd: 1
        }
    }
    if (Isadd === 0) {
        var BusinessSegment = {
            SegmentId: $("#txtBusinessSegmentId").val(),
            BusinessId: $("#cboBusinessId").val(),
            SegmentDesc: $("#txtSegmentDescription").val(),
            IsLocationApplicable: $("#chkIsLocationApplicable").parent().hasClass("is-checked"),
            Isdcode: $("#cboIsdcode").val(),
            CurrencyCode: $("#txtCurrencyCode").val(),
            TaxIdentification: $("#cboTaxIdentification").val(),
            ActiveStatus: $("#cboActiveStatus").val(),
            Isadd: 0
        };
    }
    $.ajax({
        url: getBaseURL() + '/BusinessStructure/InsertOrUpdateBusinessSegment',
        type: 'POST',
        datatype: 'json',
        data: { BusinessSegment },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridLoadBusinessSegment();
                $("#PopupBusinessSegment").modal('hide');
                fnClearFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}

function fnGridRefreshBusinessSegment() {
    $("#jqgBusinessSegment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGetCurrencyNamebyIsdCode() {

    var IsdCode = $("#cboIsdcode").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/BusinessStructure/GetCurrencyNamebyIsdCode?IsdCode=' + IsdCode,
        success: function (response) {
            if (response !== null) {
                $("#txtCurrencyName").val('');
                $("#txtCurrencyCode").val('');
                $("#txtCurrencyName").val(response.CurrencyName);
                $("#txtCurrencyCode").val(response.CurrencyCode);
            }
            else {
                $("#txtCurrencyName").val('');
                $("#txtCurrencyCode").val('');
            }
        },
        error: function (response) {
        }
    });
}
 
function fnClearFields() {
    $("#txtBusinessSegmentId").val('');
    $("#txtBusinessId").val('');
    $("#txtSegmentDescription").val('');
    $("#chkIsLocationApplicable").parent().removeClass("is-checked");
    $("#cboIsdcode").val('0');
    $("#cboIsdcode").selectpicker('refresh');
    $("#txtCurrencyCode").val('');
    $("#txtCurrencyName").val('').attr('readonly', true);
    $("#cboTaxIdentification").val('0');
    $("#cboTaxIdentification").selectpicker('refresh');
    $("#cboActiveStatus").val('true');
    $("#cboActiveStatus").selectpicker('refresh');
}
