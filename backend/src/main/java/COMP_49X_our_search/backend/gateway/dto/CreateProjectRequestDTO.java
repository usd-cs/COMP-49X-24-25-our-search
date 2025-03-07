package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class CreateProjectRequestDTO {

  private String title;
  private String description;
  private List<DisciplineDTO> disciplines;
  private List<ResearchPeriodDTO> researchPeriods;
  private String desiredQualifications;
  private List<UmbrellaTopicDTO> umbrellaTopics;
  private boolean isActive;

  public CreateProjectRequestDTO() {}

  public CreateProjectRequestDTO(String title, String description,
      List<DisciplineDTO> disciplines, List<ResearchPeriodDTO> researchPeriods,
      String desiredQualifications, List<UmbrellaTopicDTO> umbrellaTopics,
      boolean isActive) {
    this.title = title;
    this.description = description;
    this.disciplines = disciplines;
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

  public List<DisciplineDTO> getDisciplines() {
    return disciplines;
  }

  public void setDisciplines(List<DisciplineDTO> disciplines) {
    this.disciplines = disciplines;
  }

  public List<ResearchPeriodDTO> getResearchPeriods() {
    return researchPeriods;
  }

  public void setResearchPeriods(List<ResearchPeriodDTO> researchPeriods) {
    this.researchPeriods = researchPeriods;
  }

  public String getDesiredQualifications() {
    return desiredQualifications;
  }

  public void setDesiredQualifications(String desiredQualifications) {
    this.desiredQualifications = desiredQualifications;
  }

  public List<UmbrellaTopicDTO> getUmbrellaTopics() {
    return umbrellaTopics;
  }

  public void setUmbrellaTopics(List<UmbrellaTopicDTO> umbrellaTopics) {
    this.umbrellaTopics = umbrellaTopics;
  }

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    isActive = active;
  }
}
