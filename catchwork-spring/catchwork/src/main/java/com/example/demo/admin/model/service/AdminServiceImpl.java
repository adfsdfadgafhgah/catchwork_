package com.example.demo.admin.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.mapper.AdminMapper;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper mapper;

	// 최근 미처리 신고 목록 조회 (민장)
	@Override
	public List<ReportList> selectRecentReportList(int startRow, int endRow) {
	    Map<String, Object> param = new HashMap<>();
	    param.put("startRow", startRow);
	    param.put("endRow", endRow);
	    return mapper.selectRecentReportList(param);
	}
	
	// 최근 미처리 신고 개수 조회 (민장)
	@Override
	public Map<String, Object> selectRecentReportCount() {
	    return mapper.selectRecentReportCount();
	}
}
