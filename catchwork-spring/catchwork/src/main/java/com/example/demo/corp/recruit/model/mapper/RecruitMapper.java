package com.example.demo.corp.recruit.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.corp.recruit.model.dto.Recruit;

@Mapper
public interface RecruitMapper {

	/** 채용공고 작성
	 * @author BAEBAE
	 * @param recruit
	 * @return
	 */
	int writeRecruit(Recruit recruit);

	/** 채용공고 상세
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	Recruit getRecruitDetail(@Param("recruitNo") int recruitNo, @Param("memNo") String memNo);

	/** 채용공고 목록
	 * @author BAEBAE
	 * @param paramMap
	 * @return
	 */
	List<Recruit> selectRecruitList(Map<String, Object> paramMap);
	
	// ------------------------------------------------------------------

	/** 채용공고 좋아요
	 * @author BAEBAE
	 * @param memNo
	 * @param recruitNo
	 * @return
	 */
	boolean checkRecruitLike(@Param("memNo") String memNo, @Param("recruitNo") int recruitNo);

	void deleteRecruitLike(@Param("memNo") String memNo, @Param("recruitNo") int recruitNo);

	void insertRecruitLike(@Param("memNo") String memNo, @Param("recruitNo") int recruitNo);

	
	// ------------------------------------------------------------------

	/** 채용공고 삭제
	 * @author BAEBAE
	 * @param recruitNo
	 * @param memNo
	 * @return
	 */
	String findWriterByRecruitNo(@Param("recruitNo") int recruitNo);
	
	int deleteRecruit(@Param("recruitNo") int recruitNo, @Param("memNo") String memNo);


	
	// ------------------------------------------------------------------


	/** 공고 마감처리
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	int updateRecruitStatusToClosed(int recruitNo);

	/** 채용공고 수정
	 * @author BAEBAE
	 * @param recruit
	 * @return
	 */
	int editRecruit(Recruit recruit);
}
