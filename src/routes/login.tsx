import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Form, Error, Input, Switcher, Title, Wrapper, MainTitle } from "../components/auth-components";
import GithubButton from "../components/github-btn";
import GoogleBtn from "../components/google_btn";

// react로 form을 생성하는 걸 도와주는 패키지 

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //에러 메시지 
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLElement>) => {
        // input의 name값을 이용하여 이벤트 발생 
        // const { target: { name, value }, } = e;
        const { name, value } = e.target as HTMLInputElement;
        //const name= e.target.name;
        //const value= e.target.value; 

        if (name === "email") {
            setEmail(value);
        }

        else if (name === "password") {
            setPassword(value);
        }
    }

    //submit 이벤트가 발생했을 때 
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //기본 동작 해제 
        e.preventDefault();
        //버튼 클릭시 에러 메세지는 우선 삭제 
        setError("");

        //로딩중, 이메일 공백, 비밀번호 공백 
        if (isLoading || email === "" || password === "") return;

        // 계정 생성 
        try {
            setIsLoading(true);
            //로그인 되어 있는 상태인지 체크 
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        }
        catch (e) {
            if (e instanceof FirebaseError) {
                // 예시 (이미 등록된 email)
                // e.code: auth/email-already-in-use
                // e.message: Firebase: Error (auth/email-already-in-use).
                console.log(e.code, e.message);
                setError(e.message);
            }
            //예외 처리 

        }

        finally {
            setIsLoading(false);
        }
        // 사용자 프로필의 이름을 지정 
        // 홈페이지로 리다이렉션

        console.log(email, password);
    }


    return (
        <>
            <Wrapper>
                <MainTitle>
                Mental Health : The sun of mind 
                </MainTitle>

                <Title> Log into ✅</Title>
                <Form onSubmit={onSubmit}>
                    <Input onChange={onChange} name="email" value={email} placeholder="email" type="email" required />
                    <Input onChange={onChange} name="password" value={password} placeholder="password" type="password" required />

                    {/* 버튼 */}
                    <Input type="submit" value={isLoading ? "Loading" : "Log in"} />

                </Form>

                {error !== "" ? <Error>{error}</Error> : null}
                <Switcher>
                    Don't have an account?{""}
                    {/* 로그인 창으로 이동 */}
                    <Link to="/create_Account">Create one &rarr;</Link>
                </Switcher>
                <GithubButton />
                <GoogleBtn />
            </Wrapper>
        </>
    )
}

//react.js나 event listener같은 걸 사용한 input 로직을 만듬 