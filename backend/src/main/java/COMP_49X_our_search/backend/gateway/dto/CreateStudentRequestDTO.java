package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class CreateStudentRequestDTO {

  private String name;
  private String classStatus;
  private String graduationYear;
  private boolean hasPriorExperience;
  private String interestReason;
  private List<String> major;
  private List<String> researchFieldInterests;
  private List<String> researchPeriodsInterest;

  public CreateStudentRequestDTO() {}

  public CreateStudentRequestDTO(
      String name,
      String classStatus,
      String graduationYear,
      boolean hasPriorExperience,
      String interestReason,
      List<String> major,
      List<String> researchFieldInterests,
      List<String> researchPeriodsInterest) {
    this.name = name;
    this.classStatus = classStatus;
    this.graduationYear = graduationYear;
    this.hasPriorExperience = hasPriorExperience;
    this.interestReason = interestReason;
    this.major = major;
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

  public String getInterestReason() {
    return interestReason;
  }

  public void setInterestReason(String interestReason) {
    this.interestReason = interestReason;
  }

  public List<String> getMajor() {
    return major;
  }

  public void setMajor(List<String> major) {
    this.major = major;
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
}
