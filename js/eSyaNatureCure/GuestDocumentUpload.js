var _isInsert = true;
var actiontype = "";
function fnLoadDocumentUpload() {
   
      $("#jqgDocumentUpload").GridUnload();

      $("#jqgDocumentUpload").jqGrid({
          url: getBaseURL() + '/CheckInGuest/GetGuestDocumentUploadDetailsByBookingKey?bookingKey=' + $("#hdBookingKey").val() + '&guestId=' + $("#hdGuestId").val(),
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
          colNames: ["Business Key", "Booking Key", "Guest Id", "Serial No", "Document Name", "Document Url","Identification Number","Active","Action"],
            colModel: [
                { name: "BusinessKey", width: 50, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text', hidden: true },
                { name: "BookingKey", width: 50, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "GuestId", width: 50, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "SerialNo", width: 100, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "DocumentName", width: 250, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "DocumentUrl", width: 100, editable: true, align: 'left', edittype: 'text', hidden: true },
                { name: "IdentificationNumber", width: 150, editable: true, align: 'left', edittype: 'text', hidden: false },
                { name: "ActiveStatus", width: 50, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
                {
                    name: 'edit', search: false, align: 'left', width: 150, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditDocumentUpload(event,\'view\');"><i class="far fa-eye"></i> ' + localization.View + '</button>'
                              +'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnDeleteDocumentUpload(event,\'delete\');"><i class="fas fa-trash"></i> ' + localization.Delete + '</button >'
                    }
                },
                
            ],
            rowNum: 10,
          pager: "#jqpDocumentUpload",
            rownumWidth:55,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
          loadonce: true, caption:'Document Upload',
          loadComplete: function (data) {
              fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgDocumentUpload"); 
            },
      }).jqGrid('navGrid', '#jqpDocumentUpload', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDocumentUpload', {
          caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDocumentUpload
          }).jqGrid('navButtonAdd', '#jqpDocumentUpload', {
          caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDocumentUpload
        });
    $('[id^=jqg]').jqGrid('setGridWidth', $(".tab-content").width() - 20);
}

function fnGridRefreshDocumentUpload() {
    $("#jqgDocumentUpload").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnAddDocumentUpload() {
    _isInsert = true;
    $('#PopupDocumentUpload').modal('show');
    fnClearDocumentUpload();
    $('#txtSerialNumber').val('');
    $('#txtSerialNumber').attr('readonly', false);
    $('#chkActiveStatus').parent().addClass("is-checked");
    $('#PopupDocumentUpload').find('.modal-title').text(localization.AddDocumentUpload);
}

function fnClearDocumentUpload() {
    $('#txtSerialNumber').val('');
    $('#txtDocumentName').val('');
    $('#txtIdentificationNumber').val('');
    $('#imagepath').attr('src', '');
    document.getElementById('UploadPhotoimage').value = "";
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveDocumentUpload").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnSaveDocumentUpload").show();
    $("#btnSaveDocumentUpload").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("input[type=checkbox]").attr('disabled', false);
    $('#UploadPhotoimage').removeAttr('disabled');

}


function fnDeleteDocumentUpload(e, actiontype) {
  
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDocumentUpload').jqGrid('getRowData', rowid);
    
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to Delete Document?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want to Activate Document?";
        lbl = localization.Activate;
    }
    bootbox.confirm({
        title: 'Document',
        message: msg,
        buttons: {
            confirm: {
                label: lbl,
                className: 'mdl-button  primary-button'
            },
            cancel: {
                label: 'Cancel',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result) {
                if (rowData.SerialNo == null || rowData.SerialNo == undefined || rowData.SerialNo == "0" || rowData.SerialNo == '') {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/CheckInGuest/DeleteDocument?businessKey=' + rowData.BusinessKey + '&bookingKey=' + rowData.BookingKey
                        + '&guestId=' + rowData.GuestId + '&serialno=' + rowData.SerialNo,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            toastr.success("Document Deleted Sucessfully");
                            fnGridRefreshDocumentUpload();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        $("#jqgDocumentUpload").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}

function fnEditDocumentUpload(e, actiontype) {
 
    _isInsert = false;

    $('#txtSerialNumber').val('')
    fnClearDocumentUpload();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgDocumentUpload').jqGrid('getRowData', rowid);
    
    fnGetDocumentUploadbySerialNumber(rowData);

}

function fnGetDocumentUploadbySerialNumber(data) {
    if (data != null) {

        $.ajax({
           
            url: getBaseURL() + '/CheckInGuest/DownloadDocument?businessKey=' + data.BusinessKey + '&bookingKey=' + data.BookingKey
                + '&guestId=' + data.GuestId + '&serialno=' + data.SerialNo,
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            success: function (response) {

                window.location = getBaseURL() + '/CheckInGuest/DownloadDocument?businessKey=' + data.BusinessKey + '&bookingKey=' + data.BookingKey
                    + '&guestId=' + data.GuestId + '&serialno=' + data.SerialNo;


            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });
    }
}

function fnSaveDocumentUpload() {

    if (chkGuestCheckout == "True" || chkGuestCheckout == true) {
        toastr.warning("You are not Allowed to Update the details of Checked out Guest");
        return;
    }
    //if (_userFormRole.IsAuthenticate == false) {
    //    toastr.warning("Not Allowed to Save Un Authenticate User");
    //    return;
    //}

    if (IsStringNullorEmpty($("#hdBookingKey").val())) {
        toastr.warning("Please Add the BookingKey");
        return;
    }
    
    if (IsStringNullorEmpty($("#hdGuestId").val())) {
        toastr.warning("Please Add the GuestId");
        return;
    }
    //if (IsStringNullorEmpty($("#txtSerialNumber").val())) {
    //    toastr.warning("Please Enter Serial Number");
    //    return;
    //}
    if (IsStringNullorEmpty($("#txtDocumentName").val())) {
        toastr.warning("Please Enter the Document Name");
        return;
    }
    if (IsStringNullorEmpty($("#UploadPhotoimage").val())) {
        toastr.warning("Please Select a Document");
        return;
    }
    //$("#btnSaveDocumentUpload").attr('disabled', true);

    var obj = new FormData();
    //appending  file object
    obj.append("Imagefile", $("#UploadPhotoimage").get(0).files[0]);
    obj.append("BookingKey", document.getElementById("hdBookingKey").value);
    obj.append("GuestId", document.getElementById("hdGuestId").value);
    obj.append("SerialNo", document.getElementById("txtSerialNumber").value);
    obj.append("DocumentName", document.getElementById("txtDocumentName").value);
    obj.append("IdentificationNumber", document.getElementById("txtIdentificationNumber").value);
    obj.append("ActiveStatus", $('#chkActiveStatus').parent().hasClass("is-checked"));
    obj.append("isInsert", _isInsert);
    $("#btnSaveDocumentUpload").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/CheckInGuest/InsertOrUpdateDocumentUpload',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $('#PopupDocumentUpload').modal('hide');
                    $("#btnSaveDocumentUpload").attr('disabled', false);
                    fnClearDocumentUpload();
                    fnGridRefreshDocumentUpload();
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveDocumentUpload").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDocumentUpload").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDocumentUpload").attr("disabled", false);
        }
    });
    //$("#btnSaveDocumentUpload").attr('disabled', false);
}

