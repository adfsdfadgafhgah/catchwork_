import { useState, useEffect } from 'react';

// 이미지 URL 유효성 검사 함수
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  // 빈 문자열 또는 공백만 있는 경우
  if (!url.trim()) return false;

  // null, undefined, "null", "undefined" 문자열 체크
  if (url === 'null' || url === 'undefined') return false;

  // 기본적인 URL 형식 체크 (선택적)
  try {
    new URL(url);
    return true;
  } catch {
    // 상대 경로일 수도 있으므로 기본적인 확장자 체크
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    return imageExtensions.test(url) || url.startsWith('/') || url.startsWith('./');
  }
};

// 이미지 존재 여부를 사전에 체크하는 함수
const checkImageExists = (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    img.src = imageSrc;
  });
};

// 이미지에서 픽셀 색상을 추출하는 유틸리티 함수
export const extractPixelColor = async (imageSrc, x = 1, y = 1) => {
  // 기본 transparent 반환 객체
  const transparentResult = {
    hex: 'transparent',
    rgb: 'transparent',
    rgba: 'transparent',
    values: { r: 0, g: 0, b: 0, a: 0 },
    coordinates: { x: 0, y: 0 },
    imageSize: { width: 0, height: 0 },
    isTransparent: true
  };

  // 1. 이미지 URL 유효성 검사
  if (!isValidImageUrl(imageSrc)) {
    return transparentResult;
  }

  // 2. 이미지 존재 여부 사전 체크 (404 에러를 방지)
  const imageExists = await checkImageExists(imageSrc);
  if (!imageExists) {
    return { ...transparentResult, reason: 'image_not_found' };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // 3. 타임아웃 설정 (5초 후 실패 시 transparent 반환)
    const timeout = setTimeout(() => {
      resolve({ ...transparentResult, reason: 'timeout' });
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);

      // 4. 이미지 크기 검증
      if (img.width === 0 || img.height === 0) {
        resolve({ ...transparentResult, reason: 'invalid_size' });
        return;
      }

      // 5. 좌표 범위 검증 및 조정
      const safeX = Math.max(0, Math.min(x, img.width - 1));
      const safeY = Math.max(0, Math.min(y, img.height - 1));

      try {
        // 임시 캔버스 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({ ...transparentResult, reason: 'canvas_error' });
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // 이미지를 캔버스에 그리기
        ctx.drawImage(img, 0, 0);

        // 지정된 좌표의 픽셀 데이터 가져오기
        const imageData = ctx.getImageData(safeX, safeY, 1, 1);
        const [r, g, b, a] = imageData.data;

        // 6. 픽셀 데이터 유효성 검사
        if (r === undefined || g === undefined || b === undefined || a === undefined) {
          resolve({ ...transparentResult, reason: 'pixel_data_error' });
          return;
        }

        // 다양한 형태로 색상 반환
        const colors = {
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
          rgb: `rgb(${r}, ${g}, ${b})`,
          rgba: `rgba(${r}, ${g}, ${b}, ${a / 255})`,
          values: { r, g, b, a },
          coordinates: { x: safeX, y: safeY }, // 실제 사용된 좌표
          imageSize: { width: img.width, height: img.height }
        };

        resolve(colors);
      } catch (error) {
        resolve({ ...transparentResult, reason: 'processing_error' });
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      // 이 부분은 사전 체크에서 걸러지므로 실행되지 않을 것임
      resolve({ ...transparentResult, reason: 'load_error' });
    };

    img.src = imageSrc;
  });
};

// React 컴포넌트에서 사용할 수 있는 훅 (개선된 버전)
export const useImagePixelColor = (imageSrc, x = 1, y = 1, options = {}) => {
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    defaultColor = 'transparent', // 기본 색상을 transparent로 변경
    retryCount = 2,               // 재시도 횟수
    retryDelay = 1000            // 재시도 지연시간 (ms)
  } = options;

  useEffect(() => {
    if (!imageSrc) {
      setColor({
        hex: 'transparent',
        rgb: 'transparent',
        rgba: 'transparent',
        isDefault: true
      });
      setError(null);
      setLoading(false);
      return;
    }

    const attemptExtraction = async (attempt = 1) => {
      try {
        setLoading(true);
        setError(null);

        const extractedColor = await extractPixelColor(imageSrc, x, y);
        setColor(extractedColor);
        setLoading(false);
      } catch (err) {
        console.warn(`색상 추출 시도 ${attempt} 실패:`, err.message);

        if (attempt < retryCount) {
          // 재시도
          setTimeout(() => {
            attemptExtraction(attempt + 1);
          }, retryDelay);
        } else {
          // 최종 실패 시 transparent 사용
          setError(err.message);
          setColor({
            hex: defaultColor,
            rgb: defaultColor,
            rgba: defaultColor,
            isDefault: true
          });
          setLoading(false);
        }
      }
    };

    attemptExtraction();
  }, [imageSrc, x, y, defaultColor, retryCount, retryDelay]);

  return { color, loading, error };
};

// 여러 좌표에서 색상을 추출하여 가장 적합한 색상 선택
export const extractDominantColor = async (imageSrc, options = {}) => {
  const {
    samplePoints = [
      { x: 1, y: 1 },
      { x: 10, y: 10 },
      { x: 20, y: 20 }
    ],
    excludeTransparent = true,
    excludeWhite = false,
    excludeBlack = false
  } = options;

  if (!isValidImageUrl(imageSrc)) {
    return {
      hex: 'transparent',
      rgb: 'transparent',
      rgba: 'transparent',
      values: { r: 0, g: 0, b: 0, a: 0 },
      coordinates: { x: 0, y: 0 },
      imageSize: { width: 0, height: 0 },
      isTransparent: true,
      reason: 'invalid_url'
    };
  }

  const colors = [];

  for (const point of samplePoints) {
    try {
      const color = await extractPixelColor(imageSrc, point.x, point.y);

      // transparent인 경우 건너뛰기
      if (color.isTransparent) continue;

      // 필터링 조건 적용
      if (excludeTransparent && color.values.a < 128) continue;
      if (excludeWhite && color.values.r > 240 && color.values.g > 240 && color.values.b > 240) continue;
      if (excludeBlack && color.values.r < 15 && color.values.g < 15 && color.values.b < 15) continue;

      colors.push(color);
    } catch (error) {
      console.warn(`좌표 (${point.x}, ${point.y})에서 색상 추출 실패:`, error.message);
    }
  }

  if (colors.length === 0) {
    return {
      hex: 'transparent',
      rgb: 'transparent',
      rgba: 'transparent',
      values: { r: 0, g: 0, b: 0, a: 0 },
      coordinates: { x: 0, y: 0 },
      imageSize: { width: 0, height: 0 },
      isTransparent: true,
      reason: 'no_valid_colors'
    };
  }

  // 첫 번째 유효한 색상 반환 (추후 더 정교한 로직으로 개선 가능)
  return colors[0];
};