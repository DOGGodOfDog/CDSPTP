const { poolPromise, sql } = require("../db");


exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;


        const pool = await poolPromise;


        const result = await pool.request()

            .input(
                "p_user_name",
                sql.NVarChar(100),
                username
            )

            .input(
                "p_password",
                sql.NVarChar(100),
                password
            )

            .execute("SP_1001_P2P_Check_User_Permission");


        const loginResult = result.recordset[0];

        const data = result.recordset[0];
        
        if(loginResult.is_permission === 1){

            res.json({

                success:true,

                message:"Login Success",

                message:"Username : ",username,

                message:"Password : ",password,

                user_name: data.user_name

            });

        }
        else{

            res.json({

                success:false,

                message:"Invalid username or password",

                message:"Username : ",username,

                message:"Password : ",password,

                user_name: data.user_name

            });

        }


    }
    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};