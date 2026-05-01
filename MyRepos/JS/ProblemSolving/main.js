/*CLOSURES*/
// function makeCounter(start = 0)
// {
//     let count = start;
//     return { 
//         increment() {
//            return count = count + 1;
//         }, decrement() {
//         return count = count - 1;
//         },reset(){
//         return count = start;
//         },
//         value(){
//         return count;
//         }
//     }
//    
// }
//
// const counter = makeCounter(10);
// console.log(counter.increment()); 
// console.log(counter.increment()); 
// console.log(counter.decrement()); 
// console.log(counter.reset());     
// console.log(counter.value());  

/*Higher-order Functions*/

// const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
//
// const process = pipe(
//     x => x * 2,
//     x => x + 10,
//     x => `Result: ${x}`
// );

// function pipe(...fns){
//     return function (x){
//        
//         let result = x;
//        
//         for(let i=0;i<fns.length;i++){
//             let current = fns[i];
//             result = current(result);
//         }
//        
//         return result;
//     };
// }
// const process = pipe(
//     x => console.log(process(0)),
//     x => x * 2,
//     x => x + 10,
//     x => `Result: ${x}`
// );
// console.log(process(5));  // "Result: 20"
// console.log(process(0));  // "Result: 10"

/*Array Methods Deep Dive*/
//
// const orders = [
//     { id: 1, customer: 'Alice', amount: 120, status: 'completed' },
//     { id: 2, customer: 'Bob',   amount: 180,  status: 'pending' },
//     { id: 3, customer: 'Alice', amount: 80, status: 'completed' },
//     { id: 4, customer: 'Carol', amount: 150, status: 'cancelled' },
//     { id: 5, customer: 'Bob',   amount: 400,  status: 'completed' },
// ];
//
// function totalRevenue(orders){
//    return orders.filter(orders => orders.status === 'completed').reduce((acc, orders) => acc + orders.amount, 0);
// }
//
// function topCustomer(orders){
//      let totals = completedByCustomer(orders);
//      console.log(totals);
//      return Object.keys(totals).reduce((winner,customer) => {
//          return totals[customer] > totals[winner] ? customer : winner;
//      });
// }
//
// function orderSummary(orders){
//     return orders.reduce((acc, orders) => {
//         acc[orders.status] = (acc[orders.status] || 0) + 1;
//         //console.log(acc);
//         return acc;
//     }, {});
// }
//
// function completedByCustomer(orders){
//     return orders.filter(orders => orders.status === 'completed').reduce((acc, orders) => {
//         acc[orders.customer] = (acc[orders.customer] || 0) + orders.amount;
//         // console.log(acc);
//         return acc;
//     }, {});
// }
//
// console.log(totalRevenue(orders));
// console.log(topCustomer(orders));
// console.log(orderSummary(orders));
// console.log(completedByCustomer(orders));


// var-let-closure
// for (var i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 0);
// }
//
// for (let i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 0);
// }
//
//
// const fns = [];
// for (var i = 0; i < 3; i++) {
//     fns.push((function(j) {
//         return () => console.log(j);
//     })(i));
// }
// fns.forEach(f => f());
//
// const arr = [];
// for (var i = 0; i < 3; i++) {
//     arr.push((function (j){
//         return() => console.log(j);
//     })(i));
// }
//
// arr.forEach(f => f());


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) reject(new Error('Invalid ID'));
            resolve({ id, name: `User ${id}`, role: id === 1 ? 'admin' : 'user' });
        }, 200);
    });
}

// async function TaskA() {
//     const start = Date.now();
//     const user1 = await fetchUser(1);
//     const user2 = await fetchUser(2);
//     const user3 = await fetchUser(3);
//     console.log(user1,user2,user3);
//     console.log(`Time: ${Date.now() - start}ms`)
// }

// async function taskC(){
//     //const start = Date.now();
//     const results = await Promise.allSettled([
//         fetchUser(1),
//         fetchUser(2),
//         fetchUser(-1)
//
//     ]);
//     results.forEach(result => {
//     if(result.status === 'fulfilled')
//     {
//         console.log(`Success: ${result.value.user.name}`);
//     }
//     else {
//         console.log(`Failed: ${result.reason.message}`);
//     }
//     });
// }
// taskC();
//
//
// function BankAccount(owner,initialBalance,){
//     this.owner = owner;
//     this.balance = initialBalance;
//     this.transactions = 1;
// }
//
// BankAccount.prototype.deposit = function(amount){
//     this.balance += amount;
//     this.transactions++;
// };
//
// BankAccount.prototype.withdraw = function(amount){
//     if(this.balance < amount){
//         throw new Error("You dont have enough balance");
//     }
//     this.balance -= amount;
//     this.transactions++;
// };
//
// BankAccount.prototype.statement = function(amount){
//     console.log(`${this.owner} | Balance: ${this.balance} | Transactions : ${this.transactions}`);
// }
//
// const account1 = new BankAccount('Abhijit', 10000);
// const account2 = new BankAccount('Shalmali', 10000);
// account1.deposit(200);
// account2.deposit(200);
// account2.withdraw(100);
// account1.withdraw(100);
// account2.withdraw(1000);
// try {
//     account2.withdraw(999999);
// }catch(err){
//     console.error(err.message);
// }


// class BankAccount {
//     constructor(owner,initialBalance) {
//         this.owner = owner;
//         this.initialBalance = initialBalance;
//         this.transaction = 0;
//     }
//    
//     deposit(amount) {
//         this.initialBalance += amount;
//         this.transaction++;
//     }
//    
//     withdraw(amount) {
//         if(this.initialBalance < amount) {
//             throw new Error("You dont have enough balance");
//         }
//         this.initialBalance -= amount;
//         this.transaction++;
//     }
//    
//     statement(){
//         console.log(`${this.owner} | Balance: ${this.initialBalance} | Transactions : ${this.transaction}`); 
//     }
// }
//
// const account = new BankAccount('Abhijit', 10000);
// account.deposit(1000);
// account.withdraw(1980);
// account.statement();
// try {
//     account.withdraw(10000);
// }
// catch(err) {
//     console.log(err.message);
// }
function safeRun(fn){
   try{ 
       const value = fn();
       return { ok: true, value }; 
   }catch(e){
       //console.error(e.message);
       return { ok: false, error: e.message };
   }
}
async function safeRunAsync(fn){
    try{
        const value = await fn();
        return { ok: true, value };
    }catch(e){
        //console.error(e.message);
        return { ok: false, error: e.message };
    }
}

const result1 = safeRun(() => JSON.parse('{"valid": true}'));
console.log(result1); 

const error1 = safeRun(() => JSON.parse('not valid json'));
console.log(error1); 

const result = await safeRunAsync(() => fetchUser(1));
console.log(result);

const error = await safeRunAsync(() => fetchUser(-1));
console.log(error);