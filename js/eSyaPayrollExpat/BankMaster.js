var _isInsert = true;
var actiontype = "";

$(document).ready(function () {

    fnLoadGridBankMaster();

});

function fnBusinessLocation_onChange() {

    fnLoadGridBankMaster();
}



function fnLoadGridBankMaster() {

    $("#jqgBankMaster").GridUnload();

    $("#jqgBankMaster").jqGrid({
        url: getBaseURL() + '/BankMaster/GetBankMasterByBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        mtype: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["BusinessKey","Bank Code","Bank Name", "Bank Account No","Branch Code", "Branch Name ", "Branch Address", "Bank Charges", "Active", "Actions"],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "BankCode", width: 100, align: 'left', editable: true, resizable: false, hidden: false },
            { name: "BankName", width: 120, align: 'left', editable: true, resizable: false, hidden: false },
            { name: "BankAccountNumber", width: 100, align: 'left', editable: true, resizable: false, hidden: false },
            { name: "BranchCode", width: 100, align: 'left', editable: true,  resizable: false, hidden: false },
            { name: "BranchName", width: 100, align: 'left', editable: true,  resizable: false, hidden: false },
            { name: "BranchAddress", width: 120, align: 'left', editable: true, resizable: false ,hidden: true  },
            { name: "BankCharges", width: 80, align: 'left', editable: true, resizable: false, hidden: true },
            { name: "ActiveStatus", width: 65, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 88, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditBankMaster(event,\'edit\');"><i class="fas fa-pen"></i>' + 'Edit' + '</button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditBankMaster(event,\'view\');"><i class="far fa-eye"></i>' + 'View' + '</button>'
                }
            },
        ],
        pager: "#jqpBankMaster",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
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
        loadComplete: function (data) {
            //SetGridControlByAction();
        },
    }).jqGrid('navGrid', '#jqpBankMaster', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpBankMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBankMaster
        }).jqGrid('navButtonAdd', '#jqpBankMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBankMaster
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgBankMaster"),
            newWidth = $grid.closest(".BankDetailscontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddBankMaster() {

    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select a Business Key to add Bank Master");

    }
    else {
        _isInsert = true;
        fnClearBankMaster();
        $('#PopupBankMaster').find('.modal-title').text('Add Bank Master');
        $('#PopupBankMaster').modal('show');
        $("#btnSaveBankMaster").show();
        $("#btnSaveBankMaster").html('Save');
        $("#chkBankActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtBankCode").attr('readonly', false);
        fnLoadBankCurrencyGrid();
    }  
}

function fnEditBankMaster(e, actiontype) {

    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgBankMaster').jqGrid('getRowData', rowid);
    $("#txtBankCode").val(rowData.BankCode);
    $("#txtBankCode").attr("readonly", "readonly");
    $("#txtBankName").val(rowData.BankName);
    $("#txtBankAccountNumber").val(rowData.BankAccountNumber);
    $("#txtBranchCode").val(rowData.BranchCode);
    $("#txtBranchName").val(rowData.BranchName);
    $("#txtBankCharges").val(rowData.BankCharges);
    $("#txtBranchAddress").val(rowData.BranchAddress);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBankMaster").attr("disabled", false);
    $('#PopupBankMaster').modal('show');
    _isInsert = false;
    fnLoadBankCurrencyGrid();
    if (actiontype.trim() == "edit") {
        $('#PopupBankMaster').find('.modal-title').text('Update Bank Master');
        $("#btnSaveBankMaster").show();
        $("#btnSaveBankMaster").html('Update');
        $("#chkActiveStatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtBankCode").attr('readonly', true);
    }

    if (actiontype.trim() == "view") {
        $('#PopupBankMaster').find('.modal-title').text('View Bank Master');
        $("#btnSaveBankMaster").attr("disabled", true);
        $("#btnSaveBankMaster").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#chkActiveStatus").prop('disabled', true);

    }
}

function fnSaveBankMaster() {

    if (IsValidBankMaster() === false) {
        return;
    }
    var opted_currency = [];
    var numberOfRecords = $("#jqgBankCurrency").getGridParam("records");
    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgBankCurrency').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            opted_currency.push(rowData.CurrencyCode);

        }
    }

    var objbankmaster = {
        BusinessKey: $("#cboBusinessLocation").val(),
        BankCode: $("#txtBankCode").val(),
        BankName: $("#txtBankName").val(),
        BankAccountNumber: $("#txtBankAccountNumber").val(),
        BranchCode: $("#txtBranchCode").val(),
        BranchName: $("#txtBranchName").val(),
        BankCharges: $("#txtBankCharges").val(),
        BranchAddress: $("#txtBranchAddress").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        BankCurrencyList: opted_currency
    };
    $("#btnSaveBankMaster").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/BankMaster/InsertOrUpdateBankMaster',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objbankmaster },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#PopupBankMaster').modal('hide');
                fnGridRefreshBankMaster();
                $("#btnSaveBankMaster").attr('disabled', false);
                fnClearBankMaster();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBankMaster").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBankMaster").attr('disabled', false);
        }
    });

}

function IsValidBankMaster() {

    if (($("#cboBusinessLocation").val() === '0' || $("#cboBusinessLocation").val() === "")) {
        toastr.warning("Please Select Business Key");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankCode").val())) {
        toastr.warning("Please Enter the Bank Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankName").val())) {
        toastr.warning("Please Enter the Bank Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankAccountNumber").val())) {
        toastr.warning("Please enter the Bank Account Number");
        return false;
    }
    if (IsStringNullorEmpty($("#txtBankCharges").val())) {
        toastr.warning("Please enter the Bank Charges");
        return false;
    }
}

function fnGridRefreshBankMaster() {
    $("#jqgBankMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearBankMaster() {
    $("#txtBankCode").attr('readonly', false);
    $("#txtBankCode").val('');
    $("#txtBankName").val('');
    $("#txtBankAccountNumber").val('');
    $("#txtBranchCode").val('');
    $("#txtBranchName").val('');
    $("#txtBankCharges").val('');
    $("#txtBranchAddress").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveBankMaster").attr("disabled", false);
    $("#btnSaveBankMaster").html('Save');
}

$("#btnCancelBankMaster").click(function () {
    $("#jqgBankMaster").jqGrid('resetSelection');
    $('#PopupBankMaster').modal('hide');
    fnClearBankMaster();
});

function fnLoadBankCurrencyGrid() {

    $("#jqgBankCurrency").GridUnload();

    $("#jqgBankCurrency").jqGrid(

        {
            url: getBaseURL() + '/BankMaster/GetBankCurrencyByBusinessKey?businesskey=' + $("#cboBusinessLocation").val() + '&BankCode=' + $("#txtBankCode").val(),
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

            serializeGridData: function (postdata) {
                postdata.BankCode = $("#txtBankCode").val();
                return JSON.stringify(postdata.BankCode);
            },
            colNames: ["Currency Code", "Currency Name", "Select"],
            colModel: [
                { name: 'CurrencyCode', index: 'CurrencyCode', width: '60', resizable: false },
                { name: 'CurrencyName', index: 'CurrencyName', width: '100', resizable: false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10000,
            rownumWidth:'55',
            pager: "#jqpBankCurrency",
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
                if (id) { $('#jqgBankCurrency').jqGrid('editRow', id, true); }
            },
            loadComplete: function (data) {
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
                $("#jqgBankCurrency").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
              
            }
        }).
        jqGrid('navGrid', '#jqpBankCurrency', { add: false, edit: false, search: false, del: false, refresh: false });
        
   fnAddGridSerialNoHeading();
}
