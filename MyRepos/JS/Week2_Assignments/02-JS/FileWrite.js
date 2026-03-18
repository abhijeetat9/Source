const fs = require('fs');

function putCopyrightFile(cb){
    fs.readFile("a.txt", "utf8", (err, data) => {
        data = data + "copyright 2026";
        fs.writeFile("a.txt", data, function (){
            cb(data);
        })
        console.log(data);
    });
}

putCopyrightFile(function(){
    console.log("copyright done");
})