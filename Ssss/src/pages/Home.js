import Left from '../components/chatcomps/left';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';
import {useEffect, useState} from 'react'
import Modal from '../components/chatcomps/modal'
import Story from '../components/chatcomps/story'
import Post from '../components/chatcomps/Posts'
import io from 'socket.io-client';
import '../App.css'

const socket = io('http://localhost:5000')
const Home = () => {
    const location = useLocation();
    const { pfp, loading } = location.state || {};
    const cookies = new Cookies();
    const [visible, setVisible] = useState(false)
    const [storyVisibility, setStoryVisibility] = useState("") 
    const [userStories, setUserStories] = useState([]) 
    const [posts, setPosts] = useState([])

    async function getToken() {
      return cookies.get('_auth');
    }

    async function fetchData() {
        const token = await getToken()
        axios.post('http://localhost:5000/stories', {
            token: token
        } )
        .then(async (response) => {
            const sortedStories = response.data.files.sort((a, b)=> b.story_id - a.story_id)
            const likePromises = sortedStories.map(async(story) => {
                try {
                    const likeResponse = await axios.post('http://localhost:5000/isLiked', {
                        token: token,
                        id: story.story_id,
                        type:"story_likes"
                })
                const result = { ...story, liked: likeResponse.data.message.liked }
                return result
                }
                catch(e) {
                    return story
                }
            })
            const finalPosts = await Promise.all(likePromises);
            setUserStories(finalPosts)
        })
        .catch((error) => {
            console.error(error)
        })
        
    }
    async function fetchPosts() {
        const token = await getToken()
        axios.post('http://localhost:5000/posts', {
            token: token
        })
        .then(async (response) => {
            const Posts =  response.data.files
            const sortedPosts = Posts.sort((a, b) => b.posts_id - a.posts_id)
            const likePromises = sortedPosts.map(async (post) => {
                try {
                  const likeResponse = await axios.post('http://localhost:5000/isLiked', {
                    token: token,
                    id: post.posts_id,
                    type: "posts_likes"
                  });
                  const result = { ...post, liked: likeResponse.data.message.liked }
                  return result;
                } catch (err) {
                  return post; // Keep the original post data if there's an error
                }
              });
      
              const finalPosts = await Promise.all(likePromises);

              setPosts(finalPosts)

        })
        .catch((error) => {
            console.error(error)
        })
        

        
    }
   useEffect(() => {
    fetchData()
    fetchPosts()
   }, [])

   const handleClick= (story) => {
    setStoryVisibility(story)
   }
      
   useEffect(()=> {
    const cookies = new Cookies();
    socket.on('onComment', (messageData) => {
        setPosts((prevContent) =>  
        prevContent.map((content) => {
          if (content.posts_id === messageData.post_id && cookies.get('_auth_state').username === messageData.username){
            return {...content, comments: [...content.comments, messageData]}
          }
          else {
            return content
          }
        })
      )
    })
   },[])

   
    return (
        <div className="flex bg-[#131b2e] w-screen h-screen  justify-center items-center ">
            <Left setVisible={setVisible} pfp={pfp} loading={loading} visible={visible} color ={"Home"} />
            <div className="w-[93%] h-[100%] flex flex-col items-center mx-5 space-y-6 overflow-y-auto scrollbar-hide "> 
                <div className="w-[60%]">
                    <div className="flex w-[100%] overflow-x-auto space-x-3 pt-4 rounded-full py-4 ">
                    {
                        userStories.map((story) => {
                            const timestamp = Date.parse(story.creation)
                            const currentTime = Date.now();
                            const timeDifference = currentTime - timestamp;
                            const hours = Math.floor(timeDifference / 3600000);
                            if(hours<=24) { 
                                return (
                                    <div key={story.story_id}  className="rounded-full p-1 cursor-pointer bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
                                    onClick={() => handleClick(story)}>
                                        <div
                                            className="w-16 h-16 rounded-full overflow-hidden"
                                            style={{ position: 'relative' }}
                                        >
                                            <img
                                            src={story.pfp} 
                                            alt="profile pic"
                                            className="w-full h-full object-cover object-center"
                                            />
                                        </div>
                                    </div>
                                    
                                )
                                
                            }
                            return null;
                            
                        }
                        
                        )
                        
                    }
                    
                    </div>
                </div>
                 {
                    posts.map((post) =>{
                        const array = post.posts_content.split('.')
                        const type = array[1]
                        return(
                            <Post 
                            key={post.posts_id}
                            type= {type}
                            {...post}
                            ></Post>
                        )
                    })
                }
            </div>
            {
                visible ?
                <Modal setVisible={setVisible} pfp={pfp}></Modal>
                :
                null
            }
            {
                storyVisibility!==""?
                <Story setUserStories= {setUserStories} userStories ={userStories} story={storyVisibility} setStoryVisibility={setStoryVisibility}></Story>
                :
                null
            }
            
        </div>
    );
};

export default Home;