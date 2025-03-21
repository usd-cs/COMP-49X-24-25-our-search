package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class EditFacultyRequestDTO {
  private String name;
  private List<String> department;

  public EditFacultyRequestDTO() {}

  public EditFacultyRequestDTO(String name, List<String> department) {
    this.name = name;
    this.department = department;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<String> getDepartment() {
    return department;
  }

  public void setDepartment(List<String> department) {
    this.department = department;
  }
}
