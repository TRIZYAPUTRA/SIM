import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponCSS from './Respon.module.css';

const Respon = () => {
  const [messages, setMessages] = useState([]); // Daftar pesan
  const [newMessage, setNewMessage] = useState(''); // Pesan baru
  const [receiverNim, setReceiverNim] = useState('admin'); // NIM penerima, bisa diubah ke admin atau NIM pengguna lain
  const nim = localStorage.getItem('nim'); // NIM pengguna dari localStorage

  // Ambil pesan berdasarkan NIM pengguna
  useEffect(() => {
    if (nim) {
      axios.get(`http://localhost:5000/messages/${nim}`)
        .then(res => setMessages(res.data))
        .catch(err => console.error('Error fetching messages:', err));
    }
  }, [nim]);

  // Kirim pesan
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      axios.post('http://localhost:5000/messages', {
        sender_nim: nim,
        receiver_nim: receiverNim,
        message: newMessage
      })
        .then((response) => {
          setMessages([...messages, {
            sender_nim: nim,
            receiver_nim: receiverNim,
            message: newMessage,
            timestamp: new Date()
          }]);
          setNewMessage('');
        })
        .catch(err => console.error('Error sending message:', err));
    }
  };

  return (
    <div className={ResponCSS.pesanContainer}>
      <h1 className={ResponCSS.title}>Pesan Pengguna</h1>
      <div className={ResponCSS.messagesSection}>
        <h2 className={ResponCSS.subTitle}>Pesan Anda</h2>
        <div className={ResponCSS.messagesList}>
          {messages.map((msg, index) => (
            <div key={index} className={`${ResponCSS.messageItem} ${msg.sender_nim === nim ? ResponCSS.sent : ResponCSS.received}`}>
              <p>{msg.message}</p>
              <span>{new Date(msg.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={ResponCSS.newMessage}>
        <textarea
          className={ResponCSS.textarea}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tulis pesan..."
        />
        <button className={ResponCSS.sendButton} onClick={handleSendMessage}>Kirim</button>
      </div>
      
    </div>
  );
};

export default Respon;
