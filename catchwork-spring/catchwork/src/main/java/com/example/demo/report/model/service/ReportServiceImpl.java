package com.example.demo.report.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.report.model.dto.Report;
import com.example.demo.report.model.mapper.ReportMapper;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportMapper reportMapper;

    @Override
    public int insertReport(Report report) {
        // 중복 신고 확인
        boolean hasReported = hasUserAlreadyReported(
            report.getReportTargetNo(),
            report.getReportTargetType(),
            report.getMemNo()
        );
        if (hasReported) {
            return 0; // 중복 신고인 경우 0 반환
        }
        return reportMapper.insertReport(report);
    }

    @Override
    public boolean hasUserAlreadyReported(String reportTargetNo, String reportTargetType, String memNo) {
        int count = reportMapper.checkDuplicateReport(reportTargetNo, reportTargetType, memNo);
        return count > 0;
    }
}