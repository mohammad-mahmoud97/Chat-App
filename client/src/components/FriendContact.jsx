import React from 'react'

export default function FriendContact({friendContact}) {
  return (
    <div className="contact">
      <img src={friendContact.accountImage} alt="friend" />
      <p>{friendContact.accountName}</p>
    </div>
  )
}
