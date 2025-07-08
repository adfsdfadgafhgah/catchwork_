package com.example.demo.member.cv.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.corp.recruit.model.dto.RecruitCV;
import com.example.demo.member.cv.model.dto.CV;
import com.example.demo.member.cv.model.dto.CVAward;
import com.example.demo.member.cv.model.dto.CVEducation;
import com.example.demo.member.cv.model.dto.CVExperience;
import com.example.demo.member.cv.model.dto.CVLanguage;
import com.example.demo.member.cv.model.dto.CVMilitary;
import com.example.demo.member.cv.model.dto.CVOuter;
import com.example.demo.member.cv.model.dto.CVPortfolio;
import com.example.demo.member.cv.model.dto.CVQualify;
import com.example.demo.member.cv.model.dto.CVTraining;

@Mapper
public interface CVMapper {

	/** 이력서 주인 확인
	 * @param cvNo
	 * @param memNo
	 * @return
	 */
	int checkCVOwner(@Param("cvNo") int cvNo, @Param("memNo") String memNo);
	
	/** 이력서 리스트 조회
	 * @param memNo
	 * @return
	 */
	List<CV> selectCVList(String memNo);

	
	// 병역 -> 학력 -> 경력 -> 수상 -> 자격증 -> 어학 -> 대외활동 -> 교육이수 -> 포트폴리오
	
    // ==========================================
    // 조회(SELECT)
    // ==========================================
	/** 이력서 조회
	 * @param cvNo
	 * @return
	 */
	CV selectCV(int cvNo);
	
	CVMilitary selectMilitary(int cvNo);
	
	CVEducation selectEducation(int cvNo);
	
	List<CVExperience> selectExperience(int cvNo);
	
	List<CVAward> selectAward(int cvNo);
	
	List<CVQualify> selectQualify(int cvNo);
	
	List<CVLanguage> selectLanguage(int cvNo);
	
	List<CVOuter> selectOuter(int cvNo);
	
	List<CVTraining> selectTraining(int cvNo);
	
	List<CVPortfolio> selectPortfolio(int cvNo);
	
    // ==========================================
    // 추가(INSERT)
    // ==========================================
	/** 이력서 추가
	 * @param cv
	 */
	void addCV(CV cv);

	void addMilitary(CVMilitary military);

	void addEducation(CVEducation education);

	void addExperience(CVExperience experience);

	void addAward(CVAward award);

	void addQualify(CVQualify qualify);

	void addLanguage(CVLanguage language);

	void addOuter(CVOuter outer);

	void addTraining(CVTraining training);

	void addPortfolio(CVPortfolio portfolio);
	
    // ==========================================
    // 수정(UPDATE)
    // ==========================================
	/** 이력서 수정
	 * @param cv
	 */
	void updateCV(CV cv);

	void updateMilitary(CVMilitary military);

	void updateEducation(CVEducation education);

	void updateExperience(CVExperience experience);

	void updateAward(CVAward award);

	void updateQualify(CVQualify qualify);

	void updateLanguage(CVLanguage language);

	void updateOuter(CVOuter outer);

	void updateTraining(CVTraining training);

	void updatePortfolio(CVPortfolio portfolio);
	
	
    // ==========================================
    // 삭제(DELETE)
    // ==========================================
	/** 이력서 삭제
	 * @param cvNo
	 */
	void deleteCV(int cvNo);

	void deleteMilitary(int cvNo);

	void deleteEducation(int cvNo);

	void deleteExperience(int cvNo);

	void deleteAward(int cvNo);

	void deleteQualify(int cvNo);

	void deleteLanguage(int cvNo);

	void deleteOuter(int cvNo);

	void deleteTraining(int cvNo);

	void deletePortfolio(int cvNo);

	
	// 이력서 pdf 업로드
	void uploadCVPdf(RecruitCV recruitCV);

    /** 삭제 (ID 기준) */
    void deleteExperienceById(String expId);
    void deleteAwardById(String awardId);
    void deleteQualifyById(String qualifyId);
    void deleteLanguageById(String langId);
    void deleteOuterById(String outerId);
    void deleteTrainingById(String trainId);
    void deletePortfolioById(String portId);

    /** 신규 ID 시퀀스 채번 */
    int nextExpId();
    int nextAwardId();
    int nextQualifyId();
    int nextLangId();
    int nextOuterId();
    int nextTrainId();
    int nextPortId();



	
// 	// 회원번호(memNo)로 이력서 목록 조회
//     List<CV> selectCVList(@Param("memNo") String memNo);

    
//     void insertSubmitCV(@Param("memNo") String memNo, 
//             @Param("cvNo") int cvNo, 
//             @Param("recruitNo") int recruitNo);

}
