var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnTreeSize();
    $('#txtSearchDoctorName').keyup(function () {
        var searchString = $(this).val();
        $('#jstSpecialtyDoctor').jstree('search', searchString);
    });
});

function fnLoadSpecialty() {
    
    if ($('#cboBusinessKey').val() === '')
        return;

    $.ajax({
        url: getBaseURL() + '/Specialty/GetSpecialtyListForBusinessKey?businessKey=' + $('#cboBusinessKey').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            if (response !== null) {
                var options = $("#cboSpecialty");
                $("#cboSpecialty").empty();

                $.each(response, function () {
                    options.append($("<option />").val(this.SpecialtyID).text(this.SpecialtyDesc));
                });
                $('#cboSpecialty').selectpicker('refresh');
                fnLoadDoctorTree();
            }
        },
        error: function (error) {
            toastr.error(error.statusText);

        }
    });
}

function fnLoadDoctorTree() {
    $('#txtSearchDoctorName').val('');
    $('#jstSpecialtyDoctor').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Specialty/GetDoctorClinicLinkTree?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + $('#cboSpecialty').val(),
        success: function (result) {

            $('#jstSpecialtyDoctor').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox", "search"],
                "checkbox": {
                    "keep_selected_style": false
                },
                "search": {
                    "case_sensitive": false,
                    "show_only_matches": true,
                    "show_only_matches_children": true
                }
            });
        }
    });
}

function fnExpandAll() {
    $('#jstSpecialtyDoctor').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstSpecialtyDoctor').jstree('close_all');
}

function fnTreeSize() {
    $("#jstSpecialtyDoctor").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnSaveSpecialtyDoctorLink() {

    if ($('#cboSpecialty').val() === '') {
        toastr.warning("Please Select Specialty");
        $('#cboSpecialty').focus();
        return;
    }

    var treeNodes = $('#jstSpecialtyDoctor').jstree("get_selected");
    if (treeNodes === '') {
        toastr.warning("Please Select Doctor Name");
        return;
    }
    var obj = [];
        
    var treeUNodes = $('#jstSpecialtyDoctor').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {

        //var DrCl = this.id.split('_');
        //if (DrCl.length > 1) {
        var sd = {
            BusinessKey: $('#cboBusinessKey').val(),
            SpecialtyID: $('#cboSpecialty').val(),
            DoctorID: this.id.substring(2, 4), //DrCl[0].substring(2, 4),
            //ClinicID: DrCl[1].substring(2, 4),
            ActiveStatus: this.state.selected
        };
        obj.push(sd);
        //}
    });
    $("#btnSaveSpecialtyDoctorLink").attr('disabled', true);
    var URL;
    URL = getBaseURL() + '/Specialty/InsertSpecialtyDoctorLinkList';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                //$("#btnSaveSpecialtyDoctorLink").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
                $("#btnSaveSpecialtyDoctorLink").attr('disabled', false);

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveSpecialtyDoctorLink").attr('disabled', false);
            }

            $("#btnSaveSpecialtyDoctorLink").html(localization.Save);
            $("#btnSaveSpecialtyDoctorLink").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveSpecialtyDoctorLink").attr("disabled", false);
            $("#btnSaveSpecialtyDoctorLink").html(localization.Save);
        }
    });
    
}