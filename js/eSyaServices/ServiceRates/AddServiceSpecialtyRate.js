$(document).ready(function () {

});
function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '' && $('#cboSpecialty').val() != '') {
        fnLoadServiceSpecialtyRate();
    }

}
function fnLoadServiceSpecialtyRate() {
    $("#jqgServiceSpecialtyRate").jqGrid('GridUnload');
    $("#jqgServiceSpecialtyRate").jqGrid({
        url: getBaseURL() + '/ServiceRates/GetServiceSpecialtyRateByBKeyRateTypeCurrCodeForAdd?businessKey=' + $('#cboBusinessKey').val() + '&ratetype=' + $('#cboRateType').val() + '&currencycode=' + $('#cboCurrencyCode').val() + '&specialtyId=' + $('#cboSpecialty').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID", localization.ServiceType, localization.ServiceGroup, localization.ServiceClass, localization.ServiceDescription, localization.EffectiveDate, localization.ServiceRule, localization.ServiceRate,localization.Active],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceTypeDesc", width: 100, editable: false, align: 'left', hidden: true},
            { name: "ServiceGroupDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceClassDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                            { newformat: _cnfjqgDateFormat },
                        editable: true, editoptions: {
                            size: 20,
                            dataInit: function (el) {
                                $(el).datepicker({ dateFormat: _cnfDateFormat });
                            }
                        }
                    },
            { name: "ServiceRule", editable: true, width: 50, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "F: Fixed;V: Variable;E: Entry" } },
            { name: "ServiceRate", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" }  },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceSpecialtyRate",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',
        onSelectRow: function (rowid) {
            date = $("#jqgServiceSpecialtyRate").jqGrid('getCell', rowid, "EffectiveDate");
            strdate = date;
            date = moment(date, 'DD-MM-YYYY').toDate();


            $("#dtServiceRateDate").datepicker().datepicker("setDate", date);
            var row = $("#jqgServiceSpecialtyRate").closest('tr.jqgrow');
            $("#" + rowid + "_EffectiveDate", row[0]).val(date);
            Selectedrowid = rowid;

        },
        //ondblClickRow: function (rowid) {
        //    $('#jqgServiceSpecialtyRate').jqGrid('editRow', rowid, true); 
        //},
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceSpecialtyRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
        }
    }).jqGrid('navGrid', '#jqpServiceSpecialtyRate', { add: false, edit: false, search: false, del: false, refresh: false });   
    $("#btnSave").show();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveServiceSpecialtyRate() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val())) {
        toastr.warning("Please select a Business Location");
        return;
    }
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        toastr.warning("Please select a Rate Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        toastr.warning("Please select a Currency Code");
        return;
    }
    $("#jqgServiceSpecialtyRate").jqGrid('editCell', 0, 0, false);
    var Service_BR = [];
    var id_list = jQuery("#jqgServiceSpecialtyRate").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgServiceSpecialtyRate').jqGrid('getRowData', rowId);

            Service_BR.push({
                BusinessKey: $("#cboBusinessKey").val(),
                RateType: $("#cboRateType").val(),
                CurrencyCode: $("#cboCurrencyCode").val(),
                SpecialtyId: $("#cboSpecialty").val(),
                ServiceId: rowData.ServiceId,
                EffectiveDate: rowData.EffectiveDate,
                ServiceRule: rowData.ServiceRule,
                ServiceRate: rowData.ServiceRate,
                ActiveStatus: rowData.ActiveStatus
            });
       
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ServiceRates/AddServiceSpecialtyRate',
        type: 'POST',
        datatype: 'json',
        data: { obj: Service_BR },
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Data Saved");
                $("#jqgServiceSpecialtyRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}

//$(document).on('focusout', '[role="gridcell"] *', function () {
//    $("#jqgServiceSpecialtyRate").jqGrid('editCell', 0, 0, false);

//});
