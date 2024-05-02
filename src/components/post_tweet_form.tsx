import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Error } from "./auth-components";

const Form = styled.form`
display:flex;
flex-direction:column;
gap:10px;

`;

const TextArea = styled.textarea`
border: 2px solid white;
padding: 20px;
border-radius:20px;
font-size:16px;
color:white;
background-color:black;
width:100%;
resize:none;
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

&::placeholder{
    font-size:16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
&:focus{
    outline:none;
    border-color:#1d9bf0;
}
`;

const AttachFileButton = styled.label`
    padding:10px 0px;
    color:#1d9bf0;
    text-align:center;
    border-radius:20px;
    border:1px solid #1d9bf0;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
`;

const AttachFileInput = styled.input`
display:none;
`;

const SubmitBtn = styled.input`
background-color:#1d9bf0;
color:white;
border:none;
padding:10px 0px;
border-radius:20px;
font-size:16px;
cursor: pointer;
&:hover,
&:active{
    opacity:0.9;
}
`;

export default function PostTweeterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }

    // 타입이 file인 input이 변경될 때마다 파일의 배열을 받게 됨
    // 파일을 여러 개를 받을 수도 있기 때문에 예외처리 설정
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setFileError("");

            const { files } = e.target;
            //파일 크기 1MB미만으로 설정
            const MB = 1024 * 1024; //1mb(메가)

            //오로지 하나의 파일만 받게 설정
            if (files && files.length === 1) {
                //파일 크기(bytes)
                const size = files[0].size;
                //1MB 미만 크기의 파일 데이터만 등록
                if (size < MB) {
                    //첫 번째 파일을 file state에 저장
                    setFile(files[0]);
                }
                else {
                    setFileError("file size can't over 1MB");
                }
            }
        }

        catch (error) {
            console.log(error);
        }

    }

    //전송 이벤트 
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 현재 유저를 불러오기 
        const user = auth.currentUser;

        if (!user || isLoading || tweet === "" || tweet.length > 180) return;

        try {
            setIsLoading(true);
            //데이터 베이스 신청 
            //컬레션을 지정(추가)해줘야 함 
            // *중요* 현재 데이터베이스는 테스트 용으로 30일 뒤에 삭제 
            // 생성된 document의 참조를 promise로 반환할 수 있음 

            const doc = await addDoc(collection(db, "tweets"), {
                tweet,// 게시판 내용 
                Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                username: user.displayName || "Anonymous",
                //트윗을 삭제하고자 할 때 트윗을 삭제할 권한이 있는 유저를 구분
                //트윗을 삭제하려는 유저의 ID와 여기 userID에 저장된 ID가 일치하는 확인 
                userId: user.uid,
            });
            
            //이미지 등록 
            //해당 파일의 위치에 대한 reference를 받아야함 
            //업로드된 파일이 저장되는 폴더명과 파일 명을 지정
            if (file) {                           //tweets/유저 Id-유저명/ 문서 ID(문서 id가 사진이름)
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                //파일 위치, 파일 데이터
                //파일 업로드에 성공하면 url 등에 정보를 반환 
                const result = await uploadBytes(locationRef, file);
                //url 반환 
                const url = await getDownloadURL(result.ref);
                //해당 url를 다시 db document에 저장 
                //이미지 파일를 업로드하고 해당 파일 url을 반환받으면 다시 document 업데이트 
                await updateDoc(doc, {
                    photo: url,
                })
            }
            setTweet("");
            setFile(null);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    return <Form onSubmit={onSubmit}>
        <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="what is happening?" required />
        {/* htmlFor id와 같은 id 값을 가지고 있다면 label을 눌렀을 때*/}
        {/* file버튼을 클릭하는 것과 같게 동작 */}
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
        {/* AttachFileButton와 AttachFileInput 같은 동작 */}
        <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />

        <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post Tweet"} />

        {!fileError ? null : <Error>{fileError}</Error>}

    </Form>
}