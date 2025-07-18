
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";


const useRestoreUtils = () => {
    const [totalCount, setTotalCount] = useState(0);
    const [restoreList, setRestoreList] = useState([]);
    const [restoreDetail, setRestoreDetail] = useState(null);

    // 복구 리스트 가져오기
    const getRestoreList = async (page = 1) => {
        try {
            const res = await axiosApi.get("/admin/restore/list", {
                params: { page }
            });

            // 응답 형식이 { restoreList: [...], restoreCount: n } 라고 가정
            const data = res.data;

            // 목록이 배열이면 그대로 사용, 아니면 빈 배열 처리
            setRestoreList(Array.isArray(data.list) ? data.list : []);
            setTotalCount(typeof data.totalCount === 'number' ? data.totalCount : 0);

            console.log("복구 목록", data);
            return data;
        } catch (err) {
            console.error("복구 리스트 가져오기 실패", err);
        }
    };

    // 복구 상세 정보 가져오기
    const getRestoreDetail = async (restoreNo) => {
        try {
            const res = await axiosApi.get(`/admin/restore/detail/${restoreNo}`);
            setRestoreDetail(res.data);
        } catch (err) {
            console.error("복구 상세 정보 실패", err);
        }
    };

    // 복구 처리
    const restoreItem = async (targetNo, targetType, callback) => {
        try {
            await axiosApi.post("/admin/restore/processing", null, {
                params: {
                    targetNo,
                    targetType,
                },
            });

            alert("복구가 완료되었습니다.");
            if (callback) callback();
        } catch (err) {
            console.error("복구 실패", err);
            alert("복구에 실패했습니다.");
        }
    };

    return {
        restoreList,
        restoreDetail,
        getRestoreList,
        getRestoreDetail,
        restoreItem,
    };
};

export default useRestoreUtils;
