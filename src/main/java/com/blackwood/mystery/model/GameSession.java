package com.blackwood.mystery.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="game_sessions")
public class GameSession {
 @Id private String id;
 @ManyToOne(optional=false) private AppUser player;
 @Column(nullable=false) private Instant startedAt;
 private Instant lastProgressAt;
 private int attemptsLeft=3;
 private int hintsUsed=0;
 private int wrongAccusations=0;
 @Column(nullable=false) private String status="IN_PROGRESS";
 // Reserved association point for a future multiplayer/team-room feature.
 private String teamRoomId;
 protected GameSession() {}
 public GameSession(AppUser player){this.id=UUID.randomUUID().toString();this.player=player;this.startedAt=Instant.now();this.lastProgressAt=startedAt;}
 public String getId(){return id;} public AppUser getPlayer(){return player;} public Instant getStartedAt(){return startedAt;} public Instant getLastProgressAt(){return lastProgressAt;} public int getAttemptsLeft(){return attemptsLeft;} public int getHintsUsed(){return hintsUsed;} public int getWrongAccusations(){return wrongAccusations;} public String getStatus(){return status;}
 public void progress(){lastProgressAt=Instant.now();} public void useHint(){hintsUsed++;progress();} public void wrongGuess(){wrongAccusations++;attemptsLeft--;progress();if(attemptsLeft<=0)status="GAME_OVER";} public void win(){status="WON";progress();} public long elapsedSeconds(){return Math.max(0,java.time.Duration.between(startedAt,Instant.now()).toSeconds());}
}
@Entity @Table(name="collected_clues", uniqueConstraints=@UniqueConstraint(columnNames={"session_id","clue_id"}))
class CollectedClue {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) @JoinColumn(name="session_id") private GameSession session;
 @Column(name="clue_id",nullable=false) private Integer clueId;
 @Column(nullable=false) private Instant collectedAt=Instant.now();
 protected CollectedClue() {}
 CollectedClue(GameSession session,int clueId){this.session=session;this.clueId=clueId;}
 int getClueId(){return clueId;}
}
@Entity @Table(name="leaderboard_entries")
public class LeaderboardEntry {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String playerName;
 @Column(nullable=false) private int score;
 @Column(nullable=false) private String rankTitle;
 @Column(nullable=false) private long elapsedSeconds;
 protected LeaderboardEntry() {}
 public LeaderboardEntry(String playerName,int score,String rankTitle,long elapsedSeconds){this.playerName=playerName;this.score=score;this.rankTitle=rankTitle;this.elapsedSeconds=elapsedSeconds;}
 public Long getId(){return id;} public String getPlayerName(){return playerName;} public int getScore(){return score;} public String getRankTitle(){return rankTitle;} public long getElapsedSeconds(){return elapsedSeconds;}
}
