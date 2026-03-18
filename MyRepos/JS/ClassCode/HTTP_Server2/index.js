const express = require('express');

const app = express();
const users = [{
    name: "John",
    kidneys: [{
        healthy: false
    }]
}];
app.use(express.json());

app.get('/health', (req, res) => {
    const johnKidneys = users[0].kidneys;
    const numberOfKidneys = johnKidneys.length;
    let numberOfHealthyKidneys = 0;
    for (let i = 0; i < johnKidneys.length; i++) {
        if(johnKidneys[i].healthy)
        {
                numberOfHealthyKidneys = numberOfHealthyKidneys + 1;
        }
    }
    const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
    res.json({
        numberOfKidneys,
        numberOfHealthyKidneys,
        numberOfUnhealthyKidneys
    })
})

app.post('/health', (req, res) => {
    const isHealthy = req.body.isHealthy;
    users[0].kidneys.push({
            healthy: isHealthy
    })
    res.json({
        msg : "done"
        }
    )
})

app.put('/health', (req, res) => {
    for (let i=0; i<users[0].kidneys.length; i++) {
        users[0].kidneys[i].healthy = true;
    }
    res.json({})
})

function atleastOneKidneyisUnhealthy(){
    let atLeastOneKidney = false;
    for (let i=0; i<users[0].kidneys.length; i++) {
        if(!users[0].kidneys[i].healthy)
        {
            atLeastOneKidney = true;
        }
    }
    return atLeastOneKidney;
}

app.delete('/health', (req, res) => {
    // for (let i=0; i<users[0].kidneys.length; i++) {
    //     if (users[0].kidneys[i].healthy === false) {
    //         users[0].kidneys.splice(i, 1);
    //     }
    // }
    // res.json({
    //     msg : "removed"
    // })
    if(atleastOneKidneyisUnhealthy())
    {
        const newKidneys = [];
        for (let i=0; i<users[0].kidneys.length; i++) {
            if(users[0].kidneys[i].healthy)
            {
                newKidneys.push({
                    healthy: true
                });
            }
        }
        users[0].kidneys = newKidneys;
        res.json({msg : "removed"})
    }
    else
    {
        res.sendStatus(411).json({msg : "not bad kidneys"});
    }
})

app.listen(3000);
console.log(users[0]);