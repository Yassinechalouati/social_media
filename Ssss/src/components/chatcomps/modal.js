import {useEffect, useRef, useState} from 'react'
import FileUpload from './FileUpload'
import {BsArrowRight, BsArrowLeft} from 'react-icons/bs'

export default function Modal({setVisible, pfp}) {
    const storyRef = useRef(null)
    const [index, setIndex] = useState(0)
    const [image, setImage]= useState('')

    const handleOutsideClick = (event) => {
        if (storyRef.current && !storyRef.current.contains(event.target)) {
          setVisible(false)
        }
      };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    
        // Cleanup the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);

      const handleGoingback =() => {
        if(index === 0) return 
        setIndex(index -1)
        if(index === 1) {

            setImage("")
        }
    }

    const handleGoingforward = () => {
        if(index === 2) return
        setIndex(index+1)
    }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center">
        <div ref={storyRef} className={`bg-[#1e293b] ${index === 2? " w-[50%]" :"w-[35%]"} h-[80%] flex flex-col items-center rounded-md `} >
        <div className={`flex items-center h-[8%] justify-center bg-black bg-opacity-30 w-full px-3 rounded-t-md`}>
            {
                index !==0?
                <BsArrowLeft className="cursor-pointer" size="27" color="FFFFFF" onClick={handleGoingback}></BsArrowLeft>
                :
                null
            }
            
            <div className="flex-grow text-center">
                <span className="text-white text-lg">Create new post</span>
            </div>
            <div>
                {
                    index === 1?
                    <BsArrowRight className="cursor-pointer"  size="27" color="FFFFFF" onClick={handleGoingforward}/>
                    :
                    null
                }
            </div>
        </div>
            <div className="flex-grow flex flex-col justify-center h-[92%] w-[100%]">
                <FileUpload index={index} setIndex={setIndex} setImage={setImage} image = {image} pfp={pfp}></FileUpload>
            </div>
        </div>
    </div>
  )
}
