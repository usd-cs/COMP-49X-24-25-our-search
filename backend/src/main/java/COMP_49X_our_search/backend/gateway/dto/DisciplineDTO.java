package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class DisciplineDTO {

  private int id;
  private String name;
  private List<MajorDTO> majors;

  public DisciplineDTO() {}

  public DisciplineDTO(int id, String name) {
    this.id = id;
    this.name = name;
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

  public List<MajorDTO> getMajors() {
    return this.majors;
  }

  public void setMajors(List<MajorDTO> majors) {
    this.majors = majors;
  }
}
