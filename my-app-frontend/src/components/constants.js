export const STATES_TERRITORIES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", 
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "American Samoa", "Guam", "Northern Mariana Islands", "Puerto Rico", "U.S. Virgin Islands"];

export const DISPLAY_VALUE = {
  "username": "Username",
  "password": "Password",
  "balance": "Balance",
  "address": "Address",
  "created_date": "Created Date",
  "first_name": "First Name",
  "last_name": "Last Name",
  "town_city": "Town/City",
  "states_territories": "States/Territories",
  "email": "Email",
  "date_of_birth": "Date of Birth",
  "gender": "Gender",
}


// the inverse of DISPLAY_VALUE
export const PROGRAM_VALUE = Object.fromEntries(
  Object.entries(DISPLAY_VALUE).map(([key, value]) => [value, key])
);
