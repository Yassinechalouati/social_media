import axios from 'axios'
import {useState, useRef, useEffect} from 'react'
import {IoMdImages} from 'react-icons/io'
import Cookies from 'universal-cookie';
import { RingLoader } from 'react-spinners';
import { BsFillEmojiSmileFill} from 'react-icons/bs'
import EmojiPicker from 'emoji-picker-react';
import VideoPlayer from './VideoPlayer'

export default function FileUpload({index, setIndex, image, setImage, pfp}) {
    const [file, setFile] = useState('')
    const [inputValue, setInputValue] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hidden, setHidden] = useState("hidden")
    const emojiRef = useRef(null)
    const [secondElement, setSecondElement] = useState( <div className=" justify-center flex items-center " > <RingLoader color="#9cb09f" size={50} /></div> )
    const fileRef = useRef(null)
    const postRef = useRef(null)
    const storyRef = useRef(null)
    const cookies = new Cookies()
    const captionLength = 150

   


    const handleChange = (e) => {
        setFile(e.target.files[0])
        var reader = new FileReader() 
    if (e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        console.log(reader.result)
        setImage(reader.result)
    }
    reader.onerror = error => {
      console.log("Error", error)
    }
    setIndex(1)
    }
    else {
      setImage("")
    }
    }

    async function getToken() {
        return cookies.get('_auth');
      }


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return
        const token = await getToken()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', inputValue)
        formData.append('token', token)
        formData.append('type', hidden)
        for (const entry of formData.entries()) {
            console.log(entry[0], entry[1]);
          }

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Authorization': `${token}`,
                    // Other headers if needed
                  }
            })
            console.log(response)
            setDisabled(true)

            window.location.reload()
        }
        catch(err) {
            console.error("Error uploading video: ", err)
        }
    }
    
    const handleClick= () => {
        fileRef.current.click()
    }

    const handleCaptionChange= (e) => {
        setInputValue(e.target.value)
        console.log(inputValue)
    }

    
    const handleEmojiClick = (e) => {
        console.log(e.emoji.toString())
        setInputValue(inputValue+e.emoji.toString())
      }

    useEffect(() => {
        if (image==="") {
            setSecondElement(<div className=" h-[100%] justify-center flex items-center " > <RingLoader color="#9cb09f" size={50} /></div> ) 
        }
        else {
           setSecondElement((file.type === "video/mp4")?
           <VideoPlayer video={image} style ="w-[100%] h-[100%] rounded-b-md object-fill object-center "></VideoPlayer>
           :
           <img src={image} className="w-[100%] h-[100%] rounded-b-md object-fill object-center "></img>)
        }
    }, [image])

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    
        // Cleanup the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);
    
      const handleOutsideClick = (event) => {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
          
          setIsVisible(false)
        }
      };

    const handleRadioClick = (e) => {
      if(e) {
        e.current.click()
        setHidden(e.current.value)
      }
    }

    let  phases = [
        [<IoMdImages key="image" size="90" color="ffffff"></IoMdImages>,
        <input 
        key="image/video"
        className="hidden" 
        ref={fileRef} 
        type="file" 
        onChange={handleChange}
        accept="image/*, video/*"
        ></input>,
        <button 
        key="button"
        type="button" 
        className="p-3 rounded-md bg-[#9cb09f] text-white" 
        onClick={handleClick}> 
        Choose media from your computer
        </button>],
        [
           secondElement
       
        ],
        [
          
            (
              (file.type === "video/mp4")?
              <VideoPlayer video={image} style ="w-[70%] h-[100%] rounded-b-md object-fill object-center"></VideoPlayer>
              :
              <img src={image} className="w-[70%] h-[100%] rounded-b-md object-fill object-center "></img>
            )
         ,
            <div className="flex flex-col px-5 space-y-4 w-[30%]">
                <div className="flex items-center space-x-2">
                <img src={pfp} className="w-10 h-10 rounded-full object-cover object-center" alt="pic here!"></img>
                <span className="text-white"> {cookies.get('_auth_state').username}</span>
                </div>
                <textarea 
                className=" text-white resize-none bg-transparent outline-none h-[15%] w-[100%]" 
                placeholder="Write a caption..."
                value={inputValue}
                onChange={handleCaptionChange}
                maxLength={captionLength}
                ></textarea>
                <div className="flex relative justify-between items-center " >
                            <div ref={emojiRef}>
                            <BsFillEmojiSmileFill  className="cursor-pointer" size="25" color="909199"  onClick={() => {
                              setIsVisible(!isVisible)
                            }}></BsFillEmojiSmileFill>
                            </div>
                            {isVisible? <div className="absolute top-8" ref={emojiRef} >
                              <EmojiPicker height={450} width={250} theme='dark' searchDisabled={true}  onEmojiClick={handleEmojiClick}></EmojiPicker> 
                              </div> 
                              : 
                              null}
                              <div className="text-[#909199] text-md"> {inputValue.length}/{captionLength}</div>
                </div>
                <div onClick={() => handleRadioClick(storyRef)} className="flex space-x-2 ">
                  <input ref={storyRef} className="w-3" type ="radio" name="type" value="stories">
                  </input>
                  <span className="text-[#909199] text-md">Story</span>
                </div>
                <div onClick={() => handleRadioClick(postRef)} className="flex space-x-2">
                  <input ref={postRef} className="w-3" type ="radio" name="type" value="posts">
                  </input>
                  <span className="text-[#909199] text-md">Post</span>
                </div>
                <div className="flex justify-center ">
                  {
                    disabled === false ?
                <button 
                type="submit" 
                className={` p-3 rounded-md bg-[#9cb09f] text-white transition-opacity duration-500 ${
                  hidden==="hidden" ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
                >
                    Proceed
                </button>
                :
                null
                  }
                
                
                </div>
            </div>
        ]

    ]
    return (
            <form onSubmit={handleSubmit} className={` flex  ${index === 2? "flex-row" :"flex-col"} space-y-3 ${index ===0? "items-center" : ""} ${ index > 0? "h-[100%]" : "" }  `} >
                {
                    phases[index]
                }
            </form>


    )
}