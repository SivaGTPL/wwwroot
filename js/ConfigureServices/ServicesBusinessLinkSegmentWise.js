$(document).ready(function () {
    $("#btnSave").hide();
});
function fnLoadBusinessServiceTree() {
    $('#BusinessServiceTree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetServiceBusinessLink?businessKey=' + $('#cboBusinessKey').val(),
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#BusinessServiceTree').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": true
                },
            });

            fnTreeSize("#BusinessServiceTree");
            $(window).on('resize', function () {
                fnTreeSize("#BusinessServiceTree");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });
    $("#btnSave").show()
}
function fnSaveBusinessServiceLink() {

    if ($('#cboBusinessKey').val() == '') {
        toastr.warning("Please Select a Business Location");
        $('#cboBusinessKey').focus();
        return;
    }

    var businessKey = $('#cboBusinessKey').val();
    var ServiceBusinessLink = [];

    var treeUNodes = $('#BusinessServiceTree').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.id.startsWith('S') && this.id != "SM") {
            var sbl = {
                BusinessKey: businessKey,
                ServiceId: this.id.substring(1),
                ActiveStatus: this.state.selected
            }
            ServiceBusinessLink.push(sbl);
        }
    });

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/UpdateServiceBusinessLocations',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: ServiceBusinessLink
        },
        success: function (response) {
            if (response.Status == true) {
                toastr.success("Data Saved");
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

