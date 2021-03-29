function genPatientStickersHTML() {
    var i = 0;
    var fullhtml = '';

    csvResult.forEach(function (patient, index) {
        if (!patient[keys['name']]) {
            return;
        }
        if (i == 0) {
            start = `<div class="row stickers">`;
        } else {
            start = '';
        }
        if (i == 14) {
            end = `</div><div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
            i = 0;
        } else {
            end = '';
            i++;
        }
        sessiondate = '';
        if (patient.SessionDate !== undefined) {
            sessiondate = patient.SessionDate;
        }
        sessiontime = '';
        if (patient.StartTime !== undefined) {
            sessiontime = patient.StartTime;
        }
        age = getAge(patient[keys['dob']]);
        ageHTML = ""
        if (age < 18) {
            ageHTML = '<p class="under-18">This patient is under 18</p>'
        }
        if (doseNumber == 1) {
            doseHTML = `
            <span class="semi-bold">First Dose</span>:  ` + sessiondate + ` ` + sessiontime + ` 
            <br>Batch: ` + batchNumber + `
            <table class="second-dose">
                <tr>
                    <td colspan="2" class="semi-bold">Second Dose </td>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td>Batch:</td>
                </tr>
            </table>`
        } else if (doseNumber == 2) {
            if (firstDoseInformationExists(patient)) {
                //First dose infomation in CSV - prepopulate first dose section
                doseHTML = `
				<table class="second-dose">
					<tr>
						<td colspan="2" class="semi-bold">` + ["First Dose", patient[keys['firstdose_type']]].filter(Boolean).join(" - ") + ` </td>
					</tr>
					<tr>
						<td>Date: ` + patient[keys['firstdose_date']] + `</td>
						<td>Batch: ` + patient[keys['firstdose_batch']] + `</td>
					</tr>
				</table>
				<span class="semi-bold">Second Dose</span>:  ` + sessiondate + ` ` + sessiontime + ` 
				<br>Batch: ` + batchNumber + `
				`
            } else {
                //No first dose infomation - print blank first dose section
                doseHTML = `
				<table class="second-dose">
					<tr>
						<td colspan="2" class="semi-bold">First Dose </td>
					</tr>
					<tr>
						<td>Date:</td>
						<td>Batch:</td>
					</tr>
				</table>
				<span class="semi-bold">Second Dose</span>:  ` + sessiondate + ` ` + sessiontime + ` 
				<br>Batch: ` + batchNumber + `
				`
            }
        } else if (doseNumber == 4) {
            //Hybrid dose    

            // check is first vaccine columns exist in the file
            if (firstDoseInformationExists(patient)) {
                line1 = ``
                line2 = `<td> &nbsp; &nbsp; Date: ` + patient[keys['firstdose_date']] +
                    `</td><td> Batch: ` + [patient[keys['firstdose_type']], patient[keys['firstdose_batch']]].filter(Boolean).join(" - ") + `</td>`;
                line3 = `<span class="semi-bold">Second Dose: </span>` + sessiondate + ` at <span class="semi-bold"> ` + sessiontime + `</span>`;
                line4 = `<td>  &nbsp; &nbsp; Batch: ` + batchNumber + `</td>`
            } else { // if no first batch then use the current batch
                line1 = sessiondate + ` at <span class="semi-bold">` + sessiontime + `</span>`;
                line2 = `<td> &nbsp; &nbsp;  Batch: ` + batchNumber + `</td>`;
                line3 = `<span class="semi-bold">Second Dose:</span>`;
                line4 = `<td> &nbsp; &nbsp; Date:</td><td> Batch: </td>`
            }
            doseHTML = `
            <table class="second-dose">
                <tr>
                    <td colspan="2"><span class="semi-bold">First Dose:</span> ` + line1 + `</td>
                </tr>
                <tr>` + line2 + ` </tr>
            </table>
            
            <table class="second-dose">
                <tr>
                    <td colspan="2">` + line3 + `</td>
                </tr>
                <tr>` + line4 + ` </tr>
            </table>`

        } else {
            //Undefined dose
            doseHTML = `
            <span class="semi-bold">Dose Given</span>:  ` + sessiondate + ` ` + sessiontime + ` 
            <br>Batch: ` + batchNumber + `
            <table class="text-left">
                <tr>
                <td><strong>Dose:</strong></td>
                    <td>First</td>
                    <td>Second</td>
                </tr>
            </table>
            `
        }

        if (singleQRMode) {
            qrHTML = `<td>DOB:` + formatDate(patient[keys['dob']]) + ` <br>
          NHS No:` + patient[keys['nhsno']] + `</td>
          <td ><div class="qr-code" id="ptid-qr-` + index + `"></div></td>`
        } else {
            qrHTML = `<td>DOB:` + formatDate(patient[keys['dob']]) + `</td>
          <td>NHS No:` + patient[keys['nhsno']] + `</td>
          </tr>
          <tr>
          <td><div class="qr-code" id="dob-qr-` + index + `"></div></td>
          <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>`
        }


        html = start + `<div class="col-sm-4">
          <p class="patientName">` + patient[keys['name']] + `</p>` +
            ageHTML +
            `Vaccine Type: <strong>` + vaccineType + `</strong><br>` +
            doseHTML +
            `<table class="sticker-qrs">
          <tr>
            ` + qrHTML + `
          </tr>
          </table>
          <div class="qr-code single-qr" id="single-qr-` + index + `"></div>
          </div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}


function genPatientSlipSegmentHTML() {
    var i = 0;
    var fullhtml = '';
    bookingText = ``;
    bookingQR = ``;

    csvResult.forEach(function (patient, index) {
        if (!patient[keys['name']]) {
            return;
        }
        if (i == 0) {
            start = `<div class="row">`;
        } else {
            start = '';
        }
        if (i == 7) {
            end = `</div><div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
            i = 0;
        } else {
            end = '';
            i++;
        }
        sessiondate = '';
        if (patient.SessionDate !== undefined) {
            sessiondate = patient.SessionDate;
        }
        sessiontime = '';
        if (patient.StartTime !== undefined) {
            sessiontime = patient.StartTime;
        }
        if (csvResult[0].bookingNumber !== undefined) {
            bookingText = `<td>BookingNo: ` + patient.bookingNumber + `</td>`;
            bookingQR = `<td><div class="qr-code" id="booking-qr-` + index + `"></div></td>`;
        }
        age = getAge(patient[keys['dob']]);
        ageHTML = "";
        if (age < 18) {
            ageHTML = '<h2 class="under-18">This patient is under 18</h2>'
        }
        firstdoselabels = "";
        firstdosedetails = "";
        if (firstDoseInformationExists(patient)) {
            //First dose details in CSV

            //Start table rows
            firstdoselabels = '<tr class="table_left"><td>';
            firstdosedetails = '<tr class="table_left"><td>';

            if (firstDoseBatchDetailsExist(patient)) {
                //If first dose type or batch exists then add to first column	
                firstdoselabels = firstdoselabels + 'First Dose:';
                firstdosedetails = firstdosedetails + [patient[keys['firstdose_type']], patient[keys['firstdose_batch']]].filter(Boolean).join(" - ");
            }

            if (firstDoseDateExists(patient)) {
                //If first date exists then add to next avalible column
                if (firstDoseBatchDetailsExist(patient)) {
                    //Type or batch exists - close first column and start second
                    firstdoselabels = firstdoselabels + '</td><td>First Dose Date:</td></tr>';
                    firstdosedetails = firstdosedetails + '</td><td>' + patient[keys['firstdose_date']] + '</td></tr>';
                } else {
                    //No type or batch - date in first column and blank second column
                    firstdoselabels = firstdoselabels + 'First Dose Date:</td><td></td></tr>';
                    firstdosedetails = firstdosedetails + patient[keys['firstdose_date']] + '</td><td></td></tr>';
                }
            } else {
                //No date - blank second column
                firstdoselabels = firstdoselabels + '</td><td></td></tr>';
                firstdosedetails = firstdosedetails + '</td><td></td></tr>';
            }
        }
        html = start + `<div class="col-print-6">
          <h1>` + patient[keys['name']] + `</h1>` +
            ageHTML +
            `<table>
		  <tr class="table_left">
          <td>Session Date: ` + sessiondate + `</td>
          <td>Session Time: ` + sessiontime + `</td>
          
          <tr>
          <td>DOB: ` + formatDate(patient[keys['dob']]) + `</td>
          <td>NHS: ` + patient[keys['nhsno']] + `</td>
          ` + bookingText + `
          </tr>
          <tr>
          <td><div class="qr-code" id="dob-qr-` + index + `"></div></td>
          <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>
          ` + bookingQR + `
          </tr>
		  ` + firstdoselabels + firstdosedetails + `
          </table>
          <div class="qr-code single-qr" id="single-qr-` + index + `"></div>
          </div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}


//Form
function genFormHTML() {
    var fullhtml = '';
    csvResult.forEach(function (patient, index) {
        if (!patient[keys['name']]) {
            return;
        }
        html = genFullPageHTML(patient, index);
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

//FullPage
function genFullPageHTML(patient, index) {
    var address = '';
    if (patient[keys['address']] !== undefined) {
        address = patient[keys['address']];
    }
    var sessiondate = '';
    if (patient.SessionDate !== undefined) {
        sessiondate = patient.SessionDate;
    }
    var sessiontime = '';
    if (patient.StartTime !== undefined) {
        sessiontime = patient.StartTime;
    }
    var RegisteredPracticeName = '';
    if (patient.RegisteredPracticeName !== undefined) {
        RegisteredPracticeName = patient.RegisteredPracticeName;
    }
    age = getAge(patient[keys['dob']]);
    ageHTML = ""
    if (age < 18) {
        ageHTML = ' (Under 18)'
    }
    firstdoseHTML = ``;
    if (doseNumber == 1) {
        doseHTML = ` First`;
    } else if (doseNumber == 2) {
        if (firstDoseInformationExists(patient)) {
            doseHTML = ` Second`;
            firstdoseHTML = ` (First dose: ` + [patient[keys['firstdose_type']], patient[keys['firstdose_batch']], patient[keys['firstdose_date']]].filter(Boolean).join(" - ") + `)`;
        } else {
            doseHTML = ` Second`
        }
    } else if (doseNumber == 4) {
        if (firstDoseInformationExists(patient)) {
            doseHTML = ` Second`;
            firstdoseHTML = ` (First dose: ` + [patient[keys['firstdose_type']], patient[keys['firstdose_batch']], patient[keys['firstdose_date']]].filter(Boolean).join(" - ") + `)`;
        } else {
            doseHTML = ` First`;
        }
    } else {
        doseHTML = ` First    |    Second`;
    }


    return `<div class="vaccine-form"><h1>Vaccine Record Form</h1>
<table class="table table-bordered">
    <tr>
        <td>Name</td>
        <td>` + patient[keys['name']] + `</td>
        <td>Address</td>
        <td>` + address + `</td>
    </tr>
    <tr>
        
        <td>DOB</td>
        <td>` + formatDate(patient[keys['dob']]) + ageHTML + `</td>
        <td>NHS No.</td>
        <td>` + patient[keys['nhsno']] + `</td>
    </tr>
    <tr>
    <td></td>
        <td><div class="qr-code" id="dob-qr-` + index + `"></div>
        <div class="qr-code single-qr" id="single-qr-` + index + `"></div>
        </td>
        <td></td>
        <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>
        
    </tr>
    <tr>
        
        <td>GP Practice</td>
        <td>` + RegisteredPracticeName + `</td>
        <td></td>
        <td></td>
    </tr>
</table>


<table class="table table-bordered">
    <tr>
        <th>Screening Questions</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
    <tr>
        <td>1. Are you currently unwell with fever, symptoms of COVID-19 or a positive test in the last 28 days?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>2. Have you ever had any serious allergic reaction or do you carry an EpiPen?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>3. Have you already had a COVID vaccine (or are you in a trial)?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>4. Are you, or could you be pregnant, breastfeeding or planning to become pregnant in the next three months?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>5. Are you taking anticoagulant medication, or do you have a bleeding disorder?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>6. Have you had any vaccinations in the last seven days?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
    <td>7. Ethnicity and is patient a social or health worker or a care home resident?</td>
    <td></td>
    <td></td>
</tr>
    </table>

<table class="table table-bordered">
    <tr>
        <td>Screening Questions Completed by:</td>
        <td>Vaccinator (who is registered HCP) | Other HCP (please add name, signature and date below)</td>
        </tr><tr>
        <td colspan="2"><p></p></td>
    </tr>
</table>
    <table class="table table-bordered">
        <tr>
            <th colspan="2">Consent</th>
        </tr>
        <tr>
            <td>Consent given?</td>
            <td>Yes | No</td>
        </tr>
        <tr>
            <td>Consent Provided By:</td>
            <td>Patient | LPA for Health | Court Appointed Deputy | Clinician Best Interests Decision (MCA)</td>
        </tr>
        <tr>
            <td>Notes</td>
            <td></td>
        </tr>
    </table>


    <table class="table table-bordered">
        <tr>
            <th colspan="4">Vaccination Details</th>
        </tr>
        <tr>
        <td colspan="2">Dose Round</td>
        <td colspan="2">` + doseHTML + `</td>
        </tr>
        <tr>
            <td>Time of Vaccination (24hr)</td>
            <td>` + sessiontime + `</td>
            <td>Date of Vaccination</td>
            <td>` + sessiondate + `</td>
        </tr>
        <tr>
            <td colspan="2">Vaccine Brand and Batch Number</td>
            <td colspan="2">` + vaccineType + ` ` + batchNumber + firstdoseHTML + `</td>
        </tr>
        <tr>
            <td colspan="2">Administration Site</td>
            <td colspan="2">               Left    |    Right   |      Deltoid   |      Thigh</td>
        </tr>
        <tr>
            <td colspan="2">Any Adverse Effects (blank for none) or other comments</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td colspan="2">Vaccinator Name</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td colspan="2">Vaccine not given (reason)
            </td>
            <td colspan="2">Unwell | Contraindicated | Did not consent</td>
        </tr>
    </table>
    </div>
    <div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
}

//QR Generator
function genQRCodes() {
    csvResult.forEach(function (patient, index) {
        if (!patient[keys['dob']]) {
            return; //exit loop if no DOB
        }
        if (singleQRMode) {
            //Generate double QR style
            $('#ptid-qr-' + index).qrcode({
                text: formatDate(patient[keys['dob']]) + String.fromCharCode(09) + patient[keys['nhsno']] + String.fromCharCode(09)
            });
        } else {
            //generate two seperate qr codes
            $('#dob-qr-' + index).qrcode({
                text: formatDate(patient[keys['dob']])
            });
            $('#nhs-qr-' + index).qrcode({
                text: patient[keys['nhsno']]
            });
        }
        if (type == "incBookingNumber") {
            $('#booking-qr-' + index).qrcode({
                text: patient.bookingNumber
            });
        }


    });
}


function generateSecondDoseLabels() {
    html = `<div id="second-dose-labels"><div class="position-fixed" style="top: 0;left: 30%;">Print using "A4" paper size in Chrome</div>`;
    var i, j;
    for (i = 0; i < 27; i++) {
        html = html + `<div class="row tiny-stickers">`;
        for (j = 0; j < 7; j++) {
            html = html + `<div class="col"><strong>Second Dose</strong><br>Date: ` + sessionDate + ` <br>Batch: ` + batchNumber + `</div>`
        }
        html = html + `</div></div>`;
    }
    return html;
}


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
