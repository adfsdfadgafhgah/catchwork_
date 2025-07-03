import { axiosApi } from "./axiosAPI"; // 내부 API
import axios from "axios"; // 외부용

/**********************
 * 회원가입 요청
 **********************/
export const postSignUp = async (formData) => {
  const dataToSend = { ...formData };

  // 비밀번호 확인 제거
  delete dataToSend.memPwConfirm;

  // 개인회원일 경우 기업회원 입력 값 제거거
  if (dataToSend.memType === 0) {
    delete dataToSend.companyName;
    delete dataToSend.businessNo;
    delete dataToSend.ceoName;
  }

  if (dataToSend.memBirthday && new Date(dataToSend.memBirthday) > new Date()) {
    dataToSend.memBirthday = new Date().toISOString().split("T")[0];
  }

  // 전화번호 하이픈 제거
  if (dataToSend.memTel) {
    dataToSend.memTel = dataToSend.memTel.replace(/-/g, "");
  }
  // SMS flag Y/N 변환환
  dataToSend.memSmsFl = dataToSend.memSmsFl ? "Y" : "N";

  // 주소 병합 처리 (주소^^^상세주소)
  if (dataToSend.memAddr && dataToSend.detailAddress) {
    dataToSend.memAddr = `${dataToSend.memAddr}^^^${dataToSend.detailAddress}`;
    delete dataToSend.detailAddress;
  }

  // 디버깅용
  // console.log(dataToSend);
  return await axiosApi.post("/signup", dataToSend);
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
    oncomplete: function (data) {
      if (onComplete) {
        setTimeout(() => onComplete(data), 0);
      }
    },
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
