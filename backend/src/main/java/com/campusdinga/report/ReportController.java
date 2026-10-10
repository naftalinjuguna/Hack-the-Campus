package com.campusdinga.report;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportRepository reportRepository;

    public ReportController(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @GetMapping
    public ResponseEntity<List<LocationReport>> getReports(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(reportRepository.findByStatusIgnoreCase(status));
        }
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<LocationReport> submitReport(@RequestBody LocationReport report) {
        report.setStatus("OPEN");
        return ResponseEntity.status(HttpStatus.CREATED).body(reportRepository.save(report));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LocationReport> updateReportStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes) {
        LocationReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        report.setStatus(status);
        if (adminNotes != null) {
            report.setAdminNotes(adminNotes);
        }
        return ResponseEntity.ok(reportRepository.save(report));
    }
}
