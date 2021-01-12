
# COVID Vaccine Patient Slip Generator
A free tool that allows you to convert a CSV list of patients into a printable pack of patient slips to make using Pinnacle a breeze.

| Sample QR Slip  | Sample Full Page Form With QR |
| ------------- | ------------- |
| ![](https://github.com/DrMikeyS/COVIDVaccinePatientSlips/raw/main/demo.jpg?raw=true)   | ![](https://github.com/DrMikeyS/COVIDVaccinePatientSlips/raw/main/demo_full1.jpg?raw=true)  |


## Video Demo
[See this video](https://youtu.be/GmWTVxI_sx4) for how the process works in detail. 

##  Web Version (less secure)

[Test drive a web based version](https://durhamstudenthealth.co.uk/qr) of the system. While all the data is processed in the browser, there is the risk of data interception, so for real patient data please use the instructions below. There is a [dummy patient csv](https://raw.githubusercontent.com/DrMikeyS/COVIDVaccinePatientSlips/main/dummy-patient-list.csv) file you can download here to try it.

## Run On You Computer (Secure)

 - [Download](https://github.com/DrMikeyS/COVIDVaccinePatientSlips/archive/main.zip) the file package
 - Open "index.html" or "fullpage.html" in Chrome, Firefox or Safari (Fullpage prints an A4 form version with QR codes for clinics that are recording on paper)
 - Export the "Session List" from AccuBook or generate a CSV file with headings for: NhsNumber,	Name,	DateOfBirth (Optional:	SessionDate,	StartTime, Address)
 - Upload the CSV session list into the generator (index.html)
 - Print and cut out the patient slips
 - Use barcode scanners to scan DOB and NHS number into Health Outcomes 

## IG and Security
No data is transferred anywhere when using this tool, all the process is done in your web browser so there are no IG concerns.

The tool does use some open source libraries to work. As such using the tool is entirely are your own risk.
