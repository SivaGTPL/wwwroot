
var prevSelectedID = '';
var TypeList
var isadd;
$(document).ready(function () {
    $("#pnlFormModule").hide(); 
    fnTreeSize("#FormMasterTree");
    fnLoadFormsModuleTree();
    fnBindFormdropdown();
});

function fnBindFormdropdown() {
    $('#cboForm').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/FormsMenu/GetForms',
        datatype: 'json',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboForm').empty();
            $("#cboForm").append($("<option value='0'>Choose Form</option>"));

            for (var i = 0; i < result.length; i++) {
                //***Binding Values to Form dropdown**//
                $("#cboForm").append($("<option></option>").val(result[i]["FormID"]).text(result[i]["FormName"]));
            }

            $('#cboForm').val($("#cboForm option:first").val());
            $('#cboForm').selectpicker('refresh');

        }
    });
}

 

$(window).on('resize', function () {
    fnTreeSize();
});
function fnLoadFormsModuleTree() {
    $.ajax({
        url: getBaseURL() + '/FormsMenu/GetFormsModuleforTreeView',
        type: 'POST',
        datatype: 'json',
        success: function (result) {

            fnGetFormModule_Success(result);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
   
    
}

 function fnTreeSize(id) {
                $(id).css({
                    'height': $(window).innerHeight() - 136,
                    'overflow': 'auto'
                });
            }


function fnGetFormModule_Success(dataArray) {
    $("#jstMenuFormModule").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        //"plugins": ["checkbox"],
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }
       
    });

    $("#jstMenuFormModule").on('loaded.jstree', function () {

        $("#jstMenuFormModule").jstree('open_all');
        $("#jstMenuFormModule").jstree()._open_to(prevSelectedID);
        $('#jstMenuFormModule').jstree().select_node(prevSelectedID);

    });

    $('#jstMenuFormModule').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            //if (prevSelectedID != data.node.id) {
            prevSelectedID = data.node.id;

            if (data.node.id == "0") {
                fnClearFields();
                $("#pnlFormModule").hide();
            }
            else {
                if (data.node.parent == "MM") {
                    
                    $("#pnlFormModule").show();
                    $(".mdl-card__title-text").text(localization.AddFormModule);
                    isadd = 1;
                    $('#cboForm').attr('disabled', false);
                    $('#cboForm').selectpicker('refresh');
                    fnBindFormdropdown();
                    fnClearFields();
                    $("#chkActiveStatus").parent().addClass("is-checked");
                    $("#btnSaveFormModule").html('<i class="fa fa-plus"></i>' + localization.Add);
                   
                }
                else if (data.node.id.startsWith("SM")) {
                    NodeID = 0;
                    NodeID = data.node.id.substring(2).split(".")[1];
                    $("#pnlFormModule").show();
                    $(".mdl-card__title-text").text(localization.EditFormModule);
                    $('#txtFormId').val(NodeID);
                    $('#cboForm').val(NodeID).selectpicker('refresh');
                    $('#cboForm').attr('disabled', true);
                    isadd = 0;
                    fnFillFormModuleInfo();
                    $("#btnSaveFormModule").html('<i class="fa fa-sync"></i>' + localization.Update);
                    
                }
                else {
                    fnClearFields();
                    $("#pnlFormModule").hide();
                }
            }
        }
    });

    $('#jstMenuFormModule').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstMenuFormModule').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#FormMasterTree");
};

function fnFillFormModuleInfo() {
   
    if ($("#txtFormId").val() != '' && $("#txtFormId").val() != undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/FormsMenu/GetFormModulebyFormId?formId=" + $("#txtFormId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
               
                $('#cboForm').empty();
                $('#cboForm').prepend($('<option></option>').val(result.FormId).text(result.FormName));
                $('#cboForm').selectpicker('refresh');
                $('#cboModule').val(result.ModuleId).selectpicker('refresh');
                $('#txtTransactiontable').val(result.TransactionTable);
                $('#txtRefferedtable').val(result.RefferedTable);
                $('#txtReferencelink').val(result.ReferenceLink);
                tinyMCE.activeEditor.setContent(result.Description);
                $('#cboAssign').val(result.AssignedTo).selectpicker('refresh');
                if (result.AssignedOn !== null) {
                    setDate($('#dtAssignedon'), result.AssignedOn);
                }
                else{
                    $('#dtAssignedon').val('');
                }
                $('#cboStatus').val(result.Status).selectpicker('refresh');
                
                if (result.ActiveStatus == true) {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else {
                    $("#chkActiveStatus").parent().removeClass("is-checked");
                }
                
            }
        });
    }
}

function fnSaveFormModule() {
    if (validateFormModule() === false) {
        return;
    }
    $("#btnSaveFormModule").attr('disabled', true);
    var obj = {
        FormId: $("#cboForm").val(),
        ModuleId: $("#cboModule").val(),
        TransactionTable: $("#txtTransactiontable").val(),
        RefferedTable: $("#txtRefferedtable").val(),
        ReferenceLink:$('#txtReferencelink').val(),
        Description: tinyMCE.get('txtDescription').getContent(),
        AssignedTo: $("#cboAssign").val(),
        AssignedOn:getDate($('#dtAssignedon')),
        Status: $("#cboStatus").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Isadd: isadd
        };
   
    $.ajax({
        url: getBaseURL() + '/FormsMenu/InsertOrUpdateFormModule',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearFields();
                location.reload();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveFormModule").attr('disabled', false);
                return false;
               
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveFormModule").attr('disabled', false);
        }
    });
}

function validateFormModule() {
    if ($("#cboModule").val() === '0') {
        toastr.warning("Please Select Module");
        return false;
    }
    if ($("#cboForm").val() === '0' || $("#cboForm").val() === "0") {
        toastr.warning("Please Select Form");
        return false;
    }
    if (IsStringNullorEmpty(tinyMCE.get('txtDescription').getContent())) {
        toastr.warning("Please Enter Description");
        return false;
    }
    if ($("#cboAssign").val() === '0') {
        toastr.warning("Please Select Assign To");
        return false;
    }
    if (IsStringNullorEmpty($("#dtAssignedon").val())) {
        toastr.warning("Please Select Assign Date");
        return false;
    }
   
    if ($("#cboStatus").val() === '0') {
        toastr.warning("Please Select Status");
        return false;
    }
}

function fnClearFields() {
    $('#txtFormId').val('');
    $('#cboForm').val('0').selectpicker('refresh');
    $('#cboModule').val('0').selectpicker('refresh');
    $("#txtTransactiontable").val('');
    $("#txtRefferedtable").val('');
    $('#txtReferencelink').val('');
    $('#txtDescription').val('');
    tinyMCE.activeEditor.setContent('');
    $('#cboAssign').val('0').selectpicker('refresh');
    $('#dtAssignedon').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    //$("#chkActiveStatus").parent().removeClass("is-checked");
    $("#btnSaveFormModule").html('<i class="fa fa-plus"></i>' + localization.Add);
    $("#btnSaveFormModule").attr('disabled', false);
}

