import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CurrentUser } from '../App'
import { fetchData } from '../library';


export default function Chat() {

    const [socket, setSocket] = useState({});
    const [messageCount, setMessageCount] = useState(0);
    const {currentUser, setCurrentUser} = useContext(CurrentUser);
    let [friendsList, setFriendsList] = useState([]);
    const [messageReceived, setMessageReceived] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(0);
    const [currentFriendID, setCurrentFriendID] = useState(0);
    const [currentMessageContent, setCurrentMessageContent] = useState('');
    const navigate = useNavigate();
    
    function showMessages(conversation_id, friend_id) {
        setCurrentConversationId(conversation_id);
        setCurrentFriendID(friend_id);

        const newArray = friendsList.map(item => {
            if (item.conversation_id == conversation_id) {
                return { ...item, messageCount: 0};
            } 
            else
              return item;
        });

        setFriendsList(newArray);

        console.log(currentConversationId);
        console.log(currentFriendID);
        fetchData("http://localhost:5078/messages", "GET", "application", `type=getMessages&conversation_id=${conversation_id}`, setMessageReceived);
    }

    function sendMessages() {
        if(currentMessageContent === "" || currentConversationId === 0){
            return;
        }
        console.log(socket);
        document.getElementById("input-section").value = "";
        // setMessageReceived(messageReceived => [...messageReceived, ({ from_id: currentUser, message_content: currentMessageContent })]);
        socket.send(JSON.stringify({
            type: "message",
            myID: currentUser,
            conversation_id: currentConversationId,
            friend_id: currentFriendID,
            message: currentMessageContent
        }));
        console.log("done");
        setCurrentMessageContent("");
    }

    
    useEffect(() => {
        if(currentUser === 0){
            navigate("/login");
        }
        fetchData("http://localhost:5078/messages", "GET", "application", `type=getAddFriendList&myID=${currentUser}`, setFriendsList);
        setSocket(new WebSocket(`ws://localhost:5078/id=${currentUser}`));
    }, [])
    
    socket.onopen = () => {
        console.log("websocket client connected");
    };

    socket.onmessage = (data) => {
        data = JSON.parse(data.data);
        console.log(data);
        if(currentConversationId !== data.conversation_id){
            const newArray = friendsList.map(item => {
              if (item.conversation_id == data.conversation_id) {
                return { ...item, messageCount: item.messageCount + 1};
              } 
              else {
                return item;
              }
            });
            setFriendsList(newArray);

            console.log(friendsList);
        }
        else{
            delete data.conversation_id;
            setMessageReceived(messageReceived => [...messageReceived, data]);
        }
    };        
    

    return (
      <div className='flexdb'>
        <div className="friends-section">
              <ul>
                  {friendsList.map((friend) => (
                    <li className='flexdb friendItem' key={friendsList.indexOf(friend)}>
                      <div className="lft">
                          <Link to={`/profile/${friend.id}`}>
                              <img src={friend.account_image} alt={`${friend.user_name} Image`} />
                          </Link>
                      </div>
                      <div className="rght">
                          <p onClick={(e) => showMessages(friend.conversation_id, friend.id)}>{friend.user_name}</p>
                          <span className='circle'>{(friend.messageCount === 0) ? "" : friend.messageCount}</span>
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
                  <div className="left-side" key={messageReceived.indexOf(message)}>
                      <span>me: {message.message_content}</span>
                  </div>
                  :
                  <div className="right-side" key={messageReceived.indexOf(message)}>
                      <span>your friend: {message.message_content}</span>
                  </div>
                ))}
            </div>
            <div className="input-section">
                <input 
                  type="text"
                  id='input-section'
                  placeholder='Write your Message...'
                  onKeyUp={(e) => {
                    if(e.key === "Enter")
                        sendMessages();
                    else
                        setCurrentMessageContent(e.target.value)
                  }}
                />
                <button type='button' onClick={(e) => sendMessages()}>Send</button>
            </div>
        </div>
      </div>
    )
}
