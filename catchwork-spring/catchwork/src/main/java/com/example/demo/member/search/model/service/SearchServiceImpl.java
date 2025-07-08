package com.example.demo.member.search.model.service;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.recruit.model.dto.MemRecruit;
import com.example.demo.member.search.model.dto.Search;
import com.example.demo.member.search.model.mapper.SearchMapper;

@Service
public class SearchServiceImpl implements SearchService{

	@Autowired
    private SearchMapper searchMapper;

    /** search
     * select recruit
     */
    @Override
    public List<MemRecruit> searchRecruit(Map<String, Object> params) {
        return searchMapper.searchRecruit(params);
    }
    
    /** search
     * select company
     */
    @Override
    public List<CompanyInfo> searchCompany(String query,String memNo) {
        return searchMapper.searchCompany(query,memNo);
    }
}
