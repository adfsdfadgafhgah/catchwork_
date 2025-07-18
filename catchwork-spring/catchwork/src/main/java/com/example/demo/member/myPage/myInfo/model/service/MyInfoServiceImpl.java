package com.example.demo.member.myPage.myInfo.model.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.common.util.Utility;
import com.example.demo.member.board.model.dto.Board;
import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.myPage.myInfo.model.mapper.MyInfoMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
@Slf4j
public class MyInfoServiceImpl implements MyInfoService {

	@Autowired
	private MyInfoMapper myInfoMapper;

	// 파일 업로드 경로
	@Value("${file.upload.profile-img-path}")
	private String profileImgPath;

	@Autowired
	private BCryptPasswordEncoder bcrypt;

	// 회원 정보 수정
	@Override
	public int updateMemberInfo(Member member) {
		log.debug("회원 정보 수정 서비스 실행 - memNo: {}", member.getMemNo());
		return myInfoMapper.updateMemberInfo(member);
	}

	// 프로필 이미지 수정
	@Override
	public int updateProfileImg(MultipartFile profileImg, String memNo) {

		int result = 0;

		String originalFilename = profileImg.getOriginalFilename();
		String savedName = Utility.fileRename(originalFilename);

		try {
			// 디렉터리 생성 확인 및 생성
			File uploadDir = new File(profileImgPath);
			if (!uploadDir.exists()) {
				boolean created = uploadDir.mkdirs();
				if (!created) {
					log.error("프로필 이미지 업로드 디렉터리 생성 실패: {}", profileImgPath);
					return 0;
				}
				log.info("프로필 이미지 업로드 디렉터리 생성 완료: {}", profileImgPath);
			}

			// 파일 저장 경로 (경로 정규화)
			Path uploadPath = Paths.get(profileImgPath, savedName);
			
			File profileFile = uploadPath.toFile();
			
			// 이미지 파일 업로드
			profileImg.transferTo(profileFile);

			Map<String, Object> map = new HashMap<>();
			map.put("webPath", savedName);
			map.put("memNo", memNo);

			result = myInfoMapper.updateProfileImg(map);

		} catch (IOException e) {
			log.error("프로필 이미지 업로드 실패", e);
			throw new RuntimeException("프로필 이미지 업로드 실패");
		}
		return result;
	}

	// 프로필 이미지 삭제
	@Override
	public int deleteProfileImg(String memNo) {
		return myInfoMapper.deleteProfileImg(memNo);
	}

	// 비밀번호 확인
	@Override
	public int verifyPassword(Member loginMember) {
		Member member = myInfoMapper.selectMember(loginMember.getMemNo());
		if (member == null)
			return 0;
		return bcrypt.matches(loginMember.getMemPw(), member.getMemPw()) ? 1 : 0;
	}

	// 비밀번호 변경
	@Override
	public int changePw(String memPw, String memNo) {
		Member member = new Member();
		member.setMemNo(memNo);
		member.setMemPw(bcrypt.encode(memPw));
		return myInfoMapper.changePw(member);
	}

	// 회원 탈퇴
	@Override
	public int withdraw(Member loginMember) {
		log.debug("회원 탈퇴 서비스 실행 - memNo: {}", loginMember.getMemNo());
		int result = myInfoMapper.withdraw(loginMember);
		log.debug("회원 탈퇴 결과: {}", result);
		return result;
	}

	// 즐겨찾기 공고 목록 조회
	@Override
	public List<Recruit> getFavRecruitList(Map<String, Object> paramMap) {
		return myInfoMapper.getFavRecruitList(paramMap);
	}

	// 즐겨찾기 기업 목록 조회
	@Override
	public List<CompanyInfo> getFavCorpList(Map<String, Object> paramMap) {
		Integer page = (Integer) paramMap.get("page");
		Integer size = (Integer) paramMap.get("size");
		Integer offset = null;
		if(page!=null) {			
		offset = (page - 1) * size;
		}
		paramMap.put("offset", offset);
		return myInfoMapper.getFavCorpList(paramMap);
	}

	// 즐겨찾기 게시글 목록 조회
	@Override
	public List<Board> getFavBoardList(Map<String, Object> paramMap) {
		Integer page = (Integer) paramMap.get("page");
		Integer size = (Integer) paramMap.get("size");
		Integer offset = null;
		if(page!=null) {			
		offset = (page - 1) * size;
		}
		paramMap.put("offset", offset);
		return myInfoMapper.getFavBoardList(paramMap);
	}

	// 내가 쓴 게시글 목록 조회
	@Override
	public List<Board> getMyBoardList(Map<String, Object> paramMap) {
		Integer page = (Integer) paramMap.get("page");
		Integer size = (Integer) paramMap.get("size");
		Integer offset = null;
		if(page!=null) {			
		offset = (page - 1) * size;
		}
		paramMap.put("offset", offset);
		return myInfoMapper.getMyBoardList(paramMap);
	}

	// 내가 쓴 댓글 목록 조회
	@Override
	public List<Map<String, Object>> getMyCommentList(Map<String, Object> paramMap) {
		Integer page = (Integer) paramMap.get("page");
		Integer size = (Integer) paramMap.get("size");
		Integer offset = null;
		if(page!=null) {			
		offset = (page - 1) * size;
		}
		paramMap.put("offset", offset);
		return myInfoMapper.getMyCommentList(paramMap);
	}	

	// 내가 지원한 채용공고 목록 조회
	@Override
	public List<Recruit> getMyRecruitList(Map<String, Object> paramMap) {
		return myInfoMapper.getMyRecruitList(paramMap);
	}	
}
