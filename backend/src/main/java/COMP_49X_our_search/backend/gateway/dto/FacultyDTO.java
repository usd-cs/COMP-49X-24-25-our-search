package COMP_49X_our_search.backend.gateway.dto;

public class FacultyDTO {
  private String first_name;
  private String last_name;
  private String email;

  public FacultyDTO() {}

  public String getFirst_name() {
    return first_name;
  }

  public void setFirst_name(String first_name) {
    this.first_name = first_name;
  }

  public String getLast_name() {
    return last_name;
  }

  public void setLast_name(String last_name) {
    this.last_name = last_name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
