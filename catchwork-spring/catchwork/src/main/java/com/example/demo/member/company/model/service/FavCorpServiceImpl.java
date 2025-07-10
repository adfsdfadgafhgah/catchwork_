package com.example.demo.member.company.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.member.company.model.dto.FavCorp;
import com.example.demo.member.company.model.mapper.FavCorpMapper;

@Service
public class FavCorpServiceImpl implements FavCorpService{

		@Autowired
	    private FavCorpMapper mapper;

		/**
	     * 관심 등록 유무
	     * @author JIN
	     */
	    @Override
	    public int isSaved(FavCorp favCorp) {
	    	return  mapper.isSaved(favCorp);
	    }
		
		/**
		 * 관심 등록
		 * @author JIN
		 */
		@Override
	    public int insertFavCorp(FavCorp favCorp) {
	        return mapper.insertFavCorp(favCorp);
	    }

		/**
		 * 관심 삭제
		 * @author JIN
		 */
		@Override
		public int deleteFavCorp(FavCorp favCorp) {
			return mapper.deleteFavCorp(favCorp);
		}
		
	    /**
	     * 기업별 총 관심 수
	     * @author JIN
	     */
	    @Override
	    public int totalFav(int corpNo) {
	        return mapper.totalFav(corpNo);
	    }
}


