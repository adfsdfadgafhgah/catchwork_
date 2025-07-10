package com.example.demo.corp.recruit.model.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

@Mapper
public interface RecruitCVMapper {
	
	 /**우리 기업으로 들어온 전체 이력서 조회
	 * @author JIN
	 * @return
	 */
	List<RecruitCV> getCVListByRecruitNo(@Param("recruitNo") int recruitNo);
	 
	 /**학력,경력 필터링 조회
	 * @author JIN
	 * @param filter
	 * @return
	 */
	List<RecruitCV> getCVList(RecruitCV filter);

	/** 이력서 PDF 경로 다운로드
	 * @author JIN
	 * @param cvNo
	 * @return
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
