// SearchResultPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import RecruitItem from "./RecruitItem";
import CompanyItem from "./CompanyItem";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [recruits, setRecruits] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/search`, {
          params: { query },
        });
        setRecruits(res.data.recruits.slice(0, 6));
        setCompanies(res.data.companies.slice(0, 6));
      } catch (err) {
        console.error("검색 실패", err);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="search-result-container">
      <h2>채용공고</h2>
      <div className="recruit-list">
        {recruits.map((item) => (
          <RecruitItem key={item.recruitNo} recruit={item} />
        ))}
      </div>

      <h2>기업정보</h2>
      <div className="company-list">
        {companies.map((item) => (
          <CompanyItem key={item.corpNo} company={item} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultPage;
