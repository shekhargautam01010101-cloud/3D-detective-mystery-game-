package com.blackwood.mystery.service;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class ScoringServiceTest {
 private final ScoringService service=new ScoringService();
 @Test void calculatesScoreAndPenalties(){assertEquals(1040,service.score(100,1,1,6));}
 @Test void assignsRanks(){assertEquals("Master Detective",service.rank(1100));assertEquals("Detective",service.rank(800));assertEquals("Rookie",service.rank(799));}
}
