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
                line3 = `<span class="semi-bold-highlight">Second Dose: </span>` + sessiondate + ` at <span class="semi-bold"> ` + sessiontime + `</span>`;
                line4 = `<td class="semi-bold">  &nbsp; &nbsp; Batch: ` + batchNumber + `</td>`
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