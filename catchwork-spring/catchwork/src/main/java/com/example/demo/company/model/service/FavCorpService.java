package com.example.demo.company.model.service;

import com.example.demo.company.model.dto.FavCorp;

public interface FavCorpService {
	
	int insertFavCorp(FavCorp fav);//관심기업 등록
    int deleteFavCorp(FavCorp fav);//관심 기업 삭제
    boolean isFavCorp(FavCorp fav);// 해당 회원이 이 기업을 관심표시 했는지
    int totalFav(int corpNo);//기업별 총 관심 수 
    
}
