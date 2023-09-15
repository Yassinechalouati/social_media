import axios from 'axios'
import Cookies from 'universal-cookie';
import io from 'socket.io-client';
import {useState, useEffect} from 'react'
import ElapsedTime from './timeStamp';
import convertToEmojis from './emojiConverter';

const socket = io('http://localhost:5000');

export default function Contact (props) {

   const [lastMessage, setLastMessage] = useState(props.message)
   const [sentAt, setSentAt] = useState({
    username: props.username,
    time: props.last_sentAt
})
   const [seen, setSeen]= useState(props.seen)
   const unixTimestamp = Date.parse(sentAt.time)
   const cookies = new Cookies();

   const [user, setUser] = useState(props.last_sender)

   async function getToken() {
    return cookies.get('_auth');
  }
  async function getUsername() {
    return cookies.get('_auth_state').username;
  }
  
   
    async function loadChat (){
        const [token] = await Promise.all([getToken()]);
        props.setInfo({...props.info, username: props.username, pfp: props.pfp, isActive: props.isActive})
        try{
            const response = await axios.post('http://localhost:5000/loadchat', {
                token: token,
                username: props.username
            })
            if (response.data.message === "No messages!") {
                console.log("no messages")
            }
            else {
                props.chat( 
                    response.data.message
                )
                
            }
        }
        catch(err) {
            console.error(err)
        }
        
    }

    async function fetching() {
        const [username] = await Promise.all([getUsername()]);
        if (props.last_sender ==="User") {
            
            if (props.image_sent !== null && props.image_sent !== "")
            {
                setLastMessage('You sent a photo')
            }
            else {
                setLastMessage('You: '+props.message)
            }
       
       }
       else {
        if (props.image_sent !== null && props.image_sent !== "")
            {
                setLastMessage(props.username+' sent a photo')
            }
            else {
                setLastMessage(props.message)
            }
       } 
       
      
        socket.on('receiveMessage', (message) => {
                if( message.RECEIVER === props.username && message.SENDER === username )
            {
                setUser("User")
                if(message.image_sent !== null && message.image_sent !== "") {
                    setLastMessage("You sent a photo")
                    
                }
                else {
                    setLastMessage("You: "+message.message)
                }
                setSeen(message.seen)
                setSentAt({
                    username: message.RECEIVER,
                    time: message.sentAt
                })
                
                
        }
            else if (  message.SENDER === props.username && message.RECEIVER === username)
            {
                setUser("Other")
                if(message.image_sent !== null && message.image_sent !== "") {
                    setLastMessage(message.SENDER+" sent a photo")
                    
                }
                else {
                    setLastMessage(message.message)
                    
                }
                setSeen(message.seen)
                setSentAt({
                    username: message.SENDER,
                    time: message.sentAt
                })
                
            }
        });
    
        return () => {
          socket.disconnect();
    
        };
    }
    
    useEffect(() => {
        fetching()
      }, []);

     //el back yékhdém jawou béhi problem fél affichage taaaa el nokta zar9a , tekhdem ki nreloadi


     async function changingSeen ()  {
        if ( user==="Other" ) {
            if(props.seen===0 && props.focus === true && (props.username === props.info.username )) 
            {
                console.log( "info username:", props.info.username, "username: ", getUsername())     
                const [token] = await Promise.all([getToken()])
                const date = new Date(); // Creates a Date object representing the current date and time

                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                console.log(formattedDate); // Outputs: "2023-08-06 22:29:57" // Outputs: "2023-08-06 22:29:57"
                const messageData = {
                    token: token,
                    selected_username: props.info.username,
                    time: formattedDate
                }           
                socket.emit('Seen', messageData)
                console.log("seen value:", seen === 1)
                return () => {
                    socket.disconnect();
              
                  };
            }
        }
     }

     useEffect(() => {
        
        changingSeen()
     }, [props.focus, user])
     



    return (
        <div  onClick={loadChat} className={`group bg-[#1e293b] w-[100%] h-[93px] flex items-center pr-3 justify-evenly rounded-2xl cursor-pointer shadow-md hover:bg-[#9cb09f] `}>
                <div className="relative"> 
                    <img src={props.pfp} className="w-16 h-16 rounded-full object-cover object-center" alt="pic here!"></img> 
                    {
                                (() => {
                                const userStatus = props.status.find((status) => status.username === props.username);
                                if (userStatus) {
                                    return userStatus.isActive === 0 ? null : <div className="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-3 "></div> ;
                                }
                                })()
                         }
                    
                  </div> 
                <div className="flex flex-col w-[70%] mr-8">
                    <span className="text-white ">
                        {props.username}
                    </span>
                    <div className="flex items-center space-x-1 ">
                    <span className="text-[#b1b2bc]  group-hover:text-white text-sm overflow-hidden whitespace-nowrap overflow-ellipsis ">
                        {(props.reaction !== "n" && props.reaction !== undefined && props.username_react !== undefined &&  props.username === props.username_react)? `Reacted ${props.reaction} to your message` : convertToEmojis(lastMessage)}
                    </span >
                     <ElapsedTime timestamp={unixTimestamp} type="contact" />
                    </div>
                    
                </div>
                {(  props.last_sender === "Other")? 
                    (props.seen===0?
                        <div className="rounded-full bg-blue-500 w-4 h-4  "></div>
                        :
                        <div className="w-4 h-4 bg-transparent"></div>
                    )
                    :
                    (props.seen===1?
                        (<img src={props.pfp} className="w-4 h-4 rounded-full object-cover object-center  "></img>)
                        :
                        <div className="w-4 h-4 bg-transparent"></div>
                    )
                }
        </div>


    )
}