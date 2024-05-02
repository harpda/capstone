
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";


const Title = styled.h1`
    font-size:30px;
    margin-bottom:10px;
`

export default function DiaryPost() {

    const [isLoading, setIsLoading] = useState(false);
    const [diaryTitle, setDiaryTitle] = useState("");
    const [feeling, setFeeling] = useState("");
    const [diaryContent, setDiaryContent] = useState("");
    const navigate = useNavigate();

    //제목
    const onChangeDiaryTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiaryTitle(e.target.value);
        console.log("diaryTitle:", { diaryTitle });
    }

    //감정
    const onChangeFeeling = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeeling(e.target.value);
        console.log("Feeling:", { feeling });
    }

    //내용 
    const onChangeDiaryContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDiaryContent(e.target.value);
        console.log("diaryContent:", { diaryContent });
    }

    function resetDiary() {
        setDiaryTitle("");
        setFeeling("");
        setDiaryContent("");
    }

    //전송 이벤트 
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 현재 유저를 불러오기 
        const user = auth.currentUser;

        if (!user || isLoading || diaryContent === "" || diaryContent.length > 180) return;

        try {
            setIsLoading(true);
            //데이터 베이스 신청 
            //컬레션을 지정(추가)해줘야 함 
            // *중요* 현재 데이터베이스는 테스트 용으로 30일 뒤에 삭제 
            // 생성된 document의 참조를 promise로 반환할 수 있음 

            //날짜 생성
            const date = new Date();

            // 생성된 document의 참조를 promise로 반환할 수 있음
            const doc = await addDoc(collection(db, "diaries"), {

                //일기 제목
                diaryTitle,
                //감정
                feeling,
                //일기 내용
                diaryContent,

                //날짜 
                diaryDate: (date.getFullYear() + "-" +
                    ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
                    ("0" + (date.getDate() + 1)).slice(-2) + "-" +
                    ("0" + (date.getHours() + 1)).slice(-2) + ":" +
                    ("0" + (date.getMinutes() + 1)).slice(-2) +
                    ":" + ("0" + (date.getSeconds() + 1)).slice(-2)),

                //일기 고유 ID 
                credential: Date.now(),

                //사용자 ID
                userID: user.uid,



                // tweet,// 게시판 내용 
                // Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                // username: user.displayName || "Anonymous",
                // //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                // //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                // userId: user.uid,
            });

            //일기 데이터 초기화 
            resetDiary();

            //페이지 이동
            navigate("/");

        } catch (error) {
            console.log(error);
        }

        finally {
            setIsLoading(false);
        }

    }

    return (
        <>
            <div>
                <Title>Diary</Title>

                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Title</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="제목을 작성해주세요" value={diaryTitle} onChange={onChangeDiaryTitle} required />
                    </div>

                    <label htmlFor="exampleDataList" className="form-label">Feelings</label>

                    <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="오늘의 감정" value={feeling} onChange={onChangeFeeling} required />

                    <datalist id="datalistOptions">
                        <option value="슬픔" />
                        <option value="화남" />
                        <option value="우울" />
                        <option value="무서움" />
                        <option value="기쁨" />
                        <option value="보통" />
                    </datalist>

                    <br />

                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Diary Content</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={8} value={diaryContent} placeholder={"이 공간에서 만큼은 당신이 하고 싶은 어떤 말이든 다 존중해요."}
                            onChange={onChangeDiaryContent} required >
                        </textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {isLoading ? "Loading..." : "Save"}
                    </button>
                </form>
            </div>
        </>
    )
}