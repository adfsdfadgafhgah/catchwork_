package com.example.demo.cv.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.cv.model.dto.CV;

import com.example.demo.cv.model.dto.CV;
import com.example.demo.cv.model.dto.CVAward;
import com.example.demo.cv.model.dto.CVEducation;
import com.example.demo.cv.model.dto.CVExperience;
import com.example.demo.cv.model.dto.CVLanguage;
import com.example.demo.cv.model.dto.CVMilitary;
import com.example.demo.cv.model.dto.CVOuter;
import com.example.demo.cv.model.dto.CVPortfolio;
import com.example.demo.cv.model.dto.CVQualify;
import com.example.demo.cv.model.dto.CVTraining;

@Mapper
public interface CVMapper {
	
	/** 이력서 추가
	 * @param cv
	 */
	void addCV(CV cv);

	/** 병역 추가
	 * @param military
	 */
	void addMilitary(CVMilitary military);

	/** 학력 추가
	 * @param education
	 */
	void addEducation(CVEducation education);

	/** 경력 추가
	 * @param experience
	 */
	void addExperience(CVExperience experience);

	/** 수상 추가
	 * @param award
	 */
	void addAward(CVAward award);

	/** 자격증 추가
	 * @param qualify
	 */
	void addQualify(CVQualify qualify);

	/** 어학 추가
	 * @param language
	 */
	void addLanguage(CVLanguage language);

	/** 대외 추가
	 * @param outer
	 */
	void addOuter(CVOuter outer);

	/** 교육 추가
	 * @param training
	 */
	void addTraining(CVTraining training);

	/** 포폴 추가
	 * @param portfolio
	 */
	void addPortfolio(CVPortfolio portfolio);
	
// 	// 회원번호(memNo)로 이력서 목록 조회
//     List<CV> selectCVList(@Param("memNo") String memNo);

    
//     void insertSubmitCV(@Param("memNo") String memNo, 
//             @Param("cvNo") int cvNo, 
//             @Param("recruitNo") int recruitNo);

}
