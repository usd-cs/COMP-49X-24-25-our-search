package COMP_49X_our_search.backend.gateway.dto;

public class DepartmentDTO {
  private String name;

  public DepartmentDTO(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
