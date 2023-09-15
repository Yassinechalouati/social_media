import {AiOutlineLogout, AiFillHome} from 'react-icons/ai'
import {BsFillChatDotsFill} from 'react-icons/bs'
import {BiSolidAddToQueue} from 'react-icons/bi'
import {IconContext} from 'react-icons'
import {useSignOut} from 'react-auth-kit'
import {useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie';
import io from 'socket.io-client';


const socket = io('http://localhost:5000');

export default function Left({pfp, loading, setVisible, visible, color}) {
    const signOut = useSignOut()
    const navigate = useNavigate()

    async function getToken() {
        const cookies = new Cookies();
        return cookies.get('_auth');
      }

    const  Logout = async () => {
        const [token] = await Promise.all([getToken()]);
        const status = {
            token: token,
            isActive: 0
          }
          socket.emit('status', status );
        signOut()
        navigate('/Signin')
    }

    const homeRoute = () => {
        navigate('/Home', { state: { pfp, loading} });
    }

    const chatRoute = () => {
        navigate('/Chat')
    }

    const handleStory = () =>{
        setVisible(true)
    }

    return(
        <div className="grid grid-cols-1  h-full w-[7%]"> 
                <div className="justify-self-center self-end flex flex-col space-y-11  ">
                    <IconContext.Provider value={{size: "25" }}>
                        <AiFillHome 
                        className="cursor-pointer" 
                        color = {color ==="Home" && !visible? "#9cb09f" :"#909199"}
                        onClick={homeRoute}> </AiFillHome>
                        <BsFillChatDotsFill 
                        className="cursor-pointer " 
                        color = {color ==="Chat" && !visible? "#9cb09f" :"#909199"} 
                        onClick={chatRoute}></BsFillChatDotsFill>
                        <BiSolidAddToQueue
                         className="cursor-pointer "
                          color = {visible? "#9cb09f" :"#909199"} 
                          onClick={handleStory}></BiSolidAddToQueue>
                    </IconContext.Provider>
                </div>
                
                
                <div className="flex flex-col items-center justify-self-center self-end ">
                    {
                        loading === false?
                        <div className='relative mb-5'>
                            <img src={pfp} className="w-16 h-16 rounded-full object-cover object-center" alt="pic here!"></img>
                            <div className="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-3 "></div>
                        </div>
                        :
                        <div className=" animate-pulse mb-5 rounded-full bg-slate-700 h-16 w-16"></div>   
                    }
                       
                    <div className="mb-5 cursor-pointer"> <AiOutlineLogout onClick={Logout} size= "25" color="#FF0000"></AiOutlineLogout>  </div>
                </div>

            </div>
    )
}