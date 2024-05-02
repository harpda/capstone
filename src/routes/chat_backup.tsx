
import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import '../css/Chat.css'; // 메시지 스타일링을 위한 CSS 파일


// 메시지 타입 선언
type Messages = {
    text: string;
    type: 'received' | 'sent'; // 'type' 필드가 받을 수 있는 값으로 'received'와 'sent'를 제한
};


// 여기 꼭 설정 하기 (node js의 url)
const socket = io('http://localhost:5000');


export default function Chat() {
    // 현재 입력 필드에 입력된 메세지 필드
    const [message, setMessage] = useState('');
    // 채팅 메시지 목록, 
    const [messages, setMessages] = useState<Messages[]>([]);
    

    // 컴포넌트가 마운트될 때 서버로부터 메시지를 받기 위한 이벤트 리스너를 설정합니다. 
    //메시지를 받으면 messages 상태 배열에 새 메시지를 추가합니다. 
    //컴포넌트가 언마운트될 때 이벤트 리스너를 해제합니다.
    useEffect(() => {
        // Node Js 서버로부터 받은 메시지를 처리
        socket.on('chat message', (msg) => {
            // 콜백 함수
            setMessages((messages) => [...messages, { text: msg, type: 'received' }]);
        });

        //  클린업 함수가 실행(이벤트 리스너 해제)
        return () => {
            socket.off('chat message');
                
        };
    }, []);

    //useEffect는 메시지 목록이 업데이트될 때마다 실행됩니다. 
    //이는 새 메시지가 도착할 때마다 채팅 화면을 자동으로 스크롤하여 최신 메시지를 보여주기 위함입니다.
    useEffect(() => {
        // 스크롤을 최하단으로 이동
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]); // 메시지 목록이 업데이트될 때 실행

    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {
        socket.emit('chat message', "시작");
    }, [])

    //페이지 이동 시 
    useEffect(() => {
        // 페이지를 떠나기 전에 확인 요청
        const handleBeforeUnload = (e:BeforeUnloadEvent) => {
          const message = "정말 이 페이지를 떠나시겠습니까?";
          e.returnValue = message; // Chrome에서 필요
          return message; // 다른 브라우저에서 필요
        };
      
        window.addEventListener('beforeunload', handleBeforeUnload);
      
        // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []); // 빈 의존성 배열을 사용해서 컴포넌트 마운트 시에만 이벤트 리스너를 추가하고, 언마운트 시에 제거

      
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