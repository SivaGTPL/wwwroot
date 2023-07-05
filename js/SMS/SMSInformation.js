﻿$(document).ready(function () {
    $('#cboFormId').selectpicker('refresh');
    RadioLoadFormData();
    $("input[name='rdform']").change(function () {
        //reload dropdownlist
        RadioLoadFormData();
    })
    
    fnGridLoadSMSEmptyParameter();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnSMSParameter",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: "Edit", icon: "edit", callback: function (key, opt) { fnEditSMSInformation(event, 'edit') } },
            jqgView: { name: "View", icon: "view", callback: function (key, opt) { fnEditSMSInformation(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + "Edit" + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + "View" + " </span>");
});

function RadioLoadFormData() {
    $('#cboFormId').selectpicker('refresh');
    $("input[name='rdform']").each(function () {
        if ($(this).is(":checked")) {
            $.ajax({
                type: "Post",
                url: getBaseURL() + '/Engine/GetFormDetails?rdvalue=' + $(this).val(),
                
                dataType: "json",
                success: function (data) {

                    $('#cboFormId').empty();
                    $("#cboFormId").append($("<option value='0'>Select Form</option>"));
                   
                    for (var i = 0; i < data.length; i++) {
                        
                        $("#cboFormId").append($("<option></option>").val(data[i]["FormID"]).html(data[i]["FormName"]));    
                    }
                    $('#cboFormId').val($("#cboFormId option:first").val());
                    $('#cboFormId').selectpicker('refresh');

                    fnGridLoadSMSEmptyParameter();
                },

                error: function (xhr, ajaxOptions, thrownError) {
                    alert('Failed to retrieve Forms.');
                }
            });
        }
    });
}

function fnGridLoadSMSEmptyParameter() {
    $("#jqgSMSParameter").jqGrid('GridUnload');
    $("#jqgSMSParameter").jqGrid({
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSID, localization.SMSDescription, localization.IsVariable, localization.TriggeringEvent, localization.SMSStatement, localization.Active, localization.Actions],
        colModel: [
            { name: "Smsid", width: 70, editable: true, align: 'left' },
            { name: "Smsdescription", width: 70, editable: false, align: 'left', resizable: true },
            { name: "IsVariable", width: 35, editable: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "Tevent", width: 70, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 }, hidden: true },
            { name: "Smsstatement", width: 150, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Actions', search: false, align: 'left', width: 54, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSMSInformation(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSMSInformation(event,\'view\')"><i class="far fa-eye"></i> View </button>'

            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSParameter"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSParameter",
        //rowNum: 100000,
        //rowList: [10, 20, 50, 100],
        //rownumWidth: 55,
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        scrollOffset: 0, caption:'SMS Parameter',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgSMSParameter");
        },

        //onSelectRow: function (rowid, status, e) {
        //    var $self = $(this), $target = $(e.target),
        //        p = $self.jqGrid("getGridParam"),
        //        rowData = $self.jqGrid("getLocalRow", rowid),
        //        $td = $target.closest("tr.jqgrow>td"),
        //        iCol = $td.length > 0 ? $td[0].cellIndex : -1,
        //        cmName = iCol >= 0 ? p.colModel[iCol].name : "";

        //    switch (cmName) {
        //        case "id":
        //            if ($target.hasClass("myedit")) {
        //                alert("edit icon is clicked in the row with rowid=" + rowid);
        //            } else if ($target.hasClass("mydelete")) {
        //                alert("delete icon is clicked in the row with rowid=" + rowid);
        //            }
        //            break;
        //        case "serial":
        //            if ($target.hasClass("mylink")) {
        //                alert("link icon is clicked in the row with rowid=" + rowid);
        //            }
        //            break;
        //        default:
        //            break;
        //    }

        //},

    }).jqGrid('navGrid', '#jqpSMSParameter', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSParameter', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSMSinformation
    }).jqGrid('navButtonAdd', '#jqpSMSParameter', {
        caption: '<span class="fa fa-plus btn-pager"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSInformation
    });
}


function fnGridLoadSMSParameter() {
$("#jqgSMSParameter").jqGrid('GridUnload');
$("#jqgSMSParameter").jqGrid({
    url: getBaseURL() + '/Engine/GetSMSHeaderInformationByFormId?formId=' + $("#cboFormId").val(),
    datatype: 'json',
    mtype: 'Post',
    ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
    jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
    colNames: [localization.SMSID, localization.SMSDescription, localization.IsVariable, localization.TriggeringEvent, localization.SMSStatement, localization.Active, localization.Actions],
    colModel: [
        { name: "Smsid", width: 70, editable: true, align: 'left'},
        { name: "Smsdescription", width: 70, editable: false,align: 'left', resizable: true },
        { name: "IsVariable", width: 35, editable: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        { name: "Tevent", width: 70, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 }, hidden: true },
        { name: "Smsstatement", width: 150, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 250 } },
        { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        //{
        //    name: 'Actions', search: false, align: 'left', width: 54, sortable: false, resizable: false,
        //    formatter: function (cellValue, options, rowdata, action) {
        //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSMSInformation(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
        //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSMSInformation(event,\'view\')"><i class="far fa-eye"></i> View </button>'

        //    }
        //}
        {
            name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
            formatter: function (cellValue, options, rowdata, action) {
                return '<button class="mr-1 btn btn-outline" id="btnSMSParameter"><i class="fa fa-ellipsis-v"></i></button>'
            }
        },
    ],
    pager: "#jqpSMSParameter",
    //rowNum: 100000,
    //rowList: [10, 20, 50, 100],
    //rownumWidth:55,
    rowNum: 10,
    rowList: [10, 20, 50, 100],
    rownumWidth: '55',
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
    scrollOffset: 0, caption: 'SMS Parameter',
    loadComplete: function (data) {
        SetGridControlByAction();
        fnAddGridSerialNoHeading();
        fnJqgridSmallScreen("jqgSMSParameter");
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
}).jqGrid('navGrid', '#jqpSMSParameter', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSParameter', {
    caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSMSinformation
}).jqGrid('navButtonAdd', '#jqpSMSParameter', {
    caption: '<span class="fa fa-plus btn-pager"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSInformation
        });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnIsVariableRequired(elem) {
    if (elem.checked) {
        $('#dvSMSVariable').show();
    }
    else {
        $('#dvSMSVariable').hide();
    }
}

function fnAddSMSInformation() {
    if ($("#cboFormId").val() === "" || $("#cboFormId").val() === '' || $("#cboFormId").val() === '0') {
        toastr.warning("Please select Any Form to add");
        return;
    }


    fnClearFields();
    $("#btnSaveSMSInformation").show();
    $("#btnSaveSMSInformation").html(localization.Save);
    fnEnableInformationDetail(false);
    fnGridLoadSMSVariable();
    $("#divSMSInformation").css('display', 'block');
    $("#divSMSParameter").hide(500);
    $('#dvSMSVariable').hide();
    $('#chkIsVariable').parent().removeClass("is-checked");
    $('#hdvFormId').val($("#cboFormId").val());
    $('#hdvSMSId').val('');
    document.getElementById("hdFormName").innerHTML = document.getElementById("cboFormId").options[document.getElementById("cboFormId").selectedIndex].text;
    $("#chkActiveStatus").attr('disabled', true);
}

function fnEditSMSInformation(e, actiontype) {
    fnClearFields();
    document.getElementById("hdFormName").innerHTML = document.getElementById("cboFormId").options[document.getElementById("cboFormId").selectedIndex].text;
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgSMSParameter').jqGrid('getRowData', rowid);
    var rowid = $("#jqgSMSParameter").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSMSParameter').jqGrid('getRowData', rowid);
    fnGridLoadSMSVariable();
    
    $('#chkIsVariable').parent().removeClass("is-checked");
    $('#hdvFormId').val($("#cboFormId").val());
    $('#hdvSMSId').val(rowData.Smsid);
    fnFillSMSInformation();
    //$("#divSMSInformation").css('display', 'block');
    //$("#divSMSParameter").hide(500);
    //$('#dvSMSVariable').hide();
    if (actiontype.trim() == "edit") {
        
        if (_userFormRole.IsEdit === false) {
            toastr.warning("your Not Authorized to Edit");
            return;
        }
        $("#divSMSInformation").css('display', 'block');
        $("#divSMSParameter").hide(500);
        $('#dvSMSVariable').hide();

        $("#btnSaveSMSInformation").show();
        fnEnableInformationDetail(false);
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveSMSInformation").html(localization.Update);
    }
    if (actiontype.trim() == "view") {
        
        if (_userFormRole.IsView === false) {
            toastr.warning("your Not Authorized to View");
            return;
        }
        $("#divSMSInformation").css('display', 'block');
        $("#divSMSParameter").hide(500);
        $('#dvSMSVariable').hide();

        $("#btnSaveSMSInformation").hide();
        fnEnableInformationDetail(true);
    }
}

function fnFillSMSInformation() {

    $.ajax({
        url: getBaseURL() + '/Engine/GetSMSHeaderInformationBySMSId',
        data: {
            smsId: $("#hdvSMSId").val()
        },
        success: function (result) {

            if (result != null) {
                $("#txtSMSDescription").val(result.Smsdescription);
                $("#cboTriggeringEvent").val(result.TEventID).selectpicker('refresh');
                $("#txtSMSStatement").val(result.Smsstatement);

                $('#dvSMSVariable').hide();
                if (result.IsVariable == true) {
                    $('#chkIsVariable').parent().addClass("is-checked");
                    $('#dvSMSVariable').show();
                }
                else
                    $('#chkIsVariable').parent().removeClass("is-checked");

                if (result.ActiveStatus == true) {
                    $('#chkActiveStatus').parent().addClass("is-checked");
                }
                else
                    $('#chkActiveStatus').parent().removeClass("is-checked");
                
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result.l_SMSParameter);
            }
        }
    });
}

function fnGridLoadSMSVariable() {
    $("#jqgSMSVariable").jqGrid('GridUnload');
    $("#jqgSMSVariable").jqGrid({
        url: getBaseURL() + '/Engine/GetActiveSMSVariableInformation',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.Variable, localization.Component],
        colModel: [
            { name: "Smsvariable", width: 200, editable: true, align: 'left' },
            { name: "Smscomponent", width: 200, editable: false, align: 'left'},
        ],
        pager: "#jqpSMSVariable",
        emptyrecords: "No records",
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
        forceFit:false,
        scrollOffset: 0, caption: 'SMS Variable',
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgSMSVariable");
        }
    }).jqGrid('navGrid', '#jqpSMSVariable', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveSMSinformation() {
    if (IsStringNullorEmpty($("#hdvFormId").val())) {
        toastr.warning("Please select the Form ID");
        return false;
    }
    
    if (IsStringNullorEmpty($("#txtSMSDescription").val())) {
        toastr.warning("Please enter the SMS Description");
        return false;
    }
    if ($("#cboTriggeringEvent").val() === "" || $("#cboTriggeringEvent").val() === '' || $("#cboTriggeringEvent").val() === '0') {
        toastr.warning("Please Select Triggering Event");
        return false;
    }
    else if (IsStringNullorEmpty(($("#txtSMSStatement").val()))) {
        toastr.warning("Please enter the SMS Statement");
        return false;
    }
    else {
        var smsParams = eSyaParams.GetJSONValue();

        $("#btnSaveSMSInformation").attr("disabled", true);

        var URL = getBaseURL() + '/Engine/InsertIntoSMSHeader';
        if (!IsStringNullorEmpty($("#hdvSMSId").val()))
            URL = getBaseURL() + '/Engine/UpdateSMSHeader';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: {
                Smsid: !IsStringNullorEmpty($("#hdvSMSId").val()) ? $("#hdvSMSId").val() : '',
                FormId: $("#hdvFormId").val(),
                Smsdescription: $("#txtSMSDescription").val(),
                IsVariable: $("#chkIsVariable").parent().hasClass("is-checked"),
                TEventID: $("#cboTriggeringEvent").val(),
                Smsstatement: $("#txtSMSStatement").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                l_SMSParameter: smsParams
            },
            async: false,
            success: function (response) {

                if (response.Status == true) {
                    toastr.success(response.Message);
                    $("#divSMSParameter").css('display', 'block');
                    $("#divSMSInformation").hide(500);
                    fnGridRefreshSMSinformation();
                    $("#btnSaveSMSInformation").attr("disabled", false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveSMSInformation").attr("disabled", false);
                }
                $("#btnSaveSMSInformation").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSaveSMSInformation").attr("disabled", false);
            }
        });
    }
}

function fnRedirectToSMSInformation() {
    $("#divSMSInformation").css('display', 'none');
    $("#divSMSParameter").show();
}

function fnGridRefreshSMSinformation() {
    $("#jqgSMSParameter").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    eSyaParams.ClearValue();
    $('#hdvSMSId').val('');
    $("#txtSMSDescription").val('');
    $("#cboTriggeringEvent").val(0).selectpicker('refresh');
    $("#txtSMSStatement").val('');
    $('#chkIsVariable').parent().removeClass("is-checked");
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveSMSInformation").attr('disabled', false);
}

function fnCloseSMSinformation() {
    $("#divSMSParameter").css('display', 'block');
    $("#divSMSInformation").hide(500);
    fnClearFields();
}

function fnEnableInformationDetail(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkIsVariable").attr('disabled', val);
    $("#chkActiveStatus").attr('disabled', val);
}