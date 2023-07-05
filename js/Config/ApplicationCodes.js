﻿
$(document).ready(function () {
    fnGridLoadApplicationCodes();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnApplicationCodes",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditApplicationCodes(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditApplicationCodes(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditApplicationCodes(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
    
    });
var actiontype = "";
function fnGridLoadApplicationCodes() {
   
    var codeType = $("#cboCodeType").val();
    $("#jqgApplicationCodes").jqGrid('GridUnload');
    $("#jqgApplicationCodes").jqGrid({
        url:getBaseURL() + '/ApplicationCodes/GetApplicationCodesByCodeType?codeType=' + codeType,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ApplicationCode, "", localization.Description, localization.ShortCode, localization.DefaultStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "ApplicationCode", width: 50, editable: true, align: 'left', hidden: false },
            { name: "CodeType", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "CodeDesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ShortCode", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 15 } },
            { name: "DefaultStatus", width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 78, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditApplicationCodes(event,\'edit\')"><i class="fas fa-pen"></i></button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditApplicationCodes(event,\'view\')"><i class="far fa-eye"></i></button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditApplicationCodes(event,\'delete\')" > <i class="fas fa-trash"></i></button>'

            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnApplicationCodes"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jpgApplicationCodes",
        rowNum: 10000,
        rownumWidth:'55',
        pgtext: null,
        pgbuttons:null,
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
        scrollOffset: 0, caption:'Application Codes',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgApplicationCodes");
           
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

    }).jqGrid('navGrid', '#jpgApplicationCodes', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jpgApplicationCodes', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshApplicationCodes
    }).jqGrid('navButtonAdd', '#jpgApplicationCodes', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddApplicationCodes
        });
    fnAddGridSerialNoHeading();
}

function fnAddApplicationCodes() {
    fnClearFields();
    var id = $("#cboCodeType").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty($("#cboCodeType").val())) {
        toastr.warning("Please select any code type to add");
    }
    else {
        $('#PopupApplicationCodes').modal('show');
        $('#PopupApplicationCodes').modal({ backdrop: 'static', keyboard: false });
        $('#PopupApplicationCodes').find('.modal-title').text(localization.AddApplicationCode);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveApplicationCode").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnSaveApplicationCode").show();
        $("#btnDeactivateApplicationCode").hide();
    }
}

function fnEditApplicationCodes(e, actiontype) {
    debugger;
    var rowid = $("#jqgApplicationCodes").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgApplicationCodes').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
   
    $('#txtApplicationCode').val(rowData.ApplicationCode);
    $('#cboCodeType').val(rowData.CodeType).selectpicker('refresh');
    $("#txtApplicationCodeDescription").val(rowData.CodeDesc);
    $("#txtShortCode").val(rowData.ShortCode);
    if (rowData.DefaultStatus === "true") {
        $("#chkApplicationDefaultStatus").parent().addClass("is-checked");
    }
    else { $("#chkApplicationDefaultStatus").parent().removeClass("is-checked"); }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
      
    }
    $("#btnSaveApplicationCode").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not Authorized to Edit");
            return;
        }
        $('#PopupApplicationCodes').modal('show').css({ top: firstRow.top + 31 });
        
        $('#PopupApplicationCodes').find('.modal-title').text(localization.UpdateApplicationCode);
        //$("#chkActiveStatus").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkApplicationDefaultStatus").prop('disabled', false);
        $("#btnSaveApplicationCode").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactivateApplicationCode").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveApplicationCode").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupApplicationCodes').modal('show');
        $('#PopupApplicationCodes').find('.modal-title').text(localization.ViewApplicationCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkApplicationDefaultStatus").prop('disabled', true);
        $("#btnSaveApplicationCode,#btnDeactivateApplicationCode").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not Authorized to Delete");
            return;
        }
        $('#PopupApplicationCodes').modal('show');
        $('#PopupApplicationCodes').find('.modal-title').text("Active/De Active Application Codes");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateApplicationCode").html(localization.DActivate);
        }
        else {
            $("#btnDeactivateApplicationCode").html('Activate');
            $("#btnDeactivateApplicationCode").html(localization.Activate);
        }
        $("#btnSaveApplicationCode").hide();
        $("#btnDeactivateApplicationCode").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkApplicationDefaultStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

}



function fnSaveApplicationCode() {
    if (IsStringNullorEmpty($("#txtApplicationCodeDescription").val())) {
        toastr.warning("Please Enter Application Code Description");
        return;
    }
    if ($("#cboCodeType").val() === 0 || $("#cboCodeType").val() === "0") {
        toastr.warning("Please select any code type to add");
        return;
    }

      $("#btnSaveApplicationCode").attr('disabled', true);
        app_codes = {
            ApplicationCode: $("#txtApplicationCode").val() === '' ? 0 : $("#txtApplicationCode").val(),
            CodeType:$("#cboCodeType").val(),
            CodeDesc: $("#txtApplicationCodeDescription").val(),
            ShortCode: $("#txtShortCode").val(),
            DefaultStatus: $('#chkApplicationDefaultStatus').parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
$("#btnSaveApplicationCode").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/ApplicationCodes/InsertOrAudateApplicationCodes',
        type: 'POST',
        datatype: 'json',
        data: { app_codes },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveApplicationCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveApplicationCode").attr('disabled', false);
                fnGridRefreshApplicationCodes();
                $('#PopupApplicationCodes').modal('hide');
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveApplicationCode").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveApplicationCode").attr("disabled", false);
        }
    });
}

function fnGridRefreshApplicationCodes() {
    $("#jqgApplicationCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
 
$("#btnCancelApplicationCode").click(function () {
    fnClearFields();
    $("#jqgApplicationCodes").jqGrid('resetSelection');
    $('#PopupApplicationCodes').modal('hide');
});

function fnClearFields() {
    $("#txtApplicationCodeDescription").val("");
    $('#chkApplicationDefaultStatus').prop('checked', true);
    $('#chkApplicationDefaultStatus').parent().removeClass('is-checked');
    $('#chkApplicationDefaultStatus').prop('checked', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#chkApplicationDefaultStatus").prop('disabled', false);
    $("#txtShortCode").val("");
    $("#txtApplicationCode").val("");
    $("#btnSaveApplicationCode").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}


function fnDeleteApplicationCodes() {
  
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateApplicationCode").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ApplicationCodes/ActiveOrDeActiveApplicationCode?status=' + a_status + '&app_code=' + $("#txtApplicationCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateApplicationCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupApplicationCodes').modal('hide');
                fnClearFields();
                fnGridRefreshApplicationCodes();
                $("#btnDeactivateApplicationCode").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateApplicationCode").attr("disabled", false);
                $("#btnDeactivateApplicationCode").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateApplicationCode").attr("disabled", false);
            $("#btnDeactivateApplicationCode").html('De Activate');
        }
    });
}


function fnExportToExcel() {
    //JSONToCSVConvertor(JSON.stringify($('#jqgApplicationCodes').jqGrid('getRowData')), 'Application Codes', true);
    JSONToCSVConvertor(JSON.stringify($('#jqgApplicationCodes').getGridParam('data')), 'Application Codes', true);
    
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;


    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
             //specific Columns headings are Removed
            if (index !== "CodeType" && index !== "edit" && index !== "_id_" ) {
            //Now convert each value to string and comma-seprated
            if (index == "ApplicationCode") {
                index = "Application Code";
            }
            if (index == "CodeDesc") {
                index = "Description";
            }
            if (index == "ShortCode") {
                index = "Short Code";
            }
            if (index == "DefaultStatus") {
                index = "Default Status";
            }
            if (index == "ActiveStatus") {
                index = "Active Status";
            }
           

                row += index + ',';
            }
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
             //specific Columns data are Removed
            if (index !== "CodeType" && index !== "edit" && index !== "_id_") {
            
                row += '"' + arrData[i][index] + '",';
            }
        }
    
        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = ReportTitle;
    //var fileName = "ApplicationCodes";

    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    console.log(document.body);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}