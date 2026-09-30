import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://ln-code-backend.onrender.com');

function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const chatEndRef = useRef(null);

  // Poll for token changes to catch new logins immediately across windows
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, [token]);

  // Decode current logged in user from JWT
  const getUsername = () => {
    const activeToken = localStorage.getItem('token');
    if (!activeToken) return 'Anonymous';
    try {
      const payload = JSON.parse(atob(activeToken.split('.')[1]));
      return payload.user?.username || 'User';
    } catch {
      return 'User';
    }
  };

  const currentUser = getUsername();

  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageData = {
      sender: currentUser,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit('sendMessage', messageData);
    setInputMessage('');
  };

  // If not logged in, do not render chat button
  if (!token) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn"
          style={{
            borderRadius: '50px',
            padding: '12px 24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          💬 Community Chat
        </button>
      ) : (
        <div
          style={{
            width: '340px',
            height: '450px',
            background: 'var(--bg-color, #1e293b)',
            border: '1px solid var(--border-color, #334155)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--option-bg, #0f172a)',
              borderBottom: '1px solid var(--border-color, #334155)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}
          >
            <h4 style={{ margin: 0, color: 'var(--text-color, #fff)' }}>
              🌐 Global Chat ({currentUser})
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--subtext-color, #94a3b8)',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages List */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <p style={{ color: 'var(--subtext-color, #94a3b8)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
                No messages yet. Start chatting!
              </p>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.sender === currentUser;
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      background: isMe ? 'var(--btn-bg, #06b6d4)' : 'var(--option-bg, #334155)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                      fontSize: '13px'
                    }}
                  >
                    {!isMe && (
                      <span style={{ fontSize: '10px', fontWeight: 'bold', display: 'block', color: '#cbd5e1' }}>
                        {msg.sender}
                      </span>
                    )}
                    <span>{msg.text}</span>
                    <span style={{ fontSize: '9px', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '4px' }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid var(--border-color, #334155)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color, #334155)',
                background: 'var(--option-bg, #0f172a)',
                color: 'var(--text-color, #fff)',
                fontSize: '13px'
              }}
            />
            <button type="submit" className="btn" style={{ padding: '8px 14px', fontSize: '13px' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default GlobalChat;