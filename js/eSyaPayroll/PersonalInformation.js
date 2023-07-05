
function fnGridLanguagesKnown() {
    $("#jqgLanguagesKnown").GridUnload();
    $("#jqgLanguagesKnown").jqGrid(
        {
            url: getBaseURL() + '/Employee/GetEmployeeLanguagebyEmpNumber?EmpNumber=' + $("#txtEmployeenumber").val(),
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

            serializeGridData: function (postdata) {
                postdata.EmpNumber = $("#txtEmployeenumber").val();
                return JSON.stringify(postdata.EmpNumber);
            },
            colNames: ["", localization.Language, localization.Speak, localization.Read, localization.Write],
            colModel: [
                { name: "ApplicationCode", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'CodeDesc', index: 'CodeDesc', width: '228', resizable: false },
                {
                    name: 'SpeakStatus', index: 'SpeakStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
                {
                    name: 'ReadStatus', index: 'ReadStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
                {
                    name: 'WritekStatus', index: 'WritekStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth: 55,
            loadonce: true,
            pager: "#jqpLanguagesKnown", 
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false, scrollOffset: 0,
            onSelectRow: function (rowid) {
                ApplicationCode = $("#jqgLanguagesKnown").jqGrid('getCell', rowid, 'ApplicationCode');

            },
            loadComplete: function (data) {
                //fnDisableActivecheckboxs();
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            },
        })

        .jqGrid('navGrid', '#jqpLanguagesKnown', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpLanguagesKnown', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshLanguageGrid
        });
    fnAddGridSerialNoHeading();
}

function fnSaveBusinessLinks() {
    if (IsValidBusinessLinks() == false) {
        return;
    }
    var val = [];
    var numberOfRecords = $("#jqgLanguagesKnown").getGridParam("records");
    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgLanguagesKnown').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            val.push(rowData.ApplicationCode);

        }
    }

    var bkeys = {
        VendorCode: $("#txtVendorCode").val(),
        Businesslink: val
    };

    $.ajax({
        url: getBaseURL() + "/Vendor/InsertBusinesskeyforVendor",
        type: 'POST',
        datatype: 'json',
        data: { bkeys },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnRefreshLanguageGrid();
                return true;
            }
            else {
                toastr.error(response.Message);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}

function IsValidBusinessLinks() {
    if (IsStringNullorEmpty($("#txtVendorCode").val())) {
        toastr.warning("Please Create the Vendor Details");
        return false;
    }
}

function fnRefreshLanguageGrid() {
    $("#jqgLanguagesKnown").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}



