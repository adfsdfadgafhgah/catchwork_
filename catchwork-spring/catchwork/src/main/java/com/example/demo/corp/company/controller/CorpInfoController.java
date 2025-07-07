package com.example.demo.corp.company.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.corp.company.model.dto.CorpInfo;
import com.example.demo.corp.company.model.service.CorpInfoService;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("corpcompany")
public class CorpInfoController {

	@Autowired
	private CorpInfoService corpInfoService;
    
	/**기업 조회
	 * ex) /corpcompanydetail
	 * @author JIN
	 * @param memNo
	 * @return
	 */
	@GetMapping("detail")
	public ResponseEntity<?> getMyCorpDetail(@RequestParam("memNo") String memNo) {
	    log.info("📌 로그인한 회원 memNo: {}", memNo);

	    try {
	        CorpInfo corpInfo = corpInfoService.selectCorpDetailByMemNo(memNo);
	        if (corpInfo == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 회원의 기업 정보를 찾을 수 없습니다.");
	        }
	        return ResponseEntity.ok(corpInfo);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("기업 상세 조회 중 오류 발생");
	    }
	}
	
	/** 기업 정보 수정
	 * @author JIN
	 * @param corpInfo
	 * @return
	 */
	@PostMapping("update")
	public ResponseEntity<String> updateCorpInfo(@RequestBody CorpInfo corpInfo) {
        int result = corpInfoService.updateCorpInfo(corpInfo);
        
        if (result > 0) {
            return ResponseEntity.ok("수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패");
        }
    }
	
	/** 공고 작성페이지에서 기업정보 가져오기
	 * @author BAEBAE
	 * @param memNo
	 * @return
	 */
	@GetMapping("info/{memNo}")
	public ResponseEntity<CorpInfo> getCorpInfo(@PathVariable("memNo") String memNo) {
		System.out.println("🔍 기업 정보 요청 받음: memNo = " + memNo); // ✅
	    CorpInfo corpInfo = corpInfoService.getCorpInfoByMember(memNo);
	    System.out.println("📦 반환할 corpInfo = " + corpInfo); // ✅
	    if (corpInfo == null) {
	        return ResponseEntity.notFound().build(); // 404 처리
	    }
	    return ResponseEntity.ok(corpInfo);
	}
}
