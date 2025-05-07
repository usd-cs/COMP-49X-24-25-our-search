package COMP_49X_our_search.backend.gateway.dto;

public class AdminEmailDTO {
  private String email; // required for POST
  private int id; // required for DELETE

  public AdminEmailDTO() {}

  public AdminEmailDTO(String email, int id) {
    this.email = email;
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }
}
