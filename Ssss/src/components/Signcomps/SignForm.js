import Avatar from './Avatar';
import InputField from './InputField';
import Description from "./Description";
import { useNavigate } from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios';
import { RingLoader } from 'react-spinners';

const  SignForm = () => {

  const navigate = useNavigate();

  
  const [image, setImage] = useState('')

  const [values, SetValues] = useState({
    username:'',
    password:'',
    confirmpassword:''
  })
  

  const [loading, setLoading] = useState(false);
  const [usererror, setUsererror] = useState(false)

  const Inputs = [
    {
      key:"username",
      type: "text",
      placeholder:"Username",
      name: "username",
      img:'user.png',
      required: true,
      errorMessage: "Invalid Username !",
      error: usererror

    },
    {
      key:"password",
      type: "password",
      placeholder:"Password",
      name:"password",
      img:'lock.png',
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: 'Invalid password !',
      required: true

    },

    {
      key:"Confpassword",
      type: "password",
      placeholder:"Confirm Password",
      name:"confirmpassword",
      img:'lock.png',
      required: true,
      pattern: values.password,
      errorMessage:"Passwords don't match !"
    },

  ]

  const onChange = (e) => {
    SetValues({...values, [e.target.name] : e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    
    try {
      setLoading(true)
      const response = await axios.post( 'http://localhost:5000/signup',{
        username:values.username,
        pword: values.password,
        active: 0,
        pfp: image
      })

      if (response.data.message ==="Username already exists!") {
        setUsererror(true);
      }
      else {
        setUsererror(false)
        navigate('/signin')
      }

      
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)
      setImage('')
    }
    
  }

  var elements = [
  <div key="title" className="mt-9 text-[#9cb09f] text-4xl drop-shadow-lg ">Sign Up</div>,
  <Avatar key ="avatar" Signin={false} image={image} setImage={setImage} ></Avatar>,
  ...Inputs.map((input) => (
    <InputField
      {...input}
      value={values[input.name]}
      onChange={onChange}
      Signin={false}
    />
  )),
  <input key="submit" type="submit" value="SIGN UP" className="text-white h-12 rounded-md px-9 w-80 bg-[#9cb09f]  drop-shadow-md cursor-pointer"></input>,
  <button key="sign in" onClick={() => { navigate('/Signin') }}  value="SIGN IN" className="text-[#9cb09f] h-12 rounded-md px-9 w-80  border-[#9cb09f] border-2 bg-white drop-shadow-md cursor-pointer"> LET'S CHAT</button>]

    
  console.log(image )
  return (
    
    <div  className="bg-[url(../assets/chat.jpg)] bg-cover">
      <div className="bg-black bg-opacity-50 w-screen h-screen flex justify-between items-center">
        <Description/>
        <form onSubmit={handleSubmit} className={`h-[70%] w-1/5 bg-white mr-56 rounded-2xl flex flex-col items-center justify-evenly`}>
        {
              loading? (
                <div className=" justify-center flex items-center " > <RingLoader color="#9cb09f" size={50} /></div>
              ) : 
              (
                elements
              )
            }
        </form>
      </div>
    </div>
  );
}

export default SignForm 

