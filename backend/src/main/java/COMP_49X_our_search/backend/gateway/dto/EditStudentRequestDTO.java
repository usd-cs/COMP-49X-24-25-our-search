package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class EditStudentRequestDTO {
  private int id;
  private String name;
  private String classStatus;
  private String graduationYear;
  private boolean hasPriorExperience;
  private boolean isActive;
  private String interestReason;
  private List<String> majors;
  private List<String> researchFieldInterests;
  private List<String> researchPeriodsInterest;

  public EditStudentRequestDTO() {}

  public EditStudentRequestDTO(
      String name,
      String classStatus,
      String graduationYear,
      boolean hasPriorExperience,
      boolean isActive,
      String interestReason,
      List<String> majors,
      List<String> researchFieldInterests,
      List<String> researchPeriodsInterest
  ) {
    this.name = name;
    this.classStatus = classStatus;
    this.graduationYear = graduationYear;
    this.hasPriorExperience = hasPriorExperience;
    this.isActive = isActive;
    this.interestReason = interestReason;
    this.majors = majors;
    this.researchFieldInterests = researchFieldInterests;
    this.researchPeriodsInterest = researchPeriodsInterest;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getClassStatus() {
    return classStatus;
  }

  public void setClassStatus(String classStatus) {
    this.classStatus = classStatus;
  }

  public String getGraduationYear() {
    return graduationYear;
  }

  public void setGraduationYear(String graduationYear) {
    this.graduationYear = graduationYear;
  }

  public boolean getHasPriorExperience() {
    return hasPriorExperience;
  }

  public void setHasPriorExperience(boolean hasPriorExperience) {
    this.hasPriorExperience = hasPriorExperience;
  }

  public boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(boolean isActive) {
    this.isActive = isActive;
  }

  public String getInterestReason() {
    return interestReason;
  }

  public void setInterestReason(String interestReason) {
    this.interestReason = interestReason;
  }

  public List<String> getMajors() {
    return majors;
  }

  public void setMajors(List<String> majors) {
    this.majors = majors;
  }

  public List<String> getResearchFieldInterests() {
    return researchFieldInterests;
  }

  public void setResearchFieldInterests(List<String> researchFieldInterests) {
    this.researchFieldInterests = researchFieldInterests;
  }

  public List<String> getResearchPeriodsInterest() {
    return researchPeriodsInterest;
  }

  public void setResearchPeriodsInterest(List<String> researchPeriodsInterest) {
    this.researchPeriodsInterest = researchPeriodsInterest;
  }

  public Integer getId() { return id;}

  public void setId(int id) { this.id= id; }
}
