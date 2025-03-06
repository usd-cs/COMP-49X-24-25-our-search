package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class FacultyProfileDTO {
  private String firstName;
  private String lastName;
  private String email;
  private List<DepartmentDTO> department;
  private List<ProjectDTO> projects;

  public FacultyProfileDTO() {}

  public FacultyProfileDTO(
      String firstName,
      String lastName,
      String email,
      List<DepartmentDTO> department,
      List<ProjectDTO> projects) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.department = department;
    this.projects = projects;
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

  public List<DepartmentDTO> getDepartment() {
    return department;
  }

  public void setDepartment(List<DepartmentDTO> department) {
    this.department = department;
  }

  public List<ProjectDTO> getProjects() {
    return projects;
  }

  public void setProjects(List<ProjectDTO> projects) {
    this.projects = projects;
  }
}
