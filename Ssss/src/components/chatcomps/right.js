import Chat from '../chatcomps/text'
import {BsImages, BsFillEmojiSmileFill, BsArrowDownCircleFill} from 'react-icons/bs'
import {useRef, useState, useEffect} from 'react'
import {TiDelete} from 'react-icons/ti'
import Cookies from 'universal-cookie';
import io from 'socket.io-client';
import lottie from 'lottie-web'
import no_messages from '../chatcomps/animations/no_messages.json'
import EmojiPicker from 'emoji-picker-react';


const socket = io('http://localhost:5000');
export default function Right ({texts, info, status, setFocus, emojis }) {
    const inputRef = useRef(null)
    const [inputValue, setInputValue] = useState('');
    const [image, setImage] = useState('')
    const [hidden, setHidden] =useState("hidden")
    const [isVisible, setIsVisible] = useState(false)
    const [color, setColor] = useState('white')

    const animationContainer = useRef(null);
    const emojiRef = useRef(null)

    const containerStyle = {
        boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.1)',
      };

    const handleImageChange = (event) => {
        var reader = new FileReader() 
        if (event.target.files.length > 0) {
            reader.readAsDataURL(event.target.files[0])
            reader.onload = () => {
                console.log("lenaaa")
            setImage(reader.result)
        }
    reader.onerror = error => {
      console.log("Error", error)
    }
    }
    else {
      setImage("")
    }

    }

    const handleImageClick =() => {
        inputRef.current.click()
    }

    async function getToken() {
        const cookies = new Cookies();
        return cookies.get('_auth');
      }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const message = inputValue.trim();
        if (message !== "" || (image !== "" && image !== null)) {
          console.log('Input Value:', message)
          const [token] = await Promise.all([getToken()]);
          const messageData = {
            token: token, // Replace with actual sender username
            receiver: info.username, // Replace with actual receiver username
            message: message,
            image: image
          };
      
          socket.emit('sendMessage', messageData);
        }
      
        setInputValue('');
        handleDelete();
      };
      

    const handleChange = (e) => {
        setInputValue(e.target.value);

      };
    
    const handleDelete = () => {
        setImage(null)
        inputRef.current.value = null;
    }

    const chatContainerRef = useRef(null);
    
    const ScrollDown = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const handleScroll = () => {
      const chatContainer = chatContainerRef.current;

      const maxScroll = chatContainer.scrollHeight - chatContainer.clientHeight;
      const tolerance = 1;
      const isScrolledToBottom = chatContainer.scrollTop >= maxScroll - tolerance;
    
      setHidden(isScrolledToBottom ? "hidden" : "");
    };

    const handleEmojiClick = (e) => {
      setInputValue(inputValue+e.emoji.toString())
    }
    

    useEffect(() => {
        ScrollDown()
      }, [texts]);

      useEffect(() => {
        chatContainerRef.current.addEventListener('scroll', handleScroll);
        handleScroll();
      }, []);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg', 
      loop: true, 
      autoplay: true, 
      animationData: no_messages, 

    });

    return () => {
      // Clean up the animation on unmounting the component
      anim.destroy();
    };
  }, [texts]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      console.log("in")
      setColor("white")
      setIsVisible(false)
    }
  };

  
    return (
        <div className="bg-[url(../assets/chat.jpg)]  bg-cover mx-5 h-full w-[68%] rounded-xl relative ">
            {
                info.username?
                <div className="h-[10%] w-[100%] px-14 flex items-center bg-black bg-opacity-50 rounded-t-xl shadow-lg">
                  <div className="relative"> 
                    <img src={info.pfp} className="mr-2 w-16 h-16 rounded-full object-cover object-center" alt="pic here!"></img> 
                    {
                                (() => {
                                const userStatus = status.find((status) => status.username === info.username);
                                if (userStatus) {
                                    return userStatus.isActive === 0 ? null : <div className="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-3 "></div> ;
                                }
                                })()
                         }
                    
                  </div>
                    <div className="flex flex-col w-[100%]">
                        <span className="text-white drop-shadow-lg">
                            {info.username}
                        </span>
                        <span className="text-[#b1b2bc] text-sm drop-shadow-lg  ">
                        {
                                (() => {
                                const userStatus = status.find((status) => status.username === info.username);
                                if (userStatus) {
                                    return userStatus.isActive === 0 ? "Offline" : "Online";
                                }
                                return "Offline"
                                })()
                         }
                        </span>
                        
                    </div>
                </div>
                :
                <div className="h-[10%] w-[100%] px-14 flex items-center bg-black bg-opacity-50 rounded-t-xl  ">
                
                </div>
            }
                
                <div className=" h-[80%] w-[100%] flex-grow overflow-y-auto pt-14 pb-12  scrollbar-hide bg-black bg-opacity-50 " ref={chatContainerRef}> 
                    <div className={`h-full w-[100%] px-14   flex flex-col ${texts.length>0?"": "items-center justify-center"}`} >
                        {
                            texts.length>0?
                            texts.map(text => (
                                <Chat
                                 key={text.message_id} 
                                 info={info} 
                                 {...text} 
                                 length ={texts.length} 
                                 index ={texts.indexOf(text)} 
                                 status={status}
                                 emojis={emojis}
                                 ></Chat>
                            ))
                            :
                            (
                               
                                  [<div key="animation" ref={animationContainer} className="w-[60%] h-[60%] "></div>,
                                  <span key="empty_animation" className="text-3xl text-white "> No messages here!</span>]
                              )


                        }                       
                    </div>
                    <div onClick={ScrollDown} className={`absolute right-1/3 cursor-pointer rounded-full ${hidden} animate-bounce  z-50 `}>
                        <BsArrowDownCircleFill color="#9cb09f" size="40"></BsArrowDownCircleFill>
                    </div>
                    
                </div>
                
                <div className="h-[10%]  bg-black bg-opacity-50 px-14 rounded-b-xl flex items-center justify-evenly " style={containerStyle}> 
                    <form onSubmit={handleSubmit} className="w-[90%] flex border-[2px] border-[#9cb09f] rounded-xl  ">
                        {
                            image !== null && image !== ""?
                            [<div className="relative" key="picture">
                                <TiDelete onClick={handleDelete} className="absolute right-0 top-0 cursor-pointer" size="25"></TiDelete>
                                <img src={image} className="w-14 h-14 rounded-xl object-cover object-center" alt="pic here"></img>
                            </div>
                        ]
                            :
                            ""
                        }
                        
                        
                        <input 
                        placeholder="Type something..." 
                        type="text" 
                        value={inputValue}
                        onFocus={() => {
                          setFocus(true)
                        }}
                        onBlur={() => {
                          setFocus(false)
                        }}
                        className="px-5 py-4 w-[96%] bg-transparent rounded-xl outline-none text-white placeholder-white "
                        onChange={handleChange}
                        >
                        </input>
                        <div className="flex flex-col items-center justify-center cursor-pointer mr-5 " ref={emojiRef}>
                            <BsFillEmojiSmileFill size="25" color={color} onClick={() => {
                              setIsVisible(!isVisible)
                              setColor("#9cb09f")
                            }}></BsFillEmojiSmileFill>
                            {isVisible? <div className="absolute bottom-20 " >
                              <EmojiPicker height={450} theme='dark' searchDisabled={true}  onEmojiClick={handleEmojiClick}></EmojiPicker> 
                              </div> 
                              : 
                              null}
                        </div>
                        

                    </form>
                    
                    <div className="p-4 bg-[#9cb09f] rounded-xl cursor-pointer" onClick={handleImageClick}>
                        <BsImages size="25" color="white"></BsImages>
                        <input
                        type="file" 
                        className="hidden"
                        name="image" 
                        accept="image/*"
                        size="5000000" 
                        ref={inputRef} 
                        onChange={handleImageChange}
                        >
                        </input>
                    </div>         
                </div>
            </div>
    )
}