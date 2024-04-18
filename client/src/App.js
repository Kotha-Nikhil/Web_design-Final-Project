import {useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageRender from './customRouter/pageRender';
import PrivateRouter from './customRouter/privateRouter';
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Admin from './pages/admin'
import ProtectedRoute from './customRouter/ProtectedRoute';

import { refreshToken } from './redux/actions/authActions';
import {useSelector, useDispatch} from 'react-redux'
import { getPosts } from './redux/actions/postAction'
import {getNotifies} from './redux/actions/notifyAction'
import io from 'socket.io-client'
import Alert from './components/alert/Alert'
import Header from './components/header/header'
import StatusModal from './components/StatusModal'
import { GLOBALTYPES } from './redux/actions/globalTypes';
import SocketClient from './SocketClient'
function App() {

  const { auth, status, modal } = useSelector(state => state)
  //console.log("auth token in Login Component:", auth.token)
  const dispatch = useDispatch()
 //console.log("AUTH TOKEN:"+auth.token)

 
  useEffect(() => {
    dispatch(refreshToken())
    const socket = io()
    dispatch({
      type: GLOBALTYPES.SOCKET,
      payload: socket
    })
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.token) {
      dispatch(getPosts(auth.token))
      dispatch(getNotifies(auth.token))
    }
  },[dispatch, auth.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])


  return (
    <>
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          <Router>
            <Alert/>
            {auth.token && <Header/>}
            {status && <StatusModal/>}
            {auth.token && <SocketClient/>}
            <Routes>
              <Route exact path='/Login' element={<Login />} />
              <Route exact path='/' element={auth.token ? <Home /> : <Login />} />
            </Routes>
             <div className='wrap_page'>
              <Routes>
                <Route exact path='/register' element = {<Register/>} />
                <Route exact path='/admin' element={<ProtectedRoute><Admin/></ProtectedRoute>} />
                <Route exact path='/:page' element={<PrivateRouter><PageRender /></PrivateRouter>}/>
                <Route exact path='/:page/:id' element={<PrivateRouter><PageRender /></PrivateRouter>}/>

              </Routes>
            </div>
          </Router>
        </div>
      </div>

      </>
  );
}

export default App;

//<PrivateRouter exact path='/:page/:id' element={<PageRender />} />
//<Route exact path='/:page/:id' element={<PrivateRouter {...props}><PageRender /> </PrivateRouter>} />
              