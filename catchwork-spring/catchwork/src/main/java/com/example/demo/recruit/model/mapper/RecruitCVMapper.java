package com.example.demo.recruit.model.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.recruit.model.dto.RecruitCV;

@Mapper
public interface RecruitCVMapper {
	
	//전체 조회
	 List<RecruitCV> selectAllRecruitCV();
	 
	//학력/경력 필터링 조회
	 List<RecruitCV> getCvList(@Param("edu") String edu, @Param("career") String career);

	 //파일 경로 저장
	 String selectCvFilePath(int cvNo);
	 
	 
}
