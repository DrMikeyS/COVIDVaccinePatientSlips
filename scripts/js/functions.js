 //Format date into the pinnacle format
 function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

function formatDate(dateString) {
    if (dateString.includes('-')) {
        var splitDate = dateString.split('-');
    } else if (dateString.includes('.')) {
        var splitDate = dateString.split('.');
    } else if (dateString.includes('/')) {
        var splitDate = dateString.split('/');
    }
    //Seperate out month
    var month = splitDate[1];
    //Convert text month to int
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(month)) {
        month = getMonthFromString(month)
    }
    month = month - 1 //Javascript months are 0-11
    var fomattedDate = new Date()
    fomattedDate.setDate(splitDate[0])
    fomattedDate.setMonth(month)
    fomattedDate.setFullYear(splitDate[2])
    return fomattedDate.toLocaleDateString(
        'en-gb', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    ).replace(/ /g, '-')
}

//Sort list of patients alphabetically
function sortAlphabetical(objArray) {
    function compare(a, b) {
        if (a.Name < b.Name) {
            return -1;
        }
        if (a.Name > b.Name) {
            return 1;
        }
        return 0;
    }

    objArray.sort(compare);
    return objArray;
}

//Identify the column names
function identifyCSVKeys(CSVArray) {
    var keys = Object.keys(CSVArray[0]);
    var nhsno_key, dob_key, name_key;
    keys.forEach(function(key) {
        lkey = key.toLowerCase();
        if (lkey.includes('nhs')) {
            nhsno_key = key;
        }
        if (lkey.includes('dob')) {
            dob_key = key;
        } else if (lkey.includes('birth')) {
            dob_key = key;
        }
        if (lkey.includes('name')) {
            name_key = key;
        }
    });
    return {
        dob: dob_key,
        name: name_key,
        nhsno: nhsno_key
    };
}

function genPatientSlipSegmentHTML(csvResult,keys){
    var i = 0;
    var fullhtml = '';
    csvResult.forEach(function(patient, index) {
        if (i == 0) {
            start = `<div class="row">`;
        } else {
            start = '';
        }
        if (i == 3) {
            end = `</div><div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
            i = 0;
        } else {
            end = '';
            i++;
        }
        html = start + `<div class="col-print-6">
          <h1>` + patient.Name + `</h1>
          <p>Session Date: ` + patient.SessionDate + `</p>
            <p>Session Time: ` + patient.StartTime + `</p>
          <table>
          <tr>
          <td>DOB: ` + formatDate(patient[keys['dob']]) + `</td>
          <td>NHS: ` + patient[keys['nhsno']] + `</td>
          </tr>
          <tr>
          <td><div class="qr-code" id="dob-qr-` + index + `"></div></td>
          <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>
          </tr>
          </table></div>` + end;
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

function genQRCodes(csvResult,keys){
csvResult.forEach(function(patient, index) {
        $('#dob-qr-' + index).qrcode({
            text: formatDate(patient[keys['dob']])
        });
        $('#nhs-qr-' + index).qrcode({
            text: patient[keys['nhsno']]
        });
    });
}
