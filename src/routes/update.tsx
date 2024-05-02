
import { useParams } from "react-router-dom";
import TweetUpdate from "../components/tweet_update";
import { useEffect, useState } from "react";

export default function Update() {
    // id값 가져오기
    const { id } = useParams();
    const [docId, setDocID]= useState<string | undefined>("");

    useEffect(()=>{
        setDocID(id);
        console.log(docId);
    },[])
    
    return (
        <>
            {/*id의 타입은 무조건 string임을 통보*/}
            <TweetUpdate doc_id ={id!}/>
        </>
    )
}