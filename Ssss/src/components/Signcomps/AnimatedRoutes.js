import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Chat from '../../pages/Chat'
import LogForm from './LogForm';
import SignForm from './SignForm'
import {AnimatePresence} from  'framer-motion'
import {RequireAuth} from 'react-auth-kit'
import Home from '../../pages/Home'


function AnimatedRoutes() {
  return (
    <AnimatePresence>
      
                <Routes >
                  <Route index element ={<LogForm ></LogForm>} />
                  <Route path="/Signup" element={<SignForm></SignForm>}/>
                  <Route path="/Signin" element={<LogForm></LogForm>}/>
                  <Route path="/Chat" element={<RequireAuth loginPath='/Signin'>
                    <Chat></Chat>
                  </RequireAuth>}/>
                  <Route path="/Home" element={<RequireAuth loginPath='/Signin'>
                  <Home></Home>
                  </RequireAuth>}></Route>
                </Routes>

    </AnimatePresence>
  )
}

export default AnimatedRoutes