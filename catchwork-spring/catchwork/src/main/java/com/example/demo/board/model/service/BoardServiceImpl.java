package com.example.demo.board.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.board.model.dto.Board;
import com.example.demo.board.model.mapper.BoardMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardMapper boardMapper;

 

	/** 게시판 목록 조회
	 * @author BAEBAE
	 */
    @Override
    public List<Board> selectBoardList(String sort, String query) {
        switch (sort) {
            case "oldest":
                return boardMapper.selectBoardsByOldest(query);
            case "likes":
                return boardMapper.selectBoardsByLikes(query);
            case "comments":
                return boardMapper.selectBoardsByComments(query);
            case "latest":
            default:
                return boardMapper.selectBoardsByLatest(query);
        }
    }
}
