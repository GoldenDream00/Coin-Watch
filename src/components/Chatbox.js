import React from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
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
const buttonStyle = {
  borderRadius: "100%",
  height: "75px",
  width: "75px",
  float: "left",
  position: "fixed",
  bottom: "5px",
  backgroundColor: "#90caf9",
};
const containerStyle = {
  position: "fixed",
  bottom: "80px",
  backgroundColor: "#1e1e1e",
  height: "80%",
  width: "100%",
  maxWidth: "450px",
  padding: "5px",
  zIndex: 100,
  color: "white",
  fontSize: "1.2rem",
};
const Chatbox = ({ socket, coin }) => {
  const messagesEndRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const { user } = CryptoState();
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState([]);
  console.log(socket)
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chatMessage", {message,user,coin});
    setMessage("");
  }
  React.useEffect(() => {
    socket.on("message", (chat) => {
      messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
      console.log(chat);
      setChat((p) => {
        return [...p, chat];
      });
    });
    
    // eslint-disable-next-line
  },[])
  return (
    <>
        <button
          style={buttonStyle}
          type="button"
          onClick={() => {
            setOpen((p) => {
              return !p;
            });
          }}
        >
          <ChatBubbleIcon size={30} />
        </button>
      {open && (
        <>
          <div style={containerStyle}>
            <div style={{display:"block",position:"relative",overflowY:"scroll",height:"90%"}}>
              {
                chat.map(e => {
                  return (
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Travis Howard"
                          src={e.user.photoURL}
                        />
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
                            >
                            </Typography>
                            {e.message}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  );
                })
              }
               <div ref={messagesEndRef} />   
            </div>
            <form>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <TextField
                  style={{
                    width: "85%",
                  }}
                  required
                  id="standard-required"
                  variant="standard"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <Button type="submit" onClick={handleSubmit}>
                  <SendIcon fontSize="large" sx={{ color: "#90caf9" }} />
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Chatbox;
