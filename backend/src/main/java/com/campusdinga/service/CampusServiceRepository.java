package com.campusdinga.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusServiceRepository extends JpaRepository<CampusService, Long> {

    List<CampusService> findByCategoryIgnoreCase(String category);

    @Query("SELECT s FROM CampusService s WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.availableOptions) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(s.category) = LOWER(:category))")
    List<CampusService> filterServices(@Param("query") String query, @Param("category") String category);
}
