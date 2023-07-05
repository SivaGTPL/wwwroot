
$(document).ready(function () {
    fnGridDepartmentClearanceDashBoard();
    $("input[name='rdform']").change(function () {
        //reload dropdownlist
        fnGridDepartmentClearanceDashBoard();
    })
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDepartmentClearance",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Clearance, icon: "edit", callback: function (key, opt) { fnDepartmantClearance(event, 'edit') } },
            
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Clearance + " </span>");
   

});
var actiontype = "";
function fnGridDepartmentClearanceDashBoard() {
    
    $("#jqgDepartmentClearance").GridUnload();

    $("input[name='rdform']").each(function () {

        if ($(this).is(":checked")) {

    if ($("#txtdept").val()!==0) {

        $("#jqgDepartmentClearance").jqGrid({
            url: getBaseURL() + '/DepartmentClearance/GetDepartmentClearanceDashboard?rdvalue=' + $(this).val(),
            datatype: 'json',
            mtype: 'POST',
            contentType: 'application/json; charset=utf-8',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: ["Business Key", "Booking Key", "Guest ID", "Guest Name","Gender", "Mobile Number", "Check-In-Date", "Check-Out-Date", "Status","Dept Status", "Action"],
            colModel: [
                { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
                { name: "BookingKey", width: 50, editable: true, align: 'left', hidden: true },
                { name: "GuestId", width: 50, editable: true, align: 'left', hidden: true },
                { name: "GuestName", width: 120, editable: true, align: 'left', hidden: false },
                {
                    name: "Gender", editable: true, width: 85, align: "left", edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "M: Male;F: Female" }
                },
                { name: "MobileNumber", width: 80, editable: true, align: 'left', hidden: false },
                {
                    name: "CheckInDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

                },
                {
                    name: "CheckOutDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

                },
                { name: "ActiveStatus", width: 35, editable: true,hidden:true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
                { name: "DeptStatus", width: 35, editable: true, hidden: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
 
                {
                    name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="mr-1 btn btn-outline" id="btnDepartmentClearance"><i class="fa fa-ellipsis-v"></i></button>'
                    }
                },
            ],

            pager: "#jqpDepartmentClearance",
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
            forceFit: true, caption: 'Department Clearance',
            loadComplete: function (data) {
                fnJqgridSmallScreen("jqgDepartmentClearance");
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
        }).jqGrid('navGrid', '#jqpDepartmentClearance', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDepartmentClearance', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDepartmantClearance
        });

        $(window).on("resize", function () {
            var $grid = $("#jqgDepartmentClearance"),
                newWidth = $grid.closest(".DepartmentClearancecontainer").parent().width();
            $grid.jqGrid("setGridWidth", newWidth, true);
        });
        fnAddGridSerialNoHeading();
            }

        }
    });
}

function fnDepartmantClearance(e, actiontype) {
    fnClearFields();
    var rowid = $("#jqgDepartmentClearance").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDepartmentClearance').jqGrid('getRowData', rowid);

    $('#txtBusinessKey').val(rowData.BusinessKey);
    $('#txtBookingKey').val(rowData.BookingKey);
    $('#txtGuestId').val(rowData.GuestId);
    if (rowData.DeptStatus == 'true') {
        $('#PopupDepartmentClearance').modal('hide');

    }
    else
    {
        $('#PopupDepartmentClearance').modal('show');

    }
    //$('#PopupDepartmentClearance').modal('show');
    $('#PopupDepartmentClearance').find('.modal-title').text('Departmant Clearance');
    $("#btnSaveDepartmentClearance").html('<i class="fa fa-sync"></i> ' + localization.Clearance);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDepartmentClearance").attr("disabled", false);


}

function fnSaveDepartmantClearance() {

    if (IsStringNullorEmpty($("#txtBookingKey").val())) {
        toastr.warning("Please enter the Booking Key");
        return;
    }
    if (IsStringNullorEmpty($("#txtGuestId").val())) {
        toastr.warning("Please enter the Guest Id");
        return;
    }
    
    obj = {
        BusinessKey: $('#txtBusinessKey').val(),
        BookingKey: $("#txtBookingKey").val(),
        GuestId: $("#txtGuestId").val(),
        DepartmentId: $('#txtdept').val(),
        Comments: $('#txtComments').val(),
        ClearanceStatus: true,
        ActiveStatus: true
    };
    
    $("#btnSaveDepartmentClearance").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/DepartmentClearance/InsertIntoDepartmentClearance',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveDepartmentClearance").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDepartmentClearance").modal('hide');
                fnClearFields();
                fnGridRefreshDepartmantClearance();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDepartmentClearance").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDepartmentClearance").attr("disabled", false);
        }
    });
}

function fnGridRefreshDepartmantClearance() {
    $("#jqgDepartmentClearance").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $('#txtBusinessKey').val('');
    $("#txtBookingKey").val('');
    $("#txtGuestId").val('');
    $("#txtComments").val('');
    $("#btnSaveDepartmentClearance").attr("disabled", false);
}

$("#btnCancelDepartmantClearance").click(function () {
    $("#jqgDepartmentClearance").jqGrid('resetSelection');
    $('#PopupDepartmentClearance').modal('hide');
    fnClearFields();
});


