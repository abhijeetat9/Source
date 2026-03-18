let a = 0;
function clock(){
    let d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
}
function startCount(){
    // console.log(d.toLocaleString());
    a++;
    console.log(clock());
    setTimeout(startCount, 1000);
}

startCount();
