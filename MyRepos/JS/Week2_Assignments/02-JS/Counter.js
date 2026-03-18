//SetTimeOut
let a = 0;

function startCount(){
    console.log(a);  
    a++;
    setTimeout(startCount, 1000);
}

startCount();

//SetTimeInterval

let b = 0;

setInterval(() =>{
    b++;
    console.log(b);
}, 1000);

