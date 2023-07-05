
var isUpdate = 0;

$(document).ready(function () {

    fnLoadProcessRuleGrid();
});

function fnLoadProcessRuleGrid() {
    $('#jqgProcessMaster').jqGrid('GridUnload');
    $("#jqgProcessMaster").jqGrid({
        url: getBaseURL() + '/ApplicationRules/GetProcessRules',
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["", "Process Description","Is Segment Specific", "System Control", "Process Control", " Status", ""],
        colModel: [
            { name: "ProcessId", width: 40, align: 'left', editable: true, resizable: false, hidden: true },
            { name: "ProcessDesc", width: 200, align: 'left', editable: true, resizable: false },
            { name: "IsSegmentSpecific", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "SystemControl", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ProcessControl", editable: true, width: 85, align: "left", edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "A: All;S: Specific" } },
            { name: "ActiveStatus", editable: true, width: 85, align: "left", edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            {
                name: 'edit', search: false, align: 'center', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditProcessRule(event)"><i class="fas fa-pen"></i> Edit </button>'
                }
            },
        ],
        pager: "#jqpProcessRule",
        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption:'Process Master',
        loadComplete: function () {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
        },

    }).jqGrid('navGrid', '#jqpProcessRule', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpProcessRule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshProcessRule
    }).jqGrid('navButtonAdd', '#jqpProcessRule', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnAddProcessRule
        }); fnAddGridSerialNoHeading();
}
function fnAddProcessRule() {

    $("#PopupProcessmaster").modal("show");
    $('#PopupProcessmaster').find('.modal-title').text("Add Process Rule");
    $("#btnSaveProcessMaster").html(' Save');
    $("#txtProcessId").val('');
    $("#txtProcessDescription").val('');
    $('#cboProcessControl').val("A");
    $('#cboProcessControl').selectpicker('refresh');
    $("#chkIsSegmentSpecific").parent().removeClass("is-checked");
    $("#chkSystemControl").parent().removeClass("is-checked");
    $('#cboProcessStatus').val("true");
    $('#cboProcessStatus').selectpicker('refresh');
    $("#btnSaveProcessMaster").attr("disabled", false);
    $("#txtProcessId").removeAttr("readonly");
    isUpdate = 0;
}

function fnRefreshProcessRule() {

    $("#jqgProcessMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveProcessMaster() {

    if ($("#txtProcessId").val().trim().length <= 0 || $("#txtProcessId").val() == 0) {
        toastr.warning("Please Enter Process Id");
        return;
    }
    else if ($('#txtProcessDescription').val() == null || $('#txtProcessDescription').val() == '') {
        toastr.warning("Please Enter Process Description");
        return;
    }
    else if ($('#cboProcessControl').val() == null || $('#cboProcessControl').val() == '') {
        toastr.warning("Please Select Process Control");
        return;
    }
    else if ($('#cboActiveStatus').val() == null || $('#cboActiveStatus').val() == '') {
        toastr.warning("Please Select Active Status");
        return;
    }

    var isChkSystemControl;
    var chkSystemControl = $("#chkSystemControl").parent().hasClass("is-checked");
    if (chkSystemControl) {
        isChkSystemControl = true;
    }
    else {
        isChkSystemControl = false;
    }

    var isChkIsSegmentSpecific;
    var chkIsSegmentSpecific = $("#chkIsSegmentSpecific").parent().hasClass("is-checked");
    if (chkIsSegmentSpecific) {
        isChkIsSegmentSpecific = true;
    }
    else {
        isChkIsSegmentSpecific = false;
    }

    var obj = {
        ProcessId: $("#txtProcessId").val(),
        ProcessDesc: $("#txtProcessDescription").val(),
        IsSegmentSpecific: isChkIsSegmentSpecific,
        SystemControl: isChkSystemControl,
        ProcessControl: $('#cboProcessControl').val(),
        ActiveStatus: $('#cboActiveStatus').val()
    };
    $("#btnSaveProcessMaster").attr("disabled", true);

    var URL = getBaseURL() + '/ApplicationRules/InsertProcessMaster';
    if (isUpdate == 1)
        URL = getBaseURL() + '/ApplicationRules/UpdateProcessMaster';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
        async: false,
        success: function (response) {

            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveProcessMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnRefreshProcessRule();
                fnClosePopUp();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveProcessMaster").attr("disabled", false);
            }

            function fnClosePopUp() {
                setTimeout(function () {
                    $("#PopupProcessmaster").modal('hide');
                    $("#btnSaveProcessMaster").attr("disabled", false);
                }, 3000);
                fnResetInputFields();
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveProcessMaster").attr("disabled", false);
        }
    });
}

function fnEditProcessRule(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgProcessMaster').jqGrid('getRowData', rowid);

    $('#PopupProcessmaster').modal('show');
    $('#PopupProcessmaster').find('.modal-title').text("Update Process Rule");
    $('#txtProcessId').val(rowData.ProcessId);
    $('#txtProcessDescription').val(rowData.ProcessDesc);
    $('#cboProcessControl').val(rowData.ProcessControl);
    $('#cboProcessControl').selectpicker('refresh');
    $('#cboActiveStatus').val(rowData.ActiveStatus);
    $('#cboActiveStatus').selectpicker('refresh');
    $("#btnSaveProcessMaster").html('Update');

    if (rowData.SystemControl === 'true') {
        $("#chkSystemControl").parent().addClass("is-checked");
    }
    else {
        $("#chkSystemControl").parent().removeClass("is-checked");
    }

    isUpdate = 1;
    $("#btnSaveProcessMaster").attr("disabled", false);
    $("#txtProcessId").attr("readonly", "readonly");
}

function fnResetInputFields() {
    $("#txtProcessId").val('');
    $("#txtProcessDescription").val('');
    $('#cboProcessControl').val("A");
    $('#cboProcessControl').selectpicker('refresh');
    $("#chkIsSegmentSpecific").parent().removeClass("is-checked");
    $("#chkSystemControl").parent().removeClass("is-checked");
    $('#cboActiveStatus').val("true");
    $('#cboActiveStatus').selectpicker('refresh');
};
function AllowOnlyNumbers(e) {
    e = (e) ? e : window.event;
    var clipboardData = e.clipboardData ? e.clipboardData : window.clipboardData;
    var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    var str = (e.type && e.type == "paste") ? clipboardData.getData('Text') : String.fromCharCode(key);
    return (/^\d+$/.test(str));
}