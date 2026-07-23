const sql = require("mssql");


async function connectSqlServer(config){


    const pool = await sql.connect({

        server: config.server,

        database: config.database,

        user: config.username,

        password: config.password,

        options:{
            encrypt:false,
            trustServerCertificate:true
        }

    });


    await pool.close();


    return true;

}


module.exports = {
    connectSqlServer
};