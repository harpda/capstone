import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/create_account"
import styled, { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { useEffect, useState } from "react"
import LoadingScreen from "./components/loading_screen"
import { auth } from "./firebase"
import ProtectedRoute from "./components/protected_route"
import Update from "./routes/update"
import Chat from "./routes/chat"
import Board from "./routes/board"
import Dairy from "./routes/diary"
import 'bootstrap/dist/css/bootstrap.min.css';
import { DiaryDetail } from "./components/Diary/diaryDetail"
import MediaRecommond from "./routes/media_recommanded"

//배열을 routes에 전달 
const router = createBrowserRouter([
  {
    // Layout컴포넌트를 이용해서 / url을 완전히 감싸는 것 
    path: "/",
    element: <ProtectedRoute>
      {/* layout */}
      <Layout /></ProtectedRoute>,
    // 배열 생성히여 서브 라우터 생성(중첩 라우터) 
    // chidren에 있는 라우터로 이동해도 부모 라우터인 Layout 컴포넌트도 같이 라우트 됨 

    children: [
      {
        // 경로를 공백으로 설정해놓으면 "/" 와 같은 url에서 같이 출력  
        path: "",
        element:
          // 프로필 및 홈 page는 모두 ProtectedRoute의 children으로 전송 
          <Home />,
      },

      {
        path: "board",
        element:
          <Board />,
      },


      {
        path: "profile",
        element:
          <Profile />,
      },

      {
        path: "update/:id",
        element:
          <Update />,
      },


      {
        path: "chat",
        element:
          <Chat />,
      },

      // 일기장
      {
        path: "diary",
        element:
          <Dairy />,
      },

      {
        path:"diary/detail/:id",
        element:
        <DiaryDetail/>
      },

      {
        path:"mediaRecommanded",
      element:
      <MediaRecommond/>
    },

    ],
  },

  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/create_Account",
    element: <CreateAccount />
  }
]);

const GlobalStyles = createGlobalStyle`
${reset};
*{
  box-sizing:border-box;
}

body{
  background-color:black;
  color:white;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

::-webkit-scrollbar {
display:none;
}
`;

const Wrapper = styled.div`
  height:100vh;
  display:flex;
  justify-content:center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  //로그인 화면 
  const init = async () => {
    // 인증 상태가 준비되었는지를 기다림 
    // 최초 인증 상태가 완료될 때 실행해오는 Promise을 return 
    // firebase가 쿠키와 토큰을 읽고 백엔드와 소통해서 로그인 여부를 확인하는 동안 대기 
    await auth.authStateReady();

    setIsLoading(false);
  };

  useEffect(() => {
    init();

  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {/* RouterProvider:  */}
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
