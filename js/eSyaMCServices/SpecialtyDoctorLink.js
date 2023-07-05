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
        "plugins": ["checkbox"],
        core: {
            'data': [{ "id": "parentnode", "parent": "#", "text": "Specialty Codes" },
            { "id": "SC01", "parent": "parentnode", "text": "General Medicine" },
            { "id": "SC02", "parent": "SC01", "text": "OPD" },
            { "id": "SC03", "parent": "SC01", "text": "Evening Clinic" },], 'check_callback': true, 'multiple': true
        }

    });
}
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