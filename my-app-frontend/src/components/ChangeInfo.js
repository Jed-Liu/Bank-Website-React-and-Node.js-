import React, { useState} from 'react';
import { useLocation, Link } from "react-router-dom";
import '../App.css';
import {STATES_TERRITORIES, PROGRAM_VALUE} from './constants.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../authSlice'; 

function ChangeInfo(){

    
    const dispatch = useDispatch();
    const location = useLocation();
    const [responseMessage, setResponseMessage] = useState('');
    const [input, setInput] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '', 
        new_address: '', 
        new_town_city: '', 
        new_states_territories: ''
     });
     const data = location.state;
     const type = data.type;
     const value = data.value;
     const userData = useSelector((state) => state.auth.userData);

    const handleSubmit = async (e) =>{

        e.preventDefault();
        
        if (type === "Password"){ 
        
        if (value !== input["current_password"])
        {
            setResponseMessage("The current password does not match.");
        }

        else if (input["new_password"] !== input["confirm_password"]){
        
            setResponseMessage("Your new password has to match.");
            
        }

        else if (input["new_password"] === value){
            
            setResponseMessage("Your new password is the same as your old one.");

        }

        else{

            const updates = {
                type: PROGRAM_VALUE[type],
                value: input["new_password"]
            };

            axios.patch(`http://localhost:5000/api/dashboard/changeInfo/${userData["info"]['id']}`, {updates})
            .then(response => {
                setResponseMessage(response.data.message); // Display server response
                
            })
            .catch(error => {
                setResponseMessage(error.response.data);

            });

        }

    }

    else{

        if (value === input["new_" + PROGRAM_VALUE[type]]){

            setResponseMessage(`Your new ${type} is the same as your old one.`);   
        }

        else{

            const updates = {
                type: PROGRAM_VALUE[type],
                value: input["new_" + PROGRAM_VALUE[type]]
            };

            await axios.patch(`http://localhost:5000/api/dashboard/changeInfo/${userData["info"]['id']}`, {updates})
            .then(response => {
      
            setResponseMessage(response.data.message); // Display server response
            const dict = { "trans_history": userData["trans_history"], "info": response.data.data};
            dispatch(login({userData: dict}));
            

            })
            .catch(error => {
            setResponseMessage(error.response.data);
        
            });
 
        }

    }
    }

    const handleInputChange = (e) =>{

        const id = e.target.id;
        const value = e.target.value;
        let input_key = '';
        
        if (id.includes("password")){
            input_key = id;
        }
        else{
            input_key = "new_" + PROGRAM_VALUE[id];
        }

        setInput((prevState) => ({
        ...prevState,     
        [input_key]: value,         
        }));

    }

   
    return(
    <>
    {type === "Password" ? (
        <div>
        <form onSubmit = {handleSubmit}>
        
        <div className = "column_container">

        <label htmlFor = "current_password">Enter the current password to change your password. </label>
        <input id = "current_password" name = "current_password" onChange={handleInputChange}></input>
        
        <label htmlFor = "new_password">Enter your new password. </label>
        <input type = "password" id= "new_password" name = "new_password" onChange={handleInputChange}></input>

        <label htmlFor = "confirm_password">Confirm your new password.</label>
        <input type = "password" id= "confirm_password" name = "confirm_password" onChange={handleInputChange}></input>
        
        <button>Submit</button>
        {responseMessage && <p style = {{color: 'red'}}>{responseMessage}</p>} {/* Display server response */}

        <Link to = "/dashboard/info"  style={{textAlign: "center" }}>Back to Info</Link>
        
        </div>
        </form>
        </div>
    ) : (
        <div>
        <form onSubmit = {handleSubmit}>
        <div className = "column_container">
        
        <label htmlFor = {type}>Your current {type}</label>
        <input type = "text" id= {type} name = {type} value = {value} disabled></input>


        {type === "States/Territories" ? (
        
        <select id = {type} name = {type} onChange = {handleInputChange} required>
            <option value="" >--Select an option--</option>
            {STATES_TERRITORIES.map((option) => (
                <option value = {option} key = {option}>
                {option}
                </option>
                ))
            }
        </select>

        ) : (
        <>
        <label htmlFor = {type}>Input your new {type}</label>
        <input type = "text" id= {type} name = {type}  onChange = {handleInputChange}></input>
        </>
        )}

        
        <button>Submit</button>
        {responseMessage && <p style = {{color: 'red'}}>{responseMessage}</p>} {/* Display server response */}
        
        <Link to = "/dashboard/info" style={{textAlign: "center" }}>Back to Info</Link>
        
        </div>
        </form>
        </div>
    )}
    
    </>    
);
}

export default ChangeInfo;