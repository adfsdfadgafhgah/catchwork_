package com.example.demo.admin.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDetailResponse {
	
	private TargetInfo targetInfo;           // 신고 대상의 상세 정보
    private List<AdminReport> reports;       // 해당 대상에 대한 모든 개별 신고 내역

}
