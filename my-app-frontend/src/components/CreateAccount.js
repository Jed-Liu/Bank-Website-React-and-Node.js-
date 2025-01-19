import '../App.css';
import {STATES_TERRITORIES} from './constants.js';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function FormFields({fields, handleInputChange}){
  
  return(
    fields.map((field) => (
    field.tag === "input" ? (
    <div key={field.id_name}>
    <label htmlFor={field.id_name}>{field.label}</label>
    <br/>
    <input id={field.id_name} name = {field.id_name} type={field.type} placeholder={field.placeholder} 
    min = {field.min} step = {field.step} pattern = {field.pattern} title = {field.title} onChange={handleInputChange} required/>
    </div>
  ) : (
    <div key={field.id_name}>
    <label htmlFor={field.id_name}>{field.label}</label>
    <br/>
    <select id = {field.id_name} name = {field.id_name} onChange={handleInputChange} required>
    <option value="" >--Select an option--</option>
    {field.options.map((option) => (
    <option value = {option} key = {option}>
    {option}
    </option>
))}
</select>
</div>
  ))));
}



function CreateAccount() {

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US');

  const genders = ['Male', 'Female'];  
  const [password_match, setPasswordMatch] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    deposit: '',
    address: '',
    created_date: formattedDate,
    first_name: '',
    last_name: '',
    town_city: '',
    states_territories: '',
    email: '',
    date_of_birth: '',
    gender: '',
    confirm_password: '',
  });

  const fields = [
    {tag: 'input', id_name: 'first_name', label: 'First Name', type: 'text', placeholder: 'First Name'},
    {tag: 'input', id_name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Last Name'},
    {tag: 'input', id_name: 'address', label: 'Address', type: 'text', placeholder: "Address"},
    {tag: 'input', id_name: 'town_city', label: 'Town/City', type: 'text', placeholder: 'Town/City'},
    {tag: 'input', id_name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
    {tag: 'input', id_name: 'username', label: 'Username', type: 'text', placeholder: 'Username', 
     pattern: "^[A-Za-z][A-Za-z0-9_]{2,}$", title : "Username must start with a letter, be at least 3 characters long, and only contain letters, numbers, or underscores (but not at the beginning)."},
     {tag: 'input', id_name: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
     {tag: 'input', id_name: 'deposit', label: 'Deposit Amount', type: 'number', placeholder: 'Deposit', min: 50, step: 0.01 },
     {tag: 'input', id_name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'Confirm Password' },
     {tag: 'select', id_name: 'states_territories', label: "States/Territories", options: STATES_TERRITORIES},
     {tag: 'select', id_name: 'gender', label: "Genders", options: genders},
     {tag: 'input', id_name: 'date_of_birth', label: 'Date of Birth', type: 'date'},
  ]

  const leftFields = fields.filter((_, index) => index % 2 === 0); // Even-indexed fields
  const rightFields = fields.filter((_, index) => index % 2 !== 0); // Odd-indexed fields

  const handleInputChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,        // Keep the previous state values
      [id]: value,         // Dynamically update the specific field
    }));

  }

  useEffect(() => {
      if (formData["password"] !== formData["confirm_password"]){
        setPasswordMatch("Password must match");
      }
      else{
        setPasswordMatch('');
      }
  }, [formData.password, formData.confirm_password]);

  const handleSubmit = (e) => {
    
    e.preventDefault();    
    if (formData["password"] !== formData["confirm_password"]){
      setPasswordMatch("Cannot create account until the passwords match.");
      return;
    }

    axios.post('http://localhost:5000/api/create_account', {formData})
    .then(response => {
      
      setResponseMessage(response.data.message); // Display server response
    })
    .catch(error => {
      setResponseMessage(error.response.data);
      console.error(error.response.data);
    });
  };

  return (
  <div className = "parent">
  <form style = {{textAlign: "center"}} onSubmit = {handleSubmit} >
  <h2>Create A New Account</h2>


  <div className = 'row_container'>
  <div className = 'column_container'>
  <FormFields fields = {leftFields} handleInputChange = {handleInputChange}/>
  </div>
  <div className = 'column_container'>
  <FormFields fields = {rightFields} handleInputChange = {handleInputChange}/>
  </div>
  </div>
  <br/>
  {password_match && <p style = {{color: 'red'}}>{password_match}</p>} {/* Check if password matches */}
  <br/>
  <button>Submit</button>
  <br/>
  {responseMessage && <p style = {{color: 'red'}}>{responseMessage}</p>} {/* Display server response */}
  <br/>
  <Link to="/">Already have an account? Log in here</Link>
  </form>
  </div>

);}

export default CreateAccount;