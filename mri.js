let fileInput = document.getElementById('fileinput');
fileInput.value = '';
let loadedData = [];

function parseFiles(input) {

    for (let fileIdx = 0; fileIdx < input.files.length; fileIdx++) {
        let file = input.files[fileIdx];
        let reader = new FileReader();
        reader.onload = (function(file) {
            return function() {
                let data = reader.result;
                data = data.split('\n');
                for (let ii = 0; ii < data.length; ii++) {
                    data[ii] = data[ii].split('\t');
                }
                let header = data[0];
                data = data.slice(1, data.length);
                let subject = getSubjectFromFname(file.name);
                let area = getAreaFromFname(file.name);

                let mean = getAreaMean(header, data);
                appendToLoadedData(subject, area, mean);

                console.log(header);
                console.log(data);

            };
        })(file);
        reader.readAsBinaryString(file);
    }
}

function appendToLoadedData(subject, area, mean) {
    let subjIdx = loadedData.findIndex(
        function(item) {
            console.log(item);
            return item && item.subject === subject;
        }
    );
    if (subjIdx == -1) {
        loadedData.push({
            subject: subject
        });
        subjIdx = loadedData.length - 1;
    }
    loadedData[subjIdx][area] = mean === undefined ? '' : mean;


}


function getAreaIdx(header) {
    return header.indexOf('Area');
}

function getMeanIdx(header) {
    return header.indexOf('Mean');
}

function getOverallSurface(header, data) {
    let areaIdx = getAreaIdx(header);
    return data.map(function(row) {
        if (row.length < 2) {
            return 0;
        }
        return Number(row[areaIdx]);
    }).reduce(add, 0);
}

function getOverallIntensity(header, data) {
    let areaIdx = getAreaIdx(header);
    let meanIdx = getMeanIdx(header);
    return data.map(function(row) {
        if (row.length < 2) {
            return 1;
        }
        return Number(row[areaIdx]) * Number(row[meanIdx]);
    }).reduce(add, 0);
}

function add(a, b) {
    return a + b;
}

function getAreaMean(header, data) {
    let intensity = getOverallIntensity(header, data);
    let surface = getOverallSurface(header, data);
    console.log('intensity', intensity);
    console.log('surface', surface);
    return intensity / surface;

}




function parseFileName(filename) {

    console.log(filename);
    return {
        subject: getSubjectFromFname(filename),
        area: getAreaFromFname(filename)
    };

}

function getSubjectFromFname(fname) {
    let name = fname.split('.')[0];
    return name.split('-')[0];
}

function getAreaFromFname(fname) {
    let name = fname.split('.')[0];
    return name.split('-')[1] + '-' + name.split('-')[2];
}



function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, keysSet, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';
    keys = []

    data.map(function(item) {
        keys = keys.concat(Object.keys(item));
    });
    keysSet = new Set(keys);
    keys = Array.from(keysSet);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key] === undefined ? '' : item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: loadedData
    });
    if (csv == null) return;

    filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);
    console.log('loadedData', loadedData);

    window.open(data, '_blank');
}