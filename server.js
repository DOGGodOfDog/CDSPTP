const express = require("express");
const cors = require("cors");

const { poolPromise } = require("./db");
const loginRoute = require("./routes/login");
const databaseRoute = require("./routes/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test-db", async(req,res)=>{

    try{

        const pool = await poolPromise;

        const result = await pool.request()
            .query("SELECT GETDATE() AS ServerTime");


        res.json(result.recordset);

    }
    catch(err){

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/", (req, res) => {

    res.send("DB Copilot API Running");

});

app.use("/api/login", loginRoute);
app.use("/api/database", databaseRoute);

app.listen(3000, () => {

    console.log("Server running on port 3000");

});