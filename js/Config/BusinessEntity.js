var Isadd = 0;
var actiontype ="";
$(document).ready(function () {
    fnGridLoadBusinessEntity();
});

function fnGridLoadBusinessEntity() {
    $("#jqgBusinessEntity").jqGrid('GridUnload');

    $("#jqgBusinessEntity").jqGrid({
        url: getBaseURL() + '/BusinessStructure/GetBusinessEntities',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Entity Description", "Is Multi Segment Applicable", "", "Active Status","Actions"],
        colModel: [
            { name: "BusinessId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "BusinessDesc", width: 150, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "IsMultiSegmentApplicable", editable: true, width: 50, hidden: false, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "UsageStatus", editable: true, width: 95, align: 'left', resizable: false, hidden: true, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            { name: "ActiveStatus", editable: true, width: 45, hidden: false, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            {
                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditBusinessEntity(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditBusinessEntity(event,\'view\')"><i class="far fa-eye"></i> View </button>'

                }
            },
        ],
        pager: "#jqpBusinessEntity",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownnumWidth: 55,
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
        scrollOffset: 0, caption: 'Business Entity',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgBusinessEntity");
        },
    }).jqGrid('navGrid', '#jqpBusinessEntity', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpBusinessEntity', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBusinessEntity
    }).jqGrid('navButtonAdd', '#jqpBusinessEntity', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnAddBusinessEntity
        });
    fnAddGridSerialNoHeading();
}

function fnAddBusinessEntity() {
    fnClearFields();
    Isadd = 1;
    $('#txtBusinessEntityId').attr('readonly', false); 
        $('#PopupBusinessEntity').modal('show');
        $('#PopupBusinessEntity').modal({ backdrop: 'static', keyboard: false });
        $('#PopupBusinessEntity').find('.modal-title').text("Add Business Entity");
        $("#btnSaveBusinessEntity").html(' Save');
}

function fnEditBusinessEntity(e,actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBusinessEntity').jqGrid('getRowData', rowid);
    Isadd = 0;
    $('#txtBusinessEntityId').val(rowData.BusinessId).attr('readonly',true); 
    $('#txtEntityDescription').val(rowData.BusinessDesc);
    
    if (rowData.IsMultiSegmentApplicable == 'true') {
        $("#chkIsMultiSegmentApplicable").parent().addClass("is-checked");
    }
    else {
        $("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked");
    }
    $('#cboActiveStatus').val(rowData.ActiveStatus);
    $('#cboActiveStatus').selectpicker('refresh');  

    $('#PopupBusinessEntity').modal('show');
  
    if (actiontype.trim() == "edit") {
        $('#PopupBusinessEntity').find('.modal-title').text("Update Business Entity");
        $("#btnSaveBusinessEntity").html('Update');
    }
    if (actiontype.trim() == "view") {
        $('#PopupBusinessEntity').find('.modal-title').text("View Business Entity");
        $("#btnSaveBusinessEntity").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[type=checkbox]").attr('disabled', true);
        $("#PopupBusinessEntity").on('hidden.bs.modal', function () {
            $("#btnSaveBusinessEntity").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[type=checkbox]").attr('disabled', false);
        });
    }
}

function fnSaveBusinessEntity() {
    
    if (validationBusinessEntity() === false) {
        return;
    }
    if (Isadd === 1) {
        var businessentity = {
            BusinessId: $("#txtBusinessEntityId").val(),
            BusinessDesc: $("#txtEntityDescription").val(),
            IsMultiSegmentApplicable: $("#chkIsMultiSegmentApplicable").parent().hasClass("is-checked"),
            ActiveStatus: $("#cboActiveStatus").val(),
            Isadd: 1
        };

    }
    if (Isadd === 0) {
        businessentity = {
            BusinessId: $("#txtBusinessEntityId").val(),
            BusinessDesc: $("#txtEntityDescription").val(),
            IsMultiSegmentApplicable: $("#chkIsMultiSegmentApplicable").parent().hasClass("is-checked"),
            ActiveStatus: $("#cboActiveStatus").val(),
            Isadd: 0
        };
    }
    $.ajax({
        url: getBaseURL() + '/BusinessStructure/InsertOrUpdateBusinessEntity',
        type: 'POST',
        datatype: 'json',
        data: { businessentity },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#PopupBusinessEntity").modal('hide');
                fnClearFields();
                fnGridLoadBusinessEntity();
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

function validationBusinessEntity() {

    if (IsStringNullorEmpty($("#txtBusinessEntityId").val())) {
        toastr.warning("Please Enter Business Entity ID");
        return false;
    }
    if (IsStringNullorEmpty($("#txtEntityDescription").val())) {
        toastr.warning("Please Enter Entity Description");
        return false;
    }
    
}

function fnGridRefreshBusinessEntity() {
    $("#jqgBusinessEntity").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
 
function fnClearFields() {
    $("#txtBusinessEntityId").val('');
    $("#txtEntityDescription").val('');
    $("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked");
    $("#cboActiveStatus").val('true');
    $("#cboActiveStatus").selectpicker('refresh');
}

 
