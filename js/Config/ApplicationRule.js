

$(document).ready(function () {

    fnGridLoadApplicationRule();
   
});

function fnGridLoadApplicationRule() {

    var processId = $('#cboProcessControl').val();

    $('#jqgApplicationRules').jqGrid('GridUnload');
    $("#jqgApplicationRules").jqGrid({

        url: getBaseURL() + '/ApplicationRules/GetApplicationRulesByProcessId?processId=' + processId,
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Rule ID", "Rule Description", "Status", "Actions"],
        colModel: [
            { name: "ProcessId", width: 40, align: 'left', editable: true, editoptions: { maxlength: 8 }, resizable: false, hidden: true },
            { name: "RuleId", width: 70, editable: true, align: 'left', editoptions: { maxlength: 9 }, hidden: true },
            { name: "RuleDesc", width: 350, editable: true, editoptions: { maxlength: 75 } },
            { name: "ActiveStatus", editable: true, width: 28, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            {
                name: 'edit', search: false, align: 'left', width: 48, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditApplicationRule(event)"><i class="fas fa-pen"></i> Edit </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewApplicationRule(event)"><i class="far fa-eye"></i> View </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" onclick = "" > <i class="fas fa-trash"></i></button >'
                }
            },
        ],

        pager: "#jqpApplicationRules",
        rowNum: 10000,
        rownumWidth:55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
         height: 'auto',
        scroll: false,
        width: 'auto',
        shrinkToFit: true,
        forceFit: true,
        autowidth: true,
        multiselect: false, caption:'Application Rules',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgApplicationRules");
        }
    }).jqGrid('navGrid', '#jqpApplicationRules', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpApplicationRules', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "btnGridReferesh", position: "first", onClickButton: fnGridRefreshApplicationRule
    }).jqGrid('navButtonAdd', '#jqpApplicationRules', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'btnGridAdd', position: 'first', onClickButton: fnGridAddApplicationRule
        });
    fnAddGridSerialNoHeading();
}

function fnGridAddApplicationRule() {
    debugger;
    if ($("#cboProcessControl").val() == "0") {
        isUpdate = 0;
        toastr.warning("Please Select Process Control");
    }
    else {
        $("#PopupApplicationRule").modal("show");
        $('#PopupApplicationRule').find('.modal-title').text("Add Application Rule");
        $("#btnSaveApplicationRule").html('<i class="fa fa-plus"></i> Add');
        $("#txtRuleId").val('');
        $("#txtRuleDescription").val('');
        var processDescription = $("#cboProcessControl").find("option:selected").text();
        $("#txtProcessControlDesc").val(processDescription);
        $('#cboActiveStatus').val("true");
        $('#cboActiveStatus').selectpicker('refresh');
        isUpdate = 0;
        $("#txtRuleId").removeAttr("readonly");
        $("#btnSaveApplicationRule").attr("disabled", false);
    }
}

function fnEditApplicationRule(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgApplicationRules').jqGrid('getRowData', rowid);

    $('#PopupApplicationRule').modal('show');
    $('#PopupApplicationRule').find('.modal-title').text("Update Application Rule");
    $('#txtRuleId').val(rowData.RuleId);

    var processDescription = $("#cboProcessControl").find("option:selected").text();
    $("#txtProcessControlDesc").val(processDescription);

    $('#txtRuleDescription').val(rowData.RuleDesc);
    $('#cboActiveStatus').val(rowData.ActiveStatus);
    $('#cboActiveStatus').selectpicker('refresh');
    $("#btnSaveApplicationRule").html('<i class="fa fa-sync"></i> Update');
    isUpdate = 1;
    $("#txtRuleId").attr("readonly", "readonly");
    $("#btnSaveApplicationRule").attr("disabled", false);
}

function fnViewApplicationRule(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgApplicationRules').jqGrid('getRowData', rowid);

    $('#PopupApplicationRule').modal('show');
    $('#PopupApplicationRule').find('.modal-title').text("View Application Rule");
    $('#txtRuleId').val(rowData.RuleId);

    var processDescription = $("#cboProcessControl").find("option:selected").text();
    $("#txtProcessControlDesc").val(processDescription);

    $('#txtRuleDescription').val(rowData.RuleDesc);
    $('#cboActiveStatus').val(rowData.ActiveStatus);
    $('#cboActiveStatus').selectpicker('refresh');
    $("#btnSaveApplicationRule").html('<i class="fa fa-sync"></i> Update');
    isUpdate = 1;
    $("#txtRuleId").attr("readonly", "readonly");
    $("#btnSaveApplicationRule").attr("disabled", false);
    $("#btnSaveApplicationRule").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("#PopupApplicationRule").on('hidden.bs.modal', function () {
        $("#btnSaveApplicationRule").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    })
}

function fnSaveApplicationRule() {
    if ($("#txtRuleId").val().trim().length <= 0 || $("#txtRuleId").val() == 0) {
        toastr.warning("Please Enter Rule Id");
        return;
    }
    if ($('#txtRuleDescription').val().trim().length <= 0) {
        toastr.warning("Please Enter Rule Description");
        return;
    }

    var ruleId = 0;
    if ($('#txtRuleId').val().trim().length > 0)
        ruleId = $('#txtRuleId').val();

    var obj = {
        ProcessId: $('#cboProcessControl').val(),
        RuleId: ruleId,
        RuleDesc: $("#txtRuleDescription").val(),
        UsageStatus: false,
        ActiveStatus: $("#cboActiveStatus").val()
    };
    $("#btnSaveApplicationRule").attr("disabled", true);

    var URL = getBaseURL() + '/ApplicationRules/InsertApplicationRule';
    if (isUpdate == 1)
        URL = getBaseURL() + '/ApplicationRules/UpdateApplicationRule';

    $.ajax({
        url: URL,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
        success: function (response) {

            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshApplicationRule();
                fnResetInputsApplicationRule();
                fnclosePopUpApplicationRule();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveApplicationRule").attr("disabled", false);
            }

            function fnclosePopUpApplicationRule() {
                setTimeout(function () {
                    $("#PopupApplicationRule").modal('hide');
                    $("#btnSaveApplicationRule").attr("disabled", false);
                }, 3000);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveApplicationRule").attr("disabled", false);
        }
    });
}

function fnResetInputsApplicationRule() {

    $("#txtProcessControlDesc").val('');
    $("#txtRuleId").val('');
    $("#txtRuleDescription").val('');
    $('#cboActiveStatus').val("true");
    $('#cboActiveStatus').selectpicker('refresh');
}

function fnGridRefreshApplicationRule() {

    $("#jqgApplicationRules").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function AllowOnlyNumbers(e) {
    e = (e) ? e : window.event;
    var clipboardData = e.clipboardData ? e.clipboardData : window.clipboardData;
    var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    var str = (e.type && e.type == "paste") ? clipboardData.getData('Text') : String.fromCharCode(key);
    return (/^\d+$/.test(str));
}