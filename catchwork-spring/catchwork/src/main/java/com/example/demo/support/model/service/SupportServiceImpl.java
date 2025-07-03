package com.example.demo.support.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.support.model.mapper.SupportMapper;
import com.example.demo.support.model.dto.Support;

@Service
public class SupportServiceImpl implements SupportService {

    @Autowired
    private SupportMapper supportMapper;
    
    // 문의하기 리스트 
    @Override
    public List<Support> getSupportList() {
        List<Support> list = supportMapper.selectSupportList();
        System.out.println("🔍 Support 리스트 개수: " + list.size());
        for (Support s : list) {
            System.out.println("📝 " + s);
        }
        return list;
    }    

    // 문의하기 디테일 아이디
    @Override
    public Support findById(int supportNo) {
        return supportMapper.selectSupportById(supportNo);
    }
    
    // 문의하기 작성
    @Override
    public int insertSupport(Support support) {
        return supportMapper.insertSupport(support);
    }


}