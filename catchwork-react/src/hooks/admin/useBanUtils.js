import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";

/**
 * BAN 관리 관련 Hook
 */
const useBanUtils = () => {
  const navigate = useNavigate();
  const [banList, setBanList] = useState([]);
  const [banDetail, setBanDetail] = useState(null);

  /**
   * 정지 목록 가져오기
   * @param {Object} params - 검색 조건
   */
  const getBanList = async (params) => {
    try {
      const res = await axiosApi.get("/admin/ban", { params });
      setBanList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * 정지 상세 가져오기
   * @param {number} banNo
   */
  const getBanDetail = async (banNo) => {
    try {
      const res = await axiosApi.get(`/admin/ban/detail/${banNo}`);
      setBanDetail(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * 정지 해제
   * @param {number} banNo
   * @param {Function} callback
   */
  const releaseBan = async (banNo, callback) => {
    try {
      await axiosApi.delete(`/admin/ban/${banNo}`);
      alert("정지 해제 완료!");
      if (callback) callback();
    } catch (err) {
      console.error(err);
      alert("정지 해제 실패!");
    }
  };

  /**
   * 검색 핸들러
   */
  const handleSearch = (searchParams) => {
    getBanList(searchParams);
  };

  /**
   * 디테일 페이지 이동
   */
  const goToDetail = (banNo) => {
    navigate(`/admin/ban/detail/${banNo}`);
  };

  return {
    banList,
    banDetail,
    getBanList,
    getBanDetail,
    releaseBan,
    handleSearch,
    goToDetail,
  };
};

export default useBanUtils;