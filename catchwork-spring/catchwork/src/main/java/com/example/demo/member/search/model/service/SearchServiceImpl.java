package com.example.demo.member.search.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.recruit.model.dto.MemRecruit;
import com.example.demo.member.search.model.mapper.SearchMapper;

@Service
public class SearchServiceImpl implements SearchService{

	
	@Autowired
    private SearchMapper searchMapper;

    /**
     * select recruit
     */
    @Override
    public List<MemRecruit> searchRecruit(String query, String memNo, String status, String sort) {
        return searchMapper.searchRecruit(query, memNo, status, sort);
    }
    
    /**
     * select company
     */
    @Override
    public List<CompanyInfo> searchCompany(String query,String memNo) {
        return searchMapper.searchCompany(query,memNo);
    }
}
