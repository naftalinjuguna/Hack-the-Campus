package com.campusdinga.ai;

import com.campusdinga.location.Location;
import java.util.List;

public class ChatResponse {
    private String answer;
    private String modelProvider; // e.g. "Claude (Anthropic)" or "CampusDinga Grounded Engine (Local Fallback)"
    private boolean isAiGenerated;
    private List<Location> suggestedLocations;
    private List<String> followUpQuestions;

    public ChatResponse() {
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getModelProvider() {
        return modelProvider;
    }

    public void setModelProvider(String modelProvider) {
        this.modelProvider = modelProvider;
    }

    public boolean isAiGenerated() {
        return isAiGenerated;
    }

    public void setAiGenerated(boolean aiGenerated) {
        isAiGenerated = aiGenerated;
    }

    public List<Location> getSuggestedLocations() {
        return suggestedLocations;
    }

    public void setSuggestedLocations(List<Location> suggestedLocations) {
        this.suggestedLocations = suggestedLocations;
    }

    public List<String> getFollowUpQuestions() {
        return followUpQuestions;
    }

    public void setFollowUpQuestions(List<String> followUpQuestions) {
        this.followUpQuestions = followUpQuestions;
    }
}
