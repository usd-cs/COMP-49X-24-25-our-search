package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class CreateMajorRequestDTO {

  private String name;
  private List<String> disciplines;

  public CreateMajorRequestDTO() {}

  public CreateMajorRequestDTO(String name, List<String> disciplines) {
    this.name = name;
    this.disciplines = disciplines;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<String> getDisciplines() {
    return disciplines;
  }

  public void setDisciplines(List<String> disciplines) {
    this.disciplines = disciplines;
  }
}
