import {HiVolumeUp, HiVolumeOff} from 'react-icons/hi'
import {useState, useRef} from 'react'

export default function VideoPlayer({video, style, content, setDuration, setConfirmation, videoRef, soundRef}) {
  const [muted, setMuted] = useState(true)

  const handleClick = () => {
    setMuted(prevValue => !prevValue)
  }

  const handleVideoLoadedMetaData = () => {
    if (videoRef !== undefined)
     {

       const duration = videoRef.current.duration
       if (setDuration) {
         
         setDuration(duration*1000)
         setConfirmation(true)
         console.log(duration)
       }
     }

  }

  
    
    return (
        <div  className={`${style} relative `}>
        <video
        ref={videoRef}
        onLoadedMetadata={handleVideoLoadedMetaData}
        className="w-[100%] h-[100%]"
        loop={content !=="true"? true  : false }
        autoPlay
        controls = {content ==="true"? true  : false }
        muted= {muted}
      >
          <source src={video} type="video/mp4" />
        </video>
        
        {
          content ==="true" ?
          null
          :
          <div ref ={soundRef}> { muted ? 
            <HiVolumeOff className="absolute top-8 right-5  cursor-pointer z-50" color="white" size="25" onClick={handleClick}></HiVolumeOff>
            :
            <HiVolumeUp className="absolute top-8 right-5 cursor-pointer z-50" color="white" size="25" onClick={handleClick}></HiVolumeUp>}
          </div>
        }
      </div >
    )
}