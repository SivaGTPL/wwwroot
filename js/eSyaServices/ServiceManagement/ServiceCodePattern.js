$(document).ready(function () {
    fnGridLoadServiceCodePatterns();
});
function fnGridLoadServiceCodePatterns() {
    $("#jqgServiceCodePattern").jqGrid('GridUnload');
    $("#jqgServiceCodePattern").jqGrid({
        url: getBaseURL() + '/ServiceManagement/GetServiceCodePatterns',
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service Class ID", localization.ServiceClass, localization.ClassPattern, localization.CodeDigits, localization.Active],

        colModel: [

            { name: "ServiceClassID", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ServiceClassDesc",  width: 100,editable: true, align: 'left' },
            { name: "IntScpattern", width: 100, editable: true },
            { name: "IntSccode", width: 50, editable: true },
            { name: "ActiveStatus", editable: false, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceCodePattern",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpServiceCodePattern', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navGrid', '#jqpServiceCodePattern', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServiceCodePattern', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddServiceCodePattern
        });    
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}
function fnAddServiceCodePattern() {
    fnClearFields();
    $("#PopupServiceCodePattern").modal('show');
}
function fnClearFields() {
    $("#cboServiceClass").val("0").selectpicker('refresh');
    $("#txtPrefix").val("");   
    $("#txtCodeDigits").val("");
    $("#chkActiveStatus").parent().addClass("is-checked");
}
function fnSaveServiceCodePattern() {
    var txtCodeDigits = $("#txtCodeDigits").val();
    var txtPrefix = $("#txtPrefix").val();
    var cboServiceClass = $("#cboServiceClass").val();

    if (cboServiceClass == 0 || cboServiceClass == null || cboServiceClass == undefined) {
        toastr.warning("Please select a service class");
        return false;
    }
     else if (txtPrefix == "" || txtPrefix == null || txtPrefix == undefined) {
        toastr.warning("Please enter the class pattern");
        return false;
    }
    else if (txtCodeDigits == "" || txtCodeDigits == null || txtCodeDigits == undefined) {
        toastr.warning("Please enter the code digits");
        return false;
    }

    

    $("#btnSavePattern").attr('disabled', true);

    var obj = {
        ServiceClassId: $("#cboServiceClass").val(),
        IntScpattern: $("#txtPrefix").val(),
        IntSccode: $("#txtCodeDigits").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };


    $.ajax({
        url: getBaseURL() + '/ServiceManagement/AddServiceCodePattern',
        type: 'POST',
        datatype: 'json',
        data: obj,
        success: function (response) {
            if (response.Status) {
                toastr.success("Pattern Saved");
                $("#PopupServiceCodePattern").modal('hide');
                fnGridLoadServiceCodePatterns();
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSavePattern").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSavePattern").attr("disabled", false);
        }
    });
}
