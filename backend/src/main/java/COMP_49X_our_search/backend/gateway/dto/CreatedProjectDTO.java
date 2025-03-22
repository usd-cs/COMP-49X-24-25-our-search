package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class CreatedProjectDTO {

  private String title;
  private String description;
  private List<MajorDTO> majors;
  private List<String> researchPeriods;
  private String desiredQualifications;
  private List<String> umbrellaTopics;
  private boolean isActive;

  public CreatedProjectDTO() {}

  public CreatedProjectDTO(
      String title,
      String description,
      List<MajorDTO> majors,
      List<String> researchPeriods,
      String desiredQualifications,
      List<String> umbrellaTopics,
      boolean isActive) {
    this.title = title;
    this.description = description;
    this.majors = majors;
    this.researchPeriods = researchPeriods;
    this.desiredQualifications = desiredQualifications;
    this.umbrellaTopics = umbrellaTopics;
    this.isActive = isActive;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<MajorDTO> getMajors() {
    return majors;
  }

  public void setMajors(List<MajorDTO> majors) {
    this.majors = majors;
  }

  public List<String> getResearchPeriods() {
    return researchPeriods;
  }

  public void setResearchPeriods(List<String> researchPeriods) {
    this.researchPeriods = researchPeriods;
  }

  public String getDesiredQualifications() {
    return desiredQualifications;
  }

  public void setDesiredQualifications(String desiredQualifications) {
    this.desiredQualifications = desiredQualifications;
  }

  public List<String> getUmbrellaTopics() {
    return umbrellaTopics;
  }

  public void setUmbrellaTopics(List<String> umbrellaTopics) {
    this.umbrellaTopics = umbrellaTopics;
  }

  public boolean isActive() {
    return isActive;
  }

  public void setIsActive(boolean active) {
    isActive = active;
  }
}
