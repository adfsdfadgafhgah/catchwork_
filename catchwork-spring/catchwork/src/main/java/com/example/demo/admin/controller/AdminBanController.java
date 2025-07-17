package com.example.demo.admin.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.admin.model.dto.AdminBan;
import com.example.demo.admin.model.dto.AdminBanSearch;
import com.example.demo.admin.model.service.AdminBanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/ban")
@RequiredArgsConstructor
public class AdminBanController {

    private final AdminBanService adminBanService;

    /**
     * 정지 목록 조회
     * - 검색 조건: banTargetType, keyword
     * - 페이징: page, amount
     * - 대상명: DB CASE문으로 추출된 target 필드 포함됨
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> selectBanList(AdminBanSearch search) {
        if (search.getAmount() == 0) search.setAmount(10);
        if (search.getPage() == 0) search.setPage(1);

        int offset = (search.getPage() - 1) * search.getAmount();
        search.setOffset(offset);

        Map<String, Object> result = adminBanService.selectBanList(search);
        return ResponseEntity.ok(result);
    }

    /**
     * 정지 상세 조회
     */
    @GetMapping("/detail/{banNo}")
    public ResponseEntity<AdminBan> selectBanDetail(@PathVariable("banNo") int banNo) {
        AdminBan ban = adminBanService.selectBanDetail(banNo);
        return ResponseEntity.ok(ban);
    }

    /**
     * 정지 해제
     * - BAN 테이블 삭제
     * - 대상 테이블 STATUS 복원 (MEMBER, BOARD 등)
     */
    @DeleteMapping("/release/{banNo}")
    public ResponseEntity<String> releaseBan(@PathVariable("banNo") int banNo) {
        int result = adminBanService.releaseBan(banNo);
        
        if (result > 0) {
            return ResponseEntity.ok("정지 해제 완료");
        } else {
            return ResponseEntity.status(500).body("정지 해제 실패");
        }
    }
}
