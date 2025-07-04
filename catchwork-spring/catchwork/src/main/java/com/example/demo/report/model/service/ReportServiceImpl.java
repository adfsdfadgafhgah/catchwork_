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
        return reportMapper.insertReport(report);
    }
}
