
$(document).ready(function () {
    $('#txtSearchDoctorName').keyup(function () {
        var searchString = $(this).val();
        $('#jstDoctorBusinessLink').jstree('search', searchString)
    })
    
})

function fnLoadDoctorBusinessTree() {
    $('#jstDoctorBusinessLink').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Doctor/GetDoctorMasterTree?businessKey=' + $('#cboBusinessKey').val() ,
        success: function (result) {

            $('#jstDoctorBusinessLink').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox", "search"],
                "checkbox": {
                    "keep_selected_style": false
                },
                "search": {
                    "case_sensitive": false,
                    "show_only_matches": true,
                    
                }
                
            });

        }
    });

}

function fnSaveDoctorBusinessLink() {

    if ($('#cboBusinessKey').val() == '') {
        toastr.warning("Please Select Business Key");
        $('#cboBusinessKey').focus();
        return;
    }

    var obj = [];

    var treeUNodes = $('#jstDoctorBusinessLink').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {

        var sd = {
            BusinessKey: $('#cboBusinessKey').val(),
            DoctorID: this.id,
            ActiveStatus: this.state.selected
        }
        obj.push(sd);

    });
    $("#btnSaveDoctorBusinessLink").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Doctor/InsertUpdateDoctorBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    fnLoadDoctorBusinessTree();
                    //$("#btnSaveDoctorBusinessLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
                    $("#btnSaveDoctorBusinessLink").attr('disabled', false);

                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveDoctorBusinessLink").attr('disabled', false);
                }
            }
            else {
                toastr.error("Error in Save");
                
            }
            //$("#btnSaveDoctorBusinessLink").html('<i class="fas fa-save"></i>'+ Save);
            $("#btnSaveDoctorBusinessLink").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDoctorBusinessLink").attr("disabled", false);
            //$("#btnSaveDoctorBusinessLink").html('<i class="fas fa-save"></i> Save');
        }
    });
}

function fnExpandAll() {
    $('#jstDoctorBusinessLink').jstree('open_all');
}
function fnCollapseAll() {
    $('#jstDoctorBusinessLink').jstree('close_all');
}

