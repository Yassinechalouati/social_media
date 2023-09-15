import {AiOutlineSearch} from 'react-icons/ai'
import Contact from '../chatcomps/contact'
import {useState, useEffect, useRef} from 'react'
import {TiDelete} from 'react-icons/ti'
import axios from 'axios'
import { RingLoader } from 'react-spinners';
import Cookies from 'universal-cookie';

export default function Middle({content, loading, setText, setInfo, info, setContent, focus, status}) {

    const [clicked, setClicked] = useState(false)
    const [search, setSearch] = useState('')
    const [show, setShow] = useState(false)
    const [load, setLoad] = useState(false)
    const [searchData, setSearchData] = useState([])
    const [results, setResults] = useState(searchData)
    const searchRef = useRef(null)
    const cookies = new Cookies();

    async function getToken() {
        return cookies.get('_auth');
      }


      function searchStrings(search, objectList) {
        const searchLowerCase = search.toLowerCase();
        return objectList.filter((object) => object.username.toLowerCase().includes(searchLowerCase))
      }
    

    const handleClick = () => {
        setClicked(true)
    }

    const handleDelete =() => {
        setSearch("")
    }

    const handleSearch = async() => { 
        try {
            if (show === false){
                const token = await getToken()
                const requestData = {
                    token: token
                }
                setShow(true)
                setLoad(true)
                const response = await axios.post('http://localhost:5000/search', requestData)
                setSearchData(response.data.message)
                setResults(response.data.message)
            }
        }
        catch(e) {
            console.error(e)
        }
        finally {
           setTimeout(() => {
            setLoad(false)
           }, 1000)
           
        }
    }

    const handleChange= (e) => {
        setSearch(e.target.value)
        console.log(e.target.value)
        if(e.target.value !== undefined && e.target.value !== "") {
            setResults(searchStrings(e.target.value, searchData))
            console.log(results)
        }
        else {
            setResults(searchData)
        }
        
    }

    const handlePress = async (username, pfp) => {
        setShow(false)
        const userStatus = status.find((status) => status.username === username)
        axios.post('http://localhost:5000/getId', { username: username })
        .then((response) => {
            let bool = false
            content.map((data) => {
                if (data.username === username) {
                    bool = true
                    return
                }
            })
            if (bool === false) {
                setContent(prevContent => (
                    [
                        {
                            contact_id: response.data.message,
                            image_sent: "",
                            isActive: userStatus ? 1 : 0,
                            last_sender: "",
                            last_sentAt: undefined,
                            message: "",
                            message_id: "",
                            pfp: pfp,
                            receiver_liked: "n",
                            seen: 0,
                            username: username
                        },
                        ...prevContent // Spread the previous content array here
                    ]
    
                ))
                console.log("middlecontent: ", content)
            }
           
        })
        .catch((err) => {
            console.error(err);
        });
    }
   

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    
        // Cleanup the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);

      const handleOutsideClick = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setClicked(false);
          setShow(false)
        }
      };

    return (
        <div className="h-full w-[25%] flex flex-col ">
            <div className=" kenet-h-[10%] my-5 flex justify-between items-center px-3  "> 
                {
                    clicked?
                    <div ref={searchRef}  className="w-full kenet-h-[50%] flex flex-col  "> 
                    <div 
                    
                    className="h-12 w-full  flex items-center relative"> 
                        <input 
                        onChange={handleChange} 
                        onClick={handleSearch}
                        className={`${show? "rounded-t-3xl" : "rounded-full"} h-12 px-4 w-full bg-[#1e293b] text-white outline-none`}
                        type="text"
                        autoFocus
                        placeholder="Search for someone..."
                        value={search}>  
                        </input>
                        {
                            search !== ''?
                        <div 
                        className="absolute right-2 z-50" 
                        onClick={handleDelete}> 
                            <TiDelete 
                                size="25"
                                color="#909199"
                            ></TiDelete>
                        </div>
                            :
                            null
                        }
                    
                    </div> 
                    {
                        show?
                        <div className="flex-grow overflow-y-auto scrollbar-hide max-h-[400px]">
                            <div className="w-full bg-[#1e293b] flex flex-col z-50 shadow-xl p-2 rounded-b-lg "> 
                                <span className={`text-white flex justify-center  text-lg w-full`} > Search List</span>
                                {results !== [] && load === false?
                                        results.map((element) => (
                                            <div key={element.id} onClick={() => handlePress(element.username, element.pfp)} className="w-full h-12 text-white rounded- hover:bg-[#9cb09f] cursor-pointer rounded-lg flex items-center px-2 space-x-2 "> 
                                    <div className='relative '>
                                        <img src={element.pfp} className="w-10 h-10 rounded-full object-cover object-center" alt="pic here!"></img>
                                        {
                                            element.isActive === 1?
                                            <div className="bg-green-600 rounded-full w-2 h-2 absolute bottom-0 right-1 "></div>
                                            :
                                            null
                                            }
                                    </div>
                                        <span> {element.username} </span>
                                    </div>
                                        ))
                                        :
                                        <div className=" justify-center flex items-center " > <RingLoader color="#9cb09f" size={50} /></div>
                                }
                                
                       
                             </div>
                        </div>
                    :null
                    }
                    
                     
                    
                    </div>
                    
                    :
                    [
                    <span key="Chats"  className="text-xl font-medium text-white ">
                        Chats
                    </span>,
                    <AiOutlineSearch
                     key="Search" 
                     onClick={handleClick} 
                     className="cursor-pointer" 
                     size="25" 
                     color="white"></AiOutlineSearch>
                    ]
                }
                
            </div>
            <div className="flex-grow overflow-y-auto scrollbar-hide" >
                <div className="flex flex-col space-y-3">
                    {loading ? (
                        Array(7)
                            .fill()
                            .map((_, index) => (
                            <div key={index} className="bg-[#1e293b] p-4 rounded-2xl shadow-xl w-[100%] h-[93px] mx-auto">
                                <div className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                                <div className="flex-1 space-y-6 py-1">
                                    <div className="h-2 bg-slate-700 rounded"></div>
                                    <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))
                        ) 
                        : 
                        (content.map((user) => <Contact
                         index={content.indexOf(user)} 
                         setContent={setContent} 
                         chat={setText} 
                         info={info} 
                         setInfo={setInfo} 
                         key={user.message_id} 
                         content={content}
                         focus={focus}
                         status={status}
                         {...user}></Contact>)
                    )}    
                </div>
            </div>
        </div>
    )
}