import { axiosApi } from "./axiosAPI"; // 내부 API
import axios from "axios"; // 외부용

/**********************
 * 회원가입 요청
 **********************/
export const postSignUp = async (formData) => {
  return await axiosApi.post("/signup", formData);
};

/**********************
 * 아이디 중복확인
 **********************/
export const checkDuplicateId = async (memId) => {
  const res = await axiosApi.get("/check-id", { params: { memId } });
  return res.data.available; // true: 사용 가능
};

/**********************
 * 닉네임 중복확인
 **********************/
export const checkDuplicateNickname = async (nickname) => {
  const res = await axiosApi.get("/check-nickname", { params: { nickname } });
  return res.data.available;
};

/**********************
 * 주소 검색
 **********************/
export const searchAddress = (onComplete) => {
  new window.daum.Postcode({
    oncomplete: onComplete,
  }).open();
};

/**********************
 * 문자 인증 - 인증번호 발송
 **********************/
// export const sendVerificationCode = async (tel) => {
//   const res = await axios.post("https://api.coolsms.co.kr/sms/send", {
//     to: tel,
//     from: "발신자번호",
//     text: "인증번호는 [123456] 입니다.",
//     api_key: "API_KEY",
//     api_secret: "API_SECRET",
//   });
//   return res.data;
// };

/**********************
 * 문자 인증 - 인증번호 확인
 **********************/
// export const verifyCode = async (tel, code) => {
//   const res = await axios.post("/verify-code", { tel, code }); // 서버에서 검증 로직 필요
//   return res.data.success;
// };

/**********************
 * 기업대표 가입 요청
 **********************/
export const postCEOSignUp = async (formData) => {
  return await axiosApi.post("/ceosignup", formData);
};
