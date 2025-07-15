package com.example.demo.admin.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.admin.model.dto.ReportList;


@Mapper
public interface AdminMapper {
	
	/** 최근 미처리 신고 목록 조회
	 * @return
	 * @author 민장
	 */
	List<ReportList> selectRecentReportList(Map<String, Object> param);
	
	/** 최근 미처리 신고 개수 조회
	 * @return
	 * @author 민장
	 */
	Map<String, Object> selectRecentReportCount();
    
}
