package com.example.demo.support.model.service;

import java.util.List;
import com.example.demo.support.model.dto.Support;

public interface SupportService {
	
	// 문의하기 리스트
    List<Support> getSupportList();
    
    // 내가 작성한 문의
    List<Support> getSupportListByMemNo(String memNo); 

    //문의하기 디테일 아이디로 찾기
    Support findById(int id);

    // 문의하기 작성
    int insertSupport(Support support);
}