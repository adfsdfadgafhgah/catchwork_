package com.example.demo.myPage.membership.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.myPage.membership.model.dto.MemberGrade;

@Mapper
public interface MembershipMapper {

	// 멤버십 리스트 조회
	List<MemberGrade> getMembershipList();

}
