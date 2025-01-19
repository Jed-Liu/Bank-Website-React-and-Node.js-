import '../App.css';
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import {DISPLAY_VALUE, PROGRAM_VALUE} from './constants.js';
import { useSelector } from 'react-redux';



function DisplayData({fields, type, changeInfo}){
    
    const keys = Object.keys(fields);

    return(
        type === "permanent" ? (
            
        keys.map((key_value) => (
        <div key={key_value} >
        <label htmlFor = {key_value}>{DISPLAY_VALUE[key_value]}: </label>
        <input id={key_value} name = {key_value} value = {fields[key_value]} disabled></input>
        </div>
      ))
    
      ) : (

        keys.map((key_value) => (
            <div key={key_value}>

            <label htmlFor = {key_value}>{DISPLAY_VALUE[key_value]}: </label>
            {key_value === "password" ? (
            <input type = "password" id={key_value} name = {key_value} value = {"garbage"} disabled></input>
            ):(
                <input id={key_value} name={key_value} value={fields[key_value]} disabled />
            )}
            <div></div>
            <button style = {{marginTop: "10px", marginBottom: "10px", padding: '12px 12px'}} onClick = {(e) => {changeInfo(e, DISPLAY_VALUE[key_value], fields[key_value])}} >Change</button>
            </div>
          ))
      
    ));
    }

function UserInfo(){

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    //console.log("userData: ", userData);


    const permanentData = {username: userData["info"]["username"], balance: userData["info"]["balance"], created_date: userData["info"]["created_date"], first_name: userData["info"]["first_name"],
                           last_name: userData["info"]["last_name"], email: userData["info"]["email"], date_of_birth: userData["info"]["date_of_birth"], gender: userData["info"]["gender"]};
    const changeableData = {password: userData["info"]["password"], address: userData["info"]["address"], town_city: userData["info"]["town_city"], states_territories: userData["info"]["states_territories"]};

    const changeInfo = (e, type, value) =>{

        return navigate (`/dashboard/info/changeInfo/${PROGRAM_VALUE[type]}`, {state : {type: type, value: value}});

    }

    return(
        <div className = "column_container">
        <div className = "row_container">
        
        <div className = "column_container">
        <h1>Has your information change?</h1>
        <DisplayData fields = {changeableData} type = {"changeable"} changeInfo = {changeInfo}/>
        </div>

        <div className = "column_container">
        <h1>Permanent Record</h1>
        <DisplayData fields = {permanentData} type = {"permanent"} />
        </div>
        
        </div>
        <Link to = "/dashboard" style={{textAlign: "center" }}>Back to Dashboard</Link>
        </div>
        

    );

}

export default UserInfo;