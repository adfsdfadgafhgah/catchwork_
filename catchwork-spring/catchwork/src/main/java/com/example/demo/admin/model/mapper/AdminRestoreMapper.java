package com.example.demo.admin.model.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.admin.model.dto.AdminRestore;

@Mapper
public interface AdminRestoreMapper {

	/** 복구 대상 목록 조회 */
	List<AdminRestore> selectRestoreList(@Param("category") String category, @Param("keyword") String keyword,
            @Param("startRow") int startRow, @Param("fetchCount") int fetchCount);

	int getRestoreListCount(@Param("category") String category, @Param("keyword") String keyword);

	/** 복구 처리 (STATUS → 0으로 업데이트) */
	int restoreTarget(AdminRestore restoreInfo);
}
