var RateTypelist = [];
var NodeID;
var prevSelectedID;
var Isactivestatus = false;
var isinsert = false;
$(document).ready(function () {

    $.each(RateTypes, function (i, data) { RateTypelist.push(data.Value + ':' + data.Text); })
    RateTypelist = RateTypelist.join(';')


    $("#pnlMainMenu").hide();
    $("#divjqgrid").hide(); 
    $("#divjqgridDocumentType").hide(); 
    $("#divjqgridRateType").hide(); 
    //$("#divRateType").hide(); 
    $("#divRateType").show(); 

    LoadPatientTypeTree();
    //$("#btnDeleteNode").attr("disabled", _userFormRole.IsDelete === false);
    fnLoadSpecialtyLinkGrid();
    fnLoadRateTypeGrid();
    fnLoadDocumentTypeGrid();

    $("#chkIsspecialtylink").change(function () {
        if (this.checked) {
            $("#divjqgrid").show();
            fnLoadSpecialtyLinkGrid();
            
        } else {
            $("#divjqgrid").hide(); 
            fnLoadSpecialtyLinkGrid();
           
        }
    });

    $("#chkValidateDocument").change(function () {
        if (this.checked) {
            $("#divjqgridDocumentType").show();
            fnLoadDocumentTypeGrid();

        } else {
            $("#divjqgridDocumentType").hide();
            fnLoadDocumentTypeGrid();

        }
    });

    $("#cboServiceWiseRateType").change(function () {
        var servicerate_val = $('#cboServiceWiseRateType option:selected').val();
        if (servicerate_val==='T') {
            $("#divjqgridRateType").show();
            //$("#divRateType").show();
            $("#divRateType").hide();
            $("#cboRateType").val('0').selectpicker('refresh');
            fnLoadRateTypeGrid();
           

        } else {
            $("#divjqgridRateType").hide();
            //$("#divRateType").hide();
            $("#divRateType").show();
            $("#cboRateType").val('0').selectpicker('refresh');
            $("#divjqgridRateType").hide();
            //fnLoadRateTypeGrid();

        }
    });
});

function LoadPatientTypeTree() {
    $.ajax({
        url: getBaseURL() + '/CustomerAttributes/GetAllPatientTypesforTreeView',
        success: function (result) {
            fnGetPatientType_Success(result);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
}

function fnGetPatientType_Success(dataArray) {
    $("#jstPatientType").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        //"plugins": ["checkbox"],
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    $("#jstPatientType").on('loaded.jstree', function () {

        $("#jstPatientType").jstree('open_all');
        $("#jstPatientType").jstree()._open_to(prevSelectedID);
        $('#jstPatientType').jstree().select_node(prevSelectedID);

    });

    $('#jstPatientType').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMainMenu").hide();

                    if (data.node.parent == "MM") {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E003"]);
                                return;
                            }
                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            fnClearFields();


                            $('#txtPatientTypeId').val(data.node.id.substring(2));

                            $("#txtPatientCategoryId").val('');
                            if ($("#chkIsspecialtylink").parent().hasClass("is-checked")) {
                                $("#divjqgrid").show();
                                fnLoadSpecialtyLinkGrid();
                            } else {
                                $("#divjqgrid").hide();
                            }

                            if ($("#chkValidateDocument").parent().hasClass("is-checked")) {
                                $("#divjqgridDocumentType").show();
                                fnLoadDocumentTypeGrid();
                            } else {
                                $("#divjqgridDocumentType").hide();
                            }

                            if ($("#cboServiceWiseRateType").val()==='T') {
                                $("#divjqgridRateType").show();
                                fnLoadRateTypeGrid();
                                //$("#divRateType").show();
                                $("#divRateType").hide();
                                $("#cboRateType").val('0').selectpicker('refresh');

                            } else {
                                $("#divjqgridRateType").hide();
                                //$("#divRateType").hide();
                                $("#divRateType").show();
                               // $("#cboRateType").val('0').selectpicker('refresh');
                            }


                            $("input[id*='chk']").attr('disabled', false);
                            //Enable category dropdown and check boxes
                            $("#cboPatientcategory").prop('disabled', false).selectpicker("refresh");
                            Isactivestatus = false;
                            isinsert = true;
                            $("#btnAddPatientType").show();
                            $("input,textarea").attr('readonly', false);
                            $("select").next().attr('disabled', false);
                            $("#btnAddPatientType").html('<i class="fa fa-plus"></i> ' + localization.Save);
                           
                        });
                    }
                    else if (data.node.id.startsWith("SM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];

                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E001"]);
                                return;
                            }
                            
                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.ViewPatientCategory);
                            $('#txtPatientCategoryId').val(NodeID);
                            $('#txtPatientTypeId').val(data.node.id.substring(2).split("_")[0]);

                            fnFillPatientCategoryInfo();
                           
                            //disableing check boxes
                            Isactivestatus = true;
                            if ($("#chkIsspecialtylink").parent().hasClass("is-checked")) {
                                $("#divjqgrid").show();
                                fnLoadSpecialtyLinkGrid();
                            } else {
                                $("#divjqgrid").hide();
                            }

                            if ($("#chkValidateDocument").parent().hasClass("is-checked")) {
                                $("#divjqgridDocumentType").show();
                                fnLoadDocumentTypeGrid();
                            } else {
                                $("#divjqgridDocumentType").hide();
                            }

                            if ($("#cboServiceWiseRateType").val() === 'T') {
                                $("#divjqgridRateType").show();
                                fnLoadRateTypeGrid();
                                //$("#divRateType").show();
                                $("#divRateType").hide();


                            } else {
                                $("#divjqgridRateType").hide();
                                //$("#divRateType").hide();
                                $("#divRateType").show();

                            }

                            $("#btnAddPatientType").hide();
                            $("input,textarea").attr('readonly', true);
                            $("select").next().attr('disabled', true);
                            $("input[type=checkbox]").attr('disabled', true);
                        });

                        $('#Edit').on('click', function () {

                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                toastr.warning(errorMsgCS["E002"]);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.EditPatientCategory);
                            $('#txtPatientCategoryId').val(NodeID);
                            $('#txtPatientTypeId').val(data.node.id.substring(2).split("_")[0]);

                            fnFillPatientCategoryInfo();

                            //enableing check boxes
                            Isactivestatus = false;
                            isinsert = false;
                            if ($("#chkIsspecialtylink").parent().hasClass("is-checked")) {
                                $("#divjqgrid").show();
                                fnLoadSpecialtyLinkGrid();
                            } else {
                                $("#divjqgrid").hide();
                            }


                            if ($("#chkValidateDocument").parent().hasClass("is-checked")) {
                                $("#divjqgridDocumentType").show();
                                fnLoadDocumentTypeGrid();
                            } else {
                                $("#divjqgridDocumentType").hide();
                            }

                            if ($("#cboServiceWiseRateType").val() === 'T') {
                                $("#divjqgridRateType").show();
                                fnLoadRateTypeGrid();
                                //$("#divRateType").show();
                                $("#divRateType").hide();

                            } else {
                                $("#divjqgridRateType").hide();
                                //$("#divRateType").hide();
                                $("#divRateType").show();

                            }

                            
                            //disable category dropdown
                            //$("#cboPatientcategory").prop('disabled', true).selectpicker("refresh");
                            $("#cboPatientcategory").next().attr('disabled', true).selectpicker("refresh");
                            $("#cboServiceWiseRateType").next().attr('disabled', false).selectpicker("refresh");
                            $("#cboRateType").next().attr('disabled', false).selectpicker("refresh");

                            $("#btnAddPatientType").show();
                            $("input,textarea").attr('readonly', false);
                            //$("select").next().attr('disabled', false);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#btnAddPatientType").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        });

                    
                    }
                    else {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                }
            }
        }
    });

    $('#jstPatientType').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstPatientType').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize('#jstPatientType');
};

function fnFillPatientCategoryInfo() {
    if ($("#txtPatientCategoryId").val() != '' && $("#txtPatientCategoryId").val() != undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/CustomerAttributes/GetPatientCategoryInfo?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#txtPatientTypeId").val('');
                $("#txtPatientTypeId").val(result.PatientTypeId);
                $('#cboPatientcategory').val(result.PatientCategoryId);
                $('#cboPatientcategory').selectpicker('refresh');
                $('#cboRateType').val(result.RateType);
                $('#cboRateType').selectpicker('refresh');
                $('#cboServiceWiseRateType').val(result.ServiceWiseRateType);
                $('#cboServiceWiseRateType').selectpicker('refresh');

                if (result.TreatmentAllowedOp == 1) {
                    $("#chkTreatmentallowedop").parent().addClass("is-checked");
                }
                else { $('#chkTreatmentallowedop').parent().removeClass("is-checked"); }
                if (result.TreatmentAllowedIp == 1) {
                    $("#chkTreatmentallowedip").parent().addClass("is-checked");
                }
                else { $('#chkTreatmentallowedip').parent().removeClass("is-checked"); }
                if (result.IsSpecialtyLink == 1) {
                    $("#chkIsspecialtylink").parent().addClass("is-checked");
                }
                else { $('#chkIsspecialtylink').parent().removeClass("is-checked"); }

                if (result.CareCardApplicable == 1) {
                    $("#chkCareCardApplicable").parent().addClass("is-checked");
                }
                else { $('#chkCareCardApplicable').parent().removeClass("is-checked"); }
                if (result.ValidateDocument == 1) {
                    $("#chkValidateDocument").parent().addClass("is-checked");
                }
                else { $('#chkValidateDocument').parent().removeClass("is-checked"); }


                if (result.ActiveStatus == 1) {
                    $("#chkActivestatus").parent().addClass("is-checked");
                }
                else { $('#chkActivestatus').parent().removeClass("is-checked"); }

            }
        });
    }
}

function fnSavePatientCategory() {

    if (validationPatientCategory() === false) {
        return;
    }

    var val = [];
    var numberOfRecords = $("#jqgSpecialtyLink").getGridParam("records");
    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgSpecialtyLink').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            val.push(rowData.SpecialtyId);

        }
    }
    var ratetype_val = [];
    var rg_ids = jQuery("#jqgRateType").jqGrid('getDataIDs');
    for (var j = 0; j < rg_ids.length; j++) {
        var rt_Id = rg_ids[j];
        var rt_rowData = jQuery('#jqgRateType').jqGrid('getRowData', rt_Id);

        if (!IsStringNullorEmpty(rt_rowData.RateType) && rt_rowData.RateType !== '0') {
            ratetype_val.push({
                ServiceType: rt_rowData.ServiceType,
                ServiceTypeDescription: rt_rowData.ServiceTypeDescription,
                RateType: rt_rowData.RateType,
                ActiveStatus: rt_rowData.ActiveStatus
            });
        }
    }
    var doctype_val = [];
    var g_ids = jQuery("#jqgDocumentType").jqGrid('getDataIDs');
    for (var k = 0; k < g_ids.length; k++) {
        var r_Id = g_ids[k];
        var d_rowData = jQuery('#jqgDocumentType').jqGrid('getRowData', r_Id);

        if (!IsStringNullorEmpty(d_rowData.DocumentName)) {
            doctype_val.push({
                DocumentId: d_rowData.DocumentId,
                DocumentName: d_rowData.DocumentName,
                ActiveStatus: d_rowData.ActiveStatus

            });
        }

    }

    $("#btnAddPatientType").attr('disabled', true);

    var isspecialtyunchecked = $("#chkIsspecialtylink").parent().hasClass("is-checked");
    if (isspecialtyunchecked === false) {
        val = [];
    }

    var isdoctypeunchecked = $("#chkValidateDocument").parent().hasClass("is-checked");
    if (isdoctypeunchecked === false) {
        doctype_val = [];
    }

    if ($("#cboServiceWiseRateType").val() === 'N') {
        ratetype_val = [];
    }

    var obj = {
        PatientTypeId: $("#txtPatientTypeId").val(),
        PatientCategoryId: $("#cboPatientcategory").val(),
        ServiceWiseRateType: $("#cboServiceWiseRateType").val(),
        RateType: $("#cboRateType").val(),
        TreatmentAllowedOp: $("#chkTreatmentallowedop").parent().hasClass("is-checked"),
        TreatmentAllowedIp: $("#chkTreatmentallowedip").parent().hasClass("is-checked"),
        IsSpecialtyLink: $("#chkIsspecialtylink").parent().hasClass("is-checked"),
        CareCardApplicable: $("#chkCareCardApplicable").parent().hasClass("is-checked"),
        ValidateDocument: $("#chkValidateDocument").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActivestatus").parent().hasClass("is-checked"),
        IsInsert: isinsert,
        Speialtylink: val,
        PatientRateTypeList: ratetype_val,
        PatientCategoryDocumentTypeList: doctype_val
    };
    $.ajax({
        url: getBaseURL() + '/CustomerAttributes/InsertOrUpdatePatientCategory',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        async: false,
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                location.reload();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnAddPatientType").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            $("#btnAddPatientType").attr('disabled', false);
            toastr.error(error.statusText);
        }
    });
}

function validationPatientCategory() {

    if ($("#cboPatientcategory").val() === "0" || $("#cboPatientcategory").val() === "") {
        toastr.warning("Please Select a Patient Category");
        return false;
    }
    if ($("#cboServiceWiseRateType").val() === 'N') {

        if ($("#cboRateType").val() === "0" || $("#cboRateType").val() === "") {
            toastr.warning("Please Select a Rate Type");
            return false;
        }
    }

    //if ($("#cboRateType").val() === "0" || $("#cboRateType").val() === "") {
    //    toastr.warning("Please Select Rate Type");
    //    return false;
    //}
    if ($("#cboServiceWiseRateType").val() === "0" || $("#cboServiceWiseRateType").val() === "") {
        toastr.warning("Please Select Service Wise Rate Type");
        return false;
    }
}

function fnClearFields() {
    $("#txtPatientTypeId").val('');
    $("#cboPatientcategory").val('0');
    $("#cboPatientcategory").selectpicker('refresh');
    $("#cboRateType").val('0').selectpicker('refresh');
    $("#cboServiceWiseRateType").val('N').selectpicker('refresh');
    $("#chkTreatmentallowedop").parent().removeClass("is-checked");
    $("#chkTreatmentallowedip").parent().removeClass("is-checked");
    $("#chkIsspecialtylink").parent().removeClass("is-checked");
    $("#chkCareCardApplicable").parent().removeClass("is-checked");
    $("#chkValidateDocument").parent().removeClass("is-checked");
    $("#chkActivestatus").parent().addClass("is-checked");
}

function fnExpandAll() {
    $('#jstPatientType').jstree('open_all');
}

function fnCollapseAll() {
    fnClearFields();
    $("#pnlMainMenu").hide();
    $('#jstPatientType').jstree('close_all');
}

function fnTreeSize() {
    $("#jstPatientType").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

// Speciality Units Start
function fnLoadSpecialtyLinkGrid() {
    $("#jqgSpecialtyLink").jqGrid('GridUnload');
    $("#jqgSpecialtyLink").jqGrid({
        url: getBaseURL() + "/CustomerAttributes/GetSpecialtyByPatientTypeAndCategory?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Specialty ID", localization.LimittoSpecificSpecialty, localization.Active],
        colModel: [
            { name: "SpecialtyId", width: 150, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 160, editable: false, hidden: false, align: 'left', resizable: true },
            {
                name: 'ActiveStatus', index: 'ActiveStatus', width: 150, resizable: false, align: 'center',
                formatter: "checkbox", formatoptions: { disabled: false },
                edittype: "checkbox", editoptions: { value: "true:false" }
            },
        ],
        pager: "#jqpSpecialtyLink",
        rowNum: 10000,
        rownumWidth:55,
        pgbuttons: null,
        pgtext:null,
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
        scrollOffset: 0,
        loadComplete: function (data) {
            fnDisableActivecheckboxs(); fnJqgridSmallScreen("jqgSpecialtyLink");
        },
        caption:'Specialty Link',
    }).jqGrid('navGrid', '#jqpSpecialtyLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSpecialtyLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSpecialtyLink
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshSpecialtyLink() {

    $("#jqgSpecialtyLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}
//Speciality Units End

// Rate Tye Start

//function fnLoadRateTypeGrid() {
//    $("#jqgRateType").jqGrid('GridUnload');
//    $("#jqgRateType").jqGrid({
//        url: getBaseURL() + "/CustomerAttributes/GetPatientRateTypeByPatientTypeAndCategory?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: ["Service Type", localization.ServiceTypeDescription, localization.RateType, localization.Active],
//        colModel: [
//            { name: "ServiceType", width: 80, editable: true, align: 'left', hidden: true },
//            { name: "ServiceTypeDescription", width: 200, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
//            { name: "RateType", width: 200, editable: true, edittype: 'select', formatter: 'select', editoptions: { value: RateTypelist } },
//            {
//                name: 'ActiveStatus', index: 'ActiveStatus', width: 80, resizable: false, align: 'center',
//                formatter: "checkbox", formatoptions: { disabled: false },
//                edittype: "checkbox", editoptions: { value: "true:false" }
//            },
//        ],
//        pager: "#jqpRateType",
//        rowNum: 10000,
//        rownumWidth: 55,
//        pgtext: null,
//        pgbuttons: null,
//        loadonce: true,
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        scrollOffset: 0, caption:"Rate Type",
//        loadComplete: function (data) {
//            //SetGridControlByAction();
//            fnDisableActivecheckboxs(); fnJqgridSmallScreen("jqgRateType");
//        },
//    }).jqGrid('navGrid', '#jqpRateType', { add: false, edit: false, search: false, del: false, refresh: false })
//        .jqGrid('navButtonAdd', '#jqpRateType', {
//            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRateType
//        });
//    $("#jqgRateType").jqGrid('inlineNav', '#jqpRateType', {
//        addParams: { position: "last" },
//        edit: true,
//        edittext: "Edit",
//        add: false,
//        addicon: 'fa fa-plus',
//        addtext: 'Add',
//        deltext: 'Delete',
//        editicon: 'fa fa-pen',
//        del: false,
//        search: false,
//        searchicon: 'fa fa-search',
//        save: true,
//        saveicon: 'fa fa-save',
//        savetext: 'Save',
//        cancel: true,
//        canceltext: 'Cancel',
//        cancelicon: 'fa fa-times'
//    });
//    fnAddGridSerialNoHeading();
//}

function fnGridRefreshRateType() {

    $("#jqgRateType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

// Rate Tye Start End

function fnLoadRateTypeGrid() {

    $("#jqgRateType").jqGrid('GridUnload');

    $("#jqgRateType").jqGrid({
        url: getBaseURL() + "/CustomerAttributes/GetPatientRateTypeByPatientTypeAndCategory?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service Type","Service Type Description", "Rate Type", "Active"],
        colModel: [
            { name: "ServiceType", width: 80, editable: true, align: 'left', hidden: true },
            { name: "ServiceTypeDescription", width: 200, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "RateType", width: 200, editable: true, edittype: 'select', formatter: 'select', editoptions: { value: RateTypelist } },
            {
                name: 'ActiveStatus', index: 'ActiveStatus', width: 80, resizable: false, align: 'center',
                formatter: "checkbox", formatoptions: { disabled: false },
                edittype: "checkbox", editoptions: { value: "true:false" }
            },
        ],
        rowNum: 10000,
        pager: "#jqpRateType",
        pgtext: null,
        pgbuttons: null,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgRateType').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            fnDisableActivecheckboxs();
        }
    }).jqGrid('navGrid', '#jqpRateType', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpRateType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRateType
    });
    fnAddGridSerialNoHeading();
}


//function OnlyNumeric(e) {

//    if ((e.which < 48 || e.which > 57)) {
//        if (e.which == 8 || e.which == 46 || e.which == 0) {
//            return true;
//        }
//        else {
//            return false;
//        }
//    }
//}


// Document Tye Start

function fnLoadDocumentTypeGrid() {

    $("#jqgDocumentType").jqGrid('GridUnload');
    $("#jqgDocumentType").jqGrid({
        url: getBaseURL() + "/CustomerAttributes/GetPatientCategoryDocumentTypeByPatientTypeAndCategory?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Document ID", localization.PatientDocumentsRequired, localization.Active],
        colModel: [
            { name: "DocumentId", width: 80, editable: true, align: 'left', hidden: true },
            { name: "DocumentName", editable: true, width: 150, align: 'left', resizeable: false, edittype: 'text', editoptions: { maxlength: 150 } },
            {
                name: 'ActiveStatus', index: 'ActiveStatus', width: 80, resizable: false, align: 'center',
                formatter: "checkbox", formatoptions: { disabled: false },
                edittype: "checkbox", editoptions: { value: "true:false" }
            },
        ],
        pager: "#jqpDocumentType",
        rowNum: 5,
        rowList: [5, 10, 15, 20],
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
        forceFit: true,
        caption: 'Validate Document',
        cellEdit: true,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgDocumentType').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {

            var grid = jQuery("#jqgDocumentType"),
                pageSize = parseInt(grid.jqGrid("getGridParam", "rowNum")),
                emptyRows = pageSize - data.length;

            if (emptyRows > 0) {
                for (var i = 1; i <= emptyRows; i++)
                    // Send rowId as undefined to force jqGrid to generate random rowId
                    grid.jqGrid('addRowData', undefined, {});

                // adjust the counts at lower right
                grid.jqGrid("setGridParam", {
                    reccount: grid.jqGrid("getGridParam", "reccount") - emptyRows,
                    records: grid.jqGrid("getGridParam", "records") - emptyRows
                });
                grid[0].updatepager();
            }
        },
      
    }).jqGrid('navGrid', '#jqpDocumentType', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDocumentType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDocumentType
    });
}

function fnGridRefreshDocumentType() {

    $("#jqgDocumentType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}
// Document Tye End

//Rate Type End
function fnDisableActivecheckboxs() {
    if (Isactivestatus === true) {
        $("input[type=checkbox]").attr('disabled', true);
    }
    if (Isactivestatus === false) {
        $("input[type=checkbox]").attr('disabled', false);
    }
}