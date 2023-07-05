$(document).ready(function () {
     
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorSchedule');
        }
    });
    fnLoadDoctorSchedulerGrid();
});


function fnLoadDoctorSchedulerGrid() {

    $("#jqgDoctorSchedule").GridUnload();

    $("#jqgDoctorSchedule").jqGrid({

        url: getBaseURL() + '/DoctorDesk/GetDoctorScheduleList',
        datatype: 'json',
        mtype: 'POST',
        colNames: [localization.Specialty, localization.Clinic, localization.ConsultationType, localization.Dayoftheweek, localization.NumberofPatients, localization.Week1, localization.Week2, localization.Week3, localization.Week4, localization.Week5, localization.FromTime, localization.ToTime],
        colModel: [


            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "ClinicDesc", width: 80, editable: true, align: 'left' },
            { name: "ConsultationType", width: 130, editable: true, align: 'left' },
            { name: "DayOfWeek", width: 70, editable: true, align: 'left' },
            { name: "NoOfPatients", width: 60, editable: true, align: 'left', hidden: false },
            { name: "Week1", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week2", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week3", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week4", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week5", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: 'ScheduleFromTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            

        ],

        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpDoctorSchedule",
        caption:"Doctor Schedule",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadComplete: function (data) {
            $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100%');
            fnJqgridSmallScreen("jqgDoctorSchedule");
 }
    });
}

