$(document).ready(function () {
    fnSetCurrentdate();
});
function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '') {
        fnLoadSpecialtyUnits();
    }

}
function fnLoadSpecialtyUnits() {
    $("#jqgSpecialtyUnits").jqGrid('GridUnload');
    $("#jqgSpecialtyUnits").jqGrid({
        url: getBaseURL() + '/SpecialtyUnits/GetSpecialtyListByBusinessKey?businessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SpecialtyID, localization.SpecialtyDesc,"",""],

        colModel: [

            { name: "SpecialtyID", width: 10, editable: false, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 100, editable: false, align: 'left'},
            {
               name: "Button", width: 50, editable: false, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                    var i = options.rowId;
                   return "<button id=btnEdit_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnEditUnitsValidity('" + rowObject.SpecialtyID +  "') > <i class='fas fa-edit c-white'></i>" + localization.Units + "</button >";

                }
            },
            {
                name: "Button", width: 50, editable: false, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                    var i = options.rowId;
                    return "<button id=btnEdit_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnEditIPInfo('" + rowObject.SpecialtyID + "') > <i class='fas fa-edit c-white'></i>" + localization.IPInfo + "</button >";

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpSpecialtyUnits",
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
        
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgSpecialtyUnits").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpSpecialtyUnits', { add: false, edit: false, search: false, del: false, refresh: false });   
    
}
function fnEditUnitsValidity(spid) {
    $('#hdSPID').val(spid);
    var rows = jQuery("#jqgSpecialtyUnits").getDataIDs();
    for (a = 0; a < rows.length; a++) {
        row = jQuery("#jqgSpecialtyUnits").getRowData(rows[a]);
        if (row['SpecialtyID'] === spid) {
            $('#txtSpecialty').val(row['SpecialtyDesc']);
            break;
        }
    }


    $("#PopupEditUnitsValidity").modal('show');
    fnGetUnitsValidity(spid);
}

function fnGetUnitsValidity(spid) {
    $("#jqgUnitsDetail").jqGrid('GridUnload');
    $("#jqgUnitsDetail").jqGrid({
        url: getBaseURL() + '/SpecialtyUnits/GetUnitsValidityBySpecialty?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + spid,
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.FromDate, localization.NoOfUnints],

        colModel: [
            { name: "EffectiveFrom", width: 100, editable: false, align: 'left', formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            { name: "NoOfUnits", width: 100, editable: false, align: 'left' },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpUnitsDetail",
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

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgUnitsDetail").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpUnitsDetail', { add: false, edit: false, search: false, del: false, refresh: false });

}

function fnAddSpecialtyUnitsValidity() {
    var txtServiceTypeDesc = $("#txtNUnits").val()
    if (txtServiceTypeDesc == "" || txtServiceTypeDesc == null || txtServiceTypeDesc == undefined || txtServiceTypeDesc == "0") {
        toastr.error("Please enter the no. of units");
        return false;
    }
    else {
        $("#btnAddUnit").attr("disabled", true);
        var fromdate = $("#txtfromdate").val();
        var sp = $('#hdSPID').val();
        var obj = {
            BusinessKey: $('#cboBusinessKey').val(),
            SpecialtyId: sp,
            EffectiveFrom: fromdate,
            NoOfUnits: $('#txtNUnits').val()
        }
        $.ajax({
            url: getBaseURL() + '/SpecialtyUnits/InsertSpecialtyUnitsValidity',
            type: 'POST',
            datatype: 'json',
            data: obj,
            success: function (response) {
                if (response.Status == true) {
                    toastr.success(response.Message);
                    fnGetUnitsValidity(sp);

                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnAddUnit").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnAddUnit").attr("disabled", false);
            }
        });
    }
}

function fnEditIPInfo(spid) {
    $('#hdSPId').val(spid);
    var rows = jQuery("#jqgSpecialtyUnits").getDataIDs();
    for (a = 0; a < rows.length; a++) {
        row = jQuery("#jqgSpecialtyUnits").getRowData(rows[a]);
        if (row['SpecialtyID'] === spid) {
            $('#txtspecialty').val(row['SpecialtyDesc']);
            break;
        }
    }

    fnclear();
    $("#PopupEditIPInfo").modal('show');
    fnGetIPInfo(spid);
}

function fnGetIPInfo(spid) {
    $.ajax({
        url: getBaseURL() + '/SpecialtyUnits/GetSpecialtyIPInfo?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + spid,
        success: function (result) {
            if (result != null) {
$("#txtNPatient").val(result.NewPatient);
            $("#txtRPatient").val(result.RepeatPatient);
            $("#txtMBed").val(result.NoOfMaleBeds);
            $("#txtFBed").val(result.NoOfFemaleBeds);
            $("#txtCBed").val(result.NoOfCommonBeds);
            $("#txtMStay").val(result.MaxStayAllowed);
            }
            
        }
    });
}
function fnclear() {
    $("#txtNPatient").val('');
    $("#txtRPatient").val('');
    $("#txtMBed").val('');
    $("#txtFBed").val('');
    $("#txtCBed").val('');
    $("#txtMStay").val('');
}


function fnAddOrUpdateIPInfo() {

    $("#btnAddIPInfo").attr("disabled", true);
        var fromdate = $("#txtfromdate").val();
        var sp = $('#hdSPId').val();
        var obj = {
            BusinessKey: $('#cboBusinessKey').val(),
            SpecialtyId: sp,
            EffectiveFrom: fromdate,
            NoOfUnits: $('#txtNUnits').val(),
            NewPatient: $("#txtNPatient").val(),
            RepeatPatient: $("#txtRPatient").val(),
            NoOfMaleBeds:$("#txtMBed").val(),
            NoOfFemaleBeds:$("#txtFBed").val(),
            NoOfCommonBeds:$("#txtCBed").val(),
            MaxStayAllowed:$("#txtMStay").val(),
        }
        $.ajax({
            url: getBaseURL() + '/SpecialtyUnits/AddOrUpdateSpecialtyIPInfo',
            type: 'POST',
            datatype: 'json',
            data: obj,
            success: function (response) {
                if (response.Status == true) {
                    toastr.success(response.Message);
                    fnGetUnitsValidity(sp);

                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnAddIPInfo").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnAddIPInfo").attr("disabled", false);
            }
        });
    
}




















function fnSetCurrentdate() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    document.getElementById("txtfromdate").value = today;
}
