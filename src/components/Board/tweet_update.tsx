import styled from "styled-components";
import { AttachFileButton, AttachFileInput, Form, SubmitBtn, TextArea } from "./board-component";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import {  db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Error } from "../auth-components";


const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Label = styled.label`
    color:red;
    
`

const ExistingImageButton= styled.label`
    padding:10px 0px;
    color:#1d9bf0;
    text-align:center;
    border-radius:20px;
    border:1px solid #1d9bf0;
    font-size:14px;
    font-weight:600;
    background-color:black;
    cursor:pointer;
`;
//인터페이스 작성 
export interface ITweet {
    id: string;
    photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    username: string;
    userId: string;
    tweet: string;
    Credential: number;
}

export interface TweetUpdateProps {
    doc_id: string;
  }
  
  

  //doc_id
export default function TweetUpdate({doc_id}:TweetUpdateProps)
{
    
    // 파일 state
    const [file, setFile] = useState<File | null>(null);
    // 파일 프리뷰  string, ArrayBuffer, 또는 null 타입
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | ArrayBuffer | null>('');

    const [fileError, setFileError] = useState("");

    const [isUpdateFile, setIsUpdateFile]= useState(false);

    const navigate= useNavigate();

    const [updatedoc, setupdateDoc] = useState<ITweet>();
    const [tweetText, setTweetText] = useState("");

    const [isLoadingUpdate, setIsLoadingUpdate]= useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);


    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetText(e.target.value); }

useEffect(() => {

    // 특정 문서 ID를 이용하여 데이터를 가져오는 비동기 함수
async function getDocumentData() {
  //타입이 string인지 체크
  if (typeof doc_id === "string") {
      // 'users' 컬렉션에서 특정 문서 ID를 가진 문서에 대한 참조 생성
      const docRef = doc(db, "tweets", doc_id);

      // 참조를 사용하여 문서 정보 가져오기
      const docSnap = await getDoc(docRef);

      // 문서의 존재 여부 확인 및 데이터 출력
     
      //해당 쿼리에 대한 모든 문서 반환 
      if(docSnap.exists())
          {
              const doc_tweet = () => {

                  const { tweet, Credential, userId, username, photo } = docSnap.data();
  
                  return { tweet, Credential, userId, username, photo, id: docSnap.id, }
              }
              setupdateDoc(doc_tweet);
          }
  }

}

  getDocumentData();

  //  updateDoc 상태는 여전히 초기 상태일 수 있으며, 따라서 undefined일 수 있습니다.
  // , doc_tweet 함수를 실행한 결과를 updateDoc 상태에 저장해야 합니다. 
  //그리고 updateDoc 상태가 업데이트된 후에 tweet 상태를 업데이트하려면, 
  //이 로직을 useEffect 훅 안에 넣어 updateDoc 상태의 변경을 감지하여 처리

  if (typeof updatedoc?.tweet === "string") {
      setTweetText(updatedoc.tweet);
  }

  // 도대체 이유를 모르겠네.... 
}, [updatedoc?.tweet])



// 타입이 file인 input이 변경될 때마다 파일의 배열을 받게 됨
// 파일을 여러 개를 받을 수도 있기 때문에 예외처리 설정
const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
        setFileError("");
        setImagePreviewUrl('');

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

                // 프리뷰
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImagePreviewUrl(reader.result);
                };

                reader.readAsDataURL(files[0]);
                setIsUpdateFile(true);
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


//기존 사진 제거 예정 
const onExsitingImageRemove =() =>
    {
        // 변경 사진이 있을 시에는 무조건 기존 사진 삭제 예정
        if(!file)
            {
                setIsUpdateFile((current)=>!current);
            }
    }

//변경 예 사진 제거 
const onFileRemove= ()=>{

    setFile(null);
    setImagePreviewUrl(null);

   // 파일 입력 필드 초기화
    // 같은 파일을 재선택 했을 때 업로드가 자동으로 
    //안되도록 하는 기능을 해제
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }

}


//전송 이벤트 
const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const isConfirm = confirm("업데이트 하시겠습니까?");

    if (!isConfirm || tweetText === "" || tweetText.length > 180)
        {
            return;
        } 

    try {
 
        setIsLoadingUpdate(true);

        if (typeof doc_id === "string") {
            // firestore 인스턴스와 document 경로를 사용하여 document 참조 생성
            const docRef = doc(db, "tweets", doc_id);

            // document 업데이트
            await updateDoc(docRef, {
                tweet: tweetText,
            });

            //사진 수정 
            if(isUpdateFile){

                //기존 사진 삭제 
                const docRef = doc(db, "tweets", doc_id);
                
                await updateDoc(docRef, {
                    ["photo"]: deleteField()
                  });

                //변경할 사진이 있다면
                if(file)
                    {
                        const locationRef = ref(storage, `tweets/${updatedoc?.userId}/${doc_id}`);
                //파일 위치, 파일 데이터
                //파일 업로드에 성공하면 url 등에 정보를 반환 
                const result = await uploadBytes(locationRef, file);
                //url 반환 
                const url = await getDownloadURL(result.ref);

                // document 업데이트
                await updateDoc(docRef, {
                    // Photo랑 헷갈리면 안됨
                    photo:url,
                });
                    }
                
            }
            navigate("/");
        }
        setTweetText("");
        setFile(null);

    } catch (error) {
        console.log(error);
    } finally {
        setIsLoadingUpdate(false);
    }

}

    return(

        <Form onSubmit={onSubmit}>

        <TextArea onChange={onChange} value={tweetText} rows={5} maxLength={180} required />

        {updatedoc?.photo ? 
        <>
        <label>기존 사진</label> <Photo src={updatedoc?.photo} />

        <ExistingImageButton onClick={onExsitingImageRemove}  >
        {!isUpdateFile? "기존 사진 제거":"기존 사진 제거 예정"}

        </ExistingImageButton>

        </> : <Label>기존 사진: No photo</Label>}

        {imagePreviewUrl && 
        <>
        <label>변경 사진</label>
        <Photo src={imagePreviewUrl.toString()} alt="Image preview..." />
        <AttachFileButton onClick={onFileRemove} >변경 사진 제거</AttachFileButton>
        </>
        }

        {/* htmlFor id와 같은 id 값을 가지고 있다면 label을 눌렀을 때*/}
        {/* file버튼을 클릭하는 것과 같게 동작 */}
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
        {/* AttachFileButton와 AttachFileInput 같은 동작 */}
        <AttachFileInput onChange={onFileChange} type="file" id="file" ref={fileInputRef} accept="image/*" />

        <SubmitBtn type="submit"  value={!isLoadingUpdate? "Update Tweet":"Updating..."}/>

        {!fileError ? null : <Error>{ }</Error>}

    </Form>
    )
}