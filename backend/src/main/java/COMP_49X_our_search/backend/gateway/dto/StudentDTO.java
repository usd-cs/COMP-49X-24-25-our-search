package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class StudentDTO {
  private int id;
  private String firstName;
  private String lastName;
  private String email;
  private String classStatus;
  private Integer graduationYear;
  private List<String> majors;
  private List<String> researchFieldInterests;
  private List<String> researchPeriodsInterest;
  private String interestReason;
  private boolean hasPriorExperience;
  private boolean isActive;

  public StudentDTO() {}

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getClassStatus() {
    return classStatus;
  }

  public void setClassStatus(String classStatus) {
    this.classStatus = classStatus;
  }

  public Integer getGraduationYear() {
    return graduationYear;
  }

  public void setGraduationYear(Integer graduationYear) {
    this.graduationYear = graduationYear;
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

  public String getInterestReason() {
    return interestReason;
  }

  public void setInterestReason(String interestReason) {
    this.interestReason = interestReason;
  }

  public boolean isHasPriorExperience() {
    return hasPriorExperience;
  }

  public void setHasPriorExperience(boolean hasPriorExperience) {
    this.hasPriorExperience = hasPriorExperience;
  }

  public boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(boolean active) {
    this.isActive = active;
  }
}
