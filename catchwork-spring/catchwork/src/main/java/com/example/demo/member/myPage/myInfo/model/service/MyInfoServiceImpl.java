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
		System.out.println("서비스 실행");
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
		// System.out.println("탈퇴 서비스 실행");
		int result = myInfoMapper.withdraw(loginMember);
		// System.out.println("result: " + result);
		return result;
	}

	// 즐겨찾기 공고 목록 조회
	@Override
	public List<Recruit> getRecruitList(Map<String, Object> paramMap) {
		return myInfoMapper.getRecruitList(paramMap);
	}

	// 즐겨찾기 기업 목록 조회
	@Override
	public List<CompanyInfo> getCorpList(Map<String, Object> paramMap) {
		return myInfoMapper.getCorpList(paramMap);
	}
}
