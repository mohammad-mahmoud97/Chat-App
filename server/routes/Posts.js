import express from "express";
import uid from 'uid-safe';
import database from '../db_operations.js';

const router = express.Router();

router.get('/', function(req, res){
    let sqlQuery;
    let db = new database("localhost", "root", "root", "Chat App");
    db.connnectDB();
    
    if(req.query.type === "createPost")
    {
        let post = {
            profileID: `${req.query.profileID}`,
            postContent: `${req.query.postContent}`,
            mediaLocation: `${req.query.mediaLocation}`,
            createdTime: `${req.query.createdTime}`
        };
       
        sqlQuery = `INSERT INTO \`user_post\` (profile_id, written_text, media_location, created_time) VALUES ('${post.profileID}', '${post.postContent}', '${post.mediaLocation}', '${post.createdTime}')`;
        db.queryDB(sqlQuery, (result) => {
            return res.status(200);
        });
    }
    else if(req.query.type === "likePost"){
        let like = {
            profileID: `${req.query.profileID}`,
            postID: `${req.query.postID}`,
            createdTime: `${req.query.createdTime}`
        };
       
        sqlQuery = `INSERT INTO \`post_like\` (profile_id, post_id, created_time) VALUES ('${like.profileID}', '${like.postID}', '${like.createdTime}')`;
        db.queryDB(sqlQuery, (result) => {
            res.status(200);
        })
    }
    else if(req.query.type === "commentPost"){
        let comment = {
            profileID: `${req.query.profileID}`,
            postID: `${req.query.postID}`,
            createdTime: `${req.query.createdTime}`,
            commentText: `${req.query.commentText}`
        };
       
        sqlQuery = `INSERT INTO \`post_comment\` (profile_id, post_id, created_time, comment_text) VALUES ('${comment.profileID}', '${comment.postID}', '${comment.createdTime}', '${comment.commentText}')`;
        db.queryDB(sqlQuery, (result) => {
            res.status(200);
        });
    }
    else {
        let sqlQuery;
        let result;
        let newArray;
        let posts =
        {
            profileID: `${req.query.accountID}`,
            limit: `${req.query.limit}`
        };
       
        sqlQuery = `SELECT status, from_id, to_id FROM friendship WHERE status=1 AND (from_id=${posts.profileID} OR to_id=${posts.profileID});`;
        console.log(sqlQuery);
        db.queryDB(sqlQuery, (result) => {
            console.log(result);
           //   TODO: remove the profileID from  the returned array
           if(result.length === 0)
               return res.status(200).json(result);
           result.map((item) => {
                if(item.from_id === posts.profileID)
                    delete item.from_id;
                else{
                    item['to_id'] = item['from_id'];
                    delete item.from_id;
                }
            });
            console.log(result);
           
           //   selecting all user profiles of the friends
            sqlQuery = `SELECT * FROM user_profile WHERE id in (${result.map((item) => item.to_id)});`;
            console.log(sqlQuery);
            db.queryDB(sqlQuery, (result) => {
                console.log(result);
               //   selecting all posts related to user profiles of friends
                sqlQuery = `SELECT user_post.profile_id, user_post.written_text, user_post.media_location, user_post.created_time, user_post.post_id, user_profile.user_name, user_profile.account_image, user_profile.id
                        FROM user_post
                        INNER JOIN user_profile ON user_profile.id in (${result.map((item) => item.id)}) LIMIT ${[posts.limit]};`;
                console.log(sqlQuery);
                db.queryDB(sqlQuery, (result) => {
                    console.log(result);
                    return res.status(200).json(result);
                });
            });
        })
    }
});
    
export default router;