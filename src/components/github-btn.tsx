import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components"
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
    background-color:white;
    margin-top:50px;
    padding: 10px 20px;
    border-radius: 50px;
    border:0;
    display:flex;
    gap:5px;
    align-items:center;
    justify-content:center;
    color:black;
    //firebase를 이용해서 
    cursor:pointer;
`;

const Logo = styled.img`
    height:25px;
`;



export default function GithubButton() {
    const navigate =useNavigate();

    const onClick = async () => {
        try {


            const provider = new GithubAuthProvider();


            await signInWithPopup(auth, provider);

            //home으로 이동 
            navigate("/");
        } catch (error) {
            console.error(error);
        }

    }

    return (<Button onClick={onClick}>
        <Logo src="/github_log.svg" />
        Continue with Github
    </Button>)
}