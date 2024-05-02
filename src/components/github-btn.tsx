import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components"
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./socialLogin-components";


export default function GithubButton() {
    const navigate =useNavigate();

    const onClick = async () => {
        try {
            //무조건 firebase/auth 이걸로 해야 함 
            const provider = new GithubAuthProvider();
            // 팝업 창을 이용하여 로그인

            //현재 리다이렉션으로 하면 에러 발생 
            // await signInWithRedirect(auth, provider);
            await signInWithPopup(auth, provider);

            //home으로 이동 
            navigate("/");
        } 
        
        catch (error) {
            console.error(error);
        }
    }

    return (<Button onClick={onClick}>
        <Logo src="/github_log.svg" />
        Continue with Github
    </Button>)
}