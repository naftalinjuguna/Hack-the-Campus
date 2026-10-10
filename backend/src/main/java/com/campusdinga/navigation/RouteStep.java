package com.campusdinga.navigation;

public class RouteStep {
    private int stepNumber;
    private String instruction;
    private String detail;
    private int distanceMeters;
    private boolean completed;

    public RouteStep() {
    }

    public RouteStep(int stepNumber, String instruction, String detail, int distanceMeters) {
        this.stepNumber = stepNumber;
        this.instruction = instruction;
        this.detail = detail;
        this.distanceMeters = distanceMeters;
    }

    public int getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(int stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public int getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(int distanceMeters) {
        this.distanceMeters = distanceMeters;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
