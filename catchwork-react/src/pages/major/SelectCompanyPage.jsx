import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import CompanyItem from "../../components/company/CompanyItem";

const SelectCompanyPage = () => {
  const [params] = useSearchParams();
  const query = params.get("query")?.trim() || "";
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!query) return;
      try {
        const res = await axiosApi.get("/search/company", {
          params: { query },
        });
        setCompanyList(res.data || []);
      } catch (err) {
        console.error("기업 검색 오류:", err);
      }
    };
    fetchCompanies();
  }, [query]);

  return (
    <section>
      <h3>기업 검색 결과</h3>
      {companyList.length > 0 ? (
        <div className="company-grid">
          {companyList.map((company) => (
            <CompanyItem key={company.corpNo} company={company} />
          ))}
        </div>
      ) : (
        <p>검색된 기업이 없습니다.</p>
      )}
    </section>
  );
};

export default SelectCompanyPage;
