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