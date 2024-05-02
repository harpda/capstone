import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { IDiary } from "../../routes/profile";
import  "./diary.css";

const Wrapper = styled.div`
 display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;

`;

const Column = styled.div``;

const Username = styled.span`
font-weight:600;
font-size:15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;



export default function Diary({ id, diaryTitle, diaryDate, diaryContent }: IDiary) {

    return (
        <Link to={`/diary/detail/${id}`} className="linkStyle">
            <Wrapper>
                <Column>
                    <Username>
                        {diaryTitle}
                    </Username>

                    <Payload>
                        {diaryContent}
                    </Payload>
                </Column>
                <Column>
                    {diaryDate}
                </Column>
            </Wrapper>
        </Link>
    );
}