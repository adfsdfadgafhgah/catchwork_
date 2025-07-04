export const validateForm = (formData, userType) => {
  const requiredFields = {
    memId: "아이디",
    memPw: "비밀번호",
    memPwConfirm: "비밀번호 확인",
    memEmail: "이메일",
    memTel: "전화번호",
    memName: "이름",
    memNickname: "닉네임",
    memBirthday: "생년월일",
    memGender: "성별",
    companyName: "회사명",
    businessNo: "사업자등록번호",
    ceoName: "대표자명",
    memAddr: "주소",
    detailAddress: "상세주소",
  };

  for (const [key, label] of Object.entries(requiredFields)) {
    if (
      (userType === "personal" &&
        ["companyName", "businessNo", "ceoName"].includes(key)) ||
      (userType === "corporate" &&
        ["memEmail", "memNickname", "memBirthday", "memGender"].includes(key))
    )
      continue;

    if (!formData[key]?.trim()) {
      alert(`${label}을 입력해주세요.`);
      return false;
    }
  }

  if (formData.memPw !== formData.memPwConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return false;
  }

  return true;
};
