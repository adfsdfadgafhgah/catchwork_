package com.example.demo.member.company.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.member.company.model.dto.FavCorp;
import com.example.demo.member.company.model.service.FavCorpService;
import com.example.demo.util.JWTUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/company")
public class FavCorpController {

	 	@Autowired
	    private FavCorpService service;
	
	 	/**
	     * 관심 기업 토글 (등록 / 해제)
	     * @author JIN
	     * @param favCorp (corpNo만 받아오고, memNo는 JWT에서 추출)
	     * @param request
	     * @return 관심 등록 여부, 총 관심 수
	     */
	    @PostMapping("/toggle-favorite")
	    public ResponseEntity<?> toggleFavorite(@RequestBody FavCorp favCorp, HttpServletRequest request) {
	    	log.info("💬 받은 관심기업 요청: {}", favCorp);
	    	   String memNo = favCorp.getMemNo();
	    	    favCorp.setMemNo(memNo);
	    	    
	    	    int isSaved = service.isSaved(favCorp); // ✅ 이 부분 수정

	    	    if (isSaved == 1) { // ✅ 수정됨: int → boolean
	    	        service.deleteFavCorp(favCorp);
	    	        log.debug("관심기업 삭제 완료");
	    	    } else {
	    	        service.insertFavCorp(favCorp);
	    	        log.debug("관심기업 등록 완료");
	    	    }

	        int totalFav = service.totalFav(favCorp.getCorpNo());

	        Map<String, Object> response = new HashMap<>();
	        response.put("isSaved", isSaved == 0 ? 1 : 0); // 등록 → 1, 해제 → 0
	        response.put("totalFav", totalFav);  // 최신 count

	        return ResponseEntity.ok(response);
	    }



	    /**
	     * 총 관심 기업 수 조회 (리스트 화면 등에 활용)
	     * @author JIN
	     */
	    @GetMapping("/favorite-count")
	    public ResponseEntity<Integer> getFavoriteCount(@RequestParam int corpNo) {
	        int count = service.totalFav(corpNo);
	        return ResponseEntity.ok(count);
	    }
}
