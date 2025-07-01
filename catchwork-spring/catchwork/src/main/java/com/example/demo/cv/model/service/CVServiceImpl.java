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
@RequiredArgsConstructor
public class CVServiceImpl implements CVService {

	@Autowired
	private CVMapper mapper;

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
        if (cv.getExperienceList() != null) {
            for (CVExperience exp : cv.getExperienceList()) {
                exp.setCvNo(cvNo);
                mapper.addExperience(exp);
            }
        }

        // 5. Award
        if (cv.getAwardList() != null) {
            for (CVAward award : cv.getAwardList()) {
            	award.setCvNo(cvNo);
                mapper.addAward(award);
            }
        }

        // 6. Qualify
        if (cv.getQualifyList() != null) {
            for (CVQualify qualify : cv.getQualifyList()) {
            	qualify.setCvNo(cvNo);
                mapper.addQualify(qualify);
            }
        }

        // 7. Language
        if (cv.getLanguageList() != null) {
            for (CVLanguage lang : cv.getLanguageList()) {
            	lang.setCvNo(cvNo);
                mapper.addLanguage(lang);
            }
        }

        // 8. Outer
        if (cv.getOuterList() != null) {
            for (CVOuter outer : cv.getOuterList()) {
            	outer.setCvNo(cvNo);
                mapper.addOuter(outer);
            }
        }

        // 9. Training
        if (cv.getTrainingList() != null) {
            for (CVTraining train : cv.getTrainingList()) {
            	train.setCvNo(cvNo);
                mapper.addTraining(train);
            }
        }

        // 10. Portfolio
        if (cv.getPortfolioList() != null) {
            for (CVPortfolio port : cv.getPortfolioList()) {
            	port.setCvNo(cvNo);
                mapper.addPortfolio(port);
            }
        }
    }
}
// 	private final CVMapper mapper;
	
	
// 	@Override
// 	public void submitCV(String memNo, int cvNo, int recruitNo) {
// 		log.info("submitCV 서비스 호출 - memNo: {}, cvNo: {}, recruitNo: {}", memNo, cvNo, recruitNo);
// 		mapper.insertSubmitCV(memNo, cvNo, recruitNo);
// 	}

// }
