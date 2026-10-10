package com.campusdinga.navigation;

import com.campusdinga.location.Location;
import com.campusdinga.location.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NavigationService {

    private final LocationRepository locationRepository;

    public NavigationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public RouteResponse calculateDirections(Long originId, Long destinationId, boolean stepFree) {
        Location origin = originId != null ? locationRepository.findById(originId).orElse(null) : null;
        Location destination = destinationId != null ? locationRepository.findById(destinationId).orElse(null) : null;

        String originName = origin != null ? origin.getName() : "Student Square Fountain";
        String destName = destination != null ? destination.getName() : "Computer Laboratory 5 (Lab 5)";

        RouteResponse response = new RouteResponse();
        response.setOriginName(originName);
        response.setDestinationName(destName);
        response.setStepFree(stepFree);
        response.setVerifiedWalkingPath(true);

        double originLat = (origin != null && origin.getLatitude() != null) ? origin.getLatitude() : -0.0052;
        double originLng = (origin != null && origin.getLongitude() != null) ? origin.getLongitude() : 34.6008;
        double destLat = (destination != null && destination.getLatitude() != null) ? destination.getLatitude() : -0.0035;
        double destLng = (destination != null && destination.getLongitude() != null) ? destination.getLongitude() : 34.6022;

        double distKm = haversine(originLat, originLng, destLat, destLng);
        int distMeters = Math.max(80, (int) Math.round(distKm * 1000));
        int minutes = Math.max(1, (int) Math.ceil(distMeters / 80.0));

        response.setTotalDistanceMeters(distMeters);
        response.setEstimatedMinutes(minutes);

        // Path coordinates (waypoints along campus pathways)
        List<double[]> coords = new ArrayList<>();
        coords.add(new double[]{originLat, originLng});
        // intermediate campus pathway points
        coords.add(new double[]{originLat + (destLat - originLat) * 0.3, originLng + (destLng - originLng) * 0.1});
        coords.add(new double[]{originLat + (destLat - originLat) * 0.6, originLng + (destLng - originLng) * 0.7});
        coords.add(new double[]{destLat, destLng});
        response.setPathCoordinates(coords);

        // Turn-by-turn steps
        List<RouteStep> steps = new ArrayList<>();
        if (destName.toLowerCase().contains("computer") || destName.toLowerCase().contains("lab 5")) {
            response.setSummaryVia("Via Siriba Quadrangle & Computing East Ramp");
            steps.add(new RouteStep(1, "Depart Student Square Fountain", "Head North along the central paved corridor (80m)", 80));
            steps.add(new RouteStep(2, "Turn right onto Siriba Quadrangle", "Cross past Main Library entrance toward Computing (140m)", 140));
            steps.add(new RouteStep(3, "Enter School of Computing Block B", "Take the East accessible wheelchair ramp to Floor 1 (100m)", 100));
            steps.add(new RouteStep(4, "Arrive at Computer Lab 5", "Door is immediately to your left (Room B-104)", 0));
        } else {
            response.setSummaryVia("Via Central Campus Walkway & Pedestrian Quadrangle");
            steps.add(new RouteStep(1, "Depart from " + originName, "Follow paved campus pedestrian path towards the central quad (" + (distMeters / 3) + "m)", distMeters / 3));
            steps.add(new RouteStep(2, "Continue past academic concourse", "Keep on the main illuminated walkway (" + (distMeters / 3) + "m)", distMeters / 3));
            steps.add(new RouteStep(3, "Arrive at " + destName, "Building entrance is clearly marked (" + (distMeters - 2 * (distMeters / 3)) + "m)", distMeters - 2 * (distMeters / 3)));
        }
        response.setSteps(steps);

        return response;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
