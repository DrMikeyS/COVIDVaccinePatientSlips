$("#filenamea").change(function (e) {
    loadFile(e, "a")
});


//GLOBALS
var batchNumber, vaccineType,
    keys, type = "",
    sessionDate, formStyle, sortAlphabetically, csvVaccineDose;

function loadFile(e, form_version) {


    var ext = $("input#filename" + form_version).val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["csv"]) == -1) {
        generateAlert('Error: The file type is not CSV.', '#page-4' + form_version)
        return false;
    }
    if (e.target.files != undefined) {
        $("#input-modal").css('display', 'none');
        var reader = new FileReader();
        reader.onload = function (e) {
            csvResult = e.target.result;
            csvResult = $.csv.toObjects(csvResult);
            keys = identifyCSVKeys(csvResult);
            batchNumber = $("#batch-number").val();
            vaccineType = $("select#vaccine-type option:checked").val();

            if (sortAlphabetically) {
                csvResult = sortAlphabetical(csvResult);
            }
            if (formStyle == 'full-page') {
                var fullhtml = genFormHTML();
            } else if (formStyle == 'sticker') {
                var fullhtml = genPatientStickersHTML();
            } else {
                if (csvResult[0].bookingNumber !== undefined) {
                    type = "incBookingNumber"; //include booking number
                }
                var fullhtml = genPatientSlipSegmentHTML();
            }
            $("#patient-list").append(fullhtml);

            genQRCodes();
            window.print();
        };
        reader.readAsText(e.target.files.item(0));
    }
    return false;
};