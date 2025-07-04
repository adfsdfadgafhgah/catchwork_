import { useState } from "react";
import {
  checkDuplicateId,
  checkDuplicateNickname,
  searchAddress,
} from "../api/signupAPI";
import {
  generateRandomNickname,
  validateForm,
} from "../pages/member/utils/signupUtil";

const memberFormHandler = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);

  const [validity, setValidity] = useState({
    memId: null,
    memPw: null,
    memPwConfirm: null,
    memEmail: null,
    memTel: null,
    memName: null,
    memNickname: null,
    memBirthday: null,
    memGender: null,
    memAddr: null,
  });

  const regexRules = {
    memId: /^[a-zA-Z0-9]{5,20}$/,
    memPw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
    memEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    memTel: /^(\d{2,3})-(\d{3,4})-(\d{4})$/,
    memName: /^[가-힣a-zA-Z]{2,30}$/,
    memNickname: /^[a-zA-Z0-9가-힣_]{2,20}$/,
    memBirthday: /.+/, // null or '' 방지용
    memGender: /^(M|F)$/,
    memAddr: /.+/,
  };

  const validateField = (name, value) => {
    if (name === "memPwConfirm") return value === formData.memPw;
    return regexRules[name] ? regexRules[name].test(value) : true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "memTel") {
      let val = value.replace(/\D/g, "");
      if (val.length === 10)
        val = val.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
      else if (val.length === 11)
        val = val.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      else if (val.length < 4);
      else if (val.length < 7) val = val.replace(/(\d{2,3})(\d+)/, "$1-$2");
      else if (val.length < 11)
        val = val.replace(/(\d{2,3})(\d{3,4})(\d+)/, "$1-$2-$3");
      else val = val.slice(0, 11).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

      setFormData((prev) => ({ ...prev, memTel: val }));
      setValidity((prev) => ({
        ...prev,
        memTel: validateField("memTel", val),
      }));
    } else {
      const fieldValue = type === "checkbox" ? checked : value;
      setFormData((prev) => ({ ...prev, [name]: fieldValue }));

      if (validity.hasOwnProperty(name) || name === "memPw") {
        setValidity((prev) => ({
          ...prev,
          [name]: validateField(name, fieldValue),
          ...(name === "memPw" && {
            memPwConfirm: formData.memPwConfirm === fieldValue,
          }),
        }));
      }
    }
  };

  // 필드에 value 넣기
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validity.hasOwnProperty(name)) {
      setValidity((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  // 아이디 중복확인
  const handleCheckId = async () => {
    if (!formData.memId.trim()) return alert("아이디를 입력해주세요.");
    const available = await checkDuplicateId(formData.memId);
    alert(
      available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."
    );
  };

  // 닉네임 중복확인
  const handleCheckNickname = async () => {
    if (!formData.memNickname.trim()) return alert("닉네임을 입력해주세요.");
    const available = await checkDuplicateNickname(formData.memNickname);
    alert(
      available ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."
    );
  };

  // 주소 입력
  const handleAddressSelect = (data) => {
    setField("memAddr", data.roadAddress);
  };

  const triggerAddressSearch = () => {
    searchAddress(handleAddressSelect);
  };

  // 닉네임 생성
  const handleGenerateNickname = () => {
    const nickname = generateRandomNickname();
    setField("memNickname", nickname);
  };

  const validateForm = () => {
    const keysToCheck = Object.keys(validity);
    const results = keysToCheck.map((key) => validateField(key, formData[key]));
    const newValidity = keysToCheck.reduce((acc, key, i) => {
      acc[key] = results[i];
      return acc;
    }, {});
    setValidity(newValidity);
    return results.every((r) => r);
  };

  return {
    formData,
    setFormData,
    handleChange,
    setField,
    validity,
    handleCheckId,
    handleCheckNickname,
    triggerAddressSearch,
    handleGenerateNickname,
    validateForm,
  };
};

export default memberFormHandler;
