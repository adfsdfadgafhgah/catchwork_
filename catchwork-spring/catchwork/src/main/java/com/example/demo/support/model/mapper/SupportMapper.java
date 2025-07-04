package com.example.demo.support.model.mapper;

import java.util.List;
import com.example.demo.support.model.dto.Support;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper  // 이 어노테이션 꼭 필요
public interface SupportMapper {
	

    /** 문의하기 리스트
     * @author 명하
     * @return
     */
    List<Support> selectSupportList(); // 전체 문의 보기
    
    
    /** 내가 작성한 문의
     * @author 명하
     * @param memNo
     * @return
     */
    List<Support> selectSupportListByMemNo(String memNo);
    

    /** 문의하기 디테일 아이디로 찾기
     * @author 명하
     * @param supportNo
     * @return
     */
    Support selectSupportById(int supportNo);
    

    
    /** 문의하기 작성하기
     * @author 명하
     * @param support
     * @return
     */
    int insertSupport(Support support);
}