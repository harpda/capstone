import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
 display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;

`;

const Column = styled.div``;


const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
font-weight:600;
font-size:15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

//트윗 삭제
const DeleteButton = styled.button`
    background-color:tomato;
    color:white;
    font-weight:600;
    border:0;
    font-size:12px;
    padding:5px 10px;
    text-transform:uppercase;
    border-radius:5px;
    cursor:pointer;
`;

//트윗 업데이트 
const UpdateButton = styled.button`
    background-color:tomato;
    color:white;
    font-weight:600;
    border:0;
    font-size:12px;
    padding:5px 10px;
    text-transform:uppercase;
    border-radius:5px;
    cursor:pointer;
    margin-left:3px;
`;



export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    //현재 유저값 가져오기 
    const user = auth.currentUser;
    const navigate = useNavigate();

    const onDelete = async () => {
        //정말 삭제 할 것인지 사용자 확인 
        const ok = confirm("Are you sure you want to delete this tweet?");

        // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
        // confirm에서 취소를 눌러도 조기 종료(삭제 X)
        if (!ok || user?.uid !== userId) return;

        try {
            // 트윗을 삭제할 문서를 반환
            // 매개변수는 삭제할 문서에 대한 참조
            // 파이어베이스 인스턴스를 넘겨 주기
            // 문서가 저장된 경로
            await deleteDoc(doc(db, "tweets", id));
            // 만약 사진이 있다면 사진도 같이 삭제
            if (photo) {
                //이미지 경로
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                // 이미지 삭제
                await deleteObject(photoRef);
            }

        } catch (error) {
            console.log(error);
        }

        finally {
            //
        }
    }

    //트윗 업데이트
    const onUpdate = async () => {
        // 해당 트윗 id와 사용자 id가 다르면 조기 종료(삭제 X) 
        // confirm에서 취소를 눌러도 조기 종료(삭제 X)
        //user?.uid=> 객체가 존재하면 user.uid 값을 반환하고, 만약 user가 null이나 undefined라면 에러를 발생시키지 않고 undefined를 반환
        if (user?.uid !== userId) return;
        //{`/movie/${id}`}
        // 상대 경로로 설정을 하면 home 페이지가 아닌 
        //profile페이지에서 이동할 때 서로 url이 다르기 때문에 에러가 발생
        //이럴땐 /를 사용하여 절대 경로를 지정
        navigate(`/Update/${id}`);
    }

    return (
            <Wrapper>
                <Column>
                    <Username>
                        {username}
                    </Username>
                    
                    <Payload>
                        {tweet}
                    </Payload>
                    {/* 본인만 작성한 트윗만이 삭제버튼이 보일 수 있도록 설정 */}
                    {/* 작성자 트윗 ID와 게시판 트윗 ID와 비교  */}
                    {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}

                    {/* 본인만 작성한 트윗만이 수정 버튼이 보일 수 있도록 설정 */}
                    {/* 작성자 트윗 ID와 게시판 트윗 ID와 비교  */}
                    {user?.uid === userId ? <UpdateButton onClick={onUpdate}>Update</UpdateButton> : null}

                </Column>

                <Column>
                    {photo ? (<Photo src={photo} />) : null}
                </Column>
            </Wrapper>
    );
}