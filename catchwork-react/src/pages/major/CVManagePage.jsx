// React 및 상태 훅 import
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// PDF 변환
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 기본 컴포넌트 import
import CVTitle from "../../components/cv/CVTitle";
import CVBasic from "../../components/cv/CVBasic";
import CVAddress from "../../components/cv/CVAddress";
import CVResume from "../../components/cv/CVResume";
import CVMilitary from "../../components/cv/CVMilitary";

// 커스텀 컴포넌트 import
import FormAddButton from "../../components/cv/FormAddButton";
import CVEducation from "../../components/cv/CVEducation";
import CVForm01 from "../../components/cv/CVForm01";
import CVForm02 from "../../components/cv/CVForm02";
import CVLanguage from "../../components/cv/CVLanguage";

// 버튼 컴포넌트 import
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";

// 로그인 회원 정보
import useLoginMember from "../../stores/loginMember";

// 페이지 전용 CSS import
import "./CVManagePage.css";

// axios
import { axiosApi } from "../../api/axiosAPI";

// URL 쿼리 파싱용
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CVManagePage = () => {
  // ===============================
  // ✅ Router, 기본 셋업
  // ===============================

  // 쿼리스트링
  const query = useQuery();

  // 페이지 이동
  const navigate = useNavigate();

  // 멤버십 등급별 이력서 등록 갯수
  const gradeLimits = {
    0: 1,
    1: 3,
    2: 5,
  };

  // 로그인 회원 정보
  const { isLoadingLogin, loginMember, setLoginMember } = useLoginMember();

  // 이력서 번호 있으면 가져오기(detail)
  const cvNo = query.get("cvNo");
  const queryMode = query.get("mode");
  const recruitNo = query.get("recruitNo");

  // ===============================
  // ✅ State 선언
  // ===============================

  // 작성/보기/수정 모드 상태
  const [mode, setMode] = useState(cvNo ? "view" : "add");

  // 제출 여부(정규식 검사 시작)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 기존 컴포넌트 목록 기억
  const [initialIds, setInitialIds] = useState({
    experience: [],
    award: [],
    qualify: [],
    language: [],
    training: [],
    outer: [],
    portfolio: [],
  });

  // 사용자
  const member = {
    memNo: loginMember.memNo,
    memId: loginMember.memId,
  };

  // 사용자 기본 정보 (출력용)
  const memberInfo = {
    memName: loginMember.memName,
    memTel: loginMember.memTel,
    memGender: loginMember.memGender,
    memEmail: loginMember.memEmail,
    memBirthday: loginMember.memBirthday,
  };

  // 주소 쪼개기
  const fullAddress = loginMember.memAddr || "";
  const [mainAddress, detailAddress] = fullAddress.split("^^^") || [];

  const memberAddress = {
    mainAddress: mainAddress || "",
    detailAddress: detailAddress || "",
  };

  // 날짜 에러
  const [dateError, setDateError] = useState("");

  // 이미지 isLoading
  const [isUploading, setIsUploading] = useState(false);

  // 증명사진 이미지 경로 상태
  const [cvImgPath, setCvImgPath] = useState("");

  // 이력서 입력 데이터 상태
  const [formData, setFormData] = useState({
    cvAlias: "",
    cvResume: "",
  });

  // 학력 입력 데이터 상태
  const [education, setEducation] = useState({
    eduName: "",
    eduMajor: "",
    eduStartDate: "",
    eduEndDate: "",
    eduCodeNo: "",
    eduStatusCodeNo: "",
  });

  // 병역 입력 데이터 상태
  const [military, setMilitary] = useState({
    cvMiliClass: "",
    cvMiliBranch: "",
    cvMiliStartDate: "",
    cvMiliEndDate: "",
  });

  // 동적 섹션 항목 상태
  const [components, setComponents] = useState({
    experience: [{ id: "experience" + Date.now() }],
    qualify: [{ id: "qualify" + Date.now() }],
    award: [{ id: "award" + Date.now() }],
    language: [{ id: "language" + Date.now() }],
    training: [{ id: "training" + Date.now() }],
    outer: [{ id: "outer" + Date.now() }],
    portfolio: [{ id: "portfolio" + Date.now() }],
  });

  // ===============================
  // ✅ 섹션 메타정보
  // ===============================

  // CVForm01 섹션 정보 (자격증, 수상이력)
  const sectionMetaForm01 = {
    qualify: { title: "자격증명", name: "발급기관" },
    award: { title: "수상명", name: "발급기관" },
  };

  // CVForm02 섹션 정보 (경력, 교육이수, 외부활동, 포트폴리오)
  const sectionMetaForm02 = {
    experience: {
      title: "경력",
      name: "회사명",
      description: "직무 및 담당업무",
      org: "부서",
    },
    training: {
      title: "교육이수",
      name: "교육명",
      description: "교육 내용",
      org: "교육기관",
    },
    outer: {
      title: "대외활동",
      name: "활동명",
      description: "활동 설명",
      org: "소속기관",
    },
    portfolio: {
      title: "포트폴리오",
      name: "프로젝트명",
      description: "링크 또는 설명",
    },
  };

  // ===============================
  // ✅ DTO 변환 관련
  // ===============================

  // 서버로 업로드 시 key 이름을 서버 DTO용으로 바꿀때 필요한 객체
  // 클라이언트 키맵
  const clientKeyMap = {
    qualify: {
      id: "qualifyId",
      title: "qualifyName",
      issuer: "qualifyOrg",
      date: "qualifyDate",
    },
    award: {
      id: "awardId",
      title: "awardName",
      issuer: "awardOrg",
      date: "awardDate",
    },
    experience: {
      id: "expId",
      name: "expName",
      org: "expDept",
      description: "expContent",
      startDate: "expStartDate",
      endDate: "expEndDate",
    },
    language: {
      id: "langId",
      language: "langType",
      exam: "langName",
      score: "langScore",
      date: "langDate",
    },
    training: {
      id: "trainId",
      name: "trainName",
      org: "trainOrganization",
      description: "trainContent",
      startDate: "trainStartDate",
      endDate: "trainEndDate",
    },
    outer: {
      id: "outerId",
      name: "outerName",
      org: "outerOrganization",
      description: "outerContent",
      startDate: "outerStartDate",
      endDate: "outerEndDate",
    },
    portfolio: {
      id: "portId",
      name: "portName",
      description: "portContent",
      startDate: "portStartDate",
      endDate: "portEndDate",
    },
  };

  // clientKeyMap을 역으로 변환
  // 서버 키맵
  const serverKeyMap = Object.fromEntries(
    Object.entries(clientKeyMap).map(([type, mapping]) => [
      type,
      Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k])),
    ])
  );

  // 소문자 → 대문자 첫 글자
  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // DTO 생각 안한 Bottle God의 작품
  const payloadRename = () => {
    const convertedSections = {};
    const deletedIds = {};

    Object.keys(components).forEach((type) => {
      const remainIds = components[type]
        .map((item) => item.idFromServer)
        .filter(Boolean);

      const deleted = (initialIds[type] || []).filter(
        (id) => !remainIds.includes(id)
      );

      if (deleted.length > 0) {
        deletedIds[`deleted${capitalize(type)}Ids`] = deleted;
      }

      convertedSections[type] = components[type].map((item) =>
        convertToServer(type, item)
      );
    });

    const militaryPayload =
      military.cvMiliClass === "군필"
        ? military
        : {
            ...military,
            cvMiliStartDate: null,
            cvMiliEndDate: null,
          };

    return {
      ...(cvNo ? { cvNo } : {}),
      ...member,
      cvImgPath,
      ...formData,
      education,
      military: militaryPayload,
      ...convertedSections,
      ...deletedIds,
    };
  };

  // 클라이언트 형식 -> DTO 형식 변환
  const convertToServer = (type, data) => {
    const map = clientKeyMap[type];
    const result = {};
    for (const key in data) {
      if (key === "type") continue;
      if (map[key]) {
        result[map[key]] = data[key];
      } else {
        result[key] = data[key];
      }
    }
    return result;
  };

  // DTO 형식 -> 클라이언트 형식 변환
  const convertToClient = (type, data) => {
    const map = serverKeyMap[type];
    const result = { type };
    if (data[serverKeyMap[type]?.id]) {
      result.idFromServer = data[serverKeyMap[type].id];
    }
    for (const key in data) {
      if (map[key]) {
        result[map[key]] = data[key];
      } else {
        result[key] = data[key];
      }
    }
    return result;
  };

  // ===============================
  // ✅ 유틸 함수
  // ===============================

  // 모든 경력(experience) 섹션들의 기간(개월 수)을 합산한다
  const totalExperienceMonths = components.experience.reduce((sum, exp) => {
    if (
      exp.startDate &&
      exp.endDate &&
      /^\d{4}-\d{2}$/.test(exp.startDate) &&
      /^\d{4}-\d{2}$/.test(exp.endDate)
    ) {
      const [startY, startM] = exp.startDate.split("-").map(Number);
      const [endY, endM] = exp.endDate.split("-").map(Number);
      const months = (endY - startY) * 12 + (endM - startM) + 1;
      return sum + months;
    }
    return sum;
  }, 0);

  // ===============================
  // ✅ 비즈니스 로직 / 핸들러
  // ===============================

  // 멤버십 등급에 따른 이력서 갯수 초과 검사
  const checkCVLimit = async () => {
    if (!loginMember.memNo) {
      console.warn(
        "멤버 번호가 없습니다. 로그인 상태가 초기화되지 않았을 수 있음."
      );
      return;
    }
    try {
      const res = await axiosApi.post("/memberCV/list", {
        memNo: loginMember.memNo,
      });
      const cvList = res.data || [];
      const cvCount = cvList.length;
      const memGrade = loginMember.memGrade || 0;
      const cvLimit = gradeLimits[memGrade];

      if (cvCount >= cvLimit) {
        alert("🔪잡았다. 도둑놈.🏃🏿‍➡️");
        navigate("/mypage/membership");
        return;
      }
    } catch (e) {
      console.error(e);
      alert("이력서 개수 확인 중 오류가 발생했습니다.");
      navigate("/cv");
      return;
    }
  };

  // 데이터들 유효성 검사(정규식)
  const validateAll = () => {
    let valid = true;

    if (!formData.cvAlias || formData.cvAlias.length > 30) {
      valid = false;
    }
    if (formData.cvResume?.length > 2000) {
      valid = false;
    }
    if (!military.cvMiliClass || !military.cvMiliBranch) {
      valid = false;
    } else {
      if (military.cvMiliClass === "군필") {
        if (!military.cvMiliStartDate || !military.cvMiliEndDate) {
          valid = false;
        }
      }
    }
    if (
      !education.eduName ||
      education.eduName.length > 20 ||
      !education.eduMajor ||
      education.eduMajor.length > 20 ||
      !education.eduCodeNo ||
      !education.eduStatusCodeNo ||
      !education.eduStartDate ||
      !education.eduEndDate
    ) {
      valid = false;
    }
    Object.entries(components).forEach(([type, list]) => {
      list.forEach((item) => {
        if (type === "language") {
          if (
            !item.language ||
            item.language.length > 20 ||
            !item.exam ||
            item.exam.length > 20 ||
            !item.score ||
            !/^\d+$/.test(item.score) ||
            item.score.length > 5 ||
            !item.date
          ) {
            valid = false;
          }
        }
        if (["qualify", "award"].includes(type)) {
          if (
            !item.title ||
            item.title.length > 20 ||
            !item.issuer ||
            item.issuer.length > 20 ||
            !item.date
          ) {
            valid = false;
          }
        }
        if (["experience", "training", "outer", "portfolio"].includes(type)) {
          if (
            !item.name ||
            item.name.length > 20 ||
            (!item.org && type !== "portfolio") ||
            (item.org?.length > 20 && type !== "portfolio") ||
            !item.startDate ||
            !item.endDate ||
            item.description?.length > 1000
          ) {
            valid = false;
          }
        }
      });
    });
    return valid;
  };

  // 이미지 업로드 핸들러
  const handleUploadImage = async (file) => {
    const imgFormData = new FormData();
    imgFormData.append("image", file);
    imgFormData.append("memName", memberInfo.memName);
    setIsUploading(true);
    try {
      const res = await axiosApi.post("/memberCV/img/upload", imgFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCvImgPath(res.data);
      return true;
    } catch (err) {
      console.error("이미지 업로드 실패", err);
      alert("이미지 업로드 중 오류 발생");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // 주소 찾기 핸들러
  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // console.log("선택된 주소:", data);
        const fullAddress = data.roadAddress || data.jibunAddress;
        handleInputChange("mainAddress", fullAddress);
      },
    }).open();
  };

  // formData 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // formData 변경 핸들러
  const handleEducationChange = (field, value) => {
    setEducation((prev) => {
      const newData = { ...prev, [field]: value };
      if (
        newData.eduStartDate &&
        newData.eduEndDate &&
        /^\d{4}-\d{2}$/.test(newData.eduStartDate) &&
        /^\d{4}-\d{2}$/.test(newData.eduEndDate)
      ) {
        const startNum = parseInt(newData.eduStartDate.replace("-", ""), 10);
        const endNum = parseInt(newData.eduEndDate.replace("-", ""), 10);
        if (endNum < startNum) {
          setDateError("학력 종료일은 시작일과 같거나 이후여야 합니다.");
          return prev;
        }
      }
      return newData;
    });
  };

  // formData 변경 핸들러
  const handleMilitaryChange = (field, value) => {
    setMilitary((prev) => {
      const newData = { ...prev, [field]: value };
      if (
        newData.cvMiliStartDate &&
        newData.cvMiliEndDate &&
        /^\d{4}-\d{2}$/.test(newData.cvMiliStartDate) &&
        /^\d{4}-\d{2}$/.test(newData.cvMiliEndDate)
      ) {
        const startNum = parseInt(newData.cvMiliStartDate.replace("-", ""), 10);
        const endNum = parseInt(newData.cvMiliEndDate.replace("-", ""), 10);
        if (endNum < startNum) {
          setDateError("병역 종료일은 시작일과 같거나 이후여야 합니다.");
          return prev;
        }
      }
      return newData;
    });
  };

  // 동적 컴포넌트 항목 값 변경 핸들러
  const handleComponentChange = (type, index, field, value) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      const newItem = { ...updated[index], [field]: value, type };
      if (field === "startDate" || field === "endDate") {
        if (
          newItem.startDate &&
          newItem.endDate &&
          /^\d{4}-\d{2}$/.test(newItem.startDate) &&
          /^\d{4}-\d{2}$/.test(newItem.endDate)
        ) {
          const startNum = parseInt(newItem.startDate.replace("-", ""), 10);
          const endNum = parseInt(newItem.endDate.replace("-", ""), 10);
          if (endNum < startNum) {
            setDateError("종료일은 시작일과 같거나 이후여야 합니다.");
            return prev;
          }
        }
      }
      updated[index] = newItem;
      return { ...prev, [type]: updated };
    });
  };

  // 폼 추가
  const addComponent = (type) => {
    const newItem = { id: type + Date.now() };
    setComponents((prev) => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  // 폼 제거
  const removeComponent = (type, index) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

  // 이력서 수정 요청
  const handleUpdate = async () => {
    setIsSubmitted(true);
    await Promise.resolve();
    const payload = payloadRename();
    if (!validateAll()) {
      alert("입력을 확인해주세요.");
      return;
    }
    try {
      const res = await axiosApi.post("/memberCV/update", payload);
      alert("수정 완료");
      setMode("view");
    } catch (err) {
      console.error("수정 실패", err.response?.data || err.message);
      alert(
        "수정 중 오류가 발생했습니다" +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // 이력서 저장 요청
  const handleAdd = async () => {
    const payload = payloadRename();
    setIsSubmitted(true);
    if (!validateAll()) {
      alert("입력을 확인해주세요.");
      return;
    }
    await axiosApi
      .post("/memberCV/add", payload)
      .then(() => alert("저장 완료"))
      .catch((err) => {
        console.error("저장 실패", err.response?.data || err.message);
        alert("저장 중 오류가 발생했습니다");
      });
    navigate("/cv");
  };

  // 이력서 삭제 요청
  const handleDelete = async () => {
    if (!cvNo) {
      alert("삭제할 이력서가 존재하지 않습니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    try {
      await axiosApi.post("/memberCV/delete", { cvNo });
      alert("삭제 완료");
      navigate("/cv");
    } catch (error) {
      console.error("삭제 실패", err.response?.data || err.message);
      alert("삭제 중 오류 발생");
    }
  };

  // 이력서 제출 요청
  const handleSubmit = async () => {
    const sections = document.querySelectorAll(".pdf-section");
    const images = [];
    for (let section of sections) {
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgProps = {
        width: canvas.width,
        height: canvas.height,
        dataUrl: imgData,
      };
      images.push(imgProps);
    }
    let totalHeightPx = 0;
    images.forEach((img) => {
      totalHeightPx += img.height - img.height / 1.7;
    });
    const totalHeightMm = totalHeightPx * 0.264583;
    const pdfWidthMm = 210;
    const marginLeftMm = 20;
    const marginRightMm = 20;
    const marginTopMm = 20;
    const usableWidthMm = pdfWidthMm - marginLeftMm - marginRightMm;
    const pdfHeightMm = totalHeightMm + marginTopMm;
    const pdf = new jsPDF("p", "mm", [pdfWidthMm, pdfHeightMm]);
    let yOffset = marginTopMm;
    for (let img of images) {
      const imgWidthMm = usableWidthMm;
      const imgHeightMm = (img.height * imgWidthMm) / img.width;
      pdf.addImage(
        img.dataUrl,
        "JPEG",
        marginLeftMm,
        yOffset,
        imgWidthMm,
        imgHeightMm
      );
      yOffset += imgHeightMm;
    }
    const pdfOutput = pdf.output("arraybuffer");
    const blob = new Blob([pdfOutput], { type: "application/pdf" });
    const formData = new FormData();
    const memTelRename = memberInfo.memTel.replace(/-/g, "") || "";
    const pdfTitle = `${memberInfo.memName}_${memTelRename}_${Date.now()}.pdf`;
    formData.append("recruitCVEdu", education.eduCodeNo);
    formData.append("recruitCVCareer", totalExperienceMonths);
    formData.append("recruitCVPdfTitle", pdfTitle);
    formData.append("file", blob, pdfTitle);
    formData.append("memNo", loginMember.memNo);
    formData.append("recruitNo", recruitNo);
    try {
      const res = await axiosApi.post("/memberCV/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF 업로드 성공");
      navigate("/memberRecruit/" + recruitNo);
    } catch (e) {
      console.error(e);
      alert("PDF 업로드 실패");
    }
  };

  // ===============================
  // ✅ useEffect
  // ===============================

  useEffect(() => {
    setLoginMember();
  }, []);

  useEffect(() => {
    if (!isLoadingLogin) return;
    if (!loginMember.memNo) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
    }
  }, [isLoadingLogin, loginMember, navigate]);

  useEffect(() => {
    if (dateError) {
      alert(dateError);
      setDateError("");
    }
  }, [dateError]);

  useEffect(() => {
    if (mode === "add") {
      checkCVLimit();
    }
  }, [mode, loginMember]);

  useEffect(() => {
    const fetchCV = async () => {
      if (!cvNo) return;
      if (!isLoadingLogin) return;
      if (!loginMember?.memNo) return;
      try {
        const checkOwner = await axiosApi.post("/memberCV/checkOwner", {
          cvNo,
          memNo: loginMember?.memNo,
        });
        if (checkOwner.data) {
          if (queryMode) {
            setMode(queryMode);
          }
          const detail = await axiosApi.post("/memberCV/detail", { cvNo });
          const data = detail.data;
          const { education, military, cvAlias, cvResume, cvImgPath, ...rest } =
            data;
          setFormData({
            cvAlias: cvAlias || "",
            cvResume: cvResume || "",
            ...rest,
          });
          setCvImgPath(cvImgPath || "");
          setEducation(
            education || {
              eduName: "",
              eduMajor: "",
              eduStartDate: "",
              eduEndDate: "",
              eduCodeNo: "",
              eduStatusCodeNo: "",
            }
          );
          setMilitary(
            military || {
              cvMiliClass: "",
              cvMiliBranch: "",
              cvMiliStartDate: "",
              cvMiliEndDate: "",
            }
          );
          const newComponents = {};
          const newInitialIds = {};
          Object.keys(clientKeyMap).forEach((type) => {
            const list = data[type] || [];
            newComponents[type] = list.map((item) =>
              convertToClient(type, item)
            );
            newInitialIds[type] = list
              .map((item) => item[clientKeyMap[type].id])
              .filter(Boolean);
          });
          setComponents(newComponents);
          setInitialIds(newInitialIds);
        } else {
          alert("🔪잡았다. 쥐새끼.🐁");
          navigate("/cv");
        }
      } catch (error) {
        console.error(error);
        alert("이력서 확인 중 오류가 발생했습니다.");
        navigate("/cv");
      }
    };
    fetchCV();
  }, [isLoadingLogin, cvNo, loginMember, navigate]);

  // ===============================
  // ✅ Floating 버튼 정의
  // ===============================

  const floatButtons = (() => {
    switch (mode) {
      case "view":
        return FLOAT_BUTTON_PRESETS.cvView(
          () => setMode("update"),
          handleDelete
        );
      case "update":
        return FLOAT_BUTTON_PRESETS.cvUpdate(handleUpdate, () =>
          setMode("view")
        );
      case "add":
        return FLOAT_BUTTON_PRESETS.cvAdd(handleAdd, () => navigate("/cv"));
      case "submit":
        return FLOAT_BUTTON_PRESETS.cvSubmit(handleSubmit, () =>
          navigate(`/cv?recruitNo=${recruitNo}`)
        );
      default:
        return [];
    }
  })();

  return (
    <div className="resume-container">
      <div
        className={
          mode === "view" || mode === "submit"
            ? "resume-form view-mode"
            : "resume-form"
        }
      >
        <h1 className="form-title">내 이력서</h1>

        {/* 이력서 제목 입력 */}
        <div className="writeCVSection">
          <CVTitle
            value={formData.cvAlias}
            onChange={(val) => handleInputChange("cvAlias", val)}
            isSubmitted={isSubmitted}
          />
        </div>

        <div className="writeCVInfo">
          <div className="pdf-section">
            {/* 기본 정보 표시 */}
            <div className="writeCVSection">
              <CVBasic
                memberInfo={memberInfo}
                cvImgPath={cvImgPath}
                onImageUpload={handleUploadImage}
                isUploading={isUploading}
                mode={mode}
              />
            </div>
          </div>

          <div className="pdf-section">
            {/* 주소 입력 */}
            <div className="writeCVSection">
              <CVAddress formData={memberAddress} />
            </div>
          </div>

          <div className="pdf-section">
            {/* 병역 입력 */}
            <div className="writeCVSection">
              <CVMilitary
                formData={military}
                onChange={handleMilitaryChange}
                mode={mode}
                isSubmitted={isSubmitted}
              />
            </div>
          </div>

          <div className="pdf-section">
            {/* 학력 입력 */}
            <div className="writeCVSection">
              <h2 className="writeCVSection-title">학력</h2>
              <CVEducation
                formData={education}
                onChange={handleEducationChange}
                mode={mode}
                isSubmitted={isSubmitted}
              />
            </div>
          </div>

          <div className="pdf-section">
            {/* 공통 Form01 영역 */}
            {Object.entries(sectionMetaForm01).map(([type, labels]) => (
              <div className="writeCVSection" key={type}>
                <h2 className="writeCVSection-title">{labels.title}</h2>
                {components[type].length === 0 && (
                  <div className="empty-message">
                    입력된 {labels.title}이 없습니다.
                  </div>
                )}
                {components[type].map((item, index) => (
                  <CVForm01
                    key={item.id}
                    index={index}
                    type={type}
                    data={item}
                    mode={mode}
                    labels={labels}
                    isSubmitted={isSubmitted}
                    onRemove={() => removeComponent(type, index)}
                    onChange={handleComponentChange}
                  />
                ))}
                {mode !== "view" && mode !== "submit" && (
                  <FormAddButton onClick={() => addComponent(type)} />
                )}
              </div>
            ))}
          </div>

          <div className="pdf-section">
            {/* 어학 */}
            <div className="writeCVSection">
              <h2 className="writeCVSection-title">어학</h2>
              {components.language.length === 0 && (
                <div className="empty-message">입력된 어학이 없습니다.</div>
              )}
              {components.language.map((item, index) => (
                <CVLanguage
                  key={item.id}
                  index={index}
                  data={item}
                  mode={mode}
                  isSubmitted={isSubmitted}
                  onRemove={() => removeComponent("language", index)}
                  onChange={handleComponentChange}
                />
              ))}
              {mode !== "view" && mode !== "submit" && (
                <FormAddButton onClick={() => addComponent("language")} />
              )}
            </div>
          </div>

          <div className="pdf-section">
            {/* 공통 Form02 영역 */}
            {/* 경력, 교육이수, 대외활동, 포트폴리오 섹션 추가 */}
            {Object.entries(sectionMetaForm02).map(([type, labels]) => (
              <div className="writeCVSection" key={type}>
                <h2 className="writeCVSection-title">{labels.title}</h2>
                {/* 경력 섹션일 때만 렌더링되는 (최종 경력)*/}
                {type === "experience" && (
                  <div>총 경력 기간 : {totalExperienceMonths}개월</div>
                )}
                {components[type].length === 0 && (
                  <div className="empty-message">
                    입력된 {labels.title}이 없습니다.
                  </div>
                )}
                {components[type].map((item, index) => (
                  <CVForm02
                    key={item.id}
                    index={index}
                    type={type}
                    data={item}
                    mode={mode}
                    labels={labels}
                    isSubmitted={isSubmitted}
                    onRemove={() => removeComponent(type, index)}
                    onChange={handleComponentChange}
                  />
                ))}
                {mode !== "view" && mode !== "submit" && (
                  <FormAddButton onClick={() => addComponent(type)} />
                )}
              </div>
            ))}
          </div>

          <div className="pdf-section">
            {/* 자기소개서 */}
            <div className="writeCVSection">
              <CVResume
                formData={formData}
                onChange={handleInputChange}
                mode={mode}
                isSubmitted={isSubmitted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="writeCVSticky">
        <FloatButton buttons={floatButtons} />
        <div className="writeCVStickyRight">
          <button
            className="writeCVStickyBtn writeCVUpBtn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ▲
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVManagePage;
