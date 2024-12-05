package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class ProjectDTO {
  private int id;
  private String name;
  private String description;
  private String desired_qualifications;
  private List<String> umbrella_topics;
  private List<String> research_periods;
  private boolean is_active;
  private List<String> majors;
  private FacultyDTO faculty;

  public ProjectDTO() {}

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

  public String getDesired_qualifications() {
    return desired_qualifications;
  }

  public void setDesired_qualifications(String desired_qualifications) {
    this.desired_qualifications = desired_qualifications;
  }

  public List<String> getUmbrella_topics() {
    return umbrella_topics;
  }

  public void setUmbrella_topics(List<String> umbrella_topics) {
    this.umbrella_topics = umbrella_topics;
  }

  public List<String> getResearch_periods() {
    return research_periods;
  }

  public void setResearch_periods(List<String> research_periods) {
    this.research_periods = research_periods;
  }

  public boolean getIs_active() {
    return is_active;
  }

  public void setIs_active(boolean is_active) {
    this.is_active = is_active;
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
