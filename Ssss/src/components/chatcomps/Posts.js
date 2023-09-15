import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import {BiSolidShareAlt} from 'react-icons/bi'
import {useState, useEffect, useRef} from 'react'
import ElapsedTime from './timeStamp';
import axios from 'axios'
import Comments from './comments'
import {Like} from './likeRequest'
import Cookies from 'universal-cookie';
import io from 'socket.io-client';
import VideoPlayer from './VideoPlayer'


const socket = io('http://localhost:5000');
export default function Post (props) { 
    const [imageData, setImageData] = useState(null)
    const [liked, setLiked] = useState( props.liked !==undefined? props.liked !==0 : 0 )
    const [likesCounter, setLikesCounter] = useState(props.likes)
    const [comment, setComment] = useState("")
    const [status, setStatus] = useState([])
    const submitRef = useRef(null)
    const unixTime =  Date.parse(props.creation)
    useEffect(() => {
        // Fetch the image data from the API endpoint
        axios.get(`http://localhost:5000/api/uploads/${props.posts_content}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const reader = new FileReader();
          reader.onload = () => {
            setImageData(reader.result);
          };
          reader.readAsDataURL(response.data);
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
      }, []);


      async function getToken() {
        const cookies = new Cookies();
        return cookies.get('_auth');
      }


      const handleClick = ()=> {
        
        if (liked) {
            setLikesCounter(prevValue => prevValue-1)
            Like("posts", -1, props.posts_id)
        }
        else {
            setLikesCounter(prevValue => prevValue+1)
            Like("posts", 1, props.posts_id)
        }
        setLiked(!liked)
      }


      const handleChange = (e) => {
        setComment(e.target.value)
      }
      
      const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await getToken()
        const messageData = {
          token: token, 
          comment: comment,
          post_id: props.posts_id
        }
        socket.emit('Comment', messageData)
        setComment("")
      }


      const handleKeyDown =(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          submitRef.current.click()
        }
      }

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
        socket.on('knowStatus', (status) => {
           setStatus(status)
           return () => {
            socket.disconnect();
          }; 
        })
      }, [])

  return (
    <form onSubmit={handleSubmit} key={props.posts_id} className="w-[23%] h-auto bg-[#1e293b] flex flex-col p-3 space-y-3 rounded-md " >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img 
                            src={props.pfp}
                            alt="profile pic"
                            className="w-9 h-9 rounded-full object-cover object-center "></img>
                        {
                                (() => {
                                const userStatus = status.find((status) => status.username === props.username);
                                if (userStatus) {
                                    return userStatus.isActive === 0 ? null : <div className="bg-green-600 rounded-full w-3 h-3 absolute bottom-0 right-1 "></div> ;
                                }
                                })()
                         }
                      </div>
                        <span className="text-white "> {props.username} <span className="text-[#909199]"><ElapsedTime timestamp={unixTime}></ElapsedTime></span></span>
                    </div>
                    <span className="text-white break-words">{props.caption}</span>
                    {
                      props.type === "mp4" && imageData!==null?
                      <VideoPlayer 
                      video={imageData} 
                      style=" max-h-[384px] max-w-[384px] object-fit object-center rounded-md"
                      content = "true"
                      ></VideoPlayer>
                      :
                      <img 
                        src={imageData} 
                        alt="profile pic"
                        className="  w-96 h-96  object-fit object-center rounded-md "></img>
                    }
                    
                    <div className="flex space-x-3">
                        {
                             liked? 
                            <AiFillHeart onClick={handleClick} className="cursor-pointer" size="29" color="#ff3040"> </AiFillHeart>
                            :
                            <AiOutlineHeart onClick={handleClick} className="cursor-pointer" size="29" color="white"></AiOutlineHeart>
                        }
                        
                        <BiSolidShareAlt className="cursor-pointer" size="29" color="white"></BiSolidShareAlt>
                    </div>
                    <span className="text-white ">{likesCounter} Likes</span>
                    {
                        props.comments.map((comment) => {
                            if(comment.post_id === props.posts_id)
                            {
                                return <Comments key={comment.comment_id}  {...comment} status={status}></Comments>
                            }
                        })
                    }
                    <textarea
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    value={comment}
                    placeholder="Add a comment..."
                    className="py-2  bg-transparent rounded-xl outline-none text-white placeholder-white resize-none overflow-hidden"
                    />
                    <button ref={submitRef} className="hidden" type="submit"></button>
  </form>
  )
}
