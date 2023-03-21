import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CurrentUser } from '../App';
import { fetchData } from '../library';
import CreatePost from './CreatePost';
import FriendsList from './FriendsList';
import Post from './Post';
import SiteHeader from './SiteHeader';

export default function NewsFeed(){
  
  const navbar = ["NewsFeed", "Groups"];
  const postsLimit = 20;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  
  let {currentUser, setCurrentUser} = useContext(CurrentUser);

  useEffect(() => {
    if(currentUser === 0)
      navigate("/login");
    console.log(currentUser);
    fetchData("http://localhost:5078/", "GET", "application", `accountID=${currentUser}&limit=${postsLimit}`, setPosts);
  }, [])
  
  return (
    <section>
      <SiteHeader />
      <div className="main">
        <nav className='left-panel'>
            {navbar.map((item) => <Link to={item.toLowerCase()} key={navbar.indexOf(item)}><li>{item}</li></Link>)}
        </nav>

        <div className="newsfeed">
          <CreatePost />
          {posts.map((post) => <Post key={posts.indexOf(post)} post={post} />)}
        </div>

        <FriendsList />
      </div>
    </section>
  )   
}