import express from "express";
import database from '../db_operations.js';

const router = express.Router();

router.get('/', (req, res) => {
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    db.connnectDB();

    if(req.query.type === "getAddFriendList"){
        let myID = `${req.query.myID}`;
        sqlQuery = `SELECT conversation_id, from_id, to_id FROM friendship WHERE status=1 AND (from_id=${myID} OR to_id=${myID});`;
        db.queryDB(sqlQuery, (result) => {
           if(result.length === 0)
               return res.status(200).json(result);

            console.log(result);
            
            result.map((item) => {
                if(item.from_id == myID)
                    delete item.from_id;
                else{
                    item['to_id'] = item['from_id'];
                    delete item.from_id;
                }
            });
            
            console.log(result);
            
            sqlQuery = `SELECT id, user_name, account_image FROM user_profile WHERE id in (${result.map((item) => item.to_id)});`;
            db.queryDB(sqlQuery, (resultSelect) => {
                for (let index = 0; index < result.length; index++)
                    Object.assign(resultSelect[index], {conversation_id: result[index].conversation_id})
                console.log(resultSelect);
                return res.status(200).json(resultSelect);
            })
        })
    }
    else if(req.query.type === "sendMessage"){
        let myID = `${req.query.myID}`;
        let conversation_id = `${req.query.conversation_id}`;
        let messageContent = `${req.query.messageContent}`;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        sqlQuery = `INSERT INTO \`messages\` (from_id, message_content, sent_datetime, conversation_id) VALUES ('${myID}', '${messageContent}', '${currentDateTime}', '${conversation_id}')`;
        db.queryDB(sqlQuery, (result) => {
            return res.status(200).json("done");
        })
    }
    else if(req.query.type === "getMessages"){
        let conversation_id = `${req.query.conversation_id}`;

        console.log("conversation_id is " + conversation_id);
        sqlQuery = `SELECT * FROM  messages WHERE conversation_id=${conversation_id} ORDER BY sent_datetime ASC`;
        db.queryDB(sqlQuery, (result) => {
            console.log(result);
            return res.status(200).json(result);
        })
    }
});

export default router;