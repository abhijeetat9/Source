require('dotenv').config();
const express = require('express');
const mainRouter = require("./routes/index.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(process.env.PORT || 3000);
