// src/components/common/KakaoMapPreview.jsx
import { useEffect } from "react";

const KakaoMapPreview = ({ address }) => {
  useEffect(() => {
    if (!window.kakao || !address) {
      console.warn("❌ 카카오맵이 아직 로드되지 않았습니다.");
      return;
    }

    const mapContainer = document.getElementById("recruitMap");
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 초기 위치
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });
        map.setCenter(coords);
      } else {
        console.warn("❌ 주소 검색 실패:", address);
      }
    });
  }, [address]);

  return (
    <div
      id="recruitMap"
      style={{
        width: "100%",
        height: "300px",
        border: "1px solid var(--stroke-color1)",
        borderRadius: "12px",
        marginTop: "10px",
      }}
    />
  );
};

export default KakaoMapPreview;
