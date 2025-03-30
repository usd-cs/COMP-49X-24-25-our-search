package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class FacultyDTO {
  private int id;
  private String firstName;
  private String lastName;
  private String email;
  private List<String> department;
  private List<ProjectDTO> projects;

  public FacultyDTO() {}

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

  public List<String> getDepartment() {
    return department;
  }

  public void setDepartment(List<String> department) {
    this.department = department;
  }

  public List<ProjectDTO> getProjects() {
    return projects;
  }

  public void setProjects(List<ProjectDTO> projects) {
    this.projects = projects;
  }
}
