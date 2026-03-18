## Create a counter in JavaScript

We have already covered this in the second lesson, but as an easy recap try to code a counter in Javascript
It should go up as time goes by in intervals of 1 second
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
