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

  const handleAuthenticationCheck = async () => {
    // 인증에 필요한 필드만 추출
    const { corpRegNo, corpCEOName, corpOpenDate } = formData;

    if (!corpRegNo || !corpCEOName || !corpOpenDate) {
      alert("사업자등록번호, 대표자 성명, 개설일자를 모두 입력해주세요.");
      setIsCorpVerified(false);
      return;
    }

    try {
      // 인증에 필요한 정보만 전송
      const response = await axiosApi.post("/corpegnocheck", {
        corpRegNo,
        corpCEOName,
        corpOpenDate,
      });

      const { data } = response;

      if (data) {
        alert("사업자 등록번호 인증 성공!");
        setIsCorpVerified(true);
        // 인증 상태 저장 등 추가 작업 가능
      } else {
        alert("인증 실패: " + (data.message || "유효하지 않은 정보입니다."));
        setIsCorpVerified(false);
      }
    } catch (err) {
      alert("인증 요청 중 오류 발생");
      setIsCorpVerified(false);
      console.error(err);
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
    handleAuthenticationCheck,
    triggerAddressSearch,
    validity,
    isCorpVerified,
  };
};

export default useCorpFormHandler;
