package com.example.demo.member.company.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.member.company.model.dto.CompanyInfo;

@Mapper
public interface CompanyInfoMapper {
	
		 
	    /**
	     * 기업 목록 + 채용공고수 + 조회수 + 저장수 + 관심여부 포함 조회
	     * @author JIN
	     * @param query 회사명 검색어
	     * @param memNo 회원 번호 (관심기업 여부 체크용)
	     * @return 기업 정보 리스트
	     */
	    List<CompanyInfo> selectCompanyListWithRecruitInfo(@Param("query") String query, @Param("memNo") String memNo, @Param("sort") String sort, @Param("limit") Integer limit);
	    
	    /**
		 * 특정 기업 조회->detail로 가기 위한
		 * @author JIN
		 * @param corpNo
		 * @param memNo
		 * @return
		 */
		CompanyInfo selectCompanyDetail(@Param("corpNo") int corpNo,@Param("memNo") String memNo);
	
	    
}
