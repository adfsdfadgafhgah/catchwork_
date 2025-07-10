import { useState } from "react";
import { axiosApi } from "../api/axiosAPI";
import { searchAddress } from "../api/signupAPI";
import { useNavigate } from "react-router-dom";

const corpRegex = {
  corpRegNo: /^\d{10}$/, // 사업자등록번호 10자리 숫자
  corpCEOName: /^[가-힣a-zA-Z]{2,30}$/, // 한글/영문 2~30자
  corpName: /^[가-힣a-zA-Z0-9 ]{2,50}$/, // 한글/영문/숫자 2~50자
  corpAddr: /.+/, // 필수
  corpHomeLink: /^https?:\/\/.+/, // http(s)로 시작
  corpBM: /.+/, // 필수
  // 필요시 추가
};

const useCorpFormHandler = (initialValues) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialValues);

  const [validity, setValidity] = useState({});
  const [isCorpVerified, setIsCorpVerified] = useState(false);
  const validateField = (name, value) => {
    if (corpRegex[name]) return corpRegex[name].test(value);
    return value.trim() !== "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let fieldValue = value;
    if (name === "corpLogo") {
      setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    }
    setValidity((prev) => ({
      ...prev,
      [name]: validateField(name, fieldValue),
    }));
  };

  const validateForm = () => {
    const nullableFields = [
      "corpType",
      "corpLogo",
      "detailAddress",
      "corpDetail",
      "corpBenefit",
      "corpBenefitDetail",
    ];

    const allFields = Object.keys(formData);
    const newValidity = {};
    let isValid = true;

    allFields.forEach((field) => {
      if (nullableFields.includes(field)) {
        newValidity[field] = true; // 검사 제외 (통과 처리)
      } else {
        const valid = validateField(field, formData[field] || "");
        newValidity[field] = valid;
        if (!valid) isValid = false;
      }
    });

    setValidity(newValidity);
    return isValid;
  };

  // corpregister
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const dataToSend = { ...formData };

    // 주소 병합
    if (dataToSend.memAddr && dataToSend.detailAddress) {
      dataToSend.corpAddr = `${dataToSend.corpAddr}^^^${dataToSend.detailAddress}`;
      delete dataToSend.detailAddress;
    }

    navigate("/ceosignup", { state: { corpInfo: formData } });
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

  const handleCorpRegisterAuth = async () => {
    const { corpRegNo, corpCEOName, corpOpenDate } = formData;

    if (!corpRegNo || !corpCEOName || !corpOpenDate) {
      alert("필수 정보를 입력해주세요.");
      setIsCorpVerified(false);
      return;
    }

    const exists = await axiosApi.post("/corpegnocheck", { corpRegNo });
    if (exists.data === true) {
      alert("이미 등록된 기업입니다.");
      setIsCorpVerified(false);
      return;
    }

    const verified = await axiosApi.post("/corpegnoauth", {
      corpRegNo,
      corpCEOName,
      corpOpenDate,
    });
    if (verified.data === true) {
      alert("사업자 인증 성공");
      setIsCorpVerified(true);
    } else {
      alert("사업자 인증 실패");
      setIsCorpVerified(false);
    }
  };

  const handleCorpJoinCheck = async () => {
    const { corpRegNo } = corpFormData;

    if (!corpRegNo) {
      alert("사업자등록번호를 입력해주세요.");
      setIsCorpVerified(false);
      return;
    }

    const exists = await axiosApi.post("/corpegnocheck", { corpRegNo });
    if (exists.data === true) {
      alert("등록된 기업입니다. 가입 가능");
      setIsCorpVerified(true);
    } else {
      alert("등록되지 않은 기업입니다. 관리자에게 문의하세요.");
      setIsCorpVerified(false);
    }
  };

  // 주소 입력
  const handleAddressSelect = (data) => {
    setField("corpAddr", data.roadAddress);
  };

  const triggerAddressSearch = () => {
    searchAddress(handleAddressSelect);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleCorpRegisterAuth,
    handleCorpJoinCheck,
    triggerAddressSearch,
    validity,
    isCorpVerified,
  };
};

export default useCorpFormHandler;
