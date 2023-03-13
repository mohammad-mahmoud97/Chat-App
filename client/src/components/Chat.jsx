import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CurrentUser } from '../App'
import { fetchData } from '../library';

export default function Chat() {

    const {currentUser, setCurrentUser} = useContext(CurrentUser);
    const [friendsList, setFriendsList] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(0);
    const [currentMessageContent, setCurrentMessageContent] = useState('');
    const [messageReceived, setMessageReceived] = useState([]);
    const navigate = useNavigate();

    function showMessages(param) {
        setCurrentConversationId(param);
        console.log(currentConversationId);
        fetchData("http://localhost:5001/messages", "GET", "application", `type=getMessages&conversation_id=${param}`, setMessageReceived);
    }

    function sendMessages() {
        fetchData("http://localhost:5001/messages", "GET", "application", `type=sendMessage&myID=${currentUser}&conversation_id=${currentConversationId}&messageContent=${currentMessageContent}`, null);
    }

    useEffect(() => {
        if(currentUser === 0)
            navigate("/login");
        fetchData("http://localhost:5001/messages", "GET", "application", `type=getAddFriendList&myID=${currentUser}`, setFriendsList);
    }, [])

    return (
      <div className='flexdb'>
          <div className="friends-section">
                <ul>
                    {friendsList.map((friend) => (
                      <li className='flexdb friendItem'>
                        <div className="lft">
                            <Link to={`/profile/${friend.id}`}>
                                <img src={friend.account_image} alt={`${friend.user_name} Image`} />
                            </Link>
                        </div>
                        <div className="rght">
                                <p onClick={(e) => showMessages(friend.conversation_id)}>{friend.user_name}</p>
                            </div>
                      </li>
                    ))}
                </ul>
          </div>

          <div className="chat-section">
              <div className="messages-section">
                  {messageReceived.map((message) => (
                    (message.from_id == currentUser)
                    ?
                    <div className="left-side">
                        <span>me: {message.message_content}</span>
                    </div>
                    :
                    <div className="right-side">
                        <span>your friend: {message.message_content}</span>
                    </div>
                  ))}
              </div>

              <div className="input-section">
                  <input 
                    type="text" 
                    placeholder='Write your Message...' 
                    onChange={(e) => setCurrentMessageContent(e.target.value)}
                />

                  <button type='button' onClick={(e) => sendMessages()}>Send</button>
              </div>
          </div>
      </div>
    )
}
