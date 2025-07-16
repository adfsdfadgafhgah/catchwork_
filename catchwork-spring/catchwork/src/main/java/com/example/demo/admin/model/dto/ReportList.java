package com.example.demo.admin.model.dto;

import java.util.Date;

import com.example.demo.report.model.dto.Report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportList {
    private String reportTargetNo;        // 신고 대상 PK → UUID 포함
    private String reportTargetType;      // 신고 대상 타입
    private String reportContent;         // 대표 신고 내용
    private int reportCount;              // 미처리 신고 건수
    
    // 그룹화 목록에 필요한 추가 정보
    private Date latestReportDate;       // 가장 최신 신고일
    private String overallStatus;        // 종합 처리 상태 ('N' 또는 'Y')
}
