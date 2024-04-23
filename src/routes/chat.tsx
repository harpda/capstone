
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일



// 메시지 타입 선언
type Messages = {
    text: string;
    type: 'received' | 'sent'; // 'type' 필드가 받을 수 있는 값으로 'received'와 'sent'를 제한
};

// 여기 꼭 설정 하기
const socket = io('http://localhost:5173');


export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Messages[]>([]);

    useEffect(() => {
        // 서버로부터 받은 메시지를 처리
        socket.on('chat message', msg => {
            setMessages((messages) => [...messages, { text: msg, type: 'received' }]);
        });

        // 이벤트 리스너 해제
        return () => {
            socket.off('chat message');
        };
    }, []);

    useEffect(() => {
        // 스크롤을 최하단으로 이동
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]); // 메시지 목록이 업데이트될 때 실행

    //처음 메시지 실행
    useEffect(() => {
        socket.emit('chat message', "시작");
    }, [])

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message) {
            socket.emit('chat message', message);
            setMessages(messages => [...messages, { text: message, type: 'sent' }]);
            setMessage('');
        }
    };

    return (
        <div className="App">
            <h1>마음이</h1>
            <div className="chat-container">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <li key={index} className={msg.type === 'received' ? 'message received' : 'message sent'}>
                            {msg.text}
                        </li>
                    ))}
                </ul>
                <form onSubmit={sendMessage} className="send-form">
                    <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." required />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}