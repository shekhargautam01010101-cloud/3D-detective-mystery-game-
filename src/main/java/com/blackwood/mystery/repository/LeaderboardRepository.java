package com.blackwood.mystery.repository;
import com.blackwood.mystery.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry,Long> { List<LeaderboardEntry> findTop10ByOrderByScoreDescElapsedSecondsAsc(); }
