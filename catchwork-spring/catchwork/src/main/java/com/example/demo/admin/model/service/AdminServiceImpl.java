package com.example.demo.admin.model.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.dto.Admin;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.dto.SupportList;
import com.example.demo.admin.model.entity.AdminEntity;
import com.example.demo.admin.model.mapper.AdminMapper;
import com.example.demo.admin.model.repository.AdminRepository;
import com.example.demo.support.model.dto.Support;

@Service
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper adminMapper;
	
	@Autowired
	private AdminRepository adminRepo;

	@Autowired
	private BCryptPasswordEncoder bcrypt;
	
	@Override
	public AdminEntity auth(Admin inputAdmin) {
	    String adminID = inputAdmin.getAdminId();
	    String adminPW = inputAdmin.getAdminPw();

	    AdminEntity admin = adminRepo.findByAdminId(adminID)
	        .orElseThrow(() -> new IllegalArgumentException("WRONG ID/PW"));

	    if (!bcrypt.matches(adminPW, admin.getAdminPw())) {
	        throw new IllegalArgumentException("WRONG ID/PW");
	    }

	    return admin;
	}


	@Override
	public Object register(Admin inputAdmin) {
		if(adminRepo.existsByAdminEmail(inputAdmin.getAdminEmail())) {
			return null;
		}
		AdminEntity adminEntity = new AdminEntity();
		String rawId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 10);
		String rawPw = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 10);
//		adminEntity.setAdminNO();
		adminEntity.setAdminId(rawId);
		adminEntity.setAdminPw(bcrypt.encode(rawPw));
		adminEntity.setAdminNickname(inputAdmin.getAdminNickname());
		adminEntity.setAdminName(inputAdmin.getAdminName());
		adminEntity.setAdminEmail(inputAdmin.getAdminEmail());
		adminEntity.setAdminTel(inputAdmin.getAdminTel());
		adminRepo.save(adminEntity);
		
	    Map<String, String> result = new HashMap<>();
	    result.put("id", rawId);
	    result.put("password", rawPw);
	    
		return result;
	}

	/**
	 * 관리자 정보 조회
	 * 
	 * @author 민장
	 */
	@Override
	public Admin adminInfo(String adminId) {
		return adminMapper.adminInfo(adminId);
	}

	/**
	 * 전체 문의 목록 조회 (관리자용)
	 * 
	 * @author BAEBAE
	 */
	@Override
	public List<Support> getAllSupportList(Map<String, Object> params) {
		return adminMapper.getAllSupportList(params);
	}

	/**
	 * 특정 문의 상세 조회 (관리자용)
	 * 
	 * @author BAEBAE
	 */
	@Override
	public Support getSupportDetail(int supportNo) {
		return adminMapper.getSupportDetail(supportNo);
	}

	/**
	 * 문의 답변 등록 (관리자용)
	 * 
	 * @author BAEBAE
	 */
	@Override
	public int submitSupportAnswer(Support support) {
		// 답변 등록 시 상태를 'Y'로 변경하고 답변 완료일 설정
		support.setSupportStatus("Y");
		support.setSupportAnswerDate(LocalDateTime.now()); // LocalDateTime 사용
		// adminNo는 Controller 또는 서비스 계층의 상위 로직에서 설정되어야 합니다.
		// 이 메서드가 호출될 때는 support.getAdminNo()에 값이 이미 설정되어 있어야 합니다.
		return adminMapper.submitSupportAnswer(support);

	}

	/**
	 * 최근 미처리 신고 목록 조회
	 * 
	 * @author 민장
	 */
	@Override
	public List<ReportList> selectRecentReportList(int startRow, int endRow) {
		Map<String, Object> param = new HashMap<>();
		param.put("startRow", startRow);
		param.put("endRow", endRow);
		return adminMapper.selectRecentReportList(param);
	}

	/**
	 * 최근 미처리 문의 목록 조회
	 * 
	 * @author 민장
	 */
	@Override
	public List<SupportList> selectRecentSupportList(int startRow, int endRow) {
		Map<String, Object> param = new HashMap<>();
		param.put("startRow", startRow);
		param.put("endRow", endRow);
		return adminMapper.selectRecentSupportList(param);
	}

	/**
	 * 최근 미처리 신고 개수 조회
	 * 
	 * @author 민장
	 */
	@Override
	public Map<String, Object> selectRecentReportCount() {
		return adminMapper.selectRecentReportCount();
	}

	/**
	 * 최근 미처리 문의 개수 조회
	 * 
	 * @author 민장
	 */
	@Override
	public Map<String, Object> selectRecentSupportCount() {
		return adminMapper.selectRecentSupportCount();
	}

	/**
	 * 최근 7일 신고수 통계
	 * 
	 * @author 민장
	 */
	@Override
	public List<Map<String, Object>> selectRecentReportChart() {
		return adminMapper.selectRecentReportChart();
	}

	/**
	 * 최근 7일 문의수 통계
	 * 
	 * @author 민장
	 */
	@Override
	public List<Map<String, Object>> selectRecentSupportChart() {
		return adminMapper.selectRecentSupportChart();
	}

}
