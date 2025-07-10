import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import RecruitItem from "../../components/recruit/RecruitItem";

const SelectRecruitPage = () => {
  const [params] = useSearchParams();
  const query = params.get("query")?.trim() || "";
  const [recruitList, setRecruitList] = useState([]);

  useEffect(() => {
    const showRecruits = async () => {
      if (!query) return;
      try {
        const res = await axiosApi.get("/search/recruit", {
          params: { query },
        });
        setRecruitList(res.data || []);
      } catch (err) {
        console.error("공고 검색 오류:", err);
      }
    };
    showRecruits();
  }, [query]);

  return (
    <section>
      <h3>채용공고 검색 결과</h3>
      {recruitList.length > 0 ? (
        <div className="recruit-grid">
          {recruitList.map((recruit) => (
            <RecruitItem key={recruit.recruitNo} recruit={recruit} />
          ))}
        </div>
      ) : (
        <p>검색된 채용공고가 없습니다.</p>
      )}
    </section>
  );
};

export default SelectRecruitPage;
