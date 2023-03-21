import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUser } from '../App';
import {fetchData, validateEmail} from '../library';


export default function LogIn() {

  const {currentUser, setCurrentUser} = useContext(CurrentUser);
  const navigate = useNavigate();

  function checkServerResponse(response, currentUser){
    // response = JSON.parse(response);
    if(response.existed === true){
      if(response.authenticated == true){
        // to NewsFeed
        setCurrentUser(response.profileId);
        localStorage.setItem("currentUser", JSON.stringify(response.profileId));
        navigate(response.redirectTo);
        return;
      }
      else{
        // to /login
        navigate(response.redirectTo);
        return;
      }
    }
    else{
      // to /login
        navigate(response.response.redirectTo);
        return;
    }
  }
  
  function logIn() {
    let email = (document.getElementById("email")).value;
    let password = (document.getElementById("password")).value;
  
    fetchData("http://localhost:5078/login", "GET", "application", `email=${email}&password_hash=${password}`, checkServerResponse);
  }

  useEffect(() => {
    if(JSON.parse(localStorage.getItem("currentUser")))
      navigate("/logout");
  })

  return (
    <section>
      <div className="login-page">
        <div className="image">
          <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGhvbmV8ZW58MHx8MHx8&w=1000&q=80" alt="Registration Image" />
        </div>
        <div className="register">  
          <h2>Chat App</h2>
          <span>Log In Up to show any brand new</span>
          <hr />

          <form>
            <div className="form-floating input-field">
              <input type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => validateEmail(e.target.value)}/>
              <label>Email Address</label>
            </div>

            <div className="form-floating input-field">
              <input type="password" className="form-control" id="password" placeholder="Password" />
              <label>Password</label>
            </div>

            <button type='button' className='btn btn-primary sign-up-btn' onClick={(e) => logIn()}>Log In</button>

            <hr />

            <p>Forget Password?</p>

            <Link to="/register">Do you want to sign up? Click here</Link>

          </form>
        </div>
      </div>
    </section>
  )
}
