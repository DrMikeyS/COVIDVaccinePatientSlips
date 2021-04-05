function generateFullClinicList() {
    var fullhtml = '<div class="full-clinic-list">';
    bookingText = ``;
    bookingQR = ``;

    csvResult.forEach(function (patient, index) {
        if (!patient[keys['name']]) {
            return;
        }

        if (csvResult[0].bookingNumber !== undefined) {
            bookingQR = `<div class="col-3">Bookeing ref:<div class="qr-code" id="booking-qr-` + index + `"></div></div>`;
        }
        age = getAge(patient[keys['dob']]);
        ageHTML = ""
        if (age < 18) {
            ageHTML = '<strong> Under 18</strong>'
        }
        html = `<div class="row">
        <div class="col-4">` + patient[keys['name']] + ageHTML + `</div>
        <div class="col-3 text-right">DOB: ` + formatDate(patient[keys['dob']]) + `</div><div class="col-1"><div class="qr-code" id="dob-qr-` + index + `"></div></div>
        <div class="col-3 text-right">NHS: ` + patient[keys['nhsno']] + `</div><div class="col-1"><div class="qr-code" id="nhs-qr-` + index + `"></div></div>
          ` + bookingQR + `
          </div>`;
        fullhtml = fullhtml + html;
    });
    fullhtml = fullhtml + '</div>';
    return fullhtml;
}