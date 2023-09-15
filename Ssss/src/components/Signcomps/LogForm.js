import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import InputField from './InputField';
import ForgotPword from './Forgotpword';
import Description from "./Description";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import {useSignIn} from 'react-auth-kit'



const LogForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username:"",
    password:"",
  })
  
  const signIn = useSignIn()

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bool, setBool] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      setLoading(true);
      const response = await axios.post('http://localhost:5000/signin', {
        username: values.username,
        pword: values.password,
      });

      if (response.data.message === "Wrong username !") {
        setUsernameError(response.data.message);
        setPasswordError("");
      } else if (response.data.message === "Wrong password !") {
        setUsernameError("");
        setPasswordError(response.data.message);
      } else {

       setBool(signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {username: values.username}
      }))
      setUsernameError("");
      setPasswordError("");
       
        
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error here
    }
    finally {
     setLoading(false);
    }
  };

  useEffect(() => {
    console.log(bool)
    if(bool === true) {
      navigate('/Chat')
    }
}, [bool])
 
  const Inputs = [
    {
      key:"username",
      type: "text",
      placeholder:"Username",
      name: "username",
      img:'user.png',
      errorMessage: usernameError,
    }, 
    {
      key:"password",
      type: "password",
      placeholder:"Password",
      name:"password",
      img:'lock.png',
      errorMessage: passwordError,
    },
  ]


  const onChange = (e) => {
    setValues({...values, [e.target.name] : e.target.value })
  }

  const elements = [
    <div key="title" className="mt-9 text-[#9cb09f] text-4xl drop-shadow-lg">Sign In</div>,
    <Avatar key="avatar" Signin={true}></Avatar>,
    ...Inputs.map((input) => (
      <InputField
        {...input}
        value={values[input.name]}
        onChange={onChange}
        Signin={true}
      />
    )),
    <ForgotPword key="forgotPword"></ForgotPword>,
    <input key="submit" type="submit" value="LET'S CHAT" className="text-white h-12 rounded-md px-9 w-80 bg-[#9cb09f]  drop-shadow-md cursor-pointer"></input>,
    <button key="signup" onClick={() => { navigate('/Signup') }} type="button" value="SIGN UP" className="text-[#9cb09f] h-12 rounded-md px-9 w-80  border-[#9cb09f] border-2 bg-white drop-shadow-md cursor-pointer">SIGN UP</button>
  ];
  
  console.log("herre")
  return (
    <div className="bg-[url(../assets/chat.jpg)] bg-cover">
      <div className="bg-black bg-opacity-50 w-screen h-screen flex justify-between items-center">
        <Description />
        
          <form onSubmit={handleSubmit} className={`h-[70%] w-1/5 bg-white mr-56 rounded-2xl  flex flex-col items-center justify-evenly`}>
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

export default LogForm;
