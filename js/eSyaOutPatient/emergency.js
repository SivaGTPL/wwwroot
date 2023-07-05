//var scrollLink = $(".nav-link");
//$(".sidebar-sticky .nav-link").click(function () {
//    $(".nav-link.active").removeClass("active");
//    $(this).addClass("active");
//});
 
$(document).ready(function () {
    $(".nav-link.active").removeClass("active");
    $(".sidebar-sticky .nav-link").first().addClass('active');
    //$('#mainContent').offset().top = 0;
    setTimeout(function () { fnsideBarSetup()},250);
});

$(window).on('resize', function () {
    fnsideBarSetup();
});

$(".ratings label").click(function () {
    debugger;
    $(".ratings label.active").removeClass('active');
    $(this).addClass('active');
});


var _painscore_id;
function fnratingsActive(id) {
   
    debugger;
    $(".ratings label.active").removeClass('active');
    $('#lbl'+id).addClass('active');
    _painscore_id = id;
}

function fnsideBarSetup() {
    var docWidth = $(document).width();
    var marginLeft = $("#navbar-example2").outerWidth(true);
    var divHeight = $(".divFixedBar").outerHeight(true) + $("section.header").outerHeight(true) + $("div.header").outerHeight(true);

    //$("#floatButtons").css('top', $(".divFixedBar").outerHeight(true) + $("section.header").outerHeight(true) + $("div.header").outerHeight(true) - 10);
    if (docWidth < 600) {
        $("#mainContent").css({
            "top": $(".divFixedBar").height(),
            'height': ($(window).innerHeight() - ($("nav").innerHeight() + $(".header").innerHeight() + $(".divFixedBar").innerHeight())),
            'margin-left': marginLeft,
        });
        $(".sidebar").css({ 'top': divHeight, 'display': 'none' });
    }
    else {

        $("#mainContent").css({
            "top": $(".divFixedBar").outerHeight(true),
            'height': ($(window).innerHeight() - ($("nav").innerHeight() + $(".header").innerHeight() + $(".divFixedBar").innerHeight())),
            'margin-left': marginLeft,
        });
        $(".sidebar").css({ 'top': divHeight, 'display': 'block' });
    }

}
document.querySelectorAll('.feedback li').forEach(entry => entry.addEventListener('click', e => {
    if (!entry.classList.contains('active')) {
        document.querySelector('.feedback li.active').classList.remove('active');
        entry.classList.add('active');
    }
    e.preventDefault();
}));
