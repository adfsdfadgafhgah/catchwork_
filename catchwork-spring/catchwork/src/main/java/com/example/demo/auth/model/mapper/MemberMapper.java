package com.example.demo.auth.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.auth.model.dto.Member;

@Mapper
public interface MemberMapper {

	// 로그인 회원의 정보 조회
	Member getLoginMember(String memNo);

	String selectMemberNameByNo(int memNo);

	String selectCorporateNameByNo(int corpNo);

	/** 탈퇴 회원 처리(스케줄러)
	 * @author JAEHO
	 * @param deleteTargetPeriod
	 * @return
	 */
	int withdrawMember(int deleteTargetPeriod);

	/** 사용중인 이미지 조회(스케줄러)
	 * @author JAEHO
	 * @return
	 */
	List<String> selectUsedImage();

	/** 이메일 인증번호 확인
	 * @author JAEHO
	 * @param memEmail
	 * @param authKey
	 * @return
	 */
	int checkAuthKey(Map<String, String> paramMap);

	/** 이메일 인증번호 삭제(스케줄러)
	 * @author JAEHO
	 * @param deleteTargetPeriod
	 * @return
	 */
	int removeTargetEmailAuth(int deleteTargetPeriod);
}
