package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

// TODO(acescudero): Rename this classed since it's now being used for both
//  project creation and project editing.
public class CreateProjectRequestDTO {

  private int id;
  private String title;
  private String description;
  private List<DisciplineDTO> disciplines;
  private List<ResearchPeriodDTO> researchPeriods;
  private String desiredQualifications;
  private List<UmbrellaTopicDTO> umbrellaTopics;
  private boolean isActive;

  public CreateProjectRequestDTO() {}

  public CreateProjectRequestDTO(int id, String title, String description,
      List<DisciplineDTO> disciplines, List<ResearchPeriodDTO> researchPeriods,
      String desiredQualifications, List<UmbrellaTopicDTO> umbrellaTopics,
      boolean isActive) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.disciplines = disciplines;
    this.researchPeriods = researchPeriods;
    this.desiredQualifications = desiredQualifications;
    this.umbrellaTopics = umbrellaTopics;
    this.isActive = isActive;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
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

  public boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(boolean active) {
    isActive = active;
  }
}
