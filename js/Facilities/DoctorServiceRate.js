﻿$(document).ready(function () {
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorServiceRate');
        }
    })
});

function fnBusinessLocation_onChange() {

    fnLoadGrid();
}

function fnLoadGrid() {

    if ($('#cboBusinessLocation').val() != '' && $('#cboDoctor').val() != '' && $('#cboService').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '') {
        fnLoadDoctorServiceRateGrid();
    }

}
function fnLoadDoctorServiceRateGrid() {
    $("#jqgDoctorServiceRate").jqGrid('GridUnload');
    $("#jqgDoctorServiceRate").jqGrid({
        url: getBaseURL() + '/DoctorServiceRate/GetDoctorServiceRateByBKeyServiceIdCurrCodeRateType?businessKey=' + $('#cboBusinessLocation').val() + '&serviceId=' + $('#cboService').val() + '&doctorId=' + $('#cboDoctor').val() + '&currencycode=' + $('#cboCurrencyCode').val()
            + '&ratetype=' + $('#cboRateType').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID", "Doctor ID", localization.ServiceDescription,  localization.EffectiveDate, localization.Tariff, localization.Active],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "DoctorId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            //{ name: "DoctorDesc", width: 100, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    //{ newformat: _cnfjqgDateFormat },
                    { dateFormat: "dd/M/yy" },
                editable: true, editoptions: {
                    size: 20,
                    //dataInit: function (el) {
                    //    $(el).datepicker({ dateFormat: _cnfDateFormat });
                    //}
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: "dd/M/yy" });
                    }
                }
            },
            { name: "Tariff", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpDoctorServiceRate",
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
        //onSelectRow: function (rowid) {
        //    date = $("#jqgDoctorServiceRate").jqGrid('getCell', rowid, "EffectiveDate");
        //    strdate = date;
        //    date = moment(date, 'DD-MM-YYYY').toDate();


        //    $("#dtServiceRateDate").datepicker().datepicker("setDate", date);
        //    var row = $("#jqgDoctorServiceRate").closest('tr.jqgrow');
        //    $("#" + rowid + "_EffectiveDate", row[0]).val(date);
        //    Selectedrowid = rowid;

        //},
        onSelectRow: function (id) {
            if (id) { $('#jqgDoctorServiceRate').jqGrid('editRow', id, true); }
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgDoctorServiceRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgDoctorServiceRate');
        }
    }).jqGrid('navGrid', '#jqpDoctorServiceRate', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#btnSave").show();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveDoctorServiceRate() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        toastr.warning("Please select Business Location");
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctor").val())) {
        toastr.warning("Please select Doctor");
        return;
    }
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        toastr.warning("Please select Rate Type");
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        toastr.warning("Please select Currency Code");
        return;
    }
    
    $("#jqgDoctorServiceRate").jqGrid('editCell', 0, 0, false);
    var Clinic_VR = [];
    var id_list = jQuery("#jqgDoctorServiceRate").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgDoctorServiceRate').jqGrid('getRowData', rowId);

        Clinic_VR.push({
            BusinessKey: $("#cboBusinessLocation").val(),
            CurrencyCode: $("#cboCurrencyCode").val(),
            RateType: $("#cboRateType").val(),
            DoctorId: $("#cboDoctor").val(),
            ServiceId: rowData.ServiceId,
            EffectiveDate: rowData.EffectiveDate,
            Tariff: rowData.Tariff,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/InsertOrUpdateDoctorServiceRate',
        type: 'POST',
        datatype: 'json',
        data: { obj: Clinic_VR },
        success: function (response) {
            if (response.Status === true) {
                toastr.success("Data Saved");
                $("#jqgDoctorServiceRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
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

