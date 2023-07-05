var mnfcnamePrefix = "";

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        mnfcnamePrefix = $(this).text();
        fnGridLoadManufacturers(mnfcnamePrefix);
        $(this).addClass('active');
    });
    fnGridLoadManufacturers(mnfcnamePrefix);

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnManufacturers",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditManufacturers(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditManufacturers(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnGridLoadManufacturers(mnfcnamePrefix) {
    $("#jqgManufacturers").jqGrid('GridUnload');
    $("#jqgManufacturers").jqGrid({
        url: getBaseURL() + '/ConfigureDrug/GetManufacturerListByNamePrefix?manufacturerNamePrefix=' + mnfcnamePrefix,
        datatype: 'json',
        //mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ManufacturerID, localization.ManfShortName, localization.ManufacturerName, localization.OriginCode, localization.MarketedBy, localization.ISDCode, localization.Active, localization.Actions],
        colModel: [
            { name: "ManufacturerID", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ManfShortName", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ManufacturerName", width: 135, editable: true, align: 'left', hidden: false },
            { name: "OriginCode", width:50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MarketedBy", width: 100, editable: true, align: 'left', hidden: false },
            { name: "ISDCode", width: 65, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 84, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditManufacturers(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditManufacturers(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnManufacturers"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpManufacturers",
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
        scrollOffset: 0,
        loadComplete: function (data) {
            SetGridControlByAction();
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
    }).
        jqGrid('navGrid', '#jqpManufacturers', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpManufacturers', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddManufacturers
        }).
        jqGrid('navButtonAdd', '#jqpManufacturers', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshManufacturers
        });

    //    jqGrid('navGrid', '#jqpManufacturers', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpManufacturers', {
    //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshManufacturers
    //}).jqGrid('navButtonAdd', '#jqpManufacturers', {
    //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddManufacturers
    //    });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnGridAddManufacturers() {
    $("#divGridDrugManufacturers").hide();
    $("#divManufacturersForm").css('display', 'block');
    fnEnableControl(false);
    fnClearManufacturer();
}

function fnEditManufacturers(e, actiontype) {
    fnClearManufacturer();
    var rowid = $("#jqgManufacturers").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgManufacturers').jqGrid('getRowData', rowid);
    $('#txtManufacturerId').val(rowData.ManufacturerID);
    $("#txtMnfcShortName").val(rowData.ManfShortName);
    $("#txtManufacturer").val(rowData.ManufacturerName);
    $("#cboOriginCode").val(rowData.OriginCode);
    $("#cboOriginCode").selectpicker('refresh');
    $("#txtMarketedBy").val(rowData.MarketedBy);
    $("#cboCountryCode").val(rowData.ISDCode);
    $("#cboCountryCode").selectpicker('refresh');

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveDrugManufacturer").attr('disabled', false);
    
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not Authorized to Edit");
            return;
        }
        $("#divGridDrugManufacturers").hide();
        $("#divManufacturersForm").css('display', 'block');

        $("#btnSaveDrugManufacturer").html("<i class='fa fa-sync'></i> "+localization.Update);

        fnEnableControl(false);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $("#divGridDrugManufacturers").hide();
        $("#divManufacturersForm").css('display', 'block');

        $("#btnSaveDrugManufacturer").hide();
        fnEnableControl(true);
    }
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSetMarketedBy() {
    if ($("#cboOriginCode").val() == 'MK') {
        $("#txtMarketedBy").attr('disabled', false);
        $('#txtMarketedBy').val('');
    }
    else {
        $("#txtMarketedBy").attr('disabled', true);
        $('#txtMarketedBy').val('');
    }
}

function fnSaveDrugManufacturer() {
    if (validateManufacturer() === false) {
        return;
    }

    $("#btnSaveDrugManufacturer").attr('disabled', true);
    var MnfcId = $("#txtManufacturerId").val();
    var drugManufacturer;
    if (MnfcId === null || MnfcId === "") {
        drugManufacturer = {
            ManufacturerName: $("#txtManufacturer").val(),
            ManufacturerID: 0,
            ManfShortName: $("#txtMnfcShortName").val(),
            OriginCode: $("#cboOriginCode").val(),
            MarketedBy: $("#txtMarketedBy").val(),
            ISDCode: $("#cboCountryCode").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }
    else {
        drugManufacturer = {
            ManufacturerName: $("#txtManufacturer").val(),
            ManufacturerID: $("#txtManufacturerId").val(),
            ManfShortName: $("#txtMnfcShortName").val(),
            OriginCode: $("#cboOriginCode").val(),
            MarketedBy: $("#txtMarketedBy").val(),
            ISDCode: $("#cboCountryCode").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }

    $.ajax({
        url: getBaseURL() + '/ConfigureDrug/InsertOrUpdateManufacturer',
        type: 'POST',
        datatype: 'json',
        data: { drugManufacturer },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnGridRefreshManufacturers();
                $("#btnSaveDrugManufacturer").attr('disabled', false);
                fnBackToGrid();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDrugManufacturer").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDrugManufacturer").attr("disabled", false);
        }
    });
}

function validateManufacturer() {
    if ($("#cboCountryCode").val() === "0" || $("#cboCountryCode").val() === "") {
        toastr.warning("Please Select a ISD");
        $('#cboCountryCode').focus();
        return false;
    }
    if (IsStringNullorEmpty($("#txtManufacturer").val())) {
        toastr.warning("Please Enter the Manufacturer Name");
        return false;
    }
    if (IsStringNullorEmpty($("#txtMnfcShortName").val())) {
        toastr.warning("Please Enter the Manufacturer Short Name");
        return false;
    }
    if ($("#cboOriginCode").val() === "0" || $("#cboOriginCode").val() === "") {
        toastr.warning("Please Select a Origin Code");
        $('#cboOriginCode').focus();
        return false;
    }
    if ($("#cboCountryCode").val() === "0" || $("#cboCountryCode").val() === "") {
        toastr.warning("Please Select a ISD Code");
        $('#cboCountryCode').focus();
        return false;
    }
    if ($("#cboOriginCode").val() == "MK" && IsStringNullorEmpty($("#txtMarketedBy").val())) {
        toastr.warning("Please Select a Marketed By");
        return false;
    }
}

function fnClearManufacturer() {
    $('#txtManufacturerId').val('');
    $('#txtMnfcShortName').val('');
    $('#txtManufacturer').val('');
    $('#cboCountryCode').val("0");
    $('#cboCountryCode').selectpicker('refresh');
    $('#cboOriginCode').val("0");
    $('#cboOriginCode').selectpicker('refresh');
    $('#txtMarketedBy').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");

    $("#btnSaveDrugManufacturer").html("<i class='fa fa-save'></i> "+localization.Save);
    $("#btnSaveDrugManufacturer").show();
}

function fnGridRefreshManufacturers() {
    $("#jqgManufacturers").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $("#divGridDrugManufacturers").show();
    $("#divManufacturersForm").css('display', 'none');
}