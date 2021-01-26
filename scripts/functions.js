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
    var nhsno_key, dob_key, name_key,address_key;
    keys.forEach(function (key) {
        lkey = key.toLowerCase();
        if (lkey.includes('nhs')) {
            nhsno_key = key;
        }
        if (lkey.includes('address')) {
            if(lkey.includes('organisation')){}else
            if(lkey.includes('organization')){}else
            if(lkey.includes('practice')){}else
            if(lkey.includes('pcn')){}else{
                address_key = key;
            }
        }
        if (lkey.includes('dob')) {
            dob_key = key;
        } else if (lkey.includes('birth')) {
            dob_key = key;
        }
        if (lkey.includes('name')) {
            //do not include if the column name has a "name" that is referencing something other than patient
            if(lkey.includes('organisation')){}else
            if(lkey.includes('organization')){}else
            if(lkey.includes('practice')){}else
            if(lkey.includes('pcn')){}else{
            name_key = key;
        }
        }
    });
    return {
        dob: dob_key,
        name: name_key,
        nhsno: nhsno_key,
        address: address_key
    };
}

function genPatientStickersHTML(csvResult, keys,batchNumber,vaccineType) {
    var i = 0;
    var fullhtml = '';
    
    csvResult.forEach(function (patient, index) {
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
            sessiondate=patient.SessionDate;
        }
        sessiontime = '';
        if (patient.StartTime !== undefined) {
            sessiontime=patient.StartTime;
        }
        html = start + `<div class="col-sm-4">
          <p class="patientName">` + patient[keys['name']] + `</p>
          Vaccine Type: <strong>`+vaccineType+`</strong><br>
          <span class="semi-bold">First Dose</span>:  ` + sessiondate + ` ` + sessiontime + ` <br>Batch: `+batchNumber+`
          <table class="second-dose">
          <tr>
          <td colspan="2" class="semi-bold">Second Dose </td>
            </tr>
            <tr>
            <td>Date:</td>
            <td>Batch:</td>
            </tr></table>
          <table class="sticker-qrs">
          <tr>
          <td>DOB:` + formatDate(patient[keys['dob']]) + `</td>
          <td>NHS No:` + patient[keys['nhsno']] + `</td>
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
        sessiondate = '';
        if (patient.SessionDate !== undefined) {
            sessiondate=patient.SessionDate;
        }
        sessiontime = '';
        if (patient.StartTime !== undefined) {
            sessiontime=patient.StartTime;
        }
        html = start + `<div class="col-print-6">
          <h1>` + patient[keys['name']] + `</h1>
          <p>Session Date: ` + sessiondate + `</p>
            <p>Session Time: ` + sessiontime + `</p>
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
    var address='';
    if (patient[keys['address']] !== undefined) {
        address=patient[keys['address']];
    }
    var sessiondate = '';
    if (patient.SessionDate !== undefined) {
        sessiondate=patient.SessionDate;
    }
    var sessiontime = '';
    if (patient.StartTime !== undefined) {
        sessiontime=patient.StartTime;
    }
    var RegisteredPracticeName = '';
    if (patient.RegisteredPracticeName !== undefined) {
        RegisteredPracticeName=patient.RegisteredPracticeName;
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
        
        <td>GP Practice</td>
        <td>`+RegisteredPracticeName+`</td>
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
        <td colspan="2"> First    |    Second</td>
        </tr>
        <tr>
            <td>Time of Vaccination (24hr)</td>
            <td>`+sessiontime+`</td>
            <td>Date of Vaccination</td>
            <td>` + sessiondate + `</td>
        </tr>
        <tr>
            <td colspan="2">Batch Number and Brand</td>
            <td colspan="2"></td>
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
