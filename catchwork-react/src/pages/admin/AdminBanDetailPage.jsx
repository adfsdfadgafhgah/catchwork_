import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useBanUtils from "../../hooks/admin/useBanUtils";
import BanDetailBox from "../../components/admin/ban/BanDetailBox";
import styles from "./AdminBanDetailPage.module.css";

const AdminBanDetailPage = () => {
  const { banNo } = useParams();
  const navigate = useNavigate();

  const {
    banDetail,
    getBanDetail,
    releaseBan,
  } = useBanUtils();

  useEffect(() => {
    if (banNo) {
      getBanDetail(banNo);
    }
  }, [banNo]);

  const onRelease = (banNo) => {
    releaseBan(banNo, () => {
      navigate("/admin/ban");
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>정지 상세</h2>
      <BanDetailBox
        banDetail={banDetail}
        onRelease={onRelease}
      />
    </div>
  );
};

export default AdminBanDetailPage;
