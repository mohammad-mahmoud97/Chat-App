import express from "express";
import database from '../db_operations.js';

const router = express.Router();

router.get('/', (req, res) => {
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    db.connnectDB();

    if(req.query.type === "sendAddFriendRequest"){
        let fromID = `${req.query.fromID}`;
        let friendID = `${req.query.friendID}`;
        
        // status cases: 0 => pending requet, 1 => accepted request, 2 => rejected request
        sqlQuery = `SELECT * FROM \`friendship\` WHERE (from_id=${fromID} AND to_id=${friendID}) OR (from_id=${friendID} AND to_id=${fromID});`;
        db.queryDB(sqlQuery, (result) => {
            if(result.length > 0)
                return res.status(200).json({ sentBefore: true });
            
            const createdDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            sqlQuery = `INSERT INTO \`friendship\` (from_id, to_id, status, conversation_id, created_datetime) VALUES ('${fromID}', '${friendID}', '0', '0', '${createdDateTime}');`;
            db.queryDB(sqlQuery, (result) => {
                console.log(result);
                sqlQuery = `SELECT friend_request_counter FROM \`user_profile\` WHERE id=${friendID};`;
                db.queryDB(sqlQuery, (result) => {
                    sqlQuery = `UPDATE \`user_profile\` SET friend_request_counter=${result[0].friend_request_counter + 1} WHERE id=${friendID};`;
                    db.queryDB(sqlQuery, (result) => {
                        return res.status(200).json({ sentBefore: false, sent: true });
                    })
                })
            })
        })
    }

    else if(req.query.type === "getAddFriendCounter"){
        let myID = `${req.query.myID}`;

        sqlQuery = `SELECT friend_request_counter FROM \`user_profile\` WHERE id=${myID};`;
        db.queryDB(sqlQuery, (result) => {
            console.log(result);
            if(result.length){
                return res.status(200).json(result[0].friend_request_counter);
            }
        })
    }

    else if(req.query.type === "getAddFriendList"){
        let myID = `${req.query.myID}`;
        sqlQuery = `SELECT from_id FROM friendship WHERE to_id=${myID} AND status=${0};`;
        db.queryDB(sqlQuery, (result) => {
            if(result.length){
                console.log(result);
                sqlQuery = `SELECT id, user_name, account_image FROM user_profile WHERE id in (${result.map((item) => item.from_id)});`;
                db.queryDB(sqlQuery, (resultSelect) => {
                    console.log("final is " + resultSelect);
                    return res.status(200).json(resultSelect);
                })
            }
        })
    }

    else if(req.query.type === "acceptAddFriend"){
        let fromID = `${req.query.fromID}`;
        let friendID = `${req.query.friendID}`;
        
        sqlQuery = `INSERT INTO conversation VALUES ();`;
        db.queryDB(sqlQuery, (result) => {
            console.log(result);
            const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            sqlQuery = `INSERT INTO \`group_member\` (\`contact_id\`, \`conversation_id\`, \`joined_datetime\`) VALUES ('${friendID}', '${result.insertId}', '${currentDateTime}');`;
            db.queryDB(sqlQuery, (resultUpdate) => {
                sqlQuery = `UPDATE friendship SET status='${1}', accepted_datetime='${currentDateTime}', conversation_id='${result.insertId}' WHERE from_id=${friendID} AND to_id=${fromID};`;
                db.queryDB(sqlQuery, (result) => {
                    sqlQuery = `SELECT friend_request_counter FROM user_profile WHERE id=${fromID};`;
                    db.queryDB(sqlQuery, (result) => {
                        sqlQuery = `UPDATE user_profile SET friend_request_counter='${result[0].friend_request_counter - 1}' WHERE id=${fromID};`;
                        db.queryDB(sqlQuery, (result) => {
                            return res.status(200).json("done");
                        })
                    })
                })
            })
        })
    }
    else if(req.query.type === "rejectAddFriend"){
        let fromID = `${req.query.fromID}`;
        let friendID = `${req.query.friendID}`;
        const acceptedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        sqlQuery = `DELETE FROM friendship WHERE from_id=${friendID} AND to_id=${fromID};`;
        db.queryDB(sqlQuery, (result) => {
            sqlQuery = `SELECT friend_request_counter FROM user_profile WHERE id=${fromID};`;
            db.queryDB(sqlQuery, (result) => {
                sqlQuery = `UPDATE user_profile SET friend_request_counter='${result[0].friend_request_counter - 1}' WHERE id=${fromID};`;
                db.queryDB(sqlQuery, (result) => {
                    return res.status(200).json("done");
                })
            })
        })
    }
})

export default router;