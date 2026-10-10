package com.campusdinga.location;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<List<Location>> getLocations(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Category category) {
        return ResponseEntity.ok(locationService.searchLocations(q, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        return locationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Location> getLocationBySlug(@PathVariable String slug) {
        return locationService.getLocationBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<Location>> getVerifiedLocations() {
        return ResponseEntity.ok(locationService.getVerifiedLocations());
    }

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        return ResponseEntity.status(HttpStatus.CREATED).body(locationService.saveLocation(location));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        location.setId(id);
        return ResponseEntity.ok(locationService.saveLocation(location));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/verification")
    public ResponseEntity<Location> updateVerification(
            @PathVariable Long id,
            @RequestParam VerificationStatus status,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(locationService.updateVerification(id, status, notes));
    }
}
