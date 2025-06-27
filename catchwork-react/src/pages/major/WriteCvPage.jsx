// React 및 상태 훅 import
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

// zustand
import { useAuthStore } from "../../stores/authStore";

// 페이지 전용 CSS import
import "./WriteCVPage.css";
import { axiosApi } from "./../../api/axiosAPI";

// URL 쿼리 파싱용
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const WriteCVPage = () => {
  const query = useQuery();

  // zustand 로그인 회원정보
  const { memNo, memType, role } = useAuthStore();
  

  // 작성/보기/수정 모드 상태
  const [mode, setMode] = useState(query.get("mode") || "view"); 

  // 이미지 isLoading
  const [isUploading, setIsUploading] = useState(false);

  // 사용자 기본 정보 (출력용)
  const [userInfo, setUserInfo] = useState({
    memName: "조민장",
    memTel: "01087948442",
    memGender: "남성",
    memEmail: "whalswkd1213@gmail.com",
    memBirthday: "2000-12-13",
  });

  // 증명사진 이미지 경로 상태
  const [cvImgPath, setCvImgPath] = useState("");

  // 이력서 입력 데이터 상태
  const [formData, setFormData] = useState({
    cvAlias: "",
    mainAddress: "",
    detailAddress: "",
    eduName: "",
    eduMajor: "",
    eduCodeNo: "",
    eduStatusCodeNo: "",
    eduStartDate: "",
    eduEndDate: "",
    cvMiliClass: "",
    cvMiliBranch: "",
    cvMiliStartDate: "0000-00",
    cvMiliEndDate: "0000-00",
    cvResume: "",
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
    // 클라 키맵 가져오기      각 항목 순회  key, value(map)
    Object.entries(clientKeyMap).map(([type, mapping]) => [
      type, // value 내부의 k, v를 역으로 변환 ("id": "expId" -> "expId": "id",)
      Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k])),
    ])
  );

  // 이미지 업로드 핸들러
  const handleUploadImage = async (file) => {
    const imgFormData = new FormData();
    imgFormData.append("image", file);
    imgFormData.append("memName", userInfo.memName);
    setIsUploading(true);
    try {
      const res = await axiosApi.post("/cv/img/upload", imgFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCvImgPath(res.data); // 응답 받은 리네임된 경로 저장
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
        console.log("선택된 주소:", data);

        // 도로명 주소 or 지번 주소
        const fullAddress = data.roadAddress || data.jibunAddress;

        // formData에 memAddress 업데이트
        handleInputChange("mainAddress", fullAddress);
      },
    }).open();
  };

  // formData 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 동적 컴포넌트 항목 값 변경 핸들러
  const handleComponentChange = (type, index, field, value) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      updated[index] = { ...updated[index], [field]: value, type };
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
    const payload = {};
    await axiosApi
      .post("/cv/update", payload)
      .then(() => alert("성공"))
      .catch(() => alert("실패"));
  };

  // 이력서 삭제 요청
  const handleDelete = async () => {
    const payload = {};
    await axiosApi
      .post("/cv/delete", payload)
      .then(() => alert("성공"))
      .catch(() => alert("실패"));
  };

  // 이력서 저장 요청
  const handleSubmit = async () => {
    const payload = payloadRename();
    await axiosApi
      .post("/cv/add", payload, { withCredentials: true })
      .then(() => alert("이력서 저장 완료"))
      .catch((err) => {
        console.error("저장 실패", err.response?.data || err.message);
        alert("저장 중 오류가 발생했습니다");
      });
  };

  // DTO 생각 안한 Bottle God의 작품
  const payloadRename = () => {
    const convertedSections = {};

    Object.keys(components).forEach((type) => {
      convertedSections[type] = components[type].map((item) =>
        convertToServer(type, item)
      );
    });

    const { mainAddress, detailAddress, ...restFormData } = formData;

    return {
      ...userInfo,
      cvImgPath, // 이미지 경로
      ...restFormData, // 나머지 formData 필드 그대로
      memAddress: `${mainAddress}/${detailAddress}`, // 주소만 커스텀 처리
      ...convertedSections,
    };
  };

  // 클라이언트 형식 -> DTO 형식 변환
  // 클라 키맵, 서버에서 받아온 맵
  const convertToServer = (type, data) => {
    // 클라 키맵의 종류 가져오기(award, exp 등)
    const map = clientKeyMap[type];
    const result = {};
    // 서버에서 받은 맵의 키 순회
    for (const key in data) {
      // type 제거
      if (key === "type") continue;
      // 클라 키맴에 서버의 키 있는지 확인
      if (map[key]) {
        // result에 클라 키 이름, 서버의 값 저장
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
    // type 주입
    const result = { type };
    for (const key in data) {
      if (map[key]) {
        result[map[key]] = data[key];
      } else {
        result[key] = data[key];
      }
    }
    return result;
  };

    
  useEffect(() => {
    console.log("모드 =", mode);
    console.log("이미지 경로 =", cvImgPath);
    console.log("기본 정보 =", userInfo);
    console.log("단일 데이터 =", formData);
    console.log("컴포넌트 데이터 =", components);
    console.log("zustand 값:", memNo, memType, role);

    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      console.log("zustand auth-store persist 값 =", parsed);
    } else {
      console.log("auth-storage 값 없음 (로그인 안했거나 persist 저장 전)");
    }
  }, [mode, cvImgPath, userInfo, formData, components]);

  /* 가져오기 */
  // useEffect(() => {
  //   axios.get("/cv/detail?id=123").then((res) => {
  //     const data = res.data;
  //     const newComponents = {};

  //     Object.keys(clientKeyMap).forEach((type) => {
  //       const sectionList = data[type] || [];
  //       newComponents[type] = sectionList.map((item) =>
  //         convertToClient(type, item)  // type 주입 포함
  //       );
  //     });

  //     setComponents(newComponents);

  //     // 주소 복원 처리
  //     const [mainAddress, detailAddress] = (data.memAddress || "").split("/");
  //     setFormData({
  //       ...data,
  //       mainAddress: mainAddress?.trim() || "",
  //       detailAddress: detailAddress?.trim() || "",
  //     });
  //   });
  // }, []);


  return (
    <div className="resume-container">
      <div
        className={mode === "view" ? "resume-form view-mode" : "resume-form"}
      >
        <h1 className="form-title">내 이력서 작성하기</h1>

        {/* 이력서 제목 입력 */}
        <div className="writeCVSection">
          <CVTitle
            value={formData.cvAlias}
            onChange={(val) => handleInputChange("cvAlias", val)}
          />
        </div>

        <div className="writeCVInfo">
          {/* 기본 정보 표시 */}
          <div className="writeCVSection">
            <CVBasic
              userInfo={userInfo}
              cvImgPath={cvImgPath}
              onImageUpload={handleUploadImage}
              isUploading={isUploading}
            />
          </div>

          {/* 주소 입력 */}
          <div className="writeCVSection">
            <CVAddress
              formData={formData}
              onChange={handleInputChange}
              onSearch={handleSearchAddress}
              mode={mode}
            />
          </div>

          {/* 병역 입력 */}
          <div className="writeCVSection">
            <CVMilitary
              formData={formData}
              onChange={handleInputChange}
              mode={mode}
            />
          </div>

          {/* 학력 입력 */}
          <div className="writeCVSection">
            <h2 className="writeCVSection-title">학력</h2>
            <CVEducation
              formData={formData}
              onChange={handleInputChange}
              mode={mode}
            />
          </div>

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
                  onRemove={() => removeComponent(type, index)}
                  onChange={handleComponentChange}
                />
              ))}
              <FormAddButton onClick={() => addComponent(type)} />
            </div>
          ))}

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
                onRemove={() => removeComponent("language", index)}
                onChange={handleComponentChange}
              />
            ))}
            <FormAddButton onClick={() => addComponent("language")} />
          </div>

          {/* 공통 Form02 영역 */}
          {/* 경력, 교육이수, 대외활동, 포트폴리오 섹션 추가 */}
          {Object.entries(sectionMetaForm02).map(([type, labels]) => (
            <div className="writeCVSection" key={type}>
              <h2 className="writeCVSection-title">{labels.title}</h2>
              {/* 경력 섹션일 때만 렌더링되는 (최종 경력)*/}
              {type === "experience" && <div>최종경력 : ㅗ</div>}
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
                  onRemove={() => removeComponent(type, index)}
                  onChange={handleComponentChange}
                />
              ))}
              <FormAddButton onClick={() => addComponent(type)} />
            </div>
          ))}

          {/* 자기소개서 */}
          <div className="writeCVSection">
            <CVResume
              formData={formData}
              onChange={handleInputChange}
              mode={mode}
            />
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="writeCVSticky">
        <div className="writeCVStickyCenter">
          {mode === "view" ? (
            <>
              <button
                className="writeCVStickyBtn writeCVUpdateBtn"
                onClick={handleUpdate}
              >
                수정하기
              </button>
              <button
                className="writeCVStickyBtn writeCVDeleteBtn"
                onClick={handleDelete}
              >
                삭제하기
              </button>
            </>
          ) : (
            <>
              <button
                className="writeCVStickyBtn writeCVSubmitBtn"
                onClick={handleSubmit}
              >
                작성완료
              </button>
              <button
                className="writeCVStickyBtn writeCVCancleBtn"
                onClick={() => history.back()}
              >
                취소하기
              </button>
            </>
          )}
        </div>
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

export default WriteCVPage;
