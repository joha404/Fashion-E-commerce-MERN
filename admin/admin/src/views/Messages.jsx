import React, { useState, useEffect } from "react";
import userAvatar from "../../assets/img/user.jpg";
import axios from "axios";
import "./Messages.css";

export default function Messages() {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/messages`);
        console.log("Response is: ", response.data);
        if (Array.isArray(response.data)) {
          setMessage(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  // Function to delete a specific message
  const deleteMessage = async (messageID) => {
    try {
      await axios.delete(`http://localhost:3000/messages/delete/${messageID}`);
      setMessage((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageID)
      ); // Remove deleted message from state
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="container">
      <div className="messages">
        <div className="messageSection">
          {loading ? (
            <p>Loading messages...</p>
          ) : message.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            message
              .slice()
              .reverse() // Reverse the order (last to first)
              .map((item, index) => (
                <div className="messageBody my-5" key={item._id}>
                  <div className="messageUserTop">
                    <div className="messageUserImageDiv">
                      <img
                        src={userAvatar}
                        className="messageUserImage"
                        alt=""
                      />
                      <div className="messageUserDetails">
                        <h3>{item.name}</h3>
                        <p>{item.email}</p>
                        <p>
                          {new Date(item.updatedAt).toLocaleString("en-BD", {
                            timeZone: "Asia/Dhaka",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="messageDelete">
                      <i
                        onClick={() => deleteMessage(item._id)} // Pass message ID to deleteMessage function
                        className="fa-solid fa-trash"
                      ></i>
                    </div>
                  </div>
                  <div className="userMessage">
                    <p>{item.messages?.at(-1)}</p> {/* Show last message */}
                  </div>
                  <div className="messageBottom mt-3">
                    <a href={`mailto:${item.email}`}>Send Feedback</a>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
