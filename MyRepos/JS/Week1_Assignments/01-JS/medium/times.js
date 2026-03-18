function calculateTime(n) {
    const startTime = new Date();
    let sum = 0;
    for(let i = 1; i <= n; i++)
    {
       sum += i;
    }

    const endTime = new Date();
    let elapsedTime = (endTime-startTime)/1000;
    return elapsedTime;
}

console.log("Sum from 1-100: " + calculateTime(100));
console.log("Sum from 1-100000: " + calculateTime(100000));
console.log("Sum from 1-1000000000: " + calculateTime(1000000000));