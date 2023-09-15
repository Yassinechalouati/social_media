import Left from '../components/chatcomps/left';
import Middle from '../components/chatcomps/middle'
import Right from '../components/chatcomps/right'
import Placeholder from '../components/chatcomps/right_placeholder'
import {useState, useEffect} from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';
import io from 'socket.io-client';
import animation_message from '../components/chatcomps/animations/animation_message.json'
import Modal from '../components/chatcomps/modal'





const socket = io('http://localhost:5000');
export default function  Chat() {

    const [texts, setTexts] = useState([])


    const [middlecontent, setMiddleContent] =useState([])
    const [user_pfp, setUser_pfp] =useState('')
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState({
        username:"",
        pfp:"",
        isActive:0
    })
    const [status, setStatus] = useState([])
    const [focus, setFocus] = useState(false)
    const emojis = ['❤️', '😂', '😮', '😢', '😠', '👍' ]
    
    const cookies = new Cookies();
    

    async function getToken() {
      return cookies.get('_auth');
    }
    
    

    async function fetchData() {
   
        try {
          setLoading(true)
          
          const token = await getToken()
            const response = await axios.post('http://localhost:5000/info', {
            token: token
          });

          const middle= await axios.post('http://localhost:5000/loaddata', {
            token: token
          });

          setUser_pfp(response.data.message)
          setMiddleContent(middle.data.message)
     
        } catch (err) {
          console.log(err);
        }
        finally {
 
          setLoading(false)

            
        }
       
      }
      

    useEffect(()  => {
        fetchData()

    },[])

    useEffect(() => {
      socket.on('knowStatus', (status) => {
         setStatus(status)
         
         return () => {
          socket.disconnect();
        }; 
      })
    }, [])

    async function fetchTexts() {
      const cookies = new Cookies();
      const username = cookies.get('_auth_state').username;
      socket.on('receiveMessage', (message) => {
        console.log("message: ", message)
        setTexts((prevMessages) => [...prevMessages, message])
        console.log("texts: ", texts)
            setMiddleContent((prevContent) =>
            prevContent.map((content) => {
            if (content.username === message.SENDER && username=== message.RECEIVER ) {
              return { ...content, last_sentAt: message.sentAt, message: message.message, image_sent: message.image_sent, last_sender:"Other", seen:message.seen, message_id: message.message_id };
            }else if(content.username === message.RECEIVER && username === message.SENDER) {
              return { ...content, last_sentAt: message.sentAt, message: message.message, image_sent: message.image_sent, last_sender:"User", seen:message.seen, message_id: message.message_id };
            }
            else {
              return content;
            }
          }).sort((a, b) => new Date(b.last_sentAt) - new Date(a.last_sentAt))
        )
      })
      socket.on('onSeen', (message) => {
        setTexts((prevContent) => {
          const lastIdx = prevContent.length - 1;
          if (lastIdx >= 0 && message.message_id === prevContent[lastIdx].message_id) {
            const updatedContent = [...prevContent];
            updatedContent[lastIdx] = { ...updatedContent[lastIdx], seen: 1, seen_time: message.seen_time};
            return updatedContent;
          } else {
            return prevContent;
          }
        });
        setMiddleContent((prevContent) =>  
          prevContent.map((content) => {
            if (content.message_id === message.message_id ){
              console.log("found it ")
              return {...content, seen:1}
            }
            else {
              return content
            }
          })
        )
        
      });
      return () => {
        socket.disconnect();
      };
    }

    useEffect(() => {
      fetchTexts()
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        const [token] = await Promise.all([getToken()]);
        const status = {
          token: token,
          isActive: 1
        };
        socket.emit('status', status);
    
        // Set the user offline when the component unmounts
        return () => {
          const offlineStatus = {
            token: token,
            isActive: 0
          };
          socket.emit('status', offlineStatus);
          socket.disconnect();
        };
      };
    
      fetchData();
    }, []);

    useEffect(() => {
      socket.on('onReaction', (messageData) => {
        console.log(messageData)
        setTexts((prevContent) =>  
          prevContent.map((content) => {
            if (content.message_id === messageData.message_id ){
              return {...content, receiver_liked: messageData.reaction}
            }
            else {
              return content
            }
          })
        )
        setMiddleContent((prevContent) =>  
        prevContent.map((content) => {
          if (content.username === messageData.reactor && cookies.get('_auth_state').username === messageData.username){
            console.log("test: ", cookies.get('_auth_state').username === messageData.username)
            return {...content, reaction: emojis[parseInt(messageData.reaction)], username_react: messageData.reactor}
          }
          else {
            return content
          }
        })
      )
      })
    }, [])

    return (
        <div className="flex bg-[#131b2e] w-screen h-screen ">
            <Left setVisible={setVisible} pfp={user_pfp} loading={loading} visible={visible} color ={"Chat"} ></Left>
            <Middle
             text={texts} 
             info={info} 
             setInfo={setInfo} 
             setText={setTexts} 
             content={middlecontent} 
             setContent={setMiddleContent} 
             loading={loading}
             focus={focus}
             status={status}>
             </Middle>
             {
              loading ?
              <div className=" bg-[#1e293b] animate-pulse bg-cover mx-5 h-full w-[68%] rounded-xl "></div>
              :
              info.username === ""?
              <Placeholder placeholder={animation_message}></Placeholder>
              :
              <Right info={info}
              texts={texts} 
              setInfo ={setInfo}
              setText={setTexts}
              status={status}
              setFocus={setFocus}
              emojis= {emojis}
              >
              </Right>
             }
            {
                visible?
                <Modal setVisible={setVisible} pfp={user_pfp}></Modal>
                :
                null
            }
        </div>
        
    )
}

/*  */