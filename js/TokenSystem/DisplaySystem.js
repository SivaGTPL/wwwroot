$(function () {
    fnDynamicHeight();
});
$(window).on('resize', function () {
    fnDynamicHeight();
})
function fnDynamicHeight() {
    $(".rightDisplay").each(function () {
        var divCount = $(this).find('div').length;
        var dynamicHeight = ($(window).height() / divCount);
        var dynamicDivWidth = ($(".rightDisplay div").innerWidth() / 2);
        var winWidth = $(window).width();
        if (winWidth < 992) {
            if (divCount == 1) {
                $(".rightDisplay div").css('height', 50 + 'vh');
                $(".text-tokenNumber").css({ 'font-size': 5 + 'vh', 'line-height': 5 + 'vh', 'padding-top': 4 + 'vh' });
                $(".doctorName").css({ 'font-size': 7 + 'vh', 'line-height': 7 + 'vh', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': 3 + 'vh', 'line-height': 3 + 'vh' });

            }
            else if (divCount == 2 || divCount == 3) {
                $(".rightDisplay div").css('height', 50 / divCount + 'vh');
                $(".text-tokenNumber").css({ 'font-size': 100 / (divCount * 2) + 'vh', 'line-height': 50 / (divCount * 2) + 'vh' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 3 + 'vh', 'line-height': dynamicHeight / 3 + 'vh', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': divCount + 'vh', 'line-height': divCount + 'vh' });
            }
            else if (divCount == 4) {
                $(".rightDisplay div").css('height', 50 / divCount + 'vh');
                $(".text-tokenNumber").css({ 'font-size': 7 + 'vh', 'line-height': 50 / (divCount * 2) + 'vh' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 3 + 'vh', 'line-height': dynamicHeight / 3 + 'vh', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': divCount + 'vh', 'line-height': divCount + 'vh' });
            }
            else {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 24 + 'vh', 'line-height': dynamicHeight / 24 + 'vh' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 6 + 'px', 'line-height': dynamicHeight / 6 + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight / 6 + 'px', 'line-height': dynamicHeight / 6 + 'px' });

            }
        }
        else {
            if (divCount == 1) {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 55 + 'vh', 'line-height': dynamicHeight / 55 + 'vh', 'padding-top': dynamicHeight / 3 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 95 + 'vh', 'line-height': dynamicHeight / 95 + 'vh', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight / 95 + 'vh', 'line-height': dynamicHeight / 95 + 'vh' });

            }
            else if (divCount == 2 || divCount == 3 || divCount == 4) {
               $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / divCount + 'px', 'line-height': dynamicHeight / divCount + 'px', 'padding-top': dynamicHeight / (divCount * 20) + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px' });

            }
            else {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / (divCount * 10) + 'vh', 'line-height': dynamicHeight / 24 + 'vh' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 6 + 'px', 'line-height': dynamicHeight / 6 + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight / 6 + 'px', 'line-height': dynamicHeight / 6 + 'px' });


            }
        }

    });

}

$(document).ready(function () {
    fnDisplayingToken();
    fnDisplayCallingToken();
});


var TokenList = [];
var lastCallingCounter = "";
var lastCallingToken = "";
var previousCallingToken = "";

function fnDisplayingToken() {

    $("[id^=lblTokenNumber_]").text("");
    lastCallingCounter = "";
    lastCallingToken = "";

    try {
        $.ajax({
            type: "GET",
            url: getBaseURL() + '/DisplaySystem/GetTokenForCounterDisplay',
            data: {
                businessKey: $('#hdBusinessKey').val(),
                counterList: $('#hdCounters').val(),
            },
            cache: false,
            success: function (data) {
                console.log(data)
                $.each(data, function (key, value) {
                    $("#lblTokenNumber_" + value.CallingCounter).html(value.TokenKey);
                    lastCallingCounter = value.CallingCounter;
                    lastCallingToken = value.TokenKey;

                    TokenList.push({
                        CallingCounter: value.CallingCounter,
                        TokenCallingTime: value.TokenCallingTime,
                        SRTokenKey: value.TokenKey
                    });

                });

                fnDisplayCallingToken();
            }
        });
    }
    catch (err) {
        console.error(err);
    }

    window.setTimeout(fnDisplayingToken, 5000);

}
function fnDisplayCallingToken() {

    $("#lblCallingCounter").html(lastCallingCounter);
    $("#lblCallingTokenNumber").html(lastCallingToken);

    if (lastCallingToken !== previousCallingToken) {
        previousCallingToken = lastCallingToken
       
    }

}



