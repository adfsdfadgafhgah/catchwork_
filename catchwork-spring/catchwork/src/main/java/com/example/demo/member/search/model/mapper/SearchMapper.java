package com.example.demo.member.search.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.recruit.model.dto.MemRecruit;

@Mapper
public interface SearchMapper {
	
	

	/**search) recruit
	 * @author JIN
	 * @param params
	 * @return
	 */
	List<MemRecruit> searchRecruit(
		    @Param("query") String query,
		    @Param("memNo") String memNo,
		    @Param("status") String status,
		    @Param("sort") String sort);
	
	/**search) company
	 * @author JIN
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<CompanyInfo> searchCompany(@Param("query") String query, @Param("memNo") String memNo);
}
