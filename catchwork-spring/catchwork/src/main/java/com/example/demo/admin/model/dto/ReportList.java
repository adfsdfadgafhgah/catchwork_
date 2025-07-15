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
}
