$(function () {
    //fnGridLoadClinicRoomMaster();
})

function fnGridLoadClinicRoomMaster() {
    if (IsStringNullorEmpty($('#cboBusinessLocation').val()))
        return;
    if (IsStringNullorEmpty($('#cboFloor').val()))
        return;

    $('#jqgClinicRoomMaster').jqGrid('GridUnload');
    $("#jqgClinicRoomMaster").jqGrid({
        url: getBaseURL() + '/Clinics/GetClinicRoomListByBKeyFloorId?businessKey=' + $('#cboBusinessLocation').val() + '&floorId=' + $('#cboFloor').val(),
        datatype: "json",
        mtype: 'POST',
        contenttype: "application/json; charset-utf-8",
        colNames: [localization.RoomNumber,localization.Active],
        colModel: [
            {
                name: "RoomNo", width: 180, editable: true, hidden: false, editoptions: { maxlength: 10 }, align: 'left', edittype: 'text'
                //editrules: {
                //    custom_func: validateRoomNumber,
                //    custom: true
                //}
            },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        rowNum: 10000,
        rowList: [20, 40, 60, 80, 100],
        rownumWidth:55,
        emptyrecords: "No records to Veiw",
        pager: "#jqpClinicRoomMaster",
        pgtext: null,
        pgbuttons: null,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        editurl: getBaseURL() + '/Clinics/InsertUpdateIntoClinicRoomMaster',
        ajaxRowOptions: {
            type: "POST",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            if (IsStringNullorEmpty(postData.FloorId)) {
                postData.FloorId = $('#cboFloor').val();
            }
            if (IsStringNullorEmpty(postData.BusinessKey)) {
                postData.BusinessKey = $('#cboBusinessLocation').val();
            }
            postData.UserOperation = postData.oper;
            return (postData);
        },
        beforeSubmit: function (postdata, formid) {
            return [success, message];
        },
        ondblClickRow: function (rowid) {
            $("#jqgClinicRoomMaster").trigger('click');
        },

        loadComplete: function (data) {
            SetGridControlByAction("jqgClinicRoomMaster");
            fnAddGridSerialNoHeading();
        },
    }).jqGrid('navGrid', '#jqpClinicRoomMaster', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgClinicRoomMaster").jqGrid('inlineNav', '#jqpClinicRoomMaster',
        {
            edit: true,
            editicon: " fa fa-pen",
            edittext: "Edit",
            add: true,
            addicon: "fa fa-plus",
            addtext: "Add",
            save: true,
            savetext: "Save",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: "Cancel",
            editParams: {
                keys: false,
                oneditfunc: function (formid) {
                    $("#" + formid + "_RoomNo").prop('disabled', true);
                },
                url: null,
                successfunc: function (result) {
                    var res = JSON.stringify(result);
                    var response = JSON.parse(res);
                    var r = response.responseText;
                    var p = JSON.parse(r)
                    if (p.Status) {
                        toastr.success(p.Message);
                    }
                    else {
                        toastr.error(p.Message);
                    }
                    $("#jqgClinicRoomMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST",
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    oneditfunc: function (formid) {
                        $("#" + formid + "_ActiveStatus").prop('checked', true);
                    },
                    successfunc: function (result) {
                        var res = JSON.stringify(result);
                        var response = JSON.parse(res);
                        var r = response.responseText;
                        var p = JSON.parse(r)
                        if (p.Status) {
                            toastr.success(p.Message);
                        }
                        else {
                            toastr.error(p.Message);
                        }
                        $("#jqgClinicRoomMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                    },
                }
            }
        });
}

function validateRoomNumber(value, RoomNo) {
    if (IsStringNullorEmpty(value)) {
        toastr.warning("Please Enter the Room Number");
        return [false, "Please Enter Room Number"];

    }
    else {
        return [true, ""];
    }
}

function SetGridControlByAction(jqg) {
    $('#' + jqg + '_iladd').removeClass('ui-state-disabled');
    $('#' + jqg + '_iledit').removeClass('ui-state-disabled');
    if (_userFormRole.IsInsert === false) {
        $('#' + jqg + '_iladd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        $('#' + jqg + '_iledit').addClass('ui-state-disabled');
    }
}
