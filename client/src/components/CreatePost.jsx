import React, { useContext, useState } from 'react'
import { CurrentUser } from '../App';
import { fetchData } from '../library';

function CreatePost(){

  const [currentAccountPhoto, setCurrentAccountPhoto] = useState("");
  const [postContent, setPostContent] = useState('');
  const {currentUser, setCurrentUser} = useContext(CurrentUser);

  function postCreate() {
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    fetchData("http://localhost:5078/", "GET", "application", `type=createPost&profileID=${currentUser}&postContent=${postContent}&mediaLocation=""&createdTime=${currentDateTime}`, null);
  }
 
  return (
    <div className="create-post">
        <div className='create-post-header'>
          <img src="" alt="" />
          <input type="text" placeholder="What's on your thoughts?" onChange={(e) => setPostContent(e.target.value)}/>
        </div>
        <div className="creat-post-footer">
          <button type='button' className='btn btn-secondary' onClick={(e) => postCreate()}>Post</button>
        </div>
    </div>
  )
}

export default CreatePost;