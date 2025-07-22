import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import "./CorpCompanyDetailPage.css";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";
import defaultLogo from "../../assets/icon.png";

const CorpCompanyDetailPage = () => {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const navigate = useNavigate();
  const { loginMember, setLoginMember } = useLoginMember(); // 로그인한 회원 정보 가져오기

  useEffect(() => {
    //console.log("[1] setLoginMember() 호출 전");
    setLoginMember();
    //console.log("[2] setLoginMember() 호출 후, loginMember:", loginMember);
  }, []);

  //console.log("[3] 렌더링 시점 loginMember:", loginMember);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //console.log("[4] loginMember useEffect 진입, loginMember:", loginMember);
    if (!loginMember?.memNo) {
      //console.log("[5] memNo 없음, loginMember:", loginMember);
      return;
    }
    //console.log("[6] API 요청 시작, memNo:", loginMember.memNo);

    const CompanyDetail = async () => {
      try {
        const res = await axiosApi.get(`/corpcompany/detail`, {
          params: { memNo: loginMember.memNo },
        });
        //console.log("[7] 기업 정보 응답:", res.data);
        setCompany(res.data);
      } catch (err) {
        //console.error("[8] 기업 정보 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };
    CompanyDetail();
  }, [loginMember]);

  useEffect(() => {
    //console.log("[9] company 상태 변경:", company);
  }, [company]);

  const handleEdit = () => {
    //수정하기 누르면 이동시키기
    navigate(`/corpcompany/update`);
  };
  const handleWithdraw = () => {
    const confirm = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (confirm) {
      navigate("/corpmypage/withdraw");
    }
  };

  if (loading) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p>불러오는 중입니다...</p>
      </main>
    );
  }
  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p className="company-not-found">존재하지 않는 기업입니다.</p>
      </main>
    );
  }

  return (
    <>
      <main className="corp-container">
        <SectionHeader title="기업정보" />

        <div className="company-detail-header">
          <div className="company-header-left">
            <div
              className="company-header-image-background"
              style={{
                backgroundImage: `url(${`${logoImgUrl}/${company.corpLogo}`})`,
              }}
            />
            <img
              src={
                company.corpLogo
                  ? `${logoImgUrl}/${company.corpLogo}`
                  : defaultLogo
              }
              alt="기업로고"
              className="company-logo"
            />
          </div>

          <div className="company-header-right">
            <div className="company-title-line">
              <h2 className="company-name">{company.corpName}</h2>
            </div>

            <div className="company-basic-info">
              <div className="info-row">
                <div className="info-label">기업 형태</div>
                <div className="info-value">{company.corpType}</div>
              </div>
              <div className="info-row">
                <div className="info-label">사업자 번호</div>
                <div className="info-value">{company.corpRegNo}</div>
              </div>
              <div className="info-row">
                <div className="info-label">대표명</div>
                <div className="info-value">{company.corpCeoName}</div>
              </div>
              <div className="info-row">
                <div className="info-label">주소</div>
                <div className="info-value">{company.corpAddr}</div>
              </div>
              <div className="info-row">
                <div className="info-label">개업일자</div>
                <div className="info-value">{company.corpOpenDate}</div>
              </div>
              <div className="info-row">
                <div className="info-label">홈페이지</div>
                <div className="info-value">
                  <a
                    href={company.corpHomeLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.corpHomeLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="company-section">
          <h3>주요사업</h3>
          <p>
            {company.corpBm?.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="company-section">
          <h3>기업상세</h3>
          <p>
            {company.corpDetail?.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="company-section">
          <h3>복리후생</h3>
          <b>
            {company.corpBenefit?.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </b>
          <p>
            {company.corpBenefitDetail?.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        {company.corpMemRoleCheck === "Y" && (
          <div className="company-footer-buttons">
            <button onClick={handleWithdraw} className="btn-withdraw">
              기업 탈퇴하기
            </button>
            <button className="btn-edit" onClick={handleEdit}>
              수정하기
            </button>
          </div>
        )}

        <Outlet />
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default CorpCompanyDetailPage;
