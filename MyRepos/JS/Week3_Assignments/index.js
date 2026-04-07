const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.get("/sum", (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);
    const sum = a+b;
    res.send(sum.toString());
});
app.get("/interest", (req, res) => {
    const p = parseInt(req.query.p);
    const n = parseInt(req.query.n);
    const r = parseInt(req.query.r);
    
    const Interest = (p*n*r)/100;
    const total = p + Interest;
    res.send({
        total: total,
        Interest: Interest
    })
});

app.listen(3000);