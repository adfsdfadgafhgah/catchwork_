package com.example.demo.cv.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.cv.model.dto.CV;
import com.example.demo.cv.model.dto.CVCheck;
import com.example.demo.cv.model.service.CVService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("cv")
public class CVController {
	

	// CVService 주입
	@Autowired
	private CVService service;
	
	// application.properties의 file.upload.cv-img-path 값을 주입
	@Value("${file.upload.cv-img-path}")
	private String uploadDir; // C:/upload/cv/img

	/** 이력서 주인 확인
	 * @param map
	 * @return
	 */
	@PostMapping("/checkOwner")
	public ResponseEntity<Boolean> checkCVOwner(@RequestBody CVCheck check) {

	    boolean isOwner = service.isOwner(check.getCvNo(), check.getMemNo());

	    return ResponseEntity.ok(isOwner);
	}
	
    /** 이력서 목록 조회
     * @param map
     * @return
     */
    @PostMapping("/list")
    public ResponseEntity<List<CV>> selectCVList(@RequestBody Map<String, Object> map) {
        String memNo = map.get("memNo").toString();

        List<CV> cvList = service.selectCVList(memNo);
        return ResponseEntity.ok(cvList);
    }
    
	/** 이력서 이미지 업로드 처리
	 * @param file
	 * @param memName
	 * @return
	 */
	@PostMapping("img/upload")
	public ResponseEntity<?> uploadCVImage(
			@RequestParam("image") MultipartFile file,
			@RequestParam("memName") String memName) {
		
		// 파일이 비어 있는지 확인
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("파일이 없습니다.");
		}

		try {
			// 원본 파일명 추출
			String originalFilename = file.getOriginalFilename();
			
			// UUID 생성 후 앞 6자리만 사용
			String uuid = UUID.randomUUID().toString().substring(0, 6);
			
			// 확장자 추출 (예: jpg, png)
			String ext = StringUtils.getFilenameExtension(originalFilename);
			
			// 저장 파일명 구성 (이름_타임스탬프_uuid.확장자)
			String savedName = memName + "_" + System.currentTimeMillis() + "_" + uuid + "." + ext;
			
			// 업로드 대상 경로 생성
			File target = new File(uploadDir, savedName);
			
			// 상위 디렉터리가 없으면 생성
			if (!target.getParentFile().exists()) {
				target.getParentFile().mkdirs();
			}
			
			// 파일 저장
			file.transferTo(target);
			
			// 저장된 파일명 반환
			return ResponseEntity.ok(savedName);
			
		} catch (IOException e) {
			// 업로드 실패 시 에러 로그 및 500 응답
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("업로드 실패");
		}
	}
	
	/** 이력서 조회
	 * @param cvNum
	 * @return
	 */
	@PostMapping("/detail")
	public ResponseEntity<CV> detailCV(@RequestBody Map<String, Object> cvNum) {
		int cvNo = Integer.parseInt(cvNum.get("cvNo").toString());
	    CV cv = service.selectCV(cvNo);
	    return ResponseEntity.ok(cv);
	}
	
	/** 이력서 추가
	 * @param cv
	 * @return
	 */
	@PostMapping("/add")
	public ResponseEntity<String> addCV(@RequestBody CV cv) {
		
		// 수신한 payload 로그 출력
		log.debug("Payload 수신됨: {}", cv);

		try {
			// CV 등록 서비스 호출
			service.addCV(cv);
			
			// 성공 응답 반환
			return ResponseEntity.ok("이력서 등록 성공");
			
		} catch (Exception e) {
			// 실패 시 에러 로그 및 500 응답
			log.error("이력서 등록 실패", e);
			return ResponseEntity.internalServerError().body("이력서 등록 실패: " + e.getMessage());
		}
	}
	
	
	/** 이력서 수정
	 * @param cv
	 * @return
	 */
	@PostMapping("/update")
	public ResponseEntity<String> updateCV(@RequestBody CV cv) {
	    log.debug("수정 요청 Payload: {}", cv);

	    try {
	        service.updateCV(cv);
	        return ResponseEntity.ok("이력서 수정 성공");
	    } catch (Exception e) {
	        log.error("이력서 수정 실패", e);
	        return ResponseEntity.internalServerError().body("이력서 수정 실패: " + e.getMessage());
	    }
	}

	/** 이력서 삭제
	 * @param cvNo
	 * @return
	 */
	@PostMapping("/delete")
	public ResponseEntity<String> deleteCV(@RequestBody Map<String, Object> payload) {
	    try {
	        int cvNo = Integer.parseInt(payload.get("cvNo").toString());
	        service.deleteCV(cvNo);
	        return ResponseEntity.ok("이력서 삭제 성공");
	    } catch (Exception e) {
	        log.error("이력서 삭제 실패", e);
	        return ResponseEntity.internalServerError().body("이력서 삭제 실패: " + e.getMessage());
	    }
	}
	
//	//윤진 submit cv
//	@PostMapping("/submitcv")
//	public ResponseEntity<?> submitCV(@RequestBody Map<String, Object> data) {
//		 try {
//	            log.info("이력서 제출 요청 데이터: {}", data);
//
//	            String memNo = (String) data.get("memNo");
//	            int cvNo = (int) data.get("cvNo");
//	            int recruitNo = (int) data.get("recruitNo");
//
//	            service.submitCV(memNo, cvNo, recruitNo);
//
//	            return ResponseEntity.ok("이력서 제출 완료");
//	        } catch (Exception e) {
//	            log.error("이력서 제출 중 오류", e);
//	            return ResponseEntity.internalServerError().body("제출 실패");
//	        }
//	}
	
}
