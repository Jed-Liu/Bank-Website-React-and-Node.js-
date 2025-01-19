import sqlite3 from 'sqlite3';  // Importing sqlite3 module
import express from 'express';  // Importing express module
import cors from 'cors'; 
const data_path = './mydb.sqlite';

export function create_Table(){

    const db = openDataBase();
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        balance REAL NOT NULL,
        address TEXT NOT NULL,
        created_date TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        town_city TEXT NOT NULL,
        states_territories TEXT NOT NULL,
        email TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT NOT NULL)`);       
    closeDataBase(db);
  
  }
  
export function openDataBase(){
  
    try {
      const db = new sqlite3.Database (data_path, (err) =>{
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Database connected successfully.");
        }
      });
      return db;
    }
  
    catch (error){
      console.error("Unexpected error during database open:", error);
    }
  }
  
export function closeDataBase(db){
  
    if (db){
  
      db.close(err =>{
        if (err){
          console.error("Error closing database:", err.message);
        }
        else{
          console.log("Database connection closed.");
        }
      });
    }
    else{
      console.warn("Attempted to close a null or undefined database instance.");
    }
  }
  
export function print_all_data(){
  
    const db = openDataBase();
    
    let sql = "SELECT name FROM sqlite_master WHERE type='table';";
    db.all(sql,[],(err, tables) =>{
      if (err){
        console.error("Error retrieving tables:", err.message);
        return;
      }
    
      else if(tables.length > 0){
    
          tables.forEach((table) => {
    
          const tableName = table.name;
          console.log(`\nTable Name: ${tableName}`);
          sql = `SELECT * FROM ${tableName}`;
    
            db.all(sql, [], (err, rows) => {
            if (err) {
              console.error(`Error fetching data from ${tableName}:`, err.message);
              return;
            }
            rows.forEach(row => {
                console.log(row);
              })
            })
          });
        }
      
        else{
          console.log("No tables found in the database.");
        }
      
      }
    )
    closeDataBase(db);
    }
  