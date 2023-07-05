$(document).ready(function () {
    fnGridLoadDoctorMaster("0");
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var doctorNamePrefix = $(this).text();
        if (doctorNamePrefix === "All")
            doctorNamePrefix = "";
        fnGridLoadDoctorMaster(doctorNamePrefix);
        $(this).addClass('active');
    });

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctorDetails",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.AddEdit, icon: "edit", callback: function (key, opt) { fnAddEditDoctorDetails(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewDoctorDetails(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.AddEdit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnGridLoadDoctorMaster(doctorPrefix) {
    $("#jqgDoctorDetails").jqGrid('GridUnload');
    $("#jqgDoctorDetails").jqGrid({
        url: getBaseURL() + '/Doctors/GetDoctorMasterList?doctorNamePrefix=' + doctorPrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: ["Doctor Id", localization.DoctorShortName, localization.DoctorName, localization.Gender, localization.Qualification, localization.MobileNumber, localization.DoctorClassCode, localization.DoctorClass, localization.DoctorCategoryCode, localization.DoctorCategory, localization.AllowConsultation, localization.AllowSMS, localization.IsRevenueShareAppicable, localization.TraiffFrom, localization.DoctorRemarks, localization.Active, localization.Actions],
        colModel: [
            { name: "DoctorId", width: 40, editable: true, align: 'left', hidden: true },
            { name: "DoctorShortName", width: 70, editable: true, align: 'left', hidden: false },
            { name: "DoctorName", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Gender", width: 25, editable: true, align: 'left', hidden: false, editoptions: { value: "M: Male;F: Female" } },
            { name: "Qualification", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MobileNumber", width: 35, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorClass", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorClassDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorCategory", width: 60, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorCategoryDesc", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AllowConsultation", width: 40, editable: true, align: 'left', hidden: true },
            { name: "AllowSMS", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "IsRevenueShareAppicable", width: 40, editable: true, align: 'left', hidden: true },
            { name: "TraiffFrom", width: 10, editable: true, align: 'left', hidden: true, editoptions: { value: "N: None;R: Service Rate;S: Specialty;D: Doctor" } },
            { name: "DoctorRemarks", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 20, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 100, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgDMEdit" onclick="return fnAddEditDoctorDetails(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.AddEdit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "View" id="jqgDMView" onclick = "return fnViewDoctorDetails(event,\'view\')" > <i class="far fa-eye"></i> ' + localization.View + ' </button >' 
            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorDetails"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDoctorDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
          //SetDoctorMasterGridControlByAction();
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

    }).jqGrid('navGrid', '#jqpDoctorDetails', { add: false, edit: false, search: true, del: false, refresh: false }, {}, {}, {}, {
        closeOnEscape: true,
        caption: "Search...",
        multipleSearch: true,
        Find: "Find",
        Reset: "Reset",
        odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }]
        }).jqGrid('navButtonAdd', '#jqpDoctorDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDoctorDetails
    });

    fnAddGridSerialNoHeading();
}

function fnGridRefreshDoctorDetails() {
    $("#jqgDoctorDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddEditDoctorDetails(e, actiontype) {
    $('#txtdoctorId').val('')
    fnClearDoctorDetails();
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgDoctorDetails').jqGrid('getRowData', rowid);
    var rowid = $("#jqgDoctorDetails").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorDetails').jqGrid('getRowData', rowid);
    $('#txtdoctorId').val(rowData.DoctorId);
    fnGetDoctorDetails(rowData);
    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not authorized to Edit");
        return;
    }
    $('#PopupDoctorDetails').modal('show');
    $('#PopupDoctorDetails').find('.modal-title').text(localization.AddEditdoctordetails);
    $("#btnSaveDoctorDetails").show();
    $("#btnSaveDoctorDetails").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("input[type=checkbox]").attr('disabled', false);
    $("#txtCertification").prop("disabled", false);
    //$('#Photoimage').removeAttr('disabled');
    tinymce.activeEditor.setMode('design');
}

function fnViewDoctorDetails(e, actiontype) {
    $('#txtdoctorId').val('')
    fnClearDoctorDetails();
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgDoctorDetails').jqGrid('getRowData', rowid);
    var rowid = $("#jqgDoctorDetails").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorDetails').jqGrid('getRowData', rowid);
    $('#txtdoctorId').val(rowData.DoctorId);
    fnGetDoctorDetails(rowData);
    if (_userFormRole.IsView === false) {
        toastr.warning("You are not authorized to View");
        return;
    }
    $('#PopupDoctorDetails').modal('show');
    $('#PopupDoctorDetails').find('.modal-title').text(localization.Viewdoctordetails);
    $("#btnSaveDoctorDetails").hide();
    $("input,textarea").attr('readonly', true);
    $("input[type=checkbox]").attr('disabled', true);
    $("#txtCertification").prop("disabled", true);
    //$('#Photoimage').attr('disabled', 'disabled');
    tinymce.activeEditor.setMode('readonly');
}

function fnGetDoctorDetails(data) {
    if (data != null) {
        
        $.ajax({
            url: getBaseURL() + '/Doctors/GetDoctordetailsbydoctorId?doctorId=' + $('#txtdoctorId').val(),
            type: 'POST',
            datatype: 'json',
            success: function (response) {
               
                if (response != null) {
                    
                    fnFillDoctorDetails(response);
                }
                else {
                    fnClearDoctorDetails();

                }

            },
            error: function (error) {
                toastr.error(error.statusText);

            }
        });
    }
}

function fnFillDoctorDetails(data) {
    
    $('#txtLanguagesKnown').val(data.LanguageKnown);
    $('#txtExperience').val(data.Experience);
    $('#txtCertification').val(data.CertificationCourse);
    tinyMCE.activeEditor.setContent('');
    
    if (data.AboutDoctor != null) {
        tinyMCE.activeEditor.setContent(data.AboutDoctor);


    }
    else {
        tinyMCE.activeEditor.setContent('');

    }
    //if (data.ProfileImagePath != null)
    //{
    //    $('#imgPhotoimageblah').attr('src', data.ProfileImagePath);
        
        
    //}
    //else {
    //    $('#imgPhotoimageblah').attr('src', '');
       
    //}
    
    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");
    $("#btnSaveDoctorDetails").html('<i class="fa fa-sync"></i>' + localization.Update);
}

function fnClearDoctorDetails() {
    $('#txtLanguagesKnown').val('');
    $('#txtExperience').val('');
    $('#txtCertification').val('');
    tinyMCE.activeEditor.setContent('');
    //$('#imgPhotoimageblah').attr('src', '');
    //document.getElementById('Photoimage').value="";
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveDoctorDetails").html('<i class="far fa-save"></i> ' + localization.Save);
    
}

function fnSaveDoctorDetails() {

    if (IsStringNullorEmpty($("#txtdoctorId").val())) {
        toastr.warning("Please add the doctor details");
        return;
    }
    if ($("#txtdoctorId").val() === 0 || $("#txtdoctorId").val() === "0") {
        toastr.warning("Please add the doctor details");
        return;
    }
    if (IsStringNullorEmpty($("#txtLanguagesKnown").val())) {
        toastr.warning("Please Enter the Language Known");
        return;
    }
    var obj = new FormData();
    //appending image file object
    //obj.append("Imagefile", $("#Photoimage").get(0).files[0]);
    obj.append("DoctorId", document.getElementById("txtdoctorId").value);
    obj.append("LanguageKnown", document.getElementById("txtLanguagesKnown").value);
    obj.append("Experience", document.getElementById("txtExperience").value);
    obj.append("CertificationCourse", document.getElementById("txtCertification").value);
    obj.append("AboutDoctor", tinyMCE.get('txtAboutDoctor').getContent());
    obj.append("ActiveStatus", $('#chkActiveStatus').parent().hasClass("is-checked"));

    $.ajax({
        url: getBaseURL() + '/Doctors/InsertOrUpdateIntoDoctordetails',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $('#PopupDoctorDetails').modal('hide');
                    $("#btnSaveDoctorDetails").attr('disabled', false);
                    $('#txtdoctorId').val('');
                    fnClearDoctorDetails();
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveDoctorDetails").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDoctorDetails").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDoctorDetails").attr("disabled", false);
        }
    });
    $("#btnSaveDoctorDetails").attr('disabled', false);
}

//function SetDoctorMasterGridControlByAction() {

    //if (_userFormRole.IsEdit === false) {
    //    var eleDisable = document.querySelectorAll('#jqgDMEdit');
    //    for (var i = 0; i < eleDisable.length; i++) {
    //        eleDisable[i].disabled = true;
    //        eleDisable[i].className = "ui-state-disabled";
    //    }
    //}
    //if (_userFormRole.IsView === false) {
    //    var eleVDisable = document.querySelectorAll('#jqgDMView');
    //    for (var i = 0; i < eleVDisable.length; i++) {
    //        eleVDisable[i].disabled = true;
    //        eleVDisable[i].className = "ui-state-disabled";
    //    }
    //}

    
//}