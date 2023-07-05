
$(document).ready(function () {
    $("#pnlLinkClinics").hide();
    fnTreeSize();
});

function fnLoadSpecialty() {

    if ($('#cboBusinessLocation').val() == '')
        return;

    $.ajax({
        url: getBaseURL() + '/ClinicDoctorLink/GetSpecialtyListForBusinessKey?businessKey=' + $('#cboBusinessLocation').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            if (response != null) {
                var options = $("#cboSpecialty");
                $("#cboSpecialty").empty();

                $.each(response, function () {
                    options.append($("<option />").val(this.SpecialtyID).text(this.SpecialtyDesc));
                });
                $('#cboSpecialty').selectpicker('refresh');
                fnLoadDoctorTree()
            }
            else {

            }

        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });
}

function fnLoadDoctorTree() {
    if (IsStringNullorEmpty($('#cboBusinessLocation').val()) || IsStringNullorEmpty($('#cboSpecialty').val()))
        return;
    
    $('#jstClinicDoctorLinktree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ClinicDoctorLink/GetSpecialtyDoctorLinkTree?businessKey=' + $('#cboBusinessLocation').val() + '&specialtyId=' + $('#cboSpecialty').val(),
        success: function (result) {

            $('#jstClinicDoctorLinktree').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true}
            });
        }
    });

    $("#jstClinicDoctorLinktree").on('loaded.jstree', function () {
        $("#jstClinicDoctorLinktree").jstree('open_all');

    });

    $('#jstClinicDoctorLinktree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (data.node.parent == "#") {
                $("#pnlLinkClinics").show();
                //$(".mdl-card__title-text").text("Add Specialty");
                $('#jstClinicConsultanttree').jstree("destroy");
                fnLoadClinicConsultantTree(data.node.id.substring(2, data.node.id.length));
                $("#btnSave").html('<i class="fa fa-plus"></i> Add');
                $("#btnSave").attr("disabled");
                //$("#btnSave").attr("disabled", _userFormRole.IsInsert === false);
            }
            else {
                $('#jstClinicConsultanttree').jstree("destroy");
            }
        }
    });
}

function fnLoadClinicConsultantTree(doctorId) {
    $('#jstClinicConsultanttree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ClinicDoctorLink/GetClinicConsultantTreeList?businessKey=' + $("#cboBusinessLocation").val() + '&specialtyId=' + $('#cboSpecialty').val() + '&doctorId=' + doctorId,
        success: function (result) {

            $('#jstClinicConsultanttree').jstree({
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
    $("#jstClinicDoctorLinktree").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnTreeSize() {
    $("#jstClinicDoctorLinktree").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });

    //$("#jstClinicConsultanttree").css({
    //    'height': $(window).innerHeight() - 136,
    //    'overflow': 'auto'
    //});
}

function fnSaveClinicDoctorLink() {

    if (IsStringNullorEmpty($('#cboBusinessLocation').val())) {
        toastr.warning("Please Select Business Location");
        $('#cboBusinessLocation').focus();
        return;
    }

    if (IsStringNullorEmpty($('#cboSpecialty').val())) {
        toastr.warning("Please Select Specialty");
        $('#cboSpecialty').focus();
        return;
    }

    var doctorId = $('#jstClinicDoctorLinktree').jstree().get_selected(true);

    if (doctorId.length != 1){
            toastr.warning('Please Select Doctor.');
        }
        
    var obj = [];

    var treeUNodes = $('#jstClinicConsultanttree').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.parent != "#" && this.parent != "CL0") {
            var node_ids = this.id.split("_");
            var dc = {
                BusinessKey: $('#cboBusinessLocation').val(),
                SpecialtyId: $('#cboSpecialty').val(),
                DoctorId: doctorId[0].id.substring(2, doctorId[0].id.length),
                //ClinicId: node_ids[0],
                //ConsultationId: node_ids[2],
                ClinicId: node_ids[2],
                ConsultationId: node_ids[0],
                ActiveStatus: this.state.selected
            }
            obj.push(dc);
        }
    });

    //$("#btnSave").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
    $("#btnSave").attr('disabled', true);

    var URL;
    URL = getBaseURL() + '/ClinicDoctorLink/InsertUpdateDoctorClinicLink';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { do_cl: obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $('#jstClinicConsultanttree').jstree("destroy");
                $("#pnlLinkClinics").hide();
            }
            else {
                toastr.error(response.Message);
                $("#btnSave").attr('disabled', false);
                $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
            }

            $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
            $("#btnSave").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSave").attr("disabled", false);
            $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
        }
    });
}

function fnExpandAll() {
    $('#jstClinicConsultanttree').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstClinicConsultanttree').jstree('close_all');
}
