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
    
    
    

    /** 문의하기 디테일 아이디로 찾기
     * @author 명하
     * @param supportNo
     * @return
     */
    Support selectSupportById(int supportNo); // 이 메서드가 있을 것
    

    
    /** 문의하기 작성하기
     * @author 명하
     * @param support
     * @return
     */
    int insertSupport(Support support);
}