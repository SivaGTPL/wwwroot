
$(function () { 

    fnProcessLoading(true);

    var nav = "";
    var section_item = "";
    $.getJSON(getBaseURL() + "/json/nurseassesment.json", function (data) {
        var i = 0;
        $.each(data, function (key, item_nav) {
            i++;
            //$("#nav_menu").append("<li><a class='nav-link' href='#' data-bs-toggle='pill' data-bs-target=#tab-" + i + " role='tab'>" + item_nav.name + "<span class='sr-only'> (current)</span></a></li>");

            //section_item += "<div id=tab-" + i + " class='tab-pane fade' role='tabpanel' aria-labelledby=" + i + "> <h6 class='main-heading'><i class='fa fa-bars mr-10'></i>" + item_nav.name + "</h6>";

            $("#nav_menu").append("<li class='nav-item'><a class='nav-link d-flex' href='#assessment" + i + "'>" + item_nav.name + "<span class='sr-only'> (current)</span></a></li>");

            section_item += "<div class='pageSection'> <h4 id='assessment" + i + "'><span class='menu-small'><i class='fa fa-bars mr-10'></i></span>" + item_nav.name + "</h4>";



            $.each(item_nav.category, function (keys, item_category) {

                section_item += "<div class='row border-bottom px-0'>";

                $.each(item_category.item, function (keys, item_control) {

                    if ($('#hdAssessmentmember').val() === item_control.specific_to || IsStringNullorEmpty(item_control.specific_to)) {

                        if (item_control.valuetype === "float") {
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-6 col-6'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";

                            var eventName = "";
                            if (item_control.event === "Y")
                                eventName = "fnControl_onchange('" + item_control.formula + "')";


                            if (!IsStringNullorEmpty(item_control.controlid_2)) {
                                section_item += "<input id='" + item_control.controlid + "' class='form-control decimalNumber d-inline' style='width:50px'>  / ";
                                section_item += "<input id='" + item_control.controlid_2 + "' class='form-control decimalNumber d-inline' style='width:50px'>";
                            }
                            else
                                section_item += "<input id='" + item_control.controlid + "' class='form-control decimalNumber d-inline' style='width:80px' onchange=" + eventName + " >";

                            //$('#' + item_control.controlid).change(function () {
                            //    alert($('#' + item_control.controlid).val())
                            //});

                            section_item += "<span class='f-italic'>" + item_control.unittype + "</span>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "text") {
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-6'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<input id='" + item_control.controlid + "' class='form-control' type='text' />";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "textarea") {
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-12'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='3' cols='50'></textarea>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "checkbox") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><div class='row pb-2'>";
                            section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + item_control.name + "</label></div>";
                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + item_control.controlid + "_y' class='mr-1' name=" + item_control.controlid + " value='Y'>Yes</label></div>";
                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + item_control.controlid + "_n' class='mr-1' name=" + item_control.controlid + " value='N'>No</label></div>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "combox") {
                            section_item += "<div class='col-lg-4 col-md-4 col-sm-12'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<select class='selectpicker form-control' id='" + item_control.controlid + "' data-container='body'>";
                            section_item += "<option value='0' selected>NA</option>";
                            $.each(item_control.values, function (keyv, item_values) {
                                section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                            });
                            section_item += "</select>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "painscore") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<div class='col-lg-9 col-md-12 col-xs-12 p-0'>";
                            section_item += "<div id='divScaleNumbers'>";
                            section_item += "<span class='lblNumbers'>0</span><span class='lblNumbers'>1</span><span class='lblNumbers'>2</span><span class='lblNumbers'>3</span><span class='lblNumbers'>4</span><span class='lblNumbers'>5</span>";
                            section_item += "<span class='lblNumbers'>6</span><span class='lblNumbers'>7</span><span class='lblNumbers'>8</span><span class='lblNumbers'>9</span><span class='lblNumbers'>10</span>";
                            section_item += "</div>";
                            section_item += "<div id='divScaleLines'>";
                            section_item += "<div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div>";
                            section_item += "<div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div><div class='scaleLines'></div>";
                            section_item += "</div>";
                            section_item += " <div class='ratings d-flex flex-row'>";
                            section_item += "<label onclick=fnratingsActive('NoPain') id='lblNoPain'><img src='/images/smiley/smile.png' alt='No Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>No Pain</span></label>";
                            section_item += "<label onclick=fnratingsActive('MildPain') id='lblMildPain'><img src='/images/smiley/happy.png' alt='Mild Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Mild Pain </span></label>";
                            section_item += "<label onclick=fnratingsActive('ModeratePain') id='lblModeratePain'><img src='/images/smiley/sad.png' alt='Moderate Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Moderate Pain </span></label>";
                            section_item += "<label onclick=fnratingsActive('SeverePain') id='lblSeverePain'><img src='/images/smiley/confused.png' alt='Severe Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Severe Pain </span></label>";
                            section_item += "<label onclick=fnratingsActive('VerySeverePain') id='lblVerySeverePain'><img src='/images/smiley/angry.png' alt='Very Severe Pain' class='m-auto' name='painscore'/><span class='d-block pt-2'>Very Severe Pain </span></label>";
                            section_item += "<label onclick=fnratingsActive('WorstPainPossible') id='lblWorstPainPossible'><img src='/images/smiley/cry.png' alt='Worst Pain Possible' class='m-auto' name='painscore'/><span class='d-block pt-2'>Worst Pain Possible </span></label>";
                            section_item += "</div ></div > ";
                            section_item += "</div ></div > ";
                        }

                    }
                });


                if (item_category.type === "morsefallscale") {

                    //section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><div class='row'>";
                    //section_item += "<div class='col-lg-4 col-md-4 col-sm-7'>Variables</div>";
                    //section_item += "<div class='col-lg-4 col-md-4 col-sm-5'>Scoring</div>";
                    //section_item += "</div></div>";

                    //$.each(item_category.Variables, function (keys, item_control) {
                    //    section_item += "<div class='col-lg-12 col-md-12 col-sm-12'><div class='row'>";
                    //    section_item += "<div class='col-lg-4 col-md-4 col-sm-7'><label>" + item_control.name + "</label></div>";
                    //    section_item += "<div class='col-lg-4 col-md-4 col-sm-5'><select class='selectpicker form-control' id='" + item_control.controlid + "'>";
                    //    section_item += "<option value='0' selected>NA</option>";
                    //    //alert(JSON.stringify(item_control.values));
                    //    $.each(item_control.values, function (keyv, item_values) {
                    //        section_item += "<option>" + item_values.name + " (" + item_values.score + ")</option>";
                    //    });
                    //    section_item += "</select></div>";
                    //    section_item += "</div></div>";
                    //});
                    section_item += "<div class='col-lg-12 col-md-12 col-sm-12'>";
                    section_item += "<div class='table-responsive'>";
                    section_item += "<table class='table'>";
                    section_item += "<thead><th scope='col'>Variables</th><th scope='col'></th><th scope='col'>Scores</th></tr></thead>";
                    section_item += "<tbody>";
                    $.each(item_category.Variables, function (keys, item_control) {
                        section_item += "<tr><td>" + item_control.name + "</td><td>";
                        $.each(item_control.values, function (keyv, item_values) {
                            section_item += "<label class=''><input type='radio' id='" + item_values.name + "' class='' name=" + item_control.controlid + " value='" + item_values.value + "' onclick=fnMorseFallScale_onchange(this,'" + item_values.score + "')> " + item_values.name + "</label>";
                        });
                        section_item += "</td><td><input class='form-control decimalNumber' name='txtmorsefallscale' readonly id='" + item_control.controlid + "_score'  style='width:80px'/></td></tr>";
                    });
                    section_item += "<tfoot><tr><td></td><td>Total Scores</td><td><input id='txtTotalScores' readonly class='form-control decimalNumber' style='width:80px'/></td></td></tr></tfoot>";
                    section_item += "</tbody></table>";


                    section_item += "<table class='table infoTable'>";
                    section_item += "<thead><th scope='col'>Risk Level</th><th scope='col'>MFS Score</th><th scope='col'>Action</th></tr></thead>";
                    section_item += "<tbody>";
                    $.each(item_category.level, function (keys, item_control) {
                        section_item += "<tr><td>" + item_control.score + "</td><td>" + item_control.risklevel + "</td><td>" + item_control.Action + "</td></tr>";
                    });
                    section_item += "</tbody></table>";
                    section_item += "</div>";
                    section_item += "</div>";
                }

                section_item += "</div>";

            });

            section_item += "</div>";
        });

    }).done(function () {
        //$(".tab-content").html(section_item);
        $("#mainContent").html(section_item);
        fnsideBarSetup();
        //  fnSetPatientValues();
        fnSetNurseAssessmentValueForPatient();

        $(".selectpicker").selectpicker('refresh');
        $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
        $('.pageSection:last-child').css('min-height', $('.sidebar').height());

        fnProcessLoading(false);
       
    });

});


$(function () {fnGetPatientDetails();});

function fnControl_onchange(ev) {
    var cn = ev.split("=");
    var fr = cn[1].split("_");

    var fr_value = "";
    $.each(fr, function (keys, item) {

        if (item.startsWith("[")) {
            var val = $('#' + item.replace("[", "").replace("]", "")).val();
            if (IsStringNullorEmpty(val))
                val = 0;
            fr_value = fr_value + val;
        }
        else {
            fr_value = fr_value + item;
        }
    });
    $('#' + cn[0]).val(eval(fr_value));
}

function fnMorseFallScale_onchange(rdo, score) {
    $('#' + rdo.name + '_score').val(score);
    var totalScores = 0;
    $('input[name="txtmorsefallscale"]').each(function (oneTag) {
        totalScores += parseFloat($(this).val() || 0);
    });
    $('#txtTotalScores').val(totalScores);
}

function fnSetPatientValues() {
    var pt = [
        {
            "controlid": "1-1",
            "valuetype": "float",
            "value": "10"
        },
        {
            "controlid": "1-2",
            "valuetype": "float",
            "value": "12"
        },
        {
            "controlid": "1-11",
            "valuetype": "text",
            "value": "Notes"
        },
        {
            "controlid": "2-1",
            "valuetype": "checkbox",
            "value": "true"
        },
        {
            "controlid": "2-2",
            "valuetype": "checkbox",
            "value": "false"
        },
        {
            "controlid": "2-19",
            "valuetype": "combox",
            "value": "2"
        },
        {
            "controlid": "3-1",
            "valuetype": "combox",
            "value": "Yes"
        },
        {
            "controlid": "6-2",
            "valuetype": "painscore",
            "value": "MildPain"
        }
    ];


    $.each(pt, function (keys, item) {
        if (item.valuetype === "float" || item.valuetype === "text" || item.valuetype === "textarea") {
            $('#' + item.controlid).val(item.value);
        }
        if (item.valuetype === "combox") {
            $('#' + item.controlid).val(item.value);
        }
        if (item.valuetype === "checkbox") {
            if (item.value === "true")
                $('#' + item.controlid + '_y').prop('checked', true);
            if (item.value === "false")
                $('#' + item.controlid + '_n').prop('checked', true);
        }
        if (item.valuetype === "painscore") {
            $(".ratings label.active").removeClass('active');
            _painscore_id = "lbl" + item.value;
            $("#lbl" + item.value).addClass('active');
        }
    });

}

function fnGetPatientDetails() {
    $.ajax({
        url: getBaseURL() + '/NurseAssessment/GetInPatientDetailsByIPNumber',
        type: 'GET',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            ipnumber: $('#hdIPNumber').val()
        },
        success: function (result) {
            $('#lblPatientName').html(result.PatientName);
            $('#lblGender').html(result.Sex);
            $('#lblAge').html(result.Age);
            $('#lblDOA').html(fnFormatDateJsonToInput(result.EffectiveDateOfAdmission));
            $('#lblConsultantName').html(result.DoctorName);
            $('#lblRoomType').html(result.RoomTypeDesc);
            $('#lblBedNumber').html(result.BedNumber);
        }
    });
}

function fnSetNurseAssessmentValueForPatient() {
    $.ajax({
        url: getBaseURL() + '/NurseAssessment/GetNurseAssessmentValueForPatient',
        type: 'GET',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            UHID: $('#hdUHID').val(),
            ipnumber: $('#hdIPNumber').val()
        },
        async: false,
        success: function (result) {
            $.each(result, function (keys, item) {
                if (item.ValueType === "float" || item.ValueType === "text" || item.ValueType === "textarea") {
                    $('#' + item.NSControlID).val(item.Value);
                }
                if (item.ValueType === "combox") {
                    $('#' + item.NSControlID).val(item.Value);
                }
                if (item.ValueType === "checkbox") {
                    if (item.Value === "Y")
                        $('#' + item.NSControlID + '_y').prop('checked', true);
                    if (item.Value === "N")
                        $('#' + item.NSControlID + '_n').prop('checked', true);
                }
                if (item.ValueType === "painscore") {
                    $(".ratings label.active").removeClass('active');
                    _painscore_id = item.value;
                    $("#lbl" + item.Value).addClass('active');
                }
                if (item.ValueType === "radio") {
                    $('input:radio[name="' + item.NSControlID + '"][value=' + item.Value + ']').prop('checked', true).trigger("click");
                }
            });
        }
    });
}

function fnSaveNurseAssessment(type) {


    fnProcessLoading(true, "saving");

    try {
        var ns_result = [];
        $.getJSON(getBaseURL() + "/json/nurseassesment.json", function (data) {
            $.each(data, function (key, item_nav) {
                $.each(item_nav.category, function (keys, item_category) {
                    $.each(item_category.item, function (keys, item_control) {
                        if (item_control.valuetype === "float") {
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            ns_result.push({
                                NSControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });

                            if (!IsStringNullorEmpty(item_control.controlid_2)) {
                                if (type === "S") {
                                    if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid_2).val())) {
                                        toastr.warning("Please enter the Value");
                                        fnProcessLoading(false);
                                        return false;
                                    }
                                }
                                ns_result.push({
                                    NSControlID: item_control.controlid_2,
                                    ValueType: item_control.valuetype,
                                    Value: $('#' + item_control.controlid_2).val()
                                });
                            }
                        }
                        if (item_control.valuetype === "text") {
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            ns_result.push({
                                NSControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea") {
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            ns_result.push({
                                NSControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "checkbox") {
                            var rd_value = $("input[type='radio'][name='" + item_control.controlid + "']:checked").val();
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty(rd_value)) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            ns_result.push({
                                NSControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: rd_value
                            });
                        }
                        if (item_control.valuetype === "combox") {
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty($('#' + item_control.controlid).val())) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            ns_result.push({
                                NSControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "painscore") {
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty(_painscore_id)) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            ns_result.push({
                                NSControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: _painscore_id
                            });
                        }
                    });
                    if (item_category.type === "morsefallscale") {
                        $.each(item_category.Variables, function (keys, item_control) {
                            var ms_value = $("input[name='" + item_control.controlid + "']:checked").val();
                            if (type === "S") {
                                if (item_control.mandatory === "Y" && IsStringNullorEmpty(ms_value)) {
                                    toastr.warning("Please enter the Value");
                                    fnProcessLoading(false);
                                    return false;
                                }
                            }
                            if (!IsStringNullorEmpty(ms_value)) {
                                ns_result.push({
                                    NSControlID: item_control.controlid,
                                    ValueType: item_control.valuetype,
                                    Value: ms_value
                                });
                            }
                        });
                    }
                });
            });
        }).done(function () {
            $("#btnSaveDraft").attr('disabled', true);

            var ns = {
                BusinessKey: 0,
                UHID: $('#hdUHID').val(),
                IPNumber: $('#hdIPNumber').val(),
                l_NS_ControlValue: ns_result,
                ActiveStatus: true,
                UserID: 0
            };

            $.ajax({
                url: getBaseURL() + '/NurseAssessment/InsertIntoNurseAssessment',
                type: 'POST',
                datatype: 'json',
                contenttype: 'application/json; charset=utf-8',
                data: ns,
                async: true,
                success: function (response) {
                    if (response.Status) {
                        toastr.success("Saved!");
                    }
                    else {
                        toastr.error(response.Message);
                    }
                    $("#btnSaveDraft").attr('disabled', false);
                    fnProcessLoading(false);
                },
                error: function (error) {
                    toastr.error(error.statusText);
                    $("#btnSaveDraft").attr('disabled', false);
                    fnProcessLoading(false);
                }
            });

        });
    }
    catch
    {
        $("#btnSaveDraft").attr('disabled', false);
        fnProcessLoading(false);
    }

}


$(document).ready(function () {
    $(".nav-link.active").removeClass("active");
    $(".sidebar-sticky .nav-link").first().addClass('active');
    //$('#mainContent').offset().top = 0;
    setTimeout(function () { fnsideBarSetup() }, 1000);
    var docWidth = $(document).width();
    if (docWidth <= 600) {
        $('#mainContent').addClass('moveLeft');
        $('.sidebar').addClass('hide');
    }
});
$(window).on('resize', function () {
    location.reload();
    fnsideBarSetup();
});

$("ul").on('click', '.nav-link', function () {
    var docWidth = $(document).width();
    if (docWidth <= 600) {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $('.tab-pane').removeClass('show active');
        $('#mainContent').addClass('moveLeft');
        $('.sidebar').addClass('hide');
    }
    else {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $('.tab-pane').removeClass('show active');
       
       
    }
});
$('#mainContent').on('click', 'h4', function () {
    var docWidth = $(document).width();
    if (docWidth <= 600) {
        //$('#mainContent').toggleClass('moveLeft');
        $('.sidebar').toggleClass('hide');
    }
    else {
        $('.sidebar').removeClass('hide');
    }
    
})
function fnsideBarSetup() {
    var docWidth = $(document).width();
    var marginLeft = $("#navbar-example2").outerWidth(true);
    var winH = $(window).outerHeight(true);
    var divHeight = Math.floor($(".divFixedBar").outerHeight(true) + $("section.header").outerHeight(true) + $("div.header").outerHeight(true)) - 1;
    var maxH = ($(window).outerHeight(true) - ($("section.header").outerHeight(true) + $(".banner").outerHeight(true) + $(".divFixedBar").outerHeight(true)))
    const headerH = $('section.header').outerHeight(true);
    const headerBannerH = headerH + $('.banner').outerHeight(true);
    const headerBannerFixedBarH = headerBannerH + $('.divFixedBar').outerHeight(true);
    const tabContentH = headerBannerFixedBarH;

    
    //$('.tab-content').css('padding-top', tabContentH);
    $("#mainContent").css({
        "top": 0,
        'max-height': winH - tabContentH - 24,
        'margin-left': marginLeft,
        'overflow-y': 'auto'
    });
    $(".sidebar").css({
        'top': divHeight,
        'display': 'block',
        'overflow-y': 'auto',
        'max-height': maxH
    });
     
}

function fnratingsActive(id) {

    $(".ratings label.active").removeClass('active');
    $('#lbl' + id).addClass('active');
    _painscore_id = id;
}

 