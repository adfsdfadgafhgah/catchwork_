package com.example.demo.cv.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.example.demo.cv.model.mapper.CVMapper;

import lombok.RequiredArgsConstructor;

import com.example.demo.cv.model.mapper.CVMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class CVServiceImpl implements CVService {

	@Autowired
	private CVMapper mapper;

	// 이력서 주인 확인
	@Override
	public boolean isOwner(int cvNo, String memNo) {
		return mapper.checkCVOwner(cvNo, memNo) > 0;
	}

    @Override
    public List<CV> selectCVList(String memNo) {
        return mapper.selectCVList(memNo);
    }
    
	// 이력서 조회
	@Override
	public CV selectCV(int cvNo) {

		CV cv = mapper.selectCV(cvNo);

		if (cv != null) {
			cv.setMilitary(mapper.selectMilitary(cvNo));
			cv.setEducation(mapper.selectEducation(cvNo));
			cv.setExperience(mapper.selectExperience(cvNo));
			cv.setAward(mapper.selectAward(cvNo));
			cv.setQualify(mapper.selectQualify(cvNo));
			cv.setLanguage(mapper.selectLanguage(cvNo));
			cv.setOuter(mapper.selectOuter(cvNo));
			cv.setTraining(mapper.selectTraining(cvNo));
			cv.setPortfolio(mapper.selectPortfolio(cvNo));
		}

		return cv;
	}

	// 이력서 추가
	@Override
	@Transactional
	public void addCV(CV cv) throws Exception {

		// 1. CV add
		mapper.addCV(cv);
		int cvNo = cv.getCvNo();

		// 2. Military
		CVMilitary military = cv.getMilitary();
		if (military != null) {
			military.setCvNo(cvNo);
			mapper.addMilitary(military);
		}

		// 3. Education
		CVEducation edu = cv.getEducation();
		if (edu != null) {
			edu.setCvNo(cvNo);
			mapper.addEducation(edu);
		}

		// 4. Experience
		if (cv.getExperience() != null) {
			for (CVExperience exp : cv.getExperience()) {
				exp.setCvNo(cvNo);
				mapper.addExperience(exp);
			}
		}

		// 5. Award
		if (cv.getAward() != null) {
			for (CVAward award : cv.getAward()) {
				award.setCvNo(cvNo);
				mapper.addAward(award);
			}
		}

		// 6. Qualify
		if (cv.getQualify() != null) {
			for (CVQualify qualify : cv.getQualify()) {
				qualify.setCvNo(cvNo);
				mapper.addQualify(qualify);
			}
		}

		// 7. Language
		if (cv.getLanguage() != null) {
			for (CVLanguage lang : cv.getLanguage()) {
				lang.setCvNo(cvNo);
				mapper.addLanguage(lang);
			}
		}

		// 8. Outer
		if (cv.getOuter() != null) {
			for (CVOuter outer : cv.getOuter()) {
				outer.setCvNo(cvNo);
				mapper.addOuter(outer);
			}
		}

		// 9. Training
		if (cv.getTraining() != null) {
			for (CVTraining train : cv.getTraining()) {
				train.setCvNo(cvNo);
				mapper.addTraining(train);
			}
		}

		// 10. Portfolio
		if (cv.getPortfolio() != null) {
			for (CVPortfolio port : cv.getPortfolio()) {
				port.setCvNo(cvNo);
				mapper.addPortfolio(port);
			}
		}
	}

	// 이력서 수정
	@Override
	@Transactional
	public void updateCV(CV cv) throws Exception {

		// 1. CV 업데이트
		mapper.updateCV(cv);

		int cvNo = cv.getCvNo();

		// 2. Military (단일)
		CVMilitary military = cv.getMilitary();
		if (military != null) {
			military.setCvNo(cvNo);
			mapper.updateMilitary(military);
		}

		// 3. Education (단일)
		CVEducation edu = cv.getEducation();
		if (edu != null) {
			edu.setCvNo(cvNo);
			mapper.updateEducation(edu);
		}

		// 4. 나머지 다 update
		// 경험, 자격, 수상 등 리스트도 update 해줘야 함
		// 기존 delete 후 insert 방식도 가능 (주로 쓰는 방법)

		if (cv.getExperience() != null) {
			for (CVExperience exp : cv.getExperience()) {
				exp.setCvNo(cvNo);
				mapper.updateExperience(exp);
			}
		}

		if (cv.getAward() != null) {
			for (CVAward award : cv.getAward()) {
				award.setCvNo(cvNo);
				mapper.updateAward(award);
			}
		}

		if (cv.getQualify() != null) {
			for (CVQualify qualify : cv.getQualify()) {
				qualify.setCvNo(cvNo);
				mapper.updateQualify(qualify);
			}
		}

		if (cv.getLanguage() != null) {
			for (CVLanguage lang : cv.getLanguage()) {
				lang.setCvNo(cvNo);
				mapper.updateLanguage(lang);
			}
		}

		if (cv.getOuter() != null) {
			for (CVOuter outer : cv.getOuter()) {
				outer.setCvNo(cvNo);
				mapper.updateOuter(outer);
			}
		}

		if (cv.getTraining() != null) {
			for (CVTraining train : cv.getTraining()) {
				train.setCvNo(cvNo);
				mapper.updateTraining(train);
			}
		}

		if (cv.getPortfolio() != null) {
			for (CVPortfolio port : cv.getPortfolio()) {
				port.setCvNo(cvNo);
				mapper.updatePortfolio(port);
			}
		}
	}

	// 이력서 삭제
	@Override
	@Transactional
	public void deleteCV(int cvNo) throws Exception {
		// 자식 테이블 삭제 (외래키 제약 있으니까 순서 중요)
		mapper.deleteExperience(cvNo);
		mapper.deleteAward(cvNo);
		mapper.deleteQualify(cvNo);
		mapper.deleteLanguage(cvNo);
		mapper.deleteOuter(cvNo);
		mapper.deleteTraining(cvNo);
		mapper.deletePortfolio(cvNo);
		mapper.deleteMilitary(cvNo);
		mapper.deleteEducation(cvNo);

		// 부모 테이블 CV 삭제
		mapper.deleteCV(cvNo);
	}

}
// 	private final CVMapper mapper;

// 	@Override
// 	public void submitCV(String memNo, int cvNo, int recruitNo) {
// 		log.info("submitCV 서비스 호출 - memNo: {}, cvNo: {}, recruitNo: {}", memNo, cvNo, recruitNo);
// 		mapper.insertSubmitCV(memNo, cvNo, recruitNo);
// 	}

// }
