import React from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Container,  TextField, Button } from "@mui/material";
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
const Chatbox = ({ socket,coin }) => {
  const [open, setOpen] = React.useState(true);
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
      console.log(chat);
      setChat((p) => {
        return [...p, chat];
      });
    });
    // eslint-disable-next-line
  },[])
  return (
    <>
      <Container>
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
      </Container>
      {open && (
        <Container>
          <div
            style={{
              position: "fixed",
              bottom: "100px",
              backgroundColor: "#1e1e1e",
              height: "60%",
              width: "100%",
              maxWidth: "600px",
              padding: "5px",
              zIndex: 100,
              color: "white",
              fontSize: "1.2rem",
            }}
          >
            <div
              style={{
                position: "fixed",
                height: "50%",
                width: "100%",
                maxWidth: "600px",
                padding: "5px",
                zIndex: 100,
                color: "white",
                fontSize: "1.2rem",
                overflowY: "scroll",
              }}
            >
              {chat.map((e) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingBottom: "5px",
                    }}
                  >
                    <p style={{ paddingRight: "10px", color: "#787e87",maxWidth:"30%" }}>
                      {e.user.displayName}
                    </p>
                    <p>{e.message}</p>
                  </div>
                );
              })}
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
        </Container>
      )}
    </>
  );
};

export default Chatbox;
