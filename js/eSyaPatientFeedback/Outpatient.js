var lstqMaster = [];

$(document).ready(function () {
    $.each(qMaster, function (i, data) { lstqMaster.push(data.QuestionnaireID + ':' + data.QuestionnaireDesc); });
    lstqMaster = lstqMaster.join(';');

});

var questions = lstqMaster;



//var questions = ["How was your experience making an appointment?", "How  was your experience checking in with reception?", "How was your experience with wait time?"];
var content = "";

$(function () {
    content += "<div class='row'>";

    for (i = 0; i < questions.length; i++) {
        content += "<div class='col-lg-12 col-md-12 col-sm-12 col-12'>";
        content += "<div class='divQuestion'>";
        content += "<p class='m-0' id='qt_" + i + "'>" + questions[i] + "</p>";
        content += "<div class='divRating'>";
        content += "<button type='button' class='btn'><span class='fa fa-star'></span></button>";
        content += "<button type='button' class='btn'><span class='fa fa-star'></span></button>"
        content += "<button type='button' class='btn'><span class='fa fa-star'></span></button>"
        content += "<button type='button' class='btn'><span class='fa fa-star'></span></button>"
        content += "<button type='button' class='btn'><span class='fa fa-star'></span></button>"
        content += "</div>"
        content += "<div class=''>"
        content += "<label class='label-comment'>Comment</label>"
        content += "<textarea class='form-control' rows='2' cols='4' id='comment_" + i + "' placeholder=''></textarea>";
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

function fnValidate() {

    var txtUHID = $("#txtUHID").val();
    var txtFirstName = $("#txtFirstName").val();
    var txtLastName = $("#txtLastName").val();
    var txtEmailID = $("#txtEmailID").val();
    var _flag = 0;

    let namePattern = /^[A-Za-z]+$/;
    let EmailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if ($("[id^='cboFeedbackType']").val() == "0") {
        toastr.warning("Please select Feedback Type"); $("#cboFeedbackType").focus();
        return false;
    }
    else if ($("#cboFloorID").val() == "0" || $("#cboFloorID").val() == '') {
        toastr.warning("Please select Floor"); $("#cboFloorID").focus();
        return false;
    }
    else if (txtUHID == '') {
        toastr.warning("Please Enter the UHID"); $("#txtUHID").focus();
        $(window).scrollTop("0"); return false;
    }
    else if (txtFirstName == '') {
        toastr.warning("Please Enter the first name"); $("#txtFirstName").focus();
        $(window).scrollTop("0"); return false;
    }
    else if (txtLastName == '') {
        toastr.warning("Please Enter the last name"); $("#txtLastName").focus();
        $(window).scrollTop("0"); return false;
    }
    else if (!namePattern.test(txtFirstName)) {
        toastr.warning("Please Enter the valid first name"); $("#txtFirstName").focus();
        $(window).scrollTop("0"); return false;
    }
    else if (!namePattern.test(txtLastName)) {
        toastr.warning("Please Enter the valid last name"); $("#txtLastName").focus();
        $(window).scrollTop("0"); return false;
    }
    else if (!EmailPattern.test(txtEmailID)) {
        toastr.warning("Please Enter the valid Email ID"); $("#txtEmailID").focus();
        $(window).scrollTop("0"); return false;
    }
    else if ($("#cboMobileNumber").val() == 0 || $("#cboMobileNumber").val() == "0") {
        toastr.warning("Please select ISD Code");
        return false;
    }
    else if (IsStringNullorEmpty($("#txtMobileNumber").val())) {
        toastr.warning("Please Enter Mobile Number");
        return false;
    }
    else {
        $('.divRating').each(function () {
            if (!$(this).hasClass('starClicked')) {
               // toastr.warning("Please give your star rating for all the questions");
                return false;
            }


        });
        _flag = 1;
    }
    if (_flag == 1) {
        $('textarea').each(function () {
            if ($(this).attr('data-status') == 'm') {
                if ($(this).val() == "") {
                   // toastr.warning("Please fill all the mandatory");
                    return false;
                }
            }
        });
    }




}
function fnSaveInpatient() {

    if (fnValidate() == false) {
        return;
    }

    //var starratings = [];
    //var comments = [];
    //for (i = 0; i < questions.length; i++) {
    //    starratings.push($("#comment_" + i).attr("data-rating"));
    //    comments.push($("#comment_" + i).val());
    //}

    var qmasterlist = [];
    var questionmasterlist = [];
    for (var i = 0; i < questions.length; i++) {
        qmasterlist.push({
            QuestionnaireID: $("#qt_" + i).html().split(':')[0],
            QuestionnaireValue: $("#comment_" + i).attr("data-rating"),
            Comments: $("#comment_" + i).val()

        });
    }

    for (var i = 0; i < qmasterlist.length; i++) {

        if (qmasterlist[i].QuestionnaireValue !== undefined) {
            questionmasterlist.push({
                QuestionnaireID: $("#qt_" + i).html(),
                QuestionnaireValue: $("#comment_" + i).attr("data-rating"),
                Comments: $("#comment_" + i).val()
            });
        }

    }

    //var starratingsum = 0;
    //for (var i = 0; i < starratings.length; i++) {

    //    if (starratings[i] !== undefined)
    //    {
    //        starratingsum += parseInt(starratings[i]);
    //    }
    //}

    //toastr.success("Thank you for your valuable feedback");
    var objfeedback = {
        FeedBackType: $("#cboFeedbackType").val(),
        FloorId: $("#cboFloorID").val(),
        UHID: $("#txtUHID").val(),
        FirstName: $("#txtFirstName").val(),
        MiddleName: $("#txtMiddleName").val(),
        LastName: $("#txtLastName").val(),
        EmailId: $("#txtEmailID").val(),
        SpecialtyId: $("#cboSpecialty").val(),
        DoctorId: $("#cboDoctor").val(),
        //OverAllRating: starratingsum,
        //CommentOnServices: comments.toString(),
        //OverAllRating: starratings,
        //CommentOnServices: comments,
        IsdCode: $("#cboMobileNumber").val(),
        MobileNumber: $("#txtMobileNumber").val(),
        l_QuestionnaireMaster: qmasterlist
    }

    $.ajax({

        async: false,
        url: getBaseURL() + '/PatientFeedbackTransaction/InsertIntoOutPatientFeedbackQuestionnaire',
        type: 'POST',
        datatype: 'json',
        data: { obj: objfeedback },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearFields();

                return true;
            }
            else {
                toastr.error(response.Message);
                return false;
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
        }

    })
}
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

}