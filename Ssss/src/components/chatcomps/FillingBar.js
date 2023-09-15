import React, { useState, useEffect, useRef} from 'react';

export default function FillingBar({ duration, paused, setStoryVisibility, timeoutId, type, setConfirmation, videoRef}) {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [startTime, setStartTime]= useState(Date.now())
  const [pausedStartTime, setPausedStartTime] = useState(0);
  const [bool, setBool] = useState(false)
  const dephasageRef = useRef(0)
  


  useEffect(() => {
    if (pausedStartTime !==0 && bool === false  ) {
        console.log("in in ")
        setBool(true)
        dephasageRef.current =  Date.now() - pausedStartTime +dephasageRef.current
     }
  }, [paused, duration])

  useEffect(() => {
    
    if (!paused) {
      const remainingTime = ((duration * (100 - fillPercentage)) / 100);
      console.log(fillPercentage)
      console.log(remainingTime)
      clearTimeout(timeoutId.current);
      
      if (videoRef && type==="mp4") {
        console.log("---------resume---------")
        videoRef.current.play()
      }
      const newTimeoutId = setTimeout(() => {
        setStoryVisibility('');
        setConfirmation(false)
      }, remainingTime);
      
      timeoutId.current = newTimeoutId
      
    } else {
      if (videoRef && type==="mp4") {
        console.log("---------pause---------")
        videoRef.current.pause()
      }
      clearTimeout(timeoutId.current);
      setBool(false)
      setPausedStartTime(Date.now());
      
    }
  }, [paused, duration]);

  useEffect(() => {
    let animationFrameId;
    let newFillPercentage;
  
    const updateFill = () => {
      // Calculate newFillPercentage asynchronously when not paused
      if (!paused) {
        const currentTime = Date.now() - dephasageRef.current;
        const elapsedTime = currentTime - startTime;
        newFillPercentage = (elapsedTime / duration) * 100;
      }
  
     
  
      // Update fill percentage and request animation frame
      if (!paused && newFillPercentage <= 100) {
        //console.log("fillPerncetage:", fillPercentage)
        setFillPercentage(newFillPercentage);
        animationFrameId = requestAnimationFrame(updateFill);
      }
    };
  
    // Start the animation loop
    if (!paused) {
      animationFrameId = requestAnimationFrame(updateFill);
    }
  
    // Clean up animation frame
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [paused, duration]);
  

 
  //adheya tekhdem ken wa9teli pause mara barka, salaha aala barsha pauses w chouf kifeh tal9a hal besh tkoun dhahra bel behi khater ki tpausi tawa temshi l9odem w tarjaaa fisaaa
  return (
    <div
      className="absolute top-2 z-10  left-0 h-1 bg-white rounded-md "
      style={{
        width: `calc(${fillPercentage}% - 40px)`, 
        left: '20px', 
      }}
    ></div>
  );
}
