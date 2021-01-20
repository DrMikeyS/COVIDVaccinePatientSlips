//Warn user if using IE
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
if (isIE11) {
    alert('This system does not work with Internet Explorer. Please use Google Chrome or Firefox.')
}


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
    //Seperate out month and year
    var month = splitDate[1];
    var year = splitDate[2];
    if(year.length==2){
    	year = '19'+year;
    }
    //Convert text month to int
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(month)) {
        month = getMonthFromString(month)
    }
    month = month - 1 //Javascript months are 0-11
    var fomattedDate = new Date()
    fomattedDate.setFullYear(year)
    fomattedDate.setDate(splitDate[0])
    fomattedDate.setMonth(month)
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
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
            return -1;
        }
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
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
    keys.forEach(function (key) {
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

function genPatientSlipSegmentHTML(csvResult, keys) {
    var i = 0;
    var fullhtml = '';
    csvResult.forEach(function (patient, index) {
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

function genQRCodes(csvResult, keys) {
    csvResult.forEach(function (patient, index) {
        $('#dob-qr-' + index).qrcode({
            text: formatDate(patient[keys['dob']])
        });
        $('#nhs-qr-' + index).qrcode({
            text: patient[keys['nhsno']]
        });
    });
}

function genFormHTML(csvResult, keys) {
    var fullhtml = '';
    csvResult.forEach(function (patient, index) {
        html = genFullPageHTML(patient, index, keys);
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}


function genFullPageHTML(patient, index, keys) {
    return `<div class="vaccine-form"><h1>Vaccine Record Form</h1>
<table class="table table-bordered">
    <tr>
        <td>Name</td>
        <td>` + patient.Name + `</td>
        <td>Address</td>
        <td>` + patient[keys['address']] + `</td>
    </tr>
    <tr>
        <td>NHS No.</td>
        <td>` + patient[keys['nhsno']] + `</td>
        <td>DOB</td>
        <td>` + formatDate(patient[keys['dob']]) + `</td>
    </tr>
    <tr>
        <td></td>
        <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>
        <td></td>
        <td><div class="qr-code" id="dob-qr-` + index + `"></div></td>
    </tr>
    <tr>
        <td>Sex</td>
        <td></td>
        <td>GP Practice</td>
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
        <td>1. Are you currently unwell with fever?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>2. Have you ever had any serious allergic reaction?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>3. Have you ever been prescribed an adrenaline autoinjector such as EpiPen?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>4. Are you or have you been in a trial of a potential coronavirus vaccine?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>5. Are you, or could you be pregnant, breastfeeding or planning to become pregnant in the next three months?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>6. Are you taking anticoagulant medication, or do you have a bleeding disorder?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>7. Have you had any vaccinations in the last seven days?</td>
        <td></td>
        <td></td>
    </tr>

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
            <th colspan="2">Vaccination Details</th>
        </tr>
        <tr>
            <td>Date of Vaccination</td>
            <td>` + patient.SessionDate + `</td>

        </tr>
        <tr>
            <td>Time of Vaccination (24hr)</td>
            <td>
            </td>
        </tr>
        <tr>
            <td>Batch Number
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Administration Site
            </td>
            <td>               Left    |    Right   |      Deltoid   |      Thigh</td>
        </tr>
        <tr>
            <td>Any Adverse Effects (blank for none) or other comments
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Vaccinator Name
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Vaccine not given (reason)
            </td>
            <td>Unwell | Contraindicated | Did not consent</td>
        </tr>
    </table>
    </div>
    <div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
}
