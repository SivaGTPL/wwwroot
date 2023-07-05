var isUpdate = 0;
$(document).ready(function () {
    $('#cboBusinessLocation').selectpicker('refresh');
    $('#cboFormId').selectpicker('refresh');
    //fnGridLoadSMSToWhom();
    fnGridLoadEmptyGridSMSToWhom();
});
function fnOnFormIdChange() {
    fnGridLoadSMSToWhom();
    fnFillSMSDescription();
}
function fnGridLoadEmptyGridSMSToWhom() {
    $("#jqgSMSToWhom").jqGrid('GridUnload');
    $("#jqgSMSToWhom").jqGrid({
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSID, localization.SMSDescription, localization.SMSStatement, localization.Active, localization.Actions], //, "Select"
        colModel: [
            { name: "Smsid", width: 70, editable: true, align: 'left' },
            { name: "Smsdescription", width: 270, editable: false, align: 'left', resizable: true },
            { name: "Smsstatement", width: 105, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 38, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Actions', search: false, align: 'left', width: 74, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" ><i class="far fa-eye"></i> ' + localization.View + ' </button>' 
                        
                }
            }
        ],
        pager: "#jqpSMSToWhom",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        scrollOffset: 0, caption:'SMS To Whom',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgSMSToWhom");
        },
    }).jqGrid('navGrid', '#jqpSMSToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', position: 'first', onClickButton: fnAddSMSRecipient
    });
}

function fnGridLoadSMSToWhom() {
    $("#jqgSMSToWhom").jqGrid('GridUnload');
    $("#jqgSMSToWhom").jqGrid({
        url: getBaseURL() + '/SMSEngine/GetSMSHeaderForRecipientByFormIdandParamId?formId=' + $("#cboFormId").val() + '&parameterId=5',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSID, localization.SMSDescription, localization.SMSStatement, localization.Active, localization.Actions], //, "Select"
        colModel: [
            { name: "Smsid", width: 70, editable: true, align: 'left' },
            { name: "Smsdescription", width: 270, editable: false, align: 'left', resizable: true },
            { name: "Smsstatement", width: 105, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 38, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Actions', search: false, align: 'left', width: 74, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    //return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSMSRecipient(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
                    //    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSMSRecipient(event,\'view\')"><i class="far fa-eye"></i> View </button>'
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditSMSRecipient(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditSMSRecipient(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' 
                        
                }
            }
        ],
        pager: "#jqpSMSToWhom",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        scrollOffset: 0, caption: 'SMS To Whom',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgSMSToWhom");
        },
    }).jqGrid('navGrid', '#jqpSMSToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSRecipient
    });
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

function fnFillSMSDescription() {

    if ($('#cboFormId').val() != '' && $('#cboFormId').val() != null) {
        $.getJSON(getBaseURL() + '/SMSEngine/GetSMSHeaderForRecipientByFormIdandParamId?formId=' + $('#cboFormId').val() + '&parameterId=5', function (result) {
            var options = $("#cboSMSDescription");
            $("#cboSMSDescription").empty();

            $.each(result, function () {
                options.append($("<option />").val(this.Smsid).text(this.Smsdescription));
            });
            $('#cboSMSDescription').selectpicker('refresh');
        });
    }
}

function fnGridLoadSMSRecipient() {
    $("#jqgSMSRecipient").jqGrid('GridUnload');
    $("#jqgSMSRecipient").jqGrid({
        url: getBaseURL() + '/SMSEngine/GetSMSRecipientByBusinessKeyAndSMSId?businessKey=' + $("#cboBusinessLocation").val() + '&smsId=' + $("#cboSMSDescription").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Recipient Name", "Mobile No", "Remarks", "Status"],
        colModel: [
            { name: "RecipientName", width: 165, editable: true, align: 'left' },
            { name: "MobileNumber", width: 150, editable: false, align: 'left', resizable: true },
            { name: "Remarks", width: 195, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 } },
            { name: "ActiveStatus", editable: true, width: 148, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        pager: "#jqpSMSRecipient",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit:true,
        scrollOffset: 0, caption: 'SMS Recipient',
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgSMSRecipient");
        },
        onSelectRow: function (rowid) {
            var rRecipientName = $("#jqgSMSRecipient").jqGrid('getCell', rowid, 'RecipientName');
            var rMobileNumber = $("#jqgSMSRecipient").jqGrid('getCell', rowid, 'MobileNumber');
            var rRemarks = $("#jqgSMSRecipient").jqGrid('getCell', rowid, 'Remarks');
            var rActiveStatus = $("#jqgSMSRecipient").jqGrid('getCell', rowid, 'ActiveStatus');
            if (isUpdate == 1) {
                $('#txtRecipientName').val(rRecipientName);
                $('#txtMobileNumber').val(rMobileNumber);
                $('#txtRemarks').val(rRemarks);
                if (rActiveStatus === 'true') {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
            }
        },
    }).jqGrid('navGrid', '#jqpSMSRecipient', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnAddSMSRecipient() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.warning("Please select the Business Location to add Recipt");
        return ;
    }
    if (IsStringNullorEmpty($("#cboFormId").val())) {
        toastr.warning("Please select the Form Name to add Recipt");
        return ;
    }
    $('#PopupSMSToWhom').find('.modal-title').text(localization.AddRecipient);
    $("#PopupSMSToWhom").modal("show");
    $("#btnSaveRecipient").show();
    fnGridLoadSMSRecipient();
    isUpdate = 0;
}

function fnSaveSMSRecipient() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.warning("Please select a Business Location");
        return false;
    }
    if (IsStringNullorEmpty($("#cboFormId").val())) {
        toastr.warning("Please select a Form Name");
        return false;
    }

    if (IsStringNullorEmpty($("#cboSMSDescription").val())) {
        toastr.warning("Please select a SMS Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtRecipientName").val())) {
        toastr.warning("Please enter the Recipient Name");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtMobileNumber").val())) {
        toastr.warning("Please enter the Mobile number");
        return false;
    }
    else {

        $("#btnSaveRecipient").attr("disabled", true);

        var sm_sr = {
            BusinessKey: $("#cboBusinessLocation").val(),
            Smsid: $("#cboSMSDescription").val(),
            MobileNumber: $("#txtMobileNumber").val(),
            RecipientName: $("#txtRecipientName").val(),
            Remarks: $("#txtRemarks").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }

        var URL = getBaseURL() + '/SMSEngine/InsertIntoSMSRecipient';
        if (isUpdate == 1)
            URL = getBaseURL() + '/SMSEngine/UpdateSMSRecipient';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: { sm_sr },
            success: function (response) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnGridRefreshSMSRecipient();
                    fnClearFields();
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveRecipient").attr('disabled', false);
                }

            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSaveRecipient").attr("disabled", false);
            }
        });
    }
}

function fnEditSMSRecipient(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSMSToWhom').jqGrid('getRowData', rowid);
    $("#PopupSMSToWhom").modal("show");
    $("#cboSMSDescription").attr('disabled', true);
    $('#cboSMSDescription').val(rowData.Smsid);
    $('#cboSMSDescription').selectpicker('refresh');
    fnGridLoadSMSRecipient();
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        $("#btnSaveRecipient").show();
        $('#PopupSMSToWhom').find('.modal-title').text(localization.EditRecipient);
        fnEnableRecipientDetail(false);
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveRecipient").hide();
        $('#PopupSMSToWhom').find('.modal-title').text(localization.ViewRecipient);
        fnEnableRecipientDetail(true);
    }
}

function fnGridRefresh() {
    $("#jqgSMSToWhom").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridRefreshSMSRecipient() {
    $("#jqgSMSRecipient").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtRecipientName").val('');
    $("#txtMobileNumber").val('');
    $("#txtRemarks").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveRecipient").attr('disabled', false);
    $("#cboSMSDescription").attr('disabled', false);
    $('#cboSMSDescription').selectpicker('refresh');
    fnEnableRecipientDetail(false);
}

function fnEnableRecipientDetail(val) {
    $("#txtRecipientName").attr('readonly', val);
    $("#txtMobileNumber").attr('readonly', val);
    $("#txtRemarks").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
}