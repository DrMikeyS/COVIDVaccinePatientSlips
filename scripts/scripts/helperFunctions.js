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
    fomattedDate.setMonth(month)
    fomattedDate.setDate(splitDate[0])
    
    return fomattedDate.toLocaleDateString(
        'en-gb', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    ).replace(/ /g, '-').replace("Sept", "Sep")
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
    var nhsno_key, dob_key, name_key,address_key, firstbatch_key, firstdate_key, firsttype_key;
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
            if(lkey.includes('first')){}else
            if(lkey.includes('sur')){}else
            if(lkey.includes('pcn')){}else{
            name_key = key;
        }

// RH Added
        if (lkey.includes('firsttype')) {
            firsttype_key = key;
        }
        if (lkey.includes('firstbatch')) {
            firstbatch_key = key;
        }
        if (lkey.includes('firstdate')) {
            firstdate_key = key;
        }
// RH End

        }
    });
    return {
        dob: dob_key,
        name: name_key,
        nhsno: nhsno_key,
        address: address_key,
        firsttype: firsttype_key ,
        firstbatch: firstbatch_key ,
        firstdate: firstdate_key ,
    };
}
