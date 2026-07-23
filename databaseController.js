const sql = require("mssql");
const { connectSqlServer } = require("../services/database/sqlServer");


exports.connect = async(req,res)=>{

    const {
        type,
        server,
        database,
        username,
        password
    } = req.body;


    try{

        let connectionResult;


        switch(type){

                case "SQL Server":

                await connectSqlServer({
                    server,
                    database,
                    username,
                    password
                });

                break;


                case "Oracle":

                throw new Error("Oracle not implemented yet");


                default:

                throw new Error("Unsupported Database Type");

        }
        res.json({

            success:true,

            message:"Database Connected",

            context:{
                type:type,
                server:server,
                database:database
            }

        });


    }
    catch(error){

        console.error(error);

        res.json({

            success:false,

            message:error.message

        });

    }

};