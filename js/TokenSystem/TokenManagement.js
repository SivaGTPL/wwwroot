﻿var arr_Type = [];
$(document).ready(function () {

});

function fnGridLoadCounterDetail(_type) {
    $("#jqgCounter_" + _type).jqGrid('GridUnload');
    $("#jqgCounter_" + _type).jqGrid(
        {
            url: getBaseURL() + '/TokenManagement/GetTokenDetailByTokenType',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                tokenType: _type,
            },
            colNames: [ "Token Number", "S.No", "","", "",/* "", "",*/ "","",""],
            colModel: [
                
                { name: "TokenKey", width: 30, editable: true, align: 'left' },
                { name: "SequeueNumber", width: 20, editable: true, align: 'left', hidden: true },
                { name: "TokenType", width: 20, editable: true, align: 'left', hidden: true },
                {
                    name: "Button", width: 80, editable: true, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnCall_" + rowObject.TokenType + i + " type='button' class='btn btn-success' onclick=fnCallingToken('" + rowObject.TokenKey + "','" + rowObject.TokenType + "')><i class='fa fa-phone' aria-hidden='true'></i> Call</button>"
                            +
                            "&nbsp; <button id=btnConfirm_" + rowObject.TokenType + i + " type='button' class='btn btn-success' onclick=fnCallingConfirmation('" + rowObject.TokenKey + "','" + rowObject.TokenType + "','" + rowObject.TokenCalling + "')> Confirm</button>"
                            +
                            "&nbsp; <button id=btnHold_" + rowObject.TokenType + i + "  type='button' class='btn btn-danger mr-3' onclick=fnUpdateTokenToHold('" + rowObject.TokenKey + "','" + rowObject.TokenType + "')><i class='fas fa-pause c-white'></i> Hold</button> "
                            +
                            " <button id=btnRelease_" + rowObject.TokenType + i + " type = 'button' class='btn btn-success' onclick = fnUpdateTokenToRelease('" + rowObject.TokenKey + "','" + rowObject.TokenType + "') > <i class='fas fa-play c-white'></i> Release</button > "

                            ;
                    }
                },
                { name: "TokenHold", width: 100, editable: true, align: 'left', hidden: true },
                //{
                //    name: "Button", width: 70, editable: true, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                //        return "<button type='button' class='btn btn-primary' onclick=fnUpdateTokenStatusToCompleted('" + rowObject.TokenKey + "','" + rowObject.TokenType + "')><i class='fas fa-external-link-alt c-white'></i> Complete</button>"
                //    }
                //},
                //{
                //    name: "Button", width: 70, editable: true, align: 'center', hidden: false, formatter: function (cellValue, option, rowObject) {
                //        var i = option.rowId;
                //        return "<button id=btnHold_" + rowObject.TokenType + i + "  type='button' class='btn btn-danger mr-3' onclick=fnUpdateTokenToHold('" + rowObject.TokenKey + "','" + rowObject.TokenType + "')><i class='fas fa-pause c-white'></i> Hold</button> " +
                //            " <button id=btnRelease_" + rowObject.TokenType + i + " type = 'button' class='btn btn-success' onclick = fnUpdateTokenToRelease('" + rowObject.TokenKey + "','" + rowObject.TokenType + "') > <i class='fas fa-play c-white'></i> Release</button > "
                //    }
                //},
                { name: "TokenCalling", width: 120, editable: true, align: 'left', hidden: true },
                { name: "CallingConfirmation", width: 120, editable: true, align: 'left', hidden: true },
                { name: "ConfirmationUrl", width: 120, editable: true, align: 'left', hidden: true }
            ],
            rowNum: 10000,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            scroll: false,
            loadonce: true,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: false, 
            loadComplete: function () {
                var rowIds = $('#jqgCounter_' + _type).jqGrid('getDataIDs');
                for (i = 0; i < rowIds.length; i++) {

                    rowData = $('#jqgCounter_' + _type).jqGrid('getRowData', rowIds[i]);

                    if (rowData["TokenHold"] === "true") {
                        $("#btnHold_" + _type + rowIds[i]).hide();
                    }
                    else {
                        $("#btnRelease_" + _type + rowIds[i]).hide();
                    }

                    if (rowData["TokenCalling"] === "true") {
                        $("#btnCall_" + _type + rowIds[i]).removeClass("btn-success");
                        $("#btnCall_" + _type + rowIds[i]).addClass("btn-danger");
                    }

                    if (rowData["CallingConfirmation"] === "true") {
                        $("#btnCall_" + _type + rowIds[i]).attr('disabled', true);
                        $("#btnConfirm_" + _type + rowIds[i]).attr('disabled', true);
                    }
                }

            },
        });

}
function fnLoadCounters() {
    $("#cboCounter").empty();
    $("#dvGridData").html('');
    $('#lblCurrentlyServingToken').text("0");
    clearInterval(myTimer);
    document.querySelector('#lblTokenTimer').textContent = "00:00";
    arr_Type = [];
    $.ajax({
        url: getBaseURL() + '/CounterMapping/GetCounterNumbersbyFloorId?floorId=' + $("#cboFloor").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response, data) {

            $("#cboCounter").append($("<option value='0' selected> Select </option>"));
            for (var i = 0; i < response.length; i++) {
                $("#cboCounter").append($("<option></option>").val(response[i]["CounterNumber"]).html(response[i]["CounterNumber"]));
            }
            $('#cboCounter').selectpicker('refresh');

        },
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        }
    });
}
function fnGetTokenTypes() {
    arr_Type = [];
    $("#dvGridData").html('');
    $('#lblCurrentlyServingToken').text("0");
    clearInterval(myTimer);
    document.querySelector('#lblTokenTimer').textContent = "00:00";
    $.ajax({
        url: getBaseURL() + '/TokenManagement/GetTokenTypeByCounter?counterNumber=' + $("#cboCounter").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response, data) {
            arr_Type = response;
            var content = "";
            for (var i = 0; i < arr_Type.length; i++) {
                content += "<div class='col-lg-12'><h5>" + arr_Type[i].TokenDesc + "</h5><table id='jqgCounter_" + arr_Type[i].TokenType + "'> </table><div id='jqpCounter_" + arr_Type[i].TokenType + "'><br/></div></div>";
            }
            $("#dvGridData").html(content);
            for (var i = 0; i < arr_Type.length; i++) {
                fnGridLoadCounterDetail(arr_Type[i].TokenType)
            }
        },
        error: function (xhr) {
            toastr.error('Error: ' + xhr.statusText);
        }
    });


}

function fnCallingToken(TokenKey, TokenType) {
    $('#lblCurrentlyServingToken').text(TokenKey);
    $('#hdvTokenType').val(TokenType);

    fnRecallToken();
}

function fnRecallToken() {


    if ($("#cboFloor").val() === "") {
        toastr.error("Please select a Floor");
        return false;
    }
    if ($("#cboCounter").val() === "" || $("#cboCounter").val() === "0") {
        toastr.error("Please select a Counter");
        return false;
    }
    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        toastr.error("No token is selected");
        return false;
    }
    var obj = {
        TokenKey: currentlyServingToken,
        TokenType: $('#hdvTokenType').val(),
        CallingCounter: $("#cboCounter").val(),
    };

    if (currentlyServingToken.length > 1) {
        $.ajax({
            url: getBaseURL() + '/TokenManagement/UpdateCallingToken',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            success: function (result) {

                if (result.Status) {
                    toastr.success("Calling the Token : " + result.Key);
                    var waitMinutes = 60 * 3;
                    display = document.querySelector('#lblTokenTimer');
                    startTimer(waitMinutes, display);
                    jQuery("#jqgCounter_" + $('#hdvTokenType').val()).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    toastr.error(result.Message);
                    return false;
                }

            },
            error: function (error) {
                toastr.error(error.statusText);
                return false;
            }
        });
    }

}
function fnHoldToken() {

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        toastr.error("No token is selected");
        return false;
    }

    var obj = {
        TokenKey: currentlyServingToken,
        TokenType: $('#hdvTokenType').val(),
        CallingCounter: $("#cboCounter").val(),
    };

    if (currentlyServingToken.length > 1) {

        $.ajax({
            url: getBaseURL() + '/TokenManagement/UpdateTokenToHold',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            success: function (result) {

                if (result.Status) {
                    toastr.success("Token Holded : " + currentlyServingToken);
                    $('#lblCurrentlyServingToken').text("0");
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";

                    jQuery("#jqgCounter_" + $('#hdvTokenType').val()).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    toastr.error(result.Message);
                    return false;
                }
            },
            error: function (error) {
                toastr.error(error.statusText);
                return false;
            }
        });
    }

}
function fnUpdateTokenToHold(TokenKey, TokenType) {

    bootbox.confirm({
        message: "Do you want to hold this Token " + TokenKey + " ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    TokenKey: TokenKey,
                    TokenType: TokenType
                };

                $.ajax({
                    url: getBaseURL() + '/TokenManagement/UpdateTokenToHold',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    success: function (result) {

                        if (result.Status) {
                            toastr.success("Token Holded " + TokenKey);

                            jQuery("#jqgCounter_" + TokenType).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            toastr.error(result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        toastr.error(error.statusText);
                        return false;
                    }
                });
            }
        }
    });

}
function fnUpdateTokenToRelease(TokenKey, TokenType) {

    bootbox.confirm({
        message: "Do you want to hold this Token " + TokenKey + " ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    TokenKey: TokenKey,
                    TokenType: TokenType
                };

                $.ajax({
                    url: getBaseURL() + '/TokenManagement/UpdateTokenToRelease',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    success: function (result) {

                        if (result.Status) {
                            toastr.success("Token Release " + TokenKey);

                            jQuery("#jqgCounter_" + TokenType).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            toastr.error(result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        toastr.error(error.statusText);
                        return false;
                    }
                });
            }
        }
    });
}
function fnCounterCompleted() {

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        toastr.error("No token is selected");
        return false;
    }
    var TokenType = $('#hdvTokenType').val();
    if (currentlyServingToken.length > 1) {
        fnUpdateTokenStatusToCompleted(currentlyServingToken, TokenType);
    }
}
function fnUpdateTokenStatusToCompleted(TokenKey, TokenType) {
    if ($("#cboFloor").val() === "") {
        toastr.error("Please select a Floor");
        return false;
    }
    if (TokenKey != $('#lblCurrentlyServingToken').text()) {
        toastr.error("Please call the patient first");
        return false;
    }


    bootbox.confirm({
        message: "Service Completed ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    TokenKey: TokenKey,
                    TokenType: TokenType,
                };

                $.ajax({
                    url: getBaseURL() + '/TokenManagement/UpdateTokenStatusToCompleted',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    success: function (result) {

                        if (result.Status) {
                            toastr.success("Service Completed");
                            clearInterval(myTimer);
                            document.querySelector('#lblTokenTimer').textContent = "Completed";

                            jQuery("#jqgCounter_" + TokenType).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            toastr.error(result.Message, "e");
                            return false;
                        }
                    },
                    error: function (error) {
                        toastr.errorx(error.statusText, "e");
                        return false;
                    }
                });
            }
        }
    });



}
function fnNextToken() {
    if ($("#cboFloor").val() === "") {
        toastr.error("Please select a Floor");
        return false;
    }
    if ($("#cboCounter").val() === "" || $("#cboCounter").val() === "0") {
        toastr.error("Please select a Counter");
        return false;
    }

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        toastr.error("No token is selected");
        return false;
    }
    var obj = {
        TokenKey: currentlyServingToken,
        TokenType: $('#hdvTokenType').val(),
        CallingCounter: $("#cboCounter").val(),
    };

    $.ajax({
        url: getBaseURL() + '/TokenManagement/UpdateToCallingNextToken',
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: false,
        success: function (result) {

            if (result.Status) {
                if (!IsStringNullorEmpty(result.Key)) {
                    toastr.success("Calling the Token : " + result.Key);
                    $('#lblCurrentlyServingToken').text(result.Key);
                    var waitMinutes = 60 * 3;
                    display = document.querySelector('#lblTokenTimer');
                    startTimer(waitMinutes, display);
                    jQuery("#jqgCounter_" + $('#hdvTokenType').val()).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');

                    return true;
                }
                else {
                    toastr.error("No Remaining Tokens");
                    $('#lblCurrentlyServingToken').text(0);
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";
                    return false;
                }
            }
            else {
                toastr.error(result.Message);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            return false;
        }
    });

}
window.setTimeout(refreshGrid, 10000);
function refreshGrid() {
    for (var i = 0; i < arr_Type.length; i++) {
        jQuery("#jqgCounter_" + arr_Type[i].TokenType).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
    }
} 

function fnCallingConfirmation(TokenKey, TokenType, TokenCalling) {

    if ($("#cboFloor").val() === "") {
        toastr.error("Please select a Floor");
        return false;
    }

    if ($("#cboCounter").val() === "" || $("#cboCounter").val() === "0") {
        toastr.error("Please select a Counter");
        return false;
    }

    if (TokenCalling === "false" || $('#lblCurrentlyServingToken').text() != TokenKey) {
        toastr.error("Please call the token first");
        return false;
    }

    var obj = {
        TokenKey: TokenKey,
        TokenType: TokenType
    };

    if (TokenKey.length > 1) {
        $.ajax({
            url: getBaseURL() + '/TokenManagement/UpdateCallingConfirmation',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            success: function (result) {

                if (result.Status) {
                    toastr.success("Token " + result.Key + " confirmed");
           
                    var rowIds = $('#jqgCounter_' + TokenType).jqGrid('getDataIDs');
                    for (i = 0; i < rowIds.length; i++) {

                        rowData = $('#jqgCounter_' + TokenType).jqGrid('getRowData', rowIds[i]);

                        if (rowData["TokenKey"] === TokenKey) {
                            if (rowData["ConfirmationUrl"] != null && rowData["ConfirmationUrl"] != "") {
                                localStorage.setItem("tokenkey", TokenKey);
                                var url = getBaseURL() + rowData["ConfirmationUrl"];
                                window.open(
                                    url,
                                    '_blank'
                                    // <- This is what makes it open in a new window.
                                    , ''
                                );
                            }
                        }              
                    }
                    jQuery("#jqgCounter_" + TokenType).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    toastr.error(result.Message);
                    return false;
                }

            },
            error: function (error) {
                toastr.error(error.statusText);
                return false;
            }
        });
    }
}