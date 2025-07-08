package com.example.demo.member.myPage.myInfo.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.auth.model.dto.Member;

@Mapper
public interface MyInfoMapper {

  // 회원 정보 수정
  int updateMemberInfo(Member member);

  // 프로필 이미지 수정
  int updateProfileImg(Map<String, Object> map);
  
  // 회원 조회
  Member selectMember(String memNo);

  // 비밀번호 변경
  int changePw(Member member);

}
