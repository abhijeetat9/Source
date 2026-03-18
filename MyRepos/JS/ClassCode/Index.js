//Counter in Javascript

// setInterval(counter, 1);
//
// function counter()
// {
//     for (let i = 30;i>=0;i--)
//     {
//         console.log(i);
//     }
// }

//Length
// function getLength(str) {
//     console.log("Original String:", str);
//     console.log("Length:", str.length);
// }
// getLength("Hello World");

// indexOf

//expenditure
// function calculateTotalSpentByCategory(transactions)
// {
//     const totals = {};
//     transactions.forEach(transaction => {
//         const {category, price} = transaction;
//        
//         if(totals[category])
//         {
//             totals[category] += price;
//         }
//         else
//         {
//             totals[category] = price;
//         }
//     });
//    
//     return Object.keys(totals).map(category =>
//         ({category, totalSpent: totals[category]}));
// }
//
// const transactions = [
//     { id: 1, timestamp: 1656076800000, price: 10, category: "Food", itemName: "Pizza" },
//     { id: 2, price: 20, category: "Food", itemName: "Burger" },
//     { id: 3, price: 50, category: "Travel", itemName: "Taxi" }
// ];
//
// console.log(calculateTotalSpentByCategory(transactions));

//Classes, static methods and constructors 
// class Building{
//     constructor(color, rooms){
//         this.color = color;
//         this.rooms = rooms;
//     }
//     describe()
//     {
//         console.log(`This house is ${this.color} and has ${this.rooms} rooms`);
//     }
//    
//     static area()
//     {
//         console.log("This area is reserved");
//     }
// }
//
// let apartment = new Building("Black",3); // create object
// apartment.describe(); // call function
// Building.area();
//
// const currentDate = new Date();
// console.log(currentDate.getTime());
// let sum = 0; 
// for(let i=0;i<=100;i++)
// {
//     sum += i;
// }
// console.log(sum);


// function square(n)
// {
//     return n*n;
// }
//
// function cube(n)
// {
//     return n*n*n;
// }
// function sumOfSomething(a,b,fn)
// {
//     const val1 = fn(a);
//     const val2 = fn(b);
//     return val1 + val2;
// }
//
// console.log(sumOfSomething(1,2, cube));

// const fs = require("fs");
//
// function myReadfs(cb) {
//     fs.readFile("a.txt", "utf8", function (err, data) {
//         cb(data);
//     });
// }
//
// function onDone(data)
// {
//     console.log(data);
// }
//
// myReadfs(onDone);

//defining callback function
// function promisifiedMyOwnTimeout(duration)
// {
//     const p = new Promise(function(resolve)
//     {
//         setTimeout(function(){
//             resolve();
//         }, duration );
//     });
//     return p;
// }

//async await syntax, promise chaining => callback hell
//calling callback function
// function someSyncTask1()
// {
//     console.log("sync task 1");
// }
// function someSyncTask2()
// {
//     console.log("sync task 2");
// }
//
// setTimeout(function (data) {
//     someSyncTask1(data);
// },1000);
// someSyncTask2();

// function myOwnTimeout(cb)
// {
//     setTimeout(cb, 1000);
//     console.log("waht is cb", cb);
// }
//
// myOwnTimeout(function()
// {
//     console.log("myOwnTimeout");
// }, 1000)

// console.log("line 1");
// function promisifiedTimeout() {
//     console.log("line 3");
//     return new Promise(function (resolve) {
//         console.log("line 4");
//         setTimeout(function () {
//             console.log("line 5");
//             resolve("i am done");
//         }, 5000);
//     });
// }
//
// console.log("line 2");
// promisifiedTimeout().then(function (result) {
//     console.log("line 6");
//     console.log(result);
// });
//
// let n = new Number();
// n.isInteger(n)

// const a = [1,2,3,4,5];
//
// const ans = a.map(transform = (i, fn) =>
// {
//     return i*3;
// });
// console.log(ans);

// const a = ["abhijit", "shalmali", "revati", "ameya"];
//
//
// const newArr = a.filter(filterlogic = (n) =>
// {
//     if(n.startsWith("a")){
//         return true;
//     }
// });
// // newArr.filter(a[]i)for (let i = 0; i < a.length; i++) {
// //     if(a[i] % 2 === 0)
// //     {
// //         newArr.push(a[i]);
// //     }
// // }
// console.log(newArr);

// const map = (arr, fn) => {
//     const newArr = [];
//     for(let i = 0; i < arr.length; i++) {
//         newArr.push(fn(arr[i]));
//     }
//     return newArr;
// }
//
//
// const a = [1,2,3,4,5];

