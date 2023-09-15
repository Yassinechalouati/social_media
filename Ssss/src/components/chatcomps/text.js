import React from 'react'
import Cookies from 'universal-cookie';
import {useEffect, useState, useRef} from 'react'
import io from "socket.io-client";
import ElapsedTime from '../chatcomps/timeStamp';
import formatTimestampToTime from '../chatcomps/hovertime'
import convertToEmojis from '../chatcomps/emojiConverter'
import {BsEmojiSmile} from 'react-icons/bs'


const socket = io('http://localhost:5000');

export default function Chat(props) {
    const [sentAt, setSentAt] = useState(props.sentAt)
    const [hidden, setHidden] = useState("hidden")
    const [seenHidden, setSeenHidden] = useState("hidden")
    const [emojiHidden, setEmojiHidden] = useState("hidden")
    const [clicked, setClicked] = useState(false);
    const [emojiPicked, setEmojiPicked] = useState(props.receiver_liked)
    const emojiRef = useRef(null);

    const unixTimestamp = Date.parse(sentAt)
    const seenTime = Date.parse(props.seen_time)

    const cookies = new Cookies();
    let username = cookies.get('_auth_state').username;

    let timeoutId = null

    const handleMouseEnter= () => {
       timeoutId = setTimeout(() => {
            setHidden('')
            if (!clicked) {
            setEmojiHidden("")
        }
            
        }, 400)
    }
    
    const handleMouseLeave = () => {
        console.log("left")
        clearTimeout(timeoutId)
        setHidden('hidden')
        if (!clicked) {
        setEmojiHidden("hidden")
        }
       
       
        
    }

    const handlerMouseEnter= () => {
        timeoutId = setTimeout(() => {
             setSeenHidden('')
         }, 400)
     }
     
     const handlerMouseLeave = () => {
         clearTimeout(timeoutId)
         setSeenHidden('hidden')
     }

     const handleDoubleClick = () => {
        console.log("Double clicked")
     }
    
     const handleClick =(event) => {
        setHidden("hidden")
        event.stopPropagation();
        setClicked(true);
        setEmojiHidden("hidden")
        
     }
     



     const emitReaction = (messageData) => {
        
        if (socket.connected) {
          socket.emit("React", messageData);
        } else {
          // If socket is not connected, wait for the 'connect' event and then emit
          socket.once("connect", () => {
            socket.emit("React", messageData);
          });
        }
      };
     

     
     const handleEmojiClick = (index) => {
        console.log(props.emojis[index]);
        console.log(index.toString() === emojiPicked);
        console.log(props.message_id)
        let messageData
        
        setHidden("hidden");
    
        if (index.toString() === emojiPicked) {
            setEmojiPicked("n");
            messageData = {
                message_id: props.message_id,
                reaction: "n",
                username:props.info.username,
                reactor: username
              };
        } else {
            setEmojiPicked(index.toString());
            messageData = {
                message_id: props.message_id,
                reaction: index.toString(),
                username:props.info.username,
                reactor: username
              };

        }
        emitReaction(messageData)
        setClicked(false);


    };

    // lezmni nal9a 7al best tékhdém el emit melowl maghir manrefreshi, el useeffect 7al ama 9a3da tékhdém ala kol message 9a3d yetrendra.

  
    /*useEffect(() => {
        socket.on('receiveMessage', (message)=> {
            setSentAt(message.sentAt)
    })
    
    return () => {
        socket.disconnect();
    };
    }, [])
 */
   
    



    useEffect(() => {
        // Add a click event listener to the document to handle clicks outside the emoji div
        document.addEventListener('click', handleDocumentClick);

        // Clean up the event listener when the component unmounts
        return () => {
        document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (event) => {
        // Check if the click target is within the emoji div or its children
        setHidden("hidden")
        if ((emojiRef.current && !emojiRef.current.contains(event.target))) {
                setEmojiHidden('hidden');
                setHidden("hidden")
                setClicked(false); // Reset the clicked state
            }
    };
    return(
        (username === props.RECEIVER && props.info.username === props.SENDER) || (username === props.SENDER && props.info.username === props.RECEIVER)?
        <div key={`${props.message_id}`} className="flex flex-col pb-4 "  > 
            {
                props.SENDER ===username?
                [(props.message !== ""? 
                <div className=" flex space-x-3 items-center"> 
                    <div  className={`bg-[#cacacb] text-sm rounded-2xl p-3 break-words ml-auto max-w-[60% ] transition-opacity ease-in duration-200 ${
                            hidden ? 'opacity-0' : 'opacity-100'
                        }`}
                    >{formatTimestampToTime(props.sentAt)}</div>
                    <div
                    key="User"
                    className={`bg-[#9cb09f] rounded-2xl p-3 break-words text-white ${props.receiver_liked !=="n"? "mb-6" :""} max-w-[60%] relative   `}
                    onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                    >
                    {convertToEmojis(props.message)}
                    {props.receiver_liked !=="n"?
                        <div className={`flex space-x-3 rounded-full bg-[#131b2e] p-2 cursor-pointer absolute  right-0 z-50`}>
                            {props.emojis[parseInt(props.receiver_liked)]}
                        </div>
                        :
                        null}
                    </div>
                    
              </div>
              
                :
                null),
                (props.image_sent !== '' && props.image_sent !==null ?
                    (props.message === ""?
                    <div className=" flex space-x-3 items-center"> 
                        <div  className={`bg-[#cacacb] rounded-2xl p-3 text-sm break-words ml-auto max-w-[60% ] transition-opacity ease-in duration-200 ${
                                    hidden ? 'opacity-0' : 'opacity-100'
                                }`}
                            >{formatTimestampToTime(props.sentAt)}</div>
                        <img key="User_img" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  className="rounded-2xl w-56 h-56  object-cover object-center cursor-pointer" src={props.image_sent} alt="pic here"  ></img>
                    </div>
                        :
                    <img key="User_img" className="rounded-2xl w-56 h-56  object-cover object-center ml-auto cursor-pointer" src={props.image_sent} alt="pic here"  ></img>)
                :
                null),
                props.index === props.length-1 ?
                (props.seen===1?
                    <div className=" flex space-x-3 items-center"> 
                        <div  className={`bg-[#cacacb] h-6 rounded-2xl p-3 py-4 flex items-center text-sm break-words ml-auto transition-opacity ease-in duration-200 ${
                                    seenHidden ? 'opacity-0' : 'opacity-100'
                                }`}
                            >Seen by {props.info.username} at {formatTimestampToTime(props.seen_time)}</div>
                            <img key="seen" onMouseEnter={handlerMouseEnter} onMouseLeave={handlerMouseLeave} src={props.info.pfp} className="w-6 h-6 rounded-full self-end mt-1 object-cover object-center " alt="pic here!"></img>
                    </div>
                :
                <div className="text-[#b1b2bc] text-sm self-end"> Sent <ElapsedTime timestamp={unixTimestamp} type="text" ></ElapsedTime> </div>)
                :
                null
                ]
                 : 
                [<div key="other" className={`flex space-x-3 items-center ${(emojiPicked !=="n" || clicked=== true)? "mb-6" :""}`}>
                    { props.message !== ""?  
                    [<div className="mt-1 relative"> 
                        {
                                (() => {
                                const userStatus = props.status.find((status) => status.username === props.info.username);
                                if (userStatus) {
                                    return userStatus.isActive === 0 ? null : <div className="bg-green-600 rounded-full w-3 h-3  absolute bottom-0 right-2"></div> ;
                                }
                                })()
                         }
                        <img key="other_pic" src={props.info.pfp} className="w-14 h-14 rounded-full object-cover object-center" alt="pic here!"></img>
                    </div>,
                    <div className='max-w-[60%] flex items-center relative z-40  ' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
                        <div
                         onDoubleClick={handleDoubleClick}  
                         key="other_message" 
                         className={`bg-slate-800 rounded-2xl p-3 break-words  text-white  `} >
                            {convertToEmojis(props.message)}
                         </div>
                        <div className={`absolute right-0  rounded-full bottom-0 flex items-center justify-center translate-y-2 `}>
                         {
                            
                            clicked === true?
                            (
                                <div ref={emojiRef} className={`flex space-x-3   rounded-full bg-[#131b2e] p-2 translate-x-20 translate-y-8`}>
                                 {props.emojis.map((emoji, index) => (
                                            <div key={index} className="cursor-pointer" onClick={() => handleEmojiClick(index)}>
                                              {emoji}
                                            </div>
                                          ))}
                                </div>
                            )
                            :
                            (emojiPicked !=="n"?
                            <div ref={emojiRef} onClick={handleClick} className={`flex space-x-3 rounded-full bg-[#131b2e] p-2 cursor-pointer translate-y-5  `}>
                                {props.emojis[parseInt(emojiPicked)]}
                            </div>
                            :
                            null
                            )
                            
                         }
                         {
                            ( emojiHidden !== "hidden" && emojiPicked ==="n" ?
                            <BsEmojiSmile  onClick={handleClick} className={`cursor-pointer`} size="20" color="#b1b2bc" ></BsEmojiSmile>
                            :
                            null
                            )
                         }
                        </div> 
                    </div>,
                    <div className={`bg-[#cacacb] rounded-2xl text-sm p-3 break-words max-w-[60% ] transition-opacity ease-in duration-200 ${
                        hidden ? 'opacity-0' : 'opacity-100'
                      }`}
                >{formatTimestampToTime(props.sentAt)}</div>]
                    :
                    null}
                    
                 </div>,
                 (props.image_sent !== '' && props.image_sent !==null ?
                 <div key="pic" className="flex space-x-3 items-center">
                    { props.message === ""?  
                        [
                            <div className="mt-1 relative self-end"> 
                                {
                                        (() => {
                                        const userStatus = props.status.find((status) => status.username === props.info.username);
                                        if (userStatus) {
                                            return userStatus.isActive === 0 ? null : <div className="bg-green-600 rounded-full w-3 h-3 absolute bottom-0 right-2 "></div> ;
                                        }
                                        })()
                                }
                                <img key="other_pic" src={props.info.pfp} className="w-14 h-14 rounded-full object-cover object-center" alt="pic here!"></img>
                            </div>,                            
                            <img key="img2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="rounded-2xl w-56 h-56 self-start object-cover object-center cursor-pointer" src={props.image_sent} alt="pic here"  ></img>,
                            <div className={`bg-[#cacacb] rounded-2xl text-sm p-3 break-words max-w-[60% ] transition-opacity ease-in duration-200 ${
                                hidden ? 'opacity-0' : 'opacity-100'
                              }`}
                        >{formatTimestampToTime(props.sentAt)}</div>
                        ]
                        :
                        [
                            <div key="img1" className="w-14 h-14 rounded-full mt-1 object-cover object-center transparent" ></div>,
                            <img key="img2" className="rounded-2xl w-56 h-56 self-start object-cover object-center" src={props.image_sent} alt="pic here"  ></img>
                        ]
                    }
                    
                 </div>
                 :
                 null)]
            }
            
        </div>
        :
        null
        
    )
    
}
