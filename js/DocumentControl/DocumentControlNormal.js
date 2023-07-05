$(function () {
    fnGridLoadDocumentControlNormal();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDocumentControlNormal",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDocumentControlNormal(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDocumentControlNormal(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDocumentControlNormal(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

var _isInsert = true;



function fnBusinessLocation_onChange() {

    fnGridLoadDocumentControlNormal();
}
function fnGridLoadDocumentControlNormal() {

    $("#jqgDocumentControlNormal").GridUnload();

    $("#jqgDocumentControlNormal").jqGrid({
        url: getBaseURL() + '/Standard/GetDocumentControlNormalModebyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Businesskey, localization.DocumentId, localization.finYear,  localization.DocumentName, localization.StartDocNumber, localization.CurrentDocNumber, localization.CurrentDocDate, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "DocumentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FinancialYear", width: 40, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "DocumentName", width: 70, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "StartDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CurrentDocNumber", width: 50, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            
            {
                name: 'CurrentDocDate', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDocumentControlNormal"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDocumentControlNormal",
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
        caption:'Document Control Normal',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpDocumentControlNormal");
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
    }).jqGrid('navGrid', '#jqpDocumentControlNormal', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDocumentControlNormal', {
         caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDocumentControlNormal
        }).jqGrid('navButtonAdd', '#jqpDocumentControlNormal', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDocumentControlNormal
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgDocumentControlNormal"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddDocumentControlNormal() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key to add");
        return;
    }
    else {
        $('#PopupDocumentControlNormal').modal('show');
        $('#PopupDocumentControlNormal').modal({ backdrop: 'static', keyboard: false });
        $('#PopupDocumentControlNormal').find('.modal-title').text(localization.AddDocumentNormalControl);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentControlNormal").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveDocumentControlNormal").show();
        $("#btndeActiveDocumentControlNormal").hide();
         _isInsert = true;

    }
}


function fnEditDocumentControlNormal(e, actiontype) {
    var rowid = $("#jqgDocumentControlNormal").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDocumentControlNormal').jqGrid('getRowData', rowid);
    _isInsert = false;
    $('#cbodocumentId').val(rowData.DocumentId).selectpicker('refresh');
    $("#cbodocumentId").next().attr('disabled', true);
    $('#txtfinancialyear').val(rowData.FinancialYear);
    $("#txtfinancialyear").attr('readonly', true);
    $('#txtStartdocNumber').val(rowData.StartDocNumber);
    $('#txtcurrentdocNumber').val(rowData.CurrentDocNumber);
    $("#dtdocdate").attr('readonly', true);
    if (rowData.CurrentDocDate !== null) {
        setDate($('#dtdocdate'), fnGetDateFormat(rowData.CurrentDocDate));
    }
    else {
        $('#dtdocdate').val('');
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDocumentControlNormal").attr("disabled", false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $('#PopupDocumentControlNormal').modal('show');
        $('#PopupDocumentControlNormal').find('.modal-title').text(localization.EditDocumentNormalControl);
        $("#btnSaveDocumentControlNormal").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveDocumentControlNormal").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentControlNormal").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupDocumentControlNormal').modal('show');
        $('#PopupDocumentControlNormal').find('.modal-title').text(localization.ViewDocumentNormalControl);
        $("#btnSaveDocumentControlNormal").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDocumentControlNormal").hide();
        $("#btndeActiveDocumentControlNormal").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDocumentControlNormal").on('hidden.bs.modal', function () {
            $("#btnSaveDocumentControlNormal").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not Authorized to Delete");
            return;
        }
        $('#PopupDocumentControlNormal').modal('show');
        $('#PopupDocumentControlNormal').find('.modal-title').text("Activate/De Activate Document Control Normal Mode");
        $("#btnSaveDocumentControlNormal").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDocumentControlNormal").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDocumentControlNormal").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDocumentControlNormal").html(localization.Activate);
        }

        $("#btndeActiveDocumentControlNormal").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDocumentControlNormal").on('hidden.bs.modal', function () {
            $("#btnSaveDocumentControlNormal").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshDocumentControlNormal() {
    $("#jqgDocumentControlNormal").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelDocumentControlNormal").click(function () {
    $("#jqgDocumentControlNormal").jqGrid('resetSelection');
    $('#PopupDocumentControlNormal').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cbodocumentId').val('0').selectpicker('refresh');
    $("#cbodocumentId").next().attr('disabled', false);
    $("#txtfinancialyear").val('');
    $("#txtfinancialyear").attr('readonly', false);
    $("#dtdocdate").attr('readonly', true);
    $('#txtStartdocNumber').val('');
    $("#chkActiveStatus").prop('disabled', false);
    $('#dtdocdate').val('');
    $("#btnSaveDocumentControlNormal").attr("disabled", false);
    $("#btndeActiveDocumentControlNormal").attr("disabled", false);
}


function fnSaveDocumentControlNormal() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        toastr.warning("Please select a Business key");
        return;
    }
    if (IsStringNullorEmpty($("#cbodocumentId").val()) || $("#cbodocumentId").val() === "0") {
        toastr.warning("Please select a Document");
        return;
    }
    if (IsStringNullorEmpty($("#txtfinancialyear").val())) {
        toastr.warning("Please Enter the Financial Year");
        return;
    }
    if (IsStringNullorEmpty($("#txtStartdocNumber").val())) {
        toastr.warning("Please Enter the Start Document");
        return;
    }
    
    objnormal = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DocumentId: $("#cbodocumentId").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        StartDocNumber: $("#txtStartdocNumber").val(),
        CurrentDocDate: getDate($("#dtdocdate")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveDocumentControlNormal").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Standard/InsertOrUpdateDocumentControlNormalMode',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objnormal },
        success: function (response) {
            if (response.Status) {
               
                toastr.success(response.Message);
                $("#btnSaveDocumentControlNormal").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDocumentControlNormal").modal('hide');
                fnClearFields();
                fnGridRefreshDocumentControlNormal();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDocumentControlNormal").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDocumentControlNormal").attr("disabled", false);
        }
    });
}

function fnDeleteDocumentControlNormal() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    objgen = {
        BusinessKey: $("#cboBusinessLocation").val(),
        DocumentId: $("#cbodocumentId").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        StartDocNumber: $("#txtStartdocNumber").val(),
        CurrentDocDate: getDate($("#dtdocdate")),
        a_status: a_status,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btndeActiveDocumentControlNormal").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Standard/ActiveOrDeActiveDocumentControlNormalMode',
        type: 'POST',
        datatype: 'json',
        data: { objgen },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveDocumentControlNormal").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDocumentControlNormal").modal('hide');
                fnClearFields();
                fnGridRefreshDocumentControlNormal();
                $("#btndeActiveDocumentControlNormal").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveDocumentControlNormal").attr("disabled", false);
                $("#btndeActiveDocumentControlNormal").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveDocumentControlNormal").attr("disabled", false);
            $("#btndeActiveDocumentControlNormal").html('De Activate');
        }
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

