import Icon from './Icon'
import '../../App.css'
import {useState} from 'react' 

export default function InputField (props) {
  const {img, onChange, Signin, errorMessage, error, ...inputProps} = props

  const element = error? <span key ="Signin" className={` text-red-500 text-sm max-w-fit `} >Username already exists !</span>: <span key ="signup" className="sSpan" >{errorMessage}</span> 

  const Span = [
    Signin? 
    <span key ="Signin" className={` text-red-500 text-sm max-w-fit `} >{errorMessage? errorMessage: ""}</span>
     : 
    element,]



    const [focused, setFocused] = useState(false)

    const handlefocus = () => {
      setFocused(true)
    }

    return (

      <div className="relative">
        <div className=" h-12 rounded-md w-80 border-2 border-[text-gray-500]">
        <input 
        className="h-full w-full px-9" 
        onBlur={handlefocus} 
        onFocus={() => inputProps.name ==="confirmpassword" && setFocused(true) }
        focused={focused.toString()} 
        {...inputProps} 
        onChange={onChange}  />
        {Span}
        <div className="pl-1 absolute  left-0 top-1/2 -translate-y-1/2">
        <Icon Path={img} />
        </div>

      </div>
    
    </div>

     

    )
  }