package com.example.demo.company.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.company.model.dto.FavCorp;
import com.example.demo.company.model.mapper.FavCorpMapper;

@Service
public class FavCorpServiceImpl {
	//수정하는중
	 @Autowired
	    private FavCorpMapper mapper;

	    
	    public int insertFavCorp(FavCorp fav) {
	        return mapper.insertFavCorp(fav);
	    }

	    
	    public int deleteFavCorp(FavCorp fav) {
	        return mapper.deleteFavCorp(fav);
	    }

//	    @Override
//	    public boolean isFav(FavCorp fav) {
//	        return mapper.isFavCorp(fav);
//	    }

	    public int totalFav(int corpNo) {
	        return mapper.totalFav(corpNo);
	    }
}
