package com.example.demo.mypage.model.service;

import com.example.demo.mypage.model.dto.CorpMyPage;
import com.example.demo.mypage.model.mapper.CorpMyPageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CorpMyPageImpl implements CorpMyPageService {

    @Autowired
    private CorpMyPageMapper mapper;

    @Override
    public CorpMyPage getCorpMyPage(String companyId) {
        return mapper.selectCorpMyPage(companyId);
    }
}
