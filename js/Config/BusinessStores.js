var data_Storecodes = [];
var lstStorecodes = [];

$(document).ready(function () {
    $.each(StoreCodes, function (i, data) { lstStorecodes.push(data.StoreCode + ':' + data.StoreDesc); });
    lstStorecodes = lstStorecodes.join(';');
    fnGridBusinessStores();
});

function fnGridBusinessStores() {
    var businesskey = $("#cboBusinesskey").val();
    fnGetBusinessStoreData(businesskey);
    var data_StorecodeMaster = [];
    for (var i = 0; i < data_Storecodes.length; i++) {
        data_StorecodeMaster.push({ "BusinessKey": data_Storecodes[i].BusinessKey, "StoreCode": data_Storecodes[i].StoreCode, "ActiveStatus": data_Storecodes[i].ActiveStatus });
    }
    $('#jqgBusinessStores').jqGrid('GridUnload');
    $("#jqgBusinessStores").jqGrid({
        datatype: 'json',
        colNames: ["Business Key", "Store Code", "Status"],
        colModel: [
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            {
                name: "StoreCode", editable: true, width: 300, resizable: false, edittype: 'select', formatter: 'select', editoptions: {
                    value: lstStorecodes
                }
            },
            
            { name: "ActiveStatus", editable: true, width: 85, edittype: "select", align: 'left', formatter: 'select', editoptions: { value: "true:Active;false:Inactive" } },

        ],
        datatype: "local",
        data: data_StorecodeMaster,
        jsonReader: { repeatitems: false },
        ignoreCase: true,
        rownumWidth: 55,
        rowNum: 10,
        rowList: [10, 20, 50,100],
        emptyrecords: "No Records to View",
        pager: "#jqpBusinessStores",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        caption:'Business Stores',
        editurl: getBaseURL() + '/BusinessStructure/InsertOrUpdateBusinessStores',
        ajaxRowOptions: {
            type: "POST",
            dataType: "json"
        },
         serializeRowData: function (postData) {
             postData.BusinessKey = $('#cboBusinesskey').val();
             return (postData);
        },
        ondblClickRow: function (rowid) {
            $("#jqgBusinessStores_iledit").trigger('click');
        },
        loadComplete: function (data) {
            fnJqgridSmallScreen('jqgBusinessStores');
        }
    })
      .jqGrid('navGrid', '#jqpBusinessStores', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgBusinessStores").jqGrid('inlineNav', '#jqpBusinessStores',
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
                    $("#" + formid + "_StoreCode").prop('disabled', true);
                },
                url: null,
                extraparam: {
                },
                successfunc: function (result) {
                    var resp = JSON.parse(result.responseText);
                    if (resp.Status) {
                        toastr.success(resp.Message);
                        fnGridBusinessStores();
                        return true;
                    }
                    else{
                        toastr.error(resp.Message);
                        fnGridBusinessStores();
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
                            fnGridBusinessStores();
                            return true;
                        }
                        else{
                            toastr.error(response.Message);
                            fnGridBusinessStores();
                            return false;
                        }
                    },
                }
            }
        });
    fnAddGridSerialNoHeading();
}

function fnGetBusinessStoreData(businesskey) {
    data_Storecodes = [];
    $.ajax({
        type: 'POST',
        async: false,
        url: getBaseURL() + '/BusinessStructure/GetBusinessStores?Businesskey=' + businesskey,
        success: function (response) {
            if (response) {
                for (var i = 0; i < response.length; i++) {
                    data_Storecodes.push({ "BusinessKey": response[i].BusinessKey, "StoreCode": response[i].StoreCode,"ActiveStatus": response[i].ActiveStatus });
                }
            }
        },
        error: function (response) {
            toastr.error(response.statusText);
        }
    });
}