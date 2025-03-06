package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class ProjectDTO {
  private int id;
  private String name;
  private String description;
  private String desiredQualifications;
  private List<String> umbrellaTopics;
  private List<String> researchPeriods;
  private boolean isActive;
  private List<String> majors;
  private FacultyDTO faculty;

  public ProjectDTO() {}

  public ProjectDTO(String name, String description,
      String desiredQualifications, List<String> umbrellaTopics,
      List<String> researchPeriods, boolean isActive, List<String> majors) {
    this.name = name;
    this.description = description;
    this.desiredQualifications = desiredQualifications;
    this.umbrellaTopics = umbrellaTopics;
    this.researchPeriods = researchPeriods;
    this.isActive = isActive;
    this.majors = majors;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
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

  public List<String> getResearchPeriods() {
    return researchPeriods;
  }

  public void setResearchPeriods(List<String> researchPeriods) {
    this.researchPeriods = researchPeriods;
  }

  public boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(boolean isActive) {
    this.isActive = isActive;
  }

  public List<String> getMajors() {
    return majors;
  }

  public void setMajors(List<String> majors) {
    this.majors = majors;
  }

  public FacultyDTO getFaculty() {
    return faculty;
  }

  public void setFaculty(FacultyDTO faculty) {
    this.faculty = faculty;
  }
}
