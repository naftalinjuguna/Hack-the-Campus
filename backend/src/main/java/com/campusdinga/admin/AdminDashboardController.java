package com.campusdinga.admin;

import com.campusdinga.lecture.LectureRepository;
import com.campusdinga.location.LocationRepository;
import com.campusdinga.location.VerificationStatus;
import com.campusdinga.report.ReportRepository;
import com.campusdinga.service.CampusServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final LocationRepository locationRepository;
    private final ReportRepository reportRepository;
    private final LectureRepository lectureRepository;
    private final CampusServiceRepository serviceRepository;

    public AdminDashboardController(LocationRepository locationRepository,
                                    ReportRepository reportRepository,
                                    LectureRepository lectureRepository,
                                    CampusServiceRepository serviceRepository) {
        this.locationRepository = locationRepository;
        this.reportRepository = reportRepository;
        this.lectureRepository = lectureRepository;
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalLocations = locationRepository.count();
        long verifiedLocations = locationRepository.countByVerificationStatus(VerificationStatus.VERIFIED);
        long unverifiedLocations = locationRepository.countByVerificationStatus(VerificationStatus.UNVERIFIED_DEMO);
        long pendingLocations = locationRepository.countByVerificationStatus(VerificationStatus.PENDING_REVIEW);
        long openReports = reportRepository.countByStatusIgnoreCase("OPEN");
        long resolvedReports = reportRepository.countByStatusIgnoreCase("RESOLVED");
        long totalLectures = lectureRepository.count();
        long totalServices = serviceRepository.count();

        stats.put("totalLocations", totalLocations);
        stats.put("verifiedLocations", verifiedLocations);
        stats.put("unverifiedLocations", unverifiedLocations);
        stats.put("pendingReviewLocations", pendingLocations);
        stats.put("openReports", openReports);
        stats.put("resolvedReports", resolvedReports);
        stats.put("totalLectures", totalLectures);
        stats.put("totalServices", totalServices);

        return ResponseEntity.ok(stats);
    }
}
