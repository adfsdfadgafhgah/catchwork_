package com.example.demo.support.model.mapper;

import java.util.List;
import com.example.demo.support.model.dto.Support;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper  // 이 어노테이션 꼭 필요
public interface SupportMapper {
	
	// 문의하기 리스트
    List<Support> selectSupportList();
    
    // 문의하기 디테일 아이디로 찾기
    Support selectSupportById(@Param("id") int id);
    
    // 문의하기 작성
    int insertSupport(Support support);
}


