import React from "react";
import {
  TextField,
  Button,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { CryptoState } from "../context";

const Chatbox = ({ socket, coin }) => {
  const messagesEndRef = React.useRef(null);
  const { user } = CryptoState();
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      console.log("emitS")
      let userInfo = {
        displayName: user.displayName,
        photoURL:user.photoURL,
      } 
      socket.emit("chatMessage", { message, user:userInfo });
      setMessage("");
    }
  }
  React.useEffect(() => {
    socket.on("message", (chat) => {
    
      console.log(chat);
      setChat((p) => {
        return [...p, chat];
      });
      messagesEndRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",      });
    });
    
    // eslint-disable-next-line
  },[])
  return (
    <div
      className="chatDiv"
      style={{
        height: "100%",
        minHeight: "570px",
        backgroundColor: "#1e1e1e",
        position: "relative",
        color: "white",
        maxHeight: "570px",
        marginBottom: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          backgroundColor: "rgb(144,202,249,0.7)",
          color: "black",
        }}
      >
  
        <Typography>{coin.toUpperCase()} community</Typography>
      </div>
      <div style={{ overflowY: "scroll", maxHeight: "80%" }}>
        {chat.map((e) => {
          return (
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="profile" src={e.user.photoURL} />
              </ListItemAvatar>
              <ListItemText
                primary={e.user.displayName}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>
                    {e.message}
                  </React.Fragment>
                }
              />
            </ListItem>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form autoComplete="off">
        <div
          style={{
            bottom: "0px",
            position: "absolute",
            width: "100%",
          }}
        >
          <TextField
            required
            style={{ width: "80%" }}
            id="standard-required"
            variant="standard"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button
            style={{ float: "right" }}
            type="submit"
            onClick={handleSubmit}
          >
            <SendIcon fontSize="large" sx={{ color: "#90caf9" }} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;
