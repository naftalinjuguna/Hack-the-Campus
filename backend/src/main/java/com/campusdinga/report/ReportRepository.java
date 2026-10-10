package com.campusdinga.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<LocationReport, Long> {

    List<LocationReport> findByStatusIgnoreCase(String status);

    long countByStatusIgnoreCase(String status);
}
