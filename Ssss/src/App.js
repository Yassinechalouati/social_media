import './App.css';
import {BrowserRouter} from 'react-router-dom'
import AnimatedRoutes from './components/Signcomps/AnimatedRoutes';

import {AuthProvider} from 'react-auth-kit'

function App() {
  
  return (
    <AuthProvider 
    authType="cookie"
    authName="_auth"
    cookieDomain={window.location.hostname}
    cookieSecure={false}
    >
    <BrowserRouter>
    <AnimatedRoutes> </AnimatedRoutes>
    </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
