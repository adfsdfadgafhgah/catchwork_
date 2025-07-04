package com.example.demo.report.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.example.demo.report.model.dto.Report;

@Mapper
public interface ReportMapper {
    int insertReport(Report report);
}