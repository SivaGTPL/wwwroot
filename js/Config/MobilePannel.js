function initEditor() {
    tinymce.init({
        selector: '#txtHTML',
       // content_css: '/css/clinicpages.css',
        extended_valid_elements: 'script[src|async|defer|type|charset],html,body,style',
        width: 1200,
        height: 500,
        plugins: [
            'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker example fullpage',
            'searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking',
            'table emoticons template paste help'
        ],
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
            'forecolor backcolor emoticons | help',
        menu: {
            favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
        },
        menubar: 'edit view insert format tools table help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    });
}
function hideEditor() {
        tinymce.remove();
}
const arrayOfPages= [
    ['1', 'diaDoctorProfile_'],
    ['2', 'diaHome_'],
    ['3', 'diaFAQ_'],
    ['4', 'diaLocation_'],
    ['5', 'diaPostSurgeryInstructions_' ],
    ['6', 'diaVideos_'],
    ['7', 'diaContactNumber_']
];

$(document).ready(function () {
    $("#txtHTML").hide();
    $("#btnUpdatePage").hide();
    $("#btnUpload").hide();
    fnLoadMobilePannelGrid();
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgMobilePannel');
        }
    })
}); 

$('#Photoimage').on('change', function (e) {
    $("#txtImageUrl").val('');
    var file = $('#Photoimage')[0].files[0].name;
    $("#txtImageUrl").val(file);
});
$('#PhotoimageGall').on('change', function (e) {
    $("#txtImageUrlGall").val('');
    var file = $('#PhotoimageGall')[0].files[0].name;
    $("#txtImageUrlGall").val(file);
});
function fnTemplateType_onChange() {

    fnLoadMobilePannelGrid();
}

var actiontype = "";
function fnLoadMobilePannelGrid() {
    hideEditor();
    $("#txtHTML").val('');
    var langcode = $('#cboCulture').val();
    var tempType = $('#cboTemplateType').val();
    if (tempType === 'SS' || tempType === 'HA') {
        $("#txtHTML").hide();
        $("#btnUpdatePage").hide();
        $("#btnUpload").hide();
        $("#grid-container").show();
        $("#jqgMobilePannel").GridUnload();
        $("#jqgMobilePannel").jqGrid({
            url: getBaseURL() + '/MobilePannel/GetMobilePannelListbyTemplateType?LanguageCode=' + langcode + "&TemplateType=" + tempType,
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: ["", "", "", localization.DisplayType, "Image Url", "Video Url", localization.DisplayName, localization.DisplayOrder, localization.Active, localization.Actions],
            colModel: [
                { name: "TemplateType", width: 70, editable: true, align: 'left', hidden: true },
                { name: "LanguageCode", width: 70, editable: true, align: 'left', hidden: true },
                { name: "TemplateId", width: 70, editable: true, align: 'left', hidden: true },
                { name: "DisplayType", width: 100, editable: true, align: 'left', hidden: true },
                { name: "ImageUrl", width: 120, editable: true, align: 'left', hidden: false },
                { name: "VideoUrl", width: 120, editable: true, align: 'left', hidden: false },
                { name: "DisplayName", width: 100, editable: true, align: 'left', hidden: false },
                //{ name: "TemplateDesc", width: 70, editable: true, align: 'left', hidden: true },
                //{ name: "Faqs", width: 70, editable: true, align: 'left', hidden: true },
                //{ name: "FaqsAnswer", width: 70, editable: true, align: 'left', hidden: true },
                { name: "DisplayOrder", width: 100, editable: true, align: 'left', hidden: false },
                { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
                {
                    name: 'edit', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditMobilePannel(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
                            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditMobilePannel(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' +
                            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditMobilePannel(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button >'

                    }
                },
            ],
            rowNum: 10,
            rownumWidth: 55,
            loadonce: true,
            pager: "#jqpMobilePannel",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            align: "left",
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scrollOffset: 0, caption:'Mobile Pannel',
            loadComplete: function (data) {
                SetGridControlByAction();
                fnJqgridSmallScreen("jqgMobilePannel");
            },
        }).jqGrid('navGrid', '#jqpMobilePannel', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpMobilePannel', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefresh
        }).jqGrid('navButtonAdd', '#jqpMobilePannel', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddMobilePannel
        });
        fnAddGridSerialNoHeading();
    }
    else {
        $("#grid-container").hide();
        var pageName = '';
        for (var j = 0, len = arrayOfPages.length; j < len; j++) {
            if (arrayOfPages[j][0] === tempType) {
                pageName = arrayOfPages[j][1];
                break;
            }
        }
        pageName = pageName + langcode.substring(0, 2) + '.html';
        $.ajax({
            url: getBaseURL() + '/MobilePannel/GethtmlPage',
            data: {
                htmlPage: pageName
            },
            success: function (result) {
                $('#txtHTML').val(result.Message)
                $("#txtHTML").show();
                initEditor();
                $("#btnUpdatePage").show();
                $("#btnUpload").show();
                

            }
        });
    }
}

function fnAddMobilePannel() {
    fnUserFormAction(false);
    $('#Photoimage').removeAttr('disabled');
    //tinymce.activeEditor.setMode('design');
    //openFullscreen();
   
    $("#cboDisplayType").val('SS').selectpicker('refresh');
    $("#cboDisplayType").attr('disabled', true);
    $("#cboDisplayType").selectpicker('refresh');

    if ($("#cboCulture").val() == "0" || $("#cboCulture").val() === "") {

        toastr.warning("Please Select Language Code");
    }
   
    else if ($("#cboTemplateType").val() == "0" || $("#cboTemplateType").val() === "") {

        toastr.warning("Please Select Template Type");
    }
    else {
        fnClearFields();
        $("#PopupMobilePannel").modal('show');
        $(".modal-title").text(localization.AddMobilePannel);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnMobilePannel").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnMobilePannel").show();
        $("#btnDeactivateMobilePannel").hide();
        $('#txtImageUrl').attr('readonly', 'true');
    }
}

function fnEditMobilePannel(e, actiontype) {
    fnClearFields();
    //openFullscreen();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgMobilePannel').jqGrid('getRowData', rowid);
    $("#txtTemplateId").val(rowData.TemplateId);
    fnGetPannelDetails(rowData);
    //tinyMCE.activeEditor.setContent('');
    //tinyMCE.activeEditor.setContent(rowData.TemplateDesc);
    $('#cboDisplayType').val(rowData.DisplayType).selectpicker('refresh');
    $('#cboDisplayType').attr('disabled', true);
    $("#txtImageUrl").val(rowData.ImageUrl);
    $('#txtImageUrl').attr('readonly', 'true');
    $("#txtDisplayName").val(rowData.DisplayName);
    $("#txtVideoUrl").val(rowData.VideoUrl);
    //$("#txtFAQs").val(rowData.Faqs);
    //$("#txtFAQsAnswes").val(rowData.FaqsAnswer);
    $("#txtDisplayOrder").val(rowData.DisplayOrder);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateMobilePannel").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateMobilePannel").html(localization.Activate);
    }
    $('#Photoimage').removeAttr('disabled');
    $("#PopupMobilePannel").modal('show');

    if (actiontype.trim() == "edit") {
        $(".modal-title").text(localization.EditMobilePannel);
        //tinymce.activeEditor.setMode('design');
        fnUserFormAction(false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnMobilePannel").text(localization.Update).show();
        $("#btnMobilePannel").attr('disabled', false);
        $("#btnMobilePannel").show();
        $("#btnDeactivateMobilePannel").hide();
        $('#Photoimage').removeAttr('disabled');
    }
    if (actiontype.trim() == "view") {
        $("#chkActiveStatus").prop('disabled', true);
        fnUserFormAction(true);
        $("#btnMobilePannel,#btnDeactivateMobilePannel").hide();
        //tinymce.activeEditor.setMode('readonly');
        $(".modal-title").text(localization.ViewMobilePannel);
        $('#Photoimage').attr('disabled', 'disabled');
    }
    if (actiontype.trim() == "delete") {
        $("#chkActiveStatus").prop('disabled', true);
        fnUserFormAction(true);
        $("#btnMobilePannel").hide();
        //tinymce.activeEditor.setMode('readonly');
        $(".modal-title").text("Active / De Active Mobile Pannel");
        $("#btnDeactivateMobilePannel").show();
    }
}

function fnUserFormAction(status) {
    $("input,textarea").attr('readonly', status);
}

function fnSaveMobilePannel() {
    

    if (validationMobilePannel() === false) {
        return;
    }
    var obj = new FormData();
    //appending image file object
    obj.append("Imagefile", $("#Photoimage").get(0).files[0]);
    obj.append("TemplateType", document.getElementById("cboTemplateType").value);
    obj.append("LanguageCode", document.getElementById("cboCulture").value);
    obj.append("TemplateId", document.getElementById("txtTemplateId").value);
    obj.append("DisplayType", document.getElementById("cboDisplayType").value);
    obj.append("ImageUrl", document.getElementById('txtImageUrl').value);
    if (IsStringNullorEmpty($("#txtDisplayOrder").val())) {
        obj.append("DisplayName", " ");
    }
    else {
        obj.append("DisplayName", document.getElementById("txtDisplayName").value);
    }
    
    obj.append("VideoUrl", document.getElementById("txtVideoUrl").value);
    obj.append("DisplayOrder", document.getElementById("txtDisplayOrder").value);
    obj.append("ActiveStatus", $('#chkActiveStatus').parent().hasClass("is-checked"));

    //var obj = {
    //    TemplateType: $("#cboTemplateType").val(),
    //    LanguageCode: $("#cboCulture").val(),
    //    TemplateId: $("#txtTemplateId").val() === '' ? 0 : $("#txtTemplateId").val(),
    //    DisplayType: $("#cboDisplayType").val(),
    //    ImageUrl: $("#txtImageUrl").val(),
    //    DisplayName: $("#txtDisplayName").val(),
    //    //TemplateDesc : tinyMCE.get('txtTemplatedescription').getContent(),
    //    VideoUrl: $("#txtVideoUrl").val(),
    //    //Faqs: $("#txtFAQs").val(),
    //    //FaqsAnswer: $("#txtFAQsAnswes").val(),
    //    DisplayOrder: $("#txtDisplayOrder").val(),
    //    ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
       
    //};
    $("#btnMobilePannel").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/MobilePannel/InsertOrUpdateMobilePannel',
        type: 'POST',
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnMobilePannel").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnClearFields();
                $("#jqgMobilePannel").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnMobilePannel").attr('disabled', false);
                return false;
            }
            $("#btnMobilePannel").attr('disabled', false);
        }

    });
}

function validationMobilePannel() {
   
    //var Templatedesc = tinyMCE.get('txtTemplatedescription').getContent();
    if ($("#cboCulture").val() == "0" || $("#cboCulture").val() === "") {

        toastr.warning("Please Select Language Code");
    }
    if ($("#cboTemplateType").val() == "0" || $("#cboTemplateType").val() === "") {

        toastr.warning("Please Select Template Type");
    }
    if ($("#cboDisplayType").val() == "0" || $("#cboDisplayType").val() === "") {

        toastr.warning("Please Select Display Type");
    }
    if (IsStringNullorEmpty($("#txtDisplayOrder").val())) {
        toastr.warning("Please Enter Display Order ");
        return false;
    }
    if (isNaN($("#txtDisplayOrder").val())) {
        toastr.warning("Display Order Should be Numbers Only");
        return false;
    }
    
    //if (IsStringNullorEmpty(Templatedesc)) {
    //    toastr.warning("Please Enter Template Description");
    //    return false;
    //}
}

function fnRefresh() {

    $("#jqgMobilePannel").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClosePopUp() {
    fnClearFields();
    //closeFullscreen();
    $("#PopupMobilePannel").modal('hide');
}

function fnClearFields() {
    $("#txtTemplateId").val('');
    $('#cboDisplayType').selectpicker('refresh');
    $("#txtDisplayName").val('');
    $("#txtDisplayOrder").val('');
    $("#txtImageUrl").val('');
    $("#txtVideoUrl").val('');
    //$("#txtFAQs").val('');
    //$("#txtFAQsAnswes").val('');
    //tinyMCE.activeEditor.setContent('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnMobilePannel").show();
    $("#btnMobilePannel").attr('disabled', false);
    $('#imgPhotoimageblah').attr('src', '');
    $('#imgPhotoimageblahGall').attr('src', '');
    document.getElementById('Photoimage').value = "";
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

function fnDeleteMobilePannel() {
    
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateMobilePannel").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MobilePannel/ActiveOrDeActiveMobilePannel?status=' + a_status + '&TemplateId=' + $("#txtTemplateId").val()
            + '&TemplateType=' + $("#cboTemplateType").val() + '&LanguageCode=' + $("#cboCulture").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateMobilePannel").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnRefresh();
                fnClearFields();
                $("#btnDeactivateMobilePannel").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateMobilePannel").attr("disabled", false);
                $("#btnDeactivateMobilePannel").html(localization.DeActivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateMobilePannel").attr("disabled", false);
            $("#btnDeactivateMobilePannel").html(localization.DeActivate);
        }
    });
}

function fnGetPannelDetails(rowData) {
    if (rowData != null) {
        var langcode = rowData.LanguageCode;
        var tempType = rowData.TemplateType;
        var tempId = rowData.TemplateId;
        $.ajax({
            url: getBaseURL() + '/MobilePannel/GetMobilePannelbyTemplateType?LanguageCode=' + langcode + "&TemplateType=" + tempType + "&TemplateId=" + tempId,
            type: 'POST',
            datatype: 'json',
            success: function (response) {

                if (response != null) {

                    fnFillPannelDetails(response);
                }
                //else {
                //    fnClearFields();

                //}

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });
    }
}

function fnFillPannelDetails(data) {
    console.log(data)
    if (data.ProfileImagePath != null) {
        $('#imgPhotoimageblah').attr('src', data.ProfileImagePath);
        $('#txtImageUrl').val('');
        $('#txtImageUrl').val(data.ImageUrl);
    }
    else {
        $('#imgPhotoimageblah').attr('src', '');
        $('#txtImageUrl').val('');
    }

    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");
   
}

function updatePage() {

    $("#btnUpdatePage").attr('disabled', true);
    var langcode = $('#cboCulture').val();
    var tempType = $('#cboTemplateType').val();
    var pageName = '';
    for (var j = 0, len = arrayOfPages.length; j < len; j++) {
        if (arrayOfPages[j][0] === tempType) {
            pageName = arrayOfPages[j][1];
            break;
        }
    }
    pageName = pageName + langcode.substring(0, 2) + '.html';
    var obj = {
        htmlPage: pageName,
        content: tinymce.get("txtHTML").getContent()
    }
    $.ajax({
        url: getBaseURL() + '/MobilePannel/UpdatehtmlPage',
        type: 'POST',
        data: obj,
        postData: {
            htmlPage: pageName,
            content: $('#txtHTML').val()
        },
        success: function (response) {
            if (response.Status) {
                toastr.success("Updated");
                $("#btnUpdatePage").attr('disabled', false);
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnUpdatePage").attr('disabled', false);
                return false;
            }
            
        }
    });
}

function fnUploadImage() {

    var obj = new FormData();
    //appending image file object
    obj.append("Imagefile", $("#PhotoimageGall").get(0).files[0]);
    obj.append("ImageUrl", document.getElementById('txtImageUrlGall').value);


    
    $("#btnUpload").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/MobilePannel/UploadImagesForContent',
        type: 'POST',
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#UploadImagePannel").modal('hide');
                $("#btnUpload").attr('disabled', false);
                fnClearFields();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnUpload").attr('disabled', false);
                return false;
            }
            $("#btnUpload").attr('disabled', false);
        }

    });
}

function fnupload() {
    fnClearFields();
    $("#UploadImagePannel").modal('show');
}