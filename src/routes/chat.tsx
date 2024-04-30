import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import "../css/Chat.css";
import profilePic1 from '../image/no4.png';
import profilePic2 from '../image/no9.png';

const socket = io('http://localhost:5000');

// Define the structure of a message object
interface Message {
    text: string;
    type: 'received' | 'sent';
}

function Chat() {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Server message handler
        socket.on('chat message', (msg: string) => {
            setMessages(messages => [...messages, { text: msg, type: 'received' }]);
        });

        // Cleanup the event listener
        return () => {
            socket.off('chat message');
        };
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the message list on update
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message) {
            socket.emit('chat message', message);
            setMessages(messages => [...messages, { text: message, type: 'sent' }]);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <ul className="message-list">
                {messages.map((msg, index) => (
                    <li key={index} className="message-item">
                        <div className={msg.type === 'received' ? 'message received' : 'message sent'}>
                            {msg.type === 'received' && <img src={profilePic1} alt="Receiver Profile" className="profile-pic" />}
                            <p className="message-content">{msg.text}</p>
                            {msg.type === 'sent' && <img src={profilePic2} alt="Sender Profile" className="profile-pic" />}
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={sendMessage} className="send-form">
                <input type="text" value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chat;
