import React, { createContext, useContext, useState, useEffect } from 'react'
import auth from './firebase';
import { onAuthStateChanged } from "firebase/auth";

const Crypto = createContext();
const Context = ({ children }) => {
    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹")
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success"
    })
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) setUser(user);
            else setUser(null);
        })
    }, [])
    useEffect(() => {
        if (currency === "INR") setSymbol("₹");
        else if (currency === "USD") setSymbol("$");
    }, [currency])
    return (
        <Crypto.Provider value={{ currency, symbol, setCurrency, alert, setAlert, user }}>
            {children}
        </Crypto.Provider>
    )
}

export default Context;

export const CryptoState = () => {
    return useContext(Crypto)
}
