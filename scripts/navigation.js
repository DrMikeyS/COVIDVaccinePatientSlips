$("#get-started").click(function () {
    $("#page-1").hide();
    $("#page-2").fadeIn();
});

$("#small-qr").click(function () {
    $("#page-2").hide();
    $("#page-3").fadeIn();
    formStyle = 'small-qr'
});

$("#full-page").click(function () {
    $("#page-2").hide();
    $("#page-2a").fadeIn();
    formStyle = 'full-page'
});

$("#sticker").click(function () {
    $("#page-2").hide();
    $("#page-2a").fadeIn();
    formStyle = 'sticker'
});

$("#second-dose-labels").click(function () {
    $("#page-2").hide();
    $("#page-2b").fadeIn();
    formStyle = 'second-dose-labels'
});

$("#continue-2b").click(function () {
    batchNumber = $("#batch-number-2b").val();
    sessionDate = $("#session-date").val();
    $("#input-modal").hide();
    $("#page-2b").hide();
    $("#patient-list").append(generateSecondDoseLabels());
});

$("#continue").click(function () {
    $("#page-2a").hide();
    $("#page-3").fadeIn();
});

$("#no-sort").click(function () {
    $("#page-3").hide();
    sortAlphabetically = false;
    if (formStyle == 'small-qr' || $('#hybrid').is(':checked')) {
        $("#page-4b").fadeIn();
    } else {
        $("#page-4a").fadeIn();
    }
});

$("#sort-alphabetical").click(function () {
    $("#page-3").hide();
    sortAlphabetically = true;
    if (formStyle == 'small-qr' || $('#hybrid').is(':checked')) {
        $("#page-4b").fadeIn();
    } else {
        $("#page-4a").fadeIn();
    }
});