import './App.css';
import backgroundImage from "./Images/website_home.jpg";
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CreateAccount from './components/CreateAccount';
import DashboardRoute from './components/DashboardRoute';
import LogIn from './components/LogIn';
import UserInfo from './components/UserInfo';
import ChangeInfo from './components/ChangeInfo';
import PrivateRoute from './PrivateRoute'; // The PrivateRoute component


function App(){

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover", 
    height: "100vh",             
  } 

  return (
    <Router>
      <div className = 'parent' style = {backgroundStyle}>
      <Routes>
        <Route path="/" element = {<LogIn/>}/>
        <Route path='/CreateAccount' element={<CreateAccount/>} />
        <Route path = "/dashboard" element = {<PrivateRoute><DashboardRoute/></PrivateRoute>}/>
        <Route path = "/dashboard/info" element = {<PrivateRoute><UserInfo/> </PrivateRoute>} />
        <Route path = "/dashboard/info/changeInfo/:type" element = {<PrivateRoute><ChangeInfo/></PrivateRoute>} />
      </Routes>
      </div>
    </Router>
  )
}



export default App;
// nagivatate to the my-app directory and run "npm start" to run the file
// REMEMBER TO TEST WITH FAKE DATA