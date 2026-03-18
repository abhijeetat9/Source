const fs = require("fs");

const data = "/nHello I am adding this to the file";

fs.writeFile("a.txt", data, 'utf8', (err) => {
    if(err){
        console.log("error file", err);
    }
    console.log("file written", data);
});