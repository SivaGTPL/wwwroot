var lstqMaster = [];

$(document).ready(function () {
    $("#cboFeedbackType").val(qMaster.FeedBackType).selectpicker('refresh');
    $("#cboFloorID").val(qMaster.FloorId).selectpicker('refresh');
    $("#txtUHID").val(qMaster.UHID);
    $("#txtFirstName").val(qMaster.FirstName);
    $("#txtMiddleName").val(qMaster.MiddleName);
    $("#txtLastName").val(qMaster.LastName);
    $("#txtEmailID").val(qMaster.EmailId);
    $("#cboSpecialty").val(qMaster.SpecialtyId).selectpicker('refresh');
    $("#cboDoctor").val(qMaster.DoctorId).selectpicker('refresh');
    $("#cboMobileNumber").val(qMaster.IsdCode).selectpicker('refresh');
    $("#txtMobileNumber").val(qMaster.MobileNumber);


    $.each(qMaster.l_QuestionnaireMaster, function (i, data) { lstqMaster.push(data.QuestionnaireID + ':' + data.QuestionnaireDesc); });
    lstqMaster = lstqMaster.join(';');

});

var questions = lstqMaster;

var content = "";

$(function () {
    content += "<div class='row'>";

    for (i = 0; i < qMaster.l_QuestionnaireMaster.length; i++) {
        content += "<div class='col-lg-12 col-md-12 col-sm-12 col-12'>";
        content += "<div class='divQuestion'>";
        content += "<p class='m-0' id='qt_" + i + "'>" + qMaster.l_QuestionnaireMaster[i].QuestionnaireDesc + "</p>";
        content += "<div class='divRating'>";

        for (j = 0; j < qMaster.l_QuestionnaireMaster[i].QuestionnaireValue; j++) {
            content += "<button type='button' class='btn'><span class='fa fa-star' style='color:orange'></span></button>";
        }
        if (qMaster.l_QuestionnaireMaster[i].QuestionnaireValue < 5) {
            for (k = qMaster.l_QuestionnaireMaster[i].QuestionnaireValue; k < 5; k++) {
                content += "<button type='button' class='btn'><span class='fa fa-star'></span></button>";
            }
        }
      
        content += "</div>"
        content += "<div class=''>"
        content += "<label class='label-comment'>Comment</label>"
        if (qMaster.l_QuestionnaireMaster[i].Comments == null) {
            content += "<textarea class='form-control' rows='2' readonly cols='4' id='comment_" + i + "' placeholder=''></textarea>";
        }
        else {
            content += "<textarea class='form-control' rows='2' readonly cols='4' id='comment_" + i + "' placeholder=''>" + qMaster.l_QuestionnaireMaster[i].Comments + "</textarea>";
             }

        content += "</div></div></div>";
    }
    content += "</div>";
    $("#section_question").append(content);
})

$("#section_question").on('click', 'button', function () {
    var clickedElement = $(this).index();
    var noofelements = $(this).parent().find('.fa-star');

    $(this).parent().find(".fa-star").css('color', '#ccc');
    $(this).parent().addClass("starClicked");

    for (i = 0; i <= clickedElement; i++) {
        $(this).parent().find(noofelements[i]).css('color', 'orange');
    }
    if (clickedElement < 2) {
        $(this).parent().parent().find(".label-comment").html("Comment <sup class='icon-star'><i class='fa fa-star-of-life'></i></sup>");
        $(this).parent().parent().find("textarea").attr({ "data-status": "m", 'data-rating': clickedElement + 1 });
    }
    else {
        $(this).parent().parent().find(".label-comment").html("Comment <span class='text-small'>(Optional)</span>").animate("slow");
        $(this).parent().parent().find("textarea").attr({ "data-status": "o", 'data-rating': clickedElement + 1 });
    }
});


function fnClearFields() {
    $("input[type=text").val('');
    $("[id^='cbo']").val('ch');
    $('.fa-star').css('color', '#ccc');
    $(".label-comment").html("Comment");
    $('textarea').val('');
    $('textarea').attr("data-status", "o");
    $("#cboFeedbackType").val("0").selectpicker('refresh');
    $("#cboFloorID").val("0").selectpicker('refresh');
    $("#txtUHID").val('');
    $("#txtFirstName").val('');
    $("#txtMiddleName").val('');
    $("#txtLastName").val('');
    $("#txtEmailID").val('');
    $("#cboSpecialty").val("0").selectpicker('refresh');
    $("#cboDoctor").val("0").selectpicker('refresh');
    $("#cboMobileNumber").val("0").selectpicker('refresh');
    $("#txtMobileNumber").val('');

    var url = getBaseURL() + '/eSyaPatientFeedback/PatientFeedbackTransaction/FeedbackHeader';
    window.location.href = url;
}