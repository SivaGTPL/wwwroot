var actiontype = "";
var _isInsert = "";

$(document).ready(function () {
    
    fnGridLoadTemplateCreator();
    $("#divOptionvalues").hide();  

    $("#cboExaminationValueType").change(function () {
        var selectedVal = $('option:selected', this).val();
        if (selectedVal == "O") {
            $("#divOptionvalues").show();

        }
        else {
            $("#divOptionvalues").hide();
        }
    })
    
});
//Template Creator Start
function fnGridLoadTemplateCreator() {
    $('#jqgTemplateCreator').jqGrid('GridUnload');
    $("#jqgTemplateCreator").jqGrid({
        url: getBaseURL() + '/TemplateCreator/GetAllTemplates',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.TemplateID, localization.TemplateName, localization.DisplaySequenceID, localization.Active, localization.Actions],
        colModel: [
            { name: "TemplateId", width: 40, align: 'left', editable: true, editoptions: { maxlength: 8 }, resizable: false, hidden: false },
            { name: "TemplateName", width: 180, editable: false, align: 'left', editoptions: { maxlength: 150 } },
            { name: "DispSeqId", width: 40, align: 'left', editable: true, editoptions: { maxlength: 8 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 180, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="UploadQuotation btn-xs ui-button ui- widget ui-corner-all btn-jqgrid" title="ExaminationInfo " onclick="return fnExaminationInfoPopup(event);"><i class="fa fa-plus"></i>' + localization.AddViewExamination + '</button>' +
                        ' <button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditTemplateCreator(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditTemplateCreator(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditTemplateCreator(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'
                }
            },
        ],
        pager: "#jqpTemplateCreator",
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
        scrollOffset: 0,
        forceFit: true,
        caption:'Template Creator',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen('jqgTemplateCreator');
        },
    }).
        jqGrid('navGrid', '#jqpTemplateCreator', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpTemplateCreator', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTemplateCreator
        }).
        jqGrid('navButtonAdd', '#jqpTemplateCreator', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshTemplateCreator
        });
}

function fnAddTemplateCreator() {
    _isInsert = true;
    fnClearTemplateCreatorFields();
    $("#PopupTemplateCreator").modal('show');
    $('#PopupTemplateCreator').find('.modal-title').text(localization.AddTemplate);
    $("#btnSaveTemplateCreator").html(localization.Save);
    $("#chkTCActiveStatus").parent().addClass("is-checked");
    $("#chkTCActiveStatus").attr('disabled', true);
    $("#btnSaveTemplateCreator").show();
    $("#btnDeactivateTemplateCreator").hide();
}

function fnEditTemplateCreator(e, actiontype) {
    $("#PopupTemplateCreator").modal('show');
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgTemplateCreator').jqGrid('getRowData', rowid);
    $('#txtTemplateId').val(rowData.TemplateId).attr('readonly', true);
    $('#txtTemplatename').val(rowData.TemplateName);
    $('#txtdisplaysequenceId').val(rowData.DispSeqId);
    if (rowData.ActiveStatus == 'true') {
        $("#chkTCActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateTemplateCreator").html(localization.DeActivate);
    }
    else {
        $("#chkTCActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateTemplateCreator").html(localization.Activate);
    }
    $("#btnSaveTemplateCreator").attr('disabled', false);
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        $("#chkTCActiveStatus").prop('disabled', false);
        $('#PopupTemplateCreator').find('.modal-title').text(localization.EditTemplate);
        $("#btnSaveTemplateCreator").html(localization.Update);
        $("#btnSaveTemplateCreator").show();
        $("#btnDeactivateTemplateCreator").hide();
        $("#chkTCActiveStatus").attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        $('#PopupTemplateCreator').find('.modal-title').text(localization.ViewTemplate);
        $("#btnSaveTemplateCreator,#btnDeactivateTemplateCreator").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkTCActiveStatus").prop('disabled', true);
        
        $("#PopupTemplateCreator").on('hidden.bs.modal', function () {
            $("#btnSaveTemplateCreator").show();
            $("#chkTCActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        $('#PopupTemplateCreator').find('.modal-title').text("Active / De Active Template");
        $("#btnSaveTemplateCreator").hide();
        $("#btnDeactivateTemplateCreator").show();
        $("input,textarea").attr('readonly', true);
        $("#chkTCActiveStatus").prop('disabled', true);

        $("#PopupTemplateCreator").on('hidden.bs.modal', function () {
            $("#btnSaveTemplateCreator").show();
            $("#chkTCActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveTemplateCreator() {

    if (IsStringNullorEmpty($("#txtTemplateId").val())) {
        toastr.warning("Please Enter Template Id");
        return false;
    }
    if ($("#txtTemplateId").val() == 0) {
        toastr.warning("Template Id should not be 0");
        return false;
    }
    if (IsStringNullorEmpty($("#txtTemplatename").val())) {
        toastr.warning("Please Enter Template Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtdisplaysequenceId").val())) {
        toastr.warning("Please Enter display Sequence Id");
        return false;
    }
    if ($("#txtdisplaysequenceId").val() == 0) {
        toastr.warning("display Sequence Id should not be 0");
        return false;
    }


    var obj = {
        TemplateId: $("#txtTemplateId").val(),
        TemplateName: $("#txtTemplatename").val(),
        DispSeqId: $("#txtdisplaysequenceId").val(),
        ActiveStatus: $("#chkTCActiveStatus").parent().hasClass("is-checked")
    }
   
    $("#btnSaveTemplateCreator").attr('disabled', true);

    var URL = getBaseURL() + '/TemplateCreator/InsertIntoTemplateCreator';
    if (_isInsert === "false" || _isInsert == false)
        URL = getBaseURL() + '/TemplateCreator/UpdateTemplateCreator';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveTemplateCreator").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClearTemplateCreatorFields();
                fnGridRefreshTemplateCreator();
                $("#PopupTemplateCreator").modal('hide');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveTemplateCreator").html(localization.Save);
            $("#btnSaveTemplateCreator").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveTemplateCreator").html(localization.Save);
            $("#btnSaveTemplateCreator").attr("disabled", false);
        }
    });
}

function fnClearTemplateCreatorFields() {
    $("#txtTemplateId").val('');
    $("#txtTemplatename").val('');
    $("#txtdisplaysequenceId").val('');
    $("#chkTCActiveStatus").prop('disabled', false);
    $("#chkTCActiveStatus").parent().removeClass("is-checked");
    $('#txtTemplateId').attr('readonly', false);
    $('#txtTemplatename').attr('readonly', false);
    $('#txtdisplaysequenceId').attr('readonly', false);
    $("#btnSaveTemplateCreator").attr('disabled', false);
}

function fnGridRefreshTemplateCreator() {
    $("#jqgTemplateCreator").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

//Template Creator End

//Examination Start
function fnExaminationInfoPopup(e) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgTemplateCreator').getRowData(rowid);
    $("#PopupExaminationDetails").modal(true);
    $("#txtTempId").val('');
    $("#txtTempId").val(rowData.TemplateId);
    $("#lblTemplateId").text(rowData.TemplateId);
    $("#lblTemplateName").text(rowData.TemplateName);
    fnGridLoadExamination();
    fnClearFields();
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnGridLoadExamination() {
    $('#jqgExamination').jqGrid('GridUnload');
    $("#jqgExamination").jqGrid({
        url: getBaseURL() + '/TemplateCreator/GetExaminationsByTemplateId?TemplateId=' + $("#txtTempId").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TemplateID, localization.ExaminationID, localization.ExaminationName, localization.ValueType, localization.OptionValues, localization.DisplaySequenceID, localization.Active, localization.Actions],
        colModel: [
            { name: "TemplateId", width: 40, editable: true, align: 'left', editoptions: { maxlength: 10 }, hidden: true   },
            { name: "ExaminationId", width: 40, editable: true, align: 'left', editoptions: { maxlength: 10 }, hidden: false },
            { name: "ExaminationName", width: 160, editable: true, align: 'left', editoptions: { maxlength: 150 } },
            {
                name: "ValueType", editable: true, width: 60, align: "left", edittype: "select", resizable: false, formatter: 'select',
                editoptions: {
                    value: "A: Amount;B: Boolean;D:Description;P: Percentage;V: Value;O:Option"
                }
            },
            { name: "OptionValues", width: 100, editable: true, align: 'left', editoptions: { maxlength: 50 } },
            { name: "DispSeqId", width: 40, editable: true, align: 'left', editoptions: { maxlength: 10 }, hidden: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'action', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditExamination(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditExamination(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth:55,
        emptyrecords: "No records to View",
        pager: "#jqpExamination",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        scrollOffset: 0,
    }).jqGrid('navGrid', '#jqpExamination', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpExamination', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshExamination
        }).jqGrid('navButtonAdd', '#jqpExamination', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnAddExamination
    });
   fnAddGridSerialNoHeading();
}

function fnClearTemplate() {
  
    $("#txtTempId").val('');
}

function fnAddExamination() {
    fnClearFields();
    fnUserAction(false);
    $("#btnSaveExamination").html('Save').show();
}

function fnEditExamination(e, actiontype) {
   
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgExamination').jqGrid('getRowData', rowid);
    $('#txtExaminationId').val(rowData.ExaminationId).attr('readonly', true);
    $('#txtExaminationName').val(rowData.ExaminationName);
    $('#txtdissequenceId').val(rowData.DispSeqId);
    $('#txtOptionvalues').val(rowData.OptionValues);
    $('#cboExaminationValueType').val(rowData.ValueType);
    $('#cboExaminationValueType').selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveExamination").attr('disabled', false);
    if (rowData.ValueType == "O") {
        $("#divOptionvalues").show();

    }
    else {
        $("#divOptionvalues").hide();
    }
    fnUserAction(false);
    if (actiontype.trim() == "edit") {
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSaveExamination").html('Update').show();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveExamination").hide();
        fnUserAction(true);

    }
}

function fnSaveExamination() {
    if (IsStringNullorEmpty($("#txtExaminationName").val())) {
        toastr.warning("Please Enter ExaminationName");
        return false;
    }
    if (IsStringNullorEmpty($("#txtdissequenceId").val())) {
        toastr.warning("Please Enter Display Sequence ID");
        return false;
    }
    if ($("#cboExaminationValueType").val() === "O") {
        if (IsStringNullorEmpty($("#txtOptionvalues").val())) {
            toastr.warning("Please Enter Option Values");
            return false;
        }
    }
    var OptVal="";
    if ($("#cboExaminationValueType").val() === "O") {
        OptVal = $("#txtOptionvalues").val();
    } else {
        OptVal = "";
    }
   
    var objExam = {
        TemplateId: $("#txtTempId").val(),
        ExaminationId: $("#txtExaminationId").val() === '' ? 0 : $("#txtExaminationId").val(),
        ExaminationName: $("#txtExaminationName").val(),
        DispSeqId: $("#txtdissequenceId").val(),
        ValueType: $("#cboExaminationValueType").val(),
        OptionValues: OptVal,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSaveExamination").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/TemplateCreator/InsertOrUpdateExamination',
        type: 'POST',
        datatype: 'json',
        data: { objExam },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveExamination").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveExamination").attr('disabled', false);
                fnGridRefreshExamination();
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveExamination").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveExamination").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#txtExaminationId").val('');
    $("#txtExaminationName").val('');
    $("#txtdissequenceId").val('');
    $("#cboExaminationValueType").val('B');
    $("#cboExaminationValueType").selectpicker('refresh');
    $("#txtOptionvalues").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveExamination").html('Save');
    $("#btnSaveExamination").attr('disabled', false);
}

function fnGridRefreshExamination() {
    $("#jqgExamination").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnUserAction(val) {
    $("input,textarea").attr('readonly', val);
    $("select").next().attr('disabled', val);
    $("#chkActiveStatus").prop('disabled', val);
}

function fnAllowNumbersOnly(input) {
    let value = input.value;
    let numbers = value.replace(/[^0-9]/g, "");
    input.value = numbers;
}

//function SetGridControlByAction() {
//    $('#jqgAdd').removeClass('ui-state-disabled');
//    var eleEnable = document.querySelectorAll('#jqgEdit');

//    for (var i = 0; i < eleEnable.length; i++) {
//        eleEnable[i].disabled = false;
//    }
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }
//}

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

function fnDeleteTemplateCreator() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkTCActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTemplateCreator").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/TemplateCreator/ActiveOrDeActiveTemplateCreator?status=' + a_status + '&TemplateId=' + $("#txtTemplateId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateTemplateCreator").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClearTemplateCreatorFields();
                fnGridRefreshTemplateCreator();
                $("#PopupTemplateCreator").modal('hide');
                $("#btnDeactivateTemplateCreator").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateTemplateCreator").attr("disabled", false);
                $("#btnDeactivateTemplateCreator").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateTemplateCreator").attr("disabled", false);
            $("#btnDeactivateTemplateCreator").html(localization.DeActivate);
        }
    });
}
//Examination End





