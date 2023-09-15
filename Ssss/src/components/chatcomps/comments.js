import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import ElapsedTime from './timeStamp'
import {useState} from 'react'

export default function Comments(props) {
    const unixTime = Date.parse(props.comment_time)
    const [liked, setLiked]= useState(false)
    const [likesCounter, setLikesCounter] = useState(props.likes)
    const handleClick = ()=> {
        if (liked) {
            setLikesCounter(prevValue => prevValue-1)
        }
        else {
            setLikesCounter(prevValue => prevValue+1)
        }
        setLiked(!liked)
      }

  return (
    <div  className="flex relative w-[100%]"> 
                    <div className="flex w-[90%] space-x-1  ">
                        <div className="relative">
                        <img 
                                src={props.pfp} 
                                alt="profile pic"
                                className="w-9 h-9 rounded-full object-cover object-center "></img>
                        {
                                (() => {
                                const userStatus = props.status.find((status) => status.username === props.username);
                                if (userStatus) {
                                    return userStatus.isActive === 0 ? null : <div className="bg-green-600 rounded-full w-3 h-3 absolute bottom-3 right-1 "></div> ;
                                }
                                })()
                         }
                        </div>
                    
                    <div className="flex flex-col ">
                        <div className="flex space-x-2">
                        <span className="text-white font-bold"> {props.username}</span>
                        <span className="text-gray-200 break-words">{props.comment}</span>
                        </div>
                    <div className=" space-x-2">
                            <ElapsedTime timestamp= {unixTime} type="text"></ElapsedTime>
                            <span className="text-[#b1b2bc] text-xs ">{likesCounter} likes</span>
                        </div>
                    </div>
                    </div>
                    {
                            liked ? 
                            <AiFillHeart onClick={handleClick} className="cursor-pointer" size="20" color="#ff3040"> </AiFillHeart>
                            :
                            <AiOutlineHeart onClick={handleClick} className="cursor-pointer" size="20" color="white"></AiOutlineHeart>
                        }
                    </div>
  )
}
