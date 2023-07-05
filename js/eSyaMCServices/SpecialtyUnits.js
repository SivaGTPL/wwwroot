$(document).ready(function () {
    fnGridLoadSpecialtyUnits();
    $("#divForm").hide();

})
function fnBusinessLocation_onChange() {

    fnGridLoadSpecialtyUnits();
}

function fnGridLoadSpecialtyUnits() {
    $("#jqgSpecialtyUnits").jqGrid('GridUnload');
    $("#jqgSpecialtyUnits").jqGrid({
        url: getBaseURL() + '/SpecialtyUnits/GetSpecialtyUnitsbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "","Specialty", "Effective From", "No Of Units", "New Patients", "Repeat Patients", "No of Male Beds", "No of Female Beds", "No Of Common Beds", "Max Stay Allowed", "Active", "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyId", width: 50, editable: true, align: 'left', hidden: true },
            
            { name: "SpecialtyDesc", width: 50, editable: false, hidden: false, align: 'left', resizable: true },

            {
                name: 'EffectiveFrom', index: 'EffectiveFrom', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },          
            { name: "NoOfUnits", width: 50, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "NewPatient", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "RepeatPatient", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "NoOfMaleBeds", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "NoOfFemaleBeds", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "NoOfCommonBeds", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MaxStayAllowed", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 74, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSpecialtyUnits(event,\'edit\')"><i class="fas fa-pencil-alt"></i> ' + localization.Edit + ' </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditSpecialtyUnits(event,\'view\')"><i class="far fa-file-alt"></i> ' + localization.View + ' </button>'

                }
            }
        ],
        pager: "#jqpSpecialtyUnits",
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
        scrollOffset: 0, caption:'Specialty Units',
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgSpecialtyUnits");
            //SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpSpecialtyUnits', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSpecialtyUnits', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSpecialtyUnits
    });
    fnAddGridSerialNoHeading();
}

function fnEditSpecialtyUnits(e, actiontype) {
   
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSpecialtyUnits').jqGrid('getRowData', rowid);
  
    $("#divGrid").hide();
    $("#divForm").css('display', 'block');
    $("#txtBusinesskey").val(rowData.BusinessKey);
    $("#txtSpecialtyId").val(rowData.SpecialtyId);
    $("#txtNoofUnits").val(rowData.NoOfUnits);
    $("#txtEffectiveFrom").val(rowData.EffectiveFrom);
    $("#txtNewPatient").val(rowData.NewPatient);
    $("#txtRepeatPatient").val(rowData.RepeatPatient);
    $("#txtNoofMaleBeds").val(rowData.NoOfMaleBeds);
    $("#txtNoofFemaleBeds").val(rowData.NoOfFemaleBeds);
    $("#txtCommonBeds").val(rowData.NoOfCommonBeds);
    $("#txtMaxStayAllowed").val(rowData.MaxStayAllowed);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if ($("#txtBusinesskey").val() === "0" || $("#txtBusinesskey").val() === 0) {
        $("#txtEffectiveFrom").attr('disabled', false);
    }
    else {
        $("#txtEffectiveFrom").attr('disabled', true);
    }

    if (actiontype.trim() == "edit") {
        $("#chkActiveStatus").prop('disabled', false);
        $("input").attr('readonly', false);
        $("#fnSaveSpecialtyUnits").html(' Update');
        $("#fnSaveSpecialtyUnits").show();
    }
    if (actiontype.trim() == "view") {
        $("#chkActiveStatus").prop('disabled', true);
        $("#fnSaveSpecialtyUnits").hide();
        $("input").attr('readonly', true);
        $("#txtEffectiveFrom").attr('disabled', true);
    }


}


function fnSaveSpecialtyUnits() {
    if (ValidateSpecialtyUnits() === false) {
        return;
    }
    $("#fnSaveSpecialtyUnits").attr('disabled', true);
    var bkey;
    if ($("#txtBusinesskey").val() === "0" || $("#txtBusinesskey").val() === 0) {
        bkey = $("#cboBusinessLocation").val();
    } else {
        bkey = $("#txtBusinesskey").val();
    }

    obj = {
        BusinessKey: bkey,
        SpecialtyId: $("#txtSpecialtyId").val(),
        EffectiveFrom: $("#txtEffectiveFrom").val(),
        NoOfUnits: $("#txtNoofUnits").val(),
        NewPatient: $("#txtNewPatient").val(),
        RepeatPatient: $("#txtRepeatPatient").val(),
        NoOfMaleBeds: $("#txtNoofMaleBeds").val(),
        NoOfFemaleBeds: $("#txtNoofFemaleBeds").val(),
        NoOfCommonBeds: $("#txtCommonBeds").val(),
        MaxStayAllowed: $("#txtMaxStayAllowed").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $.ajax({
        url: getBaseURL() + "/SpecialtyUnits/InsertOrUpdateSpecialtyUnits",
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#fnSaveSpecialtyUnits").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#fnSaveSpecialtyUnits").attr('disabled', true);
                fnCloseSpecialtyUnits();
                fnGridLoadSpecialtyUnits();

            }
            else {
                toastr.error(response.Message);
                $("#fnSaveSpecialtyUnits").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#fnSaveSpecialtyUnits").attr("disabled", false);
        }
    });
}



function ValidateSpecialtyUnits() {

    if (IsStringNullorEmpty($("#txtNoofUnits").val()) || $("#txtNoofUnits").val() === "0") {
        toastr.warning("Please Number of Units");
        return false;
    }
   
    if (IsStringNullorEmpty($("#txtEffectiveFrom").val())) {
        toastr.warning("Please Select Effective From Date");
        return false;
    }
    if (IsStringNullorEmpty($("#txtNewPatient").val()) || $("#txtNewPatient").val() === "0") {
        toastr.warning("Please Enter New Patient");
        return false;
    }
    if (IsStringNullorEmpty($("#txtRepeatPatient").val()) || $("#txtRepeatPatient").val() === "0") {
        toastr.warning("Please Enter Repeat Patient");
        return false;
    }
    if (IsStringNullorEmpty($("#txtNoofMaleBeds").val()) || $("#txtNoofMaleBeds").val() === "0") {
        toastr.warning("Please Enter Number of Male Beds");
        return false;
    }
    if (IsStringNullorEmpty($("#txtNoofFemaleBeds").val()) || $("#txtNoofFemaleBeds").val() === "0") {
        toastr.warning("Please Enter Number of Female Beds");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCommonBeds").val()) || $("#txtCommonBeds").val() === "0") {
        toastr.warning("Please Enter Common Beds");
        return false;
    }
    if (IsStringNullorEmpty($("#txtMaxStayAllowed").val()) || $("#txtMaxStayAllowed").val() === "0") {
        toastr.warning("Please Enter Max Stay Allowed");
        return false;
    }
}

function fnGridRefreshSpecialtyUnits() {
    $("#jqgSpecialtyUnits").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnCloseSpecialtyUnits() {
    $("#divForm").css('display', 'none');
    $("#divGrid").show();
    $("#fnSaveSpecialtyUnits").attr('disabled', false);
}

function SetGridControlByAction() {

    var eleEditEnable = document.querySelectorAll('#jqgEdit');

    for (var i = 0; i < eleEditEnable.length; i++) {
        eleEditEnable[i].disabled = false;
    }
    if (_userFormRole.IsEdit === false) {
        var eleEditDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleEditDisable.length; i++) {
            eleEditDisable[i].disabled = true;
            eleEditDisable[i].className = "ui-state-disabled";
        }
    }

    var eleViewEnable = document.querySelectorAll('#jqgView');
    for (var i = 0; i < eleViewEnable.length; i++) {
        eleViewEnable[i].disabled = false;
    }
    if (_userFormRole.IsView === false) {
        var eleViewDisable = document.querySelectorAll('#jqgView');
        for (var i = 0; i < eleViewDisable.length; i++) {
            eleViewDisable[i].disabled = true;
            eleViewDisable[i].className = "ui-state-disabled";
        }
    }
}