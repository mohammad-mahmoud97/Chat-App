import express from "express";
import database from '../db_operations.js';

const router = express.Router({mergeParams: true});

router.get('/', (req, res) => {
    console.log(req.path);
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    db.connnectDB();

    if(req.query.type === "accountPost"){
        let postsCriteria = {
            profileID: `${req.params.id}`,
        };
   
        sqlQuery = `SELECT user_post.written_text, user_post.media_location, user_post.created_time, user_post.post_id, user_profile.user_name, user_profile.account_image, user_profile.id
         FROM user_post
         INNER JOIN user_profile ON user_profile.id=${postsCriteria.profileID} AND user_post.profile_id=${postsCriteria.profileID};`;
         
        db.queryDB(sqlQuery, (result) => {
            console.log(result)
            return res.status(200).json(result);
        });
    }
})

export default router;