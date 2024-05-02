import styled from "styled-components";
import { auth, db, storage } from "../firebase"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import Tweet from "../components/Board/tweet";
import Diary from "../components/Diary/diary";


const Wrapper = styled.div`
display:flex;
align-items:center;
flex-direction:column;
gap:20px;
width:100%;
`;


const AvatarUpload = styled.label`
width:80px;
overflow:hidden;
height:80px;
border-radius:50%;
background-color:#181a1c;
/* 버튼 처럼 보이게 cursor를 포인터 */
cursor: pointer;
display:flex;
justify-content:center;
align-items:center;
svg{
    width:70px;
}

`;
const AvatarImg = styled.img`
width:100%;`;

const AvatarInput = styled.input`
display:none;
`;
const Name = styled.label`
font-size:22px;
`;

const Tweets = styled.div`
    display:flex;
    flex-direction:column;
    gap:10px;
`;

export const Form = styled.form`
display:flex;
flex-direction:column;
gap:10px;
`;

export const Label = styled.label`
cursor: pointer;
`;

export const Input = styled.input`
    
`;

export const Button = styled.input`
    
`;


export const Title = styled.h1`
    font-size:20px;
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


//인터페이스 작성 
export interface IDiary {
    // photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    diaryTitle: string;
    diaryContent: string;
    diaryDate: string;
    id:string;
}


export default function Profile() {
    const user = auth.currentUser;
    // 프로필 이미지 초기값을 uesr에서 가져온 PhtoURL로 설정
    const [avatar, setAavatar] = useState(user?.photoURL);
    // 배열 설정
    const [tweets, setTweets] = useState<ITweet[]>([]);

    // 배열 설정
    const [diaries, setDiaries] = useState<IDiary[]>([]);

    const [nickName, setNickName] = useState(user?.displayName);

    const [updateNickName, setUpdateNickName] = useState("");

    const [isUpdateNickName, setIsUpdateNickName] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { setUpdateNickName(e.target.value); }

    //닉네임 변경 입력 창 이벤트 
    const onUpdateNickName = () => {
        setIsUpdateNickName((current) => !current);
    }



    //전송 이벤트 
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setUpdateNickName("");

        const isConfirm = confirm("닉네임을 업데이트 하시겠습니까?");

        if (!user || !isConfirm || updateNickName === "" || updateNickName.length > 15) {
            return;
        }

        try {
            await updateProfile(user,
                {
                    displayName: updateNickName,
                })

            setNickName(updateNickName);
            setIsUpdateNickName(false);


            const tweetQuery = query(
                collection(db, "tweets"),
                // 유저 ID가 같은 트윗들만 가져오기
                // profile.tsx:116 Uncaught (in promise) 
                // FirebaseError: The query requires an index
                // what the fucking index?
                /*
                    => where("userId", "==", user?.uid), 
                    이러한 필터 명령어를 firestore에 알려야 함
                    오류에서 제공하는 url 사이트로 이동
                    */
                where("userId", "==", user?.uid),
                orderBy("Credential", "desc"),
                limit(25),
            );

            // 해당 쿼리 명령대로 값 import
            const snapshot = await getDocs(tweetQuery);

            snapshot.docs.map(async (document) => {
                const { username } = document.data();


                // 만약 displayName과 username이 다르다면 변경 처리 
                if (user?.displayName !== null && user?.displayName !== username) {

                    if (typeof document.id === "string") {
                        // firestore 인스턴스와 document 경로를 사용하여 document 참조 생성
                        const docRef = doc(db, "tweets", document.id);

                        // document 업데이트
                        await updateDoc(docRef, {
                            username: user?.displayName,
                        });

                        if (user?.displayName !== "string")
                            return;
                    }
                }

            }

            );
        }

        catch (error) {
            console.log(error);
        }


    }

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        // 유저 정보가 없으면 반환
        if (!user) return;

        if (files && files.length === 1) {
            const file = files[0];
            // 1. 유저 이미지를 저장할 수 있는 ref를 생성
            // 파일명은 userid
            // 유저이미지가 변경되어도 동일한 파일 이름으로 업로드 되어 덮어쓰기
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            //url 반환 
            const avatarUrl = await getDownloadURL(result.ref);
            setAavatar(avatarUrl);

            await updateProfile(user,
                {
                    photoURL: avatarUrl,
                }

            )


        }
    }

    // 사용자가 작성한 tweet만 보여주기
    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db, "tweets"),
            // 유저 ID가 같은 트윗들만 가져오기
            // profile.tsx:116 Uncaught (in promise) 
            // FirebaseError: The query requires an index
            // what the fucking index?
            /*
                => where("userId", "==", user?.uid), 
                이러한 필터 명령어를 firestore에 알려야 함
                오류에서 제공하는 url 사이트로 이동
                */
            where("userId", "==", user?.uid),
            orderBy("Credential", "desc"),
            limit(25),
        );
        // 해당 쿼리 명령대로 값 import
        const snapshot = await getDocs(tweetQuery);
        // 값 배열에 저장
        const tweets = snapshot.docs.map((document) => {
            const { tweet, Credential, userId, username, photo } = document.data();

            return {
                tweet, Credential, userId, username, photo,
                id: document.id,
            };
        }

        );
        setTweets(tweets);


    }

        // 사용자가 작성한 tweet만 보여주기
        const fetchDiaries = async () => {
            const diaryQuery = query(
                collection(db, "diaries"),
                // 유저 ID가 같은 트윗들만 가져오기
                // profile.tsx:116 Uncaught (in promise) 
                // FirebaseError: The query requires an index
                // what the fucking index?
                /*
                    => where("userId", "==", user?.uid), 
                    이러한 필터 명령어를 firestore에 알려야 함
                    오류에서 제공하는 url 사이트로 이동
                    */
                where("userID", "==", user?.uid),
                orderBy("credential", "desc"),
                limit(25),
            );
            // 해당 쿼리 명령대로 값 import
            const snapshot = await getDocs(diaryQuery);
            // 값 배열에 저장
            const diaries = snapshot.docs.map((document) => {
                const { diaryTitle, diaryContent, diaryDate} = document.data();
    
                return {
                    diaryTitle, diaryContent, diaryDate,
                    id: document.id,
                };
            }
    
            );
            setDiaries(diaries);

        }

    useEffect(() => { fetchTweets(); fetchDiaries(); }, [])

    return (
        <Wrapper>
            {/* label태그인 AvatarUpload태그를 클릭하면 */}
            {/* file 태그인 AvatatInput 태그가 활성화 됨 */}
            {/*htmlFor 속성은 label태그에서 사용됨*/}
            <AvatarUpload htmlFor="avatar">
                {/*사용자 이미지가 있다면 출력, 없으면 로고*/}
                {avatar ? <AvatarImg src={avatar} /> :
                    <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                }
            </AvatarUpload>
            {/*  파일 업로드 컨트롤에서 사용자가 선택할 수 있는 파일의 유형을 지정
             사용자가 모든 유형의 이미지 파일만 선택할 수 있도록 설정 */}
            {/* 이미지를 클릭할 때마다 Input창이 보여지도록 설정 */}
            {/* 이미지 기능은 input에 삽입해야함*/}
            <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />


            {/* 옵션 체이닝(?.user): user객체가 존재하면 displayName 아니면 undefined */}
            {/* null병합연산자(??):만약 user가 null or undefined라면 "Anonymous 반환" */}
            {/* name버튼 클리시 inform 태그 보이기 */}
            <Name onClick={onUpdateNickName}>{nickName + `(버튼 클릭시 변경)` ?? "Anonymous"}  </Name>

            {!isUpdateNickName ? null :
                <Form onSubmit={onSubmit} >
                    <Label>
                        Update NickName
                    </Label>
                    <Input value={updateNickName} onChange={onChange} maxLength={15} required>

                    </Input>
                    <Button type="submit" value={"Update NickName"} />
                </Form>
            }

            <Title>게시판 목록</Title>

            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>

            <Title>일기 목록</Title>

            <Tweets>
                {diaries.map((diary) => (
                    <Diary key={diary.id} {...diary} />
                ))}
            </Tweets>

        </Wrapper>
    )
}