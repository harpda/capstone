

import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/database";

//인터페이스 작성 
export interface ITweet {
    id: string;
    photo?: string; //필수가 아니기 때문에 required 아닌 것으로 설정
    username: string;
    userId: string;
    tweet: string;
    Credential: number;
}

const Wrapper = styled.div`
    display:flex;
    gap:10px;
    flex-direction:column;
    overflow-y:scroll;
`;


export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    //변수의 타입:Unsubscribe 또는 null로 설정

    useEffect(() => {
        // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
        let unsubscribe: Unsubscribe | null = null;
        
        const fetchTweets = async () => {
            //Query 쿼리문
            const tweetQuery = query(
                collection(db, "tweets"),
                //쿼리 Credential 필드를 기준으로 내림차순
                orderBy("Credential", "desc"),
                // 게시물을 3개만 불러오도록 실행
                limit(3),
            );
    
            unsubscribe= await onSnapshot(tweetQuery/* 쿼리 등록*/, (snapshot)=>
                {
                //해당 쿼리에 대한 모든 문서 반환 
               const tweets = snapshot.docs.map(
                // 모든 문서를 배열에 반환 
                (doc) => {
                        const { tweet, Credential, userId, username, photo } = doc.data();
                        return {
                            tweet, Credential, userId, username, photo,
                            id: doc.id,
                        }
                    }
               );
                //다시 재 등록
                setTweet(tweets);
            })
        }

        fetchTweets();

        return ()=>{

            unsubscribe && unsubscribe();// => unsubcribe가 참으로 간주되면 unsubscribe()호출된다는 뜻
            
            console.log("unsubcribe");
        }

    }, []);

    return (
        <Wrapper>
            {
                tweets.map((tweet) => (<Tweet key={tweet.id} {...tweet} />)) //나머지 데이터는 {...tweet}
                // 같은 것 =>  tweets.map((tweet) =>{ return <Tweet key={tweet.id} {...tweet} />})
            }
        </Wrapper>

    );
}