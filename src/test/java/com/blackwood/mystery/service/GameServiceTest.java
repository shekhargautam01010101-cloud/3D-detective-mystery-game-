package com.blackwood.mystery.service;

import com.blackwood.mystery.dto.ApiDtos.*;
import com.blackwood.mystery.exception.GameException;
import com.blackwood.mystery.model.*;
import com.blackwood.mystery.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GameServiceTest {
 UserRepository users; TokenRepository tokens; GameSessionRepository sessions; CollectedClueRepository clues; LeaderboardRepository board; GameSession session; AppUser player; GameService game;
 @BeforeEach void setup(){users=mock(UserRepository.class);tokens=mock(TokenRepository.class);sessions=mock(GameSessionRepository.class);clues=mock(CollectedClueRepository.class);board=mock(LeaderboardRepository.class);player=new AppUser("detective","hash");session=new GameSession(player);when(sessions.findById(anyString())).thenReturn(Optional.of(session));when(clues.findBySession_IdOrderByClueId(anyString())).thenReturn(new ArrayList<>());game=new GameService(users,tokens,sessions,clues,board,new BCryptPasswordEncoder(),new ScoringService());}
 private List<CollectedClue> collected(int... ids){List<CollectedClue> list=new ArrayList<>();for(int id:ids)list.add(new CollectedClue(session,id));return list;}
 private void withClues(int... ids){when(clues.findBySession_IdOrderByClueId(anyString())).thenReturn(collected(ids));}
 @Test void correctAccusationWins(){withClues(1,2,3,5);Object result=game.accuse(session.getId(),new AccuseRequest("karan",List.of(2,3)),player);assertTrue(result.toString().contains("WIN"));verify(board).save(any(LeaderboardEntry.class));}
 @Test void wrongSuspectConsumesChance(){withClues(1,2,3,4);Object result=game.accuse(session.getId(),new AccuseRequest("rahul",List.of(2,3)),player);assertTrue(result.toString().contains("WRONG"));assertEquals(2,session.getAttemptsLeft());}
 @Test void weakProofConsumesChance(){withClues(1,2,3,4);Object result=game.accuse(session.getId(),new AccuseRequest("karan",List.of(1,2)),player);assertTrue(result.toString().contains("WRONG"));}
 @Test void tooFewCluesRejected(){withClues(1,2,3);assertThrows(GameException.class,()->game.accuse(session.getId(),new AccuseRequest("karan",List.of(2,3)),player));}
 @Test void threeFailuresEndGame(){withClues(1,2,3,4,5);AccuseRequest wrong=new AccuseRequest("rahul",List.of(2,3));game.accuse(session.getId(),wrong,player);game.accuse(session.getId(),wrong,player);Object result=game.accuse(session.getId(),wrong,player);assertTrue(result.toString().contains("GAME_OVER"));assertEquals(0,session.getAttemptsLeft());}
}
