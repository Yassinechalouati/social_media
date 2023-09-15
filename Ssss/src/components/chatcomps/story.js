
import {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import ElapsedTime from './timeStamp';
import FillingBar from './FillingBar'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import {BiSolidShareAlt} from 'react-icons/bi'
import {Like} from './likeRequest'
import VideoPlayer from './VideoPlayer'


export default function Story({setUserStories, userStories, story, setStoryVisibility}) {

  const storyRef = useRef(null)
  const [imageData, setImageData] = useState(null)
  const [liked, setLiked] = useState(story.liked ===undefined? 0 : story.liked !==0)
  const unixTimestamp = Date.parse(story.creation)
  const type = story.story_content.split('.')[1]
  const [duration, setDuration] = useState(8000)
  const [paused, setPaused] = useState(false)
  const [likesCounter, setLikesCounter] = useState(story.likes)
  const [confirmation, setConfirmation ] = useState(false)
  const timeoutRef = useRef(null)
  const iconsRef = useRef(null)
  const videoRef = useRef(null)


  const handleOutsideClick = (event) => {
    if (storyRef.current )
    {
      if ( !storyRef.current.contains(event.target)) {
        clearTimeout(timeoutRef.current)
        setStoryVisibility("")
        setConfirmation(false)
      }
      else if(!iconsRef.current || iconsRef.current.contains(event.target)) {
        console.log("Likkkke")
      }
      else {
        console.log("condition pause:", paused === true )
        setPaused(prevPaused => !prevPaused);
      }
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Fetch the image data from the API endpoint
    axios.get(`http://localhost:5000/api/uploads/${story.story_content}`, {
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
  }, [imageData]);

  

  const handleClick= () => {
    if (liked) {
      setLikesCounter(prevValue => prevValue-1)
      Like("stories", -1, story.story_id)
      setUserStories((prevUserStories) =>
        prevUserStories.map((userStory) =>
          userStory.story_id === story.story_id
            ? { ...userStory, liked: 0, likes: story.likes-1 }
            : userStory
        )
      );
  }
  else {
      setLikesCounter(prevValue => prevValue+1)
      Like("stories", 1, story.story_id)
      setUserStories((prevUserStories) =>
        prevUserStories.map((userStory) =>
          userStory.story_id === story.story_id
            ? { ...userStory, liked: 1, likes: story.likes+1 }
            : userStory
        )
      );
  }
  console.log(userStories)
  setLiked(!liked)
  }
  

console.log("paused: ", paused) 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center">
                <div ref={storyRef} className={`bg-[#1e293b] w-[30%] h-[80%] flex flex-col items-center rounded-lg  relative `} >
                  {
                    type ==="mp4" && imageData !==null ?
                    <VideoPlayer 
                      video={imageData} 
                      style="rounded-lg object-fit object-center w-[100%] h-[100%]"
                      setDuration = {setDuration}
                      setConfirmation = {setConfirmation}
                      videoRef={videoRef}
                      soundRef={iconsRef}
                    ></VideoPlayer>
                    :
                    <img src={imageData}  alt ="story" className=" rounded-lg object-fit object-center w-[100%] h-[100%]"></img>
                  }
                  <div className="flex absolute left-5 top-6 items-center space-x-3 z-10  ">
                    <img
                      src={story.pfp}
                      className=" w-10 h-10 object-cover rounded-full object-center  "
                      alt="pic here!"
                    />
                  <span className="text-white">{story.username}</span>
                  <ElapsedTime timestamp={unixTimestamp} type="text"></ElapsedTime> 
                  </div>
                  <span className="text-white absolute text-xl break-words z-10 top-28 w-[100%] text-center">{story.caption}</span>
                  <div className="absolute top-0 w-[100%] h-[50%] bg-gradient-to-b from-black rounded-t-md "  ></div>
                  <div className="absolute bottom-0 w-[100%] h-[50%] bg-gradient-to-t from-black rounded-b-md "  ></div>
                  {
                      (imageData !==null && confirmation && type ==='mp4' ) ||(imageData !==null && type !=='mp4')? 
                    <FillingBar 
                    setDuration={setDuration} 
                    duration={duration} 
                    paused ={paused} 
                    setStoryVisibility={setStoryVisibility}
                    timeoutId={timeoutRef}
                    type = {type}
                    setConfirmation = {setConfirmation}
                    videoRef= {videoRef}
                    ></FillingBar>
                  : 
                  null
                  }
                  
                  <div
                  className="absolute top-2 z-[9px] left-0 h-1 bg-[#7b7b7b] rounded-md "
                  style={{
                      width: `calc(100% - 40px)`,
                      left: '20px', 
                    }}
                  ></div>
                  <div className="absolute right-5 bottom-28 flex flex-col space-y-4" ref={iconsRef}>
                   {
                    liked ?  
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <AiFillHeart onClick={handleClick} className="cursor-pointer" size="32" color="#ff3040"> </AiFillHeart>
                      <span className="text-white text-sm" >{likesCounter}</span>
                    </div>
                    :
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <AiOutlineHeart onClick={handleClick} className="cursor-pointer" size="32" color="white"></AiOutlineHeart>
                       <span className="text-white text-sm" >{likesCounter}</span>
                   </div>
                    
                  } 

                    <BiSolidShareAlt className="cursor-pointer" size="32" color="white"></BiSolidShareAlt>
                  </div>
                </div>
    </div>
  )
}
