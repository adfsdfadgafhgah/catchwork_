package com.example.demo.admin.model.mapper;

import com.example.demo.admin.model.dto.AdminBan;
import com.example.demo.admin.model.dto.AdminBanSearch;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminBanMapper {


    // 정지 대상 수 조회
    int selectBanCount(Map<String, Object> paramMap);

    // 정지 목록 조회 (CASE문 포함 대상명 포함됨)
    List<AdminBan> selectBanList(Map<String, Object> paramMap);

    // 정지 상세 조회
    AdminBan selectBanDetail(int banNo);

    // 정지 해제 - BAN 테이블에서 삭제
    int releaseBan(int banNo);

    // === 대상 상태 해제 (STATUS = 0) ===

    // 개인회원
    int updateMemberStatusToNormal(String targetNo);

    // 기업회원
    int updateMemberNameStatusToNormal(String targetNo);

    // 기업
    int updateCorpStatusToNormal(String targetNo);

    // 공고
    int updateRecruitStatusToNormal(String targetNo);

    // 게시글
    int updateBoardStatusToNormal(String targetNo);

    // 댓글
    int updateCommentStatusToNormal(String targetNo);
    
}
