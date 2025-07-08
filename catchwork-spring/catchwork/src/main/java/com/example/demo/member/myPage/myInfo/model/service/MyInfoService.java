package com.example.demo.member.myPage.myInfo.model.service;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.member.company.model.dto.CompanyInfo;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface MyInfoService {

  // 회원 정보 수정
  int updateMemberInfo(Member member);

  // 프로필 이미지 수정
  int updateProfileImg(MultipartFile profileImg, String memNo);

  // 비밀번호 확인
  int verifyPassword(Member loginMember);

  // 비밀번호 변경
  int changePw(String memPw, String memNo);

  // 회원 탈퇴
  int withdraw(Member loginMember);

  // 즐겨찾기 공고 목록 조회
  List<Recruit> getRecruitList(Map<String, Object> paramMap);

  // 즐겨찾기 기업 목록 조회
  List<CompanyInfo> getCorpList(Map<String, Object> paramMap);
}
