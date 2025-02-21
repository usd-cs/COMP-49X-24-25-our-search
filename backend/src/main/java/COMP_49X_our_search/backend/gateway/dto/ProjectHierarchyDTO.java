package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

// TODO(@acescudero): Unused, will leave in case we need to adjust the /projects
// response format.
public class ProjectHierarchyDTO {
  private List<DisciplineDTO> disciplines;

  public ProjectHierarchyDTO() {}

  public List<DisciplineDTO> getDisciplines() {
    return this.disciplines;
  }

  public void setDisciplines(List<DisciplineDTO> disciplines) {
    this.disciplines = disciplines;
  }
}
