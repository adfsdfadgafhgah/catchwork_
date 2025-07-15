package com.example.demo.member.cv.model.service;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
import com.example.demo.member.cv.model.mapper.CVMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CVServiceImpl implements CVService {

	@Autowired
	private CVMapper mapper;

	// pdf 저장경로 생성
	@Value("${file.upload.cv-pdf-path}")
	private String uploadDir;


	// 이력서 pdf 업로드
	@Override
	public RecruitCV uploadCVPdf(MultipartFile file, int recruitCVEdu, int recruitCVCareer, String recruitCVPdfTitle,
			String memNo, int recruitNo) throws Exception {

		// 1. 저장경로 설정
		File dir = new File(uploadDir);
		if (!dir.exists())
			dir.mkdirs();

		// 2. 실제 저장 파일 경로
		String filePath = uploadDir + File.separator + recruitCVPdfTitle;

		// 3. 업로드된 파일 → 서버에 저장
		file.transferTo(new File(filePath));

		// 4. DTO 생성
		RecruitCV recruitCV = RecruitCV.builder()
				.recruitCVEdu(recruitCVEdu)
				.recruitCVCareer(recruitCVCareer)
				.recruitCVPdfTitle(recruitCVPdfTitle)
				.recruitCVPdfPath(filePath)
				.memNo(String.valueOf(memNo))
				.recruitNo(recruitNo)
				.build();

		// 5. Mapper 호출 → DB INSERT
		mapper.uploadCVPdf(recruitCV);

		return recruitCV;
	}
	
	// 이력서 주인 확인
	@Override
	public boolean isOwner(int cvNo, String memNo) {
		return mapper.checkCVOwner(cvNo, memNo) > 0;
	}

	// 이력서 리스트 조회
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
	    mapper.updateCV(cv);
	    int cvNo = cv.getCvNo();

	    // 단일 항목
	    if (cv.getMilitary() != null) {
	        cv.getMilitary().setCvNo(cvNo);
	        mapper.updateMilitary(cv.getMilitary());
	    }
	    if (cv.getEducation() != null) {
	        cv.getEducation().setCvNo(cvNo);
	        mapper.updateEducation(cv.getEducation());
	    }

	    // 다건 항목 전부 delete 후 insert
	    mapper.deleteExperience(cvNo);
	    mapper.deleteAward(cvNo);
	    mapper.deleteQualify(cvNo);
	    mapper.deleteLanguage(cvNo);
	    mapper.deleteOuter(cvNo);
	    mapper.deleteTraining(cvNo);
	    mapper.deletePortfolio(cvNo);

	    if (cv.getExperience() != null) {
	        for (CVExperience exp : cv.getExperience()) {
	            exp.setCvNo(cvNo);
	            mapper.addExperience(exp);
	        }
	    }
	    if (cv.getAward() != null) {
	        for (CVAward award : cv.getAward()) {
	            award.setCvNo(cvNo);
	            mapper.addAward(award);
	        }
	    }
	    if (cv.getQualify() != null) {
	        for (CVQualify qualify : cv.getQualify()) {
	            qualify.setCvNo(cvNo);
	            mapper.addQualify(qualify);
	        }
	    }
	    if (cv.getLanguage() != null) {
	        for (CVLanguage lang : cv.getLanguage()) {
	            lang.setCvNo(cvNo);
	            mapper.addLanguage(lang);
	        }
	    }
	    if (cv.getOuter() != null) {
	        for (CVOuter outer : cv.getOuter()) {
	            outer.setCvNo(cvNo);
	            mapper.addOuter(outer);
	        }
	    }
	    if (cv.getTraining() != null) {
	        for (CVTraining train : cv.getTraining()) {
	            train.setCvNo(cvNo);
	            mapper.addTraining(train);
	        }
	    }
	    if (cv.getPortfolio() != null) {
	        for (CVPortfolio port : cv.getPortfolio()) {
	            port.setCvNo(cvNo);
	            mapper.addPortfolio(port);
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

	
	// ---- 수정 시 컴포넌트 추가/삭제 ----
	
	// EXPERIENCE
	private void deleteAndUpsertExperience(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedExperienceIds() != null) {
	        for (String id : cv.getDeletedExperienceIds()) {
	            mapper.deleteExperienceById(id);
	        }
	    }

	    if (cv.getExperience() != null) {
	        for (CVExperience exp : cv.getExperience()) {
	            exp.setCvNo(cvNo);
	            if (exp.getExpId() != null) {
	                mapper.updateExperience(exp);
	            } else {
	                int newId = mapper.nextExpId();
	                exp.setExpId(String.valueOf(newId));
	                mapper.addExperience(exp);
	            }
	        }
	    }
	}

	// AWARD
	private void deleteAndUpsertAward(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedAwardIds() != null) {
	        for (String id : cv.getDeletedAwardIds()) {
	            mapper.deleteAwardById(id);
	        }
	    }

	    if (cv.getAward() != null) {
	        for (CVAward award : cv.getAward()) {
	            award.setCvNo(cvNo);
	            if (award.getAwardId() != null) {
	                mapper.updateAward(award);
	            } else {
	                int newId = mapper.nextAwardId();
	                award.setAwardId(String.valueOf(newId));
	                mapper.addAward(award);
	            }
	        }
	    }
	}

	// QUALIFY
	private void deleteAndUpsertQualify(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedQualifyIds() != null) {
	        for (String id : cv.getDeletedQualifyIds()) {
	            mapper.deleteQualifyById(id);
	        }
	    }

	    if (cv.getQualify() != null) {
	        for (CVQualify qualify : cv.getQualify()) {
	            qualify.setCvNo(cvNo);
	            if (qualify.getQualifyId() != null) {
	                mapper.updateQualify(qualify);
	            } else {
	                int newId = mapper.nextQualifyId();
	                qualify.setQualifyId(String.valueOf(newId));
	                mapper.addQualify(qualify);
	            }
	        }
	    }
	}

	// LANGUAGE
	private void deleteAndUpsertLanguage(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedLanguageIds() != null) {
	        for (String id : cv.getDeletedLanguageIds()) {
	            mapper.deleteLanguageById(id);
	        }
	    }

	    if (cv.getLanguage() != null) {
	        for (CVLanguage lang : cv.getLanguage()) {
	            lang.setCvNo(cvNo);
	            if (lang.getLangId() != null) {
	                mapper.updateLanguage(lang);
	            } else {
	                int newId = mapper.nextLangId();
	                lang.setLangId(String.valueOf(newId));
	                mapper.addLanguage(lang);
	            }
	        }
	    }
	}

	// OUTER
	private void deleteAndUpsertOuter(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedOuterIds() != null) {
	        for (String id : cv.getDeletedOuterIds()) {
	            mapper.deleteOuterById(id);
	        }
	    }

	    if (cv.getOuter() != null) {
	        for (CVOuter outer : cv.getOuter()) {
	            outer.setCvNo(cvNo);
	            if (outer.getOuterId() != null) {
	                mapper.updateOuter(outer);
	            } else {
	                int newId = mapper.nextOuterId();
	                outer.setOuterId(String.valueOf(newId));
	                mapper.addOuter(outer);
	            }
	        }
	    }
	}

	// TRAINING
	private void deleteAndUpsertTraining(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedTrainingIds() != null) {
	        for (String id : cv.getDeletedTrainingIds()) {
	            mapper.deleteTrainingById(id);
	        }
	    }

	    if (cv.getTraining() != null) {
	        for (CVTraining train : cv.getTraining()) {
	            train.setCvNo(cvNo);
	            if (train.getTrainId() != null) {
	                mapper.updateTraining(train);
	            } else {
	                int newId = mapper.nextTrainId();
	                train.setTrainId(String.valueOf(newId));
	                mapper.addTraining(train);
	            }
	        }
	    }
	}

	// PORTFOLIO
	private void deleteAndUpsertPortfolio(CV cv) {
	    int cvNo = cv.getCvNo();

	    if (cv.getDeletedPortfolioIds() != null) {
	        for (String id : cv.getDeletedPortfolioIds()) {
	            mapper.deletePortfolioById(id);
	        }
	    }

	    if (cv.getPortfolio() != null) {
	        for (CVPortfolio port : cv.getPortfolio()) {
	            port.setCvNo(cvNo);
	            if (port.getPortId() != null) {
	                mapper.updatePortfolio(port);
	            } else {
	                int newId = mapper.nextPortId();
	                port.setPortId(String.valueOf(newId));
	                mapper.addPortfolio(port);
	            }
	        }
	    }
	}


}
