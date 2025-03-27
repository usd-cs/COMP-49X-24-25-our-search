package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class EditFacultyRequestDTO {
  private int id;
  private String name;
  private String email;
  private List<String> department;

  public EditFacultyRequestDTO() {}

  public EditFacultyRequestDTO(int id, String name, String email, List<String> department) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.department = department;
  }

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
}
