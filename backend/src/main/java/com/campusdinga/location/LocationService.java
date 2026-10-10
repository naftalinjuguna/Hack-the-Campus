package com.campusdinga.location;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Optional<Location> getLocationById(Long id) {
        return locationRepository.findById(id);
    }

    public Optional<Location> getLocationBySlug(String slug) {
        return locationRepository.findBySlug(slug);
    }

    public List<Location> searchLocations(String query, Category category) {
        if ((query == null || query.isBlank()) && category == null) {
            return locationRepository.findAll();
        }
        return locationRepository.filterLocations(query, category);
    }

    public List<Location> getVerifiedLocations() {
        return locationRepository.findByVerificationStatus(VerificationStatus.VERIFIED);
    }

    @Transactional
    public Location saveLocation(Location location) {
        if (location.getSlug() == null || location.getSlug().isBlank()) {
            location.setSlug(generateSlug(location.getName()));
        }
        location.setUpdatedAt(LocalDateTime.now());
        return locationRepository.save(location);
    }

    @Transactional
    public Location updateVerification(Long id, VerificationStatus status, String notes) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
        location.setVerificationStatus(status);
        if (notes != null) {
            location.setVerificationNotes(notes);
        }
        location.setUpdatedAt(LocalDateTime.now());
        return locationRepository.save(location);
    }

    @Transactional
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
        String slug = base;
        int count = 1;
        while (locationRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + count++;
        }
        return slug;
    }
}
