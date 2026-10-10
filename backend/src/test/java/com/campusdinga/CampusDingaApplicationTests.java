package com.campusdinga;

import com.campusdinga.ai.AiService;
import com.campusdinga.ai.ChatResponse;
import com.campusdinga.location.Category;
import com.campusdinga.location.Location;
import com.campusdinga.location.LocationService;
import com.campusdinga.navigation.NavigationService;
import com.campusdinga.navigation.RouteResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CampusDingaApplicationTests {

    @Autowired
    private LocationService locationService;

    @Autowired
    private NavigationService navigationService;

    @Autowired
    private AiService aiService;

    @Test
    void contextLoads() {
        assertNotNull(locationService);
        assertNotNull(navigationService);
        assertNotNull(aiService);
    }

    @Test
    void testLocationRetrievalAndSearch() {
        List<Location> all = locationService.getAllLocations();
        assertFalse(all.isEmpty(), "Locations should be seeded");

        List<Location> searchResult = locationService.searchLocations("Computer", null);
        assertFalse(searchResult.isEmpty(), "Should find Computer Lab or School of Computing");

        List<Location> filteredByCategory = locationService.searchLocations(null, Category.COMPUTER_LAB);
        assertFalse(filteredByCategory.isEmpty(), "Should find Computer Lab category");
        assertEquals(Category.COMPUTER_LAB, filteredByCategory.get(0).getCategory());
    }

    @Test
    void testNavigationRouteCalculation() {
        RouteResponse route = navigationService.calculateDirections(null, null, true);
        assertNotNull(route);
        assertTrue(route.getTotalDistanceMeters() > 0);
        assertTrue(route.getEstimatedMinutes() > 0);
        assertFalse(route.getSteps().isEmpty());
        assertFalse(route.getPathCoordinates().isEmpty());
    }

    @Test
    void testAiAssistantGroundedFallback() {
        ChatResponse resp = aiService.processChatQuery("Where is the Computer Science department?");
        assertNotNull(resp);
        assertNotNull(resp.getAnswer());
        assertFalse(resp.getAnswer().isBlank());
        assertTrue(resp.getAnswer().contains("Computing") || resp.getAnswer().contains("Siriba"));
        assertNotNull(resp.getModelProvider());
    }
}
