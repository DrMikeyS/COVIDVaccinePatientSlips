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
        if (i == 17) {
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
        csvVaccineDose = false;
        if (patient.VaccineDose !== undefined) {
            csvVaccineDose = patient.VaccineDose;
        }

        if (doseNumber == 1) {
            //Default dose detection
            if (csvVaccineDose == "First") {
                //First Dose
                doseHTML = generateFirstDoseHTML(sessiondate, sessiontime, batchNumber);
            } else if (csvVaccineDose == "Second") {
                //Second dose only
                doseHTML = generateSecondDoseHTML(sessiondate, sessiontime, batchNumber);
            } else {
                //No vaccine dose in CSV file, revert to unspecified
                doseHTML = generateUnspecifiedDoseHTML(sessiondate, sessiontime, batchNumber);
            }

        } else if (doseNumber == 2) {
            //Second dose only
            if (firstDoseInformationExists(patient)) {
                //First dose infomation in CSV - prepopulate first dose section
                doseHTML = generateSecondDoseHTML(sessiondate, sessiontime, batchNumber, patient[keys['firstdose_date']], patient[keys['firstdose_batch']]);
            } else {
                //No first dose infomation
                doseHTML = generateSecondDoseHTML(sessiondate, sessiontime, batchNumber);
            }
        } else if (doseNumber == 4) {
            //Hybrid dose    

            // check is first vaccine columns exist in the file
            if (firstDoseInformationExists(patient)) {
                doseHTML = generateSecondDoseHTML(sessiondate, sessiontime, batchNumber, patient[keys['firstdose_date']], patient[keys['firstdose_batch']]);
            } else { // if no first batch then use the current batch
                doseHTML = generateFirstDoseHTML(sessiondate, sessiontime, batchNumber);
            }
        }

        html = start + `<div class="col-sm-4">
            <p class="patientName">` + capitaliseName(patient[keys['name']]) + `</p>
            <table>
                <tr>
                    <td>
                        DOB: <strong>` + formatDate(patient[keys['dob']]) + `</strong><br>
                        NHS: <strong>` + patient[keys['nhsno']] + `</strong><br>
                    </td>
                    <td class="text-center">
                        <div class="qr-code" id="ptid-qr-` + index + `"></div>
                    <td>
                </tr>
                <tr><td>Vaccine: ` + vaccineType + `</td></tr>
            </table>
            <table class="dose-details">
                <tr><td colspan="2"><i>Dose Details</i></td></tr>
                ` + doseHTML + `
            </table>
            ` +
            generateAgeAlertsHTML(patient) +
            `
          </div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

function generateFirstDoseHTML(sessiondate, sessiontime, batchNumber) {
    return `
            
            <tr>
                <td><strong>First</strong>: ` + sessiondate + ` ` + sessiontime + `</td>
                <td>Batch: ` + batchNumber + `</td>
            </tr>
            <tr>
                <td>Second: </td>
                <td>Batch: </td>
            </tr>`;
}

function generateSecondDoseHTML(sessiondate, sessiontime, batchNumber, firstDoseDate = false, firstDoseBatch = false) {
    secondDoseHTML = sessiondate + ` ` + sessiontime + `</td>
        <td>Batch: ` + batchNumber + `</td>
    </tr>`;

    if (firstDoseDate) {
        fullHTML = `
        <tr>
            <td>First: ` + firstDoseDate + `</td>
            <td>Batch: ` + firstDoseBatch + `</td>
        </tr>
        <tr>
            <td>Second: `;
    } else {
        firstDoseHTML = `
            <tr>
                <td><strong>Second</strong>: `
    }

    return firstDoseHTML + secondDoseHTML;
}

function generateUnspecifiedDoseHTML(sessiondate, sessiontime, batchNumber) {
    return `
            <tr>
                <td>Date: ` + sessiondate + ` ` + sessiontime + `</td>
                <td>Batch: ` + batchNumber + `</td>
            </tr>
            <tr class="text-center">
                <td colspan="2">First Dose | Second Dose<br>
                <small>Circle as applicable</small></td>
            </tr>`;
}