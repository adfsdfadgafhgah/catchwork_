package com.example.demo.report.model.dto;

import java.util.Date;
import lombok.Data;

@Data
public class Report {
    private int reportNo;
    private int reportTargetNo;
    private String reportTargetType;
    private String reportContent;
    private String reportStatus;
    private Date reportDate;
    private int reportCategoryCode;
    private String memNo;  // 로그인한 사용자 번호
}
