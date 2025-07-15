package com.example.demo.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportSearchCriteria {
	
	// 필터링 조건
    private String targetType;      // 신고 대상 타입 (BOARD, COMMENT 등)
    private String status;          // 처리 상태 (Y, N)
    private String startDate;       // 검색 시작일
    private String endDate;         // 검색 종료일
    private String query;           // 검색어 (신고 내용, 닉네임 등)
    
    // 페이지네이션
    private int page = 1;           // 현재 페이지 번호
    private int itemsPerPage = 10;  // 페이지 당 아이템 수
    
    // SQL에서 사용할 rownum 계산
    public int getStartRow() {
        return (page - 1) * itemsPerPage + 1;
    }

    public int getEndRow() {
        return page * itemsPerPage;
    }

}
