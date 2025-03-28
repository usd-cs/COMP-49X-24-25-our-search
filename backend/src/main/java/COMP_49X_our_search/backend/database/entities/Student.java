/**
 * Represents a student entity in the database mapped to the "students" table
 * and has multiple relationships with other entities.
 *
 * A student has a unique ID, first name, last name, email. undergraduate year,
 * graduation year, interest reason, prior experience status, active status.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students")
public class Student {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private Integer undergradYear;

  @Column(nullable = false)
  private Integer graduationYear;

  @Column(nullable = false, length = 500)
  private String interestReason;

  @Column(nullable = false)
  private Boolean hasPriorExperience;

  @Column(nullable = false)
  private Boolean isActive;

  @ManyToMany(cascade = {CascadeType.MERGE})
  @JoinTable(name = "students_disciplines",
      joinColumns = @JoinColumn(name = "student_id"),
      inverseJoinColumns = @JoinColumn(name = "discipline_id"))
  private Set<Discipline> disciplines = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "students_research_periods",
      joinColumns = @JoinColumn(name = "student_id"),
      inverseJoinColumns = @JoinColumn(name = "research_period_id"))
  private Set<ResearchPeriod> researchPeriods = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "students_majors",
      joinColumns = @JoinColumn(name = "student_id"),
      inverseJoinColumns = @JoinColumn(name = "major_id"))
  private Set<Major> majors = new HashSet<>();

  @ManyToMany
  @JoinTable(name = "students_research_field_interests",
      joinColumns = @JoinColumn(name = "student_id"),
      inverseJoinColumns = @JoinColumn(name = "major_id"))
  private Set<Major> researchFieldInterests = new HashSet<>();


  public Student() {}

  public Student(String firstName, String lastName, String email,
      Integer undergradYear, Integer graduationYear, String interestReason,
      Boolean hasPriorExperience) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.undergradYear = undergradYear;
    this.graduationYear = graduationYear;
    this.interestReason = interestReason;
    this.hasPriorExperience = hasPriorExperience;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
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

  public Integer getUndergradYear() {
    return undergradYear;
  }

  public void setUndergradYear(Integer undergradYear) {
    this.undergradYear = undergradYear;
  }

  public Integer getGraduationYear() {
    return graduationYear;
  }

  public void setGraduationYear(Integer graduationYear) {
    this.graduationYear = graduationYear;
  }

  public String getInterestReason() {
    return interestReason;
  }

  public void setInterestReason(String interestReason) {
    this.interestReason = interestReason;
  }

  public Boolean getHasPriorExperience() {
    return hasPriorExperience;
  }

  public void setHasPriorExperience(Boolean hasPriorExperience) {
    this.hasPriorExperience = hasPriorExperience;
  }

  public Set<Discipline> getDisciplines() {
    return disciplines;
  }

  public void setDisciplines(Set<Discipline> disciplines) {
    this.disciplines = disciplines;
  }

  public Set<ResearchPeriod> getResearchPeriods() {
    return researchPeriods;
  }

  public void setResearchPeriods(Set<ResearchPeriod> researchPeriods) {
    this.researchPeriods = researchPeriods;
  }

  public Set<Major> getMajors() {
    return majors;
  }

  public void setMajors(Set<Major> majors) {
    this.majors = majors;
  }

  public Set<Major> getResearchFieldInterests() {
    return researchFieldInterests;
  }

  public void setResearchFieldInterests(Set<Major> researchFieldInterests) {
    this.researchFieldInterests = researchFieldInterests;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean active) {
    isActive = active;
  }
}
