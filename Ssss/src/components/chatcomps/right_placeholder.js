import lottie from 'lottie-web'
import {useEffect, useRef} from 'react'

export default function Placeholder({placeholder}) {
    const animationContainer = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg', 
      loop: true, 
      autoplay: true, 
      animationData: placeholder, 

    });

    return () => {
      // Clean up the animation on unmounting the component
      anim.destroy();
    };
  }, []);
    return (
      <div  className="flex flex-col justify-center items-center bg-[#1e293b] bg-cover mx-5 h-full w-[68%] rounded-xl ">
        <span className="text-3xl text-white self-center">  Start Chatting </span>
        <div ref={animationContainer} className=" self-center w-[60%] h-[60%]"></div>
        
        </div>
        
    )
}