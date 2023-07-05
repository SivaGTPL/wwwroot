

$(document).ready(function () {
    $('#chkDoctorLeave').parent().addClass("is-checked");
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctorLeave",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { FnEditDoctorLeave(event) } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeleteDoctorLeave(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})
function fnLoadDoctorLeaveGrid() {

    $("#jqgDoctorLeave").GridUnload();

    $("#jqgDoctorLeave").jqGrid({

        url: getBaseURL() + '/Doctors/GetDoctorLeaveListAll?doctorId=' + $('#txtDoctorId').val(),
        datatype: 'json',
        mtype: 'POST',
        colNames: ["", localization.LeaveFrom, localization.LeaveTill, localization.NumberOfDays, localization.Active, ""],
        colModel: [
            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            {
                name: "OnLeaveFrom", editable: true, width: 160, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            {
                name: "OnLeaveTill", editable: true, width: 160, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat, srcformat: 'Y-m-d', }

            },
            { name: "NoOfDays", width: 100, editable: true, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'delete', search: false, align: 'center', width: 150, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        //return '<button class="btn-xs ui-button ui-widget ui-corner-all" style="padding: 2px 4px; background: #0b76bc!important; color: #fff!important; margin: 3px; " title="Edit" onclick="return Fn_EditOnLeaveFromDoctor(event)"><i class="fa fa-edit"></i> Edit </button>'
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" id="jqgDLEdit" onclick = "return FnEditDoctorLeave(event)" > <i class="fas fa-pen"></i> ' + localization.Edit + ' </button > ' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDLDelete", onclick = "return fnDeleteDoctorLeave(event)" > <i class="far fa-trash-alt"></i> ' + localization.Delete + ' </button > '
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorLeave"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpDoctorLeave",
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
            SetDoctorLeaveGridControlByAction("jqgDoctorLeave");
            fnJqgridSmallScreen('jqgDoctorLeave');
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

    }).jqGrid('navGrid', '#jqpDoctorLeave', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctorLeave', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: toRefresh
        });
    fnAddGridSerialNoHeading();
}

function toRefresh() {
    $("#jqgDoctorLeave").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnCalculateLeaveDays() {

    if ($('#txtOnLeaveFromDoctor').val() != '' && $('#txtOnLeaveTillDoctor').val() != '') {

        var start =new Date(getDate($('#txtOnLeaveFromDoctor')));
        var end = new Date(getDate($('#txtOnLeaveTillDoctor')));
        
        var diff = new Date(end - start);
        
        var days = diff / (1000 * 60 * 60 * 24);
        
        days = Math.floor(days) + 1;
        
        return days;
    }
    else
        return 0;
}

function FnEditDoctorLeave(e) {

    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgDoctorLeave').jqGrid('getRowData', rowid);
    var rowid = $("#jqgDoctorLeave").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorLeave').jqGrid('getRowData', rowid);
    if (rowData != null) {

        $.ajax({
            url: getBaseURL() + '/Doctors/GetDoctorLeaveData?doctorId=' + rowData.DoctorId + '&leaveFromDate=' + fnGetDateFormat(rowData.OnLeaveFrom).toDateString(),
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response !== null) {
                    //alert(JSON.stringify(response));
                    $('#hdvDoctorLeaveFromDate').val(response.OnLeaveFrom);
                    setDate($('#txtOnLeaveFromDoctor'), response.OnLeaveFrom);
                    setDate($('#txtOnLeaveTillDoctor'), response.OnLeaveTill);
                    if (response.ActiveStatus)
                        $('#chkDoctorLeaveActive').parent().addClass("is-checked");
                    else
                        $('#chkDoctorLeaveActive').parent().removeClass("is-checked");

                    $('#txtOnLeaveFromDoctor').attr('disabled', true);
                    $("#btnSaveDoctorLeave").html('<i class="far fa-save"></i> ' + localization.Update);

                }

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });
    }
}

function fnSaveDoctorLeave() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        toastr.warning("Please Select Doctor");
        return;
    }
    if ($('#txtOnLeaveFromDoctor').val() == '') {
        toastr.warning("Leave From Date can't be blank.");
        $('#txtOnLeaveFromDoctor').focus();
        return;
    }
    if ($('#txtOnLeaveTillDoctor').val() == '') {
        toastr.warning("Leave Till Date can't be blank.");
        $('#txtOnLeaveTillDoctor').focus();
        return;
    }
    
    if (getDate($('#txtOnLeaveTillDoctor')) < getDate($('#txtOnLeaveFromDoctor'))) {
        toastr.warning("Leave Till Date can't be less than Leave From Date.");
        return;
    }
    
    $("#btnSaveDoctorLeave").attr('disabled', true);

    var obj = {

        DoctorId: $('#txtDoctorId').val(),
        OnLeaveFrom: getDate($('#txtOnLeaveFromDoctor')),
        OnLeaveTill: getDate($('#txtOnLeaveTillDoctor')),
        NoOfDays: fnCalculateLeaveDays(),
        ActiveStatus: $('#chkDoctorLeaveActive').parent().hasClass("is-checked")
    };

    var URL = '';
    if ($('#hdvDoctorLeaveFromDate').val() == '')
        URL = getBaseURL() + '/Doctors/InsertDoctorLeave';
    else
        URL = getBaseURL() + '/Doctors/UpdateDoctorLeave';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnClearDoctorLeave();
                    fnLoadDoctorLeaveGrid();

                    $("#btnSaveDoctorLeave").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctorLeave").attr('disabled', false);
                    toastr.error(response.Message);

                }
            }
            else {
                $("#btnSaveDoctorLeave").attr('disabled', false);
                toastr.error(response.Message);

            }
        },
        error: function (error) {
            $("#btnSaveDoctorLeave").attr("disabled", false);
            toastr.error(error.statusText);

        }
    });
}

function fnDeleteDoctorLeave(e) {
    var rowid = $("#jqgDoctorLeave").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorLeave').jqGrid('getRowData', rowid);
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgDoctorLeave').jqGrid('getRowData', rowid);

    if (rowData !== null) {

        var obj = {

            DoctorId: $('#txtDoctorId').val(),
            OnLeaveFrom: rowData.OnLeaveFrom,
            OnLeaveTill: rowData.OnLeaveTill,
            ActiveStatus: false
        };

        $.ajax({
            url: getBaseURL() + '/Doctors/UpdateDoctorLeave',
            type: 'POST',
            datatype: 'json',
            data: { obj },
            success: function (response) {
                if (response !== null) {
                    if (response.Status) {
                        toastr.success(response.Message);
                        //fnClearDoctorLeave();
                        fnLoadDoctorLeaveGrid();

                        //$("#btnSaveDoctorLeave").attr('disabled', false);
                    }
                    else {
                        //$("#btnSaveDoctorLeave").attr('disabled', false);
                        toastr.error(response.Message);

                    }
                }
                else {
                    //$("#btnSaveDoctorLeave").attr('disabled', false);
                    toastr.error(response.Message);

                }
            },
            error: function (error) {
                //$("#btnSaveDoctorLeave").attr("disabled", false);
                toastr.error(error.statusText);

            }
        });

    }
}

function fnClearDoctorLeave() {

    $('#txtOnLeaveFromDoctor').val('');
    $('#txtOnLeaveTillDoctor').val('');
    $('#chkDoctorLeaveActive').parent().addClass("is-checked");
    $('#hdvDoctorLeaveFromDate').val('');

    $("#btnSaveDoctorLeave").html('<i class="far fa-save"></i> ' + localization.Save);
    $('#txtOnLeaveFromDoctor').attr('disabled', false);
}

function SetDoctorLeaveGridControlByAction(jqg) {

    
    if (_formEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgDLEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }

    }
    if (_formDelete === false) {
        var eleDisable = document.querySelectorAll('#jqgDLDelete');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }

    }
}