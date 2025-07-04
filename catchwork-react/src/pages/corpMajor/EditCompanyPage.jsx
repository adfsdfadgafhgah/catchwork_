import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import useLoginMember from "../../stores/loginMember";
import { axiosApi } from "../../api/axiosAPI";
import "./EditCompanyPage.css";

const EditCompanyPage = () => {
  const navigate = useNavigate();
  const { loginMember, setLoginMember } = useLoginMember();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [corpNo, setCorpNo] = useState("");
  const [corpName, setCorpName] = useState("");
  const [corpType, setCorpType] = useState("");
  const [corpCeoName, setCorpCeoName] = useState("");
  const [corpAddr, setCorpAddr] = useState("");
  const [corpOpenDate, setCorpOpenDate] = useState("");
  const [corpHomeLink, setCorpHomeLink] = useState("");
  const [corpBm, setCorpBm] = useState("");
  const [corpDetail, setCorpDetail] = useState("");
  const [corpBenefit, setCorpBenefit] = useState("");
  const [corpBenefitDetail, setCorpBenefitDetail] = useState("");

  useEffect(() => {
    setLoginMember(); // 로그인 정보 설정
  }, []);

  //기업 정보
  // 기업 정보 불러오기
  useEffect(() => {
    const fetchCompany = async () => {
      if (!loginMember?.memNo) return;

      try {
        const res = await axiosApi.get("/corpcompany/detail", {
          params: { memNo: loginMember.memNo },
        });
        console.log("✅ 기업 정보:", res.data);
        setCompany(res.data);
      } catch (err) {
        console.error("기업 정보 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [loginMember]);

  //불러온 기업 정보로 state 초기화
  useEffect(() => {
    if (company) {
      setCorpNo(company.corpNo);
      setCorpName(company.corpName || "");
      setCorpType(company.corpType || "");
      setCorpCeoName(company.corpCeoName || "");
      setCorpAddr(company.corpAddr || "");
      setCorpOpenDate(company.corpOpenDate || "");
      setCorpHomeLink(company.corpHomeLink || "");
      setCorpBm(company.corpBm || "");
      setCorpDetail(company.corpDetail || "");
      setCorpBenefit(company.corpBenefit || "");
      setCorpBenefitDetail(company.corpBenefitDetail || "");
    }
  }, [company]);

  //로딩 상태
  if (loading) {
    return (
      <main className="container">
        <SectionHeader title="기업 정보 수정" />
        <p>불러오는 중입니다...</p>
      </main>
    );
  }

  //기업 정보 없음
  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업 정보 수정" />
        <p>존재하지 않는 기업입니다.</p>
      </main>
    );
  }

  //취소버튼 누르면 디테일 페이지로 이동
  const handleCancel = () => {
    navigate(`/corpcompany/detail`);
  };

  const handleEdit = async () => {
    console.log("=== 수정된 기업정보 ===");
    console.log({
      corpName,
      corpType,
      corpNo,
      corpCeoName,
      corpAddr,
      corpOpenDate,
      corpHomeLink,
      corpBm,
      corpDetail,
      corpBenefit,
      corpBenefitDetail,
    });
    try {
      await axiosApi.post("/corpcompany/update", {
        corpNo,
        corpName,
        corpType,
        corpCeoName,
        corpAddr,
        corpOpenDate,
        corpHomeLink,
        corpBm,
        corpDetail,
        corpBenefit,
        corpBenefitDetail,
      });

      alert("수정이 완료되었습니다.");
      navigate("/corpcompany/detail");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="container">
      <SectionHeader title="기업 정보 수정" />

      <div className="company-detail-header">
        <div className="company-header-left">
          <img src={company.corpLogo} alt="기업로고" className="company-logo" />
        </div>

        <div className="company-header-right">
          <div className="company-title-line">
            <input
              type="text"
              className="company-name-input"
              defaultValue={company.corpName}
            />
          </div>

          <div className="company-basic-info">
            <div className="info-row">
              <div className="info-label">기업 형태</div>
              <input type="text" defaultValue={company.corpType} />
            </div>
            <div className="info-row">
              <div className="info-label">사업자 번호</div>
              <input type="text" defaultValue={company.corpRegNo} />
            </div>
            <div className="info-row">
              <div className="info-label">대표명</div>
              <input type="text" defaultValue={company.corpCeoName} />
            </div>
            <div className="info-row">
              <div className="info-label">주소</div>
              <input type="text" defaultValue={company.corpAddr} />
            </div>
            <div className="info-row">
              <div className="info-label">개업일자</div>
              <input type="date" defaultValue={company.corpOpenDate} />
            </div>
            <div className="info-row">
              <div className="info-label">홈페이지</div>
              <input type="text" defaultValue={company.corpHomeLink} />
            </div>
          </div>
        </div>
      </div>

      <div className="company-section">
        <h3>주요사업</h3>
        <textarea defaultValue={company.corpBm}></textarea>
      </div>

      <div className="company-section">
        <h3>기업상세</h3>
        <textarea defaultValue={company.corpDetail}></textarea>
      </div>

      <div className="company-section">
        <h3>복리후생</h3>
        <textarea defaultValue={company.corpBenefit}></textarea>
        <textarea defaultValue={company.corpBenefitDetail}></textarea>
      </div>
      <FloatButton
        buttons={FLOAT_BUTTON_PRESETS.editAndCancel(handleEdit, handleCancel)}
      />
    </main>
  );
};

export default EditCompanyPage;
