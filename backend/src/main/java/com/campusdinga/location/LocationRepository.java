package com.campusdinga.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    Optional<Location> findBySlug(String slug);

    List<Location> findByCategory(Category category);

    List<Location> findByVerificationStatus(VerificationStatus status);

    @Query("SELECT l FROM Location l WHERE " +
           "LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.buildingBlock) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.roomNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.availableFacilities) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Location> searchLocations(@Param("query") String query);

    @Query("SELECT l FROM Location l WHERE " +
           "(:category IS NULL OR l.category = :category) AND " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(l.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(l.buildingBlock) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(l.roomNumber) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Location> filterLocations(@Param("query") String query, @Param("category") Category category);

    long countByVerificationStatus(VerificationStatus status);
}
