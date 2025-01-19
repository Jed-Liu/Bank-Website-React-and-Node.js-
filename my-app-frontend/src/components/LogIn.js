import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import React,  { useState} from 'react';
import { useDispatch } from 'react-redux'; 
import { login } from '../authSlice'; 

function LogIn (){

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {

      e.preventDefault();

      axios.post('http://localhost:5000/api/login', { username, password})
      .then(response => {
        setResponseMessage(response.data.message); // Display server response
        const dict = {"trans_history": response.data.transaction_history, "info": response.data.data};
        dispatch(login({userData: dict}));
        navigate('/dashboard');
      })
      .catch(error => {
        setResponseMessage(error.response.data);
        console.error(error.response.data);
      });

    
    };


  return (
      <form style = {{textAlign: "center"}} onSubmit={handleSubmit}>
        <h1> Bank WebSite</h1>
        <label htmlFor = "username">Username</label>
        <br/>
        <input type = "text" id = "username" name = "username" onChange = {(e) => setUserName(e.target.value)} required></input>
        <br/>
        <label htmlFor = "password">Password</label>
        <br/>
        <input type = "password" id = "password" name = "password" onChange= {(e) => setPassword(e.target.value)} required></input>
        <br/>
        <button>Submit</button>
        <br/>
      {responseMessage && <p style = {{color: 'red'}}>{responseMessage}</p>} {/* Display server response */}
        
        {/* Link to create an account */}
        <div>
          <Link to = "/CreateAccount">Create an Account </Link>
        </div>
      
      </form>
  );
  
}
export default LogIn;