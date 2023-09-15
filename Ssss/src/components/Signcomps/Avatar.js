import {useRef, useState} from 'react'
import '../../App.css'

export default function Avatar ({Signin, image, setImage}) {

  const inputRef = useRef(null)
  const [hidden, setHidden] = useState(true);


  const handleImageClick = () => {
    inputRef.current.click()
  }

  const handleImageChange = (event) => {
    setHidden(inputRef.current.validity.valid);
    
    var reader = new FileReader() 
    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0])
    reader.onload = () => {
        console.log(reader.result)
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

    return Signin?(
      <div className="bg-[url('../assets/user.png')] bg-cover h-24 w-24 drop-shadow-lg ">
      </div>
    ) :
    (
      <div onClick={handleImageClick} >
       {
        image!=="" && image!==null ? 
        <img src={image} alt='pfp here' className={`rounded-full h-24 w-24 drop-shadow-lg cursor-pointer object-cover object-center`}></img>
         : 
        <img src="./upload.png" alt ="pfp here" className={` h-24 w-24 drop-shadow-lg cursor-pointer  `}></img>
       } 
        
        <input required type="file" className="hidden" onChange={handleImageChange} ref={inputRef} name="image" accept="image/*" size="5000000" ></input>
        <span className={` text-red-500 text-sm max-w-fit  ${hidden? 'hidden' : ''}`}>Upload Picture!</span>

      </div>

    )
  }