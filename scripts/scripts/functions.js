function genPatientStickersHTML() {
    var i = 0;
    var fullhtml = '';
    
    csvResult.forEach(function (patient, index) {
        if(!patient[keys['name']]){
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
            sessiondate=patient.SessionDate;
        }
        sessiontime = '';
        if (patient.StartTime !== undefined) {
            sessiontime=patient.StartTime;
        }
        if(doseNumber==1){
            doseHTML = `
            <span class="semi-bold">First Dose</span>:  ` + sessiondate + ` at ` + sessiontime + ` 
            <br>Batch: `+batchNumber+`
            <table class="second-dose">
                <tr>
                    <td colspan="2" class="semi-bold">Second Dose </td>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td>Batch:</td>
                </tr>
            </table>`
        }else if(doseNumber==2){
            

        
   if(patient.firsttype!== undefined){
           firsttypetext = `<td>First Dose: ` + patient.firsttype + `</td>`;
        }else firsttypetext ='<td>First Dose:</td>'

        if(patient.firstdate!== undefined){
            firstdatetext = `<td>&nbsp; &nbsp; Date: ` + patient.firstdate + `</td>`;
        }else firstdatetext ='<td>Date:</td>'

        if(patient.firstbatch!== undefined){
            firstbatchtext = `<td>Batch: ` + patient.firstbatch + `</td>`;
        }else firstbatchtext ='<td>Date:</td>'

// end RH addition


// RH  added + firstdatetext + firstbatchtext to line below

            doseHTML = `
            <table class="second-dose">
                <tr>
                    <td colspan="2" class="semi-bold">First Dose:</td>
                </tr>
                <tr>
             
                    `  + firstdatetext + firstbatchtext + `
                  </tr>
            </table>


            <span class="semi-bold">Second Dose</span>:  ` + sessiondate + ` at ` + sessiontime + ` 
            <br>&nbsp;&nbsp;&nbsp;&nbsp;Batch: `+batchNumber+`
            `
 

// RH Hybrid Option

        }else if(doseNumber==4){
            

        
        // check is first vaccine column exist in the file
        if(patient.firstdate!== undefined){
            // if previous first batch exists for this patient
            if(patient.firstdate.length>0){

                line1 = ``
                line2 = `<td> &nbsp; &nbsp; Date: ` + patient.firstdate + 
                          `</td><td> Batch: ` + patient.firstbatch + `</td>`;
                line3 = sessiondate + ` at <span class="semi-bold"> ` + sessiontime + `</span>` ;   
                line4 = `<td>  &nbsp; &nbsp; Batch: ` + batchNumber + `</td>`
        
       
              }else{  // if no first batch then use the current batch
     
                line1 =  sessiondate + ` at <span class="semi-bold">` + sessiontime  + `</span>` ; 
                line2 = `<td> &nbsp; &nbsp;  Batch: ` + batchNumber + `</td>`;
                line3 = `` ;   
                line4 = `<td> &nbsp; &nbsp; Date:</td><td> Batch: </td>`

        }
        }

            doseHTML = `
            <table class="second-dose">
                <tr>
                    <td colspan="2"><span class="semi-bold">First Dose:</span> ` + line1 + `</td>
                </tr>
                <tr>`  + line2 + ` </tr>
            </table>
            
            <table class="second-dose">
                <tr>
                    <td colspan="2"><span class="semi-bold">Second Dose:</span> ` + line3 + `</td>
                </tr>
                <tr>`  + line4 + ` </tr>
            </table>`

        }


        html = start + `<div class="col-sm-4">
          <p class="patientName">` + patient[keys['name']] + `</p>
          Vaccine Type: <strong>`+vaccineType+`</strong><br>`
          +doseHTML+
          `<table class="sticker-qrs">
          <tr>
          <td>DOB:` + formatDate(patient[keys['dob']]) + `</td>
          <td>NHS No:` + patient[keys['nhsno']] + `</td>
          </tr>
          <tr>
          <td><div class="qr-code" id="dob-qr-` + index + `"></div></td>
          <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>
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
        if(!patient[keys['name']]){
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
            sessiondate=patient.SessionDate;
        }
        sessiontime = '';
        if (patient.StartTime !== undefined) {
            sessiontime=patient.StartTime;
        }
        if(csvResult[0].bookingNumber!== undefined){
            bookingText = `<td>BookingNo: ` + patient.bookingNumber + `</td>`;
            bookingQR = `<td><div class="qr-code" id="booking-qr-` + index + `"></div></td>`;
        }


 
        html = start + `<div class="col-print-6">
          <h1>` + patient[keys['name']] + `</h1>
          <p>Session Date: ` + sessiondate + `</p>
            <p>Session Time: ` + sessiontime + `</p>
          <table>
          <tr>
          <td>DOB: ` + formatDate(patient[keys['dob']]) + `</td>
          <td>NHS: ` + patient[keys['nhsno']] + `</td>
          `+bookingText+`
          </tr>
          <tr>
          <td><div class="qr-code" id="dob-qr-` + index + `"></div></td>
          <td><div class="qr-code" id="nhs-qr-` + index + `"></div></td>
          `+bookingQR+`
          </tr>
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
        if(!patient[keys['name']]){
            return;
        }
        html = genFullPageHTML(patient, index);
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

//FullPage
function genFullPageHTML(patient, index) {
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
        
        <td>DOB</td>
        <td>` + formatDate(patient[keys['dob']]) + `</td>
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
            <td colspan="2">Vaccine Brand and Batch Number</td>
            <td colspan="2">`+vaccineType+` `+batchNumber+`</td>
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
        if(!patient[keys['dob']]){
            return; //exit loop if no DOB
        }
        //Generate double QR style
        $('#dob-qr-' + index).qrcode({
            text: formatDate(patient[keys['dob']])
        });
        $('#nhs-qr-' + index).qrcode({
            text: patient[keys['nhsno']]
        });
        if(type=="incBookingNumber"){
            $('#booking-qr-' + index).qrcode({
                text: patient.bookingNumber
            });
        }

    });
}

function generateSecondDoseLabels() {
    html = `<div id="second-dose-labels"><div class="position-fixed" style="top: 0;left: 30%;">Print using "A4" paper size in Chrome</div>`;
    var i,j;
    for (i = 0; i < 27; i++) {
      html = html + `<div class="row tiny-stickers">`;
      for (j = 0; j < 7; j++) {
        html = html +  `<div class="col"><strong>Second Dose</strong><br>Date: `+sessionDate+` <br>Batch: `+batchNumber+`</div>`
      }
      html = html + `</div></div>`;
    }
    return html;
  }