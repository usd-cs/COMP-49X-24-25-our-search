package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
public class Project {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @ManyToOne
  @JoinColumn(name = "faculty_id")
  private Faculty faculty;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(columnDefinition = "TEXT")
  private String desiredQualifications;

  @Column(nullable = false)
  private Boolean isActive;

  @ManyToMany
  @JoinTable(name = "projects_departments",
      joinColumns = @JoinColumn(name = "project_id"),
      inverseJoinColumns = @JoinColumn(name = "department_id"))
  private Set<Department> departments = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "projects_research_periods",
      joinColumns = @JoinColumn(name = "project_id"),
      inverseJoinColumns = @JoinColumn(name = "research_period_id"))
  private Set<ResearchPeriod> researchPeriods = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "projects_umbrella_topics",
      joinColumns = @JoinColumn(name = "project_id"),
      inverseJoinColumns = @JoinColumn(name = "umbrella_topic_id"))
  private Set<UmbrellaTopic> umbrellaTopics = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "projects_majors",
      joinColumns = @JoinColumn(name = "project_id"),
      inverseJoinColumns = @JoinColumn(name = "major_id"))
  private Set<Major> majors = new HashSet<>();

  public Project() {}

  public Project(String name, Faculty faculty, String description,
      String desiredQualifications, Boolean isActive,
      Set<Department> departments, Set<Major> majors,
      Set<ResearchPeriod> researchPeriods, Set<UmbrellaTopic> umbrellaTopics) {
    this.name = name;
    this.faculty = faculty;
    this.description = description;
    this.desiredQualifications = desiredQualifications;
    this.isActive = isActive;
    this.departments = departments != null ? departments : new HashSet<>();
    this.majors = majors != null ? majors : new HashSet<>();
    this.researchPeriods =
        researchPeriods != null ? researchPeriods : new HashSet<>();
    this.umbrellaTopics =
        umbrellaTopics != null ? umbrellaTopics : new HashSet<>();
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Faculty getFaculty() {
    return faculty;
  }

  public void setFaculty(Faculty faculty) {
    this.faculty = faculty;
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

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }

  public Set<Department> getDepartments() {
    return departments;
  }

  public void setDepartments(Set<Department> departments) {
    this.departments = departments;
  }

  public Set<ResearchPeriod> getResearchPeriods() {
    return researchPeriods;
  }

  public void setResearchPeriods(Set<ResearchPeriod> researchPeriods) {
    this.researchPeriods = researchPeriods;
  }

  public Set<UmbrellaTopic> getUmbrellaTopics() {
    return umbrellaTopics;
  }

  public void setUmbrellaTopics(Set<UmbrellaTopic> umbrellaTopics) {
    this.umbrellaTopics = umbrellaTopics;
  }

  public Set<Major> getMajors() {
    return majors;
  }

  public void setMajors(Set<Major> majors) {
    this.majors = majors;
  }
}
