import { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";

const useRestoreUtils = () => {
    const [restoreList, setRestoreList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    // 리스트
    const getRestoreList = async (category, keyword, page = 1) => {
        try {
            const res = await axiosApi.get("/admin/restore/list", {
                params: {
                    category,
                    keyword,
                    page,
                },
            });

            setRestoreList(Array.isArray(res.data.list) ? res.data.list : []);
            setTotalCount(typeof res.data.totalCount === 'number' ? res.data.totalCount : 0);
        } catch (err) {
            console.error("복구 리스트 요청 실패", err);
        }
    };

    // 처리
    const restoreItem = async (targetNo, targetType, callback) => {
        try {
            await axiosApi.post("/admin/restore/processing", { targetNo, targetType });

            // 리스트에서 복구한 항목 제거
            setRestoreList(prev =>
                prev.filter(item => !(item.targetNo === targetNo && item.targetType === targetType))
            );

            // 총 개수도 줄이기
            setTotalCount(prev => prev - 1);

            alert("복구가 완료되었습니다.");
            if (callback) callback();

        } catch (err) {
            console.error("복구 실패", err);
            alert("복구에 실패했습니다.");
        }
    };

    return {
        restoreList,
        totalCount,
        getRestoreList,
        restoreItem,
    };
};

export default useRestoreUtils;