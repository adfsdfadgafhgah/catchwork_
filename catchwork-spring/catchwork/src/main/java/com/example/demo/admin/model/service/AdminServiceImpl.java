package com.example.demo.admin.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.mapper.AdminMapper;
import com.example.demo.support.model.dto.Support;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {
	
	private final AdminMapper adminMapper;

	/** 관리자가 문의 목록 조회
	 * @author BAEBAE
	 */
	@Override
	public List<Support> getAllSupportList(Map<String, Object> params) {
		return adminMapper.getAllSupportList(params);
	}

	/** 특정 문의 상세 조회 (관리자용)
	 * @author BAEBAE
	 */
	@Override
	public Support getSupportDetail(int supportNo) {
		return adminMapper.getSupportDetail(supportNo);
	}

}
