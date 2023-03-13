import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { CurrentUser } from '../App.jsx';
import { fetchData } from '../library.jsx'
import CreatePost from './CreatePost';
import FriendContact from './FriendContact';
import FriendsList from './FriendsList';
import Post from './Post';
import SiteHeader from './SiteHeader';

function Profile() {
  
  const [userProfile, setUserProfile] = useState({coverPage: "data:image/jpeg;base64,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"});
  // const [myFriends, setMyFriends] = useState([{ accountImage: "", accountName: "mohamed" }]);
  const [posts, setPosts] = useState([]);
  const {currentUser, setCurrentUser} = useContext(CurrentUser);
  const {id} = useParams();
  const [sentBefore, setSentBefore] = useState(false);
  const navigate = useNavigate();

  function RequestSent(param) {
    if(param.sentBefore === true)
      setSentBefore(true);
    else
      setSentBefore(false);
  }

  function addFriend(){
    fetchData("http://localhost:5001/friendsRequests", "GET", "application", `type=sendAddFriendRequest&fromID=${currentUser}&friendID=${id}`, RequestSent);
  }

  useEffect(() => {
    if(currentUser === 0)
      navigate("/login");
    fetchData(`http://localhost:5001/profile/${id}`, "GET", "applications", `type=accountPost`, setPosts);
  }, []);
  
  return (
    <div>
      <SiteHeader />
      <main className='d-flex'>
        <div className="left-pane">
          <div className="cover-page">
            <img src={userProfile.coverPage} alt="Cover Page" />
          </div>
          <div className='friends-posts'>
            <div className="friends-area">
              <h1>Friends</h1>
              <hr />
              <div className="friends">
                {/* {myFriends.map((friend) => <FriendContact friendContact={friend}/>)} */}
              </div>
            </div>

            {
              (id !== currentUser) ?
                (sentBefore === true) 
                  ? 
                    <button type='button' className='btn btn-primary'> Add Friend Request sent</button>
                  :
                    <button type='button' className='btn btn-primary' onClick={(e) => addFriend()}>Add Friend</button>
              :
              <></>
            }

            <div className="posts-area">
              { (id == currentUser) ? <CreatePost />: <></>}
              {posts.map((post) => <Post post={post} />)}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <FriendsList />
        </div>
      </main>
    </div>
  )
}


export default Profile;