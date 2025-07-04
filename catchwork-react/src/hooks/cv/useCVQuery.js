// src/hooks/cv/useCVQuery.js
import { useLocation } from "react-router-dom";

const useCVQuery = () => {
  const query = new URLSearchParams(useLocation().search);

  return {
    cvNo: query.get("cvNo"),
    mode: query.get("mode"),
    recruitNo: query.get("recruitNo"),
  };
};

export default useCVQuery;
