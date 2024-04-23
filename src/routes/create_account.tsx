import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Form,Error, Input, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";

// react로 form을 생성하는 걸 도와주는 패키지 

export default function CreateAccount() {
    const navigate= useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //에러 메시지 
    const [error, setError]= useState("");

    const onChange = (e: React.ChangeEvent<HTMLElement>) => {
        //input의 name값을 이용하여 이벤트 발생 
        // const { target: { name, value }, } = e;
        const { name, value } = e.target as HTMLInputElement;
        
        if (name === "name") {
            setName(value);
        }

        else if (name === "email") {
            setEmail(value);
        }

        else if (name === "password") {
            setPassword(value);
        }
    }

    //submit 이벤트가 발생했을 때 
    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //버튼 클릭시 에러 메세지는 우선 삭제 
        setError("");
        
        if(isLoading || name=== "" || email === "" ||password=== "") return;

        // 계정 생성 
        try {
            setIsLoading(true);
            

            const credentials =await createUserWithEmailAndPassword(auth,email,password); //해당 정보로 회원가입 요청 
            //바로 정보를 얻을 수 있음 
            console.log(credentials.user);

            
            await updateProfile(credentials.user, {
                displayName:name,
            });
            //게정을 만들고, 사용자 프로필을 업데이트 한 후에 자동으로 로그인 되면서 메인페이지로 이동
            navigate("/");
        }
        catch (e) {
            if(e instanceof FirebaseError)
                {
                    // 예시 (이미 등록된 email)
                    // e.code: auth/email-already-in-use
                    // e.message: Firebase: Error (auth/email-already-in-use).
                    console.log(e.code, e.message);
                    setError(e.message);
                }
            //예외 처리 

        }

        finally
        {
            setIsLoading(false);
        }
        // 사용자 프로필의 이름을 지정 
        // 홈페이지로 리다이렉션

        console.log(name, email, password);
    }


    return( 
    <Wrapper>
        <Title> Join✅</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required />
            <Input onChange={onChange} name="email" value={email} placeholder="email" type="email" required />
            <Input onChange={onChange} name="password" value={password} placeholder="password" type="password" required />

            {/* 버튼 */}
            <Input type="submit" value={isLoading ? "Loading" : "Crate-account"} />

        </Form>

        {error !=="" ? <Error>{error}</Error>: null}
        <Switcher>
            Already have an account?{""}
            {/* 로그인 창으로 이동 */}
            <Link to="/login">log in &rarr;</Link>

        </Switcher>

        <GithubButton/>
    </Wrapper>
    )
}

//react.js나 event listener같은 걸 사용한 input 로직을 만듬 