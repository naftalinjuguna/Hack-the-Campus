package com.campusdinga.navigation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/navigation")
public class NavigationController {

    private final NavigationService navigationService;

    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping("/directions")
    public ResponseEntity<RouteResponse> getDirections(
            @RequestParam(required = false) Long originId,
            @RequestParam(required = false) Long destinationId,
            @RequestParam(defaultValue = "true") boolean stepFree) {
        return ResponseEntity.ok(navigationService.calculateDirections(originId, destinationId, stepFree));
    }
}
