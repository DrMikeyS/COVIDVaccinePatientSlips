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
            </table>
            Vaccine Type: <strong>` + vaccineType + `</strong>
            ` +
            doseHTML + generateAgeAlertsHTML(patient) +
            `
          </div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

function generateFirstDoseHTML(sessiondate, sessiontime, batchNumber) {
    tableheadHTML = `<table class="dose-details">
    <tr><td colspan="2"><i>Dose Details</i></td></tr> `;
    tablefootHTML = `</table>`;

    if (batchNumber) {
        batchHTML = `<td>Batch: ` + batchNumber + `</td>`;
        batchOnRecordHTML = '';
    } else {
        batchOnRecordHTML = `<small class="batchOnRecord text-center">The batch details are stored in your medical record.</small>`;
        batchHTML = '';
    }
    firstDoseHTML = `<tr><td><strong>First</strong>:` + sessiondate + ` ` + sessiontime + `</td>` +
        batchHTML + '</tr>';

    return tableheadHTML + firstDoseHTML + tablefootHTML + batchOnRecordHTML;
}

function generateSecondDoseHTML(sessiondate, sessiontime, batchNumber) {
    tableheadHTML = `<table class="dose-details">
    <tr><td colspan="2"><i>Dose Details</i></td></tr> `;
    tablefootHTML = `</table>`;

    if (batchNumber) {
        batchHTML = `<td>Batch: ` + batchNumber + `</td>`;
        batchOnRecordHTML = '';
    } else {
        batchOnRecordHTML = `<small class="batchOnRecord text-center">The batch details are stored in your medical record.</small>`;
        batchHTML = '';
    }

    secondDoseHTML = `<tr><td><strong>Second</strong>:` + sessiondate + ` ` + sessiontime + `</td>` +
        batchHTML + '</tr>';

    return tableheadHTML + secondDoseHTML + tablefootHTML + batchOnRecordHTML;
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