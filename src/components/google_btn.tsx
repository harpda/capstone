import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./socialLogin-components";
import { auth } from "../firebase";
import {  GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export default function GoogleBtn(){
    const navigate = useNavigate();

    const onClick = async () => {
        try {
            //무조건 firebase/auth 이걸로 해야 함 
            const provider = new GoogleAuthProvider();
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
        <Logo src="/google_log.svg" />
        Continue with Google
    </Button>)

}