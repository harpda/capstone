import 'boxicons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Title } from '../components/auth-components';
import GithubButton from '../components/github-btn';
import '../css/Login.scss';
import { auth } from '../firebase';


export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading || !formData.email || !formData.password) return;
    
        setIsLoading(true);
        try {
          if (isCreatingAccount) {
            // 회원가입 로직
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            console.log(userCredential.user); // 성공적으로 생성된 유저 정보 로그
            // 회원가입 성공 후 추가적인 액션 (예: 홈페이지로 이동)
          } else {
            // 로그인 로직
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
          }
          navigate("/");
        } catch (error) {
          setError(error.message); // 오류 발생 시 메시지 설정
        } finally {
          setIsLoading(false);
        }
      };

    const switchForm = () => setIsCreatingAccount(!isCreatingAccount);

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__img">
                    <img src="https://image.freepik.com/free-vector/code-typing-concept-illustration_114360-3581.jpg" alt="login visual" />
                </div>
                <div className="login__forms">
                    {isCreatingAccount ? (
                        <Form className="login__create" onSubmit={handleSubmit}>
                            <Title>Create Account</Title>
                            <div className="login__box">
                                <i className='bx bx-user login__icon'></i>
                                <Input type="text" placeholder="Username" className="login__input" />
                            </div>
                            <div className="login__box">
                                <i className='bx bx-at login__icon'></i>
                                <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required className="login__input" />
                            </div>
                            <div className="login__box">
                                <i className='bx bx-lock login__icon'></i>
                                <Input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" required className="login__input" />
                            </div>
                            <button className="login__button">Sign Up</button>
                            <GithubButton /> {/* GitHub 로그인 버튼 추가 */}
                            <div>
                                <span className="login__account">Already have an Account?</span>
                                <span className="login__signup" onClick={switchForm}>Sign In</span>
                            </div>
                        </Form>
                    ) : (
                        <Form className="login__register" onSubmit={handleSubmit}>
                            <Title>Sign In</Title>
                            <div className="login__box">
                                <i className='bx bx-user login__icon'></i>
                                <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required className="login__input" />
                            </div>
                            <div className="login__box">
                                <i className='bx bx-lock login__icon'></i>
                                <Input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" required className="login__input" />
                            </div>
                            <Link to="#" className="login__forgot">Forgot Password?</Link>
                            <button className="login__button">Sign In</button>
                            <GithubButton /> {/* GitHub 로그인 버튼 추가 */}
                            <div>
                                <span className="login__account">Don't Have an Account?</span>
                                <span className="login__signup" onClick={switchForm}>Sign Up</span>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
    
}
