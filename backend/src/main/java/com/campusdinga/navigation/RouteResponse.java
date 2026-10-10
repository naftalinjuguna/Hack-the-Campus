package com.campusdinga.navigation;

import java.util.List;

public class RouteResponse {
    private String originName;
    private String destinationName;
    private int totalDistanceMeters;
    private int estimatedMinutes;
    private boolean stepFree;
    private String summaryVia;
    private List<RouteStep> steps;
    private List<double[]> pathCoordinates; // [lat, lng] array
    private boolean verifiedWalkingPath;

    public RouteResponse() {
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public int getTotalDistanceMeters() {
        return totalDistanceMeters;
    }

    public void setTotalDistanceMeters(int totalDistanceMeters) {
        this.totalDistanceMeters = totalDistanceMeters;
    }

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public boolean isStepFree() {
        return stepFree;
    }

    public void setStepFree(boolean stepFree) {
        this.stepFree = stepFree;
    }

    public String getSummaryVia() {
        return summaryVia;
    }

    public void setSummaryVia(String summaryVia) {
        this.summaryVia = summaryVia;
    }

    public List<RouteStep> getSteps() {
        return steps;
    }

    public void setSteps(List<RouteStep> steps) {
        this.steps = steps;
    }

    public List<double[]> getPathCoordinates() {
        return pathCoordinates;
    }

    public void setPathCoordinates(List<double[]> pathCoordinates) {
        this.pathCoordinates = pathCoordinates;
    }

    public boolean isVerifiedWalkingPath() {
        return verifiedWalkingPath;
    }

    public void setVerifiedWalkingPath(boolean verifiedWalkingPath) {
        this.verifiedWalkingPath = verifiedWalkingPath;
    }
}
