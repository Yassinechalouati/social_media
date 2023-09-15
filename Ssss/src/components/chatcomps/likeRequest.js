import axios from 'axios'
import Cookies from 'universal-cookie';


export  async function Like(type, value, id ) {
    async function getToken() {
        const cookies = new Cookies();
        return cookies.get('_auth');
      }
    const token = await getToken()
    axios.post('http://localhost:5000/like', {
        token: token, 
        type: type,
        value: value,
        id: id
    })
    .then((response) => {
        console.log(response)
        return response
    })
    .catch((error) => {
        return error
    })
}