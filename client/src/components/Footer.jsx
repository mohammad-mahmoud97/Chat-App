import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {

  const footer_options = [
    "Meta"
    ,"About"
    ,"Blog"
    ,"Help"
    ,"API"
    ,"Privacy"
    ,"Terms"
    ,"Top Accounts"
    ,"Locations"
    ,"Contact Uploading", 
    "Non-Users"];


  return (
    <footer>
      <div className="container-fluid px-5 foot">
        {footer_options.map((item) => <p key={footer_options.indexOf(item)}>{item}</p>)}
      </div>
      <p>English . ©{new Date().getFullYear()} Chat App</p>
    </footer>
  )
}
