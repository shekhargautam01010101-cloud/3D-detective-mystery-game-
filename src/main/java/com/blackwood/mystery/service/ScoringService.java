package com.blackwood.mystery.service;
import com.blackwood.mystery.model.LeaderboardEntry;
import org.springframework.stereotype.Service;
@Service
public class ScoringService {
 public int score(long seconds,int wrong,int hints,int clues){return Math.max(0,1000-(int)Math.min(1000,seconds/10)-150*wrong-50*hints+50*clues);}
 public String rank(int score){if(score>=1100)return "Master Detective";if(score>=800)return "Detective";return "Rookie";}
 public LeaderboardEntry entry(String name,long seconds,int wrong,int hints,int clues){int value=score(seconds,wrong,hints,clues);return new LeaderboardEntry(name,value,rank(value),seconds);}
}
