$("#get-started").click(function () {
    $("#page-1").hide();
    $("#page-2").fadeIn();
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
    $("#page-4").fadeIn();
});

$("#sort-alphabetical").click(function () {
    $("#page-3").hide();
    sortAlphabetically = true;
    $("#page-4").fadeIn();
});

$("#outcomes4health").click(function () {
    $("#page-4").hide();
    pocSystem = 'outcomes4health';
    $("#page-5").fadeIn();
});

$("#evacc").click(function () {
    $("#page-4").hide();
    pocSystem = 'evacc';
    $("#page-5").fadeIn();
});