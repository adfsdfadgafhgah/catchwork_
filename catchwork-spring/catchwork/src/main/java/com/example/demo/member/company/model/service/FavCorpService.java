package com.example.demo.member.company.model.service;

import com.example.demo.member.company.model.dto.FavCorp;

public interface FavCorpService {
	
	int isSaved(FavCorp favCorp);// 해당 회원이 이 기업을 관심표시 했는지
	
	int insertFavCorp(FavCorp favCorp);//관심기업 등록
    int deleteFavCorp(FavCorp favCorp);//관심 기업 삭제
    int totalFav(int corpNo);//기업별 총 관심 수 
	
    
}
