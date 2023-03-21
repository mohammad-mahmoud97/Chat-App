import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from '../App';
import { fetchData } from '../library';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SiteHeader() {
    
  const [searchBar, setSearchBar] = useState('');
  const {currentUser, setCurrentUser} = useContext(CurrentUser);
  const navigate = useNavigate();
  const [addFriendCounter, setAddFriendCounter] = useState(0);
  const [addFriendsList, setAddFriendsList] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      fetchData("http://localhost:5078/friendsRequests", "GET", "applications", `type=getAddFriendCounter&myID=${currentUser}`, setAddFriendCounter);
      if(addFriendCounter){
        fetchData("http://localhost:5078/friendsRequests", "GET", "applications", `type=getAddFriendList&myID=${currentUser}`, setAddFriendsList);
      }  
    }, 60000);
  });

  function handleAppoavedRequest(friendID) {
    fetchData("http://localhost:5078/friendsRequests", "GET", "applications", `type=acceptAddFriend&fromID=${currentUser}&friendID=${friendID}`, null);
  }

  function handleRejectedRequest(friendID) {
    fetchData("http://localhost:5078/friendsRequests", "GET", "applications", `type=rejectAddFriend&fromID=${currentUser}&friendID=${friendID}`, null);
  }

  function logout() {
    navigate("/logout");
  }

  return (
    <header className='container-fluid site-head'>
      <Link to="/"><img src="https://cdn.dribbble.com/users/4528464/screenshots/18122024/media/75b68f36516a3201021d750f3b94693a.jpg?compress=1&resize=768x576&vertical=top" alt="Chat App Logo" className='image-logo' /></Link>
      <div className="search-bar">
        {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
        <input type="text" placeholder='Search for Friends' onChange={(e) => setSearchBar(e.target.value)}/>
      </div>
      <div className='notifications'>
        {/* <p><FontAwesomeIcon icon="fa-solid fa-bell" /></p> */}
        {/* <p><FontAwesomeIcon icon="fa-solid fa-comment" /></p> */}
      </div>

      {
        (addFriendCounter > 0) 
          ?
          <div>
            <p>Add Friends Requests</p>
            {/* <div className="select-area"> */}
              {/* <select className="form-select form-select-sm box" aria-label="Small select" id='addFriend'> */}
                {addFriendsList.map((item) => 
                  <div className='flexdb'>
                    <div className="left">
                      <Link to={`/profile/${item.id}`}>
                        <img src={item.account_image} alt="account image" />
                        <p>{item.user_name}</p>
                      </Link>
                    </div>
                    <div className="right">
                      <button type='button' className='btn btn-primary' onClick={(e) => handleAppoavedRequest(item.id)}>Accept</button>
                      <button type='button' className='btn btn-primary' onClick={(e) => handleRejectedRequest(item.id)}>Reject</button>
                    </div>
                </div>)}
              {/* </select> */}
            {/* </div> */}
          </div>
          :
          <div>
            <p>Add Friends</p>
            <div className="select-area">
              <select className="form-select form-select-sm box" aria-label="Small select" id='addFriend'>
                  <p>...</p>
              </select>
            </div>
          </div>
      }

      <button type='button' className='btn btn-primary' onClick={(e) => logout()}>Logout</button>

      <img src="https://cdn.dribbble.com/users/7237996/screenshots/16634670/media/084253889e68142aa697bad24605f9fc.jpg?compress=1&resize=768x576&vertical=top" alt="Profile Image" />
    </header>
  )
}
