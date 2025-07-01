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

export const generateRandomNickname = () => {
  // 난수 생성
  const generateRandomNum = () => {
    const num = Math.floor(100 + Math.random() * 900); // 100~999
    return num;
  };

  const adjectives = [
    "검은",
    "붉은",
    "엄청난",
    "숨겨진",
    "공포의",
    "금빛",
    "미친",
    "뛰어난",
    "근사한",
    "무서운",
    "조",
  ];
  const nouns = [
    "바지",
    "수염",
    "거인",
    "요정",
    "드워프",
    "늑대",
    "곰",
    "셔츠",
    "인간",
    "기계",
    "민장",
  ];

  const tag = generateRandomNum();
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}_${noun}_${tag}`;
};
