import React from 'react';
import { db } from "../firebase";
import { CryptoState } from "../context";
import { doc, getDoc } from "firebase/firestore";



const LikedCoins = () => {
    const [likes, setLikes] = React.useState(null);
    const { user } = CryptoState();
    const fetch = async () => {
        if (user) {
          console.log("helo");
          const docRef = doc(db, "likes", user.uid);
          const docSnap = await getDoc(docRef);
            setLikes(docSnap.data().coins);
        }
    }
    React.useEffect(() => {
        fetch();
    }, [user])
    console.log(likes)
    return (
        <div style={{color:"white"}}>
            {likes && likes.map(e => {
                return <p>{e}</p>
            })}
        </div>
    )
}

export default LikedCoins
