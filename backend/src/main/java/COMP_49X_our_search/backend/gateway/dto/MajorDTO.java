package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class MajorDTO {
  private int id;
  private String name;
  private List<ProjectDTO> posts;

  public MajorDTO() {}

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

  public List<ProjectDTO> getPosts() {
    return this.posts;
  }

  public void setPosts(List<ProjectDTO> posts) {
    this.posts = posts;
  }
}
