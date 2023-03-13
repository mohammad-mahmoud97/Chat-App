import express from "express";
import uid from 'uid-safe';
import database from '../db_operations.js';
// import bodyParser from "body-parser";

const router = express.Router();
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    
    let user_info = {
        email: `${req.query.email}`,
        password_hash: `${req.query.password_hash}`
    };

    // fetch user from the database
    // check if the user is existed, password ok redirect to /, otherwise /login
    // if not, redirect to /login
    
    console.log(user_info);
    sqlQuery = `SELECT * from \`user_profile\` WHERE email='${user_info.email}'`;
    db.connnectDB();
    db.queryDB(sqlQuery, (result) => {
        if(result.length === 0)
            return res.status(404).json({ existed: false, authenticated: false, redirectTo: '/login' });
        else{
            if(user_info.password_hash === result[0].password_hash){
                uid(20, (err, cookie) => {
                    const expires = 86400000;
                    if (err)
                        throw err;
                    console.log(cookie);
                    sqlQuery = `INSERT INTO \`Chat_App_sessions\` (session_id, expires, data) VALUES ('${cookie}', '${expires}', '${result[0].id}');`;
                    db.queryDB(sqlQuery, (insertResult) => {
                        res.cookie('cookieName', cookie, { path: '/', expires: new Date(Date.now() + expires), secure: true, httpOnly: true, sameSite: "lax" });
                        return res.json({ existed: true, authenticated: true, redirectTo: '/', profileId: `${result[0].id}` });
                    });
                })
            }
            else{
                return res.json({ existed : true, authenticated: false, redirectTo: '/login'});
            }
        }
    });
})

export default router;