package com.example.demo.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.service.AdminService;

@RestController
@RequestMapping("admin")
public class AdminController {

    @Autowired
    private AdminService service;

    /** 최근 미처리 신고 목록 조회
     * @param page
     * @param size
     * @return
     * @author 민장
     */
    @GetMapping("recentReport/list")
    public List<ReportList> selectRecentReportList(
        @RequestParam("page") int page,
        @RequestParam("size") int size
    ) {
        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
        return service.selectRecentReportList(startRow, endRow);
    }
    
    @GetMapping("recentReport/count")
    public Map<String, Object> selectRecentReportCount() {
        return service.selectRecentReportCount();
    }
}
