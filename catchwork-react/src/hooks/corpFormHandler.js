import { useState } from "react";
import axios from "axios";
import { axiosApi } from "../api/axiosAPI";
import { searchAddress } from "../api/signupAPI";
import { useNavigate } from "react-router-dom";

const useCorpFormHandler = (initialValues) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialValues);

  const [validity, setValidity] = useState({});
  const validateField = (name, value) => {
    return value.trim() !== "";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "corpLogo") {
      setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidity((prev) => ({
      ...prev,
      [name]: value.trim() !== "",
    }));
  };
  const validateForm = () => {
    const requiredFields = [
      "corpRegNo",
      "corpCEOName",
      "corpOpenDate",

      "corpName",
      "corpAddr",
      "corpHomeLink",
      "corpBM",
    ];

    const newValidity = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      const valid = formData[field]?.trim() !== "";
      newValidity[field] = valid;
      if (!valid) isValid = false;
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

    console.log("기업 등록 데이터:", dataToSend);
    try {
      await axiosApi.post("/corpregister", dataToSend);
      alert("기업등록이 완료되었습니다.");
      navigate("/"); // 추후 수정
    } catch (err) {
      alert("기업등록 실패: " + (err.response?.data?.message || err.message));
      console.error(err.response?.data || err.message);
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

  const handleAuthenticationCheck = async () => {
    const { corpRegNo, corpCEOName, corpOpenDate } = formData;

    if (!corpRegNo || !corpCEOName || !corpOpenDate) {
      alert("사업자등록번호, 대표자 성명, 개설일자를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/corpegnocheck", {
        corpRegNo,
        corpCEOName,
        corpOpenDate,
      });

      const { data } = response;

      if (data.valid) {
        alert("사업자 등록번호 인증 성공!");
        // 인증 상태 저장 등 추가 작업 가능
      } else {
        alert("인증 실패: " + (data.message || "유효하지 않은 정보입니다."));
      }
    } catch (err) {
      alert("인증 요청 중 오류 발생");
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
  };
};

export default useCorpFormHandler;
