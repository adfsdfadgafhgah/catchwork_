package com.example.demo.cv.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.cv.model.dto.CV;

@Mapper
public interface CVMapper {

	
	// 회원번호(memNo)로 이력서 목록 조회
    List<CV> selectCVList(@Param("memNo") String memNo);

    
    void insertSubmitCV(@Param("memNo") String memNo, 
            @Param("cvNo") int cvNo, 
            @Param("recruitNo") int recruitNo);

}
