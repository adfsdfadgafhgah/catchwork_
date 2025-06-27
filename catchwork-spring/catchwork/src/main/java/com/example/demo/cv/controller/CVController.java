package com.example.demo.cv.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("cv")
public class CVController {
	

    @Value("${file.upload.cv-img-path}")
    private String uploadDir; // <- 값 = C:/upload/cv/img
    
//	@Autowired
//	private CVService service; 
	
	@PostMapping("add")
	public String CVAdd(@RequestBody Map<String, Object> payload) {
	    try {
	        System.out.println("Payload 수신됨: " + payload);
	        return "success";
	    } catch (Exception e) {
	        e.printStackTrace(); // 콘솔에 에러 전체 출력
	        return "fail";
	    }
	}
	
	@PostMapping("img/upload")
    public ResponseEntity<?> uploadCvImage(
    		@RequestParam("image") MultipartFile file,
    		@RequestParam("memName") String memName) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }

        try {
            // 원본 파일명
            String originalFilename = file.getOriginalFilename();
            
            // uuid 자르기
            String uuid = UUID.randomUUID().toString().substring(0, 6);

            // 확장자만 따로 추출
            String ext = StringUtils.getFilenameExtension(originalFilename);

            // 파일명을 UUID로 리네임
            String savedName = memName + "_" + System.currentTimeMillis() + "_" + uuid + "." + ext;

            // 저장 경로 생성
            File target = new File(uploadDir, savedName);

            // 디렉토리 없으면 생성
            if (!target.getParentFile().exists()) {
                target.getParentFile().mkdirs();
            }

            // 파일 저장
            file.transferTo(target);

            // 프론트에 저장된 파일명 반환
            return ResponseEntity.ok(savedName);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("업로드 실패");
        }
    }
	
}
