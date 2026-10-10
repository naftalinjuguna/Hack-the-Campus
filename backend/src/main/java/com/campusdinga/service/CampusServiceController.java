package com.campusdinga.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class CampusServiceController {

    private final CampusServiceRepository serviceRepository;

    public CampusServiceController(CampusServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public ResponseEntity<List<CampusService>> getServices(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
        if ((q == null || q.isBlank()) && (category == null || category.isBlank())) {
            return ResponseEntity.ok(serviceRepository.findAll());
        }
        return ResponseEntity.ok(serviceRepository.filterServices(q, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampusService> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CampusService> createService(@RequestBody CampusService service) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceRepository.save(service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
