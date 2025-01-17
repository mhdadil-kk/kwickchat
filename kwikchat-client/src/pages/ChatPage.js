import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState('You');
  const navigate = useNavigate();

  // Create a ref for the chat box
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const loggedInUserName = localStorage.getItem('userName') || 'You';
    setUserName(loggedInUserName);

    const socketInstance = io('https://kwickchat.onrender.com');
    setSocket(socketInstance);

    socketInstance.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socketInstance.on('system_message', (message) => {
      setMessages((prev) => [...prev, { text: message, sender: 'System' }]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket) return;
    socket.emit('send_message', { text: message, sender: userName });
    setMessage('');
  };

  const handleNextStranger = () => {
    if (socket) {
      socket.emit('next_stranger');
      setMessages([]);
    }
  };

  const handleExitChat = () => {
    if (socket) {
      socket.disconnect();
    }
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
      <h2 className="text-4xl font-bold text-center mb-8">Chat with a Stranger</h2>

      {/* Chat Box */}
      <div
        ref={chatBoxRef} // Attach the ref to the chat box container
        className="bg-white text-black p-6 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 h-96 overflow-auto mb-8 rounded-lg shadow-lg border border-gray-200"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${msg.sender === userName ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-4 rounded-xl max-w-xs text-sm ${
                msg.sender === userName
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p className="font-semibold">{msg.sender === userName ? 'You' : msg.sender}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input and Buttons */}
      <div className="flex flex-wrap justify-between gap-4 w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
        {/* Message Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
        />

        {/* Send Button with Paper Plane Icon */}
        <button
          onClick={handleSendMessage}
          className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
          Send
        </button>

        {/* Other Buttons */}
        <button
          onClick={handleNextStranger}
          className="bg-yellow-600 hover:bg-yellow-800 text-white px-8 py-3 rounded-lg shadow-md transition duration-300"
        >
          Next Stranger
        </button>
        <button
          onClick={handleExitChat}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition duration-300"
        >
          Exit Chat
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
