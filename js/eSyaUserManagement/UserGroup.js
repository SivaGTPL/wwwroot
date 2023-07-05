

$("#saveMUG").prop('disabled', true);

$(document).ready(function () {
    fnLoadUGTreeview();
});
function fnLoadUGTreeview() {

    $.ajax({
        url: getBaseURL() + '/UserManagement/GetConfigureMenulist',
        type: 'POST',
        datatype: 'json',
        success: function (result) {

            fnGetConfigureMenu_Success(result);
        },
        error: function (error) {
            toastr.error(error.status);
        }
    });
}

function fnGetConfigureMenu_Success(dataArray) {
    $('#treeUG').jstree('destroy');
    $("#treeUG").jstree({

        "checkbox": {
            "keep_selected_style": false
        },
        "plugins": ["checkbox"],
        core: {
            'data': dataArray, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false,
            themes: {
                icons: false
            }
        }
    });
   
    fnTreeSize();
}

function fnTreeSize() {
    $("#treeUG").css({
        'height': $(window).innerHeight() - 208,
        'overflow': 'auto'
    });
    $(window).on("resize", function () {
        $("#treeUG").css({
            'height': $(window).innerHeight() - 208,
            'overflow': 'auto'
        });
    })

}

function fnResetUserType() {
    $("#cboUserType").val('0').selectpicker('refresh');
    $('#treeUG').jstree().uncheck_all();
    fnLoadUGTreeview();
    $("#saveMUG").prop('disabled', true);
}

$("#cboUserType").on('change', function () {

    if ($(this)[0].selectedIndex != 0) {
        $("#saveMUG").prop('disabled', false);
        $("#treeUG").jstree().uncheck_all();
        var uG = $("#cboUsergroup").val();
        var uT = $("#cboUserType").val();
        $.ajax({
            url: getBaseURL() + '/UserManagement/GetMenuKeysbyUserGroupAndUserType?uG=' + uG + "&uT=" + uT,
            type: 'POST',
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#treeUG").jstree('open_all');

                var idList = [];
                var jsonNodes = $('#treeUG').jstree(true).get_json('#', { flat: true });
                $.each(jsonNodes, function (i, val) {

                    idList.push($(val).attr('id'));
                });

                idList = idList.filter(option => option.startsWith('FM'));

                for (var i = 0; i < result.length; i++) {

                    $.each(idList, function (index, v) {

                        if (!IsStringNullorEmpty(v)) {

                            if (v.substring(v.indexOf('_') + 1).replace(/\s+/g, "") === result[i].toString().replace(/\s+/g, "")) {

                            $("#treeUG").jstree().check_node($('#' + v).attr('id'));

                            }

                        }
                    });

                }
                if (_userFormRole.IsInsert === true) {
                    $("#saveMUG").prop('disabled', false);
                }
                else {
                    $("#saveMUG").prop('disabled', true);
                }
                fnTreeSize();
            },
            error: function (error) { alert(error.status) }
        });
    }
    else {
        $("#treeUG").jstree().uncheck_all();
        fnLoadUGTreeview();
        $("#saveMUG").prop('disabled', true);
    }

});

function fnsaveUserGroup() {
    var UGArray = [];

    var allnode_ids = [];

    var allnodes = $('#treeUG').jstree(true).get_json('#', { flat: true });


    $.each(allnodes, function (i, va) {

        allnode_ids.push($(va).attr('id'));
    });

    allnode_ids = allnode_ids.filter(option => option.startsWith('FM'));


    var checkednode_ids = [];

    var checkednodes = $("#treeUG").jstree("get_selected", true);

    $.each(checkednodes, function (i, vl) {

        checkednode_ids.push($(vl).attr('id'));
    });
    checkednode_ids = checkednode_ids.filter(option => option.startsWith('FM'));

    var unchk_menukeys = [];

    $.each(allnode_ids, function (index, m) {

        if (!IsStringNullorEmpty(m)) {

            unchk_menukeys.push(m.substring(m.indexOf('_') + 1).replace(/\s+/g, ""));
        }
    });


    var chk_menukeys = [];

    $.each(checkednode_ids, function (index, mkey) {

        if (!IsStringNullorEmpty(mkey)) {

            chk_menukeys.push(mkey.substring(mkey.indexOf('_') + 1).replace(/\s+/g, ""));
        }
    });


    for (var i = unchk_menukeys.length - 1; i >= 0; i--) {
        for (var j = 0; j < chk_menukeys.length; j++) {
            if (unchk_menukeys[i] && (unchk_menukeys[i] === chk_menukeys[j])) {
                unchk_menukeys.splice(i, 1);
            }
        }
    }
    //adding -0- to unchecked nodes
    var unchecked_nodes = [];

    $.each(unchk_menukeys, function (i, vm) {

        unchecked_nodes.push("0" + (vm));
    });
    var result_nodes = unchecked_nodes.concat(chk_menukeys);
   
  
    $.each(result_nodes, function (index, rval) {
     UGArray.push(rval);
    });

    var selArray = [];
    for (var i = 0; i <= UGArray.length; i++) {
        if (/^\d*$/.test(UGArray[i]) === true) {
            selArray.push(UGArray[i]);
        }
    }
    if ($("#cboUsergroup").val() == "0") {
        toastr.warning("Please select User Group");
        return;
    }
    if ($("#cboUserType").val() == "0") {
        toastr.warning("Please select User Type");
        return;
    }
    var selectedkeys = {
        uG: $("#cboUsergroup").val(),
        uT: $("#cboUserType").val(),
        dataList: selArray
    };

    $("#saveMUG").prop('disabled', true);
    $.ajax({
        url: getBaseURL() + '/UserManagement/InsertMenukeysIntoUserGroup',
        type: 'POST',
        datatype: 'json',
        data: { selectedkeys },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#saveMUG").prop('disabled', false);
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#saveMUG").prop('disabled', false);
                return false;
            }
            $("#cboUserType").trigger('change');
            $("#saveMUG").prop('disabled', false);
        },
       
    });
}