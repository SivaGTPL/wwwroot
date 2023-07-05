var customerNamePrefix = "";

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        customerNamePrefix = $(this).text();
        fnGridLoadCustomerCodes();
        $(this).addClass('active');
    });
    fnGridLoadCustomerCodes();
});

function fnGridLoadCustomerCodes() {
    $("#jqgCustomerCodes").jqGrid('GridUnload');
    $("#jqgCustomerCodes").jqGrid({
        url: getBaseURL() + '/Customer/GetCustomerCodeInformationByNamePrefixOnHold?customerNamePrefix=' + customerNamePrefix + '&customerOnHold=' + $("#cboHCustomerHold").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CustomerName, localization.CustomerID, localization.CreditPeriodInDays, localization.CreditLimit, localization.ValidateLimit, localization.OnHold, localization.HoldReason, localization.Active, localization.Actions],
        colModel: [
            { name: "CustomerName", width: 105, editable: true, align: 'left', hidden: false },
            { name: "CustomerId", width: 35, editable: true, align: 'left', hidden: false },
            { name: "CreditPeriod", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "CreditLimit", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ValidateLimit", width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "CustomerOnHold", width: 40, editable: true, align: 'left', hidden: false, edittype: "select", formatter: 'select', editoptions: { value: "A: All;I: IP;N: Not Applicable;O: OP" } },
            { name: "HoldReason", width: 35, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width: 54, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditCustomerHold(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditCustomerHold(event,\'view\')"><i class="far fa-eye"></i> View </button>'
                }
            },
        ],
        pager: "#jqpCustomerCodes",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
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
        scrollOffset: 0, caption:"Customer Codes",
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgCustomerCodes");
        },
    }).jqGrid('navGrid', '#jqpCustomerCodes', { add: false, edit: false, search: true, del: false, refresh: false }, {}, {}, {}, { multipleSearch: true }).jqGrid('navButtonAdd', '#jqpCustomerCodes', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "jqgRefresh", position: "first", onClickButton: fnGridRefreshCustomerHold
        });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnEditCustomerHold(e, actiontype) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCustomerCodes').jqGrid('getRowData', rowid);

    if (rowData.CustomerId > 0) {
        $('#hdvCustomerId').val(rowData.CustomerId);
        $('#cboCustomerHold').val(rowData.CustomerOnHold);
        $('#cboCustomerHold').selectpicker('refresh');
        $('#cboHoldReason').val(rowData.HoldReason);
        $('#cboHoldReason').selectpicker('refresh');
        if (rowData.CustomerOnHold == "N")
            document.getElementById("holdReason").style.display = "none";
        else
            document.getElementById("holdReason").style.display = "block";

        $('#PopupCustomerHold').modal('show');
        $("#btnSaveCustomerHold").attr('disabled', false);
        if (actiontype.trim() == "edit") {
            $('#PopupCustomerHold').find('.modal-title').text(localization.EditCustomerHold);
        }
        if (actiontype.trim() == "view") {
            $('#PopupCustomerHold').find('.modal-title').text(localization.ViewCustomerHold);
            $("#btnSaveCustomerHold").hide();
            $("select").next().attr('disabled', true);
            $("#PopupCustomerHold").on('hidden.bs.modal', function () {
                $("#btnSaveCustomerHold").show();
                $("select").next().attr('disabled', false);
            });
        }
    }
}

function fnGridRefreshCustomerHold() {
    $("#jqgCustomerCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnSaveCustomerHold() {
    if (IsStringNullorEmpty($("#hdvCustomerId").val())) {
        toastr.warning("Please Select a Customer");
        return false;
    }

    //$("#btnSaveCustomerHold").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveCustomerHold").attr('disabled', true);
    var cs_hd = {
        CustomerId: $("#hdvCustomerId").val(),
        CustomerOnHold: $("#cboCustomerHold").val(),
        HoldReason: $("#cboCustomerHold").val() == "N" ? 0 : $("#cboHoldReason").val()
    };
    $.ajax({
        url: getBaseURL() + '/Customer/UpdateCustomerCodeForHold',
        type: 'POST',
        datatype: 'json',
        data: { cs_hd },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveCustomerHold").html(localization.Save);
                fnGridRefreshCustomerHold();
                $("#PopupCustomerHold").modal('hide');
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCustomerHold").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCustomerHold").attr('disabled', false);
        }
    });
}

function fnSetHoldReasonVisibilty() {
    if ($("#cboCustomerHold").val() == "N")
        document.getElementById("holdReason").style.display = "none";
    else
        document.getElementById("holdReason").style.display = "block";
}


function fnClearFields() {
    $('#cboCustomerHold').val('N');
    $('#cboCustomerHold').selectpicker('refresh');
    $('#cboHoldReason').val('0');
    $('#cboHoldReason').selectpicker('refresh');
}