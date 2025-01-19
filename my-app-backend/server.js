import sqlite3 from 'sqlite3';  // Importing sqlite3 module
import express from 'express';  // Importing express module
import cors from 'cors'; 
import {create_Table, openDataBase, closeDataBase, print_all_data} from './utilities.js'

function get_user_data(userId){
  return new Promise((resolve, reject) => {
    const db = openDataBase();
    let sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [userId], async (err, row) => {

      if (err) {
        console.error(err.message);
        closeDataBase(db);
        reject(-1);
      }
      else{
        closeDataBase(db);
        resolve(row);
      }
    });
  });}
  



function get_transaction_history(userId){
  return new Promise((resolve, reject) => {
  const db = openDataBase();
  const formatted_Id = "_"+ userId;
  let sql = `SELECT * FROM ${formatted_Id}`; 
        db.all(sql, [], (err, rows) => {
          if (err) {
            console.error('Error fetching data:', err.message);
            closeDataBase(db);
            reject(-1);
          }
          else{
            //console.log("Transaction history: ", rows);
            closeDataBase(db);
            resolve(rows);
          }
        });
      });}




async function login(req, res){
  
    const db = openDataBase();
    const userName = req.body.username; 
    const passWord = req.body.password;

    let sql = "SELECT password FROM users WHERE username = ?";
    db.get(sql, [userName], async (err, row) => {
      if (err) {
        console.error(err.message);
        closeDataBase(db);
        return res.status(500).send('Server error');
      }
      if (row) {

        if (row.password === passWord){
          console.log('Login is successful'); 
          sql = "SELECT id FROM users WHERE username = ?";
          db.get(sql, [userName], async (err, row) => {
            if (err) {
              console.error(err.message);
              closeDataBase(db);
              return res.status(500).send('Server error');
            }
            else{
              closeDataBase(db);
              
              const user_data = await get_user_data(row.id);
              //console.log("id:", row.id);
              const transaction_history = await get_transaction_history(row.id);

              if (transaction_history === -1){
                return res.status(500).send('An error has occured while trying to get the transaction history.');
              }
              if(user_data === -1){
                return res.status(500).send('An error has occured while trying to get the user data.');
              }

              else{
                //console.log("Transaction history : ", transaction_history);
                //console.log("User Data : ", user_data);
                return res.status(200).json({message: 'Successfully Login.', data: user_data, transaction_history : transaction_history});
            }}
          });
        }
        else{
          console.log('Password is wrong.'); 
          closeDataBase(db);
          return res.status(401).send('Wrong Password.');
        }
        
      } else {

        console.log('Username not found!');
        closeDataBase(db);
        return res.status(404).send('Username cannot be found.');
      }
    });}

function create_account(req, res){
    
  const db = openDataBase();

  const data = req.body.formData;
  
  const date_of_birth_reformatted = data["date_of_birth"].slice(5,7) + '/' + data["date_of_birth"].slice(8,10)+ '/' + data["date_of_birth"].slice(0,4);
  let data_arguements = [data["username"], data["password"], data["deposit"], data["address"], data["created_date"], data["first_name"],
                     data["last_name"], data["town_city"], data["states_territories"], data["email"], date_of_birth_reformatted, data["gender"]];

  let sql = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
  db.get(sql,[data["username"]], (err, row) => {
    if (err){
      console.error(err.message);
      closeDataBase(db);
      return res.status(500).send("Server error");
    }
    if (row.count > 0){
      console.error("Username is already taken");
      closeDataBase(db);
      return res.status(400).send("Username is already taken"); 
    }
    else{
      sql = `INSERT INTO users (username, password, balance, address, created_date, first_name, last_name, town_city, 
      states_territories, email, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(sql, data_arguements, (err) => {
        if (err) {
          console.error(err.message);
          closeDataBase(db);
          return res.status(500).send("Server error"); 
        }
      });
      console.log('Account created successfully');
      
      sql = "SELECT id FROM users WHERE username = ?";

      db.get(sql, [data["username"]], (err, row) =>{
        if (err) {
          console.error(err.message);
          closeDataBase(db);
          return res.status(500).send("Server error"); 
        }
        else{
          
          const transaction_table = "_" + String(row.id);
          db.run(`CREATE TABLE IF NOT EXISTS ${transaction_table} (
            date TEXT NOT NULL,
            amount REAL NOT NULL,
            sender TEXT NOT NULL,
            reciever TEXT NOT NULL)`, (err) => {
              if (err) {
                console.error(err.message);
                closeDataBase(db);
                return res.status(500).send("Server error");
              }
              else{
                sql = `INSERT INTO ${transaction_table} (date, amount, sender, reciever) VALUES (?, ?, ?, ?)`;
                db.run(sql, [data["created_date"], data["deposit"], 'Deposit', 'Deposit'], (err) => {
                  
                  if (err) {
                    console.error(err.message);
                    closeDataBase(db);
                    return res.status(500).send("Server error"); 
                  }

                });
              }
            
            });
          
         
          }
      });

      closeDataBase(db);
      return res.status(201).json({message: "Account created successfully"}); 
    }
  })
}

function delete_account(req, res){

  const db = openDataBase();
  const userId = req.params.userId;
  let sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [userId], (err) => {
      if (err) {
        console.error(err.message);
        closeDataBase(db);
        return res.status(500).send('Server error');
    }

    const formatted_Id = "_" + String(userId);
    sql = `DROP TABLE IF EXISTS ${formatted_Id}`;
    db.run(sql, [], (err) => {
      if (err) {
        console.error(err.message);
        closeDataBase(db);
        return res.status(500).send('Server error');
    }

    res.status(200).send('Account deleted successfully');
  })
})
}


function transfer(req, res){

  const db = openDataBase();
  const transferTarget = req.body.transferTarget; 
  const transferAmount = req.body.transferAmount;
  const userId = req.body.userId;
  const handle_transaction =  (err, row, transfer_target_balance, transferTargetId) => {


    if (err) {
      closeDataBase(db);
      console.error('Error fetching data:', err.message);   
      return res.status(500).send("Server error"); 
    }

    else if (row){
      
      
      const user_balance = row.balance;
      const new_transfer_target_balance = Number(transfer_target_balance) + Number(transferAmount);
      const new_user_balance = Number(user_balance) - Number(transferAmount);
      let updateBalance = "UPDATE users SET balance = ? WHERE username = ?";
      
      db.run(updateBalance, [new_transfer_target_balance, transferTarget], (err) => {
        if (err) {
          console.error('Error fetching data:', err.message);
          closeDataBase(db);
          return res.status(500).send("Server error"); 
          }
        });

      updateBalance = "UPDATE users SET balance = ? WHERE id = ?";
        
      db.run(updateBalance, [new_user_balance, userId], (err) => {
        if (err) {
          console.error('Error fetching data:', err.message);
          closeDataBase(db);
          return res.status(500).send("Server error"); 
        }
      });

      const transfer_target_transaction_table = '_' + String(transferTargetId);
      const user_transaction_table = '_' + String(userId);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US');
      const sender = row.username;

      sql = `INSERT INTO ${transfer_target_transaction_table} (date, amount, sender, reciever) VALUES (?, ?, ?, ?)`;
      db.run(sql, [formattedDate, transferAmount, sender, transferTarget], (err) => {
      if (err) {
        console.error(err.message);
        closeDataBase(db);
        return res.status(500).send("Server error"); 
        }});

      sql = `INSERT INTO ${user_transaction_table} (date, amount, sender, reciever) VALUES (?, ?, ?, ?)`;
      db.run(sql, [formattedDate, transferAmount, sender, transferTarget], (err) => {
        if (err) {
          console.error(err.message);
          closeDataBase(db);
          return res.status(500).send("Server error"); 
          }});
    


      const formatted_Id = "_" + String(userId);
  
      sql = `SELECT * FROM ${formatted_Id}`; 
      db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching data:', err.message);
        closeDataBase(db);
        return res.status(500).send("Server error");
        }
      else{
          //console.log("Transaction history(new): ", rows);
          closeDataBase(db);
          return res.status(200).json({message: "Transfer successfully", transaction_history: rows}); 
          }});
      }  
  }



  let sql = "SELECT balance, id FROM users WHERE username = ?";
  db.get(sql, [transferTarget], (err, row) => {

    if (err) {
      console.error('Error fetching data:', err.message);
      closeDataBase(db);
      return res.status(500).send("Server error"); 
    }

    if (row){
      const transfer_target_balance = row.balance;
      const transferTargetId = row.id;
      sql = "SELECT balance, username FROM users WHERE id = ?"
      db.get(sql, [userId], (err, row) => handle_transaction(err, row, transfer_target_balance, transferTargetId));
    }

    else
    {
      console.log('Cannot not find this user.');
      closeDataBase(db);
      return res.status(404).send("Cannot not find this user."); 
    }
  });
}

async function change_info(req, res){

  const db = openDataBase();
  const userId = req.params.userId;
  const updates = req.body.updates;
  const sql = `UPDATE users SET ${updates.type} = ? WHERE id = ?`;
  db.run(sql, [updates.value, userId], async (err) => {

    if (err) {
      closeDataBase(db);
      console.error('Error updating row:', err.message);
      return res.status(500).send("Server error");
    } else {
      closeDataBase(db);
      const user_data = await get_user_data(userId);
      //console.log("user_data: ",user_data);
      res.status(200).json({ message: ` ${updates.type} updated successfully`, data: user_data });
    }
  });

  
}

// server.js
//const path = require('path');
//const express = require('express');
//const cors = require('cors');
const app = express();

// Enable CORS for React frontend
//app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(express.json());

create_Table()
print_all_data()

// Simple API endpoint
app.post('/api/login', login);
app.post('/api/create_account', create_account);
//app.get('/api/dashboard/:userId', dashboard);
app.post('/api/dashboard/transfer', transfer);
app.delete('/api/dashboard/:userId', delete_account)
app.patch('/api/dashboard/changeInfo/:userId', change_info);

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
*/

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// run "node server.js" to start the server
// REMEMBER TO TEST WITH FAKE DATA