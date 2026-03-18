 const p = new myOwnPromise(function myResolve()
 {
     setTimeout(() => {
         myResolve("Hello, World!");
     }, 1000);
 });

p.then(myResult => console.log(myResult));