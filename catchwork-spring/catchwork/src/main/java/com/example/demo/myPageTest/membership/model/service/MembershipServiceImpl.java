package com.example.demo.myPageTest.membership.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.myPageTest.membership.model.dto.MemberGrade;
import com.example.demo.myPageTest.membership.model.mapper.MembershipMapper;

@Service
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
public class MembershipServiceImpl implements MembershipService {
	
	@Autowired
	private MembershipMapper mapper;
	
	// 멤버십 리스트 조회
	@Override
	public List<MemberGrade> getMembershipList() {
		return mapper.getMembershipList();
	}

}
