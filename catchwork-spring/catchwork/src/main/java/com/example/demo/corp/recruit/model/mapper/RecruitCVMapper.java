package com.example.demo.corp.recruit.model.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

@Mapper
public interface RecruitCVMapper {
	
	 /**전체 이력서 조회
	 * @author JIN
	 * @return
	 */
	List<RecruitCV> selectAllRecruitCV();
	 
	 /**학력,경력 필터링 조회
	 * @author JIN
	 * @param filter
	 * @return
	 */
	List<RecruitCV> getCVList(RecruitCV filter);

	
	/** 파일 경로 저장(7/4 하는중)
	 * @author JIN
	 * @param cvNo
	 * @return
	 */
	String selectCVPDFPath(int cvNo);
	 
}
