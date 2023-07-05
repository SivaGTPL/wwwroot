var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnTreeSize();
    LoadSpecialtyUnit();
});

function LoadSpecialtyUnit() {
    $("#jstSpecialtyDoctorLink").jstree({
        //"state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        "plugins":["checkbox"],
        core: {
            'data': [{ "id": "parentnode", "parent": "#", "text": "Opthalmalogy" },
                    { "id": "SD01", "parent": "#", "text": "General Medicine" },
                    { "id": "SD02", "parent": "#", "text": "General Surgery" },
                    { "id": "SD03", "parent": "#", "text": "ENT" },], 'check_callback': true, 'multiple': true
        }

    });
}
$("#jstSpecialtyDoctorLink").on('loaded.jstree', function () {
    $("#jstSpecialtyDoctorLink").jstree('open_all');
    $("#jstSpecialtyDoctorLink").jstree()._open_to(prevSelectedID);
    $('#jstSpecialtyDoctorLink').jstree().select_node(prevSelectedID);
});

$('#jstSpecialtyDoctorLink').on("changed.jstree", function (e, data) {
    if (data.node != undefined) {
        //if (prevSelectedID != data.node.id) {
        prevSelectedID = data.node.id;

        if (data.node.id == "AA") {
            fnClearFields();
            $("#pnlrdoAddItem").show();
            $("#pnlMainMenu").hide();
        }
        else {
            if (data.node.parent == "#") {
                 
                $("#pnlMainMenu").show();
                $(".mdl-card__title-text").text("Add Specialty Link");
                $("select").next().attr('disabled', false);
                fnSpecialtyParameter();
                fnClearFields();
                $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> Add');
            }
            else if (data.node.id.startsWith("SD")) {
                $("#dvForm").show();
                fnSpecialtyParameter();
                $("#pnlMainMenu").show();
                $(".mdl-card__title-text").text("Edit Specialty Link");
                $("#btnSaveSpecialty").html('<i class="fa fa-sync"></i> Update');
            }
            else {
                fnClearFields();
                $("#pnlMainMenu").hide();
            }
        }
    }
});

function fnExpandAll() {
    $('#jstSpecialtyDoctorLink').jstree('open_all');
}
function fnCollapseAll() {
    $('#jstSpecialtyDoctorLink').jstree('close_all');
}
function fnTreeSize() {
    $("#jstSpecialtyDoctorLink").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnClearFields() {
    $('#rdoAddBusinessSpecialtyUnit').prop('checked', false);
}
function fnSpecialtyParameter() {

    $("#jqgSpecialtyParameter").jqGrid({
        //url:
        datatype: 'local',
        data: [{ ActionDesc: 'Allow Consultation', ActiveStatus: true }, { ActionDesc: 'Is Clinic Applicable', ActiveStatus: false }],
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Action ID", "Parameter", "Status"],
        colModel: [
            { name: 'ActionID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ActionDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", formatoptions: { disabled: false } }
        ],
        caption: "",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,

    });
}