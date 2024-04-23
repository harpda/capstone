import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

const Wrapper = styled.div`
display:grid;
gap:50px;
grid-template-columns: 1fr 5fr;
padding:50px 0px;
width:100%;
max-width:860px;
`;

const Menu = styled.div`
display:flex;
flex-direction:column;
align-items:center;
gap:20px; 
`;

const MenuItem = styled.div`
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
border:2px solid white;
height: 50px;
width:50px;
border-radius:50%;

svg{
   width:30px;
   fill:white;
}

/* &.log-out: 이건 무슨 의미?  */
&.log-out{
   border-color:tomato;
   svg{
      fill:tomato;
   }
}
`;

export default function Layout() {
   const navigate = useNavigate();

   //로그아웃을 누를 때 한 번더 확인 
   const onLogOut = async () => {
      /*confirm: 브라우저 함수 */
      const ok = confirm("are you sure you want to log out?");
      if (ok) {
         await auth.signOut();
         navigate("/login");
      }
   };

   return (
      <Wrapper>
         <Menu>
            <Link to="/">
               {/*home*/}
               <MenuItem>
                  <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                     <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
               </MenuItem>
            </Link>

            <Link to="/profile">

               {/*profile*/}
               <MenuItem>
                  <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
               </MenuItem>
            </Link>

            {/* logout */}
            <MenuItem className="log-out" onClick={onLogOut}>
               <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
               </svg>
            </MenuItem>

            {/* chat */}

            <Link to="/chat">
            <MenuItem>
               <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
               </svg>
            </MenuItem>
            </Link>

         </Menu>

         <Outlet />
      </Wrapper>
   )
}