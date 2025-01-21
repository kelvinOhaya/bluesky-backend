import { AuthContext } from "./AuthContext"
import { useState } from 'react'
import axios from 'axios'


//holds all functions and values associated with logging in, including login, logout, sign in, sign out, and 'tokens'
export const AuthProvider = ({ children }) => {

    //token value initialized if it already exists
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("token");
        return storedToken ? JSON.parse(storedToken): ""; 
    });


    const signUp = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:4000/userValidation/signup", credentials)
            
            console.log(response)
            if(response.data.success){
                const tokenObj = {
                    value: response.data.token,
                    createdAt: Date.now(),
                }

                setToken(tokenObj)
                localStorage.setItem("token", JSON.stringify(tokenObj))
                return {result: true}
            } 

        } 

        catch (err) {
            console.error("Login failed:", err.response.data.message);
            return {result: false, errors: err.response.data.validation,}
        }     

    }


    //login functionality. Asks a server for a cookie and stores it in localstorage with a date to expire at
    const login = async (credentials) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/userValidation/login",
                credentials);

            const tokenValue = response.data.token;
            
            // Store token in localStorage
            const tokenObj = {
                value: tokenValue,
                createdAt: Date.now(), 
            };
            setToken(tokenObj)
            localStorage.setItem("token", JSON.stringify(tokenObj))

            return true; // Login successful
        } catch (err) {
            console.error("Login failed:", err);
            throw new Error("Issue logging in");
        }
    };


    //logout functionality: destroys the cookie in localstorage, kicking the user out of protected routes
    const logout = () => {
        setToken(""); // Clear token from state
        localStorage.removeItem("token"); // Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ signUp, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};
