import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({

    name: "auth",

    initialState: {
        isLoggedIn: false,
        userData: null,
    },

    reducers:{
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload.userData || state.userData;
            
        },
        logout: (state) => {

            state.isLoggedIn = false;
            state.userData = null;
        }
    }
});

export default authSlice.reducer;
export const login = authSlice.actions.login;
export const logout = authSlice.actions.logout;