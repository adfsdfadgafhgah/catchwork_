package com.example.demo.company.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.company.model.dto.CorpInfo;
import com.example.demo.company.model.dto.FavCorp;

@Mapper
public interface FavCorpMapper {

	
    /**
     * @author JIN
     * @param corpNo
     * @return
     */
    int totalFav(int corpNo); // 기업별 총 관심 수

    /**
     * @author JIN
     * @param favCorp
     * @return
     */
    int insertFavCorp(FavCorp favCorp);// 관심기업 등록
    
    /**
     * @author JIN
     * @param favCorp
     * @return
     */
    int deleteFavCorp(FavCorp favCorp);// 관심기업 삭제
    
    
}
