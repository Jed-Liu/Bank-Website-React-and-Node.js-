import React,  { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../authSlice'; 


function DashboardRoute(){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const [transferResponse, settransferResponse] = useState('');
    const [transferTarget, settransferTarget] = useState('');
    const [transferAmount, settransferAmount] = useState('');


    const deleteAccount = (e) =>{
        
        const userId = userData["info"]["id"];
        //console.log("delete account: ", userId);
        axios.delete(`http://localhost:5000/api/dashboard/${userId}`)
        .then(response => {
            console.log(response.data);
            navigate('/');;
        })
        .catch(error => {
            console.error(error.response.data);
        });
    }
    
    
    const logout_account = () =>{
        dispatch(logout());
        return ( <Navigate to="/" />);
    }
    

    const info = (e) =>{
        e.preventDefault();
        return navigate ("/dashboard/info");

    }



    const handleSubmit = (e) => {
      e.preventDefault();
      const userId = userData["info"]["id"];
      axios.post('http://localhost:5000/api/dashboard/transfer', {transferTarget, transferAmount, userId})
      .then(response => {
        const dict = { "trans_history": response.data.transaction_history, "info": {...userData["info"] , balance: userData["info"].balance - Number(transferAmount)}};
        dispatch(login({userData: dict}));
        settransferResponse(response.data.message); // Display server response
    })
      .catch(error => {
        settransferResponse(error.response.data);
        console.error(error.response.data);
      });
        
    };

    return(
    
    <div style = {{display: 'flex', justifyContent: "flex-start", alignItems: "flex-start", height: '100vh', flexDirection: "column"}}>
    <h1>Username: {userData["info"]["username"]}
    <br/>
    Balance: ${userData["info"]["balance"]}
    </h1>
    
    <form style ={{margin: '10px', display: 'flex', flexDirection: "column", gap: "10px"}} onSubmit = {handleSubmit}>
    <label htmlFor = "tranfer_target">Who would you like to make a transfer to?</label>
    <input type = "text" id = "transfer_target" name = "transfer_target" pattern = "^[A-Za-z][A-Za-z0-9_]{2,}$" 
    title = "Username must start with a letter, be at least 3 characters long, and only contain letters, numbers, or underscores (but not at the beginning)."
    onChange = {(e) => settransferTarget(e.target.value)} required></input>
    <label htmlFor = "tranfer_amount">How much would you like to transfer?</label>
    <input type = "number" id = "transfer_amount" name = "transfer_amount" min = "10" step = "0.01" max = {Number(userData["info"]["balance"])} onChange = {(e) => settransferAmount(e.target.value)} required></input>
    {transferResponse && <p style = {{color: 'red'}}>{transferResponse}</p>} {/* Display server response */}
    <button>Submit</button>
    </form>

    <div style={{display: 'flex', flexDirection: "row", gap : "15px"}}>
    
    <button onClick={logout_account} style={{ textAlign: "center" }}>
        Logout  
      </button>

    <button onClick={info} style={{ textAlign: "center" }}>
        Info
    </button>

    <button onClick={deleteAccount} style={{ textAlign: "center" }}>
        Delete Account
    </button>

    </div>
    
    

    <h2> Balance History </h2>
    <div style={{ overflowX: 'auto', maxWidth: '100%', margin: "10px" }}>
    <table border = '1' style = {{backgroundColor: "white", width: '100%', borderCollapse: 'collapse'}}>
        <thead>
        <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Sender</th>
            <th>Reciever</th>
        </tr>
        </thead>
        
        <tbody>
            {
            userData["trans_history"].map((row) => (
                <tr>
                    <td>{row.date}</td>   
                    <td>${row.amount}</td>   
                    <td>{row.sender}</td>   
                    <td>{row.reciever}</td>   
                </tr>

            ))}

        </tbody>
    </table>    
    </div>

    </div>
);
}

    

export default DashboardRoute;