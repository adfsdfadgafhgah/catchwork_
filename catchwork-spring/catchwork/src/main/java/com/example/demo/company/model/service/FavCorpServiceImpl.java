package com.example.demo.company.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.company.model.dto.FavCorp;
import com.example.demo.company.model.mapper.FavCorpMapper;

@Service
public class FavCorpServiceImpl implements FavCorpService{

		@Autowired
	    private FavCorpMapper mapper;

		/**
		 * 관심 등록
		 */
		@Override
	    public int insertFavCorp(FavCorp fav) {
	        return mapper.insertFavCorp(fav);
	    }

		/**
		 * 관심 삭제
		 */
		@Override
	    public int deleteFavCorp(FavCorp fav) {
	        return mapper.deleteFavCorp(fav);
	    }
		
	    /**
	     * 관심 등록 유무
	     */
	    @Override
	    public boolean isFavCorp(FavCorp fav) {
	    	return  mapper.isFavCorp(fav);
	    }
	    
	    /**
	     * 기업별 총 관심 수
	     */
	    @Override
	    public int totalFav(int corpNo) {
	        return mapper.totalFav(corpNo);
	    }


}
