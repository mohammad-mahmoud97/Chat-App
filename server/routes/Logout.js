import express from "express";
import database from '../db_operations.js';
// import bodyParser from "body-parser";

const router = express.Router();
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    
    let user_info = {
        currentUser: `${req.query.userID}`
    };

    console.log(user_info);
    sqlQuery = `SELECT * FROM \`Chat_App_sessions\` WHERE data="${user_info.currentUser}";`;
    console.log(sqlQuery);
    db.connnectDB();
    db.queryDB(sqlQuery, (result) =>{
        console.log(result);
        if(result.length === 0)
            return res.status(200).json("not done");
        let session_id = result[0].session_id;
        sqlQuery = `DELETE FROM \`Chat_App_sessions\` WHERE data="${user_info.currentUser}";`;
        db.queryDB(sqlQuery, (result) => {
            console.log(result);
            res.cookie('cookieName', session_id, { path: '/', expires: new Date(Date.now() - 86400000), secure: false, httpOnly: true, sameSite: "lax" });
            return res.status(200).json("done");
        })
    });
})

export default router;