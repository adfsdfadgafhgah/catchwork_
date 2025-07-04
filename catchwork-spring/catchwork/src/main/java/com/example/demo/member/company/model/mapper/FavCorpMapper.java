package com.example.demo.member.company.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.member.company.model.dto.FavCorp;

@Mapper
public interface FavCorpMapper {
	

	/**
	 * @param fav
	 * @return
	 */
	int isSaved(FavCorp favCorp);//관심 기업 등록 체크
	
    /**
     * @author JIN
     * @param favCorp(memNo,corpNo)
     * @return
     */
    int insertFavCorp(FavCorp favCorp);// 관심기업 등록
    
    /**
     * @author JIN
     * @param favCorp(memNo,corpNo)
     * @return
     */
   
    int deleteFavCorp(FavCorp favCorp);// 관심기업 삭제
	
	 /**
     * @author JIN
     * @param corpNo
     * @return
     */
    int totalFav(int corpNo); // 기업별 총 관심 수

	

	

    
}
