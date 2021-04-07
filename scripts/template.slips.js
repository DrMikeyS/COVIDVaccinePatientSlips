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
          <td colspan=2 class="text-center"><div class="qr-code" id="ptid-qr-` + index + `"></div></td>
          ` + bookingQR + `
          </tr>
		  ` + firstdoselabels + firstdosedetails + `
          </table>
          </div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}