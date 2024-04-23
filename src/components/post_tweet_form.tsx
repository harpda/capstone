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


    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setFileError("");

            const { files } = e.target;
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

            const doc = await addDoc(collection(db, "tweets"), {
                tweet,// 게시판 내용 
                Credential: Date.now(),//특정 시간부터 경과한 밀리초(millisecond 반환) 
                // 작성자 유저 닉네임:, 유저 닉네임이 없으면 익명으로 저장 
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });
            
            if (file) {                           //tweets/유저 Id-유저명/ 문서 ID(문서 id가 사진이름)
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                //파일 위치, 파일 데이터
                //파일 업로드에 성공하면 url 등에 정보를 반환 
                const result = await uploadBytes(locationRef, file);
                //url 반환 
                const url = await getDownloadURL(result.ref);

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

        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
        {/* AttachFileButton와 AttachFileInput 같은 동작 */}
        <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />

        <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post Tweet"} />

        {!fileError ? null : <Error>{fileError}</Error>}

    </Form>
}