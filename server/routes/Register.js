import express from "express";
import url from 'url';
import uid from 'uid-safe';
import database from '../db_operations.js';
// import bodyParser from "body-parser";

const router = express.Router();
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    
    let user_info = {
        firstName: `${req.query.firstName}`,
        lastName: `${req.query.lastName}`,
        userName: `${req.query.userName}`,
        email: `${req.query.email}`,
        password: `${req.query.password}`,
        country: `${req.query.country}`,
        sex: `${req.query.sex}`,
        dateOfBirth: `${req.query.dateOfBirth}`,
        coverImage: `${req.query.coverImage}`,
        accountImage: `${req.query.accountImage}`,
        friendRequestCounter: `${req.query.friendRequestCounter}`
    };

    // fetch user from the database
    // check if the user is existed, if existed and authenticated redirect to /login otherwise /register
    // if not, add it to the database and redirect to /
    
    console.log(user_info);
    sqlQuery = `SELECT * from \`user_profile\` WHERE email='${user_info.email}'`;
    console.log(sqlQuery);
    db.connnectDB();
    db.queryDB(sqlQuery, (result) => {
        console.log(result.length);
        if(result.length === 0)
        {
            sqlQuery = `INSERT INTO \`user_profile\` (first_name, last_name, user_name, email, password_hash, country, sex, date_of_birth, cover_image, account_image, friend_request_counter) VALUES ('${user_info.firstName}', '${user_info.lastName}', '${user_info.userName}','${user_info.email}', '${user_info.password}', '${user_info.country}', '${user_info.sex}', '${user_info.dateOfBirth}', '${user_info.coverImage}', '${user_info.accountImage}', '${user_info.friendRequestCounter}')`;
            console.log(sqlQuery);
            db.queryDB(sqlQuery, (result) => {
                console.log(result);
                uid(20, function(err, string){
                    const expires = 86400000;
                    if(err)
                        throw err;
                    sqlQuery = `INSERT INTO \`Chat_App_sessions\` (session_id, expires, data) VALUES ('${string}', '${expires}', '${result.insertId}');`;
                    db.queryDB(sqlQuery, (insertResult) => {
                        console.log(string);
                        res.cookie('cookieName', string, { path: '/', expires: new Date(Date.now() + expires), secure: true, httpOnly: true, sameSite: "lax" });
                        return res.status(200).json({ inserted: true, redirectTo: '/', insertedId: `${result.insertId}` });
                    })
                })
        });
        }
        else {
            if(user_info.password === result[0].password_hash && user_info.sex === result[0].sex &&
                user_info.country === result[0].country)
                    return res.json({ inserted: false, authenticated: true, redirectTo: '/login' });
            return res.json({ inserted : false, authenticated: false, redirectTo: '/register'});
        }
    });
})

export default router;