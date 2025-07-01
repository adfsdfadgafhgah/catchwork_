import { useState } from "react";

const useFormHandler = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);

  // 검사 대상 필드 확장
  const [validity, setValidity] = useState({
    memId: null,
    memPw: null,
    memPwConfirm: null,
    memEmail: null,
    memTel: null,
    memName: null,
    memNickname: null,
  });

  const idRegex = /^[a-zA-Z0-9]{5,20}$/;
  const pwRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telRegex = /^(\d{2,3})-(\d{3,4})-(\d{4})$/;
  const nameRegex = /^[가-힣a-zA-Z]{2,30}$/;
  const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;

  const validateField = (name, value) => {
    let result;
    switch (name) {
      case "memId":
        result = idRegex.test(value);
        break;
      case "memPw":
        result = pwRegex.test(value);
        break;
      case "memPwConfirm":
        result = value === formData.memPw;
        break;
      case "memEmail":
        result = emailRegex.test(value);
        break;
      case "memTel":
        result = telRegex.test(value);
        break;
      case "memName":
        result = nameRegex.test(value);
        break;
      case "memNickname":
        result = nicknameRegex.test(value);
        break;
      default:
        result = true;
    }
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 하이픈 처리
    if (name === "memTel") {
      let val = value.replace(/\D/g, ""); // 숫자만 추출

      if (val.length === 10) {
        val = val.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3"); // 2-4-4
      } else if (val.length === 11) {
        val = val.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"); // 3-4-4
      } else {
        if (val.length < 4) {
        } else if (val.length < 7) {
          val = val.replace(/(\d{2,3})(\d+)/, "$1-$2");
        } else if (val.length < 11) {
          val = val.replace(/(\d{2,3})(\d{3,4})(\d+)/, "$1-$2-$3");
        } else {
          val = val.slice(0, 11).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
      }

      setFormData((prev) => ({ ...prev, memTel: val }));
    } else {
      setFormData((prev) => {
        const newFormData = { ...prev, [name]: value };

        if (
          [
            "memId",
            "memPw",
            "memPwConfirm",
            "memEmail",
            "memName",
            "memNickname",
          ].includes(name)
        ) {
          const newValidity = {
            ...validity,
            [name]: validateField(name, value),
            ...(name === "memPw" && {
              memPwConfirm: newFormData.memPwConfirm === value,
            }),
          };
          setValidity(newValidity);
        }

        return newFormData;
      });
    }
  };

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { formData, setFormData, handleChange, setField, validity };
};

export default useFormHandler;
