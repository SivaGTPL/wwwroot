
$(document).ready(function () {
    //$('#cboBusinessLocation').selectpicker('refresh');
    fnTreeSize();
    $(window).on('resize', function () {
        fnTreeSize();
    });
});

function fnLoadClinicConsultantTree() {
    $('#jstClinicConsultantTree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Clinics/GetClinicConsultantTreeList?businessKey=' + $("#cboBusinessLocation").val(),
        success: function (result) {

            $('#jstClinicConsultantTree').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": false
                },
            });
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
}

function fnSaveOPClinic() {

    if ($('#cboBusinessLocation').val() == '') {
        toastr.warning("Please Select a Business Location");
        $('#cboBusinessLocation').focus();
        return;
    }

    var obj = [];

    var treeUNodes = $('#jstClinicConsultantTree').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if(this.parent != "#" && this.parent != "CL0") 
        {
            var node_ids = this.id.split("_");
            var cc = {
                BusinessKey: $('#cboBusinessLocation').val(),

                //ClinicId: node_ids[0],
                //ConsultationId: node_ids[2],
                ConsultationId: node_ids[0],
                ClinicId: node_ids[2],
                ActiveStatus: this.state.selected
            }
            obj.push(cc);
        }
    });

    //$("#btnSaveOPClinic").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveOPClinic").attr('disabled', true);

    var URL;
    URL = getBaseURL() + '/Clinics/InsertUpdateOPClinicLink';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { op_cl: obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnLoadClinicConsultantTree();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveOPClinic").html('Save');
                $("#btnSaveOPClinic").attr('disabled', false);
            }

            $("#btnSaveOPClinic").html(localization.Save);
            $("#btnSaveOPClinic").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveOPClinic").attr("disabled", false);
            $("#btnSaveOPClinic").html(localization.Save);
        }
    });
}

function fnExpandAll() {
    $('#jstClinicConsultantTree').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstClinicConsultantTree').jstree('close_all');
}

function fnTreeSize() {
    $("#jstClinicConsultantTree").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}