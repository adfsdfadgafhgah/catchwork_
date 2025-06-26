package com.example.demo.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.board.model.dto.Board;

@Mapper
public interface BoardMapper {

	/** 게시판 목록 조회
	 * @author BAEBAE
	 * @param query
	 * @return
	 */
	List<Board> selectBoardsByLatest(String query);

	List<Board> selectBoardsByOldest(String query);

	List<Board> selectBoardsByLikes(String query);

	List<Board> selectBoardsByComments(String query);

}
