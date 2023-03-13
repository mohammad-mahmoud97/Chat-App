import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { CurrentUser } from '../App';
import { fetchData } from '../library';

export default function Post({post}) {

    const currentUser = useContext(CurrentUser);

    function postLike() {
        const profileID = post.id;
        const postID = post.post_id;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        fetchData("http://localhost:5001/", "GET", "application", `type=likePost&profileID=${profileID}&postID=${postID}&createdTime=${currentDateTime}`, null);
    }

    function postComment() {
        const profileID = post.id;
        const postID = post.post_id;
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        fetchData("http://localhost:5001/", "GET", "application", `type=commentPost&profileID=${profileID}&postID=${postID}&createdTime=${currentDateTime}&commentText=dfds`, null);
    }

    return (
    <div className="post">
        <div className="post-header">
          <Link to={`/profile/${post.id}`}><img src={post.account_image} alt="" /></Link>
          <div className="name-time">
            <Link to={`/profile/${post.id}`}><p>{post.user_name}</p></Link>
            <p>{post.created_time}</p>
          </div>
          <span>...</span>
        </div>
        
        <div className="post-content">
          {post.written_text}
        </div>

        <div className="post-reactions">
            <p onClick={(e) => postLike()} className="reaction-link">Like</p>
            <p onClick={(e) => postComment()} className="reaction-link">Comment</p>
            {/* <p onClick={(e) => postShare()} className="reaction-link">Share</p> */}
        </div>
    </div>
  )
}
