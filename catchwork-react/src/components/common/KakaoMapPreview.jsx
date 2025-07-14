// src/components/common/KakaoMapPreview.jsx
import { useEffect } from "react";

const KakaoMapPreview = ({ address, onClick }) => {
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !address) {
      console.warn("카카오맵이 아직 로드되지 않았습니다.");
      return;
    }

    const mapContainer = document.getElementById("recruitMap");
    // 지도를 표시할 div가 없으면 경고 후 종료
    if (!mapContainer) {
      console.warn("지도를 표시할 'recruitMap' 요소를 찾을 수 없습니다.");
      return;
    }

    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 초기 위치
      level: 3,
    };

    // 지도 생성
    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    // 주소-좌표 변환 객체 생성
    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 이용하여 마커를 생성
        const marker = new window.kakao.maps.Marker({
          map: map, // 마커를 표시할 지도 객체
          position: coords, // 마커의 위치
        });

        // 지도의 중심을 결과값으로 받은 위치로 이동시킴
        map.setCenter(coords);

        // 마커에 클릭 이벤트 등록
        window.kakao.maps.event.addListener(marker, "click", function () {
          // onClick prop이 존재하고 주소가 유효할 경우 호출합니다.
          if (onClick && address) {
            onClick(address);
          } else {
            console.warn(
              "onClick prop이 없거나 주소가 유효하지 않아 호출 불가."
            );
          }
        });
      } else {
        console.warn("주소 검색 실패:", address);
      }
    });

    // 컴포넌트 언마운트 시 지도 객체 정리
    return () => {
      // 카카오맵 API에는 명시적인 지도 제거 메서드가 없으므로,
      // 주로 DOM 요소를 비우는 방식으로 처리합니다.
      if (mapContainer && mapContainer.innerHTML) {
        mapContainer.innerHTML = "";
      }
    };
  }, [address, onClick]); // address와 onClick이 변경될 때마다 useEffect 재실행

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
