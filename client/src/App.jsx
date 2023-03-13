import React, { useContext, useEffect, useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import NewsFeed from './components/NewsFeed';
import Register from './components/Register';
import LogIn from './components/LogIn';
import Profile from './components/Profile';
import Chat from './components/Chat';
import 'bootstrap/dist/css/bootstrap.css';
import { fetchData } from './library';
import Logout from './components/Logout';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fas } from '@fortawesome/free-solid-svg-icons'

// library.add(fas);

export const CurrentUser = React.createContext(null);
export const UserInputs = React.createContext(null);

function App() {

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")));

  return (
    <div className="App">
      <Routes>
          <Route exact path="/" element={
            <CurrentUser.Provider value={{  currentUser, setCurrentUser }}>
              <NewsFeed />
            </CurrentUser.Provider>
          }/>
          <Route path="/profile/:id" element={
            <CurrentUser.Provider value={{  currentUser, setCurrentUser }}>
              <Profile />
            </CurrentUser.Provider>
          }/>
          <Route path="/register" element={
            <CurrentUser.Provider value={{  currentUser, setCurrentUser }}>
              <Register />
            </CurrentUser.Provider>
          }/>
          <Route path="/login" element={
            <CurrentUser.Provider value={{  currentUser, setCurrentUser }}>
              <LogIn />
            </CurrentUser.Provider>
          }/>
          <Route path="/logout" element={
            <CurrentUser.Provider value={{  currentUser, setCurrentUser }}>
              <Logout />
            </CurrentUser.Provider>
          }/>
          <Route path="/messages" element={
            <CurrentUser.Provider value={{  currentUser, setCurrentUser }}>
              <Chat />
            </CurrentUser.Provider>
          }/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
