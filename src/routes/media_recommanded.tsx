import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import YouTube from "react-youtube";
import { Col, Row } from 'react-bootstrap';

interface VideoContent {
    videoId: string;
    title: string;
}

const opts = {
    width: "250",
    height: "150",
    playerVars: {
        autoplay: 0,
    },
};


export default function MediaRecommond() {

    //Socket io 
    const [socket, setSocket] = useState<Socket | null>(null);

    // 현재 입력 필드에 입력된 메세지 필드
    const [mediaContentText, setMediaContentText] = useState('');

    // 결과값 받기 
    const [mediaContentResult, setMediaContentResult] = useState<VideoContent[]>();

    const onChangeMediaContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMediaContentText(e.target.value);
    }


    // 컴포넌트가 마운트될 때 한 번만 실행되며, "시작" 메시지를 서버에 보냅니다.
    useEffect(() => {
        //웹크롤링 nodeJS 서버 
        const newSocket = io('http://localhost:4900');
        setSocket(newSocket);
    }, []);

    useEffect(() => {
        // socket 상태가 null이 아닐 때만 실행
        if (socket) {
            console.log("WebScrawling Node.Js Server Connect");

            socket.on('community message', (msg) => {
                setMediaContentResult(msg);
            });
        }

        //  클린업 함수가 실행(이벤트 리스너 해제 및 연결 종료)
        return () => {
            if (socket) {
                console.log("WebCrawling Node.Js Server Disconnect");
                // 이벤트 리스너 해제
                socket.off('community message');
                // 실제 소켓 연결을 종료합니다.
                socket.disconnect();
                setSocket(null);
            }
        };

    }, [socket]); // socket 상태를 의존성 배열에 추가: setSocket()을 사용하여 할당한다고 하더라도 즉시 할당되는 것은 아니므로
    //의존성 배열에 socket state를 설정하여socket state에 값이 설정되면 그때 실행되도록 설정

    // 컨텐츠 전송
    const sendMediaContent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMediaContentResult(undefined);

        if (mediaContentText) {
            if (socket) {
                try {
                    // 메세지 전송
                    socket.emit('community message', mediaContentText);
                    console.log("전송완료");
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    };

    //페이지 이동 시 
    useEffect(() => {
        // 페이지를 떠나기 전에 확인 요청
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
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



    return (
        <div>
            <form onSubmit={sendMediaContent}>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">
                        {`추천 미디어를 검색할 때 "~노래, ~영상" 이런식으로 작성해주세요`}
                    </label>
                    <input className="form-control" id="exampleFormControlTextarea1" value={mediaContentText} onChange={onChangeMediaContent}></input> <br />
                    <input type="submit" value={"검색"}></input>
                </div>
            </form>


            <div className="popularChart youtube">
                <Row className="mb-3" style={{ marginTop: 40, marginLeft: 40 }}>
                </Row>
                <div className="centeral">
                    <div
                        style={{
                            margin: 20,
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width: "80%",
                        }}
                    >
                        {
                            mediaContentResult ?
                                mediaContentResult.map((item, index) => (
                                    <Col>
                                        <Row
                                            // className="justify-content-center"
                                            style={{ padding: "10px 0" }}
                                        >
                                            <YouTube key={index} videoId={item.videoId} opts={opts} />
                                            <div style={{ width: 280 }}>
                                                {item.title.replace(/&QUOT;/gi, '"')}
                                            </div>
                                        </Row>
                                    </Col>
                                )) : null
                        }
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    )

}