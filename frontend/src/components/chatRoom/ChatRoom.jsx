
import { useState, useEffect, useRef } from "react";
import ChatWindow from "./ChatWindow";
import GroupChats from "./GroupChats";
import GroupSearch from "./GroupSearch"
import { useAuth } from "../authentication/useAuth";

import {io} from 'socket.io-client'

const socket = io('http://localhost:3000')

function ChatRoom({styles, chatWindowStyle, groupSearchStyle}) {

  //--------State Varaibles--------
  //list of text messages
  const [messages, setMessages] = useState([])
 

  //input info for the textbar
  const [inputValue, setInputValue] = useState('')

  //input info for the join room field
  const [joinRoomInput, setJoinRoomInput] = useState('')
 // const [joinRoomError, setJoinRoomError] = useState('')

  //input info for the create room field
  const [createRoomInput, setCreateRoomInput] = useState('')
 // const [createRoomError, setCreateRoomError] = useState('')

  //the current chat
  const [chat, setChat] = useState({})
  const [currentRoomID, setcurrentRoomID] = useState ('')

  //keeps track of if the user is connected to a group/user or not
  const [isChatting, setIsChatting] = useState(true)

  //--------Reference for the most recent message--------
  const lastMessageRef = useRef(null)

  const scrollToMessage = () => {
    const currentMessage = lastMessageRef
    if(currentMessage.current) {
      currentMessage.current.scrollIntoView({behavior: 'smooth'})
    }
  }


//--------Handling sliding navbar--------
const toggleMenu = () => {
  setMenu(prevMenu => !prevMenu)
}






//----------Handling groupchat functions--------
//const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;

  const searchForRoom = (e) => {
    e.preventDefault()
    socket.emit('joinRoom', joinRoomInput)

    setJoinRoomInput('')
  }

  const createGroupChat = (e) => {
    e.preventDefault()

    const newGroupChat = {
      name: createRoomInput,
      id: new Date().toISOString().slice(14).replace(/[:.]/g, ''),
      members: socket.id,
      chatHistory: []
    }

    socket.emit('createGroupChat', newGroupChat)
    setCreateRoomInput('')
  }

  //waits for socket.io's recieving message event, then runs the function mentioned above
  useEffect(() => {
    //-------Socket.io event listening functions---------

    const handleRecieving = (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage])

    }

    const showNewGroupChat = (newRoom) => {
      setIsChatting(true)
      setcurrentRoomID(newRoom.id)
      setChat({name:newRoom.name, id:newRoom.id})
      setMessages(newRoom.chatHistory)
      console.log(newRoom.chatHistory)
    }

    socket.on('recieving',handleRecieving)
    socket.on('newGroupChat', showNewGroupChat)
    socket.on('joinRoomSuccess', showNewGroupChat)

    return () => {
      socket.off('recieving', handleRecieving)
      socket.off('newGroupChat', showNewGroupChat)
      socket.off('joinRoomSuccess', showNewGroupChat)
    }

  }, [])

  useEffect(() => {
    scrollToMessage()
  }, [messages])

//handles sending texts
  const handleSubmit = (e) => {
    e.preventDefault()

    const newMessage = {
      sender: socket.id,
      value: inputValue,
      sentAt: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Ensures AM/PM format
      }),
      id: `${chat}-${messages.length + 1}`
    }

    socket.emit('sending', newMessage, currentRoomID)

    if(inputValue !== "") {
      setMessages(prevMessages => [...prevMessages, newMessage])
    }

    setInputValue("")

  }

//have the user send the message, and let server return an object. if the user's id is in the sender part, make the class recieving, else, make it sending

  return (
    <div className={styles.parent}>
        <div className={styles.menu}>
          <GroupSearch
            styles={groupSearchStyle}
            searchForRoom={searchForRoom}
            createGroupChat={createGroupChat}
            setcreateRoomInput={setCreateRoomInput}
            setJoinRoomInput={setJoinRoomInput}/>
          <GroupChats styles={styles}/>
          <button className={styles.logout}>Logout</button>
        </div>
      
        {isChatting && (<ChatWindow
        socket ={socket}
        chat={chat}
        messages={messages}
        handleSubmit={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        lastMessageRef={lastMessageRef}
        styles= {chatWindowStyle}/>)}     
    </div>
  )
}

export default ChatRoom

