//SetTimeOut
let a = 0;

function startCount(){
    console.log(a);
    a++;
    setTimeout(startCount, 1000);
}

startCount();
