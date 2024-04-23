
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCMgpYI2JVOISNrnEo4v8TpzzX07ymfBIg",
  authDomain: "test-bbd33.firebaseapp.com",
  projectId: "test-bbd33",
  storageBucket: "test-bbd33.appspot.com",
  messagingSenderId: "501247615973",
  appId: "1:501247615973:web:aadbecf1d9ceba1ee0050c"
};

//파이어 베이스 실행 
const app = initializeApp(firebaseConfig);

// 우리가 활성화환 인증 product에 대한 접근 권한 요청
export const auth= getAuth(app);

//스토리지 생성 
export const storage = getStorage(app);

//DB생성 
export const db = getFirestore(app);

