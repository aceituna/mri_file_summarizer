let

function parseFiles(input){

for (let fileIdx=0; fileIdx<input.files.length; fileIdx++){
let file=input.files[fileIdx];
let reader = new FileReader();
reader.onload = (function(file){
return function(){
let data = reader.result;
data = data.split('\n');
for (let ii=0; ii<data.length;ii++){
data[ii] = data[ii].split('\t');}
let header = data[0];
data = data.slice(1, data.length);
console.log(header);
console.log(data);

};
})(file);
reader.readAsBinaryString(file);
}
}
function getAreaIdx(header){
return header.indexOf('Area');
}
function getMeanIdx(header){
return header.indexOf('Mean');
}
function getOverallSurface(header, data){
let areaIdx = getAreaIdx(header);
return sum(data.map(function(row){return row[areaIdx];});
}

function getOverallIntensity(header, data){
let areaIdx = getAreaIdx(header);
let meanIdx = getMeanIdx(header);
return sum(data.map(function(row){return row[areaIdx] * row[meanIdx];}));
}

function getAreaMean(header, data){
return getOverallIntensity(header, data) / getOverallSurface(header,data);

}






function parseFileName(filename){

    console.log(filename);
    return {
    subject: getSubjectFromFname(filename),
    area: getAreaFromFname(filename)
    };

}
function getSubjectFromFname(fname){
}
function getAreaFromFname(fname){
}

function readFile(file){

}