import styled from "styled-components";

export const MainTitle =styled.h1`
font-size:20px;
margin-bottom:10px;
`;

export const Wrapper = styled.div`
height:100%;
display:flex;
flex-direction:column;
align-items:center;
width:450px;
padding:50px 0px;
`;

export const Title = styled.h1`
font-size:42px;
`;

export const Form = styled.form`
margin-top:50px;
margin-bottom:10px;
display:flex;
flex-direction:column;
gap:10px;
width:100%;
`;

export const Input = styled.input`
padding:10px 20px;
border-radius:50px;
border:none;
width:100%;
font-size:16px;
/* 만약 type이 submit이라면 cursor를 pointer로 바꿈 */
&[type="submit"]{
    background-color:blue;
    color:white;
    /* 커서 해당 태그 위에 위치하면 마우스 커서의 모양이 바뀜 */
    cursor: pointer;
    &:hover{
        opacity:0.8;
    }
}
`;

export const Error = styled.span`
  font-weight : 600;
color:tomato;
`;

export const Switcher = styled.span`
    margin-top:20px;
    margin-bottom:10px;
    a{
        color:#1d9bf0;
    }
`;
