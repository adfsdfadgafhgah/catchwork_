package com.example.demo.member.myPage.myInfo.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.board.model.dto.Board;
import com.example.demo.member.board.model.dto.Comment;

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

  // 회원 탈퇴
  int withdraw(Member loginMember);

  // 즐겨찾기 공고 목록 조회
  List<Recruit> getFavRecruitList(Map<String, Object> paramMap);

  // 즐겨찾기 기업 목록 조회
  List<CompanyInfo> getFavCorpList(Map<String, Object> paramMap);

  // 즐겨찾기 게시글 목록 조회
  List<Board> getFavBoardList(Map<String, Object> paramMap);

  // 내가 쓴 게시글 목록 조회
  List<Board> getMyBoardList(Map<String, Object> paramMap);

  // 내가 쓴 댓글 목록 조회
  List<Comment> getMyCommentList(Map<String, Object> paramMap);

  // 내가 지원한 채용공고 목록 조회
  List<Recruit> getMyRecruitList(Map<String, Object> paramMap); 
}
