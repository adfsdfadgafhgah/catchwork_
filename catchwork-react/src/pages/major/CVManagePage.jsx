// React 및 상태 훅 import
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

// 로그인 회원 정보
import useLoginMember from "../../stores/loginMember";

// 페이지 전용 CSS import
import "./CVManagePage.css";
import { axiosApi } from "../../api/axiosAPI";

// URL 쿼리 파싱용
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CVManagePage = () => {
  // 쿼리스트링
  const query = useQuery();

  // 페이지 이동
  const navigate = useNavigate();

  // 로그인 회원 정보
  const { isLoadingLogin, loginMember, setLoginMember } = useLoginMember();

  // 이력서 번호 있으면 가져오기(detail)
  const cvNo = query.get("cvNo");
  const upMode = query.get("mode");

  // 작성/보기/수정 모드 상태
  const [mode, setMode] = useState(cvNo ? "view" : "add");

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
    imgFormData.append("memName", memberInfo.memName);
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

  // formData 변경 핸들러
  const handleEducationChange = (field, value) => {
    setEducation((prev) => ({ ...prev, [field]: value }));
  };

  // formData 변경 핸들러
  const handleMilitaryChange = (field, value) => {
    setMilitary((prev) => ({ ...prev, [field]: value }));
  };

  // 동적 컴포넌트 항목 값 변경 핸들러
  const handleComponentChange = (type, index, field, value) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      const newItem = { ...updated[index], [field]: value, type };

      // ▼ 날짜 비교: startDate & endDate가 모두 존재할 때만 검사
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
            return prev; // 기존 state 유지, 변경 안 함
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
    const payload = payloadRename();
    await axiosApi
      .post("/cv/update", payload)
      .then(() => alert("수정 완료"))
      .catch((err) => {
        console.error("수정 실패", err.response?.data || err.message);
        alert("수정 중 오류가 발생했습니다");
      });
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
      await axiosApi.post("/cv/delete", { cvNo });
      alert("삭제 완료");
      navigate("/cv");
    } catch (error) {
      console.error("삭제 실패", err.response?.data || err.message);
      alert("삭제 중 오류 발생");
    }
  };

  // 이력서 저장 요청
  const handleSubmit = async () => {
    const payload = payloadRename();
    await axiosApi
      .post("/cv/add", payload)
      .then(() => alert("저장 완료"))
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

    return {
      ...(cvNo ? { cvNo } : {}), // 수정 시에만 들어감
      ...member, // 회원 정보
      cvImgPath, // 이미지 경로
      ...formData, // 나머지 formData 필드 그대로
      education,
      military,
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

  // 로그인 여부 검사
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

  // cvNo가 있으면 detail
  useEffect(() => {
    const fetchCV = async () => {
      if (!cvNo) return;
      if (!isLoadingLogin) return;
      if (!loginMember?.memNo) return;

      try {
        // 본인 소유 여부 확인
        const checkOwner = await axiosApi.post("/cv/checkOwner", {
          cvNo,
          memNo: loginMember?.memNo,
        });

        if (checkOwner.data) {
          // 이력시 리스트에서 수정 버튼 눌러서 들어온 경우
          if (upMode === "update") setMode("update");

          // 소유자 맞으면 상세 조회
          const detail = await axiosApi.post("/cv/detail", { cvNo });
          const data = detail.data;

          // 기존 세팅 로직 복붙
          const { education, military, cvAlias, cvResume, cvImgPath, ...rest } =
            data;

          // 기본 정보
          setFormData({
            cvAlias: cvAlias || "",
            cvResume: cvResume || "",
            ...rest,
          });

          // 증명사진
          setCvImgPath(cvImgPath || "");

          // 학력
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

          // 병역
          setMilitary(
            military || {
              cvMiliClass: "",
              cvMiliBranch: "",
              cvMiliStartDate: "",
              cvMiliEndDate: "",
            }
          );

          // 동적 sections
          const newComponents = {};
          Object.keys(clientKeyMap).forEach((type) => {
            const list = data[type] || [];
            newComponents[type] = list.map((item) =>
              convertToClient(type, item)
            );
          });

          setComponents(newComponents);
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

  // 콘솔console 찍기
  useEffect(() => {
    console.log("모드 =", mode);
    console.log("이미지 경로 =", cvImgPath);
    console.log("단일 데이터 =", formData);
    console.log("컴포넌트 데이터 =", components);
    console.log("회원 정보 = ", memberInfo);
    console.log("회원 = ", member);

    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      console.log("zustand auth-store persist 값 =", parsed);
    } else {
      console.log("auth-storage 값 없음 (로그인 안했거나 persist 저장 전)");
    }
  }, [mode, cvImgPath, memberInfo, member, formData, components]);

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
              memberInfo={memberInfo}
              cvImgPath={cvImgPath}
              onImageUpload={handleUploadImage}
              isUploading={isUploading}
            />
          </div>

          {/* 주소 입력 */}
          <div className="writeCVSection">
            <CVAddress
              formData={memberAddress}
              onChange={handleInputChange}
              onSearch={handleSearchAddress}
              mode={mode}
            />
          </div>

          {/* 병역 입력 */}
          <div className="writeCVSection">
            <CVMilitary
              formData={military}
              onChange={handleMilitaryChange}
              mode={mode}
            />
          </div>

          {/* 학력 입력 */}
          <div className="writeCVSection">
            <h2 className="writeCVSection-title">학력</h2>
            <CVEducation
              formData={education}
              onChange={handleEducationChange}
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
              {mode !== "view" && (
                <FormAddButton onClick={() => addComponent(type)} />
              )}
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
            {mode !== "view" && (
              <FormAddButton onClick={() => addComponent("language")} />
            )}
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
              {mode !== "view" && (
                <FormAddButton onClick={() => addComponent(type)} />
              )}
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
                onClick={() => setMode("update")}
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
          ) : mode === "update" ? (
            <>
              <button
                className="writeCVStickyBtn writeCVSubmitBtn"
                onClick={handleUpdate}
              >
                수정 완료
              </button>
              <button
                className="writeCVStickyBtn writeCVCancleBtn"
                onClick={() => setMode("view")}
              >
                미리보기
              </button>
            </>
          ) : mode === "add" ? (
            <>
              <button
                className="writeCVStickyBtn writeCVSubmitBtn"
                onClick={handleSubmit}
              >
                작성 완료
              </button>
              <button
                className="writeCVStickyBtn writeCVCancleBtn"
                onClick={() => navigate("/cv")}
              >
                취소하기
              </button>
            </>
          ) : null}
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

export default CVManagePage;
