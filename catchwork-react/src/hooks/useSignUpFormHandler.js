import { useState } from "react";
import {
  checkDuplicateId,
  checkDuplicateNickname,
  searchAddress,
} from "../api/signupAPI";

const defaultRegex = {
  // 개인/기업/대표자 공통 필드
  memId: /^[a-zA-Z0-9]{5,20}$/,
  memPw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
  memEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  memTel: /^(\d{2,3})-(\d{3,4})-(\d{4})$/,
  memName: /^[가-힣a-zA-Z]{2,30}$/,
  memNickname: /^[a-zA-Z0-9가-힣_]{2,20}$/,
  memBirthday: /.+/,
  memGender: /^(M|F)$/,
  memAddr: /.+/,
  // 대표자(ceo) 필드
  ceoId: /^[a-zA-Z0-9]{5,20}$/,
  ceoPw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
  ceoName: /^[가-힣a-zA-Z]{2,30}$/,
  ceoTel: /^\d{2,3}-\d{3,4}-\d{4}$/,
  ceoEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // 기업 필드
  corpRegNo: /^\d{10}$/,
  corpCEOName: /^[가-힣a-zA-Z]{2,30}$/,
  corpName: /^[가-힣a-zA-Z0-9 ]{2,50}$/,
  corpAddr: /.+/,
  corpHomeLink: /^https?:\/\/.+/, // http(s)로 시작
  corpBM: /.+/,
};

export default function useSignUpFormHandler(initialValues, config) {
  const [formData, setFormData] = useState(initialValues);
  const [validity, setValidity] = useState(
    Object.fromEntries(config.fields.map((f) => [f, null]))
  );

  // config.regexRules가 있으면 우선 사용, 없으면 defaultRegex에서 자동 적용
  const validateField = (name, value) => {
    const regex =
      (config.regexRules && config.regexRules[name]) || defaultRegex[name];
    if (name === config.pwConfirmField)
      return value === formData[config.pwField];
    if (regex) return regex.test(value);
    return value != null && value.toString().trim() !== "";
  };

  // 회원가입 폼 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === "checkbox" ? checked : value;

    if (config.telField && name === config.telField) {
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
      fieldValue = val;
    }

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    if (validity.hasOwnProperty(name) || name === config.pwField) {
      setValidity((prev) => ({
        ...prev,
        [name]: validateField(name, fieldValue),
        ...(name === config.pwField && config.pwConfirmField
          ? {
            [config.pwConfirmField]:
              formData[config.pwConfirmField] === fieldValue,
          }
          : {}),
      }));
    }
  };

  // 특정 필드 값 설정
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validity.hasOwnProperty(name)) {
      setValidity((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  // 아이디 중복 체크
  const handleCheckId = async () => {
    if (!formData[config.idField]?.trim())
      return alert("아이디를 입력해주세요.");
    const available = await checkDuplicateId(formData[config.idField]);
    alert(
      available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."
    );
  };

  // 닉네임 중복 체크
  const handleCheckNickname = async () => {
    if (!formData[config.nicknameField]?.trim())
      return alert("닉네임을 입력해주세요.");
    const available = await checkDuplicateNickname(
      formData[config.nicknameField]
    );
    alert(
      available ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."
    );
  };

  // 주소 입력
  const handleAddressSelect = (data) => {
    setField(config.addrField, data.roadAddress);
  };
  const triggerAddressSearch = () => {
    searchAddress(handleAddressSelect);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const keysToCheck = config.fields;
    const results = keysToCheck.map((key) => validateField(key, formData[key]));
    const newValidity = keysToCheck.reduce((acc, key, i) => {
      acc[key] = results[i];
      return acc;
    }, {});
    setValidity(newValidity);
    return results.every((r) => r);
  };

  // 회원가입 폼 핸들러 반환
  return {
    formData,
    handleChange,
    setField,
    validity,
    handleCheckId,
    handleCheckNickname,
    triggerAddressSearch,
    validateForm,
    setFormData,
  };
}
