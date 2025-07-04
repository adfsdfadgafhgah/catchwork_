package com.example.demo.member.myPage.myInfo.model.service;

import com.example.demo.auth.model.dto.Member;
import org.springframework.web.multipart.MultipartFile;

public interface MyInfoService {

  // 회원 정보 수정
  int updateMemberInfo(Member member);

  // 프로필 이미지 수정
  int updateProfileImg(MultipartFile profileImg, String memNo);
}
