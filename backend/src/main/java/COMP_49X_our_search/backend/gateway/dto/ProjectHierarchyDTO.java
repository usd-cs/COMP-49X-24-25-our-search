package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

// TODO(@acescudero): Unused, will leave in case we need to adjust the /projects response format.
public class ProjectHierarchyDTO {
  private List<DepartmentDTO> departments;

  public ProjectHierarchyDTO() {}

  public List<DepartmentDTO> getDepartments() {
    return this.departments;
  }

  public void setDepartments(List<DepartmentDTO> departments) {
    this.departments = departments;
  }
}
