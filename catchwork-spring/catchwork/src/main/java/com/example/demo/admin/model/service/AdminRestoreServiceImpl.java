package com.example.demo.admin.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.admin.model.dto.AdminRestore;
import com.example.demo.admin.model.mapper.AdminRestoreMapper;


@Service
public class AdminRestoreServiceImpl implements AdminRestoreService {

    @Autowired
    private AdminRestoreMapper mapper;

    @Override
    public List<AdminRestore> selectRestoreList(String category, String keyword, int startRow, int fetchCount) {
        return mapper.selectRestoreList(category, keyword, startRow, fetchCount);
    }

    @Override
    public int getRestoreListCount(String category, String keyword) {
        return mapper.getRestoreListCount(category, keyword);
    }

    @Override
    public int restoreTarget(AdminRestore restoreInfo) {
        return mapper.restoreTarget(restoreInfo);
    }
}
