 
    var NodeID;
    var prevSelectedID;

    $(document).ready(function () {
        fnTreeSize();
        fnLoadDrugBusinessTree();
         
});

function fnLoadDrugBusinessTree() {
    $('#jstDrugBusinessLink').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/DrugBrand/GetGenericDrugList?businessKey=' + $("#cboBusinessLocation").val(),
        success: function (result) {
            $('#jstDrugBusinessLink').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": true
                },
            });

            fnTreeSize("#jstDrugBusinessLink");
            $(window).on('resize', function () {
                fnTreeSize("#jstDrugBusinessLink");
            })
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });

        //$("#jstDrugBusinessLink").jstree({
        //    plugins:['checkbox'],
        //    "state": { "checkbox_disabled": false },
        //    "checkbox": {
        //        "keep_selected_style": true
        //    },

        //    core: {
        //        'data': [{ "id": "parentnode", "parent": "#", "text": "Drug Name" },
        //        { "id": "SU01", "parent": "parentnode", "text": "GSK Pharm" },
        //        { "id": "SU02", "parent": "SU01", "text": "Amoxilin" },
        //        { "id": "SU03", "parent": "SU01", "text": "Digene" },], 'check_callback': true, 'multiple': true
        //    }
        //});
    }

function fnSaveDrugBusinessLink() {

    if ($('#cboBusinessLocation').val() == '') {
        toastr.warning("Please Select a Business Location");
        $('#cboBusinessLocation').focus();
        return;
    }

    var obj = [];

    var treeUNodes = $('#jstDrugBusinessLink').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.parent != "#" && this.parent != "GS0") {
            var node_ids = this.id.split("_");
            var cc = {
                BusinessKey: $('#cboBusinessLocation').val(),
                DrugCode: node_ids[0],
                ActiveStatus: this.state.selected
            }
            obj.push(cc);
        }
    });

    $("#btnSaveDrugBusinessLink").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveDrugBusinessLink").attr('disabled', true);

    var URL;
    URL = getBaseURL() + '/DrugBrand/InsertUpdateDrugBusinessLink';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { dr_bl: obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnLoadDrugBusinessTree();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDrugBusinessLink").html('<i class= "fa fa-save" ></i> Save');
                $("#btnSaveDrugBusinessLink").attr('disabled', false);
            }

            $("#btnSaveDrugBusinessLink").html('<i class= "fa fa-save" ></i> Save');
            $("#btnSaveDrugBusinessLink").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDrugBusinessLink").attr("disabled", false);
            $("#btnSaveDrugBusinessLink").html('<i class= "fa fa-save" ></i> Save');
        }
    });
}    
 
function fnClearFields() {

}
 
    function fnExpandAll() {
        $('#jstDrugBusinessLink').jstree('open_all');
    }
    function fnCollapseAll() {
        fnClearFields();
        $("#pnlMainMenu").hide();
        $('#jstDrugBusinessLink').jstree('close_all');
    }
    function fnTreeSize() {
        $("#jstDrugBusinessLink").css({
            'height': $(window).innerHeight() - 190,
            'overflow': 'auto'
        });
    }
 