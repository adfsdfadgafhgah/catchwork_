package com.example.demo.board.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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



	/** 게시글 상세
	 * @author BAEBAE
	 */
	@Override
	@Transactional(readOnly = true)
	public Board selectBoardDetail(int boardNo, String memNo) {
		
		
		
		Board board = boardMapper.selectBoardDetail(boardNo);
	    if (board == null) return null;

	    // 좋아요 개수
	    int likeCount = boardMapper.selectLikeCount(boardNo);
	    board.setLikeCount(likeCount);

	    // 댓글 개수
	    int commentCount = boardMapper.selectCommentCount(boardNo);
	    board.setCommentCount(commentCount);

	    // 로그인 유저가 좋아요 눌렀는지 확인
	    if (memNo != null && !memNo.trim().isEmpty()) {
	        boolean liked = boardMapper.checkUserLiked(boardNo, memNo) > 0;
	        board.setLikedByCurrentUser(liked);
	    }
	    
	    System.out.println("▶ board.member.memNo = " + (board.getMember() != null ? board.getMember().getMemNo() : "null"));
		
		return board;
	}



	/** 게시글 수정
	 * @author BAEBAE
	 */
	@Override
	public int editBoard(Board board) {
		
		return boardMapper.editBoard(board);
	}
}
