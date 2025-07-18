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
     * 복구 대상 목록 조회
     */
	@GetMapping("/list")
	public ResponseEntity<?> getRestoreList(@RequestParam(name = "page", defaultValue = "1") int page) {
	    int limit = 10;
	    int endRow = page * limit;
	    int startRow = endRow - limit + 1;

	    List<AdminRestore> list = adminRestoreService.selectRestoreList(startRow, endRow);
	    int total = adminRestoreService.getRestoreListCount();

	    Map<String, Object> map = new HashMap<>();
	    map.put("list", list);
	    map.put("totalCount", total);

	    return ResponseEntity.ok(map);
	}


    /**
     * 복구 처리 (상태값 0으로 변경)
     */
    @PostMapping("/processing")
    public ResponseEntity<String> restoreTarget(@RequestParam("targetNo") String targetNo,
    	    								@RequestParam("targetType") String targetType) {
    	AdminRestore restoreInfo = AdminRestore.builder()
    	        .targetNo(targetNo)
    	        .targetType(targetType)
    	        .build();
    	
        int result = adminRestoreService.restoreTarget(restoreInfo);
        return result > 0
                ? ResponseEntity.ok("복구 완료")
                : ResponseEntity.internalServerError().body("복구 실패");
    }
}
