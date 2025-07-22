// 이미지에서 픽셀 색상을 추출하는 유틸리티 함수
export const extractPixelColor = (imageSrc, x = 1, y = 1) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 임시 캔버스 생성
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      // 이미지를 캔버스에 그리기
      ctx.drawImage(img, 0, 0);

      try {
        // 지정된 좌표의 픽셀 데이터 가져오기
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imageData.data;

        // 다양한 형태로 색상 반환
        const colors = {
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
          rgb: `rgb(${r}, ${g}, ${b})`,
          rgba: `rgba(${r}, ${g}, ${b}, ${a / 255})`,
          values: { r, g, b, a }
        };

        resolve(colors);
      } catch (error) {
        reject(new Error('픽셀 데이터를 읽을 수 없습니다: ' + error.message));
      }
    };

    img.onerror = () => {
      reject(new Error('이미지를 로드할 수 없습니다.'));
    };

    img.src = imageSrc;
  });
};

// React 컴포넌트에서 사용할 수 있는 훅
export const useImagePixelColor = (imageSrc, x = 1, y = 1) => {
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageSrc) return;

    setLoading(true);
    setError(null);

    extractPixelColor(imageSrc, x, y)
      .then((extractedColor) => {
        setColor(extractedColor);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [imageSrc, x, y]);

  return { color, loading, error };
};