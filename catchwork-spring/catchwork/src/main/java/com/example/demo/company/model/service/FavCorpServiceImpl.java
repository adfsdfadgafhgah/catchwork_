package com.example.demo.company.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.company.model.dto.FavCorp;
import com.example.demo.company.model.mapper.FavCorpMapper;

@Service
public class FavCorpServiceImpl implements FavCorpService{
	// 수정 좀 해주세요
	// 수정 좀 해주세요
	// 수정 좀 해주세요
	// 수정 좀 해주세요
	// 수정 좀 해주세요
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
	 // 수정 좀 해주세요
	 // 수정 좀 해주세요
	 // 수정 좀 해주세요
	 // 수정 좀 해주세요
	 // 수정 좀 해주세요


@Override
public int insertFav(FavCorp fav) {
	// TODO Auto-generated method stub
	return 0;
}


@Override
public int deleteFav(FavCorp fav) {
	// TODO Auto-generated method stub
	return 0;
}


@Override
public boolean isFav(FavCorp fav) {
	// TODO Auto-generated method stub
	return false;
}
}
