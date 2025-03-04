package COMP_49X_our_search.backend.gateway.dto;

import java.util.List;

public class MajorDTO {
  private int id;
  private String name;
  private List<Object> posts;

  public MajorDTO() {}

  public MajorDTO(int id, String name, List<Object> posts) {
    this.id = id;
    this.name = name;
    this.posts = posts;
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

  public List<Object> getPosts() {
    return this.posts;
  }

  public void setPosts(List<Object> posts) {
    this.posts = posts;
  }

}
