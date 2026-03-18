// const express = require('express');
// const port = 3000;
// function calculateSum(n){
//     let ans = 0;
//     for (let i = 0; i < n; i++) {
//         ans = ans + i;
//     }
//     return ans;
// }
//
// const app = express();
// app.get('/', (req, res) => {
//     const n = req.query.n;
//     const ans = calculateSum(n);
//     res.send(ans.toString());
// })
//
// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// })

const express = require("express");
const zod = require("zod");
const {response} = require("express");
const app = express();

//const schema = zod.array(zod.number());

// const schema = zod.object({
//     email: zod.string(),
//     password: zod.string(),
//     country: zod.literal("IN").or(zod.string()),
//     kidney: zod.string(),
// })
// app.use(express.json());// middleware - necessary to extract body from request
//
// app.post("/health", function (req, res) {
//     const kidneys = req.body?.kidneys;
//     const email = req.body?.email;
//     const response = schema.safeParse(email,kidneys);
//     console.log(response);
//     if(!response.success)
//     {
//         res.status(411).json({
//             msg: "Invalid input"
//         })
//     }else {
//         res.json({response});
//     }
// });

app.use(express.json());

app.get("/", (req, res) => {
    const kidneyNumber = parseInt(req.body.kidney);
    console.log(kidneyNumber);
})
