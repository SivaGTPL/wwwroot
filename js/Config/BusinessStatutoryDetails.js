
var data_Statutorycodes = [];

var lstStatutorycodes = [];

$(document).ready(function () {
    $.each(StatutoryCodes, function (i, data) { lstStatutorycodes.push(data.StatutoryCode + ':' + data.StatutoryDescription); });
    lstStatutorycodes = lstStatutorycodes.join(';');
    fnGridBusinessStatutoryCodes();
});

function fnGridBusinessStatutoryCodes() {
    var businesskey = $("#cboBusinessKey").val();
    fnGetStatutoryCodesData(businesskey);
    var data_StatutorycodeMaster = [];

    for (var i = 0; i < data_Statutorycodes.length; i++) {
        data_StatutorycodeMaster.push({ "BusinessKey": data_Statutorycodes[i].BusinessKey, "StatutoryCode": data_Statutorycodes[i].StatutoryCode, "StatutoryDetail": data_Statutorycodes[i].StatutoryDetail, "ActiveStatus": data_Statutorycodes[i].ActiveStatus });
    }
    $('#jqgBusinessStatutoryDetails').jqGrid('GridUnload');
    $("#jqgBusinessStatutoryDetails").jqGrid({
        datatype: 'json',
        colNames: ["Business Key", "Statutory Code","Statutory Detail", "Status"],

        colModel: [
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            {
                name: "StatutoryCode", editable: true, width: 300, resizable: false, edittype: 'select', formatter: 'select', editoptions: {
                    value: lstStatutorycodes

                }
            },
            {
                name: "StatutoryDetail", width: 280, editable: true, editoptions: { size: "40", maxlength: "15" }, edittype: "text", editrules: {
                    custom_func: validateStatutoryDesc,
                    custom: true,
                }
            },
            { name: "ActiveStatus", editable: true, width: 85, edittype: "select", align: 'left', formatter: 'select', editoptions: { value: "true:Active;false:Inactive" } },

        ],
        datatype: "local",
        data: data_StatutorycodeMaster,
        jsonReader: { repeatitems: false },
        ignoreCase: true,
        rownumWidth: 55,
        rowNum: 10,
        rowList: [10, 20, 50,100],
        emptyrecords: "No Records to View",
        pager: "#jqpBusinessStatutoryDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        loadonce: true,
        forceFit: true,
        editurl: getBaseURL() + '/BusinessStructure/InsertOrUpdateBusinessStatutoryDetails',
        caption:'Business Statutory Details',
        ajaxRowOptions: {
            type: "POST",
            //contentType: "application/json",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            postData.BusinessKey = $("#cboBusinessKey").val();
            //return JSON.stringify(postData);
            return (postData);
        },
        ondblClickRow: function (rowid) {
            $("#jqgBusinessStatutoryDetails_iledit").trigger('click');
        },
        beforeSubmit: function (postdata, formid) {
            return [success, message];
        },
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgBusinessStatutoryDetails");
        }
         //fnAddGridSerialNoHeading();
    })
     .jqGrid('navGrid', '#jqpBusinessStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });

    $("#jqgBusinessStatutoryDetails").jqGrid('inlineNav', '#jqpBusinessStatutoryDetails',
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
                  $("#" + formid + "_StatutoryCode").prop('disabled', true);
                },
                url: null,
                extraparam: {
                },
                successfunc: function (result) {
                    var resp = JSON.parse(result.responseText);
                    if (resp.Status) {
                        toastr.success(resp.Message);
                        fnGridBusinessStatutoryCodes();
                        return true;
                    }
                    else{
                        toastr.error(resp.Message);
                        fnGridBusinessStatutoryCodes();
                        return false;
                    }
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST"
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    url: null,
                    extraparam: {
                    },
                    oneditfunc: function (rowid) {
                    },
                    successfunc: function (result) {
                        var response = JSON.parse(result.responseText);
                        if (response.Status) {
                            toastr.success(response.Message);
                            fnGridBusinessStatutoryCodes();
                            return true;
                        }
                        else {
                            toastr.error(response.Message);
                            fnGridBusinessStatutoryCodes();
                            return false;
                        }
                    },
                }
            }
        });
    fnAddGridSerialNoHeading();
}

function fnGetStatutoryCodesData(businesskey) {
    data_Statutorycodes = [];
    $.ajax({
        type: 'POST',
        async: false,
        url: getBaseURL() + '/BusinessStructure/GetBusinessStatutoryDetails?Businesskey=' + businesskey,
        success: function (response) {
            if (response) {
                for (var i = 0; i < response.length; i++) {
                    data_Statutorycodes.push({ "BusinessKey": response[i].BusinessKey, "StatutoryCode": response[i].StatutoryCode, "StatutoryDetail": response[i].StatutoryDetail, "ActiveStatus": response[i].ActiveStatus });
                }
            }
        },
        error: function (response) {
        }
    });
}


function validateStatutoryDesc(value, StatutoryDetail) {
    if (value == "" || value == null) {
        toastr.warning("Please Enter Statutory Details");

        return [false, "Please Enter Statutory Details"];

    }
    else {
        return [true, ""];
    }

}
