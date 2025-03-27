package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class EditMajorRequestDTO {

  private int id;
  private String name;
  private List<String> disciplines;

  public EditMajorRequestDTO() {}

  public EditMajorRequestDTO(int id, String name, List<String> disciplines) {
    this.id = id;
    this.name = name;
    this.disciplines = disciplines;
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

  public List<String> getDisciplines() {
    return disciplines;
  }

  public void setDisciplines(List<String> disciplines) {
    this.disciplines = disciplines;
  }
}
