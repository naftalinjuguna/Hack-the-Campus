package com.campusdinga.ai;

import com.campusdinga.location.Location;
import com.campusdinga.location.LocationRepository;
import com.campusdinga.service.CampusService;
import com.campusdinga.service.CampusServiceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final LocationRepository locationRepository;
    private final CampusServiceRepository serviceRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${campusdinga.anthropic.api-key:}")
    private String anthropicApiKey;

    @Value("${campusdinga.anthropic.model:claude-3-5-sonnet-20241022}")
    private String anthropicModel;

    public AiService(LocationRepository locationRepository, CampusServiceRepository serviceRepository) {
        this.locationRepository = locationRepository;
        this.serviceRepository = serviceRepository;
    }

    public ChatResponse processChatQuery(String query) {
        if (query == null || query.isBlank()) {
            ChatResponse empty = new ChatResponse();
            empty.setAnswer("Please enter a question about Maseno University locations, lecture venues, or services.");
            empty.setModelProvider("CampusDinga Assistant");
            empty.setAiGenerated(false);
            return empty;
        }

        // Retrieve candidate records from database
        List<Location> candidates = retrieveCandidateLocations(query);
        List<CampusService> candidateServices = retrieveCandidateServices(query);

        // Try Claude API if valid key is set
        if (anthropicApiKey != null && !anthropicApiKey.isBlank()) {
            try {
                ChatResponse claudeResponse = callClaudeApi(query, candidates);
                if (claudeResponse != null) {
                    return claudeResponse;
                }
            } catch (Exception e) {
                System.err.println("Anthropic API call failed, reverting to Grounded Fallback: " + e.getMessage());
            }
        }

        // Fallback to grounded campus engine
        return buildGroundedFallbackResponse(query, candidates, candidateServices);
    }

    private List<Location> retrieveCandidateLocations(String query) {
        String[] tokens = query.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        Set<Location> resultSet = new LinkedHashSet<>();

        for (String token : tokens) {
            if (token.length() > 2) {
                resultSet.addAll(locationRepository.searchLocations(token));
            }
        }

        if (resultSet.isEmpty()) {
            resultSet.addAll(locationRepository.findAll().stream().limit(6).collect(Collectors.toList()));
        }

        return new ArrayList<>(resultSet);
    }

    private List<CampusService> retrieveCandidateServices(String query) {
        String[] tokens = query.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        Set<CampusService> resultSet = new LinkedHashSet<>();
        for (String token : tokens) {
            if (token.length() > 2) {
                resultSet.addAll(serviceRepository.filterServices(token, null));
            }
        }
        return new ArrayList<>(resultSet);
    }

    private ChatResponse callClaudeApi(String query, List<Location> candidates) throws Exception {
        String url = "https://api.anthropic.com/v1/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", anthropicApiKey.trim());
        headers.set("anthropic-version", "2023-06-01");

        // Format candidate records concisely
        StringBuilder candidateContext = new StringBuilder();
        for (Location loc : candidates) {
            candidateContext.append(String.format("ID: %d | Name: %s | Block: %s | Room: %s | Facilities: %s | Hours: %s\n",
                    loc.getId(), loc.getName(), loc.getBuildingBlock(), loc.getRoomNumber(), loc.getAvailableFacilities(), loc.getOpeningHours()));
        }

        String systemPrompt = "You are CampusDinga AI, the official wayfinding assistant for Maseno University, Kenya. " +
                "Answer the user query solely based on the candidate database records below. Do not hallucinate coordinates, buildings, or hours. " +
                "If candidates do not answer the question, state that verified information was not found. " +
                "Candidate Locations:\n" + candidateContext.toString();

        Map<String, Object> messageBody = new HashMap<>();
        messageBody.put("role", "user");
        messageBody.put("content", query);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", anthropicModel);
        requestBody.put("max_tokens", 800);
        requestBody.put("system", systemPrompt);
        requestBody.put("messages", List.of(messageBody));

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode contentArr = root.path("content");
            if (contentArr.isArray() && contentArr.size() > 0) {
                String replyText = contentArr.get(0).path("text").asText();
                ChatResponse chatResponse = new ChatResponse();
                chatResponse.setAnswer(replyText);
                chatResponse.setModelProvider("Claude (" + anthropicModel + ")");
                chatResponse.setAiGenerated(true);
                chatResponse.setSuggestedLocations(candidates.stream().limit(3).collect(Collectors.toList()));
                chatResponse.setFollowUpQuestions(List.of(
                        "Where can I find step-free access?",
                        "What are the operating hours?",
                        "How long is the walk from Siriba Mess?"
                ));
                return chatResponse;
            }
        }
        return null;
    }

    private ChatResponse buildGroundedFallbackResponse(String query, List<Location> locations, List<CampusService> services) {
        ChatResponse resp = new ChatResponse();
        resp.setModelProvider("CampusDinga Grounded Engine (Local Fallback)");
        resp.setAiGenerated(false);

        String qLower = query.toLowerCase();

        if (qLower.contains("computer science") || qLower.contains("computing") || qLower.contains("lab 5")) {
            resp.setAnswer("The School of Computing & Informatics is located on Siriba Campus, Block B (1st Floor East). " +
                    "It houses Computer Laboratory 5 (Room B-104), student consultation suites, and departmental labs. " +
                    "Walking distance is approximately 320m (4 mins) via the central paved quadrangle.");
            resp.setSuggestedLocations(locations.stream()
                    .filter(l -> l.getName().toLowerCase().contains("computing") || l.getName().toLowerCase().contains("lab 5"))
                    .limit(2)
                    .collect(Collectors.toList()));
        } else if (qLower.contains("print") || qLower.contains("cyber") || qLower.contains("photocopy")) {
            resp.setAnswer("Printing, photocopying, and document binding services are available at the Main University Library " +
                    "Ground Floor Cyber Lab, as well as the Students' Centre shops opposite Siriba Mess. Operating hours are Mon–Fri 8:00 AM – 7:00 PM.");
            resp.setSuggestedLocations(locations.stream()
                    .filter(l -> l.getName().toLowerCase().contains("library") || l.getName().toLowerCase().contains("mess"))
                    .limit(2)
                    .collect(Collectors.toList()));
        } else if (qLower.contains("library") || qLower.contains("quiet study")) {
            resp.setAnswer("The Main University Library is located at the Central Quadrangle. It spans 3 floors with a 1,200-seat capacity, " +
                    "designated quiet study zones, e-resource portals, and full Wi-Fi coverage. It features step-free ramp access at the west entrance.");
            resp.setSuggestedLocations(locations.stream()
                    .filter(l -> l.getName().toLowerCase().contains("library"))
                    .limit(2)
                    .collect(Collectors.toList()));
        } else if (qLower.contains("health") || qLower.contains("dispensary") || qLower.contains("clinic") || qLower.contains("doctor")) {
            resp.setAnswer("The Maseno University Health Dispensary is situated near Hostel 8 along Hospital Road, next to Security Operations. " +
                    "It operates 24/7 for student outpatient and emergency medical services.");
            resp.setSuggestedLocations(locations.stream()
                    .filter(l -> l.getName().toLowerCase().contains("health"))
                    .limit(2)
                    .collect(Collectors.toList()));
        } else if (qLower.contains("mess") || qLower.contains("food") || qLower.contains("eat") || qLower.contains("cafeteria")) {
            resp.setAnswer("The Central Student Mess is located near the Students' Center, offering affordable breakfast, lunch, and dinner. " +
                    "Operating hours are daily 6:30 AM to 9:00 PM.");
            resp.setSuggestedLocations(locations.stream()
                    .filter(l -> l.getName().toLowerCase().contains("mess"))
                    .limit(2)
                    .collect(Collectors.toList()));
        } else if (!locations.isEmpty()) {
            Location top = locations.get(0);
            resp.setAnswer(String.format("Found verified campus venue: %s (%s). %s Facilities include: %s.",
                    top.getName(), top.getCampusArea(), top.getDescription(), top.getAvailableFacilities()));
            resp.setSuggestedLocations(locations.stream().limit(2).collect(Collectors.toList()));
        } else {
            resp.setAnswer("We searched the Maseno University GIS database, but found no verified location matching '" + query + "'. " +
                    "You can browse the Campus Directory or report a new location for review.");
            resp.setSuggestedLocations(Collections.emptyList());
        }

        resp.setFollowUpQuestions(List.of(
                "Where can I find step-free access?",
                "What are the operating hours?",
                "Show walking directions on the map"
        ));

        return resp;
    }
}
