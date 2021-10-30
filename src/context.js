import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { doc,onSnapshot } from "firebase/firestore";

const Crypto = createContext();
const Context = ({ children }) => {
    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹")
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
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
    useEffect(() => {
        if (user) {
            const coinRef = doc(db, "likes", user.uid);
            var unsubscribe = onSnapshot(coinRef, coin => {
                if (coin.exists()) {
                    setWatchlist(coin.data().coins)
                }
            })
            return () => {
                unsubscribe();
            }   
        } else {
            setWatchlist([])
        }
        
    },[user])
    return (
        <Crypto.Provider value={{ currency, symbol, setCurrency, alert, setAlert, user, watchlist }}>
            {children}
        </Crypto.Provider>
    )
}

export default Context;

export const CryptoState = () => {
    return useContext(Crypto)
}
