import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import uuid from "uid-safe";
import database from './db_operations.js';
import Register from './routes/Register.js';
import LogIn from './routes/LogIn.js';
import Logout from "./routes/Logout.js";
import Posts from './routes/Posts.js';
import GetPosts   from './routes/GetPosts.js';
import FriendsRequests from './routes/FriendsRequests.js';
import Messages from './routes/Messages.js'
import session from "express-session";
import MySqlSession from "express-mysql-session";
let MySQLStore = MySqlSession(session);
config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173", '*'], credentials: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// const options = {
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'Chat App',
//     schema: {
//         tableName: 'Chat_App_sessions',
//         columnNames: {
//             session_id: 'session_id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// };

// let sessionStore = new MySQLStore(options);
// sessionStore.close();

app.use(isAuthenticated);

app.use('/register', Register);
app.use('/login', LogIn);
app.use('/logout', Logout); // invalidate any cookies
app.use('/', Posts);
app.use('/profile/:id', GetPosts);
app.use('/friendsRequests', FriendsRequests);
app.use('/messages', Messages);


// Global Middleware
function isAuthenticated(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    let sessionID;
    console.log(req.path);
    if(req.headers.cookie){
        if(req.path === "/logout"){
            console.log("logging out");
            next();
            return;
        }
        const db = new database("localhost", "root", "root", "Chat App");
        db.connnectDB();
        console.log("cookie");
        sessionID = req.headers.cookie.split("=")[1];
        console.log(sessionID);
        const sqlQuery = `SELECT * FROM \`Chat_App_sessions\` WHERE session_id="${sessionID}";`;
        db.queryDB(sqlQuery, (result) => {
            if(result.length){
                console.log(result[0].data); // profileId
                // if the route is /register or /login, logout from the already signed in user then next();
                console.log("Normal Case");
                next();
                return;
            }
            else{
                // redirect to /login
                console.log("redirecting to /login");
                res.redirect("http://localhost:5173/login");
                return;
            }
        })
    }
    else{
        if(req.path === "/" || req.path === "/friendsRequests")
        {
            console.log("no cookie");
            res.redirect("http://localhost:5173/login");
            return;
        }
        else{
            console.log("last step");
            next();
            return;
        }
    }
}


app.listen(parseInt(process.env.LISTENING_PORT), () => console.log(`server is listening on PORT ${process.env.LISTENING_PORT}`));