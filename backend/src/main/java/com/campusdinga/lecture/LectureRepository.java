package com.campusdinga.lecture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {

    List<Lecture> findByDayOfWeekIgnoreCase(String dayOfWeek);

    @Query("SELECT l FROM Lecture l WHERE " +
           "LOWER(l.unitCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.unitName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.lecturer) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Lecture> searchLectures(@Param("query") String query);

    @Query("SELECT l FROM Lecture l WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(l.unitCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(l.unitName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(l.lecturer) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:day IS NULL OR :day = '' OR LOWER(l.dayOfWeek) = LOWER(:day))")
    List<Lecture> filterLectures(@Param("query") String query, @Param("day") String day);
}
