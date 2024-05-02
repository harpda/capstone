import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";

const Title = styled.h1`
    font-size:30px;
    margin-bottom:10px;
`;

const Button = styled.button`
margin-right:10px;
`;

//인터페이스 작성 
export interface IDiary {
    // photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    diaryTitle: string;
    diaryContent: string;
    diaryDate: string;
    id: string;
    feeling: string;
}

export function DiaryDetail() {
    const { id } = useParams();
    const [diaryObject, setDiaryObject] = useState<IDiary>();

    const [isLoading, setIsLoading] = useState(false);
    const [updateDiaryTitle, setDiaryTitle] = useState("");
    const [updateFeeling, setFeeling] = useState("");
    const [date, setDate] = useState("");
    const [updateDiaryContent, setDiaryContent] = useState("");

    const navigate = useNavigate();

    //제목
    const onChangeDiaryTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiaryTitle(e.target.value);
        console.log("diaryTitle:", { updateDiaryTitle });
    }

    //감정
    const onChangeFeeling = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFeeling(e.target.value);
        console.log("Feeling:", { updateFeeling });
    }

    //내용 
    const onChangeDiaryContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDiaryContent(e.target.value);
        console.log("diaryContent:", { updateDiaryContent });
    }

    function resetDiary() {
        setDiaryTitle("");
        setFeeling("");
        setDiaryContent("");
    }


    useEffect(() => {

        // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
        async function getDocumentData() {
            //타입이 string인지 체크
            if (typeof id === "string") {
                // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
                const docRef = doc(db, "diaries", id);

                // 참조를 사용하여 문서 정보 가져오기
                const docSnap = await getDoc(docRef);

                // 문서의 존재 여부 확인 및 데이터 출력

                //해당 쿼리에 대한 모든 문서 반환 
                if (docSnap.exists()) {
                    const diaryObject = () => {

                        const { diaryTitle, diaryContent, diaryDate, feeling } = docSnap.data();

                        return { diaryTitle, diaryContent, diaryDate, feeling, id: docSnap.id, }
                    }
                    setDiaryObject(diaryObject);
                }
            }

        }

        getDocumentData();

        //  updateDoc 상태는 여전히 초기 상태일 수 있으며, 따라서 undefined일 수 있습니다.
        // , doc_tweet 함수를 실행한 결과를 updateDoc 상태에 저장해야 합니다. 
        //그리고 updateDoc 상태가 업데이트된 후에 tweet 상태를 업데이트하려면, 
        //이 로직을 useEffect 훅 안에 넣어 updateDoc 상태의 변경을 감지하여 처리

        if (typeof diaryObject?.diaryTitle === "string") {
            setDiaryTitle(diaryObject.diaryTitle);
        }

        if (typeof diaryObject?.diaryContent === "string") {
            setDiaryContent(diaryObject.diaryContent);
        }

        if (typeof diaryObject?.feeling === "string") {
            setFeeling(diaryObject.feeling);
        }

        if (typeof diaryObject?.diaryDate === "string") {
            setDate(diaryObject.diaryDate);
        }

        // 도대체 이유를 모르겠네.... 
    }, [diaryObject?.diaryTitle])

    const onDelete = async () => {

        //정말 삭제 할 것인지 사용자 확인 
        const ok = confirm("해당 일기를 삭제 하겠습니까?");

        // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
        // confirm에서 취소를 눌러도 조기 종료(삭제 X)
        if (!ok) {
            return;
        }

        try {
            setIsLoading(true);
            // 트윗을 삭제할 문서를 반환
            // 매개변수는 삭제할 문서에 대한 참조
            // 파이어베이스 인스턴스를 넘겨 주기
            // 문서가 저장된 경로
            if (typeof id === "string") {
                console.log({ id });
                await deleteDoc(doc(db, "diaries", id));
                resetDiary();
            }

            navigate("/profile");

        } catch (error) {
            console.log(error);
        }

        finally {
            setIsLoading(false);
        }
    }

    const onSave = async () => {


        const ok = confirm("해당 일기를 저장하겠습니까?");

        if (!ok) return;

        try {
            setIsLoading(true);
            //타입이 string인지 체크
            if (typeof id === "string") {
                // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
                const docRef = doc(db, "diaries", id);

                // 일기 document 업데이트
                await updateDoc(docRef, {
                    diaryTitle: updateDiaryTitle,
                    diaryContent: updateDiaryContent,
                    feeling: updateFeeling,
                });

                navigate("/profile");
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }

    }

    return (
        <>
            <div>
                <Title>{`MyDiary (${date})`}</Title>

                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Title</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="제목을 작성해주세요" value={updateDiaryTitle} onChange={onChangeDiaryTitle} required />
                    </div>

                    <label htmlFor="exampleDataList" className="form-label">Feelings</label>

                    <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="오늘의 감정" value={updateFeeling} onChange={onChangeFeeling} required />

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
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={8} value={updateDiaryContent} placeholder={"이 공간에서 만큼은 당신이 하고 싶은 어떤 말이든 다 존중해요."}
                            onChange={onChangeDiaryContent} required >
                        </textarea>

                    </div>
                </form>

                <Button className="btn btn-primary" onClick={onSave}>
                    {isLoading ? "Loading..." : "Save"}
                </Button>

                <Button className="btn btn-primary" onClick={onDelete}>
                    {isLoading ? "Loading..." : "Delete"}
                </Button>

            </div>
        </>
    )

}