package com.example.demo.corp.recruit.model.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

@Mapper
public interface RecruitCVMapper {
	
	/** 회원의 기업 권한 여부 조회
	 * @author JIN
	 * @param memNo
	 * @return 대표'Y'. 사원 'N'
	 */
	String getCorpRoleByMemNo(@Param("memNo") String memNo);
	
	/** 회원 소속 기업 번호
	 * @author JIN
	 * @param memNo
	 * @return 회원이 속한 기업 번호
	 */
	Integer getCorpNoByMemNo(@Param("memNo") String memNo);
	
	/**기업 번호로 전체 이력서 조회
	 * @author JIN
	 * @param corpNo
	 * @return 해당 기업의 전체 이력서 리스트
	 */
	List<RecruitCV> getCVListByCorpNo(@Param("corpNo") int corpNo);
	
	/** 작성자가 작성한 공고의 이력서 조회
	 * @author JIN
	 * @param memNo
	 * @return 해당 사원이 작성한 공고의 이력서 리스트
	 */
	List<RecruitCV> getCVListByWriter(@Param("memNo") String memNo);

	 /**학력,경력 필터링 조회
	 * @author JIN
	 * @param filter
	 * @return 조건에 맞는 이력서 리스트
	 */
	List<RecruitCV> getCVList(RecruitCV filter);

	/** 이력서 PDF 경로 다운로드
	 * @author JIN
	 * @param cvNo
	 * @return 이력서 PDF파일의 전체 경로
	 */
	String selectCVPDFPath(int cvNo);
	 
	/** 이력서 PDF 다운로드 체크
	 * @author JIN
	 * @param cvNo
	 */
	void updateCVCheckFlag(int cvNo);
	
	/** 이력서 삭제
	 * @author JIN
	 * @param cvNos
	 */
	void deleteCVs(@Param("cvNos") List<Integer> cvNos);

}
