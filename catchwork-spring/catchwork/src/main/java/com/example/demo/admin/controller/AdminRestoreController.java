package com.example.demo.admin.controller;

import com.example.demo.admin.model.dto.AdminRestore;
import com.example.demo.admin.model.service.AdminRestoreService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/restore")
public class AdminRestoreController {

	@Autowired
	private AdminRestoreService adminRestoreService;

	/**
	 * 복구 대상 목록 조회 (카테고리 + 검색어 기반 + 페이징)
	 */
	@GetMapping("/list")
	public ResponseEntity<?> getRestoreList(
	    @RequestParam(name = "category", defaultValue = "BOARD") String category,
	    @RequestParam(name = "keyword", defaultValue = "") String keyword,
	    @RequestParam(name = "page", defaultValue = "1") int page
	) {
	    int limit = 10;
	    int startRow = (page - 1) * limit;

	    List<AdminRestore> list = adminRestoreService.selectRestoreList(category, keyword, startRow, limit);
	    int total = adminRestoreService.getRestoreListCount(category, keyword);

	    Map<String, Object> result = new HashMap<>();
	    result.put("list", list);
	    result.put("totalCount", total);

	    return ResponseEntity.ok(result);
	}

	/**
	 * 복구 처리
	 */
	@PostMapping("/processing")
	public ResponseEntity<String> restoreTarget(@RequestBody AdminRestore restoreInfo) {
		int result = adminRestoreService.restoreTarget(restoreInfo);
		return result > 0 ? ResponseEntity.ok("복구 완료") : ResponseEntity.internalServerError().body("복구 실패");
	}
}
