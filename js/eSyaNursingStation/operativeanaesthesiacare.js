
Date.prototype.timeToInput = function () {
    return ('0' + (this.getHours())).substr(-2, 2) + ':' + ('0' + this.getMinutes()).substr(-2, 2);
};

$(function () {
    fnProcessLoading(true);
    $("#mainContent").on('scroll', function () {
       // alert($("#mainContent").offset().top)
    });
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        // Do something
        console.log(scroll);
    });
    
});

$.get(getBaseURL() + '/NurseAssessment/GetInPatientDetailsByIPNumber', {
    ipnumber: $('#hdIPNumber').val()
}, function (result, status) {
    $('#lblPatientName').html(result.PatientName);
    $('#lblGender').html(result.Sex);
    $('#lblAge').html(result.Age);
    $('#lblDOA').html(fnFormatDateJsonToInput(result.EffectiveDateOfAdmission));
    $('#lblConsultantName').html(result.DoctorName);
    $('#lblRoomType').html(result.RoomTypeDesc);
    $('#lblBedNumber').html(result.BedNumber);
    fnsideBarSetup();
    fnProcessLoading(false);

    $.when(Utils_ClinicalCharts.populateClinicalTemplate("OT1"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT2"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT3"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT4"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT5"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT6"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT7"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT8"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT9"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT10"))
        .then(Utils_ClinicalCharts.populateClinicalTemplate("OT11"))

        .then(function (data) {
            getClinicalInformationByID($('#hdTransactionID').val(), function (data) {
                Utils_ClinicalCharts.setClinicalTemplate(data);
            });
        });

});

var _isUpdate = false;
var _intTransactionId = 0;

var Utils_ClinicalCharts = {

    populateClinicalTemplate: function (type) {
        var section_item = "";
        return new Promise(function (resolve) {
            $.getJSON(getBaseURL() + "/json/eSyaNursingStation/operativeanaesthesiacare.json", function (data) {
                var i = 0;
                var d = data.filter(element => element.cltype === type);

                $.each(d, function (key, item_nav) {
                    section_item = "<div class='row border-bottom m-0'>";
                    $.each(item_nav.item, function (keys, item_control) {
                        if (item_control.valuetype === "heading") {
                            section_item += "<br/><div class='col-lg-12 col-md-12 col-sm-12 pl-0'><h6 class='main-heading'>" + item_control.name + "</h6></div>";
                        }
                        if (item_control.valuetype === "htmltag") {
                            section_item += "<div>" + item_control.name + "</div>";
                        }
                        if (item_control.valuetype === "float") {
                            if (type === "NC")
                                section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><div class= 'form-group'>";
                            else
                                section_item += "<div class='col-lg-4 col-md-4 col-sm-4 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";

                            var eventName = "";
                            var readonly = "";
                            if (item_control.readonly === "Y")
                                readonly = "readonly";

                            if (item_control.event === "Y")
                                eventName = "Utils_ClinicalCharts.onChange_ClinicalValue('" + item_control.formula + "')";

                            if (!IsStringNullorEmpty(item_control.controlid_2)) {
                                section_item += "<input id='" + item_control.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>  / ";
                                section_item += "<input id='" + item_control.controlid_2 + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:50px'>";
                            }
                            else
                                section_item += "<input id='" + item_control.controlid + "' " + readonly + " class='form-control decimalNumber d-inline' style='width:80px' onchange=" + eventName + " >";

                            section_item += "<span class='f-italic'>" + item_control.unittype + "</span>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "text") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<input id='" + item_control.controlid + "' class='form-control' type='text' />";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "ltext") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<input id='" + item_control.controlid + "' class='form-control' type='text' />";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "textarea") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='3' cols='90'></textarea>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "textarea_l") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='3' cols='90'></textarea>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "textarea_xl") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='7' cols='90'></textarea>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "textarea_xxl") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<textarea id='" + item_control.controlid + "' class='form-control' rows='50' cols='90'></textarea>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "checkbox") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class='row pb-2'>";
                            section_item += "<div class='col-lg-4 col-md-5 col-sm-6'><label>" + item_control.name + "</label></div>";
                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + item_control.controlid + "_y' class='mr-1' name=" + item_control.controlid + " value='Y'>Yes</label></div>";
                            section_item += "<div class='col-lg-2 col-md-2 col-sm-2 col-6'><label class=''><input type='radio' id='" + item_control.controlid + "_n' class='mr-1' name=" + item_control.controlid + " value='N'>No</label></div>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "combox") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<select class='selectpicker form-control' id='" + item_control.controlid + "' data-container='body'>";
                            section_item += "<option value='0' selected>NA</option>";
                            $.each(item_control.values, function (keyv, item_values) {
                                section_item += "<option value='" + item_values.value + "'>" + item_values.name + "</option>";
                            });
                            section_item += "</select>";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "datetime") {
                            section_item += "<div class='col-lg-4 col-md-6 col-sm-4 pl-0'><div class= 'form-group'>";
                            section_item += "<label>" + item_control.name + "</label>";
                            section_item += "<input id='" + item_control.controlid + "' class='form-control' type='datetime-local' />";
                            section_item += "</div></div>";
                        }
                        if (item_control.valuetype === "table") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><h6 class='sub-heading'>" + item_control.name + "</h6></div>";
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'>";
                            section_item += "<div class='table-responsive'>";
                            section_item += "<table class='table'>";
                            section_item += "<thead>";

                            $.each(item_control.table.column, function (keys, col) {
                                if (col.name !== "ID")
                                    section_item += "<th scope='col'>" + col.name + "</th>";
                            });
                            section_item += "</thead>";
                            section_item += "<tbody>";
                            $.each(item_control.table.row, function (keys, row) {
                                section_item += "<tr>";
                                $.each(item_control.table.column, function (keys, col) {
                                    if (col.name !== "ID") {
                                        if (col.readonly === "Y") {
                                            section_item += "<td>";
                                            section_item += "<label>" + row[col.controlid] + "</label>";
                                            section_item += "</td>";
                                        }
                                        else {
                                            section_item += "<td>";
                                            section_item += "<input id='" + col.controlid + "-" + row.id + "' class='form-control' type='text' />";
                                            section_item += "</td>";
                                        }
                                    }
                                });
                                section_item += "</tr>";
                            });
                            section_item += "</tbody></table>";
                            section_item += "</div>";
                            section_item += "</div>";
                        }
                        if (item_control.valuetype === "painscore") {
                            section_item += "<div class='col-lg-12 col-md-12 col-sm-12 pl-0'><div class= 'form-group'>";
                            section_item += "<h6 class='sub-heading'>" + item_control.name + "</h6>";
                            section_item += "<div class='col-lg-9 col-md-12 col-xs-12 pl-0'>";
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
                    });
                    section_item += "</div>";
                });
            }).done(function () {

                if (type === "OT1")
                    $("#dvPreOperativeChecklistTemplate").html(section_item);
                if (type === "OT2")
                    $("#dvSurgicalSafetyTemplate").html(section_item);
                if (type === "OT3")
                    $("#dvPreAnaestheticEvaluationTemplate").html(section_item);
                if (type === "OT4")
                    $("#dvAdditionalPreOPAssessmentTemplate").html(section_item);
                if (type === "OT5")
                    $("#dvImmediatePreOperativePreEvaluationTemplate").html(section_item);
                if (type === "OT6")
                    $("#dvAneasthesiaRecordTemplate").html(section_item);
                if (type === "OT7")
                    $("#dvSurgeonsNotesTemplate").html(section_item);
                if (type === "OT8")
                    $("#dvIntraOperativeNursingTemplate").html(section_item);
                if (type === "OT9")
                    $("#dvRecoveryRoomTemplate").html(section_item);
                if (type === "OT10")
                    $("#dvPostOpeativeInstructionsTemplate").html(section_item);
                if (type === "OT11")
                    $("#dvPostAnaesthesiaCaresTemplate").html(section_item);

                $(".selectpicker").selectpicker('refresh');
                $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
                fnProcessLoading(false);
                fnsideBarSetup();
            });
            resolve();
        });
    },

    setClinicalTemplate: function (result) {
        $.each(result, function (keys, item) {

            if (item.ValueType === "float" || item.ValueType === "text" || item.ValueType === "ltext"
                || item.ValueType === "textarea" || item.ValueType === "textarea_l"
                || item.ValueType === "textarea_xl" || item.ValueType === "textarea_xxl") {
                $('#' + item.OTControlID).val(item.Value);
            }
            if (item.ValueType === "combox") {
                $('#' + item.OTControlID).val(item.Value);
            }
            if (item.ValueType === "checkbox") {
                if (item.Value === "Y")
                    $('#' + item.OTControlID + '_y').prop('checked', true);
                if (item.Value === "N")
                    $('#' + item.OTControlID + '_n').prop('checked', true);
            }
            if (item.ValueType === "radio") {
                $('input:radio[name="' + item.OTControlID + '"][value=' + item.Value + ']').prop('checked', true).trigger("click");
            }
            if (item.ValueType === "datetime") {
                $('#' + item.OTControlID).val(item.Value);
            }
            if (item.ValueType === "table") {
                $('#' + item.OTControlID).val(item.Value);
            }
        });

        $(".selectpicker").selectpicker('refresh');
        $('.decimalNumber').inputmask("decimal", { digits: 2, allowMinus: true });
    },

    getClinicalTemplate: function () {

        return new Promise(function (resolve) {
            var l_OT = [];

            $.getJSON(getBaseURL() + "/json/eSyaNursingStation/operativeanaesthesiacare.json", function (data) {
                var i = 0;
                //var d = data.filter(element => element.cltype === type);
                $.each(data, function (key, item_nav) {
                    var type = item_nav.cltype;
                    $.each(item_nav.item, function (keys, item_control) {

                        if (item_control.valuetype === "float") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "text") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "ltext") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea_l") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea_xl") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "textarea_xxl") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "checkbox") {
                            var rd_value = $("input[type='radio'][name='" + item_control.controlid + "']:checked").val();
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: rd_value
                            });
                        }
                        if (item_control.valuetype === "combox") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "datetime") {
                            l_OT.push({
                                OTType: type,
                                OTControlID: item_control.controlid,
                                ValueType: item_control.valuetype,
                                Value: $('#' + item_control.controlid).val()
                            });
                        }
                        if (item_control.valuetype === "table") {
                            $.each(item_control.table.row, function (keys, row) {
                                $.each(item_control.table.column, function (keys, col) {
                                    l_OT.push({
                                        OTType: type,
                                        OTControlID: col.controlid + "-" + row.id,
                                        ValueType: item_control.valuetype,
                                        Value: $('#' + col.controlid + "-" + row.id).val()
                                    });
                                });
                            });
                        }
                    });
                });
            });

            resolve(l_OT);
        });
    },

    onChange_ClinicalValue: function (ev) {
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

};

function fnSaveOperativeAnaesthesicCare() {
    fnProcessLoading(true, "saving");
    $("#btnSaveOperativeAnaesthesicCare").attr('disabled', true);

    var l_OT = [];

    $.when(Utils_ClinicalCharts.getClinicalTemplate()).then(function (l_OT) {
        var ns = {
            TransactionID: $('#hdTransactionID').val(),
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            l_OT_ControlValue: l_OT,
            ActiveStatus: true,
            UserID: 0
        };

        saveClinicalInformationData(ns, function (result) {
            fnProcessLoading(false);
            $("#btnSaveOperativeAnaesthesicCare").attr('disabled', false);

        });

    });

}


function getClinicalInformationByID(transactionID, callback) {
    $.get(getBaseURL() + '/OperativeAnaesthesiaCare/GetOperativeAnaesthesiaInformationValueByTransaction',
        {
            UHID: $('#hdUHID').val(),
            IPNumber: $('#hdIPNumber').val(),
            transactionID: transactionID
        }, function (data, status) {
            callback(data);
        });
}

function saveClinicalInformationData(l_data, callback) {

    var url = getBaseURL() + '/OperativeAnaesthesiaCare/InsertIntoOperativeAnaesthesiaInformation';

    $.ajax({
        url: url,
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: l_data,
        async: true,
        success: function (response) {
            if (response.Status) {
                toastr.success("Saved!");
                callback(true);
            }
            else {
                toastr.error(response.Message);
                callback(false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            callback(false);
        }
    });
}


// UI
var scrollLink = $(".nav-link");
$(".sidebar-sticky .nav-link").click(function () {
    $(".nav-link.active").removeClass("active");
    $(this).addClass("active");
});

$(document).ready(function () {
    $(".nav-link.active").removeClass("active");
    $(".sidebar-sticky .nav-link").first().addClass('active');
    $('#mainContent').offset().top = 0;
    setTimeout(function () { fnsideBarSetup() }, 1000);
});

$(window).on('resize', function () {
    fnsideBarSetup();
    
});
$('.main-heading').click(function () {

    if ($('.sidebar').hasClass('hide')) {
        var sidebarW = $('.sidebar').width();
        $('.sidebar').toggleClass('hide');
        $('#mainContent').removeClass('moveLeft').css('width', 'calc(100% - ' + sidebarW + 'px)');
     }
    else {
        $('.sidebar').addClass('hide');
        $('#mainContent').css('width', '100%').addClass('moveLeft');
    }
});
function fnRefreshGridWidth() {

    $("#jqgDrugCharts").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $("#jqgVitalCharts").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $("#jqgDoctorNotes").jqGrid('setGridWidth', parseInt(($('#mainContent').width()))).trigger('reloadGrid');
    $('div[id^="gbox"],.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-btable,.ui-jqgrid-view,.ui-jqgrid-pager').css('max-width', '100%');
}
function fnsideBarSetup() {
    var docWidth = $(document).width();
    var marginLeft = $("#navbar-operativeAnaesthesia").outerWidth(true);
    var winH = $(window).outerHeight(true);
    var divHeight = Math.floor($(".divFixedBar").outerHeight(true) + $("section.header").outerHeight(true) + $("div.header").outerHeight(true)) - 1;
    var maxH = ($(window).outerHeight(true) - ($("section.header").outerHeight(true) + $(".banner").outerHeight(true) + $(".divFixedBar").outerHeight(true)))
    const headerH = $('section.header').outerHeight(true);
    const headerBannerH = headerH + $('.banner').outerHeight(true);
    const headerBannerFixedBarH = headerBannerH + $('.divFixedBar').outerHeight(true);
    const tabContentH = headerBannerFixedBarH + $('.main-heading').height();

    $("#mainContent").css({
        "top": divHeight,
        'max-height': winH - tabContentH - 24,
        'margin-left': marginLeft,
        'overflow-y': 'auto',
        'width': '100%'
    });

    $(".sidebar").css({
        'top': divHeight, 'display': 'block',
        'overflow-y': 'auto',
        'max-height': maxH
    });
    $("#navbar-operativeAnaesthesia").on('click', 'a', function () {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        $('.tab-pane').removeClass('show active');
        var v = $(this).attr('data-bs-target');
        $(v).addClass('show active');
        
        if (!$('.sidebar').hasClass('hide')) {
            var sidebarW = $('.sidebar').width();
            $('#mainContent').removeClass('moveLeft').css('width', 'calc(100% - ' + sidebarW + 'px)');
        }
        else {
            $('#mainContent').css('width', '100%');
        }
        $("#mainContent").scrollTop(0);
     });
    fnRefreshGridWidth();
}


function fnratingsActive(id) {

    $(".ratings label.active").removeClass('active');
    $('#lbl' + id).addClass('active');
    _painscore_id = id;
}

