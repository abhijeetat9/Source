const fs = require('fs');
const path = 'a.txt';

fs.readFile(path, 'utf8',(err, data) => {
    if (err) {
        console.log("cannot read file", err);
    }
console.log(data);
const cleanedData = data.replace(/\s+/g, ' ').trim();
fs.writeFile(path, cleanedData, (err) => {
    if (err) {
        console.log("cannot write file", err);
    }
    console.log(cleanedData);
});
});