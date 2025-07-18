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
    public List<AdminRestore> selectRestoreList(int startRow, int endRow) {
        return mapper.selectRestoreList(startRow, endRow);
    }

    @Override
    public int getRestoreListCount() {
        return mapper.getRestoreListCount();
    }

    @Override
    public int restoreTarget(AdminRestore restoreInfo) {
        return mapper.restoreTarget(restoreInfo);
    }
}
