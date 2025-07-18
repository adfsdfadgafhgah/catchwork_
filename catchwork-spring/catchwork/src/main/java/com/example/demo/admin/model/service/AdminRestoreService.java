package com.example.demo.admin.model.service;

import java.util.List;
import com.example.demo.admin.model.dto.AdminRestore;

public interface AdminRestoreService {

    /** 복구 대상 목록 조회 */
	List<AdminRestore> selectRestoreList(int startRow, int endRow);
	int getRestoreListCount();

    /** 대상 복구 처리 */
    int restoreTarget(AdminRestore restoreInfo);
}