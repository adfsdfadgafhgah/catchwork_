// src/hooks/cv/useCVForm.js
import { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";

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

// 서버 키맵 (역변환)
const serverKeyMap = Object.fromEntries(
  Object.entries(clientKeyMap).map(([type, mapping]) => [
    type,
    Object.fromEntries(
      Object.entries(mapping).map(([k, v]) => [v, k])
    ),
  ])
);

const useCVForm = (memberInfo) => {
  const [mode, setMode] = useState("add");
  const [dateError, setDateError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [cvImgPath, setCvImgPath] = useState("");
  const [formData, setFormData] = useState({
    cvAlias: "",
    cvResume: "",
  });
  const [education, setEducation] = useState({
    eduName: "",
    eduMajor: "",
    eduStartDate: "",
    eduEndDate: "",
    eduCodeNo: "",
    eduStatusCodeNo: "",
  });
  const [military, setMilitary] = useState({
    cvMiliClass: "",
    cvMiliBranch: "",
    cvMiliStartDate: "",
    cvMiliEndDate: "",
  });
  const [components, setComponents] = useState({
    experience: [{ id: "experience" + Date.now() }],
    qualify: [{ id: "qualify" + Date.now() }],
    award: [{ id: "award" + Date.now() }],
    language: [{ id: "language" + Date.now() }],
    training: [{ id: "training" + Date.now() }],
    outer: [{ id: "outer" + Date.now() }],
    portfolio: [{ id: "portfolio" + Date.now() }],
  });

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field, value) => {
    setEducation((prev) => ({ ...prev, [field]: value }));
  };

  const handleMilitaryChange = (field, value) => {
    setMilitary((prev) => ({ ...prev, [field]: value }));
  };

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

  const addComponent = (type) => {
    const newItem = { id: type + Date.now() };
    setComponents((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
  };

  const removeComponent = (type, index) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

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

  const convertToClient = (type, data) => {
    const map = serverKeyMap[type];
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

  const payloadRename = (member, cvNo) => {
    const convertedSections = {};
    Object.keys(components).forEach((type) => {
      convertedSections[type] = components[type].map((item) =>
        convertToServer(type, item)
      );
    });

    return {
      ...(cvNo ? { cvNo } : {}),
      ...member,
      cvImgPath,
      ...formData,
      education,
      military,
      ...convertedSections,
    };
  };

  return {
    mode,
    setMode,
    dateError,
    setDateError,
    isUploading,
    cvImgPath,
    setCvImgPath,
    formData,
    setFormData,
    education,
    setEducation,
    military,
    setMilitary,
    components,
    setComponents,
    handleUploadImage,
    handleInputChange,
    handleEducationChange,
    handleMilitaryChange,
    handleComponentChange,
    addComponent,
    removeComponent,
    payloadRename,
    convertToServer,
    convertToClient,
  };
};

export default useCVForm;
