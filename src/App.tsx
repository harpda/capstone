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

//배열을 routes에 전달 
const router = createBrowserRouter([
  {
    // Layout컴포넌트를 이용해서 / url을 완전히 감싸는 것 
    path: "/",
    element: <ProtectedRoute>
      {/* layout */}
      <Layout /></ProtectedRoute>,

    children: [
      {
        path: "",
        element: 
          <Home/> ,
      },

      {
        path: "profile",
        element: 
          <Profile />,
      },

      {
        path: "update/:id",
        element:
        <Update/>,
      },

      
      {
        path: "chat",
        element:
        <Chat/>,
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
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
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
  const[isLoading, setIsLoading] = useState(true);
  
  //로그인 화면 
  const init = async()=>{

    await auth.authStateReady();

    setIsLoading(false);
  };

  useEffect(()=> {init();

  },[]);

  return (
    <Wrapper>
    <GlobalStyles/>
    {/* RouterProvider:  */}
{ isLoading ? <LoadingScreen/>:   <RouterProvider router={router}/> }   
  </Wrapper>
      );
}

export default App;
