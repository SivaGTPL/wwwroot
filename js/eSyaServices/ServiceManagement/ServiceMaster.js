var AddFlag = true;
var ServiceID = "0";
var ServiceType = "0";
var ServiceGroup = "0";
var ServiceClass = "0";

$(document).ready(function () {
    fnLoadServiceMaster()
    $("#txtInternalServiceCode").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $('#chkBillable').parent().addClass("is-checked");
    $("#btnSave").attr("disabled", _userFormRole.IsInsert === false);
    $("#dvAddMaster").hide();
});

function fnLoadServiceMaster(){
    $("#jqgServiceMaster").jqGrid('GridUnload');
    $("#jqgServiceMaster").jqGrid({
        url: getBaseURL() + '/ServiceManagement/GetServiceMaster?servicetype=' + $("#cboServiceType").val() +'&servicegroup=' + $("#cboServiceGroup").val() + '&serviceclass=' + $("#cboServiceClass").val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID", localization.ServiceType, localization.ServiceGroup, localization.ServiceClass, localization.ServiceDescription, localization.Active,""],

        colModel: [
            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceTypeDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceGroupDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceClassDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'left', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: "Button", width: 50, editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                    return "<button type='button' style='width:100px' class='btn btn-primary' onclick=fnGridEditServiceMaster('" + rowObject.ServiceId + "')><i class='fas fa-external-link-alt c-white'></i> Edit  </button>";
                }
            }
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceMaster",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

        }
    }).jqGrid('navGrid', '#jqpServiceMaster', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpServiceMaster', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddServiceMaster

        });   
}
function fnGridAddServiceMaster() {
    fnClearFields();
    AddFlag = true;
    ServiceID = 0;
    $('#PopupServiceMaster').find('.modal-title').text(localization.AddServiceMaster);
    $("#btnSave").html(localization.Save);
    $("#dvAddMaster").show();
    $('#PopupServiceMaster').modal('show');
}
function fnGridEditServiceMaster(serviceid) {
    fnClearFields();
    AddFlag = false;
    ServiceID = serviceid;
    $.ajax({
        url: getBaseURL() + '/ServiceManagement/GetServiceCodeByID',
        data: {
            ServiceID: ServiceID
        },
        success: function (result) {
            $("#txtServiceDesc").val(result.ServiceDesc);
            $("#txtServiceShortDesc").val(result.ServiceShortDesc);
            $("#txtInternalServiceCode").val(result.InternalServiceCode);
            $("#cboGender").val(result.Gender);
            $('#cboGender').
                picker('refresh');
            if (result.IsServiceBillable == true) {
                $('#chkBillable').parent().addClass("is-checked");
            }
            else {
                $('#chkBillable').parent().removeClass("is-checked");
            };

            if (result.ActiveStatus == true) {
                $('#chkActiveStatus').parent().addClass("is-checked");
            }
            else {
                $('#chkActiveStatus').parent().removeClass("is-checked");
            };

            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result.l_ServiceParameter);
        }
    });

 
    $('#PopupServiceMaster').find('.modal-title').text(localization.EditServiceMaster);
    $("#btnSave").html(localization.Update);

    $('#PopupServiceMaster').modal('show');
}
function fnClearFields() {
    $("#txtServiceDesc").val('');
    $("#txtServiceShortDesc").val('');
    $("#txtInternalServiceCode").val('');
    $("#cboGender").val('A');
    $('#cboGender').selectpicker('refresh');
    $('#chkBillable').parent().addClass("is-checked");
    $('#chkActiveStatus').parent().addClass("is-checked");
    eSyaParams.ClearValue();
    $("#dvAddMaster").hide();
    $("#cboPopServiceGroup").html('<option value="0">' + localization.select + '</option>');
    $("#cboPopServiceClass").html('<option value="0">' + localization.select + '</option>');
    $("#cboPopServiceType").val('0');
    $('#cboPopServiceType').selectpicker('refresh');
}
function fnLoadServiceGroup() {
    ServiceType = $("#cboPopServiceType").val();
    $.ajax({
        url: getBaseURL() + '/ServiceManagement/GetServiceGroupsByTypeID',
        data: {
            servicetype: ServiceType
        },
        success: function (result) {
            $("#cboPopServiceGroup").empty();
            $('#cboPopServiceGroup').selectpicker('refresh');
            $("#cboPopServiceGroup").append('<option value="0">' + localization.select + '</option>');
            $('#cboPopServiceGroup').selectpicker('refresh');
            for (var i = 0; i < result.length; i++) {
                $("#cboPopServiceGroup").append('<option value="' + result[i].ServiceGroupId + '"> ' + result[i].ServiceGroupDesc + ' </option>');
                $('#cboPopServiceGroup').selectpicker('refresh');
            }
        }
    });
}
function fnLoadServiceClass() {
    ServiceGroup = $("#cboPopServiceGroup").val();
    $.ajax({
        url: getBaseURL() + '/ServiceManagement/GetServiceClassesByGroupID',
        data: {
            servicegroup: ServiceGroup
        },
        success: function (result) {
            $("#cboPopServiceClass").empty();
            $('#cboPopServiceClass').selectpicker('refresh');
            $("#cboPopServiceClass").append('<option value="0">' + localization.select + '</option>');
            $('#cboPopServiceClass').selectpicker('refresh');
            for (var i = 0; i < result.length; i++) {
                $("#cboPopServiceClass").append('<option value="' + result[i].ServiceClassId + '"> ' + result[i].ServiceClassDesc + ' </option>');
                $('#cboPopServiceClass').selectpicker('refresh');
            }
        }
    });
}

function fnAddOrUpdateServiceCode() {
    if (AddFlag == true) {
        ServiceID = "0";
        ServiceType = $("#cboPopServiceType").val();
        ServiceGroup = $("#cboPopServiceGroup").val();
        ServiceClass = $("#cboPopServiceClass").val();
        if (ServiceType == "0") {
            toastr.warning("Please select a Service Type");
            return false;
        };
        if (ServiceGroup == "0") {
            toastr.warning("Please select a Service Group");
            return false;
        };
        if (ServiceClass == "0") {
            toastr.warning("Please select a Service Class");
            return false;
        };
    }
    else {
        ServiceType = "0";
        ServiceGroup = "0";
        ServiceClass = "0";
    }



    var txtServiceDesc = $("#txtServiceDesc").val();
    if (txtServiceDesc == "" || txtServiceDesc == null || txtServiceDesc == undefined) {
        toastr.error("Please enter the Service Description");
        return false;
    }

      

    else {

        $("#btnSave").attr("disabled", true);
        var sPar = eSyaParams.GetJSONValue();
        var obj = {
            ServiceTypeID: ServiceType,
            ServiceGroupID: ServiceGroup,
            ServiceClassID: ServiceClass,
            ServiceID: ServiceID,
            ServiceDesc: $("#txtServiceDesc").val(),
            ServiceShortDesc: $("#txtServiceShortDesc").val(),
            InternalServiceCode: $("#txtInternalServiceCode").val(),
            Gender: $("#cboGender").val(),
            IsServiceBillable: $("#chkBillable").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            l_ServiceParameter: sPar
        }
        $.ajax({
            url: getBaseURL() + '/ServiceManagement/AddOrUpdateServiceCode',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceID == 0) {
                        toastr.success("Service Added");                      
                    }
                    else {
                        toastr.success("Service Updated");
                    }
                    $('#PopupServiceMaster').modal('hide');
                    $("#jqgServiceMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                }
                else {
                    toastr.error(response.Message);
                }
                $("#btnSave").attr("disabled", false);
            },
            error: function (error) {
                toastr.error(error.statusText);
                $("#btnSave").attr("disabled", false);
            }
        });
    }
}

