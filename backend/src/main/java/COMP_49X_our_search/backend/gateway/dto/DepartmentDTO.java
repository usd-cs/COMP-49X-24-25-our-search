package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class DepartmentDTO {

  private int id;
  private String name;
  private List<MajorDTO> majors;

  public DepartmentDTO() {}

  public DepartmentDTO(int id, String name, List<MajorDTO> majors) {
    this.id = id;
    this.name = name;
    this.majors = majors;
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
